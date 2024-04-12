import request from '@/utils/request'
var group_name = '/check/checkResult'
// 有挂号单话，根据挂号单查询已支付的检查项列表。没有的话，查询所有已支付的检查项列表
export function getPaidCheckItemList(checkResultDto) {
  return request({
    url: `${group_name}/getPaidCheckItemList`,
    method: 'post',
    data: checkResultDto
  })
}
// 根据详情Id查询处方详情信息、处方信息、病历信息
export function getCareHistoryAndCareOrderAndCareOrderItemByItemId(itemId) {
  return request({
    url: `${group_name}/getCareHistoryAndCareOrderAndCareOrderItemByItemId/${itemId}`,
    method: 'get'
  })
}
// 开始检查
export function startCheck(itemId) {
  return request({
    url: `${group_name}/startCheck/${itemId}`,
    method: 'get'
  })
}
// 分页查询检查中的项目
export function getCheckingResultForPage(checkResultDto) {
  return request({
    url: `${group_name}/getCheckingResultForPage`,
    method: 'post',
    data: checkResultDto
  })
}
// 完成检查并上传结果
export function completeCheckResult(checkResultFormDto) {
  return request({
    url: `${group_name}/completeCheckResult`,
    method: 'post',
    data: checkResultFormDto
  })
}
// 分页查询参与检查的项目
export function getCheckResultForPage(checkResultDto) {
  return request({
    url: `${group_name}/getCheckResultForPage`,
    method: 'post',
    data: checkResultDto
  })
}
