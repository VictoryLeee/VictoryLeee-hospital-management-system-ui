import request from '@/utils/request'
var group_name = '/system/dict/type'
export default {
  // 分页查询数据字典类型
  listForPage(query) {
    return request({
      url: `${group_name}/listForPage`,
      method: 'get',
      params: query
    })
  },
  // 添加数据字典类型
  add(data) {
    return request({
      url: `${group_name}/add`,
      method: 'post',
      params: data
    })
  },
  // 修改数据字典类型
  update(data) {
    return request({
      url: `${group_name}/update`,
      method: 'put',
      params: data
    })
  },
  // 根据字典类型id查询
  getById(dictId) {
    return request({
      url: `${group_name}/getById/${dictId}`,
      method: 'get'
    })
  },
  // 批量删除数据字典类型
  deleteByIds(dictIds) {
    return request({
      url: `${group_name}/deleteByIds/${dictIds}`,
      method: 'delete'
    })
  },
  // 查询所有可用的数据字典类型
  selectAllDictType() {
    return request({
      url: `${group_name}/selectAllDictType`,
      method: 'get'
    })
  },
  // 缓存同步字典
  dictCacheAsync() {
    return request({
      url: `${group_name}/dictCacheAsync`,
      method: 'get'
    })
  }
}
