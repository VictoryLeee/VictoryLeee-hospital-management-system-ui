<template>
  <div>
    <el-card style="margin-bottom:3px">
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
            <el-button type="text" icon="el-icon-edit" size="mini" @click="handleImportResult(scope.row)">录入结果</el-button>
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
      <el-form :model="form" label-width="80px">
        <el-form-item label="检查结果" prop="resultMsg">
          <el-input
            v-model="form.resultMsg"
            type="textarea"
            :rows="4"
            placeholder="请输入检查结果"
          />
        </el-form-item>
        <el-form-item label="结果上传">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :on-remove="handleRemove"
            :file-list="imgFileList"
            accept="image/*"
            name="mf"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不能超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button type="primary" @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getAllCheckItem } from '@/api/system/checkItem'
import { doDeleteFile } from '@/api/system/upload'
import { getCheckingResultForPage, completeCheckResult } from '@/api/check/checkResult'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 是否打开录入结果的弹出层
      open: false,
      // 弹出层的标题
      title: '',
      // 总条数
      total: 0,
      // 检查项数据
      checkItemOptions: [],
      // 检查结果的状态字典
      resultStatusOptions: [],
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
      // 是否半选状态
      isIndeterminate: false,
      // 检查结果数据
      checkResultList: [],
      // 上传结果表单
      form: {
        cocId: undefined,
        resultMsg: undefined,
        resultImg: undefined
      },
      // 声明上传路径
      uploadPath: undefined,
      // 图片列表
      imgFileList: [],
      // 头
      headers: undefined,
      // 图片列表的json对象列表
      imgFileJsonObjList: []
    }
  },
  created() {
    // 查询所有可用的检查项目
    getAllCheckItem().then(res => {
      this.checkItemOptions = res.data
      this.queryParams.checkItemIds = this.checkItemOptions.map(item => item.checkItemId)
      this.getCheckingResultForPage()
    })
    // 加载检查状态的字典数据
    this.getDataByType('his_check_result_status').then(res => {
      this.resultStatusOptions = res.data
    })
    // 文件上传的路径
    this.uploadPath = process.env.VUE_APP_BASE_API + '/system/upload/doUploadImage'
    // 设置请求头加入token 避免求认证的问题
    this.headers = { 'token': getToken() }
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
      this.getCheckingResultForPage()
    },
    // 分页查询检查中的项目
    getCheckingResultForPage() {
      this.loading = true
      getCheckingResultForPage(this.queryParams).then(res => {
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
      this.getCheckingResultForPage()
    },
    // 点击上一页，下一页，跳转到哪一页时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getCheckingResultForPage()
    },
    handleQuery() {
      this.getCheckingResultForPage()
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
      this.getCheckingResultForPage()
    },
    // 录入结果
    handleImportResult(row) {
      // 打开录入结果弹窗
      this.open = true
      this.title = '录入【' + row.patientName + '】的检查结果'
      // 存储当前详情id
      this.form.cocId = row.cocId
    },
    // 完成检查
    handleSubmit() {
      this.$confirm('是否确定完成检查，数据提交后不能再修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.resultImg = JSON.stringify(this.imgFileJsonObjList)
        completeCheckResult(this.form).then(() => {
          this.msgSuccess('上传结果成功！')
          this.getCheckingResultForPage()
          this.closeDialog()
        })
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.open = false
      this.form = {
        itemId: undefined,
        resultMsg: undefined,
        resultImg: undefined
      }
    },
    // 上传成功后的回调
    handleUploadSuccess(response, file, fileList) {
      this.imgFileJsonObjList.push(response.data)
    },
    // 上传失败后的回调
    handleUploadError() {
      this.msgError('上传失败！')
    },
    // 删除文件回调
    handleRemove(file, fileList) {
      this.imgFileJsonObjList.filter(i1 => {
        if (file.response.data.url === i1.url) {
          var path = file.response.data.url.replace('http://192.168.221.135:81/', '')
          var fileInfo = {
            path: path
          }
          doDeleteFile(fileInfo).then(() => {
            this.msgSuccess('删除成功')
          })
          this.imgFileJsonObjList.splice(this.imgFileJsonObjList.indexOf(i1), 1)
        }
      })
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
