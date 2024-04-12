<template>
  <div v-loading="loading">
    <el-card class="card-margin" style="color:red;text-align:center;font-weight:700;">
      * 注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询
    </el-card>
    <el-card class="card-margin">
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="检查项目销售统计" name="check">
          <el-form :model="queryCheckParams" :inline="true" size="small" label-width="98px">
            <el-form-item label="检查项目名称">
              <el-select
                v-model="queryCheckParams.checkItemId"
                placeholder="请选择检查项目名称"
                clearable
                style="width: 170px"
              >
                <el-option
                  v-for="d in checkItemOptions"
                  :key="d.checkItemId"
                  :label="d.checkItemName"
                  :value="d.checkItemId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="患者名称">
              <el-input
                v-model="queryCheckParams.patientName"
                placeholder="请输入患者名称"
                clearable
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="交易时间">
              <el-date-picker
                v-model="dateRange"
                size="small"
                style="width: 500px"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholde="开始日期"
                end-placeholde="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getData">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- 检查项目总销售列表  -->
          <el-table
            v-loading="loading"
            border
            :data="checkList"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column label="检查项目编码" prop="checkItemId" align="center" />
            <el-table-column label="检查项目名称" prop="checkItemName" align="center" />
            <el-table-column label="项目单价" prop="price" align="center" />
            <el-table-column label="患者姓名" prop="patientName" align="center" />
            <el-table-column label="检查状态" prop="resultStatus" align="center" :formatter="resultStatusFormatter" />
            <el-table-column label="创建时间" prop="createTime" align="center" />
            <el-table-column label="创建人" prop="createBy" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="检查项目销售汇总统计" name="checkStat">
          <el-form :model="queryCheckStatParams" :inline="true" size="small" label-width="98px">
            <el-form-item label="检查项目名称">
              <el-select
                v-model="queryCheckStatParams.checkItemId"
                placeholder="请选择检查项目名称"
                clearable
                style="width: 180px"
              >
                <el-option
                  v-for="d in checkItemOptions"
                  :key="d.checkItemId"
                  :label="d.checkItemName"
                  :value="d.checkItemId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="交易时间">
              <el-date-picker
                v-model="dateRange"
                size="small"
                style="width: 500px"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="-"
                start-placeholde="开始日期"
                end-placeholde="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getData">查询</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- 检查项目总销售列表  -->
          <el-table
            v-loading="loading"
            border
            :data="checkStatList"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column label="检查项目编码" prop="checkItemId" align="center" />
            <el-table-column label="检查项目名称" prop="checkItemName" align="center" />
            <el-table-column label="检查次数" prop="count" align="center" />
            <el-table-column label="总金额" prop="totalAmount" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { getAllCheckItem } from '@/api/system/checkItem'
import { getCheckList, getCheckStatCollectList } from '@/api/statistics/check'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 被激活的卡片名称
      activeName: 'check',
      // 检查项目总销售列表
      checkList: [],
      // 检查项目总销售汇总列表
      checkStatList: [],
      // 检查项目统计查询参数
      queryCheckParams: {
        checkItemId: undefined,
        patientName: undefined
      },
      // 检查项目汇总统计查询参数
      queryCheckStatParams: {
        checkItemId: undefined
      },
      // 日期范围
      dateRange: [],
      // 检查项目列表
      checkItemOptions: [],
      // 检查状态数据字典
      resultStatusOptions: []
    }
  },
  created() {
    // 查询所有可用检查项目列表
    getAllCheckItem().then(res => {
      this.checkItemOptions = res.data
    })
    // 查询检查结果数据字典
    this.getDataByType('his_check_result_status').then(res => {
      this.resultStatusOptions = res.data
    })
    this.getData()
  },
  methods: {
    // 点击卡片的切换事件
    handleClick() {
      this.getData()
    },
    // 查询检查项销售统计 或 查询检查项销售统计汇总
    getData() {
      this.loading = true
      if (this.activeName === 'check') {
        // 查询检查项销售统计
        getCheckList(this.addDateRange(this.queryCheckParams, this.dateRange)).then(res => {
          this.checkList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        // 查询检查项销售统计汇总
        getCheckStatCollectList(this.addDateRange(this.queryCheckStatParams, this.dateRange)).then(res => {
          this.checkStatList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 重置查询条件
    resetQuery() {
      if (this.activeName === 'check') {
        // 检查项目统计查询参数
        this.queryCheckParams.checkItemId = undefined
        this.queryCheckParams.patientName = undefined
      } else {
        // 检查项目汇总统计查询参数
        this.queryCheckStatParams.checkItemId = undefined
      }
      this.dateRange = []
      this.getData()
    },
    // 翻译检查单详情状态
    resultStatusFormatter(row) {
      return this.selectDictLabel(this.resultStatusOptions, row.resultStatus)
    },
    // 修改摘要
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (this.activeName === 'check') {
          if (index === 4) {
            sums[index] = ''
            return
          }
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (this.activeName === 'checkStat') {
            if (index === 2) {
              sums[index] += ' 次'
              return
            } else {
              sums[index] += ' 元'
            }
          } else {
            sums[index] += ' 元'
          }
        }
      })
      return sums
    }
  }
}
</script>
<style scoped>
  .card-margin{
    margin-bottom: 3px;
    font-weight: 600;
  }
</style>
