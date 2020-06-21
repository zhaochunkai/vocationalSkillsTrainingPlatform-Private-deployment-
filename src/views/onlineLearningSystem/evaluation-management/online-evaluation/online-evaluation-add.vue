<template>
  <el-dialog class="t-dialog" :title="dataForm.hasBeenEvaluated?'查看评价': '编辑评价'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="70%" @close="close">
    <div class="t-header-title">
      <span>评价信息</span>
    </div>
    <el-table class="t-table-list" stripe size="small" :data="infomationData" tooltip-effect="dark" style="width: 100%;">      
      <el-table-column prop="evaluationName" label="评价计划"></el-table-column>
      <el-table-column prop="beCommentPersonName" label="被考评人" width="120" align="center"></el-table-column>
      <el-table-column prop="evaluationTypeName" label="评价类型" width="120" align="center"></el-table-column>
      <el-table-column prop="organization" label="所属组织" align="center"></el-table-column>
      <el-table-column prop="evaluationPeriod" label="评价周期" align="center"></el-table-column>
      <el-table-column prop="hasBeenEvaluated" label="是否已评价" width="140" align="center">
        <template slot-scope="scope">
          {{scope.row.hasBeenEvaluated?'是': '否'}}
        </template>
      </el-table-column>
    </el-table>
    <div class="t-header-title">
      <span>指标评分</span>
    </div>
    <el-table class="t-table-list" border stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column prop="evaluationIndicatorName" label="评价指标" align="center"></el-table-column>
      <el-table-column prop="score" label="打分" align="center">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.score" :colors="colors" :disabled="form.hasBeenEvaluated" allow-half show-score text-color="#ff9900" score-template="{value}分"></el-rate>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <div>其他想说的：</div>
      <el-input v-model="form.content" type="textarea" :disabled="form.hasBeenEvaluated"></el-input>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save" v-if="!dataForm.hasBeenEvaluated">提交评价</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createOnlineEvaluation, getOnlineEvaluationById } from '@/server/online-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      infomationData: [],
      tableData: [],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm)
        if (this.dataForm.id) {
          this._getOnlineEvaluationById()
        }
      }
    }
  },
  methods: {
    _getOnlineEvaluationById () {
      let data = {
        beCommentPersonLongId: this.dataForm.beCommentPersonLongId,
        beCommentPersonGuidId: this.dataForm.beCommentPersonGuidId,
        commentPersonType: this.dataForm.commentPersonType,
        beCommentPersonType: this.dataForm.beCommentPersonType,
        id: this.dataForm.id
      }
      getOnlineEvaluationById(data).then(result => {
        this.infomationData = [result]
        this.tableData = result.indicators
        this.tableData.forEach(item => {
          this.$set(item, 'score', 5)
        })
        this.form = Object.assign({}, result, {
          commentPersonType: this.dataForm.commentPersonType,
          beCommentPersonType: this.dataForm.beCommentPersonType
        })
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      if (!this.form.content) {
        this.$alert('请输入评价内容！')
        return
      }
      createOnlineEvaluation(this.form).then(() => {
        this.$message.success('保存成功！')
        this.$emit('queryList')
        this.close()
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
