import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/Stations',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/api/Stations',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/api/Stations',
    method: 'put',
    data
  })
}

export function deleteW(query) {
  return request({
    url: '/api/Stations/' + query,
    method: 'delete'
  })
}
