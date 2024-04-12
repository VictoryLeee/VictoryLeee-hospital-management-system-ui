<template>
  <div>
    <!-- 查询条件 -->
    <el-form ref="queryParams" :model="queryParams" :inline="true" label-width="98px" size="small">
      <el-form-item label="供应商名称">
        <el-input v-model="queryParams.providerName" clearable placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item label="联系人名称">
        <el-input v-model="queryParams.contactName" clearable placeholder="请输入联系人名称" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" clearable placeholder="请选择状态" style="width:140px">
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
        <el-button type="primary" round icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button type="primary" round icon="el-icon-refresh" @click="resetQuery">重置</el-button>
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
      :data="providerTableList"
      border
      style="width: 98%"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="providerName" label="供应商名称" :show-overflow-tooltip="true" width="220px" align="center" />
      <el-table-column prop="contactName" label="联系人名称" :show-overflow-tooltip="true" width="120px" align="center" />
      <el-table-column prop="contactMobile" label="联系人手机" :show-overflow-tooltip="true" width="130px" align="center" />
      <el-table-column prop="contactTel" label="联系人电话" :show-overflow-tooltip="true" width="130px" align="center" />
      <el-table-column prop="bankAccount" label="银行账号" :show-overflow-tooltip="true" width="160px" align="center" />
      <el-table-column prop="providerAddress" label="供应商地址" :show-overflow-tooltip="true" width="200px" align="center" />
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
        <el-form-item label="供应商名称" prop="providerName">
          <el-input v-model="form.providerName" clearable placeholder="请输入供应商名称" />
        </el-form-item>
        <el-form-item label="联系人名称" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人名称" clearable />
        </el-form-item>
        <el-form-item label="联系人手机" prop="contactMobile">
          <el-input v-model="form.contactMobile" clearable placeholder="请选择联系人手机" style="width:300px" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactTel">
          <el-input v-model="form.contactTel" clearable placeholder="请选择联系人电话" style="width:300px" />
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入银行账号" clearable />
        </el-form-item>
        <el-form-item label="供应商地址" prop="providerAddress">
          <el-input v-model="form.providerAddress" placeholder="请输入供应商地址" clearable />
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
        <el-button type="primary" size="small" @click="handleSubmit">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listProviderForPage, addProvider, updateProvider, deleteProviderByIds, getByProviderId } from '@/api/erp/provider'
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
      // 供应商数据表格
      providerTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 时间条件
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        providerName: undefined,
        contactName: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        providerName: [
          { required: true, message: '供应商名称不能为空', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '联系人名称不能为空', trigger: 'blur' }
        ],
        contactMobile: [
          { required: true, message: '联系人手机不能为空', trigger: 'blur' }
        ],
        contactTel: [
          { required: true, message: '联系人电话不能为空', trigger: 'blur' }
        ],
        bankAccount: [
          { required: true, message: '联系人手机不能为空', trigger: 'blur' }
        ],
        providerAddress: [
          { required: true, message: '供应商地址不能为空', trigger: 'blur' }
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
    this.getProviderList()
  },
  methods: {
    // 查询数据表格
    getProviderList() {
      this.loading = true
      listProviderForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.providerTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getProviderList()
    },
    // 重置查询条件
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        providerName: undefined,
        contactName: undefined,
        status: undefined
      }
      this.getProviderList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.providerId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getProviderList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getProviderList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 供应商名称状态
    medicinesTypeFormatter(row) {
      return this.selectDictLabel(this.medicinesTypeOptions, row.medicinesType)
    },
    // 打开添加
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加供应商信息'
    },
    // 打开修改
    handleUpdate(row) {
      this.title = '修改供应商信息'
      const providerId = row.providerId || this.ids
      this.open = true
      this.reset()
      this.loading = true
      getByProviderId(providerId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handlerDelete(row) {
      const medicinesId = row.medicinesId || this.ids
      const tx = this
      tx.$confirm('此操作将永久删除该供应商信息数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tx.loading = true
        deleteProviderByIds(medicinesId).then(() => {
          tx.loading = false
          tx.msgSuccess('删除成功')
          tx.getProviderList()
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
          if (tx.form.providerId === undefined) {
            addProvider(tx.form).then(() => {
              tx.msgSuccess('保存成功')
              tx.loading = false
              tx.getProviderList()
              tx.open = false
              this.reset()
            }).catch(() => {
              tx.loading = false
            })
          } else {
            updateProvider(tx.form).then(() => {
              tx.msgSuccess('保存成功')
              tx.loading = false
              tx.getProviderList()
              tx.open = false
              this.reset()
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
        providerId: undefined,
        providerName: undefined,
        contactName: undefined,
        contactMobile: undefined,
        contactTel: undefined,
        bankAccount: undefined,
        providerAddress: undefined,
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
