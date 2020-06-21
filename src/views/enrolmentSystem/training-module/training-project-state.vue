<template>
  <el-dialog class="t-dialog" title="设置学习项目状态" v-if="visible" :visible="visible" :close-on-click-modal="false" width="400px" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" label-width="80px" size="small">
      <el-form-item label="项目状态" prop="state" >
        <el-select v-model="form.state">
          <el-option v-for="(item,i) of dictionary.PXXMZT" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getTrainingProgramsById } from '@/server/training-module'
export default {
  props: ['dataForm', 'visible', 'dictionary'],
  data () {
    return {
      form: {}
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.id = this.dataForm.id
        getTrainingProgramsById(this.id).then(result => {
          this.form = Object.assign({}, result)
        })
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      console.log(this.form)
      this.$emit('save', this.form)
      this.close()
    }
  }
}
</script>
