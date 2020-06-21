
<template>
<div>
  <!-- 试题管理 -->
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 专业树 -->
        <org-tree ref="orgTree" :currentNodeAll="nodeSelect" :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>                                
      </el-card>
    </el-col>
    <el-col :span="19" v-show="nodeLevel">
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}' && this.nodeLevel=='课程'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>【{{nodeName}}】 试题列表</span>
        </div>
        <el-tabs v-model="questionType" @tab-click="handleClick">
          <el-tab-pane :label="type.label" :name="type.name" v-for="(type,i) of questionTypeList" :key="i"></el-tab-pane>
        </el-tabs>
        <!-- 查询 -->
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="关键词">
            <el-input class="input-append" v-model="conditionForm.KeyWord" placeholder="请输入关键词"></el-input>	
          </el-form-item>
          <el-form-item label="难易度">
            <el-select v-model="conditionForm.DifficultyLevelEnum" clearable>
              <el-option v-for="(item,i) of DifficultyLevelEnumList" :key="i" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="conditionForm.ApprovalStatus" clearable>
              <el-option v-for="(item,i) of ApprovalStatusList" :key="i" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>                               
        <!-- 操作按钮 -->
        <!-- <div class="t-operate-buttons">
          <el-button type="primary" size="mini" @click="approve()">批量通过审核</el-button>
          <el-button type="primary" size="mini" @click="refuse()">批量拒绝审核</el-button>
        </div> -->
        <!-- 表格 -->
        <el-table class="t-table-list" ref="multipleTable" stripe size="small"
          :data="tableData"
          v-loading="loading"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          tooltip-effect="dark"
          style="width: 100%;margin-top:10px;"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="title" sortable label="题干" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)" v-html="decodeURI(scope.row.title)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="difficultyLevelName" label="难易程度" width="100" align="center"></el-table-column>
          <el-table-column prop="creatorName" label="创建者" width="100" align="center"></el-table-column>
          <el-table-column prop="creationTime" label="发布时间" width="100">
            <template slot-scope="scope">
              {{new Date(scope.row.creationTime).toLocaleDateString()}}
            </template>
          </el-table-column>
          <el-table-column prop="auditStatusName" label="审核状态" width="100" align="center"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button v-show="scope.row.auditStatus=='CheckPending'" type="text" size="small" @click="approve(scope.row)">通过审核</el-button>
              <el-button v-show="scope.row.auditStatus=='CheckPending'" type="text" size="small" @click="refuse(scope.row)">拒绝审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>			
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
        <!-- 新增/编辑 -->
        <!-- <add-edit :title="title" :dataForm="addEditForm" :visible.sync="addEditVisible" @save="saveData"></add-edit> -->
      </el-card>
    </el-col>
  </el-row>
</div>
</template>
<script>
import { getMajorCourseTree } from '@/server/basic-module';
import {
  getQuestionList,
  examineQuestionById
} from '@/server/examination-module'
import orgTree from '@/components/orgTree.vue'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
// import addEdit from './question-edit'
export default {
  components: {orgTree, pagination},
  data () {
    return {
      style: '',
      TreeData: [],
      questionType: 'SingleChoice',
      title: '单选题',
      questionTypeList: [
        {name: 'SingleChoice', label: '单选题'},
        {name: 'MultipleChoice', label: '多选题'},
        {name: 'TrueFalse', label: '判断题'}
        // {name: 'BlankFill', label: '填空题'},
        // {name: 'ShortAnswer', label: '解答题'},
        // {name: 'Read', label: '阅读题'}
      ],
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      conditionForm: {
        ApprovalStatus: 'CheckPending'
      },
      DifficultyLevelEnumList: [
        {name: '全部', type: 'All'},
        {name: '容易', type: 'Easy'},
        {name: '初级', type: 'Primary'},
        {name: '中级', type: 'MiddleRank'},
        {name: '高级', type: 'Advanced'},
        {name: '困难', type: 'Difficulty'}
      ],
      ApprovalStatusList: [
        {name: '全部', type: 'All'},
        {name: '待审核', type: 'CheckPending'},
        {name: '已通过', type: 'Pass'},
        {name: '未通过', type: 'NotPass'},
        {name: '无需审核', type: 'NotAudit'}
      ],
      nodeSelect: {},
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      addEditVisible: false,
      addEditForm: {},
      loading: true
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getMajorCourseTree()
    if (this.nodeSelect && JSON.stringify(this.nodeSelect) !== '{}') {
      this.foucsOnNode()
    }
  },
  methods: {
    _getMajorCourseTree () { // 专业课程点树
      this.TreeData = []
      getMajorCourseTree().then(result => {
        this.TreeData.push(result)
      }).then(() => {
        if (this.nodeId && this.nodeLevel !== '根') {
          this.initialData()
        }
      })
    },
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    queryList () {
      this.initialData(this.SkipCount, this.pageSize)
    },
    // 获取试题列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ExaminationQuestionId: this.nodeId,
        QuestionType: this.questionType,
        KeyWord: this.conditionForm.KeyWord
      }
      if (this.conditionForm.DifficultyLevelEnum) {
        this.$set(data, 'DifficultyLevelEnum', this.conditionForm.DifficultyLevelEnum)
      }
      if (this.conditionForm.ApprovalStatus) {
        this.$set(data, 'AuditStatus', this.conditionForm.ApprovalStatus)
      }
      this.loading = true
      getQuestionList(data).then(result => {
        this.loading = false
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    foucsOnNode () {
      setTimeout(() => {
        this.$refs.orgTree.checkNode()
      }, 500)
    },
    toInfomationPage (row) {
      this.$router.push({path: '/question/infomation', query: {id: row.id}})
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
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      this.nodeLevel = node.level
      if (node.level === '课程') {
        this.initialData()
      }
    },    
    handleClick (tab, event) {
      let arr = this.questionTypeList.find(item => {
        return item.name === this.questionType
      })
      this.title = arr.label
      this.SkipCount = 0
      this.pageSize = 10
      this.$refs.pagination.currentPage = 1
      this.initialData()
    },
    approve (row) { // 通过审核
      examineQuestionById(row.id, true).then(() => {
        this.$message.success(`该试题审核通过！`)
        this.queryList()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    refuse (row) { // 拒绝审核
      this.$confirm(`此操作将拒绝审核选中的试题，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => { 
        examineQuestionById(row.id,false).then(() => {
          this.$message.success(`该试题拒绝审核完成！`)
          this.queryList()
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-button--text{
  img{
    display: none;
  }
  p{
    margin:0;
  }
}
/deep/.el-loading-spinner .el-loading-text{
  font-size: 16px;
}
</style>
