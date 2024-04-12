import request from '@/utils/request'
var group_name = '/erp/medicines/'
// 分页查询
export function listMedicinesForPage(query) {
  return request({
    url: `${group_name}/listMedicinesForPage`,
    method: 'get',
    params: query
  })
}
// 添加药品信息
export function addMedicines(data) {
  return request({
    url: `${group_name}/addMedicines`,
    method: 'post',
    params: data
  })
}
// 修改药品信息
export function updateMedicines(data) {
  return request({
    url: `${group_name}/updateMedicines`,
    method: 'put',
    params: data
  })
}
// 修改药品库存数量
export function updateMedicinesStorage(medicinesId, medicinesStockNum) {
  return request({
    url: `${group_name}/updateMedicinesStorage/${medicinesId}/${medicinesStockNum}`,
    method: 'put'
  })
}
// 根据id查询
export function getById(id) {
  return request({
    url: `${group_name}/getById/${id}`,
    method: 'get'
  })
}
// 根据ids删除
export function deleteMedicinesByIds(ids) {
  return request({
    url: `${group_name}/deleteMedicinesByIds/${ids}`,
    method: 'delete'
  })
}
// 查询所有可用
export function getAll() {
  return request({
    url: `${group_name}/getAll`,
    method: 'get'
  })
}
