<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 学习项目树 -->
        <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <!-- 人员列表 -->
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>报名学生列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
            <el-form-item label="姓名">
              <el-input class="input-append" v-model="conditionForm.Name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="手机号">
              <el-input class="input-append" v-model="conditionForm.Tel"></el-input>
            </el-form-item> -->
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
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" sortable label="姓名">
              <template slot-scope="scope">
                <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="60">
            </el-table-column>
            <el-table-column prop="birthday" label="出生日期">
              <template slot-scope="scope">
                {{new Date(scope.row.birthday).toLocaleDateString()}}
              </template>
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
            <el-table-column prop="amountToBePaid" label="应缴（元）"></el-table-column>
            <el-table-column prop="actualAmountOfPayment" label="实缴（元）" align="center">
              <template slot-scope="scope">
                <div class="specialCol" v-show="scope.row.actualAmountOfPayment>0">
                  <el-button type="text" @click="goToReacord(scope.row)">{{scope.row.actualAmountOfPayment}}</el-button>
                </div>
                <el-button type="text" style="color:#333" v-show="scope.row.actualAmountOfPayment==0">{{scope.row.actualAmountOfPayment}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源"></el-table-column>
            <el-table-column prop="studentPayType" label="付费状态">
              <template slot-scope="scope">
                <span v-if="scope.row.studentPayType !== '未缴费'">{{scope.row.studentPayType}}</span>
                <span v-else>
                  <el-tooltip v-if="scope.row.reason" class="item" effect="dark" placement="top">
                    <div slot="content">未缴费原因：<br>{{scope.row.reason}}</div>
                    <el-button type="text">未缴费</el-button>
                  </el-tooltip>
                  <span v-else>未缴费</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column  fixed="right" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button v-show="scope.row.studentPayType!='已缴清'" type="primary" size="mini" @click="pay(scope.row)">缴费</el-button>
                <el-button v-show="scope.row.studentPayType=='未缴费'" type="text" size="small" @click="NotPay(scope.row)">未缴费</el-button>
              </template>
            </el-table-column>
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
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="paySave"></add-edit>
  <!-- 未缴费 -->
  <refuse-edit :dataForm="addEditForm" :visible.sync="refuseEditVisible" @save="NotPaySave"></refuse-edit>
  <!-- 学生档案 -->
  <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
</div>
</template>
<script>
import { getTrainingProgramsTree } from '@/server/basic-module'
import {
  getPayManageList,
  // CheckStudentInfo,
  // CheckStudentInfoBatch,
  updatePaymentApproval,
  updateNotPaymentReason
} from '@/server/training-module'
import orgTree from '@/components/orgTree.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from './pay-list-add.vue'
import refuseEdit from './pay-list-refuse.vue'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
export default {
  components: {orgTree, pagination, addEdit, refuseEdit, studentProfile},
  data () {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      style: '',
      currentPage: 0,
      total: 0,
      resourceTree: [],
      conditionForm: {
        StudentPayType: 'NotPay',
        SourceType: 'Offline'
      },
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
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getTrainingProgramsTree()
  },
  methods: {
    /* -------------------------- 查询 -------------------------- */
    _getTrainingProgramsTree () { // 学习项目树
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
    // 根据项目id获取报名列表，缴过费的人员
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
      getPayManageList(data).then(result => {
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
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      if (this.nodeSelect.level !== '根') {
        this.initDataList()
      }
    },
    pay (row) {
      this.addEditVisible = true
      this.addEditForm = row
    },
    // 缴费
    paySave (row) {
      let data = {
        id: row.studentId,
        registrationProjectId: this.nodeId,
        money: row.money
      }
      updatePaymentApproval(data).then(result => {
        this.$message.success('缴费成功，金额：' + row.money + ' 元！')
        this.queryList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    payBatch () {
      // let ids= []
      // let names= []
      // if (this.multipleSelection) {
      //   this.multipleSelection.forEach((item) => {
      //     ids.push(item.id);
      //     names.push(item.name);
      //   })
      //   let name=names.join();
      //   let data={
      //     ids:ids,
      //     pass:true,
      //     registrationProjectsId: this.nodeId,
      //     reason: ''
      //   }
      //   this.$confirm(`此操作将 审核通过以下学生： 【${name}】，请确认？`, '提示', {
      //       confirmButtonText: '通过',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //   }).then(() => {
      //     CheckStudentInfoBatch(data).then(() => {
      //       this.$message.success('已通过审核!');
      //       this.queryList()
      //     })
      //   }).catch(() => {})
      // } else {
      //   this.$message.warning('请选择要审核的学生！')
      // }
    },
    // 未缴费
    NotPay (data) {
      let row = data || this.multipleSelection
      // let ids=[]
      // if (data) {
      //   ids.push(data.id)
      // } else if (this.multipleSelection) {
      //   this.multipleSelection.forEach((item) => {
      //     ids.push(item.id);
      //   })
      // }
      this.addEditForm = row || {}
      this.refuseEditVisible = true
      this.addEditForm.registrationProjectId = this.nodeId
    },
    // 审核或批量审核
    NotPaySave (data) {
      updateNotPaymentReason(data).then(result => {
        this.$message.success('备注未缴费原因成功！')
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
</style>
