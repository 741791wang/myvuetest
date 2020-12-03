import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Materials',
    method: 'get',
    params: query
  })
}

export function deleteR(query) {
  return request({
    url: '/api/Materials/' + query,
    method: 'delete'
  })
}

export function createR(data) {
  return request({
    url: '/api/Materials',
    method: 'post',
    data
  })
}

export function updateR(data) {
  return request({
    url: '/api/Materials',
    method: 'put',
    data
  })
}
