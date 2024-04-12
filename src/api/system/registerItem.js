import request from '@/utils/request'
var group_name = '/system/registerItem/'
// 分页查询
export function listForPageRegisterItem(query) {
  return request({
    url: `${group_name}/listForPage`,
    method: 'post',
    params: query
  })
}
// 添加
export function addRegisteredItem(data) {
  return request({
    url: `${group_name}/addRegisteredItem`,
    method: 'post',
    params: data
  })
}
// 修改
export function updateRegisteredItem(data) {
  return request({
    url: `${group_name}/updateRegisteredItem`,
    method: 'put',
    params: data
  })
}
// 根据id查询
export function getRegisteredItemById(id) {
  return request({
    url: `${group_name}/getById/${id}`,
    method: 'get'
  })
}
// 根据ids删除
export function deleteRegisteredItemByIds(ids) {
  return request({
    url: `${group_name}/deleteByIds/${ids}`,
    method: 'delete'
  })
}
// 查询所有可用的挂号费用
export function getAllRegisteredItem() {
  return request({
    url: `${group_name}/getAll`,
    method: 'get'
  })
}
