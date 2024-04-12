import request from '@/utils/request'
var group_name = '/erp/inventoryLog/'
// 分页查询
export function listInventoryLogForPage(data) {
  return request({
    url: `${group_name}/listInventoryLogForPage`,
    method: 'post',
    params: data
  })
}
// 入库
export function savePutStock(data) {
  return request({
    url: `${group_name}/savePutStock`,
    method: 'post',
    data: data
  })
}
