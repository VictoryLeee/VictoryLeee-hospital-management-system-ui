import request from '@/utils/request'
var group_name = '/erp/producter/'
// 分页查询
export function listForPageProducter(query) {
  return request({
    url: `${group_name}/listForPageProducter`,
    method: 'get',
    params: query
  })
}
// 添加生产厂家信息
export function addProducter(data) {
  return request({
    url: `${group_name}/addProducter`,
    method: 'post',
    params: data
  })
}
// 修改生产厂家信息
export function updateProducter(data) {
  return request({
    url: `${group_name}/updateProducter`,
    method: 'put',
    params: data
  })
}
// 根据id查询生产厂家信息
export function getProducterById(id) {
  return request({
    url: `${group_name}/getProducterById/${id}`,
    method: 'get'
  })
}
// 根据ids集合删除生产厂家信息
export function deleteProducterByIds(ids) {
  return request({
    url: `${group_name}/deleteProducterByIds/${ids}`,
    method: 'delete'
  })
}
// 查询所有可用的生产厂家信息
export function getProducterAll() {
  return request({
    url: `${group_name}/getProducterAll`,
    method: 'get'
  })
}
