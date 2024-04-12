<template>
  <div>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="角色名称">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input
          v-model="queryParams.roleCode"
          placeholder="请输入权限标识"
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
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-thumb" size="mini" :disabled="single" @click="handleSelectMenu">分配权限</el-button>
      </el-col>
    </el-row>
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="roleTableList"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色名称" prop="roleName" align="center" width="200px" />
      <el-table-column label="权限标识" prop="roleCode" align="center" width="150px" />
      <el-table-column label="显示顺序" prop="roleSort" align="center" width="100px" />
      <el-table-column label="备注" prop="remark" align="center" width="180px" />
      <el-table-column label="状态" prop="status" align="center" width="80px" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" width="160px" prop="createTime" />
      <el-table-column label="创建人" align="center" width="140px" prop="createTime" />
      <el-table-column label="修改时间" align="center" width="160px" prop="updateTime" />
      <el-table-column label="修改人" align="center" width="140px" prop="updateBy" />
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleSelectMenu(scope.row)">分配权限</el-button>
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" size="small" clearable />
        </el-form-item>
        <el-form-item label="权限标识" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入权限标识" size="small" clearable />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" placeholder="请输入显示顺序" size="small" clearable />
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
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="请输入备注" size="small" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出层 -->
    <el-dialog
      :title="title"
      :visible.sync="selectMenuOpen"
      width="400px"
      center
      append-to-body
    >
      <el-tree
        ref="menu"
        :data="menuOptions"
        show-checkbox
        node-key="menuId"
        hightlight-current
        empty-text="加载中，请稍后"
        :props="{id: 'menuId', children: 'children', label: 'menuName'}"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSelectMenuSubmit">确 定</el-button>
        <el-button type="primary" @click="cancelSelectMenu">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listForPage, add, update, getById, deleteByIds, saveRoleMenu } from '@/api/system/role'
import { getMenuTree, getMenuIdsByRoleId } from '@/api/system/menu'
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
      // 角色表格数据
      roleTableList: [],
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
        roleName: undefined,
        roleCode: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '权限编码不能为空', trigger: 'blur' }
        ]
      },
      // 是否打开分配权限的弹出层
      selectMenuOpen: false,
      // 菜单树的数据
      menuOptions: [],
      // 当前选中角色ID
      currentRoldId: undefined
    }
  },
  created() {
    // 使用全局的方法 根据字典类型查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    this.getRoleList()
  },
  methods: {
    // 查询角色数据
    getRoleList() {
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.roleTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getRoleList()
    },
    // 重置查询条件
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleCode: undefined,
        status: undefined
      }
      this.dataRange = []
      this.getRoleList()
    },
    // 数据表格的多选框
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 一页多少条数发生改变后
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getRoleList()
    },
    // 上一页下一页，跳转到那一页的改变
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getRoleList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加弹出层
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加角色信息'
    },
    // 打开修改弹出层
    handleUpdate(row) {
      this.title = '修改角色信息'
      const roleId = row.roleId || this.ids
      this.reset()
      this.open = true
      getById(roleId).then(res => {
        this.form = res.data
        this.loading = false
      })
    },
    // 执行删除
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      this.$confirm('此操作将永久删除该角色数据，以及用户赋的角色和菜单关联都会输删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteByIds(roleIds).then(() => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getRoleList()
          this.pageNum = 1
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
          if (this.form.roleId === undefined) {
            add(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.loading = true
              this.getRoleList()
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            update(this.form).then(() => {
              this.msgSuccess('修改成功')
              this.loading = true
              this.getRoleList()
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
        roleId: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleSort: 0,
        remark: undefined,
        status: '0'
      }
    },
    // 打开分配权限和菜单的弹出层
    handleSelectMenu(row) {
      this.currentRoldId = row.roleId || this.ids[0]
      this.title = '分配权限和菜单'
      this.selectMenuOpen = true
      // 查询所有可用的菜单
      getMenuTree().then(res => {
        this.menuOptions = this.handleTree(res.data, 'menuId')
      })
      // 根据角色查询当前角色拥有的那些菜单和权限
      getMenuIdsByRoleId(this.currentRoldId).then(res => {
        this.$refs.menu.setCheckedKeys(res.data)
      })
    },
    // 保存角色和菜单权限的关系
    handleSelectMenuSubmit() {
      // 获取选中的keys
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      console.log(checkedKeys)
      // 获取半选的keys
      const halfCheckKeys = this.$refs.menu.getHalfCheckedKeys()
      // 组合成最后的keys
      const finalKey = halfCheckKeys.concat(checkedKeys)
      console.log(finalKey)
      saveRoleMenu(this.currentRoldId, finalKey).then(res => {
        this.msgSuccess('分配成功，重新登陆即可')
      }).catch(() => {
        this.msgSuccess('分配失败')
      })
    },
    // 关闭分配权限和菜单的弹出层
    cancelSelectMenu() {
      this.selectMenuOpen = false
      this.menuOptions = []
    }
  }
}
</script>

<style>

</style>
