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
            v-for="dict in loginTypeOptions"
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
            v-for="dict in loginTypeOptions"
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
      size="small"
      :data="operLogTableList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志ID" prop="infoId" align="center" />
      <el-table-column label="用户姓名" prop="userName" align="center" />
      <el-table-column label="登陆帐号" prop="loginAccount" align="center" />
      <el-table-column label="IP" prop="ipAddr" align="center" />
      <el-table-column label="登陆地址" prop="loginLocation" align="center" />
      <el-table-column label="浏览器" prop="browser" align="center" />
      <el-table-column label="操作系统" prop="os" align="center" />
      <el-table-column label="登陆状态" prop="loginStatus" align="center" :formatter="statusFormatter" />
      <el-table-column label="用户类型" prop="loginType" align="center" :formatter="loginTypeFormatter" />
      <el-table-column label="登录时间" prop="loginTime" align="center" width="180px" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userId!=1" type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
import { listForPage, deleteByIds, clearLoginInfo } from '@/api/system/logininfo'
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
      loginTypeOptions: [],
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
    this.getDataByType('sys_user_type').then(res => {
      this.loginTypeOptions = res.data
    })
    this.getLogininfoList()
  },
  methods: {
    // 分页查询操作日志
    getLogininfoList() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.operLogTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getLogininfoList()
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
      this.getLogininfoList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.infoId)
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      // 重新查询
      this.getLogininfoList()
    },
    // 点击上一页  下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      // 重新查询
      this.getLogininfoList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.loginStatus)
    },
    // 翻译操作类型
    loginTypeFormatter(row) {
      return this.selectDictLabel(this.loginTypeOptions, row.loginType)
    },
    // 根据ids集合删除数据
    handleDelete(row) {
      const infoIds = row.infoId || this.ids
      this.$confirm('此操作将永久删除登录日志数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteByIds(infoIds).then(() => {
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
      this.$confirm('此操作将永久清空登录日志数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        clearLoginInfo().then(() => {
          this.loading = false
          this.msgSuccess('清空成功')
          this.getLogininfoList()
        })
      }).catch(() => {
        this.msgError('清空已取消')
        this.loading = false
      })
    }
  }
}
</script>
<style>
</style>
