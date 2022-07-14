import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 时间戳
const TimeKey = 'jiujiu_item_key'
// 存时间戳
export function setTime (time) {
  return Cookies.set(TimeKey, time)
}
// 取时间戳
export function getTime () {
  return Cookies.get(TimeKey)
}
