<template>
<div>
  <!-- 指标列表 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>评价指标</span>
    </div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="指标名称">
          <el-input class="input-append" v-model="conditionForm.IndicatorName" placeholder="指标名称"></el-input>
        </el-form-item>
        <el-form-item label="指标类型">
          <el-select v-model="conditionForm.IndicatorType">
            <el-option v-for="(item,i) of indicatorTypeLists" :key="i" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
        <el-button type="primary" size="mini" @click="addEvaluate">新增</el-button>
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="indicatorName" sortable label="指标名称" align="center"></el-table-column>
        <el-table-column prop="indicatorTypeName" sortable label="指标类型" align="center"></el-table-column>
        <el-table-column prop="indicatorDescription" label="指标描述"></el-table-column>
        <el-table-column  fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addEvaluate(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="delEvaluate(scope.row)">删除</el-button>
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
  </el-card>
  <!-- 新增/编辑 -->
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @updateList="queryList"></add-edit>
</div>
</template>
<script>
import { getEvaluationIndicator, deleteEvaluationIndicator } from '@/server/online-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from './evaluating-indicator-add'
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
        IndicatorType: 'All'
      },
      tableData: [],
      isSelectAll: false,
      addEditVisible: false,
      addEditForm: {},
      indicatorTypeLists: [
        {type: 'All', name: '全部'},
        {type: 'ProjectEvaluation', name: '项目评价指标'},
        {type: 'StudentEvaluationTeacher', name: '学生评价教师指标'},
        {type: 'TeacherEvaluationStudent', name: '教师评价学生指标'},
        {type: 'TeacherMutualEvaluation', name: '教师互评指标'}
      ]
    }
  },
  components: {pagination, addEdit},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.initDataList()
  },
  methods: {
    // ------------------------------------- 查询 -------------------------------------
    // 接收改变后每页多少条
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    // 接收当前页数
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    // 查询
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    // 获取指标列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        IndicatorName: this.conditionForm.IndicatorName,
        IndicatorType: this.conditionForm.IndicatorType
      }
      getEvaluationIndicator(data).then(result => {
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
    // 全选
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.isSelectAll = this.tableData.length === this.multipleSelection.length // 判断是否是全选
    },
    // ------------------------------------- 操作 -------------------------------------
    addEvaluate (data) { // 打开新增/编辑模态框
      this.addEditVisible = true
      this.addEditForm = data || this.multipleSelection[0] || {}
    },
    delEvaluate (row) { // 删除指标
      this.$confirm(`此操作将删除选中的指标 【${row.indicatorName}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteEvaluationIndicator(row.id).then(() => {
          this.$message.success('指标删除成功！')
          this.initDataList()
          this.$refs.pagination.currentPage = 1
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
.specialCol{
  background:#a5f373;
  /deep/.el-button{
    span{
      color:#00f;
    }
  }
}
</style>
