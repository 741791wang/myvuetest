import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/FeedWeights',
    method: 'get',
    params: query
  })
}
