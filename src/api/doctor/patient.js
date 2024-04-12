import request from '@/utils/request'
var group_name = '/doctor/patient/'
// 分页查询
export function listPatientForPage(params) {
  return request({
    url: `${group_name}/listPatientForPage`,
    method: 'get',
    params: params
  })
}
// 根据患者ID查询患者信息
export function getPatientById(patientId) {
  return request({
    url: `${group_name}/getPatientById/${patientId}`,
    method: 'get'
  })
}
// 根据患者ID查询患者档案信息
export function getPatientFileById(patientId) {
  return request({
    url: `${group_name}/getPatientFileById/${patientId}`,
    method: 'get'
  })
}
// 根据患者id查询患者信息、患者病历信息、处方信息和处方详情列表
export function getCareHistoryAndCareOrderAndCareOrderItemByPatientId(patientId) {
  return request({
    url: `${group_name}/getCareHistoryAndCareOrderAndCareOrderItemByPatientId/${patientId}`,
    method: 'get'
  })
}
