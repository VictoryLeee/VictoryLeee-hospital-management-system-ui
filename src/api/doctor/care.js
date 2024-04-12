import request from '@/utils/request'
var group_name = '/doctor/care'
// 根据科室ID和当前时段和挂号类型（待就诊）和排班类型查询挂号信息列表 [查询待就诊的挂号列表]
export function getWaitingForTreatmentRegistration(schedulingType) {
  return request({
    url: `${group_name}/getWaitingForTreatmentRegistration/${schedulingType}`,
    method: 'get'
  })
}
// 根据科室ID和当前用户ID和挂号类型（就诊中）和排班类型查询挂号信息列表 [查询就诊中的挂号列表]
export function getVisitingRegistration(schedulingType) {
  return request({
    url: `${group_name}/getVisitingRegistration/${schedulingType}`,
    method: 'get'
  })
}
// 根据科室ID和当前用户ID和挂号类型（就诊完成）和排班类型查询挂号信息列表 [查询就诊完成的挂号列表]
export function getVisitCompletedRegistration(schedulingType) {
  return request({
    url: `${group_name}/getVisitCompletedRegistration/${schedulingType}`,
    method: 'get'
  })
}
// 将挂号单的状态改为就诊中
export function receivePatient(regId) {
  return request({
    url: `${group_name}/receivePatient/${regId}`,
    method: 'post'
  })
}
// 根据患者ID查询患者信息、患者档案、患者病历信息列表、当前病历信息
export function getPatientIdByPatientAndPatientFileAndCareHistoryList(patientId) {
  return request({
    url: `${group_name}/getPatientIdByPatientAndPatientFileAndCareHistoryList/${patientId}`,
    method: 'post'
  })
}
// 根据挂号单id查询病历信息
export function getCareHistoryByRegistrationId(regId) {
  return request({
    url: `${group_name}/getCareHistoryByRegistrationId/${regId}`,
    method: 'get'
  })
}
// 保存病历信息
export function saveCareHistory(careHistoryDto) {
  return request({
    url: `${group_name}/saveCareHistory`,
    method: 'post',
    data: careHistoryDto
  })
}
// 根据病历单Id查询处方信息以及详情信息
export function getCareOrderAndCareOrderItemByCareHistoryId(careHistoryId) {
  return request({
    url: `${group_name}/getCareOrderAndCareOrderItemByCareHistoryId/${careHistoryId}`,
    method: 'get'
  })
}
// 保存处方和处方详情信息
export function saveCareOrderAndCareOrderItem(careOrderFormDto) {
  return request({
    url: `${group_name}/saveCareOrderItem`,
    method: 'post',
    data: careOrderFormDto
  })
}
// 根据处方详情ID删除处方详情【只能删除未支付的】
export function deleteCareOrderItemById(itemId) {
  return request({
    url: `${group_name}/deleteCareOrderItemById/${itemId}`,
    method: 'delete'
  })
}
// 更新挂号单的状态为就诊完成
export function visitComplete(regId) {
  return request({
    url: `${group_name}/visitComplete/${regId}`,
    method: 'get'
  })
}
