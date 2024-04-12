import request from '@/utils/request'
var group_name = '/statistics/workload'

// 查询工作量统计统计
export function getWorkloadList(params) {
  return request({
    url: `${group_name}/getWorkloadList`,
    method: 'get',
    params: params
  })
}
// 查询工作量统计统计汇总
export function getWorkloadStatCollectList(params) {
  return request({
    url: `${group_name}/getWorkloadStatCollectList`,
    method: 'get',
    params: params
  })
}
