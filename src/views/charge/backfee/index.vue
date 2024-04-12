<template>
  <div v-loading="loading" :element-loading-text="loadingText">
    <!-- 表单查询 -->
    <el-card>
      <el-form ref="queryForm" label-width="88px" size="small">
        <el-form-item label="挂号单号" prop="registrationId">
          <el-input
            v-model="registrationId"
            clearable
            placeholder="请输入挂号单号"
            style="width:300px; margin-right:5px"
          />
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-if="careHistory.registrationId !== undefined" style="margin-top:5px">
      <!-- 输入挂号单点查询后，显示的挂号信息 -->
      <div slot="header" style="text-align: left;font-size:20px;font-weight: 700;">
        <span>挂号信息</span>
      </div>
      <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-form-item label="挂号单号：" class="msg-item">
          {{ careHistory.registrationId }}
        </el-form-item>
        <el-form-item label="医生姓名：" class="msg-item">
          {{ careHistory.userName }}
        </el-form-item>
        <el-form-item label="科室名称：" class="msg-item">
          {{ careHistory.deptName }}
        </el-form-item>
        <el-form-item label="患者姓名：" class="msg-item">
          {{ careHistory.patientName }}
        </el-form-item>
        <el-form-item label="就诊时间：" class="msg-item">
          {{ careHistory.careTime }}
        </el-form-item>
        <el-form-item label="主诉：" class="msg-item">
          {{ careHistory.caseTitle }}
        </el-form-item>
        <el-form-item label="诊断信息：" class="msg-item">
          {{ careHistory.caseResult }}
        </el-form-item>
        <el-form-item label="医生建议：" class="msg-item">
          {{ careHistory.doctorTips }}
        </el-form-item>
      </el-form>
      <el-divider />
      <!-- 工具按钮 -->
      <div style="margin-bottom: 5px">
        <el-button type="success" size="small" icon="el-icon-finished" @click="handleSelectAll">全选</el-button>
        <el-button type="success" size="small" icon="el-icon-finished" @click="handleUnSelectAll">取消全选</el-button>
        <el-button type="danger" size="small" icon="el-icon-bank-card" @click="handleBackfeeWithCash">现金退费</el-button>
        <el-button type="danger" size="small" icon="el-icon-bank-card" @click="handleBackfeeWithZFB">支付宝退费</el-button>
        <span style="margin-left: 10px; float: right; font-weight:600">订单金额:<span style="color: red;margin-left:5px">￥{{ allAmount }}</span>
        </span>
      </div>
    </el-card>
    <el-card v-else style="margin-top:5px">
      <div style="text-align:center;font-weight:600;color:red">请输入正确的挂号单号，然后点击查询</div>
    </el-card>

    <el-card v-if="careOrderList.length>0" style="margin-top:5px">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="(item, index) in careOrderList" :key="index" :name="index">
          <template slot="title">
            <span style="font-weight: 550;">{{ index+1 }}、
              <span v-if="item.coType === '0'" style="color:red">药品处方</span>
              <span v-else style="color:green">检查处方</span> 、金额:<span style="color:red">￥ {{ item.allAmount }}</span>
              ，支付方式：<span style="font-weight:700;color: red">{{ item.payType==="0"?'现金':'支付宝' }}</span>
            </span>
          </template>
          <el-table
            ref="refTable"
            v-loading="loading"
            border
            :data="item.careOrderItemList"
            :row-class-name="tableRowClassName"
            @selection-change="handleCareOrderItemSelectionChange($event, item.coId)"
          >
            <el-table-column align="center" type="selection" width="50" />
            <el-table-column label="序号" align="center" type="index" width="50" />
            <el-table-column :label="item.coType==='0'?'药品处方':'项目名称'" align="center" prop="itemName" />
            <el-table-column label="数量" align="center" prop="num" />
            <el-table-column label="单价(元)" align="center" prop="price" />
            <el-table-column label="金额(元)" align="center" prop="amount" />
            <el-table-column label="备注" align="center" prop="remark" />
            <el-table-column label="状态" align="center" prop="status" :formatter="orderDetailsStatusFormatter" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
