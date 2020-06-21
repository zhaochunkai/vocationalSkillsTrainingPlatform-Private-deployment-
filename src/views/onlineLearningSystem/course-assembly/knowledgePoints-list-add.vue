<template>
  <el-dialog class="t-dialog" :title="title+'信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="90px" size="small">
      <el-form-item label="上级节点" prop="parentId">
        <el-input  v-model="form.parentName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input  v-model="form.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save('saveGoon')">保存并继续新增</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createCourseCatalog, updateCourseCatalog, getCourseCatalogById } from '@/server/online-module'
export default {
  props: ['dataForm', 'visible', 'title'],
  data () {
    return {
      form: {},
      rules: {
        parentId: [{ required: true, trigger: 'blur' }],
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        courseCatalogLevel: [{ required: true, message: '章/节/知识点', trigger: 'blur' }],
        description: [{ max: 200, message: '字符长度不得超出200个', trigger: 'blur' }]
      },
      courseCatalogLevel: ''
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.courseCatalogLevel = 'KnowledgePoint'
        if (this.dataForm.btnTitle === '章') {
          this.courseCatalogLevel = 'Chapter'
        } else if (this.dataForm.btnTitle === '节') {
          this.courseCatalogLevel = 'Section'
        }
        if (this.dataForm.id) {
          this._getCourseCatalogById()
        } else {
          this.form = Object.assign({}, {
            parentName: this.dataForm.parentName,
            parentId: this.dataForm.parentId,
            courseId: this.dataForm.courseId,
            courseCatalogLevel: this.courseCatalogLevel
          })
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
    },
    save (type) {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateCourseCatalog(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('save', this.form)
            if (type === 'saveGoon') {
              this.form = Object.assign({}, {
                name: '',
                description: '',
                parentName: this.dataForm.parentName,
                parentId: this.dataForm.parentId,
                courseId: this.dataForm.courseId,
                courseCatalogLevel: this.courseCatalogLevel
              })
            } else {
              this.close()
            }
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createCourseCatalog(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('save', this.form)
            if (type === 'saveGoon') {
              this.form = Object.assign({}, {
                name: '',
                description: '',
                parentName: this.dataForm.parentName,
                parentId: this.dataForm.parentId,
                courseId: this.dataForm.courseId,
                courseCatalogLevel: this.courseCatalogLevel
              })
            } else {
              this.close()
            }
          }).catch(err => {
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
<style lang="less" scoped>
.txt{
  background: #eee;
  line-height:1.8;
}
</style>
