import request from '@/utils/request'
var group_name = '/charge/sendMedicines'
// 根据挂号单查询已支付的病历信息和处方信息和药品详情信息
export function getChargeRegistrationAndCareHistoryAndCareOrderDataInMedicinesByRegId(regId) {
  return request({
    url: `${group_name}/getChargeRegistrationAndCareHistoryAndCareOrderDataInMedicinesByRegId/${regId}`,
    method: 'get'
  })
}
// 发药
export function doMedicine(itemIds) {
  return request({
    url: `${group_name}/doMedicine`,
    method: 'post',
    data: itemIds
  })
}
