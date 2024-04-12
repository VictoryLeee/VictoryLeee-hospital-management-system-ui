// 项目通用方法的封装
// 把日期范围构造成beginTime和endTime
export function addDateRange(params, dateRange) {
  var search = params
  search.beginTime = ''
  search.endTime = ''
  if (dateRange != null && dateRange !== '' && dateRange !== undefined) {
    search.beginTime = this.dateRange[0]
    search.endTime = this.dateRange[1]
  }
  return search
}
// 状态翻译 datas是当前状态数据列表 value要翻译的值
export function selectDictLabel(datas, value) {
  var actions = []
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue === value) {
      actions.push(datas[key].dictLabel)
      return false
    }
  })
  return actions.join('')
}
/**
 * 构造数的数据结构
 * @param  data 要构造的数据源
 * @param {*} id 字段ID 默认为ID
 * @param {*} parentId 父节点字段 默认为parentId
 * @param {*} children 子节点的字段 默认为children
 * @param {*} rootId 根节点的ID 默认为0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  // 对源数据进行深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回上一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}
/**
 * 公共的根据出生年月计算年龄的方法
 *  @param birthday 格式必须为2020-08-08
*/
export function getAge(birthday) {
  // 根据-进行拆分为数组
  var birArr = birthday.split('-')
  var birYear = parseInt(birArr[0])
  var birMonth = parseInt(birArr[1])
  var birDay = parseInt(birArr[2])

  // 获取当前的日期
  d = new Date()
  var nowYear = d.getFullYear()
  var nowMonth = d.getMonth() + 1 // 记得加1
  var nowDay = d.getDate()
  var returnAge

  if (birArr == null) {
    return false
  }
  var d = new Date(birYear, birMonth - 1, birDay)
  if (d.getFullYear() === birYear && (d.getMonth() + 1) === birMonth && d.getDate() === birDay) {
    if (nowYear === birYear) {
      returnAge = 0
    } else {
      // 获取多少岁 当前年份-生日年份
      var ageDiff = nowYear - birYear
      // 如果大于0
      if (ageDiff > 0) {
        // 当前月份相同
        if (nowMonth === birMonth) {
          var dayDiff = nowDay - birDay
          // 如果当前日和生日的日相减 小于0，就将ageDiff-1
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            // 如果当前日和生日的日相减 大于于0，就不减
            returnAge = ageDiff
          }
        } else {
          var monthDiff = nowMonth - birMonth
          // 如果当前月和生日的月相减 小于0，就将ageDiff-1
          if (monthDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            // 如果当前月和生日的月相减 大于于0，就不减
            returnAge = ageDiff
          }
        }
      } else {
        return '出生日期晚于今天，数据有误' // 返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge
  } else {
    return ('输入的日期格式错误！')
  }
}
// 判断当前时间是上午是1 下午是2 晚上是3
export function getCurrentTimeType() {
  const now = new Date()
  const hour = now.getHours()
  if (hour >= 6 && hour < 12) {
    return '1'
  } else if (hour >= 12 && hour < 18) {
    return '2'
  } else if (hour >= 18 && hour < 24) {
    return '3'
  }
}
