<template>
  <div v-loading="loading">
    <el-card class="card-margin" style="color:red;text-align:center;font-weight:700;">
      * 注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询
    </el-card>
    <el-card class="card-margin">
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="医生工作量统计" name="workload">
          <el-form :model="queryWorkloadParams" :inline="true" size="small" label-width="98px">
            <el-form-item label="医生姓名">
              <el-input
                v-model="queryWorkloadParams.doctorName"
                placeholder="请选择医生名称"
                clearable
                style="width: 170px"
              />
            </el-form-item>
            <el-form-item label="接诊时间">
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
          <!-- 医生工作量统计列表  -->
          <el-table
            v-loading="loading"
            border
            :data="workloadList"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column label="挂号单号" prop="registrationId" align="center" />
            <el-table-column label="医生编号" prop="userId" align="center" />
            <el-table-column label="医生姓名" prop="doctorName" align="center" />
            <el-table-column label="患者姓名" prop="patientName" align="center" />
            <el-table-column label="挂号费用" prop="registrationAmount" align="center" />
            <el-table-column label="就诊时间" prop="visitDate" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="医生工作量汇总统计" name="workloadStat">
          <el-form :model="queryWorkloadStatParams" :inline="true" size="small" label-width="98px">
            <el-form-item label="医生姓名">
              <el-input
                v-model="queryWorkloadStatParams.doctorName"
                placeholder="请选择医生名称"
                clearable
                style="width: 170px"
              />
            </el-form-item>
            <el-form-item label="接诊时间">
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
          <!-- 医生工作量总销售列表  -->
          <el-table
            v-loading="loading"
            border
            :data="workloadStatList"
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column label="医生编号" prop="userId" align="center" />
            <el-table-column label="医生姓名" prop="doctorName" align="center" />
            <el-table-column label="挂号总金额" prop="totalAmount" align="center" />
            <el-table-column label="接诊数量" prop="count" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { getWorkloadList, getWorkloadStatCollectList } from '@/api/statistics/workload'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 被激活的tab名称
      activeName: 'workload',
      // 工作量统计数据
      workloadList: [],
      // 工作量统计汇总数据
      workloadStatList: [],
      // 日期范围
      dateRange: [],
      // 工作量统计列表查询参数
      queryWorkloadParams: {
        doctorName: undefined
      },
      // 工作量统计列表查询参数
      queryWorkloadStatParams: {
        doctorName: undefined
      }
    }
  },
  created() {
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
    // 查询工作量统计统计 或 查询工作量统计统计汇总
    getData() {
      this.loading = true
      if (this.activeName === 'workload') {
        // 查询工作量统计统计
        getWorkloadList(this.addDateRange(this.queryWorkloadParams, this.dateRange)).then(res => {
          this.workloadList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        // 查询工作量统计统计汇总
        getWorkloadStatCollectList(this.addDateRange(this.queryWorkloadStatParams, this.dateRange)).then(res => {
          this.workloadStatList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 重置查询条件
    resetQuery() {
      if (this.activeName === 'workload') {
        // 医生工作量统计查询参数
        this.queryWorkloadParams.doctorName = undefined
      } else {
        // 医生工作量汇总统计查询参数
        this.queryWorkloadStatParams.doctorName = undefined
      }
      this.dateRange = []
      this.getData()
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
        if (index === 1) {
          sums[index] = ''
          return
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
          if (this.activeName === 'workloadStat') {
            if (index === 3) {
              sums[index] += ' 个'
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
