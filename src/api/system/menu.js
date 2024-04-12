import request from '@/utils/request'
var group_name = '/system/menu/'
// 查询菜单和权限数据
export function listForMenus(query) {
  return request({
    url: `${group_name}/listForMenus`,
    method: 'get',
    params: query
  })
}
// 添加菜单
export function add(data) {
  return request({
    url: `${group_name}/add`,
    method: 'post',
    params: data
  })
}
// 修改菜单
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
export function deleteById(id) {
  return request({
    url: `${group_name}/deleteById/${id}`,
    method: 'delete'
  })
}
// 查询菜单和权限数据
export function getMenuTree() {
  return request({
    url: `${group_name}/getMenuTree`,
    method: 'get'
  })
}
// 根据角色ID查询当前角色ID拥有的权限菜单
export function getMenuIdsByRoleId(roleId) {
  return request({
    url: '/system/menu/getMenuIdsByRoleId/' + roleId,
    method: 'get'
  })
}
