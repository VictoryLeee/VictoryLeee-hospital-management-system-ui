import request from '@/utils/request'
var group_name = '/charge/orderCharge'
// 根据挂号单查询未支付的病历信息和处方信息和处方详情信息
export function getNoChargeRegistrationAndCareHistoryAndCareOrderDataByRegId(regId) {
  return request({
    url: `${group_name}/getNoChargeRegistrationAndCareHistoryAndCareOrderDataByRegId/${regId}`,
    method: 'get'
  })
}
// 创建收费订单并现金支付
export function addOrderChargeWithCash(orderChargeFromDto) {
  return request({
    url: `${group_name}/addOrderChargeWithCash`,
    method: 'post',
    data: orderChargeFromDto
  })
}
// 创建收费订单并支付宝支付
export function addOrderChargeWithZFB(orderChargeFromDto) {
  return request({
    url: `${group_name}/addOrderChargeWithZFB/`,
    method: 'post',
    data: orderChargeFromDto
  })
}
// 根据订单ID查询订单信息【验证是否支付成功】
export function getOrderChargeByOrderId(orderId) {
  return request({
    url: `${group_name}/getOrderChargeByOrderId/${orderId}`,
    method: 'get'
  })
}
// 分页查询所有订单信息
export function getOrderChargeForPage(orderChargeDto) {
  return request({
    url: `${group_name}/getOrderChargeForPage`,
    method: 'get',
    params: orderChargeDto
  })
}
// 根据订单信息ID查询订单详情列表
export function getOrderChargeItemByOrderId(orderId) {
  return request({
    url: `${group_name}/getOrderChargeItemByOrderId/${orderId}`,
    method: 'get'
  })
}
// 创建好订单后，没有进行现金支付，在订单列表里使用
export function payWithCash(orderId) {
  return request({
    url: `${group_name}/payWithCash/${orderId}`,
    method: 'get'
  })
}
// 在订单列表里，再次进行支付宝支付  原因只是下了订单还没进行支付宝支付
export function toPayOrderWithZFB(orderId) {
  return request({
    url: `${group_name}/toPayOrderWithZFB/${orderId}`,
    method: 'get'
  })
}
