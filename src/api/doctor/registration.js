import request from '@/utils/request'
var group_name = '/doctor/registration'
// 根据部门id或值班日期或值班类型以及上下晚类型，查询部门集合
export function listDeptForScheduling(params) {
  return request({
    url: `${group_name}/listDeptForScheduling`,
    method: 'get',
    params: params
  })
}
// 根据患者身份证号码查询患者信息
export function getPatientByIdCard(idCard) {
  return request({
    url: `${group_name}/getPatientByIdCard/${idCard}`,
    method: 'get'
  })
}
// 添加挂号信息
export function addRegistration(regFormDto) {
  return request({
    url: `${group_name}/addRegistration`,
    method: 'post',
    data: regFormDto
  })
}
// 修改挂号单状态为收费
export function collectFee(regId) {
  return request({
    url: `${group_name}/collectFee/${regId}`,
    method: 'get'
  })
}
// 分页查询挂号信息
export function getRegForPage(regDto) {
  return request({
    url: `${group_name}/getRegForPage`,
    method: 'get',
    params: regDto
  })
}
// 根据挂号单号修改单据状态为作废
export function doInvalid(regId) {
  return request({
    url: `${group_name}/doInvalid/${regId}`,
    method: 'get'
  })
}
// 根据挂号单号修改单据状态为退号
export function doReturn(regId) {
  return request({
    url: `${group_name}/doReturn/${regId}`,
    method: 'get'
  })
}
// 根据挂号单号修改单据状态为未收费状态  反作废
export function noInvalid(regId) {
  return request({
    url: `${group_name}/noInvalid/${regId}`,
    method: 'get'
  })
}
// 根据挂号单号修改单据状态为未收费状态  删除
export function deleteById(regId) {
  return request({
    url: `${group_name}/deleteById/${regId}`,
    method: 'delete'
  })
}
// 根据挂号单号查询挂号信息
export function getRegistrationByRegId(regId) {
  return request({
    url: `${group_name}/getRegistrationByRegId/${regId}`,
    method: 'get'
  })
}
