<template>
  <div>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="科室名称">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入科室名称"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.status"
          placeholder="可用状态"
          clearable
          size="small"
          style="width:240px"
        >
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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格工具按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="deptTableList"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="科室ID" prop="deptId" align="center" />
      <el-table-column label="科室名称" prop="deptName" align="center" />
      <el-table-column label="科室编码" prop="deptNumber" align="center" />
      <el-table-column label="当前挂号量" prop="regNumber" align="center" />
      <el-table-column label="排序码" prop="orderNum" align="center" />
      <el-table-column label="负责人" prop="deptLeader" align="center" />
      <el-table-column label="电话" prop="leaderPhone" align="center" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" width="160px" prop="createTime" />
      <el-table-column label="创建人" align="center" width="140px" prop="createTime" />
      <el-table-column label="修改时间" align="center" width="160px" prop="updateTime" />
      <el-table-column label="修改人" align="center" width="140px" prop="updateBy" />
      <el-table-column label="操作" align="center" width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[10, 20, 30, 50, 100]"
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
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="科室名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入科室名称" size="small" clearable />
        </el-form-item>
        <el-form-item label="科室编码" prop="deptNumber">
          <el-input v-model="form.deptNumber" placeholder="请输入科室编码" size="small" clearable />
        </el-form-item>
        <el-form-item label="挂号开始编号" prop="regNumber">
          <el-input-number v-model="form.regNumber" placeholder="请输入挂号开始编号" size="small" clearable />
        </el-form-item>
        <el-form-item label="负责人" prop="deptLeader">
          <el-input v-model="form.deptLeader" placeholder="请输入负责人" size="small" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="leaderPhone">
          <el-input v-model="form.leaderPhone" placeholder="请输入电话" size="small" clearable />
        </el-form-item>
        <el-form-item label="排序码" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序码" size="small" clearable />
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
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listForPage, add, update, getById, deleteByIds } from '@/api/system/dept'
export default {
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 科室表格数据
      deptTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptName: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        deptName: [
          { required: true, message: '科室名称不能为空', trigger: 'blur' }
        ],
        deptNumber: [
          { required: true, message: '科室编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 使用全局的方法 根据字典类型查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    this.getDeptList()
  },
  methods: {
    // 查询部门数据
    getDeptList() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.deptTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getDeptList()
    },
    // 重置查询条件
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        deptName: undefined,
        status: undefined
      }
      this.dataRange = []
      this.getDeptList()
    },
    // 数据表格的多选框
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deptId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 一页多少条数发生改变后
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getDeptList()
    },
    // 上一页下一页，跳转到那一页的改变
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getDeptList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加科室信息'
    },
    // 打开修改弹出层
    handleUpdate(row) {
      this.title = '修改科室信息'
      const deptId = row.deptId || this.ids
      console.log(deptId)
      this.open = true
      this.reset()
      getById(deptId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const deptIds = row.deptId || this.ids
      this.$confirm('此操作将永久删除该科室数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteByIds(deptIds).then(() => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getDeptList()
        })
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    // 保存或修改
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 添加
          this.loading = true
          if (this.form.deptId === undefined) {
            add(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.loading = true
              this.getDeptList()
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            update(this.form).then(() => {
              this.msgSuccess('修改成功')
              this.loading = true
              this.getDeptList()
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.form = {
        deptId: undefined,
        deptName: undefined,
        deptLeader: undefined,
        deptNumber: undefined,
        orderNum: 1,
        regNumber: 0,
        status: undefined
      }
    }
  }
}
</script>

<style>

</style>
