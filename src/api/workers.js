import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Employees',
    method: 'get',
    params: query
  })
}

export function getSpace() {
  return request({
    url: '/api/Stations/GetStationsName',
    method: 'get'
  })
}

export function getUnits() {
  return request({
    url: '/api/GetUnitsName',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/api/Employees',
    method: 'put',
    data
  })
}

export function create(data) {
  return request({
    url: '/api/Employees',
    method: 'post',
    data
  })
}

export function deleteWorker(query) {
  return request({
    url: '/api/Employees/' + query,
    method: 'delete'
  })
}
