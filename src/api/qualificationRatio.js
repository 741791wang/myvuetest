import request from '@/utils/request'

export function getTableList(data) {
  return request({
    url: '/api/Report/GetCphglbList',
    method: 'post',
    data
  })
}

export function getChartList(data) {
  return request({
    url: '/api/Report/GetCphglbData',
    method: 'post',
    data
  })
}

export function getLine() {
  return request({
    url: '/api/Plines/GetPlineName',
    method: 'get'
  })
}

export function getProductList() {
  return request({
    url: '/api/Goods/GetGoodsName',
    method: 'get'
  })
}
