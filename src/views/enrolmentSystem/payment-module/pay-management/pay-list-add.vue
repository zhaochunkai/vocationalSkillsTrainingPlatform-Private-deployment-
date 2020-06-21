<template>
  <el-dialog class="t-dialog" title="缴费" v-if="visible" :visible="visible" :close-on-click-modal="false" width="30%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small" :inline="true">
      <el-form-item label="缴费金额" prop='money'>
        <el-input ref="money" v-model.number="money" autofocus min=0 type="number">
          <el-button slot="append">元</el-button>
        </el-input>
      </el-form-item>
      <el-button type="success" round size="medium" @click="allMoney">全额缴费</el-button>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">关闭</el-button>
      <el-button type="primary" size="small" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      fileList: [],
      money: '',
      rules: {
        money: [{ required: true, message: '请输入请输入线下缴费金额', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible (newVal) {
      this.money = ''
      if (newVal) {
        this.form = Object.assign({}, this.dataForm)
        setTimeout(() => {
          this.$refs.money.focus()
        }, 520)
      }
    },
    money (newVal) {
      if (parseFloat(newVal) < 0) {
        this.money = null
      }
    }
  },
  methods: {
    allMoney () {
      this.money = this.form.amountToBePaid - this.form.actualAmountOfPayment
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      this.$set(this.form, 'money', this.money)
      if (!Number(this.form.money)) {
        this.$message.warning('请输入正确的缴费金额')
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save', this.form)
        this.close()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.t-form-block{margin-top:10px;}
</style>
