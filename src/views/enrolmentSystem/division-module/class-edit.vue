<template>
<el-dialog class="t-dialog" :title="form.id?'编辑班级': '新增班级'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="500px" @close="close">
  <div class="topBtn" v-show="form.id?true:false">
    <el-button type="primary" size="small" @click="del">删除该班级</el-button>
    <el-button v-if="classTotal>0" type="primary" size="small" @click="clear">清空该班学生</el-button>
  </div>
  <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="90px" size="small">
    <el-form-item label="学习项目">
      <el-input v-model="form.trainingProgramName" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="班级名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="班主任" prop="classTutorId">
      <el-input v-model="teacherNames" @focus="openDialog"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="form.description" type="textarea" :rows="5"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返回</el-button>
    <el-button type="primary" size="small" @click="save">保存</el-button>
    <!-- <el-button type="primary" size="small" @click="save('saveGoon')">保存并继续新增</el-button> -->
  </div>
  <!-- 选择班主任 -->
  <choose-users :dataForm="addEditForm" :TreeData="TreeData" :visible.sync="addEditVisible" @save="saveTeacher"></choose-users>
</el-dialog>
</template>
<script>
import chooseUsers from '../../basicSystem/identity-module/user-module/chooseUsers.vue'
import {
  getClassInfoById,
  createClass,
  updateClass,
  deleteClass,
  SetClearClassStudent
} from '@/server/training-module'
import { getSchoolTree } from '@/server/basic-module'
import { getIdentityUserById } from '@/server/identity-module'
export default {
  // classTotal - 班级学生人数
  props: ['dataForm', 'visible', 'classTotal'],
  data () {
    return {
      form: {},
      fileList: [],
      rules: {
        name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
        classTutorId: [{ required: true, message: '请选择老师', trigger: 'blur' }]
      },
      addEditForm: {},
      addEditVisible: false,
      teacherNames: '',
      height: 500,
      TreeData: []
    }
  },
  components: {chooseUsers},
  activated () {
    this.height = document.body.clientHeight < 860 ? 500 : document.body.clientHeight - 360
    this._getlTreeData()
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        if (this.dataForm.id) {
          getClassInfoById(this.dataForm.id).then(result => {
            this.form = Object.assign({}, this.dataForm, {
              name: result.name,
              classTutorId: result.classTutorId,
              description: result.description,
              id: result.id
            })
            if (this.form.classTutorId) { // 根据用户id查询用户姓名
              getIdentityUserById(this.form.classTutorId).then(result => {
                this.teacherNames = result.name
              })
            }
          })
        } else {
          this.form = Object.assign({}, this.dataForm)
          this.teacherNames = ''
        }
      }
    }
  },
  methods: {
    // 获取树结构
    _getlTreeData () {
      this.TreeData = []
      getSchoolTree().then(result => {
        this.TreeData.push(result)
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    del () {
      this.$confirm(`此操作将 删除班级 【${this.form.name}】，请确认？`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClass(this.form.id).then(() => {
          this.$message.success('删除成功!')
          this.$emit('refresh')
          let id = this.form.trainingProgramId
          let trainingProgramName = this.form.trainingProgramName
          this.form = {
            trainingProgramName: trainingProgramName,
            trainingProgramId: id
          }
          this.teacherNames = ''
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    clear () {
      this.$confirm(`此操作将清空班级 【${this.form.name}】 里的所有学生，请确认？`, '提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        SetClearClassStudent(this.form.id).then(result => {
          this.$message.success('清空学生成功')
          this.$emit('changeStudentList')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    save (type) {
      let id = this.form.trainingProgramId
      let trainingProgramName = this.form.trainingProgramName
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateClass(this.form).then(result => {
            this.$message.success('修改成功！')
            this.$emit('refresh')
            if (type === 'saveGoon') {
              this.form = Object.assign({}, {
                trainingProgramId: id,
                trainingProgramName: trainingProgramName,
                teacherNames: ''
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
          createClass(this.form).then(result => {
            this.$message.success('保存成功！')
            this.$emit('refresh')
            if (type === 'saveGoon') {
              this.form = Object.assign({}, {
                trainingProgramId: id,
                trainingProgramName: trainingProgramName,
                teacherNames: ''
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
    },
    openDialog () { // 去选择教师
      this.addEditVisible = true
      // this.addEditForm = {}
    },
    saveTeacher (data1, data2) { // 保存分配的老师
      this.$set(this.form, 'classTutorId', data1.join(','))
      this.teacherNames = data2.join()
    }
  }
}
</script>
<style lang="less" scoped>
.t-form-block{margin-top:10px;}
.box{
  position: relative;
}
.topBtn{
  position: absolute;
  right: 50px;
  top: 15px;
}
</style>
