<template>
  <div>
    <!--  查询条件开始  -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="所属部门" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择部门"
          clearable
          size="small"
          style="width:  170px"
        >
          <el-option
            v-for="dict in deptOptions"
            :key="dict.deptName"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          clearable
          size="small"
          style="width:  200px"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          clearable
          size="small"
          style="width:  150px"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.status"
          placeholder="选择状态"
          clearable
          size="small"
          style="width:150px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          size="small"
          value-format="yyyy年MM月dd日  HH时mm分ss秒"
          style="width:  240px"
          range-separator="-"
          start-placeholde="开始时间"
          end-placeholde="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  表格工具按钮开始  -->
    <el-row :gutter="10" style="margin-bottom:  8px;">
      <el-col :span="1.5">
        <el-button type="primary" round icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" round icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" round icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" round icon="el-icon-refresh-right" size="mini" :disabled="multiple" @click="handleResetPwd">重置密码</el-button>
      </el-col>
    </el-row>
    <!--  数据表格  -->
    <el-table
      v-loading="loading"
      border
      :data="userTableList"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="邮箱">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="擅长">
              <span>{{ props.row.strong }}</span>
            </el-form-item>
            <el-form-item label="荣誉">
              <span>{{ props.row.honor }}</span>
            </el-form-item>
            <el-form-item label="简介">
              <span>{{ props.row.introduction }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" align="center" prop="userName" />
      <el-table-column label="部门名称" align="center" prop="detpId" :formatter="deptFormatter" />
      <el-table-column label="手机号【登录身份】" width="180px" align="center" prop="phone" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormatter" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="是否排班" align="center" prop="schedulingFlag" :formatter="schedulingFlagFormatter" />
      <el-table-column label="背景" align="center" prop="background" :formatter="backgroundFormatter" />
      <el-table-column label="状态" align="center" prop="schedulingFlag" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" width="160px" prop="createTime" />
      <el-table-column label="创建人" align="center" width="140px" prop="createTime" />
      <el-table-column label="修改时间" align="center" width="160px" prop="updateTime" />
      <el-table-column label="修改人" align="center" width="140px" prop="updateBy" />
      <el-table-column label="操作" align="center" width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="handleSelectRole(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页控件开始  -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryParams.pageSize"
      layout="total,  sizes,  prev,  pager,  next,  jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--  添加或修改弹出层  -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      center
      append-to-body
      :before-close="closeDialog"
    >
      <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="form.userName" style="width:  240px" placeholder="请输入姓名" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" style="width:  200px" :disabled="isPhone" placeholder="请输入手机号【登录账号】" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <el-select
                v-model="form.deptId"
                placeholder="请选择部门"
                clearable
                size="small"
                style="width:  200px"
              >
                <el-option
                  v-for="d in deptOptions"
                  :key="d.deptId"
                  :label="d.deptName"
                  :value="d.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别" prop="userRank">
              <el-select
                v-model="form.userRank"
                placeholder="请选择级别"
                clearable
                size="small"
                style="width:  200px"
              >
                <el-option
                  v-for="d in userRankOptions"
                  :key="d.dictValue"
                  :label="d.dictLabel"
                  :value="d.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="背景" prop="background">
              <el-select
                v-model="form.background"
                placeholder="学历"
                clearable
                size="small"
                style="width:  200px"
              >
                <el-option
                  v-for="d in backgroundOptions"
                  :key="d.dictValue"
                  :label="d.dictLabel"
                  :value="d.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio
                  v-for="d in sexOptions"
                  :key="d.dictValue"
                  :label="d.dictValue"
                  :value="d.dictValue"
                >{{ d.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="d in statusOptions"
                  :key="d.dictValue"
                  :label="d.dictValue"
                  :value="d.dictValue"
                >{{ d.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否参与排班" prop="schedulingFlag">
              <el-radio-group v-model="form.schedulingFlag">
                <el-radio
                  v-for="d in schedulingFlagOptions"
                  :key="d.dictValue"
                  :label="d.dictValue"
                  :value="d.dictValue"
                >{{ d.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" style="width:220px" placeholder="请输入邮箱" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="擅长" prop="strong">
              <el-input v-model="form.strong" type="textarea" placeholder="请输入你有什么擅长" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="荣誉" prop="honor">
              <el-input v-model="form.honor" type="textarea" placeholder="请输入用户相关荣誉" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入用户简介" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户角色" prop="roleId">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleTableList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确  定</el-button>
        <el-button @click="cancel">取  消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { selectAll } from '@/api/system/dept'
import { getAll } from '@/api/system/role'
import { listForPage, getById, deleteByIds, add, update, resetPassword } from '@/api/system/user'
export default {
  data() {
    return {
      //  是否启用遮罩层
      loading: false,
      //  选中的数组
      ids: [],
      //  非单个禁用
      single: true,
      //  非多个禁用
      multiple: true,
      //  判断是添加页还是修改页
      isPhone: true,
      roleId: undefined,
      //  分页数据总条数
      total: 0,
      //  数据表格
      userTableList: [],
      //  弹出层标题
      title: '',
      //  是否显示弹出层
      open: false,
      //  查询条件里面的部门数据
      deptOptions: [],
      //  状态数据状态
      statusOptions: [],
      //  级别数据字典
      userRankOptions: [],
      //  背景数据字典
      backgroundOptions: [],
      //  是否参与排班数据字典
      schedulingFlagOptions: [],
      //  性别数据字典
      sexOptions: [],
      //  日期范围
      dateRange: [],
      //  查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        userName: undefined,
        phone: undefined,
        status: undefined
      },
      //  表单数据
      form: {
        schedulingFlag: 'Y'
      },
      //  表单校验
      rules: {
        userName: [
          { required: true, message: '科室名称不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        userRank: [
          { required: true, message: '级别不能为空', trigger: 'blur' }
        ],
        background: [
          { required: true, message: '背景不能为空', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        schedulingFlag: [
          { required: true, message: '请选择是否排班', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      },
      //  角色数据
      roleTableList: [],
      //  当前选中的用户
      currentUserId: undefined
    }
  },
  created() {
    //  使用全局  根据字典类型查询字典类型查询字典数据的方法
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    //  加载用户级别
    this.getDataByType('sys_user_level').then(res => {
      this.userRankOptions = res.data
    })
    //  加载用户背景
    this.getDataByType('sys_user_background').then(res => {
      this.backgroundOptions = res.data
    })
    //  加载用户性别
    this.getDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    //  加载用户是否排班
    this.getDataByType('sys_yes_no').then(res => {
      this.schedulingFlagOptions = res.data
    })
    //  查询部门数据
    selectAll().then(res => {
      this.deptOptions = res.data
    })
    this.getUserList()
  },
  methods: {
    //  加载表格数据
    getUserList() {
      this.loading = true //  打开遮罩层
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.userTableList = res.data
        this.total = res.total
        this.loading = false //  关闭遮罩层
      })
    },
    //  条件查询
    handleQuery() {
      this.getUserList()
    },
    //  重置查询条件
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        userName: undefined,
        phone: undefined,
        status: undefined
      }
      this.getUserList()
    },
    //  数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //  分页pageSize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      //  重新查询
      this.getUserList()
    },
    //  点击上一页    下一页，跳转到哪一页面时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      //  重新查询
      this.getUserList()
    },
    //  翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    //  翻译性别
    sexFormatter(row) {
      return this.selectDictLabel(this.sexOptions, row.sex)
    },
    //  翻译排班状态
    schedulingFlagFormatter(row) {
      return this.selectDictLabel(this.schedulingFlagOptions, row.schedulingFlag)
    },
    //  翻译用户级别
    userRankFormatter(row) {
      return this.selectDictLabel(this.userRankOptions, row.userRank)
    },
    //  翻译用户级别
    backgroundFormatter(row) {
      return this.selectDictLabel(this.backgroundOptions, row.background)
    },
    //  翻译部门
    deptFormatter(row) {
      let deptName = ''
      this.deptOptions.filter(item => {
        if (parseInt(item.deptId) === parseInt(row.deptId)) {
          deptName = item.deptName
        }
      })
      return deptName
    },
    //  打开添加的弹出层
    handleAdd() {
      this.open = true
      this.isPhone = false
      this.title = '添加用户信息'
      //  查询所有角色信息
      getAll().then(res => {
        this.roleTableList = res.data
      })
    },
    //  打开修改弹窗
    handleUpdate(row) {
      //  this.reset()
      this.title = '修改用户信息'
      const userId = row.userId || this.ids
      this.open = true
      this.isPhone = true
      this.loading = true
      getAll().then(res => {
        this.roleTableList = res.data
      })
      getById(userId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    //  删除
    handleDelete(row) {
      const userIds = row.userId || this.ids
      this.$confirm('此操作将永久删除该用户数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteByIds(userIds).then(() => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.resetQuery()
        }).catch(() => {
          this.msgError('删除失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgError('删除已取消')
        this.loading = false
      })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          //  添加
          if (this.form.userId === undefined) {
            add(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.getUserList()
              this.reset()
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            //  修改
            update(this.form).then(() => {
              this.msgSuccess('修改成功')
              this.getUserList()
              this.reset()
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    //  取消
    cancel() {
      this.open = false
      this.reset()
      this.title = ''
    },
    //  重置表单
    reset() {
      this.form = {
        userId: undefined,
        userName: undefined,
        phone: undefined,
        sex: undefined,
        age: 0,
        status: undefined,
        email: undefined,
        strong: undefined,
        honor: undefined,
        introduction: undefined,
        remark: undefined,
        schedulingFlag: undefined,
        roleId: undefined
      }
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
      this.reset()
      this.open = false
    },
    //  重置密码
    handleResetPwd() {
      const userIds = this.ids
      const tx = this
      tx.$confirm('是否确认重置这些选中的用户密码？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(userIds).then((res) => {
          tx.msgSuccess(res.msg)
        }).catch(() => {
          tx.msgError('重置失败')
        })
      }).catch(() => {
        tx.msgError('重置已取消')
      })
    }
  }
}
</script>
<style  scoped>
    .demo-table-expand  {
        font-size:  0;
    }
    .demo-table-expand  label  {
        width:  90px;
        color:  #99a9bf;
    }
    .demo-table-expand  .el-form-item  {
        margin-right:  0;
        margin-bottom:  0;
        width:  50%;
    }
</style>
