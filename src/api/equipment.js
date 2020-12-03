import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/GetDeviceInfo',
    method: 'get',
    params: query
  })
}
