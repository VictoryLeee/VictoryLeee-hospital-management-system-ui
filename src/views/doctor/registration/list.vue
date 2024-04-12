<template>
  <div>
    <!-- 查询条件 -->
    <el-form :model="queryParams" :inline="true" label-width="90px" size="mini">
      <el-form-item label="挂号单">
        <el-input v-model="queryParams.registrationId" placeholder="请输入单号" clearable style="width:200px" />
      </el-form-item>
      <el-form-item label="所属科室">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择所属科室"
          clearable
          style="width:200px"
        >
          <el-option v-for="d in deptList" :key="d.deptId" :label="d.deptName" :value="d.deptId" />
        </el-select>
      </el-form-item>
      <el-form-item label="患者姓名">
        <el-input v-model="queryParams.patientName" placeholder="请输入患者姓名" clearable style="width:200px" />
      </el-form-item>
      <el-form-item label="挂号类型">
        <el-select
          v-model="queryParams.schedulingType"
          placeholder="请选择挂号类型"
          clearable
          style="width:200px"
        >
          <el-option v-for="d in schedulingTypeOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="挂号时段">
        <el-select
          v-model="queryParams.subsectionType"
          placeholder="请选择挂号时段"
          clearable
          style="width:200px"
        >
          <el-option v-for="d in subsectionTypeOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="挂号状态">
        <el-select
          v-model="queryParams.registrationStatus"
          placeholder="请选择挂号状态"
          clearable
          style="width:200px"
        >
          <el-option v-for="d in regStatusOptions" :key="d.dictValue" :label="d.dictLabel" :value="d.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="挂号时间">
        <el-date-picker
          v-model="queryParams.queryDate"
          value-format="yyyy-MM-dd"
          type="date"
          clearable
          style="width:200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button type="normal" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table v-loading="loading" border :data="regTableList" size="mini">
      <el-table-column label="挂号单" align="center" prop="registrationId" width="200px" />
      <el-table-column label="挂号员" align="center" prop="createBy" width="120px" />
      <el-table-column label="患者姓名" align="center" prop="patientName" width="140px" />
      <el-table-column label="挂号科室" align="center" prop="deptId" :formatter="deptNameFormatter" width="100px" />
      <el-table-column label="接诊医生" align="center" prop="doctorName" width="140px" />
      <el-table-column label="挂号费用" align="center" prop="registrationAmount" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.registrationAmount | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流水编号" align="center" prop="registrationNumber" width="90px" />
      <el-table-column label="就诊日期" align="center" prop="visitDate" width="120px" />
      <el-table-column label="挂号状态" align="center" prop="registrationStatus" :formatter="registrationStatusFormatter" width="90px" />
      <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" width="90px" />
      <el-table-column label="挂号时段" align="center" prop="subsectionType" :formatter="subsectionTypeFormatter" width="90px" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="155px" />
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.registrationStatus=='0'" type="text" icon="el-icon-check" size="mini" @click="handleCollect(scope.row)">收费</el-button>
          <el-button v-if="scope.row.registrationStatus=='1'" type="text" icon="el-icon-close" size="mini" @click="handleReturn(scope.row)">退号</el-button>
          <el-button v-if="scope.row.registrationStatus=='0'" type="text" icon="el-icon-check" size="mini" @click="handleInvalid(scope.row)">作废</el-button>
          <el-button v-if="scope.row.registrationStatus=='5'" type="text" icon="el-icon-check" size="mini" @click="handleNoInvalid(scope.row)">反作废</el-button>
          <router-link :to="'/newcare/toNewcare/'+ scope.row.registrationId + '/' + scope.row.patientId" class="link-type">
            <el-button type="text" icon="el-icon-check" size="mini">就诊信息</el-button>
          </router-link>
          <el-button v-if="scope.row.registrationStatus=='0' || scope.row.registrationStatus=='5'" type="text" icon="el-icon-close" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5,10,20,30]"
      :page-size="queryParams.pageSize"
      layout="total,sizes,prev,pager,next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { selectAll } from '@/api/system/dept'
