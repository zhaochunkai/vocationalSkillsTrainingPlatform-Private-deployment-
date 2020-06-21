<template>
<div><!-- 缴费查询 -->
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">        
        <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>缴费查询</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="班级" v-if="classList && classList.length>0">
            <el-select v-model="conditionForm.classId" placeholder="请选择班级">
              <el-option v-for="(item,i) of classList" :key="i" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input class="input-append" v-model="conditionForm.Name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input class="input-append" v-model="conditionForm.IdCard"></el-input>	
          </el-form-item>
          <el-form-item label="缴费状态">
            <el-select v-model="conditionForm.StudentPayType">
              <el-option label="全部" value="All"></el-option>
              <el-option label="已缴清" value="Paid"></el-option>
              <el-option label="未缴费" value="NotPay"></el-option>
              <el-option label="未缴清" value="Uncleared"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源">
            <el-select v-model="conditionForm.SourceType">
              <el-option label="全部" value="All"></el-option>
              <el-option label="线上（移动端）" value="Online"></el-option>
              <el-option label="线下" value="Offline"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip class="item" effect="dark" content="导出查询出来的所有数据" placement="top">
              <el-button type="primary" @click="exportTemplate">导出数据</el-button>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" sortable label="姓名">
              <template slot-scope="scope">
                <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="60"></el-table-column>
            <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
            <el-table-column prop="amountToBePaid" label="应缴（元）"></el-table-column>
            <el-table-column prop="actualAmountOfPayment" label="实缴（元）" align="center">
              <template slot-scope="scope">
                <!-- 欠费 -->                
                <div class="specialCol" v-show="scope.row.actualAmountOfPayment!=scope.row.amountToBePaid">
                  <el-button type="text"  @click="goToReacord(scope.row)">{{scope.row.actualAmountOfPayment}}</el-button>
                </div> 
                <!-- 非免费项目，缴清 -->
                <div class="noBtnTxt" v-show="scope.row.actualAmountOfPayment==scope.row.amountToBePaid  && scope.row.amountToBePaid!=0">
                  <el-button type="text" @click="goToReacord(scope.row)">{{scope.row.actualAmountOfPayment}}</el-button>
                </div> 
                <!-- 免费项目 -->
                <el-button type="text" style="color:#333" v-show="scope.row.amountToBePaid==0">{{scope.row.amountToBePaid}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="paymentDate" label="缴费时间" width="180">
              <template slot-scope="scope">
                {{new Date(scope.row.paymentDate).toLocaleString()}}
              </template>
            </el-table-column>
            <el-table-column prop="payType" label="缴费方式"></el-table-column>
            <el-table-column prop="source" label="来源">
              <!-- <template slot-scope="scope">
                {{scope.row.source=='Online'?'线上（移动端）': '线下'}}
              </template> -->
              <!-- All, Online, Offline -->
            </el-table-column>
            <el-table-column prop="studentPayType" label="付费状态"></el-table-column>          
            <!-- <el-table-column  fixed="right" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="pay(scope.row)">缴费</el-button>
                <el-button type="text" size="small" @click="NotPay(scope.row)">未缴费</el-button>
              </template>
            </el-table-column> -->
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 缴费 -->
  <!-- <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="paySave"></add-edit> -->
  <!-- 未缴费 -->
  <!-- <refuse-edit :dataForm="addEditForm" :visible.sync="refuseEditVisible" @save="NotPaySave"></refuse-edit> -->
  <!-- 学生档案 -->
  <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
</div>
</template>
<script>
import filter from '@/utils/filter.js'
import { getTrainingProgramsTree } from '@/server/basic-module'
import {
  getClassList,
  getPayQueryList,
  updatePaymentApproval,
  updateNotPaymentReason
} from '@/server/training-module'
import { exportPayInfoList } from '@/server/blob-module'
import orgTree from '@/components/orgTree.vue'
import { pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
export default {
  data () {
    return {
      style: '',
      conditionForm: {
        StudentPayType: 'All',
        SourceType: 'Offline'
      },
      classList: [],
      pageSize,
      SkipCount: 0,
      title: '',
      currentPage: 0,
      total: 0,
      resourceTree: [],
      tableData: [],
      isSelectAll: false,
      addEditVisible: false,
      refuseEditVisible: false,
      addEditForm: {},
      nodeId: '',
      nodeName: '',
      nodeSelect: {},
      profileVisible: false
    }
  },
  components: {orgTree, pagination, studentProfile},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getTrainingProgramsTree()
  },
  methods: {
    /* -------------------------- 查询 -------------------------- */
    // 根据项目id获取班级列表
    _getClassList () {
      let data = {
        tpId: this.nodeId
      }
      getClassList(data).then(result => {
        this.classList = result.items
      })
    },
    // 学习项目树
    _getTrainingProgramsTree () {
      this.resourceTree = []
      getTrainingProgramsTree().then(result => {
        this.resourceTree.push(result)
      }).then(() => {
        if (this.nodeId && this.nodeSelect.level !== '根') {
          this.initDataList()
        }
      })
    },
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    // 根据项目id获取报名列表，只查询审核状态为“通过”的学生
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        TrainingProgramsId: this.nodeId,
        Name: this.conditionForm.Name,
        IdCard: this.conditionForm.IdCard,
        Tel: this.conditionForm.Tel,
        StudentPayType: this.conditionForm.StudentPayType,
        SourceType: this.conditionForm.SourceType,
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      if (this.conditionForm.classId) {
        this.$set(data, 'classId', this.conditionForm.classId)
      }
      getPayQueryList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    /* -------------------------- 操作 -------------------------- */
    // 导出数据
    exportTemplate () {
      let data = {
        TrainingProgramsId: this.nodeId,
        Name: this.conditionForm.Name,
        IdCard: this.conditionForm.IdCard,
        Tel: this.conditionForm.Tel,
        StudentPayType: this.conditionForm.StudentPayType,
        SourceType: this.conditionForm.SourceType
      }
      if (this.conditionForm.classId) {
        this.$set(data, 'classId', this.conditionForm.classId)
      }
      exportPayInfoList(data).then(res => {
        filter.downloadBlobFile(res, `${this.nodeName}-缴费数据.xlsx`)
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      if (this.nodeSelect.level !== '根') {
        this.initDataList()
        this._getClassList()
        this.$set(this.conditionForm, 'classId', '')
      }
    },
    // 查看未缴费原因
    showNotPayReason (row) {
      this.refuseEditVisible = true
      this.addEditForm = row
      this.addEditForm.registrationProjectId = this.nodeId
    },
    // 跳转至学生档案模块
    toInfomationPage (row) {
      this.addEditForm = {
        studentId: row.studentId, // 学生id
        name: row.name, // 学生姓名
        programId: this.nodeId // 项目id
      }
      this.profileVisible = true
    },
    // 查看学生的缴费记录
    goToReacord (data) {
      let TrainingProgramsId = this.nodeId
      let studentId = data.studentId
      this.$router.push({path: '/pay/record/list', query: {studentId, TrainingProgramsId}})
    },
    pay (row) {
      this.addEditVisible = true
      this.addEditForm = row
    },
    paySave (row) { // 缴费
      let data = {
        id: row.studentId,
        registrationProjectId: this.nodeId,
        money: row.money
      }
      updatePaymentApproval(data).then(result => {
        this.$message.success(`缴费成功，金额：${row.money}元！`)
        this.queryList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    NotPay (data) {
      let row = data || this.multipleSelection
      this.addEditForm = row || {}
      this.refuseEditVisible = true
      this.addEditForm.registrationProjectId = this.nodeId
    },
    // 审核或批量审核
    NotPaySave (data) {
      updateNotPaymentReason(data).then(result => {
        this.$message.success('备注未缴费原因成功！');
        this.queryList()
      }).catch(err => { 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.specialCol{
  background:#a5f373;
  /deep/.el-button{
    span{
      color:#00f;
    }
  }
}
.noBtnTxt{
  /deep/.el-button{
    span{
      color:#00f;
    }
  }
}
</style>