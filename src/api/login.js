import request from '@/utils/request'

export function login(loginname, password) {
  return request({
    url: '/admin/admin/login',
    method: 'post',
    data: {
      loginname,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