import { getUsersNeedScheduling } from '@/api/doctor/scheduling'
import { getRegForPage, doInvalid, doReturn, collectFee, noInvalid, deleteById } from '@/api/doctor/registration'
export default {
  // 过滤器
  filters: {
    // 保留两位小数
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 挂号数据
      regTableList: [],
      // 用户数据
      userList: [],
      // 科室数据
      deptList: [],
      // 挂号单状态数据字典
      regStatusOptions: [],
      // 挂号类别
      schedulingTypeOptions: [],
      // 挂号时间段 上午、下午、晚上
      subsectionTypeOptions: [],
      // 就诊日期数组 开始结束
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        deptId: undefined,
        schedulingType: undefined,
        subsectionType: undefined,
        visitDate: undefined,
        queryDate: new Date()
      }
    }
  },
  created() {
    // 加载排班类别
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 加载排班时间段 上午下午晚上
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 加载挂号类别 0未收费,1待就诊，2,就诊中，3，就诊完成，4，已退号，5 作废
    this.getDataByType('his_registration_status').then(res => {
      this.regStatusOptions = res.data
    })
    // 查询可用的科室
    selectAll().then(res => {
      this.deptList = res.data
    })
    // 查询需要排班的医生
    getUsersNeedScheduling().then(res => {
      this.userList = res.data
    })
    // 查询挂号列表信息
    this.getRegistrationForPage()
  },
  methods: {
    // 分页查询挂号信息数据
    getRegistrationForPage() {
      this.loading = true
      // 查询当天的排班日期就是当天就诊日期
      this.queryParams.visitDate = this.moment(this.queryParams.queryDate)
      getRegForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.regTableList = res.data
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 每页显示多少条的数据变化
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getRegistrationForPage()
    },
    // 分页跳转
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getRegistrationForPage()
    },
    // 搜索
    handleQuery() {
      this.getRegistrationForPage()
    },
    // 重置查询条件
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        deptId: undefined,
        schedulingType: undefined,
        subsectionType: undefined,
        visitDate: undefined,
        queryDate: new Date()
      }
      this.getRegistrationForPage()
    },
    // 翻译部门名称
    deptNameFormatter(row, column) {
      let deptName
      this.deptList.filter(dept => {
        if (dept.deptId === row.deptId) {
          deptName = dept.deptName
        }
      })
      return deptName
    },
    // 翻译排班类型
    schedulingTypeFormatter(row, column) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType)
    },
    // 翻译排班时段
    subsectionTypeFormatter(row, column) {
      return this.selectDictLabel(this.subsectionTypeOptions, row.subsectionType)
    },
    // 翻译挂号类型
    registrationStatusFormatter(row, column) {
      return this.selectDictLabel(this.regStatusOptions, row.registrationStatus)
    },
    // 收费
    handleCollect(row) {
      this.loading = true
      collectFee(row.registrationId).then(() => {
        this.loading = false
        this.msgSuccess('收费成功')
        this.getRegistrationForPage()
      }).catch(() => {
        this.loading = false
      })
    },
    // 收费
    handleInvalid(row) {
      this.loading = true
      doInvalid(row.registrationId).then(() => {
        this.loading = false
        this.msgSuccess('作废成功')
        this.getRegistrationForPage()
      }).catch(() => {
        this.loading = false
      })
    },
    // 退号
    handleReturn(row) {
      this.loading = true
      doReturn(row.registrationId).then(() => {
        this.loading = false
        this.msgSuccess('退号成功')
        this.getRegistrationForPage()
      }).catch(() => {
        this.loading = false
      })
    },
    // 反作废 状态为未收费
    handleNoInvalid(row) {
      this.loading = true
      noInvalid(row.registrationId).then(res => {
        this.loading = false
        this.msgSuccess('反作废成功')
        this.getRegistrationForPage()
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除 如果状态不是待收费或已作废不能删除
    handleDelete(row) {
      this.loading = true
      deleteById(row.registrationId).then(() => {
        this.loading = false
        this.msgSuccess('删除成功')
        this.getRegistrationForPage()
      }).catch(() => {
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
