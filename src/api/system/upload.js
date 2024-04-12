import request from '@/utils/request'
var group_name = '/system/upload'

// 删除文件
export function doDeleteFile(fileInfo) {
  return request({
    url: `${group_name}/doDeleteFile`,
    method: 'post',
    data: fileInfo
  })
}
