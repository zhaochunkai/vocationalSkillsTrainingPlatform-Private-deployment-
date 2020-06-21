<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑': '新增'" v-if="visible" :visible="visible" :append-to-body="true" :close-on-click-modal="false" width="40%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="80px" size="small">
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄：" prop="age">
        <el-input v-model="form.age"></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-select v-model="form.address" placeholder="请选择">
          <el-option label="北京" value="beijing"></el-option>
          <el-option label="上海" value="shanghai"></el-option>
          <el-option label="成都" value="chengdu"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="save">确 定</el-button>
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
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请选择地址', trigger: 'change' }
        ],
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
    }
  }
}
</script>
