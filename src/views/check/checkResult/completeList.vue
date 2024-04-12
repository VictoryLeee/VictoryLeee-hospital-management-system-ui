<template>
  <div>
    <el-card style="margin-bottom: 3px">
      <el-form :model="queryParams" :inline="true" label-width="68px" size="small">
        <el-form-item label="检查项目">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="queryParams.checkItemIds" @change="handleCheckedItemChange">
            <el-checkbox
              v-for="d in checkItemOptions"
              :key="d.checkItemId"
              :label="d.checkItemId"
              :value="d.checkItemId"
            >
              {{ d.checkItemName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="挂号单号">
          <el-input v-model="queryParams.registrationId" placeholder="请输入挂号单号" clearable style="width: 380px" />
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="queryParams.patientName" placeholder="请输入患者姓名" clearable style="width: 380px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据表格 -->
    <el-card style="margin-bottom: 3px">
      <el-table v-loading="loading" border :data="checkResultList">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="价格">
                <span style="font-weight: 600;color: red">{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="检查单号" align="center" prop="cocId" width="250" />
        <el-table-column label="挂号单号" align="center" prop="registrationId" width="300" />
        <el-table-column label="检查项目" align="center" prop="checkItemName" />
        <el-table-column label="患者姓名" align="center" prop="patientName" />
        <el-table-column label="检查状态" align="center" prop="resultStatus" :formatter="resultStatusFormmatter" width="100" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="handleViewResult(scope.row)">检查结果</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页控件查询 -->
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
    </el-card>
    <!-- 录入检查结果弹出层 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" center append-to-body>
      <el-form label-width="80px">
        <el-form-item label="检查结果" prop="resultMsg">
          {{ currentResult.resultMsg }}
        </el-form-item>
        <div class="demo-image__lazy">
          <el-image v-for="(item, index) in currentResult.resultImg" :key="index" :src="item.url" lazy />
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getAllCheckItem } from '@/api/system/checkItem'
import { getCheckResultForPage } from '@/api/check/checkResult'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 检查项目数据
      checkItemOptions: [],
      // 查询参数
      queryParams: {
        registrationId: undefined,
        patientName: undefined,
        checkItemIds: [],
        pageNum: 1,
        pageSize: 10
      },
      // 是否全选
      checkAll: true,
      // 是否为半选状态
      isIndeterminate: false,
      // 检查结果的状态字典
      resultStatusOptions: [],
      // 检查结果的数据
      checkResultList: [],
      // 是否打开录入结果的弹窗
      open: false,
      // 弹出层的标题
      title: '',
      // 当前查看的数据
      currentResult: {
        resultMsg: undefined,
        resultImg: []
      }
    }
  },
  created() {
    // 查询所有可用的检查项目
    getAllCheckItem().then(res => {
      this.checkItemOptions = res.data
      this.queryParams.checkItemIds = this.checkItemOptions.map(item => item.checkItemId)
      this.getCheckResultForPage()
    })
    // 加载检查状态的字典数据
    this.getDataByType('his_check_result_status').then(res => {
      this.resultStatusOptions = res.data
    })
  },
  methods: {
    // 全选
    handleCheckAllChange(val) {
      this.queryParams.checkItemIds = val ? this.checkItemOptions.map(item => item.checkItemId) : []
      this.isIndeterminate = false
      this.getCheckingResultForPage()
    },
    // 选择某一个项目
    handleCheckedItemChange(value) {
      const checkedCount = value.length
      // 全选
      this.checkAll = checkedCount === this.checkItemOptions.length
      // 半选
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkItemOptions.length
      this.getCheckResultForPage()
    },
    // 分页查询检查中的项目
    getCheckResultForPage() {
      this.loading = true
      getCheckResultForPage(this.queryParams).then(res => {
        this.checkResultList = res.data
        this.loading = false
        this.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    // 分页pagesize变化时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getCheckResultForPage()
    },
    // 点击上一页，下一页，跳转到哪一页时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getCheckResultForPage()
    },
    handleQuery() {
      this.getCheckResultForPage()
    },
    // 重置
    resetQuery() {
      this.queryParams = {
        registrationId: undefined,
        patientName: undefined,
        checkItemIds: this.checkItemOptions.map(item => item.checkItemId),
        pageNum: 1,
        pageSize: 10
      }
      this.getCheckResultForPage()
    },
    // 查看结果
    handleViewResult(row) {
      this.open = true
      this.title = '查看【' + row.patientName + '】的检查结果'
      // 记录当前选中的详情ID
      this.currentResult.resultMsg = row.resultMsg
      if (row.resultImg !== '') {
        this.currentResult.resultImg = JSON.parse(row.resultImg)
      }
    },
    // 关闭
    cancel() {
      this.open = false
      this.currentResult = {
        resultMsg: undefined,
        resultImg: []
      }
    },
    // 翻译检查项状态
    resultStatusFormmatter(row) {
      return this.selectDictLabel(this.resultStatusOptions, row.resultStatus)
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
