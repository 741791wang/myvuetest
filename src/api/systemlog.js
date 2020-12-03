import request from '@/utils/request'
import download from '@/utils/dowload'

export function getList(query) {
  return request({
    url: 'api/Logs/GetLogfileNameList',
    method: 'get',
    params: query
  })
}

export function downfile(query) {
  return download({
    url: 'api/Logs/GetLogFile',
    method: 'get',
    params: query
  })
}
