import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/SpotChecks',
    method: 'get',
    params: query
  })
}

export function deleteList(query) {
  return request({
    url: '/api/SpotChecks/' + query,
    method: 'delete'
  })
}

export function getProduct() {
  return request({
    url: '/api/Goods/GetGoodsName',
    method: 'get'
  })
}

export function getLine() {
  return request({
    url: '/api/Plines/GetPlineName',
    method: 'get'
  })
}

export function createRecord(data) {
  return request({
    url: '/api/SpotChecks',
    method: 'post',
    data
  })
}

export function updateRecord(data) {
  return request({
    url: '/api/SpotChecks',
    method: 'put',
    data
  })
}
