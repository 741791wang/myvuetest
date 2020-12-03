import request from '@/utils/request'

export function getList(query) {
  return request({
    url: 'http://localhost:9109/api/ioc/equip',
    method: 'get',
    params: query
  })
}

export function deleteList(query) {
  return request({
    url: 'http://localhost:9109/api/ioc/delete',
    method: 'delete',
    params: query
  })
}
