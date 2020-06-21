<template>
  <el-dialog class="t-dialog" title="评价详细信息" v-if="visible" :visible="visible" append-to-body :close-on-click-modal="false" width="70%" @close="close">
    <div class="t-header-title">
      <span>评价信息</span>
    </div>
    <el-table class="t-table-list" stripe size="small" :data="infomationData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column prop="participatingUsers" label="评价者"></el-table-column>
      <el-table-column prop="evaluationTime" label="评价时间" align="center">
        <template slot-scope="scope">
          {{new Date(scope.row.evaluationTime) | formatAllDate}}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="评价分数" align="center"></el-table-column>
    </el-table>
    <div class="t-header-title">
      <span>指标评分</span>
    </div>
    <el-table class="t-table-list" border stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column prop="evaluationIndicatorName" label="评价指标" align="center"></el-table-column>
      <el-table-column prop="score" label="打分" align="center">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.score" :colors="colors" disabled allow-half show-score text-color="#ff9900" score-template="{value}分"></el-rate>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <div>其他想说的：</div>
      <el-input v-model="content" type="textarea" disabled></el-input>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getEvaluationDetailInfo } from '@/server/online-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      infomationData: [],
      tableData: [],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      content: ''
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        if (this.dataForm.id) {
          this._getEvaluationDetailInfo()
        }
      }
    }
  },
  methods: {
    // ------------------------------------- 查询 -------------------------------------
    _getEvaluationDetailInfo () {
      getEvaluationDetailInfo(this.dataForm.id).then(result => {
        this.infomationData = [result]
        this.tableData = result.indicators
        this.content = result.content
      })
    },
    // ------------------------------------- 操作 -------------------------------------
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
