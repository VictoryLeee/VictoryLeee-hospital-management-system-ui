import request from '@/utils/request'
var group_name = '/index'
// 获取供应商总数，采购下单总数、药品总销量总数、挂号总数
export function getIndexTopCount(schedulingType) {
  return request({
    url: `${group_name}/getIndexTopCount`,
    method: 'get'
  })
}
