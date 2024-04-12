import request from '@/utils/request'
var group_name = '/statistics/revenue'

// 查询收支统计数据 总收支、收支概况、收入渠道、支出渠道
export function getRevenueData(params) {
  return request({
    url: `${group_name}/getRevenueData`,
    method: 'get',
    params: params
  })
}
