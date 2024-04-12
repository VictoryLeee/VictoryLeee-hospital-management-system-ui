<template>
  <div>
    <!-- 查询开始 -->
    <el-form :model="queryParams" :inline="true" label-width="70px" size="small">
      <el-form-item label="公告标题">
        <el-input v-model="queryParams.noticeTitle" clearable />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="queryParams.createBy" clearable />
      </el-form-item>
      <el-form-item label="公告类型">
        <el-select v-model="queryParams.noticeType" clearable placeholder="请选择公告类型" style="width: 150px">
          <el-option v-for="d in noticeTypeOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="公告状态">
        <el-select v-model="queryParams.status" clearable placeholder="请选择公告状态" style="width: 150px">
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
        <el-button type="primary" round @click="handleSubmit">查询</el-button>
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
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-view" round size="mini" :disabled="single" @click="handleView">查看</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      :data="noticeTableList"
      border
      style="width: 100%"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="noticeTitle" label="标题" :show-overflow-tooltip="true" width="200px" align="center" />
      <el-table-column prop="noticeType" label="公告类型" width="100px" :formatter="noticeTypeFormatter" align="center" />
      <el-table-column prop="status" label="状态" width="100px" :formatter="statusFormatter" align="center" />
      <el-table-column prop="createBy" label="创建人" :show-overflow-tooltip="true" width="180px" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="160px" align="center" />
      <el-table-column prop="updateBy" label="修改人" :show-overflow-tooltip="true" width="180px" align="center" />
      <el-table-column prop="updateTime" label="修改时间" width="160px" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handlerDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
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
        <el-form-item label="标题名称" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" placeholder="请输入标题名称" clearable />
        </el-form-item>
        <el-form-item label="公告类型" prop="noticeType">
          <el-select v-model="form.noticeType" placeholder="请选择公告类型">
            <el-option v-for="d in noticeTypeOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="d in statusOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="noticeType">
          <markdown-editor
            ref="noticeContent"
            v-model="form.noticeContent"
            height="300px"
            :options="{hideModeSwitch:true,previewStyle:'tab'}"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看内容弹窗 -->
    <el-dialog
      :title="noticeView.noticeTitle"
      :visible.sync="noticeContentOpen"
      width="600px"
      center
      append-to-body
      :before-close="closeDialog"
    >
      <markdown-editor ref="noticeContent" v-model="noticeView.noticeContent" :aria-disabled="true" :options="{hideModeSwitch:true,previewStyle:'tab'}" />
    </el-dialog>
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import { listForPageNotice, addNotice, updateNotice, getNoticeById, deleteNoticeByIds } from '@/api/system/notice'
export default {
  components: { MarkdownEditor },
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
      // 状态数据字典
      statusOptions: [],
      // 公告类型字典
      noticeTypeOptions: [],
      // 公告表格数据
      noticeTableList: [],
      // 时间范围查询对象
      dateRange: [],
      // 弹出层的标题
      title: '',
      // 查询参数对象
      queryParams: {
        noticeTitle: undefined,
        createBy: undefined,
        noticeType: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 10
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: '公告标题不能为空', trigger: 'blur' }
        ],
        noticeType: [
          { required: true, message: '请选择公告类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      // 打开添加或修改的弹出层
      open: false,
      // 查询内容的弹出层
      noticeContentOpen: false,
      // 内容对象
      noticeView: {
        noticeTitle: undefined,
        noticeContent: undefined
      }
    }
  },
  created() {
    // 查询公告的状态数据字典
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 查询公告的类别数据字典
    this.getDataByType('sys_notice_type').then(res => {
      this.noticeTypeOptions = res.data
    })
    this.getNoticeList()
  },
  methods: {
    // 分页查询数据
    getNoticeList() {
      this.loading = true
      listForPageNotice(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.noticeTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 执行查询
    handlerQuery() {
      this.getNoticeList()
    },
    // 重置查询
    resetQuery() {
      this.reset()
      this.getNoticeList()
    },
    // 重置查询条件
    reset() {
      this.queryParams = {
        noticeTitle: undefined,
        createBy: undefined,
        noticeType: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 10
      }
      this.dateRange = []
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getNoticeList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getNoticeList()
    },
    // 翻译公告状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 翻译公告类型
    noticeTypeFormatter(row) {
      return this.selectDictLabel(this.noticeTypeOptions, row.noticeType)
    },
    // 打开添加
    handleAdd() {
      this.open = true
      this.resetForm()
      this.title = '添加公告信息'
    },
    // 打开修改
    handleUpdate(row) {
      this.open = true
      this.resetForm()
      this.title = '修改公告信息'
      const noticeId = row.noticeId || this.ids
      this.loading = true
      getNoticeById(noticeId).then(res => {
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
          if (this.form.noticeId === undefined) {
            addNotice(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.open = false
              this.loading = false
              this.resetForm()
              this.getNoticeList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            updateNotice(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.open = false
              this.loading = false
              this.resetForm()
              this.getNoticeList()
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
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: undefined
      }
      // this.$refs.noticeContent.setContent('')
    },
    // 删除
    handlerDelete(row) {
      const ids = row.noticeId || this.ids
      this.$confirm('此操作将永久删除该数据，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteNoticeByIds(ids).then(() => {
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
        done()
      }).catch(_ => {})
      this.resetForm()
      this.open = false
      this.loading = false
    },
    //  取消
    cancel() {
      this.open = false
      this.reset()
      this.title = ''
    },
    // 查看公告信息
    handleView(row) {
      const id = row.noticeId || this.ids
      getNoticeById(id).then(res => {
        this.noticeView = res.data
      })
      this.noticeContentOpen = true
    }
  }
}
</script>
<style>
</style>
