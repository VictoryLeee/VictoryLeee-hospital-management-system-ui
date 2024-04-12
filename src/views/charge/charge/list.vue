
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
        <el-table-column label="收费订单号" align="center" width="210" prop="orderId" />
        <el-table-column label="挂号单号" align="center" width="200" prop="registrationId" />
        <el-table-column label="患者姓名" align="center" prop="patientName" />
        <el-table-column label="总金额" align="center" width="130" prop="orderAmount">
          <template slot-scope="scope">
            <span style="color:red">￥{{ scope.row.orderAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费类型" align="center" prop="payType" :formatter="payTypeFormatter" />
        <el-table-column label="订单状态" align="center" prop="orderStatus" :formatter="orderStatusFormatter" />
        <el-table-column label="创建时间" align="center" width="200" prop="createTime" />
        <el-table-column label="操作" align="center" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" size="mini" @click="handleViewOrderItem(scope.row)">查询订单详情</el-button>
            <el-button type="text" icon="el-icon-bank-card" :disabled="scope.row.orderStatus==='2'" size="mini" @click="handlePayWithCash(scope.row)">现金支付</el-button>
            <el-button type="text" icon="el-icon-bank-card" :disabled="scope.row.orderStatus==='2'" size="mini" @click="handlePayWithZFB(scope.row)">支付宝支付</el-button>
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
          v-loading="orderChargeItemLoading"
          border
          :data="orderChargeItemTableList"
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
      <!-- 支付宝支付的弹出层 -->
      <el-dialog
        title="请使用支付宝支付"
        :visible.sync="openPay"
        center
        :before-close="handleClosePay"
        :close-on-click-modal="false"
      >
        <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
          <el-card>
            <el-form-item label="订单号：">
              <span style="color: red;font-weight:700">{{ payObj.orderId }}</span>
            </el-form-item>
            <el-form-item label="总金额：">
              <span style="color: red;font-weight:700">￥{{ payObj.totalAmount }}</span>
            </el-form-item>
          </el-card>
        </el-form>
        <div style="text-align:center; margin-top:5px; font-weight:600; color:red">
          <vue-qr :text="payObj.payUrl" :size="200" />
          <div>请使用支付宝扫码</div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { getOrderChargeForPage, getOrderChargeByOrderId, getOrderChargeItemByOrderId, toPayOrderWithZFB, payWithCash } from '@/api/charge/ordercharge'
// 引入生成二维码组件 安装命令：npm i --save vue-qr
import vueQr from 'vue-qr'
export default {
  components: {
    vueQr
  },
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 订单详情表格的遮罩层
      orderChargeItemLoading: false,
      // 分页数据总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示支付宝支付的弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        registrationId: undefined
      },
      // 订单数据列表
      orderBackfeeTableList: [],
      // 订单详情列表
      orderChargeItemTableList: [],
      // 订单状态字典数据
      orderStatusOptions: [],
      // 支付类型字典数据
      payTypeOptions: [],
      // 订单详情状态字典数据
      orderStatusItemOptions: [],
      // 支付对象
      payObj: {},
      // 是否打开支付宝二维码弹窗
      openPay: false,
      // 定时轮询对象
      intervalObj: undefined
    }
  },
  created() {
    // 查询支付类型字典数据
    this.getDataByType('his_pay_type_status').then(res => {
      this.payTypeOptions = res.data
    })
    // 查询订单状态字典数据
    this.getDataByType('his_order_charge_status').then(res => {
      this.orderStatusOptions = res.data
    })
    // 查询支付类型字典数据
    this.getDataByType('his_order_charge_status').then(res => {
      this.orderStatusItemOptions = res.data
    })
    // 查询订单列表
    this.getOrderChargeList()
  },
  methods: {
    // 查询订单列表
    getOrderChargeList() {
      this.loading = true
      getOrderChargeForPage(this.queryParams).then(res => {
        this.orderBackfeeTableList = res.data
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getOrderChargeList()
    },
    // 重置查询条件
    resetQuery() {
      this.resetQuery()
      this.getOrderChargeList()
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
      this.getOrderChargeList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getOrderChargeList()
    },
    // 订单类型翻译
    payTypeFormatter(row) {
      return this.selectDictLabel(this.payTypeOptions, row.payType)
    },
    // 订单状态翻译
    orderStatusFormatter(row) {
      return this.selectDictLabel(this.orderStatusOptions, row.orderStatus)
    },
    // 订单详情状态翻译
    orderStatusItemFormatter(row) {
      return this.selectDictLabel(this.orderStatusItemOptions, row.status)
    },
    // 打开订单详情
    handleViewOrderItem(row) {
      this.title = '查询【' + row.patientName + '】支付订单详情'
      this.open = true
      this.orderChargeItemLoading = true
      getOrderChargeItemByOrderId(row.orderId).then(res => {
        this.orderChargeItemTableList = res.data
        this.orderChargeItemLoading = false
      }).catch(() => {
        this.orderChargeItemLoading = false
      })
    },
    // 关闭订单详情
    cancel() {
      this.openPay = false
    },
    // 进行现金支付
    handlePayWithCash(row) {
      this.$confirm('该' + row.patientName + '是否现金支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        payWithCash(row.orderId).then(() => {
          this.msgSuccess('现金支付成功')
          this.loading = false
          this.getOrderChargeList()
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.msgError('现金支付已取消')
        this.loading = false
      })
    },
    // 进行支付宝支付
    handlePayWithZFB(row) {
      toPayOrderWithZFB(row.orderId).then(res => {
        this.payObj = res.data
        const tx = this
        tx.openPay = true
        // 定时轮询
        tx.intervalObj = setInterval(function() {
          // 根据订单ID查询订单信息【验证是否支付成功】
          getOrderChargeByOrderId(tx.payObj.orderId).then(r => {
            // 判断订单状态为支付成功
            if (r.data.orderStatus === '2') {
              // 清除定时器
              clearInterval(tx.intervalObj)
              tx.$notify({
                title: '支付成功',
                message: '【' + tx.payObj.orderId + '】的订单编号支付成功',
                type: 'success'
              })
              tx.openPay = false
              this.getOrderChargeList()
            }
          }).catch(() => {
            // 清除定时器
            clearInterval(tx.intervalObj)
          })
        }, 2000)
      })
    },
    // 取消支付
    handleClosePay() {
      this.$confirm('您确定放弃支付吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.msgError('您已经放弃支付，可以回到收费查询里面再次支付')
        this.openPay = false
        // 关闭轮询
        clearInterval(this.intervalObj)
      }).catch(() => {
        this.msgSuccess('欢迎继续支付')
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
