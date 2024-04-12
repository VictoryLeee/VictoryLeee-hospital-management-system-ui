<template>
  <div>
    <!-- 患者信息搜索 -->
    <el-card class="box-card">
      <el-form ref="queryForm" :inline="true" :model="patientParams" label-width="90px" :rules="queryForm" size="small">
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="patientParams.idCard" placeholder="请输入患者身份证号" style="300px" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleIdCardQuery">加载加载患者信息</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 患者基本信息 -->
    <el-card class="box-card">
      <el-form ref="form" :model="patientParams" :rules="rules" :inline="true" size="small" label-width="90px">
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="patientParams.idCard" placeholder="请输入身份证号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="患者姓名" prop="name">
          <el-input v-model="patientParams.name" placeholder="请输入患者姓名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="患者电话" prop="phone">
          <el-input v-model="patientParams.phone" placeholder="请输入患者电话" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="patientParams.sex">
            <el-radio v-for="d in sexOptions" :key="d.dictValue" :label="d.dictValue" :value="d.dictValue">
              {{ d.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="patientParams.birthday"
            style="width:200px"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item label="患者年龄" prop="age">
          <el-input v-model="patientParams.age" placeholder="请输入患者年龄" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="地址信息" prop="address">
          <el-input v-model="patientParams.address" placeholder="请输入地址信息" clearable style="width: 200px" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 挂号项目栏 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <el-radio-group v-model="queryDeptParams.regItemId" @change="registeredItemItemChange">
            <el-radio-button
              v-for="d in regItemOptions"
              :key="d.regItemId"
              :label="d.regItemId"
              :value="d.regItemId"
            >
              {{ d.regItemName }}
            </el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="12">
          <div style="float: right">
            <span style="margin-right: 20px">挂号费：￥{{ queryDeptParams.regItemAmount }}</span>
            <el-button type="danger" icon="el-icon-search" :disabled="single" size="small" @click="handleRegistration">挂号收费</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 挂号时段 -->
    <el-card>
      <el-form ref="queryDeptForm" :model="queryDeptParams" :inline="true" label-width="68px" size="small">
        <el-form-item label="所属科室" prop="deptId">
          <el-select v-model="queryDeptParams.deptId" placeholder="请选择所属科室" clearable style="width: 200px">
            <el-option v-for="d in deptOptions" :key="d.deptId" :label="d.deptName" :value="d.deptId" />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号类型" prop="schedulingType">
          <el-select
            v-model="queryDeptParams.schedulingType"
            placeholder="请选择挂号类型"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option
              v-for="dict in schedulingTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号时段" prop="subsectionType">
          <el-select
            v-model="queryDeptParams.subsectionType"
            placeholder="请选择挂号时段"
            clearable
            size="small"
            style="width:200px"
          >
            <el-option
              v-for="dict in subsectionTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号时间" prop="schedulingDay">
          <el-date-picker
            v-model="queryDeptParams.schedulingDay"
            clearable
            size="small"
            type="date"
            value-format="yyyy-MM-dd"
            style="width:240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDeptQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetDeptQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 科室数据 -->
      <el-table v-loading="loading" border :data="deptTableList" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="科室ID" align="center" prop="deptId" />
        <el-table-column label="科室名称" align="center" prop="deptName" />
        <el-table-column label="当前号数" align="center" prop="regNumber" />
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getPatientByIdCard, listDeptForScheduling, addRegistration, collectFee } from '@/api/doctor/registration'
import { selectAll } from '@/api/system/dept'
import { getAllRegisteredItem } from '@/api/system/registerItem'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中部门IDS
      ids: [],
      // 非单个禁用
      single: true,
      // 科室下拉列表数据
      deptOptions: [],
      // 性别数据字典
      sexOptions: [],
      // 挂号类型数据字典
      schedulingTypeOptions: [],
      // 排班时段数据字典
      subsectionTypeOptions: [],
      // 挂号项目
      regItemOptions: [],
      // 患者信息查询参数
      patientParams: {
        // 性别分为：男0，女1，未知3
        sex: '2'
      },
      // 有挂号部门的查询条件
      queryDeptParams: {
        deptId: undefined,
        schedulingType: '1',
        subsectionType: undefined,
        schedulingDay: new Date(),
        regItemId: 1,
        regItemAmount: 0
      },
      // 挂号费用
      regItemAmount: undefined,
      // 表单校验
      rules: {
        name: [
          { required: true, message: '患者名称不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号' }
        ],
        idCard: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' }
        ]
      },
      queryForm: {
        idCard: [
          { required: true, message: '患者身份证号码不能为空', trigger: 'blur' }
        ]
      },
      // 部门数据
      deptTableList: []
    }
  },
  watch: {
    patientParams: {
      handler: function() {
        if (this.patientParams.birthday !== undefined) {
          this.patientParams.age = this.getAge(this.patientParams.birthday.substring(0, 10))
        }
      },
      deep: true
    }
  },
  created() {
    // 查询所有可用的科室
    selectAll().then(res => {
      this.deptOptions = res.data
    })
    // 加载排班类型 1.门诊、2.急诊
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 排班时段 123 上下晚
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 加载用户性别
    this.getDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 查询所有可用的挂号费用
    getAllRegisteredItem().then(res => {
      this.regItemOptions = res.data
      this.queryDeptParams.regItemId = this.regItemOptions[0].regItemId
      this.queryDeptParams.regItemAmount = this.regItemOptions[0].regItemFee
    })
    // 获取并设置查询时段
    const subsectionType = this.getCurrentTimeType()
    this.queryDeptParams.subsectionType = subsectionType
    // 加载部门数据
    this.getDeptForScheduling()
  },
  methods: {
    // 根据部门id或值班日期或值班类型以及上下晚类型，查询部门集合
    getDeptForScheduling() {
      this.loading = true
      listDeptForScheduling(this.queryDeptParams).then(res => {
        this.deptTableList = res.data
        this.loading = false
      })
    },
    // 查询部门集合
    handleDeptQuery() {
      this.getDeptForScheduling()
    },
    // 重置
    resetDeptQuery() {
      const subsectionType = this.getCurrentTimeType()
      this.queryDeptParams = {
        deptId: undefined,
        schedulingType: '1',
        subsectionType: subsectionType,
        schedulingDay: new Date(),
        regItemId: 1,
        regItemAmount: undefined
      }
      this.queryDeptParams.regItemId = this.regItemOptions[0].regItemId
      this.queryDeptParams.regItemAmount = this.regItemOptions[0].regItemFee
      this.getDeptForScheduling()
    },
    // 根据身份证号码查询患者数据
    handleIdCardQuery() {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          getPatientByIdCard(this.patientParams.idCard).then(res => {
            this.patientParams = res.data
            this.patientParams.age = this.getAge(res.data.birthday.substring(0, 10))
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.patientParams = { sex: '2' }
          })
        }
      })
    },
    // 更新挂号项目类型事件
    registeredItemItemChange(id) {
      this.regItemOptions.filter(item => {
        if (id === item.regItemId) {
          this.queryDeptParams.regItemId = item.regItemId
          this.queryDeptParams.regItemAmount = item.regItemFee
        }
      })
      // 动态显示挂号信息
      if (id === 1) {
        this.queryDeptParams.schedulingType = '1'
      } else {
        this.queryDeptParams.schedulingType = '2'
      }
      // 重新查询有号的部门
      this.getDeptForScheduling()
    },
    // 表格选中事件
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.deptId)
      this.single = selection.length !== 1
    },
    // 挂号收费
    handleRegistration() {
      const tx = this
      tx.$refs['form'].validate(vail => {
        if (vail) {
          tx.$confirm('是否确认给【' + tx.patientParams.name + '】进行挂号?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            // 获取科室ID
            const deptId = tx.ids[0]
            // 组装要提交到后台的挂号数据
            const registrationFormDto = { 'patientDto': tx.patientParams, 'registrationDto': {
              deptId: deptId,
              registrationItemId: tx.queryDeptParams.regItemId,
              registrationAmount: tx.queryDeptParams.regItemAmount,
              visitDate: tx.moment(this.queryDeptParams.schedulingDay).format('YYYY-MM-DD'),
              schedulingType: tx.queryDeptParams.schedulingType,
              subsectionType: tx.queryDeptParams.subsectionType
            }}
            // 挂号
            addRegistration(registrationFormDto).then(res => {
              const regId = res.data
              tx.msgSuccess('挂号成功 挂号单为【' + regId + '】')
              // 清空页面上的数据
              tx.resetDeptQuery()
              tx.patientParams = { sex: '2' }
              // 是否继续对挂号进行收费
              tx.$confirm('是否确认给挂号ID为【' + regId + '】的挂号收费?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'warning',
                center: true
              }).then(() => {
                // 重新查询挂号列表
                collectFee(regId).then(r => {
                  tx.msgSuccess('收费成功')
                  tx.getDeptForScheduling()
                })
              })
            })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.box-card {
  padding: 0px;
  margin: 0px;
  margin-bottom: 8px;
}
</style>
