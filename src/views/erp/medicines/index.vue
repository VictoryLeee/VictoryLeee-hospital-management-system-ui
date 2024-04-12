<template>
  <div>
    <!-- 查询条件 -->
    <el-form ref="queryParams" :model="queryParams" :inline="true" label-width="98px" size="small">
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
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 按钮栏 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" round size="mini" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" round size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" round size="mini" :disabled="multiple" @click="handlerDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="medicinesTableList"
      border
      style="width: 100%"
      size="mini"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
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
      <el-table-column prop="medicinesName" label="药品名称" :show-overflow-tooltip="true" width="180px" align="center" />
      <el-table-column prop="medicinesType" label="药品分类" :show-overflow-tooltip="true" width="150px" align="center" :formatter="medicinesTypeFormatter" />
      <el-table-column prop="prescriptionType" label="处方类型" :show-overflow-tooltip="true" width="150px" align="center" :formatter="prescriptionTypeFormatter" />
      <el-table-column prop="prescriptionPrice" label="处方价格" :show-overflow-tooltip="true" width="100px" align="center" />
      <el-table-column prop="keywords" label="关键字" :show-overflow-tooltip="true" width="110px" align="center" />
      <el-table-column prop="producterId" label="生产厂家" width="150px" :formatter="producterFormatter" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="status" label="状态" width="90px" :formatter="statusFormatter" align="center" />
      <el-table-column prop="remark" label="备注" width="150px" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="createBy" label="创建人" width="120px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateTime" label="修改时间" width="160px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateBy" label="修改人" width="120px" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="120px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handlerDelete(scope.row)">删除</el-button>
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
    <!-- 添加或修改弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="药品编号">
          <el-input v-model="form.medicinesNumber" disabled />
        </el-form-item>
        <el-form-item label="药品名称" prop="medicinesName">
          <el-input v-model="form.medicinesName" placeholder="请输入药品名称" clearable />
        </el-form-item>
        <el-form-item label="药品分类" prop="medicinesType">
          <el-select v-model="form.medicinesType" clearable placeholder="请选择药品分类" style="width:300px">
            <el-option
              v-for="dict in medicinesTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处方类型" prop="prescriptionType">
          <el-select v-model="form.prescriptionType" clearable placeholder="请选择药品分类" style="width:300px">
            <el-option
              v-for="dict in prescriptionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="prescriptionPrice">
          <el-input v-model="form.prescriptionPrice" type="number" min="0.00" step="0.01" placeholder="请输入价格" clearable />
        </el-form-item>
        <el-form-item label="单位（g/条）" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" clearable />
        </el-form-item>
        <el-form-item label="换算量" prop="conversion">
          <el-input v-model="form.conversion" placeholder="请输入换算量" clearable />
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键字" clearable />
        </el-form-item>
        <el-form-item label="生产厂家" prop="producterId">
          <el-select v-model="form.producterId" clearable placeholder="请选择生产厂家" style="width:300px">
            <el-option
              v-for="dict in producterOptions"
              :key="dict.producterId"
              :label="dict.producterName"
              :value="dict.producterId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="库存量" prop="medicinesStockNum">
          <el-input-number v-model="form.medicinesStockNum" type="number" min="0" step="1" placeholder="请输入库存量" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item label="预警值" prop="medicinesStockDangerNum">
          <el-input-number v-model="form.medicinesStockDangerNum" type="number" min="0" step="1" placeholder="请输入预警值" style="width: 200px" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" rows="3" placeholder="请输入备注" style="width: 400px" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSubmit">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProducterAll } from '@/api/erp/producter'
import { listMedicinesForPage, addMedicines, updateMedicines, deleteMedicinesByIds, getById } from '@/api/erp/medicines'
export default {
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 生产厂商数据表格
      medicinesTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 药品数据字典
      medicinesTypeOptions: [],
      // 药品数据字典
      prescriptionTypeOptions: [],
      // 药品数据字典
      producterOptions: [],
      // 时间条件
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        medicinesCode: undefined,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        medicinesId: undefined,
        status: undefined,
        keywords: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        medicinesName: [
          { required: true, message: '药品名称不能为空', trigger: 'blur' }
        ],
        medicinesType: [
          { required: true, message: '请选择药品类型', trigger: 'blur' }
        ],
        prescriptionType: [
          { required: true, message: '请选择处方类型', trigger: 'blur' }
        ],
        medicinesId: [
          { required: true, message: '请选择生产厂家', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'blur' }
        ],
        prescriptionPrice: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        medicinesStockNum: [
          { required: true, message: '库存量不能为空', trigger: 'blur' }
        ],
        medicinesStockDangerNum: [
          { required: true, message: '预警值不能为空', trigger: 'blur' }
        ]
      }
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
    getProducterAll().then(res => {
      this.producterOptions = res.data
    })
    this.getMedicinesList()
  },
  methods: {
    // 查询数据表格
    getMedicinesList() {
      this.loading = true
      listMedicinesForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.medicinesTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getMedicinesList()
    },
    // 重置查询条件
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        medicinesCode: undefined,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        medicinesId: undefined,
        status: undefined,
        keywords: undefined
      }
      this.getMedicinesList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.medicinesId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
    // 药品名称状态
    medicinesTypeFormatter(row) {
      return this.selectDictLabel(this.medicinesTypeOptions, row.medicinesType)
    },
    // 处方类型名称状态
    prescriptionTypeFormatter(row) {
      return this.selectDictLabel(this.prescriptionTypeOptions, row.prescriptionType)
    },
    // 打开添加
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加药品信息'
    },
    // 打开修改
    handleUpdate(row) {
      this.title = '修改药品信息'
      const medicinesId = row.medicinesId || this.ids
      this.open = true
      this.reset()
      this.loading = true
      getById(medicinesId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handlerDelete(row) {
      const medicinesId = row.medicinesId || this.ids
      const tx = this
      tx.$confirm('此操作将永久删除该药品信息数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tx.loading = true
        deleteMedicinesByIds(medicinesId).then(() => {
          tx.loading = false
          tx.msgSuccess('删除成功')
          tx.getMedicinesList()
        }).catch(() => {
          tx.loading = false
        })
      }).catch(() => {
        tx.msgError('删除取消')
        tx.loading = false
      })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          const tx = this
          if (tx.form.medicinesId === undefined) {
            addMedicines(tx.form).then(() => {
              tx.msgSuccess('保存成功')
              tx.loading = false
              tx.getMedicinesList()
              tx.open = false
            }).catch(() => {
              tx.loading = false
            })
          } else {
            updateMedicines(tx.form).then(() => {
              tx.msgSuccess('保存成功')
              tx.loading = false
              tx.getMedicinesList()
              tx.open = false
            }).catch(() => {
              tx.loading = false
            })
          }
        }
      })
    },
    // 重置表单信息
    reset() {
      this.form = {
        medicinesCode: undefined,
        medicinesName: undefined,
        medicinesType: undefined,
        prescriptionType: undefined,
        medicinesId: undefined,
        status: undefined,
        keywords: undefined
      }
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
      this.reset()
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
