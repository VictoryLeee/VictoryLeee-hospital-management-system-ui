import request from '@/utils/request'
var group_name = '/system/dept/'
// 分页查询
export function listForPage(query) {
  return request({
    url: `${group_name}/listForPage`,
    method: 'get',
    params: query
  })
}
// 添加
export function add(data) {
  return request({
    url: `${group_name}/add`,
    method: 'post',
    params: data
  })
}
// 修改
export function update(data) {
  return request({
    url: `${group_name}/update`,
    method: 'put',
    params: data
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
export function deleteByIds(ids) {
  return request({
    url: `${group_name}/deleteByIds/${ids}`,
    method: 'delete'
  })
}
// 查询所有可用的科室
export function selectAll() {
  return request({
    url: `${group_name}/selectAll`,
    method: 'get'
  })
}
