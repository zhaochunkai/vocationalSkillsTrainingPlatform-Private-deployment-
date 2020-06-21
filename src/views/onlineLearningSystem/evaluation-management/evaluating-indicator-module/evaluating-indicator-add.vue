<template>
  <el-dialog class="t-dialog" :title="dataForm.id?'编辑评价指标': '新增评价指标'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">   
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="指标名称" prop="indicatorName">
        <el-input v-model="form.indicatorName"></el-input>
      </el-form-item>
      <el-form-item label="指标类型" prop="indicatorType">
        <el-select v-model="form.indicatorType">
          <el-option v-for="(item,i) of indicatorTypeLists" :key="i" :label="item.name" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指标描述" prop="indicatorDescription">
        <el-input v-model="form.indicatorDescription" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save ('saveGoon')">保存并继续新增</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { getEvaluationIndicatorById } from '@/server/online-module'
import { createEvaluationIndicator, updateEvaluationIndicator } from '@/server/online-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      rules: {
        indicatorName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
        indicatorType: [{ required: true, message: '请输入指标类型', trigger: 'blur' }]
      },
      indicatorTypeLists: [
        {type: 'ProjectEvaluation', name: '项目评价指标'},
        {type: 'StudentEvaluationTeacher', name: '学生评价教师指标'},
        {type: 'TeacherEvaluationStudent', name: '教师评价学生指标'},
        {type: 'TeacherMutualEvaluation', name: '教师互评指标'}
      ]
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm)
        if (!this.dataForm.id) {
          this.$set(this.form, 'indicatorType', 'ProjectEvaluation')
        }
      }
    }
  },
  methods: {
    // _getEvaluationIndicatorById () {
    //   getEvaluationIndicatorById(this.dataForm.id).then(result => {
    //     this.form = Object.assign({}, result)
    //   })
    // },
    close () {
      this.$emit('update:visible', false)
    },
    save (type) {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateEvaluationIndicator(this.form).then(result => {
            this.$message.success('修改指标成功！')
            this.$emit('updateList')
            if (type === 'saveGoon') {
              this.$set(this.form, 'id', '')
              this.$set(this.form, 'indicatorName', '')
              this.$set(this.form, 'indicatorDescription', '')
            } else {
              this.close()
            }
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createEvaluationIndicator(this.form).then(result => {
            this.$message.success('新增指标成功！')
            this.$emit('updateList')
            if (type === 'saveGoon') {
              this.$set(this.form, 'id', '')
              this.$set(this.form, 'indicatorName', '')
              this.$set(this.form, 'indicatorDescription', '')
            } else {
              this.close()
            }
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      })
    }
  }
}
</script>
