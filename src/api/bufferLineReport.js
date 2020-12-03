import request from '@/utils/request'

export function getMaterialList() {
  return request({
    url: '/api/Material/GetMaterialsName',
    method: 'get'
  })
}

export function getTabeleList(data) {
  return request({
    url: '/api/Report/GetHcxssbList',
    method: 'post',
    data
  })
}

export function getChartList(data) {
  return request({
    url: '/api/Report/GetHcxssbData',
    method: 'post',
    data
  })
}
