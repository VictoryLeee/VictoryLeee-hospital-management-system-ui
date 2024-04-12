<template>
  <div>
    <el-card style="margin: 10px 0px; height: 70px">
      <el-form :model="queryParams" size="small" :inline="true" label-width="98px">
        <el-form-item label="患者姓名">
          <el-input
            v-model="queryParams.patientName"
            placeholder="请输入患者姓名"
            clearable
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="挂号单号">
          <el-input
            v-model="queryParams.registrationId"
            placeholder="请输入挂号单号"
            clearable
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table v-loading="loading" border :data="orderBackfeeTableList">
        <el-table-column label="订单号" align="center" width="210" prop="orderId" />
        <el-table-column label="挂号单号" align="center" width="200" prop="registrationId" />
        <el-table-column label="患者姓名" align="center" prop="patientName" />
        <el-table-column label="总金额" align="center" width="130" prop="orderAmount">
          <template slot-scope="scope">
            <span style="color:red">￥{{ scope.row.backAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退费类型" align="center" prop="backType" :formatter="payTypeFormatter" />
        <el-table-column label="退费状态" align="center" prop="backStatus" :formatter="backStatusFormatter" />
        <el-table-column label="创建时间" align="center" width="200" prop="createTime" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" size="mini" @click="handleViewOrderItem(scope.row)">查询退费详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页控件开始 -->
      <el-pagination
        v-show="total>0"
        :current-page="queryParams.pageNum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- 订单详情弹窗 -->
      <el-dialog
        v-loading="loading"
        :title="title"
        :visible.sync="open"
        width="1300px"
        center
        append-to-body
        close-on-press-escape
      >
        <el-table
          v-loading="orderBackfeeItemLoading"
          border
          :data="orderBackfeeItemTableList"
        >
          <el-table-column label="订单详情编码" align="center" width="210" prop="itemId" />
          <el-table-column label="处方编码" align="center" width="210" prop="itemId" />
          <el-table-column label="名称" align="center" prop="itemName" />
          <el-table-column label="数量" align="center" width="100" prop="itemNum" />
          <el-table-column label="价格" align="center" width="100" prop="itemPrice">
            <template slot-scope="scope">
              <span style="color:red">￥{{ scope.row.itemPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总额" align="center" width="120" prop="itemAmount">
            <template slot-scope="scope">
              <span style="color:red">￥{{ scope.row.itemAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付类型" align="center" width="100" prop="payType" :formatter="payTypeFormatter">
            <template slot-scope="scope">
              <span v-if="scope.row.payType === 0" style="color:red">现金</span>
              <span v-else style="color:green">支付宝</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" width="90" prop="itemType">
            <template slot-scope="scope">
              {{ scope.row.itemType === '0'? '药品': '检查' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="120" prop="status" :formatter="orderStatusItemFormatter" />
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { getOrderBackForPage, getOrderBackfeeItemListByBackId } from '@/api/charge/orderbackfee'
export default {
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 订单详情表格的遮罩层
      orderBackfeeItemLoading: false,
      // 分页数据总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示退费详情的弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        registrationId: undefined
      },
      // 退费订单数据列表
      orderBackfeeTableList: [],
      // 退费订单详情列表
      orderBackfeeItemTableList: [],
      // 退费类型字典数据
      backTypeOptions: [],
      // 退费订单状态字典数据
      orderBackfeeStatusOptions: [],
      // 订单详情状态字典数据
      orderBackfeeItemStatusOptions: []
    }
  },
  created() {
    // 查询支付类型字典数据
    this.getDataByType('his_pay_type_status').then(res => {
      this.backTypeOptions = res.data
    })
    // 查询订单状态字典数据
    this.getDataByType('his_backfee_status').then(res => {
      this.orderBackfeeStatusOptions = res.data
    })
    // 查询订单详情状态字典数据
    this.getDataByType('his_backfee_status').then(res => {
      this.orderBackfeeItemStatusOptions = res.data
    })
    // 查询订单列表
    this.getOrderBackfeeList()
  },
  methods: {
    // 查询退费订单列表
    getOrderBackfeeList() {
      this.loading = true
      getOrderBackForPage(this.queryParams).then(res => {
        this.orderBackfeeTableList = res.data
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getOrderBackfeeList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetQuery()
      this.getOrderBackfeeList()
    },
    // 重置查询条件
    resetParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        registrationId: undefined
      }
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getOrderBackfeeList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getOrderBackfeeList()
    },
    // 退费订单类型翻译
    payTypeFormatter(row) {
      return this.selectDictLabel(this.backTypeOptions, row.backType)
    },
    // 退费订单状态翻译
    backStatusFormatter(row) {
      return this.selectDictLabel(this.orderBackfeeStatusOptions, row.backStatus)
    },
    // 订单详情状态翻译
    orderStatusItemFormatter(row) {
      return this.selectDictLabel(this.orderBackfeeItemStatusOptions, row.status)
    },
    // 打开订单详情
    handleViewOrderItem(row) {
      this.title = '查询【' + row.patientName + '】支付订单详情'
      this.open = true
      this.orderBackfeeItemLoading = true
      getOrderBackfeeItemListByBackId(row.backId).then(res => {
        this.orderBackfeeItemTableList = res.data
        this.orderBackfeeItemLoading = false
      }).catch(() => {
        this.orderBackfeeItemLoading = false
      })
    }
  }
}
</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
