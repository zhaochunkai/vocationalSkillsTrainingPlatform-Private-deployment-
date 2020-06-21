<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑学年信息': '新增学年信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close">
  <!-- <el-drawer title="学年信息" :visible.sync="visible" direction="rtl" size="84%" :before-close="close"> -->
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-form-item label="学年名称" prop="academicYearName">
        <el-input v-model="form.academicYearName"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="academicYearBeginTime">
        <el-date-picker v-model="form.academicYearBeginTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="academicYearEndTime">
        <el-date-picker v-model="form.academicYearEndTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save('saveGoon')">保存并继续新增</el-button>
    </span>
  <!-- </el-drawer>  -->
  </el-dialog>
</template>
<script>
import {
  createAcademicYear,
  updateAcademicYear
} from '@/server/basic-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      rules: {
        academicYearName: [{ required: true, message: '请输入学年名称', trigger: 'blur' }],
        academicYearBeginTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        academicYearEndTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
      },
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
    close () {
      this.$emit('changeVisibility', false)
    },
    save (type) {
      if (new Date(this.form.academicYearBeginTime) > new Date(this.form.academicYearEndTime)) {
        this.$message.warning('学年开始时间不能大于结束时间')
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateAcademicYear(this.form)
            .then(result => {
              this.$message.success('保存成功')
              this.$emit('queryList')
              if (type === 'saveGoon') {
                this.form = {}
              } else {
                this.close()
              }
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: "error"
              });
            });
        } else {
          createAcademicYear(this.form)
            .then(result => {
              this.$emit('queryList')
              if (type === 'saveGoon') {
                this.form = {}
              } else {
                this.close()
              }
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: "error"
              });
            });
        }
      })
    },
    saveGoon () {
      if (this.form.academicYearBeginTime>this.form.academicYearEndTime) {
        this.$message.warning('学年开始时间不能大于结束时间');
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save', this.form)
      })
      this.form = {}
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-drawer__body{
  padding:20px 25px;
  border-top:1px solid #ccc;
}
</style>
