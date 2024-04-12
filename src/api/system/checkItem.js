import request from '@/utils/request'
var group_name = '/system/checkItem/'
// 分页查询
export function listForPageCheckItem(query) {
  return request({
    url: `${group_name}/listForPage`,
    method: 'get',
    params: query
  })
}
// 添加
export function addCheckItem(data) {
  return request({
    url: `${group_name}/addCheckItem`,
    method: 'post',
    params: data
  })
}
// 修改
export function updateCheckItem(data) {
  return request({
    url: `${group_name}/updateCheckItem`,
    method: 'put',
    params: data
  })
}
// 根据id查询
export function getCheckItemById(id) {
  return request({
    url: `${group_name}/getCheckItemById/${id}`,
    method: 'get'
  })
}
// 根据ids删除
export function deleteCheckItemByIds(ids) {
  return request({
    url: `${group_name}/deleteCheckItemByIds/${ids}`,
    method: 'delete'
  })
}
// 查询所有可用的检查项目
export function getAllCheckItem() {
  return request({
    url: `${group_name}/getAllCheckItem`,
    method: 'get'
  })
}
