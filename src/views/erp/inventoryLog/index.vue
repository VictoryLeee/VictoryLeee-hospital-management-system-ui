<template>
  <div>
    <!-- 卡片切换  -->
    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
      <!-- 药品总库存 -->
      <el-tab-pane label="药品总库存" name="medicinesTab">
        <!-- 查询条件 -->
        <el-form ref="queryParams" :model="queryParams" :inline="true" label-width="68px" size="mini">
          <el-form-item label="药品编号">
            <el-input v-model="queryParams.medicinesNumber" clearable placeholder="请输入药品编号" />
          </el-form-item>
          <el-form-item label="药品名称" prop="medicinesName">
            <el-input
              v-model="queryParams.medicinesName"
              placeholder="请输入药品名称"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="关键字" prop="keywords">
            <el-input
              v-model="queryParams.keywords"
              placeholder="请输入关键字"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="药品类型" prop="medicinesType">
            <el-select
              v-model="queryParams.medicinesType"
              placeholder="请输入药品类型"
              clearable
              style="width: 180px"
            >
              <el-option
                v-for="dict in medicinesTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂家" prop="producterId">
            <el-select
              v-model="queryParams.producterId"
              placeholder="请输入生产厂家"
              clearable
              style="width: 180px"
            >
              <el-option
                v-for="dict in producterOptions"
                :key="dict.producterId"
                :label="dict.producterName"
                :value="dict.producterId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处方类型" prop="prescriptionType">
            <el-select
              v-model="queryParams.prescriptionType"
              placeholder="请输入处方类型"
              clearable
              style="width: 180px"
            >
              <el-option
                v-for="dict in producterOptions"
                :key="dict.producterId"
                :label="dict.producterName"
                :value="dict.producterId"
              />
            </el-select>
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
            <el-button type="success" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table v-loading="loading" border :data="medicinesTableList" size="mini">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="单位：">
                  <span>{{ props.row.unit }}</span>
                </el-form-item>
                <el-form-item label="库存量：">
                  <span style="color: green; font-weight: 700">{{ props.row.medicinesStockNum }}</span>
                </el-form-item>
                <el-form-item label="换算量：">
                  <span>{{ props.row.conversion }}</span>
                </el-form-item>
                <el-form-item label="预警值：">
                  <span style="color: red; font-weight: 700">{{ props.row.medicinesStockDangerNum }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="medicinesNumber" label="药品编号" :show-overflow-tooltip="true" width="120px" align="center" style="color: red" />
          <el-table-column prop="medicinesName" label="药品名称" :show-overflow-tooltip="true" width="150px" align="center" />
          <el-table-column prop="medicinesType" label="药品分类" :show-overflow-tooltip="true" width="100px" align="center" :formatter="medicinesTypeFormatter" />
          <el-table-column prop="prescriptionType" label="处方类型" :show-overflow-tooltip="true" width="100px" align="center" :formatter="prescriptionTypeFormatter" />
          <el-table-column prop="prescriptionPrice" label="处方价格" :show-overflow-tooltip="true" width="80px" align="center" />
          <el-table-column prop="keywords" label="关键字" :show-overflow-tooltip="true" width="70px" align="center" />
          <el-table-column prop="producterId" label="生产厂家" width="150px" :formatter="producterFormatter" :show-overflow-tooltip="true" align="center" />
          <el-table-column prop="status" label="状态" width="70px" :formatter="statusFormatter" align="center" />
          <el-table-column prop="remark" label="备注" width="150px" :show-overflow-tooltip="true" align="center" />
          <el-table-column prop="createTime" label="创建时间" width="135px" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="createBy" label="创建人" width="100px" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="updateTime" label="修改时间" width="135px" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="updateBy" label="修改人" width="100px" align="center" :show-overflow-tooltip="true" />
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
      </el-tab-pane>
      <el-tab-pane label="批次库存及价格" name="inventoryLogTab">
        <!-- 查询条件开始 -->
        <el-form ref="queryLogForm" :model="queryLogParams" :inline="true" label-width="88px" size="mini">
          <el-form-item label="入库单号">
            <el-input v-model="queryLogParams.inventoryLogId" placeholder="请输入采购单号" style="width: 180px" clearable />
          </el-form-item>
          <el-form-item label="采购单号">
            <el-input v-model="queryLogParams.purchaseId" placeholder="请输入采购单号" style="width: 180px" clearable />
          </el-form-item>
          <el-form-item label="药品名称">
            <el-input v-model="queryLogParams.medicinesName" placeholder="请输入药品名称" style="width: 180px" clearable />
          </el-form-item>
          <el-form-item label="药品类型">
            <el-select v-model="queryLogParams.medicinesType" placeholder="药品类型" style="width: 180px" clearable>
              <el-option v-for="dict in medicinesTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂家" prop="producterId">
            <el-select
              v-model="queryLogParams.producterId"
              placeholder="请输入生产厂家"
              clearable
              style="width: 180px"
            >
              <el-option
                v-for="dict in producterOptions"
                :key="dict.producterId"
                :label="dict.producterName"
                :value="dict.producterId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处方类型">
            <el-select v-model="queryLogParams.prescriptionType" placeholder="处方类型" style="width: 180px" clearable>
              <el-option v-for="dict in prescriptionTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateLogRange"
              style="width:350px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            <el-button type="warning" icon="el-icon-s-home" @click="openInventoryLog">入库</el-button>
          </el-form-item>
        </el-form>
        <!-- 数据表格 -->
        <el-table v-loading="loading" border :data="inventoryLogTableList" size="mini">
          <el-table-column label="入库号" align="center" prop="inventoryLogId" :show-overflow-tooltip="true" width="200px" />
          <el-table-column label="采购单号" align="center" prop="purchaseId" :show-overflow-tooltip="true" width="170px" />
          <el-table-column label="药品编码" align="center" prop="medicinesNumber" :show-overflow-tooltip="true" width="105px" />
          <el-table-column label="药品名称" align="center" prop="medicinesName" :show-overflow-tooltip="true" width="125px" />
          <el-table-column label="入库数" prop="inventoryLogNum" :show-overflow-tooltip="true" width="90px" align="center" />
          <el-table-column label="入库时间" align="center" prop="createTime" width="135px" />
          <el-table-column label="单价" align="center" :show-overflow-tooltip="true" width="90px" prop="tradePrice">
            <template slot-scope="scope">
              <span>{{ scope.row.tradePrice | rounding }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总额" align="center" :show-overflow-tooltip="true" width="120px" prop="tradeTotalAmount">
            <template slot-scope="scope">
              <span>{{ scope.row.tradeTotalAmount | rounding }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center" :show-overflow-tooltip="true" width="90px">
            <template slot-scope="scope">
              <span>{{ scope.row.conversion }} {{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批次号" align="center" prop="batchNumber" :show-overflow-tooltip="true" width="90px" />
          <el-table-column label="生产厂家" align="center" :show-overflow-tooltip="true" width="180px" prop="producterId" :formatter="producterFormatter" />
          <el-table-column label="药品类型" align="center" prop="medicinesType" :show-overflow-tooltip="true" width="70px" :formatter="medicinesTypeFormatter" />
          <el-table-column label="处方类型" align="center" prop="prescriptionType" :show-overflow-tooltip="true" width="80px" :formatter="prescriptionTypeFormatter" />
        </el-table>
        <!-- 分页插件开始 -->
        <el-pagination
          v-show="total>0"
          :current-page="queryLogParams.pageNum"
          :page-sizes="[10, 20, 30]"
          :page-size="queryLogParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalLog"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 入库弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="openLog"
      width="900px"
      center
      append-to-body
      :before-close="closeDialog"
    >
      <!-- 查询条件 -->
      <el-form ref="queryPurParams" :model="queryPurParams" :inline="true" label-width="98px" size="small">
        <el-form-item label="采购单号">
          <el-input v-model="queryPurParams.purchaseId" placeholder="请输入采购单号" style="width: 180px" clearable />
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="queryPurParams.applyUserName" clearable placeholder="请输入申请人" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="queryPurParams.providerId" clearable placeholder="请选择供应商" style="width:180px">
            <el-option
              v-for="dict in providerOptions"
              :key="dict.providerId"
              :label="dict.providerName"
              :value="dict.providerId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="datePurRangeLog"
            style="width:350px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholde="开始日期"
            end-placeholde="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" round @click="getPurchaseList">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" round size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="purchaseTableList"
        border
        style="width: 100%"
        size="small"
        @row-click="handlePurItem"
      >
        <el-table-column prop="purchaseId" label="采购单号" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="providerId" label="供应商" :show-overflow-tooltip="true" align="center" :formatter="providerFormatter" />
        <el-table-column prop="purchaseTradeTotalAmount" label="采购批发总额" :show-overflow-tooltip="true" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.purchaseTradeTotalAmount | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyUserName" label="申请人" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="status" label="状态" width="90px" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 2" effect="dark">已审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true" />
      </el-table>
      <!-- 分页插件开始 -->
      <el-pagination
        v-show="totalPur>0"
        :current-page="queryPurParams.pageNum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryPurParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPur"
        @size-change="handlePurSizeChange"
        @current-change="handlePurCurrentChange"
      />
    </el-dialog>

    <!-- 选择单据明细弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="openPurItem"
      width="1200px"
      center
      append-to-body
      :before-close="closeDialog"
    >
      <el-row :gutter="10" style="margin-bottom:  8px;">
        <el-col :span="1.5">
          <el-button type="primary" round icon="el-icon-plus" size="mini" @click="handlePutStock">入库</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="purItemList"
        border
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="purchaseId" label="采购单号" width="200px" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="medicinesName" label="药品名称" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="purchaseNumber" label="采购数" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="inventoryLogNum" label="入库数" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="inventoryLogPending" label="待入库数" width="80px" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.inventoryLogPending" type="number" min="1" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80px" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="tradePrice" label="单价" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="tradeTotalAmount" label="总额" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="batchNumber" label="生产批次号" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getProducterAll } from '@/api/erp/producter'
import { getProviderAll } from '@/api/erp/provider'
import { listMedicinesForPage } from '@/api/erp/medicines'
import { listInventoryLogForPage, savePutStock } from '@/api/erp/inventoryLog'
import { listPurchaseForPageNoPutStock, getPurItemByPurchaseIdAndIsPutStock } from '@/api/erp/purchase'
export default {
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 当前激活的tab
      activeName: 'medicinesTab',
      // 分页数据总条数
      total: 0,
      // 入库分页数据总条数
      totalLog: 0,
      // 字典表格数据
      medicinesTableList: [],
      // 字典表格数据
      inventoryLogTableList: [],
      // 状态数据字典
      statusOptions: [],
      // 药品类型数据字典
      medicinesTypeOptions: [],
      // 生产厂家数据
      producterOptions: [],
      // 处方类型数据字典
      prescriptionTypeOptions: [],
      // 日期范围数组
      dateRange: [],
      // 日期范围数组
      dateLogRange: [],
      // 日期范围数组
      datePurRangeLog: [],
      // 药品查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        proudcterId: undefined
      },
      // 入库详情查询参数
      queryLogParams: {
        pageNum: 1,
        pageSize: 10,
        inventoryLogId: undefined,
        purchaseId: undefined,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        producterId: undefined
      },
      queryPurParams: {
        pageNum: 1,
        pageSize: 10,
        status: 2, // 2为未审核
        applyUserName: undefined,
        providerId: undefined
      },
      // 弹窗标题
      title: undefined,
      // 打开入库弹窗
      openLog: false,
      // 采购数据表格
      purchaseTableList: [],
      // 采购订单条数
      totalPur: 0,
      // 供应商数据字典
      providerOptions: [],
      // 控制打开单据明细弹窗
      openPurItem: false,
      // 采购明细表
      purItemList: [],
      // 选中的数据项
      selectObj: [],
      // 当前订单主表id
      currPurchaseId: undefined
    }
  },
  created() {
    // 查询状态数据字典
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 查询药品分类数据字典
    this.getDataByType('his_medicines_type').then(res => {
      this.medicinesTypeOptions = res.data
    })
    // 查询药品处方数据字典
    this.getDataByType('his_prescription_type').then(res => {
      this.prescriptionTypeOptions = res.data
    })
    // 查询所有可用的生产厂家
    getProducterAll().then(res => {
      this.producterOptions = res.data
    })
    // 查询所有供应商
    getProviderAll().then(res => {
      this.providerOptions = res.data
    })
    // 查询表格数据
    this.getMedicinesList()
  },
  methods: {
    // 点击tab调用的事件
    handleClick(tab, event) {
      console.log(this.activeName)
      if (this.activeName === 'medicinesTab') {
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.getInventoryLogList()
      }
    },
    // 查询药品信息
    getMedicinesList() {
      this.loading = true
      listMedicinesForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.medicinesTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 查看入库记录
    getInventoryLogList() {
      this.loading = true
      listInventoryLogForPage(this.addDateRange(this.queryLogParams, this.dateLogRange)).then(res => {
        this.inventoryLogTableList = res.data
        this.totalLog = res.total
        this.loading = false
      })
    },
    // 药品条件查询
    handleQuery() {
      if (this.activeName === 'medicinesTab') {
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.getInventoryLogList()
      }
    },
    // 药品重置查询条件
    resetQuery() {
      if (this.activeName === 'medicinesTab') {
        this.resetFormM()
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.resetFormL()
        this.getInventoryLogList()
      }
    },
    // 分页 pageSize 变化时触发
    handleSizeChange(val) {
      if (this.activeName === 'medicinesTab') {
        this.queryParams.pageSize = val
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.queryLogParams.pageSize = val
        this.getInventoryLogList()
      }
    },
    // 点击上一页 下一页吗，跳转到那一页时触发
    handleCurrentChange(val) {
      if (this.activeName === 'medicinesTab') {
        this.queryParams.pageNum = val
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.queryLogParams.pageNum = val
        this.getInventoryLogList()
      }
    },
    // 分页 pageSize 变化时触发
    handlePurSizeChange(val) {
      this.queryPurParams.pageSize = val
      this.getPurchaseList()
    },
    // 点击上一页 下一页吗，跳转到那一页时触发
    handlePurCurrentChange(val) {
      this.queryPurParams.pageNum = val
      this.getPurchaseList()
    },
    // 选中的对象
    handleSelectionChange(selection) {
      this.selectObj = selection
    },
    // 重置药品查询条件
    resetFormM() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        proudcterId: undefined
      }
      this.dateRange = []
    },
    // 重置入库查询条件
    resetFormL() {
      this.queryLogParams = {
        pageNum: 1,
        pageSize: 10,
        purchaseId: undefined,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        producterId: undefined
      }
      this.dateLogRange = []
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 翻译生产厂家名称
    producterFormatter(row) {
      let name = ''
      this.producterOptions.filter(item => {
        if (parseInt(item.producterId) === parseInt(row.producterId)) {
          name = item.producterName
        }
      })
      return name
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
    // 药品名称状态
    medicinesTypeFormatter(row) {
      return this.selectDictLabel(this.medicinesTypeOptions, row.medicinesType)
    },
    // 处方类型名称状态
    prescriptionTypeFormatter(row) {
      return this.selectDictLabel(this.prescriptionTypeOptions, row.prescriptionType)
    },
    // 打开入库弹窗
    openInventoryLog() {
      this.title = '待入库单据'
      this.openLog = true
      this.getPurchaseList()
    },
    closePurItemDialog(done) {
      this.$confirm('是否关闭此弹窗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done()
      }).catch(_ => {})
      this.resetQueryPur()
      this.openLog = false
    },
    //  关闭弹窗
    closeDialog(done) {
      this.$confirm('是否关闭此弹窗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done()
      }).catch(_ => {})
      this.openPurItem = false
    },
    // 重置带操作弹窗的查询条件
    resetQueryPur() {
      this.queryPurParams = {
        pageNum: 1,
        pageSize: 10,
        status: 2, // 2为未审核
        applyUserName: undefined,
        providerId: undefined
      }
    },
    // 查询数据表格
    getPurchaseList() {
      this.loading = true
      listPurchaseForPageNoPutStock(this.addDateRange(this.queryPurParams, this.datePurRangeLog)).then(res => {
        this.purchaseTableList = res.data
        this.totalPur = res.total
        this.loading = false
      })
    },
    // 打开选择单据明细
    handlePurItem(row, event, column) {
      this.title = '单据明细列表'
      this.openPurItem = true
      this.currPurchaseId = row.purchaseId
      // 根据采购主表id查询明细数据
      getPurItemByPurchaseIdAndIsPutStock(row.purchaseId).then(res => {
        this.purItemList = res.data
      })
    },
    // 入库
    handlePutStock() {
      if (this.selectObj.length === 0) {
        this.$message({
          type: 'info',
          message: '你选择要入库的项'
        })
        return
      }
      var msgTxt = ''
      this.selectObj.forEach(e => {
        if (e.inventoryLogPending === undefined || e.inventoryLogPending === 0) {
          msgTxt += '<strong><span style="font-weight: 700;">采购单号为：<span style="color: green">' + e.purchaseId + '</span>的【' + e.medicinesName + '】药品，数量不能为空或为0</span></strong></br>'
        }
        // 获取待入库数  采购10 入库5 待入库6 所以不对 提示
        const count = e.purchaseNumber - e.inventoryLogNum
        if (count < e.inventoryLogPending) {
          msgTxt += '<strong><span style="font-weight: 700;">采购单号为：<span style="color: green">' + e.purchaseId +
           '</span>的【' + e.medicinesName + '】药品，<span style="color: red">采购：' + e.purchaseNumber + '、入库：' + e.inventoryLogNum + '，不能超过待入库数</span></span></strong></br>'
        }
      })
      // console.log(msgTxt)
      if (msgTxt !== '') {
        this.$alert(msgTxt, '提示信息', {
          dangerouslyUseHTMLString: true
        })
        return
      }
      // 入库
      savePutStock(this.selectObj).then(res => {
        // 根据采购主表id查询明细数据
        getPurItemByPurchaseIdAndIsPutStock(this.currPurchaseId).then(res => {
          this.purItemList = res.data
        })
        this.getPurchaseList()
        this.getInventoryLogList()
        this.msgSuccess(res.msg)
        this.openPurItem = false
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
