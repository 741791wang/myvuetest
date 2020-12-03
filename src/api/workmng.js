import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/SignInOut',
    method: 'get',
    params: query
  })
}
