import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/DTCReceives',
    method: 'get',
    params: query
  })
}
