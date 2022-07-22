<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      size="mini"
      @click="
        roleDialogVisble = true;
        isEdit = false;
        form = {};
      "
      >添加角色</el-button
    >
    <!-- 表格 -->
    <el-table :data="roleList" stripe border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="name" label="角色" sortable width="160px">
      </el-table-column>
      <el-table-column prop="description" label="描述" sortable>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRigghtDialog(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="shoeRoleDialog(scope.row)"
            >修改</el-button
          >
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 栅格对齐方式 -->
    <el-row type="flex" justify="end">
      <!-- 分页 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-size="paramsObj.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightVisble">
      <el-tree
        v-if="rightVisble"
        ref="myTree"
        :data="permissions"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="selectedPermissions"
      ></el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="rightVisble = false">取 消</el-button>
      </template>
    </el-dialog>
    <!-- 新增和编辑 -->
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="roleDialogVisble"
      @close="reset"
    >
      <el-form ref="myForm" label-width="80px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确 定</el-button>
        <el-button @click="roleDialogVisble = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 页码
        pagesize: 5 // 每页数量
      },
      roleList: [], // 列表数据
      total: null, // 分页总数
      rightVisble: false, // 分配权限
      permissions: [], // 权限
      selectedPermissions: [], // 默认选中的权限
      id: null, // 当前选中的id
      roleDialogVisble: false, // 新增和编辑
      form: { // 新增
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false // 新增或编辑
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList() // 获取列表
  },
  methods: {
    // 获取角色列表接口
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      this.roleList = res.rows
      this.total = res.total // 用于分页
    },
    handleSizeChange (val) { // 每页条数改变时
      this.paramsObj.pagesize = val
      this.getRoleList()
    },
    handleCurrentChange (val) { // 页码改变时
      this.paramsObj.page = val
      this.getRoleList()
    },
    // 删除
    del (id) {
      this.$confirm('确定删除此角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        // 删除当前这一页最后一项就应该跑到上一页
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        } this.getRoleList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    //! 分配权限
    async showRigghtDialog (id) {
      this.id = id
      this.rightVisble = true
      const res = await getPermissions() // 获取所有的权限
      this.permissions = tranferListToTree(res, '0') // 数据转换为树形结构
      const res1 = await getPermissionsById(id) // 获取当前的权限
      this.selectedPermissions = res1.permIds
    },
    // 分配权限确认
    async save () {
      // this.$refs.myTree.getCheckedKeys() 被选中的权限
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.rightVisble = false
    },
    //! 编辑和新增
    onClick () {
      // 二次校验
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('表单校验失败，请重新输入')
        if (this.isEdit) { // 编辑
          await editRole(this.form)
        } else { // 添加
          await addRole(this.form)
        }
        this.getRoleList()
        this.roleDialogVisble = false
      })
    },
    reset () { // 新增表单重置
      this.$refs.myForm.resetFields()
    },
    shoeRoleDialog (row) { // 编辑
      this.isEdit = true
      this.roleDialogVisble = true
      this.form = { ...row } // 浅拷贝
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
