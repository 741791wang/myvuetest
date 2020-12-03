import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Goods',
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

export function createProduct(data) {
  return request({
    url: '/api/Goods',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/api/Goods',
    method: 'put',
    data
  })
}

export function deleteProduct(query) {
  return request({
    url: '/api/Goods/' + query,
    method: 'delete'
  })
}
