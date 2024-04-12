import request from '@/utils/request'
var group_name = '/doctor/scheduling/'
// 保存排班数据
export function saveScheduling(data) {
  return request({
    url: `${group_name}/saveScheduling`,
    method: 'post',
    data: data
  })
}
// 根据部门id查询要排班的用户信息
export function getUsersNeedScheduling(deptId) {
  return request({
    url: `${group_name}/getUsersNeedScheduling`,
    method: 'get',
    params: { deptId: deptId }
  })
}
// 根据用户id查询要排班的医生的排班信息
export function getSchedulingByUserIdOrDeptId(query) {
  return request({
    url: `${group_name}/getSchedulingByUserIdOrDeptId`,
    method: 'get',
    params: query
  })
}
// 查询我的排班
export function getMyScheduling(query) {
  return request({
    url: `${group_name}/getMyScheduling`,
    method: 'get',
    params: query
  })
}
