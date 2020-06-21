<template>
<el-drawer title="评价条目信息" v-if="visible" :visible="visible" size="80%" :before-close="close">
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="评价计划信息" name="first">
      <el-form class="t-operate-filter" :model="planeData" size="small" label-width="150px">
        <el-form-item label="评价计划名称">
          <el-input v-model="planeData.evaluationName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="评价类型">
          <el-input v-model="planeData.evaluationTypeName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="评价周期">
          <div class="t-info-div">
            <span>{{new Date(planeData.startDate).toLocaleString()}} ~ {{new Date(planeData.endDate).toLocaleString()}}</span>
          </div>
        </el-form-item>
        <el-form-item label="评价项目">
          <el-input v-model="planeData.trainingProgramsName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="评价课程">
          <el-input v-model="planeData.courseName" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="评价计划描述称">
          <el-input v-model="planeData.indicatorDescription" type="textarea" :rows="15" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="评价指标" name="second">
      <!-- 表格 -->
      <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="indicatorName" sortable label="指标名称" width="200"></el-table-column>
        <el-table-column prop="indicatorTypeName" label="指标类型" width="200"></el-table-column>
        <el-table-column prop="description" label="指标描述"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="评价者" name="third">
      <el-table class="t-table-list" ref="evaluatorTable" stripe size="small" :data="Commentator" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="评价对象" width="200"></el-table-column>
        <el-table-column prop="department" label="部门" width="200"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="被评价者" name="fourth">
      <el-table class="t-table-list" ref="evaluatorTable" stripe size="small" :data="BeCommentator" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="被评对象" width="200"></el-table-column>
        <el-table-column prop="department" label="部门" width="200"></el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- <el-tab-pane label="预览效果" name="fifth">
      0000
    </el-tab-pane> -->
  </el-tabs>
</el-drawer>
</template>
<script>
import {
  getEvaluationPlanById,
  getPlanIndicatorList,
  getPlanCommentByList
} from '@/server/online-module'
export default {
  props: ['visible', 'dataForm'],
  data () {
    return {
      tableData: [],
      activeName: 'first',
      planeData: {},
      // 考评人
      Commentator: [],
      // 被考评人
      BeCommentator: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        if (this.dataForm.id) {
          this._getEvaluationPlanById()
          this._getPlanIndicatorList()
        }
      }
    }
  },
  methods: {
    /* ------------------------------------------  查询 ------------------------------------------ */
    _getEvaluationPlanById () { // 获取评价计划详细信息
      getEvaluationPlanById(this.dataForm.id).then(result => {
        this.planeData = Object.assign({}, result)
      }).then(() => {
        this._getPlanCommentByList()
        this._getPlanBeCommentByList()
      })
    },
    _getPlanIndicatorList () { // 获取已分配的评价指标
      getPlanIndicatorList(this.dataForm.id).then(result => {
        this.tableData = result
      })
    },
    // 获取被考评人
    _getPlanBeCommentByList () {
      let data = {
        id: this.dataForm.id,
        isBeCommentator: true
      }
      getPlanCommentByList(data).then(res => {
        this.BeCommentator = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 获取考评人
    _getPlanCommentByList () {
      let data = {
        id: this.dataForm.id,
        isBeCommentator: false
      }
      getPlanCommentByList(data).then(res => {
        this.Commentator = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* ------------------------------------------  操作 ------------------------------------------ */
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item{
  max-width:80%;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner{
  border:none;
  background: #eee;
}
/deep/.el-input.is-disabled .el-input__inner {
  background-color: #eee;
  color: #666;
}
</style>
