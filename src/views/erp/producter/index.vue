<template>
  <div>
    <!-- 查询条件 -->
    <el-form ref="queryParams" :model="queryParams" :inline="true" label-width="98px" size="small">
      <el-form-item label="厂家名称">
        <el-input v-model="queryParams.producterName" clearable placeholder="请输入厂家名称" />
      </el-form-item>
      <el-form-item label="厂家简码">
        <el-input v-model="queryParams.producterCode" clearable placeholder="请输入厂家简码" />
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="queryParams.keywords" clearable placeholder="请输入关键字" />
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
      :data="producterTableList"
      border
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="producterName" label="厂家名称" :show-overflow-tooltip="true" width="240px" align="center" />
      <el-table-column prop="producterCode" label="厂家简码" :show-overflow-tooltip="true" width="180px" align="center" />
      <el-table-column prop="producterAddress" label="厂家地址" :show-overflow-tooltip="true" width="185px" align="center" />
      <el-table-column prop="producterTel" label="厂家电话" :show-overflow-tooltip="true" width="180px" align="center" />
      <el-table-column prop="producterPerson" label="联系人" :show-overflow-tooltip="true" width="130px" align="center" />
      <el-table-column prop="keywords" label="关键字" :show-overflow-tooltip="true" width="130px" align="center" />
      <el-table-column prop="status" label="状态" width="90px" :formatter="statusFormatter" align="center" />
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
        <el-form-item label="厂家名称" prop="producterName">
          <el-input v-model="form.producterName" placeholder="请输入厂家名称" clearable />
        </el-form-item>
        <el-form-item label="厂家编码" prop="producterCode">
          <el-input v-model="form.producterCode" placeholder="请输入厂家编码" clearable :disabled="producterCodeDisable" />
        </el-form-item>
        <el-form-item label="联系人" prop="producterPerson">
          <el-input v-model="form.producterPerson" placeholder="请输入联系人" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="producterTel">
          <el-input v-model="form.producterTel" placeholder="请输入电话" clearable />
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键字" clearable />
        </el-form-item>
        <el-form-item label="地址" prop="producterAddress">
          <el-input v-model="form.producterAddress" placeholder="请输入地址" clearable />
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listForPageProducter, addProducter, updateProducter, deleteProducterByIds, getProducterById } from '@/api/erp/producter'
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
      // 是否禁用
      producterCodeDisable: true,
      // 分页数据总条数
      total: 0,
      // 生产厂商数据表格
      producterTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 时间条件
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        producterName: undefined,
        producterCode: undefined,
        producterTel: undefined,
        status: undefined,
        keywords: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        producterName: [
          { required: true, message: '厂家名称不能为空', trigger: 'blur' }
        ],
        producterCode: [
          { required: true, message: '厂家简码不能为空', trigger: 'blur' }
        ],
        producterTel: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        producterPerson: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '查询关键字不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 查询状态数据字典
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    this.getProducterList()
  },
  methods: {
    // 查询数据表格
    getProducterList() {
      this.loading = true
      listForPageProducter(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.producterTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getProducterList()
    },
    // 重置查询条件
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        producterName: undefined,
        producterCode: undefined,
        producterTel: undefined,
        status: undefined,
        keywords: undefined
      }
      this.getProducterList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.producterId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getProducterList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getProducterList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加
    handleAdd() {
      this.open = true
      this.reset()
      this.producterCodeDisable = false
      this.title = '添加生产厂商信息'
    },
    // 打开修改
    handleUpdate(row) {
      this.title = '修改生产厂家信息'
      const producterId = row.producterId || this.ids
      this.open = true
      this.reset()
      this.loading = true
      this.producterCodeDisable = true
      getProducterById(producterId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handlerDelete(row) {
      const producterId = row.producterId || this.ids
      const tx = this
      tx.$confirm('此操作将永久删除该生产厂家数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        tx.loading = true
        deleteProducterByIds(producterId).then(() => {
          tx.loading = false
          tx.msgSuccess('删除成功')
          tx.getProducterList()
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
          if (tx.form.producterId === undefined) {
            addProducter(tx.form).then(() => {
              tx.msgSuccess('保存成功')
              tx.loading = false
              tx.getProducterList()
              tx.open = false
            }).catch(() => {
              tx.loading = false
            })
          } else {
            updateProducter(tx.form).then(() => {
              tx.msgSuccess('保存成功')
              tx.loading = false
              tx.getProducterList()
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
        producterId: undefined,
        producterName: undefined,
        producterCode: undefined,
        producterTel: undefined,
        keywords: undefined,
        status: undefined
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

<style>

</style>
