<template>
  <div v-loading="loading">
    <el-card class="card-margin" style="color:red;text-align:center;font-weight:700;">
      * 注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询
    </el-card>
    <!-- 查询条件开始 -->
    <el-card class="card-margin">
      <el-form :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="选择日期">
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
    </el-card>
    <!-- 数据结果 -->
    <el-card class="card-margin">
      合计收入：
      <span class="spancls spanred">￥{{ totalAmountMap.totalRevenue }}</span>
    </el-card>
    <el-card class="card-margin">
      收支概况：
      <span class="spancls spanred">总收入：{{ totalAmountMap.overviewMap.totalAmount }} </span>
      <span class="spancls spanred" style="text-indent:2em;">总退费：￥{{ totalAmountMap.overviewMap.refundAmount }}</span>
    </el-card>
    <el-card class="card-margin">
      收入渠道：
      <span class="spancls spanred">现金支付：￥{{ totalAmountMap.channelMap.cashIncome }}</span>
      <span class="spancls spanred">支付宝支付：￥{{ totalAmountMap.channelMap.aliPayIncome }}</span>
      <span class="spancls spanred">现金退费：￥{{ totalAmountMap.channelMap.cashRefund }}</span>
      <span class="spancls spanred">支付宝退费：￥{{ totalAmountMap.channelMap.aliPayRefund }}</span>
    </el-card>
    <!-- 图标数据 -->
    <el-card>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div>
            <pie-chart ref="p1" :prop-pie-data="revenueOverviewMap" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div>
            <pie-chart ref="p2" :prop-pie-data="incomeChanelMap" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div>
            <pie-chart ref="p3" :prop-pie-data="refundMap" />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import PieChart from './components/PieChart'
import { getRevenueData } from '@/api/statistics/revenue'
export default {
  components: {
    PieChart
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 查询参数
      queryParams: {},
      // 日期范围
      dateRange: [],
      // 收支数据结构
      totalAmountMap: {
        // 合计收入
        totalRevenue: 0.00,
        // 收支详情
        overviewMap: {
          // 总收入
          totalAmount: 0.00,
          // 总退费
          refundAmount: 0.00
        },
        // 收支渠道，支付宝或现金，支付与退费总金额
        channelMap: {
          // 支付宝或现金 收支总金额
          cashIncome: 0.00,
          aliPayIncome: 0.00,
          cashRefund: 0.00,
          aliPayRefund: 0.00
        }
      },
      // 收支概述图标数据
      revenueOverviewMap: {
        title: '收支概况',
        data: [
          { name: '收费总金额', value: 0 },
          { name: '退费总金额', value: 0 }
        ]
      },
      // 收入渠道
      incomeChanelMap: {
        title: '收入渠道',
        data: [
          { name: '现金笔数', value: 0 },
          { name: '支付宝笔数', value: 0 }
        ]
      },
      // 退费渠道
      refundMap: {
        title: '退款概况',
        data: [
          { name: '现金退费', value: 0 },
          { name: '支付宝退费', value: 0 }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 查询收支统计数据 总收支、收支概况、收入渠道、支出渠道
    getData() {
      this.loading = true
      getRevenueData(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        // 总收支、收支概况、收入渠道、支出渠道
        this.totalAmountMap = res.data.totalAmountMap
        this.revenueOverviewMap = res.data.revenueOverviewMap
        this.incomeChanelMap = res.data.incomeChanelMap
        this.refundMap = res.data.refundMap
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 重置查询条件
    resetQuery() {
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
  .spancls{
    display: inline-block;
    margin-left: 80px;
  }
  .spanred{
    color: red;
  }
</style>
