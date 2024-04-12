<template>
  <div>
    <!-- 查询条件 -->
    <el-form ref="queryParams" :model="queryParams" :inline="true" label-width="98px" size="small">
      <el-form-item label="采购单号">
        <el-input v-model="queryParams.purchaseId" placeholder="请输入采购单号" style="width: 180px" clearable />
      </el-form-item>
      <el-form-item label="申请人">
        <el-input v-model="queryParams.applyUserName" clearable placeholder="请输入申请人" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-select v-model="queryParams.providerId" clearable placeholder="请选择供应商" style="width:180px">
          <el-option
            v-for="dict in providerOptions"
            :key="dict.providerId"
            :label="dict.providerName"
            :value="dict.providerId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" clearable placeholder="请选择状态" style="width:180px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="storageDateRange"
          style="width:350px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholde="入库开始时间"
          end-placeholde="入库结束时间"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width:350px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholde="开始日期"
          end-placeholde="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" round @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" round size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 按钮栏 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" round size="mini" @click="handleToNewPurchase">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" :disabled="multiple" round size="mini" @click="handleDeletePurchase">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-s-claim" round size="mini" :disabled="single" @click="handleDoAudit">审核</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-s-release" round size="mini" :disabled="single" @click="handleDoInvalid">作废</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="purchaseTableList"
      border
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="purchaseId" label="采购单号" :show-overflow-tooltip="true" width="180px" align="center" />
      <el-table-column prop="providerId" label="供应商" :show-overflow-tooltip="true" width="180px" align="center" :formatter="providerFormatter" />
      <el-table-column prop="purchaseTradeTotalAmount" label="采购批发总额" :show-overflow-tooltip="true" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purchaseTradeTotalAmount | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyUserName" label="申请人" :show-overflow-tooltip="true" width="110px" align="center" />
      <el-table-column prop="status" label="状态" width="90px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="info" effect="dark">待审核</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="success" effect="dark">已审核</el-tag>
          <el-tag v-else-if="scope.row.status == 3" type="danger" effect="dark">已作废</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="auditMsg" label="审核信息" width="180px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="createBy" label="创建人" width="120px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateTime" label="修改时间" width="160px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateBy" label="修改人" width="120px" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1 || scope.row.status == 2" type="text" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.status == 1 || scope.row.status == 3" type="text" size="mini" icon="el-icon-delete" @click="handleDeletePurchase(scope.row)">删除</el-button>
          <el-button v-if="scope.row.status == 2" type="text" size="mini" icon="el-icon-refresh-left" @click="handleReflectingAudit(scope.row)">反审</el-button>
          <el-button v-if="scope.row.status == 1 || scope.row.status == 2" type="text" size="mini" icon="el-icon-s-release" @click="handleDoInvalid(scope.row)">作废</el-button>
          <el-button v-if="scope.row.status == 3" type="text" size="mini" icon="el-icon-s-release" @click="handleNoDoInvalid(scope.row)">反作废</el-button>
          <el-button type="text" size="mini" icon="el-icon-tickets" @click="handleLook(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件开始 -->
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

    <!-- 查看明细弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="openPurItem"
      width="70%"
      :before-close="handleClose"
    >
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="purItemList"
        border
        style="width: 100%"
        size="small"
      >
        <el-table-column prop="purchaseId" label="采购单号" width="200px" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="medicinesName" label="药品名称" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="purchaseNumber" label="采购数" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="inventoryLogNum" label="入库数" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="unit" label="单位" width="80px" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="isPutStock" label="是否入库" width="80px" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPutStock === 0" type="info" effect="dark">未入库</el-tag>
            <el-tag v-else-if="scope.row.isPutStock === 1" type="success" effect="dark">已入库</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tradePrice" label="单价" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="tradeTotalAmount" label="总额" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="batchNumber" label="生产批次号" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getProviderAll } from '@/api/erp/provider'
