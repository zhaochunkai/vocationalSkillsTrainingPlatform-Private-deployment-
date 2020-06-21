<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑学期信息': '新增学期信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-form-item label="所属学年" prop="academicYearName">
        <el-input v-model="form.academicYearName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="学期名称" prop="semesterName">
        <el-input v-model="form.semesterName"></el-input>
      </el-form-item>
      <el-form-item label="学期代码" prop="semesterCode">
        <el-input v-model="form.semesterCode" :disabled="form.id?true:false"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="semesterBeginTime">
        <el-date-picker v-model="form.semesterBeginTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="semesterEndTime">
        <el-date-picker v-model="form.semesterEndTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item label="是否是默认学期" prop="defaultSemester">
        <el-checkbox v-model="form.defaultSemester">默认</el-checkbox>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save ('saveGoon')">保存并继续新增</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  createSemester,
  updateSemester
} from '@/server/basic-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      rules: {
        semesterCode: [
          { required: true, message: '请输入学期名称', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,20}$/, message: '只能由20字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        semesterName: [{required: true, message: '请输入学期名称', trigger: 'blur'}],
        semesterBeginTime: [{required: true, message: '请选择开始日期', trigger: 'blur'}],
        semesterEndTime: [{required: true, message: '请选择结束日期', trigger: 'blur'}]
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm)
      }
    }
  },
  methods: {
    handleClose (done) {
      this.$emit('changeVisibility', false)
    },
    close () {
      this.$emit('changeVisibility', false)
    },
    dateFormat (str1, str2) {
      str1 = new Date(str1).getTime()
      str2 = new Date(str2).getTime()
      return str1 > str2
    },
    save (type) {
      let start = this.form.semesterBeginTime + ' 00:00:00'
      let end = this.form.semesterEndTime + ' 00:00:00'
      if (this.dateFormat(start, end)) {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      if (this.dateFormat(this.form.academicYearBeginTime, start)) {
        this.$message.warning('学期开始时间不能大于学年开始时间')
        return
      }
      if (this.dateFormat(end, this.form.academicYearEndTime)) {
        this.$message.warning('学期结束不能大于学年结束时间')
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateSemester(this.form)
            .then(result => {
              this.$message.success('保存成功')
              this.$emit('queryList')
              if (type === 'saveGoon') {
                this.form = Object.assign({}, this.dataForm)
              } else {
                this.close()
              }
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
        } else {
          createSemester(this.form)
            .then(result => {
              this.$message.success('保存成功')
              this.$emit('queryList')
              if (type === 'saveGoon') {
                this.form = Object.assign({}, this.dataForm)
              } else {
                this.close()
              }
            })
            .catch(err => {
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
<style lang="less" scoped>
/deep/.el-drawer__body{
  padding:20px 25px;
  border-top:1px solid #ccc;
}
</style>
