<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑资源库': '新增资源库'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
      <el-form-item label="上级资源库">
        <el-input v-model="form.parentName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="子库名称" prop="name">
        <el-input v-model="form.name" autofocus></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <!-- <el-button type="primary" size="small" @click="saveGoon">保存并继续新增</el-button> -->
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
        name: [
            { required: true, message: '请输入资源库名称', trigger: 'blur' },
            { max: 30, message: '字符长度必须小于30', trigger: 'blur' }
          ],
        address: [
            { max: 100, message: '字符长度必须小于100', trigger: 'blur' }
          ],
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
  mounted() {
    this.$nextTick(() => {
      // this.$refs.inpName.focus()
    })
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
    // saveGoon () {
    //    this.$refs.form.validate((valid) => {
    //       if (!valid) return
    //       this.$emit('save', this.form)
    //    })
    //    this.form = {}
    // },
  }
}
</script>
