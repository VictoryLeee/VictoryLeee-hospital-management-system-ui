<template>
  <div>
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="danger" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      border
      :data="menuTableList"
      row-key="menuId"
      size="small"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单名称" prop="menuName" align="left" width="200px" />
      <el-table-column label="菜单类型" prop="menuType" align="center" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.menuType === 'M'?'primary':scope.row.menuType==='C'?'danger':'success'">
            {{ scope.row.menuType ==='M' ? '目录': scope.row.menuType==='C'?'菜单':'权限' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="组件路径" prop="path" align="center" width="120px" />
      <el-table-column label="权限标识" prop="percode" align="center" width="130px" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" width="80px" />
      <el-table-column label="创建时间" align="center" width="160px" prop="createTime" />
      <el-table-column label="创建人" align="center" width="140px" prop="createTime" />
      <el-table-column label="修改时间" align="center" width="160px" prop="updateTime" />
      <el-table-column label="修改人" align="center" width="140px" prop="updateBy" />
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-plus" size="mini" @click="handleAdd(scope.row)">添加</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件开始 -->
    <el-pagination
      layout="total"
      :total="menuTableList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 添加修改弹出层开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentName">
              <treeselect
                v-model="form.parentId"
                placeholder="请选择上级菜单"
                :show-count="true"
                :options="menuOptions"
                :normalizer="normalizer"
                size="small"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址">
              <el-input v-model="form.path" placeholder="请输入路由地址" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType==='F'" label="权限标识" prop="percode">
              <el-input v-model="form.percode" placeholder="请输入权限标识" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" placeholder="请输入备注" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listForMenus, add, update, getById, deleteById, getMenuTree } from '@/api/system/menu'
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 非单个禁用
      single: true,
      // 非多禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 科室表格数据
      menuTableList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 菜单树的数据
      menuOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 使用全局的方法 根据字典类型查询字典数据
    this.getDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    this.getMenuList()
  },
  methods: {
    // 查询部门数据
    getMenuList() {
      this.loading = true
      listForMenus(this.queryParams).then(res => {
        this.menuTableList = this.handleTree(res.data, 'menuId')
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getMenuList()
    },
    // 重置查询条件
    resetQuery() {
      this.queryParams = {
        menuName: undefined,
        status: undefined
      }
      this.getMenuList()
    },
    // 翻译状态
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加弹出层
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.parentId = row.menuId
        if (row.menuType === 'M') {
          this.form.menuType = 'C'
        } else if (row.menuType === 'C') {
          this.form.menuType = 'F'
        }
      }
      this.title = '添加菜单或权限信息'
      this.open = true
    },
    // 打开修改弹出层
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      getById(row.menuId).then(res => {
        this.form = res.data
        this.title = '修改菜单或权限信息'
        this.open = true
      })
    },
    // 查询菜单下拉树的数据
    getTreeselect() {
      getMenuTree().then(res => {
        this.menuOptions = []
        const menu = { menuId: 0, menuName: '主类目', children: [] }
        menu.children = this.handleTree(res.data, 'menuId')
        this.menuOptions.push(menu)
      })
    },
    // 自定义键名
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      }
    },
    // 执行删除
    handleDelete(row) {
      const menuId = row.menuId
      this.$confirm('此操作将永久删除该菜单或权限数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteById(menuId).then(() => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getMenuList()
        }).catch(() => {
          this.loading = false
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
          if (this.form.menuId === undefined) {
            add(this.form).then(() => {
              this.msgSuccess('保存成功')
              this.getMenuList()
              this.loading = false
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            update(this.form).then(() => {
              this.msgSuccess('修改成功')
              this.getMenuList()
              this.loading = false
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
    },
    // 重置表单
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        percode: undefined,
        path: undefined,
        menuType: 'M',
        remark: undefined,
        status: '0'
      }
    }
  }
}
</script>
<style>
</style>