import { listPurchaseForPage, doInvalid, doNoInvalid, auditPass, deletePurchaseAndItem, reflectingAudit, getPurItemByPurchaseId } from '@/api/erp/purchase'
export default {
  filters: {
    // 保留两位小数
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 选择的对象
      selectedObj: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 采购数据表格
      purchaseTableList: [],
      // 判断是否已审核 默认未审核
      isCheckAudit: false,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 供应商数据字典
      providerOptions: [],
      // 时间条件
      dateRange: [],
      // 入库时间
      storageDateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyUserName: undefined,
        providerId: undefined,
        status: undefined
      },
      // 采购明细表
      purItemList: [],
      // 控制查看明细弹窗
      openPurItem: false
    }
  },
  created() {
    // 查询状态数据字典
    this.getDataByType('his_order_status').then(res => {
      this.statusOptions = res.data
    })
    getProviderAll().then(res => {
      this.providerOptions = res.data
    })
    this.getPurchaseList()
  },
  methods: {
    // 查询数据表格
    getPurchaseList() {
      if (this.storageDateRange != null && this.storageDateRange !== '' && this.storageDateRange !== undefined) {
        this.queryParams.storageOptTimeStart = this.storageDateRange[0]
        this.queryParams.storageOptTimeEnd = this.storageDateRange[1]
      }
      this.loading = true
      listPurchaseForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.purchaseTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getPurchaseList()
    },
    // 重置查询条件
    resetQuery() {
      this.dateRange = []
      this.storageDateRange = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        applyUserName: undefined,
        providerId: undefined,
        status: undefined
      }
      this.getPurchaseList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      // 存储对象（采购单号和状态值）这里存储对象，是为了后判断状态
      this.selectedObj = selection
      this.single = selection.length !== 1
      this.multiple = !selection.length > 0
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getPurchaseList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getPurchaseList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 翻译供应商
    providerFormatter(row) {
      let name = ''
      this.providerOptions.filter(item => {
        if (parseInt(item.providerId) === parseInt(row.providerId)) {
          name = item.providerName
        }
      })
      return name
    },
    // 审核
    handleDoAudit() {
      if (parseInt(this.selectedObj[0].status) === 1) {
        const purchaseId = this.selectedObj[0].purchaseId
        const tx = this
        tx.$confirm('<strong>是否审核此单号为<span style="color: green;font-weight: 700;">' + purchaseId + '</span>的数据?</strong>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          auditPass(purchaseId).then(() => {
            tx.msgSuccess('审核成功')
            tx.getPurchaseList()
          })
        })
      } else if (parseInt(this.selectedObj[0].status) === 2) {
        this.$alert('<strong>此订单不是已审核，不能再审核</strong>', '提示信息', {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        })
      } else {
        this.$alert('<strong>此订单不是待审核状态，不能审核</strong>', '提示信息', {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        })
      }
    },
    // 作废
    handleDoInvalid(row) {
      // console.log(row)
      // console.log(this.selectedObj)
      if (this.selectedObj.length > 0) {
        this.selectedObj.forEach(e => {
          const tx = this
          tx.$confirm('<strong>是否作废此单号为<span style="color: green;font-weight: 700;">' + e.purchaseId + '</span>的数据?</strong>', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            doInvalid(e.purchaseId).then(() => {
              tx.msgSuccess('作废成功')
              tx.getPurchaseList()
            })
          })
        })
      } else {
        const tx = this
        tx.$confirm('<strong>是否作废此单号为<span style="color: green;font-weight: 700;">' + row.purchaseId + '</span>的数据?</strong>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          doInvalid(row.purchaseId).then(() => {
            tx.msgSuccess('作废成功')
            tx.getPurchaseList()
          })
        })
      }
    },
    // 反作废
    handleNoDoInvalid(row) {
      this.$confirm('<strong>是否反作废此单号为<span style="color: green;font-weight: 700;">' + row.purchaseId + '</span>的数据?</strong>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        doNoInvalid(row.purchaseId).then(() => {
          this.msgSuccess('反作废成功')
          this.getPurchaseList()
        })
      })
    },
    // 反审单据 反审后状态为未审核
    handleReflectingAudit(row) {
      const tx = this
      tx.$confirm('<strong>是否反审此单号为<span style="color: green;font-weight: 700;">' + row.purchaseId + '</span>的数据?</strong>', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        reflectingAudit(row.purchaseId).then(() => {
          tx.msgSuccess('反审成功')
          tx.getPurchaseList()
        })
      })
    },
    // 删除采购订单
    handleDeletePurchase(row) {
      const purchaseIds = []
      var str = null
      if (row !== null) {
        if (parseInt(row.status) === 2) {
          str += '此订单号<strong>' + row.purchaseId + '</strong>是<span style="color: blue;font-weight: 700;">已审核</span>，不能删除</br>'
        } else if (parseInt(row.status) === 4) {
          str += '此订单号<strong>' + row.purchaseId + '</strong>是<span style="color: green;font-weight: 700;">已入库</span>，不能删除</br>'
        }
      }
      // console.log(this.selectedObj)
      this.selectedObj.forEach(e => {
        console.log(e.status)
        // 判断是已审核还是已入库，然后把字符串追加到后面
        if (e.status === '2') {
          str += '此订单号<strong>' + e.purchaseId + '</strong>是<span style="color: blue;font-weight: 700;">已审核</span>，不能删除</br>'
        } else if (e.status === '4') {
          str += '此订单号<strong>' + e.purchaseId + '</strong>是<span style="color: green;font-weight: 700;">已入库</span>，不能删除</br>'
        }
        purchaseIds.push(e.purchaseId)
      })
      // }
      // console.log(str)
      if (str === null) {
        // console.log(purchaseIds)
        // 批量删除或右侧点删除
        const ids = row.purchaseId || purchaseIds + ''
        this.$confirm('<p style="word-break:break-all;">是否删除此订单号为<span style="color: green;font-weight: 700;">' + ids + '</span>的数据?</p>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'msgBox',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          deletePurchaseAndItem(ids).then(() => {
            this.msgSuccess('删除成功')
            this.getPurchaseList()
          })
        })
      } else {
        this.$alert(str, '提示信息', {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        })
      }
    },
    // 跳转到采购的页面
    handleToNewPurchase() {
      this.$router.replace('/erp/purchase/newPurchase')
    },
    // 跳转到采购修改的页面
    handleUpdate(row) {
      if (row.status === '2') {
        this.$alert('<strong>此订单已是审核，只能反审后才能修改</strong>', '提示信息', {
          dangerouslyUseHTMLString: true,
          type: 'warning'
        })
        return
      }
      // 跳转到修改页面
      this.$router.replace('/erp/purchase/editPurchase/' + row.purchaseId)
    },
    // 查看单据明细
    handleLook(row) {
      // 根据采购主表id查询采购明细表
      getPurItemByPurchaseId(row.purchaseId).then(res => {
        this.purItemList = res.data
      })
      this.openPurItem = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style>
.msgBox {
  width: 400px;
}
</style>
