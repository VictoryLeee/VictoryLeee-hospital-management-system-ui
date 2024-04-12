<template>
  <div>
    <!-- 按钮开始 -->
    <el-card class="box-card">
      <div style="text-align:right">
        <el-button type="primary" icon="el-icon-plus" size="mini" round @click="handleAddMedicines">添加药品</el-button>
        <el-button type="warning" icon="el-icon-s-operation" :disabled="isSubmit" size="mini" round @click="handleBatchSet">批量设置</el-button>
        <el-button type="success" icon="el-icon-check" :disabled="isSubmit" size="mini" round @click="handleSubmit">保存</el-button>
      </div>
    </el-card>
    <!-- 主表开始 -->
    <el-card class="box-card">
      <el-form ref="form" size="small" :model="form" :rules="rules" :inline="true" label-width="98px">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-form-item label="采购单号" prop="purchaseId">
              <el-input v-model="form.purchaseId" :disabled="true" style="width: 220px" />
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item label="供应商" prop="providerId">
              <el-select v-model="form.providerId" placeholder="请选择供应商" style="width: 220px">
                <el-option
                  v-for="d in providerOptions"
                  :key="d.providerId"
                  :label="d.providerName"
                  :value="d.providerId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item label="总金额" prop="purchaseTradeTotalAmount">
              <el-input v-model="form.purchaseTradeTotalAmount" :disabled="true" style="width: 180px;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 选中的明细表数据表格 -->
    <el-card class="box-card">
      <el-table
        :data="purchaseItemList"
        class="tb-edit"
        style="width: 100%"
        border
        highlight-current-row
      >
        <el-table-column label="药品名称" align="center" :show-overflow-tooltip="true" width="180" prop="medicinesName" />
        <el-table-column label="规则" align="center" :show-overflow-tooltip="true" width="100" prop="conversion">
          <template slot-scope="scope">
            <span>{{ scope.row.conversion }} {{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" :show-overflow-tooltip="true" width="145" prop="purchaseNumber">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.purchaseNumber"
              :step="1"
              type="number"
              size="mini"
              style="width: 120px"
            />
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" width="70" :show-overflow-tooltip="true" prop="unit" />
        <el-table-column label="单价" align="center" width="160" prop="tradePrice">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.tradePrice"
              type="number"
              min="0.00"
              step="0.01"
              :precision="2"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="总额" align="center" width="100" prop="tradeTotalAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.tradeTotalAmount | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次号" align="center" width="120" prop="batchNumber">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchNumber" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="300" prop="remark">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button size="small" type="danger" :disabled="isSubmit" @click="handlDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加药品的弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1100px"
      center
      :before-close="closeDialog"
      append-to-body
    >
      <!-- 查询条件开始 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="98px" size="small">
        <el-form-item label="药品编号">
          <el-input v-model="queryParams.medicinesNumber" clearable placeholder="请输入药品编号" />
        </el-form-item>
        <el-form-item label="药品名称">
          <el-input v-model="queryParams.medicinesName" clearable placeholder="请输入药品名称" />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="queryParams.keywords" clearable placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="药品分类">
          <el-select v-model="queryParams.medicinesType" clearable placeholder="请选择药品分类" style="width:180px">
            <el-option
              v-for="dict in medicinesTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处方类型">
          <el-select v-model="queryParams.prescriptionType" clearable placeholder="请选择处方类型" style="width:180px">
            <el-option
              v-for="dict in prescriptionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-select v-model="queryParams.producterId" clearable placeholder="请选择生产厂家" style="width:180px">
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
          <el-tooltip class="item" effect="light" content="设置好查询条件后，点击查询，即可" placement="bottom-end">
            <el-button size="mini" type="warning" icon="el-icon-search" @click="handleQuery">查询</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="重置药品的查询条件" placement="bottom-end">
            <el-button size="mini" type="info" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="选中下面的药品后，保存到代采购里" placement="right-end">
            <el-button size="mini" type="success" icon="el-icon-folder-checked" @click="saveMedicines">保存</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <!-- 药品数据表格 -->
      <el-table
        ref="medicinesTableList"
        v-loading="loading"
        :data="medicinesTableList"
        border
        style="width: 100%"
        size="small"
        :max-height="500"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="库存量：">
                <span style="color: green; font-weight: 900">{{ props.row.medicinesStockNum }}</span>
              </el-form-item>
              <el-form-item label="预警值：">
                <span style="color: red; font-weight: 900">{{ props.row.medicinesStockDangerNum }}</span>
              </el-form-item>
              <el-form-item label="单位：">
                <span>{{ props.row.unit }}</span>
              </el-form-item>
              <el-form-item label="换算量：">
                <span>{{ props.row.conversion }}</span>
              </el-form-item>
              <el-form-item label="处方价格：">
                <span>{{ props.row.prescriptionPrice }}</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
              <el-form-item label="创建时间：">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="创建人：">
                <span>{{ props.row.createBy }}</span>
              </el-form-item>
              <el-form-item label="修改时间：">
                <span>{{ props.row.updateTime }}</span>
              </el-form-item>
              <el-form-item label="修改人：">
                <span>{{ props.row.updateBy }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="medicinesNumber" label="药品编号" :show-overflow-tooltip="true" width="120px" align="center" style="color: red" />
        <el-table-column prop="medicinesName" label="药品名称" :show-overflow-tooltip="true" width="180px" align="center" />
        <el-table-column prop="medicinesType" label="药品分类" :show-overflow-tooltip="true" width="120px" align="center" :formatter="medicinesTypeFormatter" />
        <el-table-column prop="prescriptionType" label="处方类型" :show-overflow-tooltip="true" width="120px" align="center" :formatter="prescriptionTypeFormatter" />
        <el-table-column prop="keywords" label="关键字" :show-overflow-tooltip="true" width="110px" align="center" />
        <el-table-column prop="medicinesId" label="生产厂家" width="150px" :formatter="producterFormatter" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="status" label="状态" width="90px" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0" type="success" effect="dark">正常</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件开始 -->
      <el-pagination
        v-show="total>0"
        :current-page="queryParams.pageNum"
        :page-sizes="[10, 20, 30, 50, 70, 80, 100]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
    <!-- 批量设置的弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="batchSetOpen"
      width="600px"
      center
      :before-close="closeDialog"
      append-to-body
    >
      <el-form ref="batchSetForm" :model="batchSetForm" size="mini" label-width="100px">
        <el-form-item label="数量" prop="purchaseNumber">
          <el-input-number
            v-model="batchSetForm.purchaseNumber"
            :step="1"
            type="number"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="单价" prop="tradePrice">
          <el-input
            v-model="batchSetForm.tradePrice"
            type="number"
            min="0.00"
            step="0.01"
            :precision="2"
            size="small"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="batchSetForm.remark"
            size="small"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleBatchSetSubmit">确定</el-button>
        <el-button @click="cancelBatchSet">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProviderAll } from '@/api/erp/provider'
import { listMedicinesForPage } from '@/api/erp/medicines'
import { getProducterAll } from '@/api/erp/producter'
import { addPurchase, getPurchaseItemByPurchaseId } from '@/api/erp/purchase'
export default {
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      loading: false,
      // 是否打开弹出层
      open: false,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否提交
      isSubmit: true,
      // 供应商的下拉列表数据
      providerOptions: [],
      // 生产厂家的列表数据
      producterOptions: [],
      // 药类型的数据字典
      medicinesTypeOptions: [],
      // 处方类型的数据字典
      prescriptionTypeOptions: [],
      // 是否已入库
      isStateStorage: false,
      // 药品日期范围
      dateRange: [],
      // 主表数据
      form: {
        purchaseId: undefined,
        providerId: undefined,
        purchaseTradeTotalAmount: undefined
      },
      // 采购订单明细数据
      purchaseItemList: [],
      // 药品数据
      medicinesTableList: [],
      // 药品弹出层查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        medicinesType: undefined,
        prescriptionType: undefined,
        keyword: undefined
      },
      // 弹出层选中的药品
      selectMedicines: [],
      // 是否显示批量设置的弹出层
      batchSetOpen: false,
      // 批量设置的数据绑定
      batchSetForm: {
        purchaseNumber: 0,
        tradePrice: 0.00,
        batchNumber: '',
        remark: ''
      },
      rules: {
        providerId: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ]
      }
    }
  },
  // 监听purchaseItemList里面的数据变化，更新总批发额
  watch: {
    purchaseItemList: {
      handler: function() {
        this.form.purchaseTradeTotalAmount = 0.00
        this.purchaseItemList.filter(item => {
          item.tradeTotalAmount = item.tradePrice * item.purchaseNumber
          this.form.purchaseTradeTotalAmount += item.tradeTotalAmount
        })
        if (this.purchaseItemList.length > 0) {
          this.isSubmit = false
        }
      },
      deep: true
    }
  },
  created() {
    // 路由上的参数
    const purchaseId = this.$route.params.purchaseId
    getPurchaseItemByPurchaseId(purchaseId).then(res => {
      this.form = res.data.purchase
      this.form.providerId = parseInt(this.form.providerId)
      this.purchaseItemList = res.data.items
    })
    // 查询可用的供应商
    getProviderAll().then(res => {
      this.providerOptions = res.data
    })
    // 查询可用的生产厂家
    getProducterAll().then(res => {
      this.producterOptions = res.data
    })
    // 查询药品分类数据字典
    this.getDataByType('his_medicines_type').then(res => {
      this.medicinesTypeOptions = res.data
    })
    // 药品处方分类字典
    this.getDataByType('his_prescription_type').then(res => {
      this.prescriptionTypeOptions = res.data
    })
    // 查询药品分类数据字典
    this.getDataByType('his_medicines_type').then(res => {
      this.medicinesTypeOptions = res.data
    })
  },
  methods: {
    // 查询药品数据并勾上之前有的
    getMedicinesList() {
      this.loading = true
      // 设置状态为可用
      this.queryParams.status = 0
      listMedicinesForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.medicinesTableList = res.data
        this.total = res.total
        this.loading = false
        this.$nextTick(() => {
          // 反选之前有的
          this.medicinesTableList.filter(r1 => {
            this.purchaseItemList.filter(r2 => {
              if (parseInt(r1.medicinesId) === parseInt(r2.medicinesId)) {
                this.$refs.medicinesTableList.toggleRowSelection(r1, true)
              }
            })
          })
        })
      })
    },
    saveMedicines() {
      this.selectMedicines.filter(m1 => {
        let flag = false
        // 判断purchaseItemList里面有没有已选择的ID
        this.purchaseItemList.filter(purch => {
          if (parseInt(m1.medicinesId) === parseInt(purch.medicinesId)) {
            flag = true
          }
        })
        // 如果没有，就加入purchaseItemList
        if (!flag) {
          // 放到purchaseItemList对象是selection深度克隆
          this.purchaseItemList.push(JSON.parse(JSON.stringify(m1)))
        }
      })
      // 删除里面不要的属性，添加需要的属性
      this.purchaseItemList.filter(m => {
        this.$delete(m, 'status')
        this.$delete(m, 'medicinesStockNum')
        this.$delete(m, 'medicinesStockDangerNum')
        this.$delete(m, 'createTime')
        this.$delete(m, 'updateTime')
        this.$delete(m, 'createBy')
        this.$delete(m, 'updateBy')

        this.$set(m, 'purchaseNumber', m.purchaseNumber ? m.purchaseNumber : 1)
        this.$set(m, 'tradePrice', m.tradePrice ? m.tradePrice : 0.00)
        this.$set(m, 'tradeTotalAmount', m.tradeTotalAmount ? m.tradeTotalAmount : 0.00)
        this.$set(m, 'batchNumber', m.batchNumber ? m.batchNumber : '')
        this.$set(m, 'remark', m.remark ? m.remark : '')
      })
      this.open = false
    },
    // 打开选择药品的弹出层
    handleAddMedicines() {
      this.title = '选择要添加的药品信息'
      this.open = true
      this.getMedicinesList()
    },
    // 条件查询
    handleQuery() {
      this.getMedicinesList()
    },
    // 重置查询条件
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        medicinesType: undefined,
        prescriptionType: undefined,
        keyword: undefined
      }
      this.dateRange = []
      this.getMedicinesList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.selectMedicines = selection
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getMedicinesList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getMedicinesList()
    },
    // 翻译生产厂家
    producterFormatter(row) {
      let name = ''
      this.producterOptions.filter(item => {
        if (parseInt(row.producterId) === parseInt(item.producterId)) {
          name = item.producterName
        }
      })
      return name
    },
    // 翻译药品类型
    medicinesTypeFomatter(row) {
      return this.selectDictLabel(this.medicinesTypeOptions, row.medicinesType)
    },
    // 翻译处方类型
    prescriptionTypeFormatter(row) {
      return this.selectDictLabel(this.prescriptionTypeOptions, row.prescriptionType)
    },
    // 药品名称状态
    medicinesTypeFormatter(row) {
      return this.selectDictLabel(this.medicinesTypeOptions, row.medicinesType)
    },
    // 打开批量设置的弹出层
    handleBatchSet() {
      this.batchSetOpen = true
      this.title = '批量设置'
    },
    // 批量设置保存
    handleBatchSetSubmit() {
      this.purchaseItemList.filter(item => {
        item.purchaseNumber = this.batchSetForm.purchaseNumber
        item.tradePrice = this.batchSetForm.tradePrice
        item.batchNumber = this.batchSetForm.batchNumber
        item.remark = this.batchSetForm.remark
      })
      this.batchSetOpen = false
    },
    // 批量设置弹出层的关闭
    cancelBatchSet() {
      this.batchSetOpen = false
    },
    // 重置药品表单信息
    reset() {
      this.queryParams = {
        medicinesCode: undefined,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        providerId: undefined,
        keywords: undefined
      }
    },
    //  关闭弹窗
    closeDialog(done) {
      this.$confirm('是否关闭此【' + this.title + '】弹窗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done()
      }).catch(_ => {})
      this.reset()
      this.open = false
      this.batchSetOpen = false
      this.dateRange = []
    },
    // 保存
    handleSubmit() {
      const tx = this
      if (tx.purchaseItemList.length > 0) {
        tx.$refs['form'].validate((valid) => {
          if (valid) {
            // 组装数据
            const purchaseObj = { 'purchaseDto': tx.form, 'purchaseItemDtoList': tx.purchaseItemList }
            addPurchase(purchaseObj).then(() => {
              tx.msgSuccess('保存成功')
            })
          }
        })
      } else {
        tx.msgError('药品数据项不能为空')
      }
    },
    // 删除详情数据
    handlDelete(index, row) {
      this.purchaseItemList.splice(index, 1)
    }
  }
}
</script>
<style scoped>
  .box-card{
    padding: 0px;
    margin: 0px;
    margin-bottom: 10px;
  }
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

