import request from '@/utils/request'

export function getMaterialList() {
  return request({
    url: '/api/Material/GetMaterialsName',
    method: 'get'
  })
}
