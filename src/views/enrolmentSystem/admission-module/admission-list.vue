<template>
<div>
<el-row :gutter="10">
  <el-col :span="5">
    <el-card :style="style">
      <!-- 学习项目树 -->
      <!-- <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>      -->
      <el-tree :data="resourceTree" ref="tree" node-key="id"  @node-click="haddleOrganizationNode" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
    </el-card>
  </el-col>
  <el-col :span="19" >
    <!-- 报名信息列表 -->
    <el-card v-show="JSON.stringify(this.nodeSelect) != '{}' && this.nodeSelect.level!='根'" :style="style">
      <div slot="header" class="t-box-card-header">
        <span>报名审核列表</span>
      </div>
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="姓名/手机号/身份证号">
              <el-input class="input-append" v-model="conditionForm.IdCardOrTelOrName"></el-input>	
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="conditionForm.Status">
              <el-option label="全部" value="All"></el-option>
              <el-option label="待审核" value="ToAudit"></el-option>
              <el-option label="未通过" value="NotPass"></el-option>
              <el-option label="已通过" value="Pass"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源">
            <el-select v-model="conditionForm.Source">
              <el-option label="全部" value="All"></el-option>
              <el-option label="线上（移动端）" value="Online"></el-option>
              <el-option label="线下" value="Offline"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="缴费">
            <el-select v-model="conditionForm.PayStatus">
              <el-option label="全部" value="All"></el-option>
              <el-option label="已结清" value="Paid"></el-option>
              <el-option label="未缴费" value="NotPay"></el-option>
              <el-option label="未结清" value="Uncleared"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div class="t-operate-buttons">
        <el-button type="primary" size="mini" @click="PassAdmissionBatch()">批量通过审核</el-button>
        <el-button type="primary" size="mini" @click="rejectBox()">批量拒绝审核</el-button>
      </div>
      <!-- 表格 -->
      <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="姓名">
          <template slot-scope="scope">
            <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
        </el-table-column>
        <el-table-column prop="birthday" label="出生日期">
          <template slot-scope="scope">
            {{new Date(scope.row.birthday).toLocaleDateString()}}
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号"></el-table-column>
        <el-table-column prop="tel" label="联系电话"></el-table-column>
        <el-table-column prop="education" label="学历"></el-table-column>
        <el-table-column prop="source" label="来源">
          <!-- <template slot-scope="scope">
            {{scope.row.source=='Online'?'线上（移动端）': '线下'}}
          </template> -->
          <!-- All, Online, Offline -->
        </el-table-column>
        <!-- <el-table-column prop="payStatus" label="付费情况">
            NotPay, Uncleared, Paid, All
        </el-table-column> -->
        <el-table-column prop="status" label="审核状态">
          <!-- ToAudit, NotPass, Pass, All -->
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.reason" placement="top" v-show="scope.row.status=='未通过'">
              <el-button style="color:#00f;font-size:12px;" type="text">{{scope.row.status}}</el-button>
            </el-tooltip>
              <span v-show="scope.row.status!='未通过'">{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column  fixed="right" label="操作" width="180" align="left">
          <template slot-scope="scope">
            <el-button v-show="scope.row.status=='待审核'" type="primary" size="mini" @click="PassAdmission(scope.row)">通过审核</el-button>
            <el-button v-show="scope.row.status=='待审核'" type="text" size="small" @click="rejectBox(scope.row)">拒绝审核</el-button>
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
<!-- 弹出层：拒绝审核原因 -->
<add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="rejectSave"></add-edit>
<!-- 学生档案 -->
<student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
</div>
</template>
<script>
import { getTrainingProgramsByAuditTree } from '@/server/basic-module'
import {
  getStudentInfoListByProgramId,
  CheckStudentInfo,
  CheckStudentInfoBatch
} from '@/server/training-module'
import orgTree from '@/components/orgTree.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from './admission-list-add.vue'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
export default {
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
        Status: 'ToAudit',
        Source: 'All'
      },
      tableData: [],
      isSelectAll: false,
      addEditVisible: false,
      profileVisible: false,
      addEditForm: {},
      nodeId: '',
      nodeName: '',
      nodeSelect: {}
    }
  },
  components: {orgTree, pagination, addEdit, studentProfile},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getTrainingProgramsByAuditTree()
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span v-show={data.level === '根'}>
            {node.label}
          </span>
          <span v-show={data.level !== '根'}>
            {node.label}
            <el-button type="primary" size="medium" v-show={Number(data.level) > 0} style="padding:2px 5px;color:#fff;margin-left:8px;background:#ff4426;border-color:#f5caca;border-radius:50%;font-size:13px;">{data.level}</el-button>
          </span>
        </span>
      )
    },
    toInfomationPage (row) { // 跳转至学生档案模块
      this.addEditForm = {
        studentId: row.id, // 学生id
        name: row.name, // 学生姓名
        programId: this.nodeId // 项目id
      }
      this.profileVisible = true
    },
    _getTrainingProgramsByAuditTree () {
      this.resourceTree = []
      getTrainingProgramsByAuditTree().then(result => {
        this.resourceTree.push(result)
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
    // 根据项目id获取报名列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        IdCardOrTelOrName: this.conditionForm.IdCardOrTelOrName,
        Status: this.conditionForm.Status,
        Source: this.conditionForm.Source
      }
      getStudentInfoListByProgramId(this.nodeId, data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
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
      }
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
    PassAdmission (row) {
      this.$confirm(`此操作将 审核通过学生 【${row.name}】，请确认？`, '提示', {
        confirmButtonText: '通过',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.pass = true
        row.registrationProjectsId = this.nodeId
        CheckStudentInfo(row).then(() => {
          this.$message.success('已通过审核!')
          this.queryList()
          this._getTrainingProgramsByAuditTree()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    PassAdmissionBatch () {
      let ids = []
      let names = []
      if (this.multipleSelection) {
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
          names.push(item.name)
        })
        let name = names.join()
        let data = {
          ids: ids,
          pass: true,
          registrationProjectsId: this.nodeId,
          reason: ''
        }
        this.$confirm(`此操作将 审核通过以下学生： 【${name}】，请确认？`, '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CheckStudentInfoBatch(data).then(() => {
            this.$message.success('已通过审核!')
            this.queryList()
            this._getTrainingProgramsByAuditTree()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }).catch(() => {})
      } else {
        this.$message.warning('请选择要审核的学生！')
      }
    },
    rejectSave (data) { // 审核或批量审核
      CheckStudentInfoBatch(data).then(() => {
        this.$message.success('退回审核申请!')
        this.queryList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    rejectBox (data) { // 拒绝：单条操作或多选
      let row = data || this.multipleSelection
      let ids = []
      if (data) {
        ids.push(data.id)
      } else if (this.multipleSelection) {
        this.multipleSelection.forEach((item) => {
          ids.push(item.id);
        })
      }
      this.addEditForm = row || {}
      this.addEditVisible = true
      this.addEditForm.nodeName = this.nodeName
      this.addEditForm.registrationProjectsId = this.nodeId
      this.addEditForm.pass = false
      this.addEditForm.ids = ids
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-tree-node__content{
  font-size:14px;
}
</style>
