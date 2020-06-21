<template>
  <el-dialog
    class="t-dialog"
    :title="form.id?'编辑毕业要求证书类型': '新增毕业要求证书类型'"
    v-if="visible"
    :visible="visible"
    :close-on-click-modal="false"
    width="510px"
    height="50%"
    @close="close"
  >
    <el-form
      class="t-form-block"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="170px"
      size="small"
    >
      <el-form-item label="毕业要求证书类型名称" prop="certificateName">
        <el-input v-model="form.certificateName" :disabled="form.id"></el-input>
      </el-form-item>
      <el-form-item label="毕业要求证书类型描述" prop="description">
        <el-input v-model="form.description" type="textarea" autosize></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save ('saveGoon')">保存并继续新增</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRequiredCertificateTypeById, updateRequiredCertificateType, createRequiredCertificateType } from '@/server/graduation-module'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      rules: {
        certificateName: [
          { required: true, message: '请输入毕业要求证书类型名称', trigger: 'blur' },
          { max: 100, message: '字符长度必须小于100', trigger: 'blur' }
        ],
        description: [
          { max: 500, message: '字符长度必须小于500', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible (newVal) {
      this.form = {}
      if (newVal) {
        if (this.dataForm.id) {
          this._getRequiredCertificateTypeById()
        }
      }
    }
  },
  methods: {
    /* ------------------------------------ 查询数据 -------------------------- */
    // 获取详细信息
    _getRequiredCertificateTypeById () {
      getRequiredCertificateTypeById(this.dataForm.id).then(result => {
        this.form = Object.assign({}, result)
      })
    },
    /* ------------------------------------ 查询数据 -------------------------- */
    // 关闭模态框
    close () {
      this.$emit('update:visible', false)
    },
    // 保存
    save (type) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (this.form.id) {
          updateRequiredCertificateType(this.form)
            .then(result => {
              this.$emit('queryList')
              this.$message.success('保存成功')
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
                type: 'error'
              })
            })
        } else {
          createRequiredCertificateType(this.form)
            .then(result => {
              this.$emit('queryList')
              this.$message.success('保存成功')
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
                type: 'error'
              })
            })
        }
      })
    }
  }
}
</script>
