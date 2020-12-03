import request from '@/utils/request'

export function getMaterialList() {
  return request({
    url: '/api/Material/GetMaterialsName',
    method: 'get'
  })
}

export function getLine() {
  return request({
    url: '/api/Plines/GetPlineName',
    method: 'get'
  })
}

export function getTableList(data) {
  return request({
    url: '/api/Report/GetTrccbtjbList',
    method: 'post',
    data
  })
}

export function getChartList(data) {
  return request({
    url: '/api/Report/GetTrccbtjbData',
    method: 'post',
    data
  })
}

export function getProductList() {
  return request({
    url: '/api/Goods/GetGoodsName',
    method: 'get'
  })
}
