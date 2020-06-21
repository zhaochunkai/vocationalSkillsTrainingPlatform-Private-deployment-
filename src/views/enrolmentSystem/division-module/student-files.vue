<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card :style="style">
          <!-- 学生档案 -->
          <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
        </el-card>
      </el-col>
      <el-col :span="19">
        <!-- 人员列表 -->
        <el-card
          v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'"
          :style="style"
        >
          <div slot="header" class="t-box-card-header">
            <span>学生列表</span>
          </div>
          <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
            <el-form-item label="姓名/身份证/手机号">
              <el-input class="input-append" v-model="conditionForm.IdCardOrTelOrName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="缴费状态">
              <el-select v-model="conditionForm.PayStatus">
                <el-option label="全部" value="All"></el-option>
                <el-option label="已结清" value="Paid"></el-option>
                <el-option label="未缴费" value="NotPay"></el-option>
                <el-option label="未结清" value="Uncleared"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="来源">
              <el-select v-model="conditionForm.Source">
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
          <el-table
            class="t-table-list"
            ref="multipleTable"
            stripe
            size="small"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" sortable label="姓名">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color:#00f"
                  @click="toInfomationPage(scope.row)"
                >{{scope.row.name}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="60"></el-table-column>
            <el-table-column prop="sex" label="性别" width="60"></el-table-column>
            <el-table-column prop="education" label="学历" width="120"></el-table-column>
            <el-table-column prop="idCard" label="身份证号" width="180"></el-table-column>
            <el-table-column prop="tel" label="联系电话"></el-table-column>
            <el-table-column prop="birthday" label="出生日期">
              <template slot-scope="scope">{{new Date(scope.row.birthday).toLocaleDateString()}}</template>
            </el-table-column>
            <el-table-column prop="source" label="来源"></el-table-column>
            <!-- <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="creditHour" label="毕业学分"></el-table-column>-->
          </el-table>
          <!-- 分页组件 -->
          <div class="t-operate-footer">
            <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 学生档案 -->
    <student-profile :nodeId="nodeId" :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
  </div>
</template>
<script>
import { getGradeTree } from '@/server/basic-module'
import {
  getStudentArchives
} from '@/server/training-module'
import orgTree from '@/components/orgTree.vue'
import studentProfile from '@/views/common/infomation-module/student-profile.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      style: '',
      total: 0,
      resourceTree: [],
      conditionForm: {},
      tableData: [],
      nodeId: '',
      nodeName: '',
      nodeSelect: {},
      programId: '',
      addEditForm: {},
      profileVisible: false
    }
  },
  components: { orgTree, pagination, studentProfile },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
    this._getGradeTree()
  },
  methods: {
    /* -------------------------- 查询 -------------------------- */
    _getGradeTree () {
      // 学习项目班级树
      this.resourceTree = []
      getGradeTree()
        .then(result => {
          this.resourceTree.push(result)
        })
        .then(() => {
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
      let data = {}
      if (this.nodeSelect.level === '班级') {
        data = {
          ClassId: this.nodeId,
          IdCardOrTelOrName: this.conditionForm.IdCardOrTelOrName,
          PayStatus: this.conditionForm.PayStatus,
          Source: this.conditionForm.Source,
          SkipCount: SkipCount,
          MaxResultCount: pageSize
        }
      } else if (this.nodeSelect.level === '培训项目') {
        data = {
          TrainingProgramId: this.nodeId,
          IdCardOrTelOrName: this.conditionForm.IdCardOrTelOrName,
          PayStatus: this.conditionForm.PayStatus,
          Source: this.conditionForm.Source,
          SkipCount: SkipCount,
          MaxResultCount: pageSize
        }
      }
      getStudentArchives(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    /* -------------------------- 操作 -------------------------- */
    toInfomationPage (row) {
      // 跳转至学生档案模块
      this.addEditForm = {
        studentId: row.id, // 学生id
        name: row.name, // 学生姓名
        programId: row.trainingProgramsId // 项目id
      }
      this.profileVisible = true
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="less" scoped>
.specialCol {
  background: #a5f373;
  /deep/.el-button {
    span {
      color: #00f;
    }
  }
}
</style>
