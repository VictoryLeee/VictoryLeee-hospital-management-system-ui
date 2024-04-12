<template>
  <div>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="操作模块">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入操作模块"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请输入类型"
          clearable
          size="small"
          style="width:200px"
        >
          <el-option
            v-for="dict in businessTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请输入类型"
          clearable
          size="small"
          style="width:200px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.businessType"
          placeholder="请输入类型"
          clearable
          size="small"
          style="width:200px"
        >
          <el-option
            v-for="dict in businessTypeOptions"
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
    <!-- 表头按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-thumb" size="mini" @click="handleClearInfo">清空</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="operLogTableList"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作模块">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="登陆信息">
              <span>{{ props.row.operName }} / {{ props.row.operIp }}</span>
            </el-form-item>
            <el-form-item label="操作模块">
              <span>{{ props.row.title }}</span>
            </el-form-item>
            <el-form-item label="请求地址">
              <span>{{ props.row.operUrl }}</span>
            </el-form-item>
            <el-form-item label="操作方法">
              <span>{{ props.row.requestMethod }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.jsonResult }}</span>
            </el-form-item>
            <el-form-item label="操作模块">
              <span>{{ props.row.status==0?'成功':'失败' }}</span>
            </el-form-item>
            <el-form-item label="操作时间">
              <span>{{ props.row.operTime }}</span>
            </el-form-item>
            <el-form-item label="异常信息">
              <span>{{ props.row.errorMsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="日志ID" prop="operId" align="center" />
      <el-table-column label="操作模块" prop="title" align="center" />
      <el-table-column label="操作类型" prop="businessType" :formatter="businessTypeFormatter" align="center" />
      <el-table-column label="请求方式" prop="requestMethod" align="center" />
      <el-table-column label="操作人员" prop="operName" align="center" />
      <el-table-column label="主机" prop="operIp" align="center" />
      <el-table-column label="操作地点" prop="operLocation" align="center" />
      <el-table-column label="操作状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" prop="operTime" align="center" width="180px" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件开始 -->
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
  </div>
</template>

<script>
import { listForPage, deleteByIds, clearAllOperLog } from '@/api/system/operLog'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中多条
      multiple: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 操作日志数据
      operLogTableList: [],
      // 状态字典数据
      statusOptions: [],
      // 登录类型数据字典
      businessTypeOptions: [],
      // 时间数组
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        status: undefined,
        businessType: undefined
      }
    }
  },
  created() {
    // 查询字典数据的状态
    this.getDataByType('sys_common_status').then(res => {
      this.statusOptions = res.data
    })
    // 查询字典数据的操作类型
    this.getDataByType('sys_oper_type').then(res => {
      this.businessTypeOptions = res.data
    })
    this.getOperLogList()
  },
  methods: {
    // 分页查询操作日志
    getOperLogList() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.operLogTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getOperLogList()
    },
    // 重置查询条件
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        status: undefined,
        businessType: undefined
      }
      this.dateRange = []
      this.getOperLogList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getOperLogList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getOperLogList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 翻译操作类型
    businessTypeFormatter(row) {
      return this.selectDictLabel(this.businessTypeOptions, row.businessType)
    },
    // 根据ids集合删除数据
    handleDelete(row) {
      const operIds = row.operId || this.ids
      this.$confirm('此操作将永久删除操作日志数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteByIds(operIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getOperLogList()
        })
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    // 清空数据
    handleClearInfo() {
      this.$confirm('此操作将永久清空操作日志数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        clearAllOperLog().then(() => {
          this.loading = false
          this.msgSuccess('清空成功')
          this.getOperLogList()
        })
      }).catch(() => {
        this.msgError('清空已取消')
        this.loading = false
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
