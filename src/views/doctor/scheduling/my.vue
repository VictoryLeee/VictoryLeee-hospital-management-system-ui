<template>
  <div>
    <el-row :gutter="12" style="margin-bottom:5px">
      <el-col :span="24">
        <el-card>
          <el-form ref="queryForm" :model="queryParams" size="mini" :inline="true" label-width="68px">
            <el-form-item style="float: right">
              <el-button type="primary" icon="el-icon-plus" @click="upWeek()">上一周</el-button>
              <el-button type="success" icon="el-icon-s-operation" @click="currentWeek()">当前周</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="nextWeek()">下一周</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" style="margin-bottom: 5px">
      <el-col :span="24">
        <el-card>
          <div style="text-align: center">
            <span>{{ schedulingData.startTimeThisWeek }}(周一)</span> ~ <span>{{ schedulingData.endTimeThisWeek }}(周日)</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="tableData" border :span-method="spanMethod">
      <el-table-column prop="userId" label="医生" align="center" width="100px" :formatter="userFormatter" />
      <el-table-column prop="deptId" label="科室" align="center" width="100px" :formatter="deptFormatter" />
      <el-table-column prop="subsectionType" label="时间/日期" align="center" width="90px" :formatter="subsectionTypeFormatter" />
      <el-table-column prop="schedulingType[0]" :label="labelNames[0]" align="center" :formatter="schedulingTypeDay1Formatter" />
      <el-table-column prop="schedulingType[1]" :label="labelNames[1]" align="center" :formatter="schedulingTypeDay2Formatter" />
      <el-table-column prop="schedulingType[2]" :label="labelNames[2]" align="center" :formatter="schedulingTypeDay3Formatter" />
      <el-table-column prop="schedulingType[3]" :label="labelNames[3]" align="center" :formatter="schedulingTypeDay4Formatter" />
      <el-table-column prop="schedulingType[4]" :label="labelNames[4]" align="center" :formatter="schedulingTypeDay5Formatter" />
      <el-table-column prop="schedulingType[5]" :label="labelNames[5]" align="center" :formatter="schedulingTypeDay6Formatter" />
      <el-table-column prop="schedulingType[6]" :label="labelNames[6]" align="center" :formatter="schedulingTypeDay7Formatter" />
    </el-table>
  </div>
</template>
<script>
import { getUsersNeedScheduling, getMyScheduling } from '@/api/doctor/scheduling'
import { selectAll } from '@/api/system/dept'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 科室数据
      deptOptions: [],
      // 用户数据
      userOptions: [],
      // 排班时间段字典数据
      subsectionTypeOptions: [],
      // 排班类型字典数据
      schedulingTypeOptions: [],
      // 查询条件
      queryParams: {
        deptId: undefined,
        userId: undefined,
        queryDate: undefined
      },
      // 排班数据
      schedulingData: {
        startTimeThisWeek: undefined,
        endTimeThisWeek: undefined
      },
      // 排班表的数据
      tableData: [],
      // 标头数据
      labelNames: ['', '', '', '', '', '', '']
    }
  },
  computed: {
    // 获取医生列表数组
    groupNum() {
      return new Set(this.tableData.map(o => o.userId))
    }
  },
  created() {
    // 查询所有可用的科室
    selectAll().then(res => {
      this.deptOptions = res.data
    })
    // 查询要排班的医生
    getUsersNeedScheduling().then(res => {
      this.userOptions = res.data
    })
    // 查询排班类型
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 查询排班时间段
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 查询排班数据
    this.getSchedulingList()
  },
  methods: {
    // 查询排班信息
    getSchedulingList() {
      this.loading = true
      getMyScheduling(this.queryParams).then(res => {
        // 获取表头名数组
        this.labelNames = res.data.labelNames
        // 获取返回的数据格式
        this.tableData = res.data.tableData
        // 获取星期一和星期天的日期
        this.schedulingData = res.data.schedulingData
        this.loading = false
      })
    },
    // 点击查询上一周
    upWeek() {
      this.queryParams.queryDate = this.schedulingData.startTimeThisWeek
      this.getSchedulingList()
    },
    // 点击查询当前周
    currentWeek() {
      this.queryParams.queryDate = undefined
      this.getSchedulingList()
    },
    // 点击查询下一周
    nextWeek() {
      this.queryParams.queryDate = this.schedulingData.endTimeThisWeek
      this.getSchedulingList()
    },
    // 翻译用户名称
    userFormatter(row) {
      let name = ''
      this.userOptions.filter(item => {
        if (row.userId === item.userId) {
          name = item.userName
        }
      })
      return name
    },
    // 翻译科室名称
    deptFormatter(row) {
      let name = ''
      this.deptOptions.filter(item => {
        if (row.deptId === item.deptId) {
          name = item.deptName
        }
      })
      return name
    },
    // 翻译排班时间段
    subsectionTypeFormatter(row) {
      return this.selectDictLabel(this.subsectionTypeOptions, row.subsectionType)
    },
    // 翻译周一排班类型
    schedulingTypeDay1Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[0])
    },
    // 翻译周二排班类型
    schedulingTypeDay2Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[1])
    },
    // 翻译周三排班类型
    schedulingTypeDay3Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[2])
    },
    // 翻译周四排班类型
    schedulingTypeDay4Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[3])
    },
    // 翻译周五排班类型
    schedulingTypeDay5Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[4])
    },
    // 翻译周六排班类型
    schedulingTypeDay6Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[5])
    },
    // 翻译周日排班类型
    schedulingTypeDay7Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[6])
    },
    // 合并行的代码
    spanMethod(data) {
      // 对于表格数据进行分组合并操作
      const { row, rowIndex, columnIndex } = data
      // 医生合并展示区  列名的下标为2到9都不合并
      if (columnIndex < 2 || columnIndex > 9) {
        // 根据医生ID获取上下晚数量
        const len = this.userGroup(row.userId)
        const lenName = this.userIdLen(row.userId)
        if (rowIndex === lenName) {
          // 某医生首位部门行
          return {
            rowspan: len,
            colspan: 1
          }
        } else {
          // 某医生非首位部门行
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else {
        // 排班信息展示区
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    // 根据医生ID获取上下晚数量
    userGroup(userId) {
      return this.tableData.filter(o => o.userId === userId).length
    },
    // 根据医生id获取该医生 第一个部门在全量部门中的偏移位置
    userIdLen(userId) {
      // 获取医生的下标
      const tmp = Array.from(this.groupNum)
      const index = tmp.indexOf(userId)
      let len = 0
      for (let i = 0; i < index; i++) {
        len += this.userGroup(tmp[i])
      }
      return len
    }
  }
}
</script>
<style>
</style>
