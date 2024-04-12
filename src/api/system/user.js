import request from '@/utils/request'
var group_name = '/system/user/'
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
// 查询所有可用的角色
export function getAll() {
  return request({
    url: `${group_name}/selectAll`,
    method: 'get'
  })
}
// 根据ids集合重置密码
export function resetPassword(userIds) {
  return request({
    url: `${group_name}/resetPassword/${userIds}`,
    method: 'put'
  })
}
// 保存角色和菜单之间的关系
export function saveRoleMenu(roleId, menuIds) {
  // 处理如果没有选择菜单数据。就无法匹配到后台数据的问题
  if (menuIds.length === 0) {
    menuIds = [-1]
  }
  return request({
    url: `${group_name}/saveRoleMenu/${roleId}/${menuIds}`,
    method: 'post'
  })
}
