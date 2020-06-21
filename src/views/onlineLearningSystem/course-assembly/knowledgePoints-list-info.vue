<template>
  <el-dialog class="t-dialog" title="知识点信息" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" label-width="100px" size="small">         
      <el-form-item label="标题" >
        <div class="t-info-div">{{form.name}} </div>
      </el-form-item>
      <el-form-item label="创建人">
        <div class="t-info-div">{{form.creatorName}} </div>
      </el-form-item>
      <el-form-item label="创建时间">
        <div class="t-info-div">{{new Date(form.creationTime).toLocaleDateString()}}</div>
      </el-form-item>
      <el-form-item label="最后修改人">
        <div class="t-info-div">{{form.lastModifierName}}</div>
      </el-form-item>
      <el-form-item label="更新时间">
        <div class="t-info-div">{{form.lastModificationTime?new Date(form.lastModificationTime).toLocaleDateString(): ''}}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div class="t-info-div t-textarea">{{form.description}} </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getCourseCatalogById } from '@/server/online-module'
export default {
  props: ['dataForm', 'visible', 'title'],
  data () {
    return {
      form: {},
      id: '',
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        // this.form = Object.assign({}, this.dataForm)
        if (this.dataForm.id) {
          this._getCourseCatalogById()
        }
      }
    }
  },
  methods: {
    _getCourseCatalogById () {
      getCourseCatalogById(this.dataForm.id).then(res => {
        this.form = Object.assign({}, res, {
          parentName: this.dataForm.parentName,
          courseCatalogLevel: this.courseCatalogLevel
        })
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.txt{
  background: #eee;
  line-height:1.8;
}
</style>
