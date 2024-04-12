import request from '@/utils/request'
var group_name = '/system/dict/data'
export default {
  // 分页查询数据字典
  listForPage(query) {
    return request({
      url: `${group_name}/listForPage`,
      method: 'get',
      params: query
    })
  },
  // 添加数据字典
  add(data) {
    return request({
      url: `${group_name}/add`,
      method: 'post',
      params: data
    })
  },
  // 修改数据字典
  update(data) {
    return request({
      url: `${group_name}/update`,
      method: 'put',
      params: data
    })
  },
  // 根据字典数据icode查询
  getById(dictCode) {
    return request({
      url: `${group_name}/getById/${dictCode}`,
      method: 'get'
    })
  },
  // 批量删除数据字典数据
  deleteByIds(dictCodes) {
    return request({
      url: `${group_name}/deleteByIds/${dictCodes}`,
      method: 'delete'
    })
  }
}
// 根据字典类型查询字典数据
export function getDataByType(dictType) {
  return request({
    url: `${group_name}/getDataByType/${dictType}`,
    method: 'get'
  })
}
