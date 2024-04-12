import request from '@/utils/request'
var group_name = '/charge/backfee'
// 根据挂号单查询已支付的病历信息和处方信息和处方详情信息
export function getChargeRegistrationAndCareHistoryAndCareOrderDataByRegId(regId) {
  return request({
    url: `${group_name}/getChargeRegistrationAndCareHistoryAndCareOrderDataByRegId/${regId}`,
    method: 'get'
  })
}
// 创建现金退费订单
export function addOrderBackfeeWithCash(orderBackfeeFormDto) {
  return request({
    url: `${group_name}/addOrderBackfeeWithCash`,
    method: 'post',
    data: orderBackfeeFormDto
  })
}
// 创建支付宝退费订单
export function addOrderBackfeeWithZFB(orderBackfeeFormDto) {
  return request({
    url: `${group_name}/addOrderBackfeeWithZFB`,
    method: 'post',
    data: orderBackfeeFormDto
  })
}
// 根据退费订单ID查询退费订单
export function getOrderBackfeeByBackId(backId) {
  return request({
    url: `${group_name}/getOrderBackfeeByBackId/${backId}`,
    method: 'get'
  })
}
// 分页查询所有退费订单
export function getOrderBackForPage(orderChargeDto) {
  return request({
    url: `${group_name}/getOrderBackForPage`,
    method: 'get',
    params: orderChargeDto
  })
}
// 根据退费单ID查询退费详情列表
export function getOrderBackfeeItemListByBackId(backId) {
  return request({
    url: `${group_name}/getOrderBackfeeItemListByBackId/${backId}`,
    method: 'get'
  })
}
