<template>
  <el-dialog class="t-dialog" title="未缴费" v-if="visible" :visible="visible" :close-on-click-modal="false" width="30%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">     
      <el-form-item label="未通过原因">
        <el-input v-model="form.reason" type="textarea" :rows="6"></el-input>
      </el-form-item>     
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">关闭</el-button>
      <el-button type="primary" size="small" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDictionaryItems } from '@/server/basic-module';
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      fileList: [],       
      rules: {
        reason: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm);
      }
    }
  },
  methods: {
    // ---图片上传
    close () {
      this.$emit('update:visible', false)
    },
    save () {
       this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save', this.form)
        this.close()
       })
    },
  }
}
</script>
<style lang="less" scoped>
.t-form-block{margin-top:10px;}
/deep/.el-form .el-form-item {
  max-width: 99%;
}
</style>