import { addOrderBackfeeWithCash, addOrderBackfeeWithZFB, getChargeRegistrationAndCareHistoryAndCareOrderDataByRegId } from '@/api/charge/orderbackfee'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 遮罩层的文字
      loadingText: '',
      // 挂号单
      registrationId: '',
      // 病历对象
      careHistory: {},
      // 处方信息
      careOrderList: [],
      // 处方详情状态
      statusOptions: [],
      // 当前选中的订单总额
      allAmount: 0.00,
      // 当前选中的所有项目集合
      itemObjList: [],
      // 展开的折叠板的名字
      activeNames: []
    }
  },
  created() {
    // 加载处方详情状态 的字典数据
    this.getDataByType('his_order_details_status').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 根据挂号单查询未支付的病历信息和处方信息和处方详情信息
    handleQuery() {
      if (this.registrationId === '') {
        this.msgError('请输入挂号单')
        this.resetCurrentParams()
        return
      }
      this.careHistory = {}
      this.careOrderList = []
      this.itemObjList = []
      this.loading = true
      this.loadingText = '数据查询中，请稍后...'
      getChargeRegistrationAndCareHistoryAndCareOrderDataByRegId(this.registrationId).then(res => {
        this.careHistory = res.data.careHistory
        this.careOrderList = res.data.careOrderList
        this.loading = false
        this.loadingText = ''
        this.careOrderList.filter((c, index) => {
          this.activeNames.push(index)
        })
      }).catch(() => {
        this.loading = false
        this.loadingText = ''
      })
    },
    // 全选
    handleSelectAll() {
      const tables = this.$refs.refTable
      tables.filter(t => {
        t.clearSelection()
        t.toggleAllSelection()
      })
    },
    // 取消全选
    handleUnSelectAll() {
      const tables = this.$refs.refTable
      tables.filter(t => {
        t.clearSelection()
      })
    },
    // 现金支付
    handleBackfeeWithCash() {
      if (this.itemObjList.length === 0) {
        this.msgError('请选择要退费的选项')
        return
      }
      // 组装数据
      const orderChargeFromDto = this.createOrderCharge()
      this.loading = true
      this.loadingText = '订单创建并现金退费中...'
      this.$confirm('是否确定创建订单并使用现金退费?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addOrderBackfeeWithCash(orderChargeFromDto).then(() => {
          this.msgSuccess('订单创建并现金退费成功')
          this.resetCurrentParams()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 支付宝支付
    handleBackfeeWithZFB() {
      if (this.itemObjList.length === 0) {
        this.msgError('请选择要退费的选项')
        return
      }
      // 组装数据
      const orderChargeFromDto = this.createOrderCharge()
      this.loading = true
      this.loadingText = '订单创建并支付宝退费中...'
      this.$confirm('是否确定创建订单并使用支付宝退费?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addOrderBackfeeWithZFB(orderChargeFromDto).then(res => {
          this.resetCurrentParams()
          this.msgSuccess('支付宝退费成功')
          this.loading = false
        }).catch(() => {
          this.msgError('创建退费订单失败')
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 组装支付数据
    createOrderCharge() {
      // 组装数据
      const orderBackfeeFormDto = {
        orderBackfee: {
          backAmount: this.allAmount,
          chId: this.careHistory.chId,
          registrationId: this.careHistory.registrationId,
          patientName: this.careHistory.patientName
        },
        orderBackfeeItemList: []
      }
      // 筛选选中的所有项目集合
      this.itemObjList.filter(item => {
        const i = {
          itemId: item.itemId,
          coId: item.coId,
          itemName: item.itemName,
          itemPrice: item.price,
          itemNum: item.num,
          itemType: item.itemType,
          itemAmount: item.amount
        }
        orderBackfeeFormDto.orderBackfeeItemList.push(i)
      })
      return orderBackfeeFormDto
    },
    // 清空病历信息和处方列表
    resetCurrentParams() {
      this.careHistory = {}
      this.careOrderList = []
    },
    // 获取表格的索引
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 监听多个表格checkbox事件
    handleCareOrderItemSelectionChange(selection, coId) {
      if (this.itemObjList.length === 0) {
        this.itemObjList = selection
      } else {
        for (let i = 0; i < this.itemObjList.length; i++) {
          const obj = this.itemObjList[i]
          if (obj.coId === coId) {
            this.itemObjList.splice(i, 1)
            i--
          }
        }
        // 最后重新添加
        selection.filter(newItem => {
          this.itemObjList.push(newItem)
        })
      }
      // 重新计算选中的金额
      this.computeAllAmount()
    },
    // 重新计算选中的金额
    computeAllAmount() {
      this.allAmount = 0
      this.itemObjList.filter(item => {
        this.allAmount += item.amount
      })
    },
    // 翻译处方详情状态
    orderDetailsStatusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
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
  .msg-item {
    font-size: 15px;
    font-weight: 600;
    /* 设置css里的内容自动换行 */
    word-break:break-all;
  }
</style>

