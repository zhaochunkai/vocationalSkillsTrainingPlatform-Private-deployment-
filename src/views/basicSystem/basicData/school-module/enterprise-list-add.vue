<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑企业信息': '新增企业信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small" :inline="true">
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="企业地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contact">
        <el-input v-model="form.contact"></el-input>
      </el-form-item>
      <el-form-item label="传真电话" prop="fax">
        <el-input v-model="form.fax"></el-input>
      </el-form-item>
      <el-form-item label="电子信箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <!-- <el-form-item label="是否启用" > 默认新增数据都启用
        <template>
          <el-radio v-model="form.isAvailable" label="true">启用</el-radio>
          <el-radio v-model="form.isAvailable" label="false">停用</el-radio>
        </template>
      </el-form-item> -->
      <el-form-item label="备注" type="textarea" prop="remark">
        <el-input v-model="form.remark"></el-input>
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
        name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
            { max: 50, message: '字符长度必须小于50', trigger: 'blur' }
          ],
        contact: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
        address: [
            { required: true, message: '请输入地址', trigger: 'blur' },
            { max: 100, message: '字符长度必须小于100', trigger: 'blur' }
          ],
        fax: [
            { max: 20, message: '字符长度必须小于20', trigger: 'blur' },
            { pattern: /^(\d{3,4}-)?\d{7,8}$/, message: '请输入正确传真号码', trigger: 'blur' }
          ],
        email: [
            { type: 'email',message: '请输入正确的邮箱', trigger: 'blur' }
          ],
        remark: [
            { max: '200',message: '字符长度必须小于200', trigger: 'blur' }
          ],
      },
    }
  },
  created() { },
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
