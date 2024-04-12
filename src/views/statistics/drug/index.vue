<template>
  <div v-loading="loading">
    <el-card class="card-margin" style="color:red;text-align:center;font-weight:700;">
      * 注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询
    </el-card>
    <el-card class="card-margin">
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="药品销售统计" name="drug">
          <el-form :model="queryDrugParams" :inline="true" size="small" label-width="68px">
            <el-form-item label="药品名称">
              <el-input
                v-model="queryDrugParams.drugName"
                placeholder="请输入药品名称"
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
          <!-- 药品总销售列表  -->
          <el-table v-loading="loading" border :data="drugList" show-summary>
            <el-table-column label="药品编码" prop="medicinesId" align="center" />
            <el-table-column label="药品名称" prop="medicinesName" align="center" />
            <el-table-column label="交易数量" prop="num" align="center" />
            <el-table-column label="销售单价" prop="price" align="center" />
            <el-table-column label="交易金额" prop="amount" align="center" />
            <el-table-column label="创建时间" prop="createTime" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="药品销售汇总统计" name="drugStat">
          <el-form :model="queryDrugStatParams" :inline="true" size="small" label-width="68px">
            <el-form-item label="药品名称">
              <el-input
                v-model="queryDrugStatParams.drugName"
                placeholder="请输入药品名称"
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
          <!-- 药品总销售列表  -->
          <el-table v-loading="loading" border :data="drugStatList" show-summary>
            <el-table-column label="药品编码" prop="medicinesId" align="center" />
            <el-table-column label="药品名称" prop="medicinesName" align="center" />
            <el-table-column label="交易数量" prop="count" align="center" />
            <el-table-column label="交易金额" prop="totalAmount" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { getDrugList, getDrugStatCollectList } from '@/api/statistics/drug'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 被激活的卡片名称
      activeName: 'drug',
      // 药品总销售列表
      drugList: [],
      // 药品总销售汇总列表
      drugStatList: [],
      // 药品统计查询参数
      queryDrugParams: {
        drugName: undefined
      },
      // 药品汇总统计查询参数
      queryDrugStatParams: {
        drugName: undefined
      },
      // 日期范围
      dateRange: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 点击卡片的切换事件
    handleClick() {
      this.getData()
    },
    // 查询收支统计数据 总收支、收支概况、收入渠道、支出渠道
    getData() {
      this.loading = true
      if (this.activeName === 'drug') {
        // 查询发药统计非汇总列表
        getDrugList(this.addDateRange(this.queryDrugParams, this.dateRange)).then(res => {
          this.drugList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        // 查询发药统计汇总列表
        getDrugStatCollectList(this.addDateRange(this.queryDrugStatParams, this.dateRange)).then(res => {
          this.drugStatList = res.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 重置查询条件
    resetQuery() {
      if (this.activeName === 'drug') {
        // 药品统计查询参数
        this.queryDrugParams.drugName = undefined
      } else {
        // 药品汇总统计查询参数
        this.queryDrugStatParams.drugName = undefined
      }
      this.dateRange = []
      this.getData()
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
