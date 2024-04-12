import request from '@/utils/request'
var group_name = '/erp/purchase/'
// 分页查询
export function listPurchaseForPage(data) {
  return request({
    url: `${group_name}/listPurchaseForPage`,
    method: 'get',
    params: data
  })
}
// 分页查询未入库的单据
export function listPurchaseForPageNoPutStock(data) {
  return request({
    url: `${group_name}/listPurchaseForPageNoPutStock`,
    method: 'get',
    params: data
  })
}
// 添加采购单数据和详情
export function addPurchase(purchaseMdDto) {
  return request({
    url: `${group_name}/addPurchase`,
    method: 'post',
    data: purchaseMdDto
  })
}
// 已审核
export function auditPass(purchaseId) {
  return request({
    url: `${group_name}/auditPass/${purchaseId}`,
    method: 'get'
  })
}
// 作废
export function doInvalid(purchaseId) {
  return request({
    url: `${group_name}/doInvalid/${purchaseId}`,
    method: 'get'
  })
}
// 反作废
export function doNoInvalid(purchaseId) {
  return request({
    url: `${group_name}/doNoInvalid/${purchaseId}`,
    method: 'get'
  })
}
// 反审
export function reflectingAudit(purchaseId) {
  return request({
    url: `${group_name}/reflectingAudit/${purchaseId}`,
    method: 'get'
  })
}
// 根据ID查询采购主表
export function getPurchaseByPurchaseId(purchaseId) {
  return request({
    url: `${group_name}/getPurchaseByPurchaseId/${purchaseId}`,
    method: 'get'
  })
}
// 根据采购主表ID查询采购明细表
export function getPurItemByPurchaseId(purchaseId) {
  return request({
    url: `${group_name}/getPurItemByPurchaseId/${purchaseId}`,
    method: 'get'
  })
}
// 根据采购主表ID和未入库状态查询采购明细表
export function getPurItemByPurchaseIdAndIsPutStock(purchaseId) {
  return request({
    url: `${group_name}/getPurItemByPurchaseIdAndIsPutStock/${purchaseId}`,
    method: 'get'
  })
}
// 根据采购订单ID查询采购订单主表和明细表信息
export function getPurchaseItemByPurchaseId(purchaseId) {
  return request({
    url: `${group_name}/getPurchaseItemByPurchaseId/${purchaseId}`,
    method: 'get'
  })
}
// 生成单据号
export function generatePurchaseId() {
  return request({
    url: `${group_name}/generatePurchaseId`,
    method: 'get'
  })
}
// 根据采购单号查询采购单信息和详情信息
export function getPurchaseAndItemByPurchaseId(purchaseId) {
  return request({
    url: `${group_name}/getPurchaseAndItemByPurchaseId/${purchaseId}`,
    method: 'get'
  })
}
// 删除主与明细表 待审核或作废状态可以删，已入库提示不能删除必须先删除入库单再删
export function deletePurchaseAndItem(purchaseId) {
  return request({
    url: `${group_name}/deletePurchaseAndItem/${purchaseId}`,
    method: 'delete'
  })
}
