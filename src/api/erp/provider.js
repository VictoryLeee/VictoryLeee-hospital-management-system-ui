import request from '@/utils/request'
var group_name = '/erp/provider/'
// 分页查询
export function listProviderForPage(data) {
  return request({
    url: `${group_name}/listProviderForPage`,
    method: 'get',
    params: data
  })
}
// 添加供应商
export function addProvider(data) {
  return request({
    url: `${group_name}/addProvider`,
    method: 'post',
    params: data
  })
}
// 修改供应商
export function updateProvider(data) {
  return request({
    url: `${group_name}/updateProvider`,
    method: 'put',
    params: data
  })
}
// 根据id查询
export function getByProviderId(id) {
  return request({
    url: `${group_name}/getByProviderId/${id}`,
    method: 'get'
  })
}
// 根据ids删除
export function deleteProviderByIds(ids) {
  return request({
    url: `${group_name}/deleteProviderByIds/${ids}`,
    method: 'delete'
  })
}
// 查询所有可用
export function getProviderAll() {
  return request({
    url: `${group_name}/getProviderAll`,
    method: 'get'
  })
}
