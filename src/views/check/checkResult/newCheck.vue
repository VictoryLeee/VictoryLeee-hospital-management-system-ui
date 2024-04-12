<template>
  <div>
    <!-- 搜索 -->
    <el-card style="margin-bottom: 3px">
      <el-form :model="queryParams" label-width="68px">
        <el-form-item label="检查项目">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="queryParams.checkItemIds" @change="handleCheckedItemChange">
            <el-checkbox

              v-for="d in checkItemOptions"

              :key="d.checkItemId"

              :label="d.checkItemId"

              :value="d.checkItemId"
            >
              {{ d.checkItemName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="挂号单号">
          <el-input v-model="queryParams.registrationId" placeholder="请输入挂号单号" clearable style="width: 380px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 检查项数据表格 -->
    <el-card style="margin-bottom: 3px">
      <el-table

        v-loading="loading"

        border

        highlight-current-row

        :data="careOrderItemList"

        @current-change="handleCurrentChange"
      >
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column label="详情编码" prop="itemId" align="center" width="300" />
        <el-table-column label="项目名称" prop="itemName" align="center" />
        <el-table-column label="数量" prop="num" align="center" />
        <el-table-column label="单价(元)" prop="price" align="center" />
        <el-table-column label="单价(金额)" prop="amount" align="center" />
        <el-table-column label="备注" prop="amount" align="center" />
        <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      </el-table>
    </el-card>
    <el-card style="margin-bottom: 3px">
      <div v-if="showBottom" v-loading="bottomLoading">
        <div slot="header" style="margin: 10px 0px">
          <el-divider content-position="left">
            <span style="font-size:26px;font-weight: 700;">相关信息</span>
          </el-divider>
        </div>
        <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
          <el-form-item label="挂号单号：">
            <span class="msg-item">{{ careHistory.registrationId }}</span>
          </el-form-item>
          <el-form-item label="患者姓名：">
            <span class="msg-item">{{ careHistory.patientName }}</span>
          </el-form-item>
          <el-form-item label="检查项目：">
            <span class="msg-item">{{ careOrderItem.itemName }}</span>
          </el-form-item>
          <el-form-item label="检查备注：">
            <span class="msg-item">{{ careOrderItem.remark }}</span>
          </el-form-item>
        </el-form>
        <div style="margin: 10px 0px">
          <el-button type="primary" style="width: 100%" icon="el-icon-plus" @click="handleStartCheck">开始检查</el-button>
        </div>
      </div>
      <div v-else style="text-align: center">
        暂无数据
      </div>
    </el-card>
  </div>
</template>
<script>
import { getAllCheckItem } from '@/api/system/checkItem'
import { getCareHistoryAndCareOrderAndCareOrderItemByItemId, getPaidCheckItemList, startCheck } from '@/api/check/checkResult'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 检查项目数据
      checkItemOptions: [],
      // 查询参数
      queryParams: {
        registrationId: undefined,
        checkItemIds: []
      },
      // 是否全选
      checkAll: true,
      // 是否为半选状态
      isIndeterminate: false,
      // 处方详情的表格数据
      careOrderItemList: [],
      // 当前选中的行
      currentRow: undefined,
      // 处方详情的状态字典
      statusOptions: [],
      // 是否显示开始检查的card
      showBottom: false,
      // 下面的开始card的遮罩层
      bottomLoading: false,
      // 详情对象
      careOrderItem: {},
      // 处方对象
      careOrder: {},
      // 病历对象
      careHistory: {}
    }
  },
  created() {
    // 加载所有可用的检查项目
    getAllCheckItem().then(res => {
      this.checkItemOptions = res.data
      this.queryParams.checkItemIds = this.checkItemOptions.map(item => item.checkItemId)
      this.getPaidCheckItemList()
    })
    // 加载状态的数据字典
    this.getDataByType('his_order_details_status').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 查询所有已支付的检查项列表
    getPaidCheckItemList() {
      this.loading = true
      getPaidCheckItemList(this.queryParams).then(res => {
        this.careOrderItemList = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    handleQuery() {
      this.getPaidCheckItemList()
      this.showBottom = false
    },
    // 重置
    resetQuery() {
      this.queryParams = {
        registrationId: undefined,
        checkItemIds: this.checkItemOptions.map(item => item.checkItemId)
      }
      this.showBottom = false
      this.getPaidCheckItemList()
    },
    // 全选
    handleCheckAllChange(val) {
      this.queryParams.checkItemIds = val ? this.checkItemOptions.map(item => item.checkItemId) : []
      this.isIndeterminate = false
      this.getPaidCheckItemList()
    },
    // 选择某一个项目
    handleCheckedItemChange(value) {
      const checkedCount = value.length
      // 全选
      this.checkAll = checkedCount === this.checkItemOptions.length
      // 半选
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkItemOptions.length
      this.getPaidCheckItemList()
    },
    // 选中某一行的之后，进行查询
    handleCurrentChange(val) {
      this.currentRow = val
      if (val !== null) {
        this.bottomLoading = true
        this.showBottom = true
        // 根据详情Id查询处方详情信息、处方信息、病历信息
        getCareHistoryAndCareOrderAndCareOrderItemByItemId(this.currentRow.itemId).then(res => {
          this.careOrderItem = res.data.careOrderItem
          this.careOrder = res.data.careOrder
          this.careHistory = res.data.careHistory
          this.bottomLoading = false
        }).catch(() => {
          this.bottomLoading = false
        })
      }
    },
    // 翻译处方详情状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 开始检查
    handleStartCheck() {
      const tx = this
      tx.$confirm('是否确定开始检查?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        startCheck(this.careOrderItem.itemId).then(() => {
          tx.msgSuccess('开始检查成功')
          this.getPaidCheckItemList()
          this.showBottom = false
        })
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
  .msg-item {
    font-size: 14px;
    margin-bottom: 8px;
    /* 设置css里的内容自动换行 */
    word-break:break-all;
  }
</style>
