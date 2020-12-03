import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Picks',
    method: 'get',
    params: query
  })
}
