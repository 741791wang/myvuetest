import request from '@/utils/request'

export function getMaterialList() {
  return request({
    url: '/api/Material/GetMaterialsName',
    method: 'get'
  })
}

export function getFeedList(data) {
  return request({
    url: '/api/Report/GetTlltjbList',
    method: 'post',
    data
  })
}

export function getFeedCount(data) {
  return request({
    url: '/api/Report/GetTlltjbListData',
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
