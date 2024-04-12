<template>
  <div v-loading="loading">
    <!-- 整体卡片 -->
    <el-row :gutter="5">
      <!-- 左边患者信息、患者档案、患者历史病历信息；’【【 -->
      <el-col :span="7">
        <el-card>
          <el-form ref="form" :model="patientAllObj.patientObj" size="small" :inline="true" label-width="90px">
            <el-form-item label="患者姓名" prop="name">
              <el-input
                v-model="patientAllObj.patientObj.name"
                placeholder="请输入患者姓名"
                :disabled="true"
                style="width:100%"
              >
                <el-button slot="append" icon="el-icon-user-solid" @click="viewRegistration" />
              </el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input
                v-model="patientAllObj.patientObj.idCard"
                placeholder="请输入身份证号"
                :disabled="true"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="患者电话" prop="phone">
              <el-input
                v-model="patientAllObj.patientObj.phone"
                placeholder="请输入患者电话"
                :disabled="true"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group
                v-model="patientAllObj.patientObj.sex"
              >
                <el-radio
                  v-for="d in sexOptions"
                  :key="d.dictValue"
                  :label="d.dictValue"
                  :value="d.dictValue"
                >{{ d.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-input
                v-model="patientAllObj.patientObj.birthday"
                placeholder="请选择出生日期"
                :disabled="true"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="患者年龄" prop="age">
              <el-input
                v-model="patientAllObj.patientObj.age"
                placeholder="请输入患者年龄"
                :disabled="true"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="患者地址" prop="address">
              <el-input
                v-model="patientAllObj.patientObj.address"
                placeholder="请输入患患者地址"
                :disabled="true"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item label="过敏信息" prop="allergyInfo">
              <el-input
                v-model="patientAllObj.patientObj.allergyInfo"
                placeholder="请输入过敏信息"
                type="textarea"
                :autosize="{minRows:2, maxRows: 4}"
                :disabled="true"
                maxlength="100"
                show-word-limit
                style="width:100%"
              />
            </el-form-item>
          </el-form>
          <el-tabs :stretch="true" type="card">
            <el-tab-pane label="患者档案">
              <div v-if="patientAllObj.patientObj.isFinal==='1'">
                <div class="item">
                  紧急联系人: <span v-text="patientAllObj.patientFileObj.emergencyContactName" />
                </div>
                <div class="item">
                  紧急联系人: <span v-text="patientAllObj.patientFileObj.emergencyContactPhone" />
                </div>
                <div class="item">
                  关系: <span v-text="patientAllObj.patientFileObj.emergencyContactRelation" />
                </div>
                <div class="item">
                  左耳听力:<span v-text="patientAllObj.patientFileObj.leftEarHearing" />
                </div>
                <div class="item">
                  右耳听力:<span v-text="patientAllObj.patientFileObj.rightEarHearing" />
                </div>
                <div class="item">
                  左眼视力:<span v-text="patientAllObj.patientFileObj.leftVision" />
                </div>
                <div class="item">
                  右眼视力:<span v-text="patientAllObj.patientFileObj.rightVision" />
                </div>
                <div class="item">
                  身高:<span v-text="patientAllObj.patientFileObj.height" />
                </div>
                <div class="item">
                  体重:<span v-text="patientAllObj.patientFileObj.weight" />
                </div>
                <div class="item">
                  血型:<span v-text="patientAllObj.patientFileObj.bloodType" />
                </div>
                <div class="item">
                  个人史:<span v-text="patientAllObj.patientFileObj.personalInfo" />
                </div>
                <div class="item">
                  家族史:<span v-text="patientAllObj.patientFileObj.familyInfo" />
                </div>
                <div class="item">
                  档案创建时间:<span v-text="patientAllObj.patientFileObj.createTime" />
                </div>
                <div class="item">
                  档案更新时间:<span v-text="patientAllObj.patientFileObj.updateTime" />
                </div>
              </div>
              <div v-else style="text-align:center">
                暂无患者档案信息
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史病历">
              <div v-if="patientAllObj.careHistoryList.length>0">
                <el-collapse accordion>
                  <el-collapse-item v-for="(item, index) in patientAllObj.careHistoryList" :key="index">
                    <template slot="title">
                      {{ index+1 }}、就诊部门:【{{ item.deptName }}】就诊时间：{{ item.careTime }}
                    </template>
                    <div class="item">
                      主诉：{{ item.caseTitle }}
                    </div>
                    <div class="item">
                      发病日期：{{ item.caseDate }}
                    </div>
                    <div class="item">
                      诊断信息：{{ item.caseResult }}
                    </div>
                    <div class="item">
                      医生建议：{{ item.doctorTips }}
                    </div>
                    <div class="item">
                      备注：{{ item.remark }}
                    </div>
                    <div class="item">
                      接诊类型：{{ item.receiveType==='0'?'初诊':'复诊' }}
                    </div>
                    <div class="item">
                      是否感染：{{ item.isContagious==='0'?'否':'是' }}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else style="text-align:center">暂无患者病历信息</div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- 右边患者病历、处方信息 -->
      <el-col :span="17">
        <el-card>
          <el-row :gutter="5">
            <el-col :span="12" style="font-size: 16px">
              挂号单号:
              <span v-if="careHistory.registrationId === undefined" style="color:red">选择患者后显示</span>
              <span v-else style="color:red">{{ careHistory.registrationId }}</span>
              <br>
              病历编号:
              <span v-if="careHistory.chId === undefined" style="color:red">保存病历后显示</span>
              <span v-else style="color:red">{{ careHistory.chId }}</span>
            </el-col>
            <el-col v-if="registration.registrationStatus === '1'" :span="12" style="text-align:right">
              <el-button type="primary" size="small" icon="el-icon-check" @click="handleVisit(careHistory)">接诊</el-button>
            </el-col>
            <el-col v-if="registration.registrationStatus === '2'" :span="12" style="text-align:right">
              <el-button type="primary" :disabled="careHistory.registrationId === undefined" size="small" icon="el-icon-check" @click="handleSaveCareHistory">保存病历</el-button>
              <el-button type="danger" :disabled="careHistory.registrationId === undefined" size="small" icon="el-icon-finished" @click="handleVisitComplete">完成就诊</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-top:3px">
          <el-tabs :v-model="careActiveName" type="card">
            <!-- 病历表单 -->
            <el-tab-pane label="病历">
              <el-card>
                <el-form ref="form" :model="careHistory" :inline="true" label-width="88px">
                  <el-form-item label="发病日期：" prop="caseDateObj">
                    <el-date-picker
                      v-model="caseDateObj"
                      value-format="yyyy-MM-dd"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="接诊类型：" prop="receiveType">
                    <el-select
                      v-model="careHistory.receiveType"
                      placeholder="接诊类型"
                      size="small"
                    >
                      <el-option
                        v-for="dict in receiveTypeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否传染：" prop="isContagious">
                    <el-select
                      v-model="careHistory.isContagious"
                      placeholder="是否传染"
                      size="small"
                    >
                      <el-option
                        v-for="dict in isContagiousOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-form ref="form" :model="careHistory" label-width="88px">
                  <el-form-item label="主诉：" :inline="false" prop="caseTitle">
                    <el-input
                      v-model="careHistory.caseTitle"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 3}"
                      placeholder="请输入主诉"
                      style="width:100%"
                      maxlength="100"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="诊断信息：" :inline="false" prop="caseResult">
                    <el-input
                      v-model="careHistory.caseResult"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 4}"
                      placeholder="请输入诊断信息"
                      style="width:100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="医生建议" :inline="false" prop="doctorTips">
                    <el-input
                      v-model="careHistory.doctorTips"
                      type="textarea"
                      :autosize="{ minRows: 5, maxRows: 6}"
                      placeholder="请输入医生建议"
                      style="width:100%"
                      maxlength="300"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="备注" :inline="false" prop="remark">
                    <el-input
                      v-model="careHistory.remark"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 5}"
                      placeholder="请输入备注"
                      style="width:100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </el-tab-pane>
            <!-- 处方表单 -->
            <el-tab-pane label="处方">
              <el-collapse v-if="careOrders.length>0" accordion>
                <el-collapse-item v-for="(item, index) in careOrders" :key="index">
                  <template slot="title">
                    <span style="font-weight: 550;">{{ index+1 }}、<span v-if="item.careOrder.coType === '0'" style="color:red">药品处方</span><span v-else style="color:green">检查处方</span> 、金额:<span style="color:red">￥ {{ item.careOrder.allAmount }}</span></span>
                  </template>
                  <el-table v-loading="loading" border :data="item.careOrderItemList">
                    <el-table-column label="序号" align="center" type="index" width="50" />
                    <el-table-column :label="item.careOrder.coType==='0'?'药品处方':'项目名称'" align="center" prop="itemName" />
                    <el-table-column label="数量" align="center" prop="num" />
                    <el-table-column label="单价(元)" align="center" prop="price" />
                    <el-table-column label="金额(元)" align="center" prop="amount" />
                    <el-table-column label="备注" align="center" prop="remark" />
                    <el-table-column label="状态" align="center" prop="status" :formatter="orderDetailsStatusFormatter" />
                    <el-table-column v-if="registration.registrationStatus === '2'" label="操作" align="center">
                      <template slot-scope="scope">
                        <el-button v-show="scope.row.status==='0'" type="text" size="mini" @click="handleCareOrderItemDeleteByItemId(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
              <div v-show="registration.registrationStatus === '2'" style="margin:3px;text-align:left">
                <el-button type="success" icon="el-icon-plus" size="small" :disabled="careHistory.chId === undefined" @click="handleAddMedicinesOrder">添加药用处方</el-button>
                <el-button type="success" icon="el-icon-plus" size="small" :disabled="careHistory.chId === undefined" @click="handleAddCheckItemOrder">添加检查处方</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <!-- 弹出层 选择患者 -->
    <el-dialog
      title="请选择挂号患者"
      :visible.sync="openRegistration"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <!-- 选中门诊和急诊的选项卡 -->
      <el-card style="margin-bottom: 5px;">
        <el-form>
          <el-form-item label="挂号类型：">
            <el-radio-group v-model="schedulingType" size="small" @change="schedulingTypeChange">
              <el-radio-button
                v-for="dict in schedulingTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
                :value="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-tabs v-model="activeName" :stretch="true" type="card" @tab-click="handleRegistrationTabClick">
        <el-tab-pane label="待就诊列表" name="t1">
          <el-table v-loading="tableLoading" border :data="waitingForTreatmentRegistrationList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号单号">
                    <span>{{ scope.row.registrationId }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="挂号员">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="流水编号" align="center" prop="registrationNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleVisit(scope.row)">接诊</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊中列表" name="t2">
          <el-table v-loading="tableLoading" border :data="waitingForTreatmentRegistrationList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号单号">
                    <span>{{ scope.row.registrationId }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="挂号员">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="流水编号" align="center" prop="registrationNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊完成列表" name="t3">
          <el-table v-loading="tableLoading" border :data="waitingForTreatmentRegistrationList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号单号">
                    <span>{{ scope.row.registrationId }}</span>
                  </el-form-item>
                  <el-form-item label="患者编码">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="挂号员">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="流水编号" align="center" prop="registrationNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 弹出层 添加药用处方和检查处方 -->
    <el-dialog
      :title="title"
      :visible.sync="openAddOrderItem"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <div style="margin:6px;text-algin:right">
        <span style="margin:10px;float:left">【{{ submitCareOrder.careOrder.coType === '0'?'药用':'检查' }}】处方总额：￥<span>{{ submitCareOrder.careOrder.allAmount }}</span></span>
        <el-button style="margin:10px;float:right" type="success" size="small" icon="el-icon-plus" :disabled="submitCareOrder.careOrderItemList.length===0" @click="handleSaveOrderItem">确定添加</el-button>
        <el-button style="margin:10px;float:right" type="primary" icon="el-icon-plus" size="small" @click="handleOpenAddOrderItemDrawer">添加{{ submitCareOrder.careOrder.coType==='0'?'药用':'检查' }}</el-button>
      </div>
      <el-table border :data="submitCareOrder.careOrderItemList" :row-class-name="tableRowClassName">
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column :label="submitCareOrder.careOrder.coType==='0'?'药品名称':'项目名称'" align="center" prop="itemName" />
        <el-table-column label="数量" align="center" width="180px" prop="num">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.num"
              size="small"
              @change="handleCareOrderItemNumChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="单价(元)" align="center" prop="price" />
        <el-table-column label="金额(元)" align="center" prop="amount" />
        <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" style="width:100%;margin-top:2px" @click="handleCareOrderItemDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 药品列表 弹窗 -->
    <el-dialog
      title="药品列表"
      :visible.sync="openDialogMedicines"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <!-- 查询条件 -->
      <el-form ref="queryItemForm" :model="queryItemFormParams" size="small" label-width="68px">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="queryItemFormParams.keywords" placeholder="请输入关键字" clearable size="small" style="width:180px" />
          <el-button style="margin-left:5px" type="primary" icon="el-icon-search" size="mini" @click="handleMedicinesFormQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetItemFormQuery">重置</el-button>
          <el-button type="primary" icon="el-icon-check" size="mini" @click="handleAddMedicinesCareItem">添加</el-button>
        </el-form-item>
        <!-- 数据表格 -->
        <el-table v-loading="drawerLoading" border :data="tableItemList" @selection-change="handleMedicinesSelectionChange">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="药品编码" prop="medicinesId" align="center" />
          <el-table-column label="药品名称" prop="medicinesName" align="center" />
          <el-table-column label="关键字" prop="keywords" align="center" />
          <el-table-column label="库存量" prop="medicinesStockNum" align="center" />
          <el-table-column label="单位" align="center">
            <template slot-scope="scope">
              {{ scope.row.conversion }}/{{ scope.row.unit }}
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页控件 -->
        <el-pagination
          v-show="total>0"
          :current-page="queryItemFormParams.pageNum"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="queryItemFormParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleMedicinesSizeChange"
          @current-change="handleMedicinesCurrentChange"
        />
      </el-form>
    </el-dialog>
    <!-- 检查项列表抽屉 -->
    <el-dialog
      title="检查项目列表"
      :visible.sync="openDialogCheckItem"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <!-- 查询条件 -->
      <el-form ref="queryItemForm" :model="queryItemFormParams" size="small" label-width="68px">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="queryItemFormParams.keywords" placeholder="请输入关键字" clearable size="small" style="width:180px" />
          <el-button style="margin-left:5px" type="primary" icon="el-icon-search" size="mini" @click="handleCheckItemFormQuery">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetItemFormQuery">重置</el-button>
          <el-button type="primary" icon="el-icon-check" size="mini" @click="handleAddCheckItemCareItem">添加</el-button>
        </el-form-item>
        <!-- 数据表格 -->
        <el-table v-loading="drawerLoading" border :data="tableItemList" @selection-change="handleCheckItemSelectionChange">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="项目编码" prop="checkItemId" align="center" />
          <el-table-column label="项目名称" prop="checkItemName" align="center" />
          <el-table-column label="关键字" prop="keywords" align="center" />
          <el-table-column label="单价" prop="unitPrice" align="center" />
          <el-table-column label="单位" align="center" prop="unit" />
        </el-table>
        <!-- 分页控件 -->
        <el-pagination
          v-show="total>0"
          :current-page="queryItemFormParams.pageNum"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="queryItemFormParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleCheckItemSizeChange"
          @current-change="handleCheckItemCurrentChange"
        />
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getWaitingForTreatmentRegistration, getVisitingRegistration, getVisitCompletedRegistration,
  receivePatient, getPatientIdByPatientAndPatientFileAndCareHistoryList, saveCareHistory, getCareHistoryByRegistrationId,
  getCareOrderAndCareOrderItemByCareHistoryId,
  saveCareOrderAndCareOrderItem, deleteCareOrderItemById, visitComplete } from '@/api/doctor/care'
import { listForPageCheckItem } from '@/api/system/checkItem'
import { listMedicinesForPage } from '@/api/erp/medicines'
import { getRegistrationByRegId } from '@/api/doctor/registration'
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 表格的遮罩层
      tableLoading: false,
      // 就诊类型默认值
      schedulingType: '1',
      // 就诊类型数据字典
      schedulingTypeOptions: [],
      // 排班类型数据字典
      subsectionTypeOptions: [],
      // 性别数据字典
      sexOptions: [],
      // 接诊类型字典
      receiveTypeOptions: [],
      // 是否感染字典
      isContagiousOptions: [],
      // 处方详情状态数据字典
      orderDetailsStatusOptions: [],
      // 是否打开选择挂号的患者弹出开关
      openRegistration: false,
      // 当前选中的挂号选项卡
      activeName: 't1',
      // 左边的病历和处方的选项卡
      careActiveName: 'c1',
      // 挂号待就诊数据表格
      waitingForTreatmentRegistrationList: [],
      // 就诊完成的数据表格
      visitingRegistration: [],
      // 就诊中的数据表格
      visitCompletedRegistration: [],
      // 发病日期
      caseDateObj: new Date(),
      // 左边患者相关数据
      patientAllObj: {
        patientObj: {},
        patientFileObj: {},
        careHistoryList: []
      },
      // 患者病历信息对象
      careHistory: {
        // 当前就诊中的挂号单ID
        registrationId: undefined,
        // 处方ID
        chId: undefined,
        // 发病日期
        caseDate: undefined,
        // 接诊类型：0初诊，1复诊
        receiveType: '0',
        // 是否传染，0否，1是
        isContagious: '0',
        // 主诉
        caseTitle: undefined,
        // 诊断信息
        caseResult: undefined,
        // 医生建议
        doctorTips: undefined,
        remark: undefined,
        patientId: undefined,
        patientName: undefined
      },
      // 存放处方和处方详情数据
      careOrders: [],
      // 提交到处方和处方详情数据
      submitCareOrder: {
        careOrder: {
          allAmount: 0.00,
          patientId: undefined,
          patientName: undefined,
          // 默认为药用处方
          coType: '0'
        },
        careOrderItemList: []
      },
      // 挂号信息对象
      registration: {},
      // 弹出层标题
      title: '',
      // 是否打开药品和检查项的添加的弹出层
      openAddOrderItem: false,
      // 是否打开药品列表的抽屉
      openDialogMedicines: false,
      // 是否打开检查项列表的抽屉
      openDialogCheckItem: false,
      // 药品和检查项目抽屉的查询条件
      queryItemFormParams: {
        pageNum: 1,
        pageSize: 10,
        keywords: undefined
      },
      // 药品或检查项目表格数据
      tableItemList: [],
      // 抽屉里面数据的总条数
      total: 0,
      // 抽屉数据加载的遮罩层
      drawerLoading: false,
      // 抽屉里面选中的数据
      selectItemList: []
    }
  },
  created() {
    if (this.$route.params.registrationId !== undefined && this.$route.params.patientId !== undefined) {
      // 从路由上获取参数
      this.getRouterLoading(this.$route.params)// 路由传参
    }
    // 加载排班类型
    this.getDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 加载排班时段
    this.getDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 加载性别
    this.getDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 加载接诊类型
    this.getDataByType('his_receive_type').then(res => {
      this.receiveTypeOptions = res.data
    })
    // 加载是否感染
    this.getDataByType('his_contagious_status').then(res => {
      this.isContagiousOptions = res.data
    })
    // 加载处方详情状态
    this.getDataByType('his_order_details_status').then(res => {
      this.orderDetailsStatusOptions = res.data
    })
  },
  methods: {
    // 切换门诊急诊事件
    schedulingTypeChange(value) {
      this.schedulingType = value
    },
    // 打开选择挂号患者的弹出层
    viewRegistration() {
      this.activeName = 't1'
      this.openRegistration = true
      this.getWaitingForTreatmentRegistrationList()
    },
    // 查询待就诊的挂号列表
    getWaitingForTreatmentRegistrationList() {
      this.tableLoading = true
      getWaitingForTreatmentRegistration(this.schedulingType).then(res => {
        this.waitingForTreatmentRegistrationList = res.data
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 查询就诊中的挂号列表
    getVisitingRegistrationList() {
      this.tableLoading = true
      getVisitingRegistration(this.schedulingType).then(res => {
        this.waitingForTreatmentRegistrationList = res.data
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 查询就诊完成的挂号列表
    getVisitCompletedRegistrationList() {
      this.tableLoading = true
      getVisitCompletedRegistration(this.schedulingType).then(res => {
        this.waitingForTreatmentRegistrationList = res.data
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 切换挂号类型change事件
    handleRegistrationTabClick(tab, event) {
      if (tab.name === 't1') {
        this.getWaitingForTreatmentRegistrationList()
      } else if (tab.name === 't2') {
        this.getVisitingRegistrationList()
      } else if (tab.name === 't3') {
        this.getVisitCompletedRegistrationList()
      }
    },
    // 将挂号单状态改为接诊中
    handleVisit(row) {
      this.careHistory.registrationId = row.registrationId
      const patientId = row.patientId === undefined ? this.patientAllObj.patientObj.patientId : row.patientId
      this.loading = true
      receivePatient(this.careHistory.registrationId).then(() => {
        this.loading = false
        this.msgSuccess('接诊成功')
      }).catch(() => {
        this.msgError('接诊失败')
        this.loading = false
      })
      // 根据患者ID查询患者信息、档案信息、病历信息
      getPatientIdByPatientAndPatientFileAndCareHistoryList(patientId).then(res => {
        this.patientAllObj.patientObj = res.data.patient
        this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
        this.patientAllObj.patientFileObj = res.data.patientFile
        this.patientAllObj.careHistoryList = res.data.careHistoryList
        this.openRegistration = false
        this.loading = false
      }).catch(() => {
        this.msgError('查询患者信息失败')
        this.loading = false
      })
      this.getRegByRegId(this.careHistory.registrationId)
    },
    // 载入信息
    handleLoading(row) {
      this.careHistory.registrationId = row.registrationId
      const patientId = row.patientId
      // 根据挂号单查询病历信息
      getCareHistoryByRegistrationId(this.careHistory.registrationId).then(res => {
        if (res.data !== null) {
          this.careHistory = res.data
          this.caseDateObj = this.moment(this.careHistory.caseDate).format('YYYY-MM-DD')
          // 根据病历ID查询处方和处方详情信息
          this.getCareOrdersByChId(this.careHistory.chId)
        }
      }).catch(() => {
        this.msgError('载入信息失败 查询病历信息失败')
        this.loading = false
      })
      // 根据挂号单查询挂号信息
      this.getRegByRegId(this.careHistory.registrationId)
      // 根据患者ID查询患者信息、档案信息、病历信息
      getPatientIdByPatientAndPatientFileAndCareHistoryList(patientId).then(res => {
        this.patientAllObj.patientObj = res.data.patient
        this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
        this.patientAllObj.patientFileObj = res.data.patientFile
        this.patientAllObj.careHistoryList = res.data.careHistoryList
        this.openRegistration = false
        this.loading = false
      }).catch(() => {
        this.msgError('载入信息失败')
        this.loading = false
      })
      this.patientAllObj.careHistoryList.forEach(e => {
        e.careTime = e.careTime.splice(0, 10)
      })
    },
    // 从挂号列表打开
    getRouterLoading(row) {
      this.careHistory.registrationId = row.registrationId
      const patientId = row.patientId
      // 根据挂号单查询病历信息
      getCareHistoryByRegistrationId(this.careHistory.registrationId).then(res => {
        if (res.data !== null) {
          this.careHistory = res.data
          this.caseDateObj = this.moment(this.careHistory.caseDate).format('YYYY-MM-DD')
          // 根据病历ID查询处方和处方详情信息
          this.getCareOrdersByChId(this.careHistory.chId)
        }
      }).catch(() => {
        this.msgError('载入信息失败 查询病历信息失败')
        this.loading = false
      })
      // 根据挂号单查询挂号信息
      this.getRegByRegId(this.careHistory.registrationId)
      // 根据患者ID查询患者信息、档案信息、病历信息
      getPatientIdByPatientAndPatientFileAndCareHistoryList(patientId).then(res => {
        this.patientAllObj.patientObj = res.data.patient
        this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
        this.patientAllObj.patientFileObj = res.data.patientFile
        this.patientAllObj.careHistoryList = res.data.careHistoryList
        this.openRegistration = false
        this.loading = false
      }).catch(() => {
        this.msgError('载入信息失败')
        this.loading = false
      })
      this.patientAllObj.careHistoryList.forEach(e => {
        e.careTime = e.careTime.splice(0, 10)
      })
    },
    // 根据挂号单查询挂号信息
    getRegByRegId(regId) {
      getRegistrationByRegId(regId).then(res => {
        this.registration = res.data
      })
    },
    // 翻译挂号类型
    schedulingTypeFormatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType)
    },
    // 保存病历
    handleSaveCareHistory() {
      if (!this.careHistory.registrationId) {
        this.msgError('请选择挂号患者')
        return
      }
      // 封装数据
      this.careHistory.caseDate = this.moment(this.caseDateObj).format('YYYY-MM-DD')
      this.careHistory.patientId = this.patientAllObj.patientObj.patientId
      this.careHistory.patientName = this.patientAllObj.patientObj.name
      this.loading = true
      // 保存病历信息
      saveCareHistory(this.careHistory).then(res => {
        this.msgSuccess('保存病历成功')
        // 根据患者ID查询病历信息
        getPatientIdByPatientAndPatientFileAndCareHistoryList(this.careHistory.patientId).then(res => {
          this.patientAllObj.careHistoryList = res.data.careHistoryList
        })
        this.loading = false
        this.careHistory.chId = res.data.chId
      }).catch(() => {
        this.msgError('保存病历失败')
        this.loading = false
      })
    },
    // 完成就诊
    handleVisitComplete() {
      const registrationId = this.careHistory.registrationId
      const patientName = this.careHistory.patientName
      const tx = this
      tx.$confirm('是否确定完成【' + patientName + '】的就诊，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        visitComplete(registrationId).then(() => {
          this.msgSuccess('操作成功')
          this.resetAllData()
        }).catch(() => {
          this.msgError('操作失败')
        })
      }).catch(() => {
        tx.msgError('操作已取消')
      })
    },
    // 重置所有数据
    resetAllData() {
      this.patientAllObj = {
        patientObj: {},
        patientFileObj: {},
        careHistoryList: []
      }
      this.careHistory = {
        registrationId: undefined,
        // 处方ID
        chId: undefined,
        // 发病日期
        caseDate: undefined,
        // 接诊类型：0初诊，1复诊
        receiveType: '0',
        // 是否传染，0否，1是
        isContagious: '0',
        // 主诉
        caseTitle: undefined,
        // 诊断信息
        caseResult: undefined,
        // 医生建议
        doctorTips: undefined,
        remark: undefined,
        patientId: undefined,
        patientName: undefined
      }
      this.careOrders = []
      // 提交药用或检查项对象
      this.submitCareOrder = {
        careOrder: {
          allAmount: 0.00,
          patientId: undefined,
          patientName: undefined,
          // 默认为药品处方
          coType: '0'
        },
        careOrderItemList: []
      }
    },
    // 翻译处方详情状态
    orderDetailsStatusFormatter(row) {
      return this.selectDictLabel(this.orderDetailsStatusOptions, row.status)
    },
    // 根据处方详情Id删除数据库里的详情【只能删除未支付的】
    handleCareOrderItemDeleteByItemId(row) {
      const itemId = row.itemId
      const itemName = row.itemName
      const tx = this
      tx.$confirm('是否确定删除【' + itemName + '】这条详情，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCareOrderItemById(itemId).then(() => {
          this.msgSuccess('删除成功')
          this.getCareOrdersByChId(this.careHistory.chId)
        })
      })
    },
    // 根据病历ID查询处方信息
    getCareOrdersByChId(chId) {
      this.loading = true
      getCareOrderAndCareOrderItemByCareHistoryId(chId).then(res => {
        this.careOrders = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询处方和详情失败')
        this.loading = false
      })
    },
    // 打开添加药品处方的弹出层
    handleAddMedicinesOrder() {
      if (!this.careHistory.registrationId) {
        this.msgError('请选择挂号患者')
        return
      }
      if (!this.careHistory.chId) {
        this.msgError('请先保存病历')
        return
      }
      this.submitCareOrder.careOrder.coType = '0'
      this.title = '添加【药用】处方'
      this.openAddOrderItem = true
      this.submitCareOrder.careOrderItemList = []
      this.submitCareOrder.careOrder.allAmount = 0.00
    },
    // 打开添加检查处方的弹出层
    handleAddCheckItemOrder() {
      if (!this.careHistory.registrationId) {
        this.msgError('请选择挂号患者')
        return
      }
      if (!this.careHistory.chId) {
        this.msgError('请先保存病历')
        return
      }
      this.submitCareOrder.careOrder.coType = '1'
      this.title = '添加【检查】处方'
      this.openAddOrderItem = true
      this.submitCareOrder.careOrderItemList = []
    },
    // 保存处方详情
    handleSaveOrderItem() {
      if (this.submitCareOrder.careOrderItemList.length === 0) {
        this.msgError('添加处方详情')
        return
      }
      this.submitCareOrder.careOrder.patientId = this.careHistory.patientId
      this.submitCareOrder.careOrder.patientName = this.careHistory.patientName
      this.submitCareOrder.careOrder.chId = this.careHistory.chId
      this.loading = true
      saveCareOrderAndCareOrderItem(this.submitCareOrder).then(res => {
        this.loading = false
        this.msgSuccess('保存成功')
        // 刷新处方列表
        this.getCareOrdersByChId(this.careHistory.chId)
        this.openAddOrderItem = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 把弹出层的表格的数据加上index
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 打开药品或检查项目的抽屉
    handleOpenAddOrderItemDrawer() {
      if (this.submitCareOrder.careOrder.coType === '0') {
        // 打开药品列表
        this.openDialogMedicines = true
        this.resetItemFormQuery()
      } else {
        // 打开检查项目的抽屉
        this.openDialogCheckItem = true
        this.resetItemFormQuery()
      }
    },
    // 重置抽屉查询条件
    resetItemFormQuery() {
      this.queryItemFormParams = {
        pageNum: 1,
        pageSize: 10,
        keywords: undefined
      }
      if (this.submitCareOrder.careOrder.coType === '0') {
        this.getMedicinesList()
      } else {
        this.getCheckItemList()
      }
    },
    // 加载药品数据
    getMedicinesList() {
      this.tableItemList = []
      this.drawerLoading = true
      listMedicinesForPage(this.queryItemFormParams).then(res => {
        this.tableItemList = res.data
        this.total = res.total
        this.drawerLoading = false
      }).catch(() => {
        this.drawerLoading = false
      })
    },
    // 药品数据表格的多选框选择时触发
    handleMedicinesSelectionChange(selection) {
      this.selectItemList = selection
    },
    // 药品分页pageSize变化时触发
    handleMedicinesSizeChange(val) {
      this.queryItemFormParams.pageSize = val
      this.getMedicinesList()
    },
    // 药品 点击上一页或下一页，跳转到哪一页时的触发
    handleMedicinesCurrentChange(val) {
      this.queryItemFormParams.pageNum = val
      this.getMedicinesList()
    },
    // 药品搜索
    handleMedicinesFormQuery() {
      this.queryItemFormParams.pageNum = 1
      this.getMedicinesList()
    },
    // 加载检查项数据
    getCheckItemList() {
      this.tableItemList = []
      this.drawerLoading = true
      listForPageCheckItem(this.queryItemFormParams).then(res => {
        this.tableItemList = res.data
        this.total = res.total
        this.drawerLoading = false
      }).catch(() => {
        this.drawerLoading = false
      })
    },
    // 检查项数据表格的多选框选择时触发
    handleCheckItemSelectionChange(selection) {
      this.selectItemList = selection
    },
    // 检查项分页pageSize变化时触发
    handleCheckItemSizeChange(val) {
      this.queryItemFormParams.pageSize = val
      this.getCheckItemList()
    },
    // 检查项 点击上一页或下一页，跳转到哪一页时的触发
    handleCheckItemCurrentChange(val) {
      this.queryItemFormParams.pageNum = val
      this.getCheckItemList()
    },
    // 检查项搜索
    handleCheckItemFormQuery() {
      this.queryItemFormParams.pageNum = 1
      this.getCheckItemList()
    },
    // 药品抽屉添加并关闭按钮
    handleAddMedicinesCareItem() {
      if (this.selectItemList.length === 0) {
        this.msgError('请选择【药品】')
        return
      }
      this.selectItemList.filter(item => {
        const obj = {
          itemRefId: item.medicinesId,
          itemName: item.medicinesName,
          itemType: this.submitCareOrder.careOrder.coType,
          num: 1,
          price: item.prescriptionPrice,
          amount: 1 * item.prescriptionPrice,
          remark: '请按说明服用'
        }
        // 默认没有
        let flag = false
        this.submitCareOrder.careOrderItemList.filter(i => {
          if (i.itemRefId === obj.itemRefId) {
            i.num = i.num + 1
            flag = true // 说明之前加过
          }
        })
        // 如果之前没加这个药品进去，就新加一个
        if (!flag) {
          this.submitCareOrder.careOrderItemList.push(obj)
        }
        this.openDialogMedicines = false
      })
      this.computeOrderItemAllAmount()
    },
    // 检查项抽屉添加并关闭按钮
    handleAddCheckItemCareItem() {
      if (this.selectItemList.length === 0) {
        this.msgError('请选择【检查项目】')
        return
      }
      this.selectItemList.filter(item => {
        const obj = {
          itemRefId: item.checkItemId,
          itemName: item.checkItemName,
          itemType: this.submitCareOrder.careOrder.coType,
          num: 1,
          price: item.unitPrice,
          amount: 1 * item.unitPrice,
          remark: '按要求检查'
        }
        // 默认没有
        let flag = false
        this.submitCareOrder.careOrderItemList.filter(i => {
          if (i.itemRefId === obj.itemRefId) {
            i.num = i.num + 1
            flag = true // 说明之前加过
          }
        })
        // 如果之前没加这个药品进去，就新加一个
        if (!flag) {
          this.submitCareOrder.careOrderItemList.push(obj)
        }
        this.openDialogCheckItem = false
      })
      this.computeOrderItemAllAmount()
    },
    // 计算当前处方详情的总价
    computeOrderItemAllAmount() {
      // 设置处方订单总额为0
      this.submitCareOrder.careOrder.allAmount = 0.00
      // 重新计算并设置处方订单总额
      this.submitCareOrder.careOrderItemList.filter(item => {
        this.submitCareOrder.careOrder.allAmount += (item.num * item.price)
      })
    },
    // 监听药品或检查项目 弹出层的数量变化
    handleCareOrderItemNumChange(row) {
      row.amount = row.num * row.price
      this.computeOrderItemAllAmount()
    },
    // 删除弹出层里的详情
    handleCareOrderItemDelete(row) {
      this.submitCareOrder.careOrderItemList.splice(row.index, 1)
      this.computeOrderItemAllAmount()
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
  .item{
    font-size: 14px;
    margin-bottom: 8px;
    /* 设置css里的内容自动换行 */
    word-break:break-all;
  }
</style>
