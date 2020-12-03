import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/Report/GetCzltjbList',
    method: 'post',
    data
  })
}

export function getMaterialList() {
  return request({
    url: '/api/Material/GetMaterialsName',
    method: 'get'
  })
}

export function getAreaList() {
  return request({
    url: '/api/Plots/GetPlotsName',
    method: 'get'
  })
}

export function getEchartDataTest(data) {
  return request({
    url: '/api/Report/GetCzltjbData',
    method: 'post',
    data
  })
}
