import request from '@/utils/request'
var group_name = '/statistics/drug'

// 查询发药统计非汇总列表
export function getDrugList(params) {
  return request({
    url: `${group_name}/getDrugList`,
    method: 'get',
    params: params
  })
}
// 查询发药统计汇总列表
export function getDrugStatCollectList(params) {
  return request({
    url: `${group_name}/getDrugStatCollectList`,
    method: 'get',
    params: params
  })
}
