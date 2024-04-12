import request from '@/utils/request'
var group_name = '/statistics/check'

// 查询检查项销售统计
export function getCheckList(params) {
  return request({
    url: `${group_name}/getCheckList`,
    method: 'get',
    params: params
  })
}
// 查询检查项销售统计汇总
export function getCheckStatCollectList(params) {
  return request({
    url: `${group_name}/getCheckStatCollectList`,
    method: 'get',
    params: params
  })
}
