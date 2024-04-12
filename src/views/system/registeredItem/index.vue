<template>
  <div>
    <!-- 查询开始 -->
    <el-form :model="queryParams" :inline="true" label-width="70px" size="small">
      <el-form-item label="项目名称">
        <el-input v-model="queryParams.regItemName" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" clearable placeholder="请选择状态" style="width: 150px">
          <el-option v-for="d in statusOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width:350px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholde="开始日期"
          end-placeholde="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="handlerQuery">查询</el-button>
        <el-button round @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格按钮工具栏开始 -->
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
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      :data="registeredItemTableList"
      border
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" fixed width="55px" align="center" />
      <el-table-column prop="regItemName" label="项目名称" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="regItemFee" label="金额" width="140px" :show-overflow-tooltip="true" align="center" />
      <el-table-column prop="status" label="状态" width="120px" :formatter="statusFormatter" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="createBy" label="创建人" width="140px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateTime" label="修改时间" width="160px" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateBy" label="修改人" width="140px" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="160px" fixed="right">
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
    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      center
      append-to-body
      :before-close="closeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label="项目名称" prop="regItemName">
          <el-input v-model="form.regItemName" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item label="金额" prop="regItemFee">
          <el-input v-model="form.regItemFee" type="number" min="0.00" step="0.01" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="d in statusOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { listForPageRegisterItem, addRegisteredItem, updateRegisteredItem, getRegisteredItemById, deleteRegisteredItemByIds } from '@/api/system/registerItem'
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
      // 弹窗开关
      open: false,
      // 分页数据总条数
      total: 0,
      // 状态数据字典
      statusOptions: [],
      // 挂号项目表格数据
      registeredItemTableList: [],
      // 时间范围查询对象
      dateRange: [],
      // 弹出层的标题
      title: '',
      // 查询参数对象
      queryParams: {
        regItemName: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        regItemName: [
          { required: true, message: '挂号项目标题不能为空', trigger: 'blur' }
        ],
        regItemFee: [
          { required: true, message: '金额不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 查询挂号项目的状态数据字典
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    this.getRegisteredItemList()
  },
  methods: {
    // 分页查询数据
    getRegisteredItemList() {
      this.loading = true
      listForPageRegisterItem(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.registeredItemTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 执行查询
    handlerQuery() {
      this.getRegisteredItemList()
    },
    // 重置查询
    resetQuery() {
      this.reset()
      this.getRegisteredItemList()
    },
    // 重置查询条件
    reset() {
      this.queryParams = {
        regItemName: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 10
      }
      this.dateRange = []
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.regItemId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getRegisteredItemList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getRegisteredItemList()
    },
    // 翻译挂号项目状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加
    handleAdd() {
      this.open = true
      this.resetForm()
      this.title = '添加挂号项目信息'
    },
    // 打开修改
    handleUpdate(row) {
      this.open = true
      this.resetForm()
      this.title = '修改挂号项目信息'
      const regItemId = row.regItemId || this.ids
      this.loading = true
      getRegisteredItemById(regItemId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 添加保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
        // 判断是添加还是修改
          this.loading = false
          if (this.form.regItemId === undefined) {
            addRegisteredItem(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.open = false
              this.loading = false
              this.resetForm()
              this.getRegisteredItemList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            updateRegisteredItem(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.open = false
              this.loading = false
              this.resetForm()
              this.getRegisteredItemList()
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 重置表单信息
    resetForm() {
      this.form = {
        regItemName: undefined,
        regItemFee: undefined,
        status: undefined
      }
    },
    // 删除
    handlerDelete(row) {
      const ids = row.regItemId || this.ids
      this.$confirm('此操作将永久删除该数据，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteRegisteredItemByIds(ids).then(() => {
          this.msgSuccess('删除成功')
          this.loading = false
          this.resetQuery()
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    //  关闭弹窗
    closeDialog(done) {
      this.$confirm('是否关闭此弹窗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetForm()
        this.loading = false
        done()
      }).catch(_ => {})
    },
    //  取消
    cancel() {
      this.open = false
      this.reset()
      this.title = ''
    },
    // 查看挂号项目信息
    handleView(row) {
      const id = row.regItemId || this.ids
      getRegisteredItemById(id).then(res => {
        this.noticeView = res.data
      })
      this.noticeContentOpen = true
    }
  }
}
</script>
<style>
 .el-table__fixed {
        height: 100% !important;
      }
      .el-table__fixed-right {
        height: 100% !important;
      }
</style>
