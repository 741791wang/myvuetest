import request from '@/utils/request'

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

export function getOutputList(data) {
  return request({
    url: '/api/Report/GetCltjbList',
    method: 'post',
    data
  })
}

export function getOutputChrat(data) {
  return request({
    url: '/api/Report/GetCltjbData',
    method: 'post',
    data
  })
}
