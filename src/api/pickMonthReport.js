import request from '@/utils/request'

export function getAreaList() {
  return request({
    url: '/api/Plots/GetPlotsName',
    method: 'get'
  })
}

export function getTableList(data) {
  return request({
    url: '/api/Report/GetCzrtjbList',
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
