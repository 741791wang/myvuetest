import request from '@/utils/request'

export function login(data) {
  return request({
    // url: 'http://localhost:9109/api/ioc/login',
    url: '/api/SystemUsers/LoginToSerevr',
    method: 'post',
    data
  })
}

export function getInfo(query) {
  return request({
    // url: 'http://localhost:9109/api/ioc/info',
    url: '/api/SystemUsers/GetUserInfo',
    method: 'get',
    params: query
  })
}

export function logout() {
  return request({
    url: '/api/SystemUsers/QuitLogin',
    method: 'post'
  })
}
