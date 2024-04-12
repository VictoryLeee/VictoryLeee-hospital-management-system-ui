import request from '@/utils/request'
var group_name = '/system/loginInfo'
// 分页查询操作日志
export function listForPage(query) {
  return request({
    url: `${group_name}/listForPage`,
    method: 'get',
    params: query
  })
}
// 批量删除操作日志
export function deleteByIds(ids) {
  return request({
    url: `${group_name}/deleteByIds/${ids}`,
    method: 'delete'
  })
}
// 清除所有日志
export function clearLoginInfo() {
  return request({
    url: `${group_name}/clearLoginInfo`,
    method: 'delete'
  })
}

