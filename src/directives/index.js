
export const imgerror = {
  update (el, binding) {
    // el.src = binding.value
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
