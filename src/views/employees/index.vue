<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="孤独万岁">
        <template #right>
          <el-button size="mini" type="danger" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button size="mini" type="info" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <el-button
            size="mini"
            type="success"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button size="mini" type="primary">新增员工</el-button>
        </template>
      </PageTool>
      <el-card style="margin-top: 14px">
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img v-imgerror :src="scope.row.staffPhoto" style="width: 60px" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <!-- formatter表格格式化数据格式 -->
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployee"
          ></el-table-column>
          <!-- formatFormType--filters-过滤器格式化数据格式 -->
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateformat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <!-- 状态只读 -->
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350px" align="center">
            <template>
              <el-button type="text">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text">角色</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployee } from '@/api/employee'
import employees from '@/constant/employees'
export default {
  filters: {
    // 过滤器格式化数据格式
    formatFormType (id) {
      return employees.hireType.find(item => item.id === id).value
    }
  },
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        size: 5
      },
      employees: [],
      total: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    // 获取员工列表
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      console.log(res)
      this.employees = res.rows
      this.total = res.total
    },
    // formatter表格格式化数据格式
    formatterEmployee (row, cloumn, cellValue, index) {
      return employees.hireType.find(item => item.id === cellValue).value
    },
    //! 普通excel导出
    async exportExcel () {
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['编号', '姓名']
        // const data = [[1, '张三'], [2, '李四']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 复杂表头导出
    exportExcel1 () {
      const multiHeader = [['', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
img {
  border-radius: 50px;
  width: 60px;
  height: 60px;
}
</style>
