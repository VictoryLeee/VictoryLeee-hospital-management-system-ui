<template>
  <div>
    <!-- 查询条件 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="98px" size="small">
      <el-form-item label="患者姓名">
        <el-input v-model="queryParams.name" placeholder="请输入患者姓名" clearable style="width:180px" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable style="width:180px" />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable style="width:180px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格工具 -->
    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="single" @click="handleViewFile">查看档案</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click=" handleViewCareHistory">查看就诊病例</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <el-table v-loading="loading" border style="width: 99%" :data="patientTableList" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" prop="name" align="center" />
      <el-table-column label="电话" prop="phone" align="center" />
      <el-table-column label="身份证号" width="200px" prop="idCard" align="center" />
      <el-table-column label="出身年月日" width="120px" prop="birthday" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday.substring(0,10) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" prop="birthday" width="90px" align="center" :formatter="calculateAgeFormatter" />
      <el-table-column label="性别" prop="sex" width="90px" align="center" :formatter="sexFormatter" />
      <el-table-column label="信息状态" width="100px" prop="isFinal" :formatter="isFinalFormatter" align="center" />
      <el-table-column label="创建时间" width="150px" prop="createTime" align="center" />
    </el-table>
    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 查看患者档案弹出层 -->
    <el-dialog :title="title" :visible.sync="fileOpen" width="1000px" center append-to-body>
      <el-form label-position="left" label-width="120pxx" inline class="demo-table-expand">
        <el-form-item label="ID:">
          <span v-text="patientObj.patientId" />
        </el-form-item>
        <el-form-item label="姓名:">
          <span v-text="patientObj.name" />
        </el-form-item>
        <el-form-item label="身份证号:">
          <span v-text="patientObj.idCard" />
        </el-form-item>
        <el-form-item label="电话:">
          <span v-text="patientObj.phone" />
        </el-form-item>
        <el-form-item label="性别:">
          <span v-text="patientObj.sex" />
        </el-form-item>
        <el-form-item label="出行年月:">
          <span v-text="patientObj.birthday" />
        </el-form-item>
        <el-form-item label="地址信息:">
          <span v-text="patientObj.address" />
        </el-form-item>
        <el-form-item label="过敏信息:">
          <span v-text="patientObj.allergyInfo" />
        </el-form-item>
        <el-form-item label="是否完善信息:">
          <span v-text="patientObj.isFinal" />
        </el-form-item>
        <el-form-item label="最后登录IP:">
          <span v-text="patientObj.lastLoginIp" />
        </el-form-item>
        <el-form-item label="最后登录时间:">
          <span v-text="patientObj.lastLoginTime" />
        </el-form-item>
        <el-form-item label="创建时间:">
          <span v-text="patientObj.createTime" />
        </el-form-item>
        <el-form-item label="更新时间:">
          <span v-text="patientObj.updateTime" />
        </el-form-item>
        <el-form-item label="紧急联系人:">
          <span v-text="patientFileObj.emergencyContactName" />
        </el-form-item>
        <el-form-item label="紧急联系人电话:">
          <span v-text="patientFileObj.emergencyContactPhone" />
        </el-form-item>
        <el-form-item label="关系:">
          <span v-text="patientFileObj.emergencyContactRelation" />
        </el-form-item>
        <el-form-item label="左耳听力:">
          <span v-text="patientFileObj.leftEarHearing" />
        </el-form-item>
        <el-form-item label="右耳听力:">
          <span v-text="patientFileObj.rightEarHearing" />
        </el-form-item>
        <el-form-item label="左眼视力:">
          <span v-text="patientFileObj.leftVision" />
        </el-form-item>
        <el-form-item label="右眼视力:">
          <span v-text="patientFileObj.rightVision" />
        </el-form-item>
        <el-form-item label="身高:">
          <span v-text="patientFileObj.height" />
        </el-form-item>
        <el-form-item label="体重:">
          <span v-text="patientFileObj.weight" />
        </el-form-item>
        <el-form-item label="血型:">
          <span v-text="patientFileObj.bloodType" />
        </el-form-item>
        <el-form-item label="个人史:">
          <span v-text="patientFileObj.personalInfo" />
        </el-form-item>
        <el-form-item label="家族史:">
          <span v-text="patientFileObj.familyInfo" />
        </el-form-item>
        <el-form-item label="档案创建时间:">
          <span v-text="patientFileObj.createTime" />
        </el-form-item>
        <el-form-item label="档案更新时间:">
          <span v-text="patientFileObj.updateTime" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 患者病历列表弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="careHistoryOpen"
      width="1000px"
      center
      append-to-body
    >
      <el-card>
        <div slot="header" style="text-align: left;font-size:20px;font-weight: 700;">
          <span>基本信息</span>
        </div>
        <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
          <el-form-item label="患者编码：">
            <span v-text="patientObj.patientId" />
          </el-form-item>
          <el-form-item label="患者姓名：">
            <span v-text="patientObj.name" />
          </el-form-item>
          <el-form-item label="身份证号：">
            <span v-text="patientObj.idCard" />
          </el-form-item>
          <el-form-item label="患者电话：">
            <span v-text="patientObj.phone" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="margin-top:3px">
        <div slot="header" style="text-align: left;font-size:20px;font-weight: 700;">
          <span>病历列表</span>
        </div>
        <div v-if="allPatientMsg.length>0">
          <el-collapse accordion>
            <el-collapse-item
              v-for="(item, index) in allPatientMsg"
              :key="index"
              :name="index"
            >
              <template slot="title">
                <span style="font-size:15px;font-weight: 700;color:red">
                  {{ index+1 }}、科室：【{{ item.deptName }}】，就诊时间：{{ item.careTime }}
                </span>
              </template>
              <div class="msg-item"><span class="msg-item-title">主诊：</span>{{ item.caseTitle }}</div>
              <div class="msg-item"><span class="msg-item-title">诊断信息：</span>{{ item.caseResult }}</div>
              <div class="msg-item"><span class="msg-item-title">医生建议：</span>{{ item.doctorTips }}</div>
              <div class="msg-item"><span class="msg-item-title">备注：</span>{{ item.remark }}</div>
              <!-- 当前挂号历史处方列表 -->
              <el-collapse v-show="item.careOrderList.length>0" accordion>
                <el-collapse-item
                  v-for="(it, i) in item.careOrderList"
                  :key="i"
                >
                  <template slot="title">
                    <span style="font-weight: 550;">{{ i+1 }}、<span v-if="i.coType === '0'" style="color:red">药品处方</span><span v-else style="color:green">检查处方</span> 、金额:<span style="color:red">￥ {{ it.allAmount }}</span></span>
                  </template>
                  <el-table
                    v-loading="loading"
                    border
                    :data="it.careOrderItemList"
                  >
                    <el-table-column label="序号" align="center" type="index" width="50" />
                    <el-table-column :label="it.coType==='0'?'药品处方':'项目名称'" align="center" prop="itemName" />
                    <el-table-column label="数量" align="center" prop="num" />
                    <el-table-column label="单价(元)" align="center" prop="price" />
                    <el-table-column label="金额(元)" align="center" prop="amount" />
                    <el-table-column label="备注" align="center" prop="remark" />
                    <el-table-column label="状态" align="center" prop="status" :formatter="orderDetailsStatusFormatter" />
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else style="text-align:center;font-weight: 700;">
          暂无就诊数据
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import { listPatientForPage, getPatientById, getPatientFileById, getCareHistoryAndCareOrderAndCareOrderItemByPatientId } from '@/api/doctor/patient'
export default {
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 选中的数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页总条数
      total: 0,
      // 患者数据
      patientTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示档案弹出层
      fileOpen: false,
      // 性别数据字典
      sexOptions: [],
      // 完善信息状态
      isFinalOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        idCard: undefined,
        phone: undefined
      },
      // 患者信息
      patientObj: {},
      // 患者档案信息
      patientFileObj: {},
      // 是否打开病历弹出层
      careHistoryOpen: false,
      // 患者所有就诊信息
      allPatientMsg: [],
      // 订单状态
      statusOptions: []
    }
  },
  created() {
    // 加载性别
    this.getDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 加载是否完善信息
    this.getDataByType('his_patient_msg_final').then(res => {
      this.isFinalOptions = res.data
    })
    //  加载处方详情的状态字典数据
    this.getDataByType('his_order_details_status').then(res => {
      this.statusOptions = res.data
    })
    // 查询表格数据
    this.getPatientList()
  },
  methods: {
    getPatientList() {
      this.loading = true
      listPatientForPage(this.queryParams).then(res => {
        this.patientTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getPatientList()
    },
    // 重置查询条件
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        idCard: undefined,
        phone: undefined
      }
      this.getPatientList()
    },
    // 数据表格的多选框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.patientId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getPatientList()
    },
    // 点上一页 下一页 跳转页面的触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getPatientList()
    },
    // 翻译性别
    sexFormatter(row) {
      return this.selectDictLabel(this.sexOptions, row.sex)
    },
    // 翻译信息状态
    isFinalFormatter(row) {
      return this.selectDictLabel(this.isFinalOptions, row.isFinal)
    },
    // 根据出身年月日计算年龄
    calculateAgeFormatter(row) {
      return this.getAge(row.birthday.substring(0, 10))
    },
    // 查询患者档案
    handleViewFile() {
      const patientId = this.ids[0]
      this.fileOpen = true
      this.title = '查询患者档案信息'
      this.patientFileObj = {}
      this.patientObj = {}
      // 查询患者
      getPatientById(patientId).then(res => {
        this.patientObj = res.data
        const sex = this.patientObj.sex
        const isFinal = this.patientObj.isFinal
        this.patientObj.sex = (sex === '0' ? '男' : sex === '1' ? '女' : '未知')
        this.patientObj.isFinal = isFinal === '0' ? '未完善' : '已完善'
      })
      // 查看档案
      getPatientFileById(patientId).then(res => {
        if (res.data !== null) {
          this.patientFileObj = res.data
        }
      })
    },
    // 取消
    cancelFile() {
      this.fileOpen = false
      this.title = ''
    },
    // 查询患者就诊信息
    handleViewCareHistory(row) {
      const patientId = this.ids[0]
      this.careHistoryOpen = true
      this.title = '查询患者病历信息'
      this.patientObj = {}
      // 查询患者
      getPatientById(patientId).then(res => {
        this.patientObj = res.data
      })
      // 根据患者id查询患者信息、患者病历信息、处方信息和处方详情列表
      getCareHistoryAndCareOrderAndCareOrderItemByPatientId(patientId).then(res => {
        this.allPatientMsg = res.data
      })
    },
    // 翻译处方详情状态
    orderDetailsStatusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
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
  .msg-item {
    font-size: 14px;
    margin-bottom: 8px;
    /* 设置css里的内容自动换行 */
    word-break:break-all;
  }
  .msg-item-title {
    font-weight: 550;
    font-size: 14px;
  }
</style>
