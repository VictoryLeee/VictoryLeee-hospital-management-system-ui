import request from '@/utils/request'
var group_name = '/system/notice/'
// 分页查询
export function listForPageNotice(query) {
  return request({
    url: `${group_name}/listForPage`,
    method: 'get',
    params: query
  })
}
// 添加
export function addNotice(data) {
  return request({
    url: `${group_name}/addNotice`,
    method: 'post',
    params: data
  })
}
// 修改
export function updateNotice(data) {
  return request({
    url: `${group_name}/updateNotice`,
    method: 'put',
    params: data
  })
}
// 根据id查询
export function getNoticeById(id) {
  return request({
    url: `${group_name}/getNoticeById/${id}`,
    method: 'get'
  })
}
// 根据ids删除
export function deleteNoticeByIds(ids) {
  return request({
    url: `${group_name}/deleteByIds/${ids}`,
    method: 'delete'
  })
}
// 获取最新十条公告数据
export function getLatestTenStatistics() {
  return request({
    url: `${group_name}/getLatestTenStatistics`,
    method: 'get'
  })
}
