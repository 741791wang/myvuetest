import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Devices',
    method: 'get',
    params: query
  })
}

export function createEquip(data) {
  return request({
    url: '/api/Devices',
    method: 'post',
    data
  })
}

export function deleteEquip(query) {
  return request({
    url: '/api/Devices/' + query,
    method: 'delete'
  })
}

export function updateEquip(data) {
  return request({
    url: '/api/Devices',
    method: 'put',
    data
  })
}

export function getLine() {
  return request({
    url: '/api/Plines/GetPlineName',
    method: 'get'
  })
}

export function getSatation() {
  return request({
    url: '/api/Stations/GetStationsName',
    method: 'get'
  })
}
