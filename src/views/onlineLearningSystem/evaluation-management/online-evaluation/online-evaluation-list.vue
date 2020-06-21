<template>
<div>
  <!-- 在线评价列表 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>在线评价列表</span>
    </div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="评价名称">
          <el-input class="input-append" v-model="conditionForm.EvaluationName" placeholder="请输入评价名称"></el-input>
        </el-form-item>
        <el-form-item label="评价类型">
          <el-select v-model="conditionForm.EvaluationType">
            <el-option v-for="(item,i) of indicatorTypeLists" :key="i" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="被考评人">
          <el-input class="input-append" v-model="conditionForm.BeEvaluationPersonName" placeholder="请输入被考评人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="evaluationName" sortable label="评价名称"></el-table-column>
      <el-table-column prop="evaluationTypeName" sortable label="评价类型" width="120" align="center"></el-table-column>
      <el-table-column prop="beCommentPersonName" sortable label="被考评对象" width="120" align="center"></el-table-column>
      <el-table-column prop="evaluationPeriod" label="评价周期"></el-table-column>
      <el-table-column  fixed="right" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addEvaluate(scope.row)">{{scope.row.hasBeenEvaluated?'查看评价': '开始评价'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全选 -->
    <!-- <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div> -->
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </el-card>
  <!-- 新增/编辑 -->
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @queryList="queryList"></add-edit>
</div>
</template>

<script>
import { getOnlineEvaluationList } from '@/server/online-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from './online-evaluation-add'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      style: '',
      resourceTree: [],
      conditionForm: {
        EvaluationType: 'All'
      },
      indicatorTypeLists: [
        {type: 'All', name: '全部'},
        {type: 'ProjectEvaluation', name: '项目评价指标'},
        {type: 'StudentEvaluationTeacher', name: '学生评价教师指标'},
        {type: 'TeacherEvaluationStudent', name: '教师评价学生指标'},
        {type: 'TeacherMutualEvaluation', name: '教师互评指标'}
      ],
      tableData: [
        {id: 1, hasBeenEvaluated: false}
      ],
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {}
    }
  },
  components: {pagination, addEdit},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.initDataList()
  },
  methods: {
    handleSize (SkipCount, pageSize) { /* *接收改变后每页多少条 */
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    handleCurrent (SkipCount, pageSize) { /* 接收当前页数 */
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    queryList () { // 查询
      this.initDataList(this.SkipCount, this.pageSize)
    },
    initDataList (SkipCount = 0, pageSize = this.pageSize) { // 初始化：根据项目id获取指标列表
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        EvaluationName: this.conditionForm.EvaluationName,
        EvaluationType: this.conditionForm.EvaluationType,
        BeEvaluationPersonName: this.conditionForm.BeEvaluationPersonName
      }
      getOnlineEvaluationList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    toggleSelection (rows) { // --------------------全选
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll () { // --------------------全选
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.isSelectAll = this.tableData.length === this.multipleSelection.length // 判断是否是全选
    },
    addEvaluate (data) { // 打开新增/编辑模态框
      this.addEditVisible = true
      this.addEditForm = data || {}
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
