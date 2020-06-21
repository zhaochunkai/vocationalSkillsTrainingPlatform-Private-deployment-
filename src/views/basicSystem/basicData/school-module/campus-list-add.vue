<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑校区信息': '新增校区信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-form-item label="校区代码" prop="code">
        <el-input v-model="form.code" :disabled="form.id?true:false"></el-input>
      </el-form-item>
      <el-form-item label="校区名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="saveGoon">保存并继续新增</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      rules: {
        code: [
          { required: true, message: '请输入校区代码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,20}$/, message: '只能由20字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入校区名称', trigger: 'blur' },
          { max: 30, message: '字符长度必须小于30', trigger: 'blur' }
        ]
      }
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
    saveGoon () {
       this.$refs.form.validate((valid) => {
          if (!valid) return
          this.$emit('save', this.form)
       })
       this.form = {}
    },
  }
}
</script>
