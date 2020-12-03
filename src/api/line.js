import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Plines',
    method: 'get',
    params: query
  })
}

export function getProductList(query) {
  return request({
    url: '/api/Goods',
    method: 'get',
    params: query
  })
}

export function createLine(data) {
  return request({
    url: '/api/Plines',
    method: 'post',
    data
  })
}

export function updateLine(data) {
  return request({
    url: '/api/Plines',
    method: 'put',
    data
  })
}

export function deleteLine(query) {
  return request({
    url: '/api/Plines/' + query,
    method: 'delete'
  })
}

