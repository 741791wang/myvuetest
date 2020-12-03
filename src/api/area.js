import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Plots',
    method: 'get',
    params: query
  })
}
export function getMatieral() {
  return request({
    url: '/api/Material/GetMaterialsName',
    method: 'get'
  })
}

export function createArea(data) {
  return request({
    url: '/api/Plots',
    method: 'post',
    data
  })
}

export function updateArea(data) {
  return request({
    url: '/api/Plots',
    method: 'put',
    data
  })
}

export function deleteArea(query) {
  return request({
    url: '/api/Plots/' + query,
    method: 'delete'
  })
}
