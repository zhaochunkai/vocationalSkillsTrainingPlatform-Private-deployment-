<template>
<el-dialog class="t-dialog" v-if="visible" title="毕业批量审批" :visible="visible" :close-on-click-modal="false" width="630px" @close="close" >
  <!-- 批量审批 -->
  <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
    <el-form-item label="审批意见" prop="approveOpinion">
      <el-input v-model="form.approveOpinion" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="毕业判定结果" prop="result">
      <el-select v-model="form.result" filterable clearable>
        <el-option v-for="(item,i) of statusList" :key="i" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
  </div>
</el-dialog>
</template>
<script>
import {
  updateGraduationRecordApprove
} from '@/server/examination-module'
export default {
  props: ['visible', 'chooseList', 'statusList', 'dataForm'],
  data () {
    return {
      form: {
        reason: '',
        stauts: ''
      },
      rules: {
        approveOpinion: [{ required: true, message: '请输入审批意见', trigger: 'blur' }],
        result: [{ required: true, message: '请输入选择判定结果', trigger: 'blur' }]
      },
      dictionary: {}
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {

      }
    }
  },
  activated () {

  },
  methods: {
    // ----------------------------------------查询-----------------------------------------
    // ----------------------------------------操作-----------------------------------------
    close () {
      this.$emit('update:visible', false)
    },
    // 批量审核
    save () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        updateGraduationRecordApprove({
          'StudentIdList': this.chooseList,
          'Opinion': this.form.approveOpinion,
          'Result': this.form.result,
          'ClassId': this.dataForm.classId,
          'TrainingProgramId': this.dataForm.projectNodeId
        }).then(() => {
          this.$alert('批量审批成功！')
          this.$emit('initialData')
          this.$set(this.form, 'approveOpinion', '')
          this.$set(this.form, 'result', '')
          this.close()
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
/deep/.el-form .el-form-item {
  max-width: 100%;
}
/deep/.el-input.is-disabled .el-input__inner{
  color:#999;
}
</style>
