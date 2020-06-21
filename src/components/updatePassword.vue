<template>
<el-dialog class="t-dialog" :title="type=='reset'?'重置密码': '修改密码'" append-to-body v-if="visible" :visible="visible" :close-on-click-modal="false" width="450px" @close="close">  
  <div class="t-header-title" v-if="type=='reset'">
    <span>{{userForm.name}}</span>
  </div>
  <el-tag type="danger" style="color:#f00;margin-bottom:10px;">密码必须同时由数字、小写字母、大写字母和特殊符号构成，不能小于8位</el-tag>
  <el-form class="t-form-block" ref="form" :model="form" :rules="type=='reset'?rules1:rules2" label-width="110px" size="small">
    <el-form-item label="请输入旧密码" prop="currentPassword" v-if="type!='reset'">
      <el-input size="small" v-model="form.currentPassword"></el-input>
    </el-form-item>
    <el-form-item label="请输入新密码" prop="newPassword">
      <el-input size="small" v-model="form.newPassword"></el-input>   
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">取 消</el-button>
    <el-button size="small" type="primary" @click="submit">确 定</el-button>
  </span>
</el-dialog>
</template>
<script>
import { resetUserPwd,updatePersonalPwd } from '@/server/identity-module'
export default {
  props: ['userForm', 'visible','type'],
  data () {
    return {
      form: {},
      rules1: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, message: '密码长度不得小于8位', trigger: 'blur' },
          { pattern: /^(?![^a-z]+$)(?![^A-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{8,16}$/, message: '请输入正确的密码', trigger: 'blur' }
        ],
      },
      rules2: {
        currentPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, message: '密码长度不得小于8位', trigger: 'blur' },
          { pattern: /^(?![^a-z]+$)(?![^A-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{8,16}$/, message: '请输入正确的密码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = {}
      }
    }
  },
  methods: {
    submit () {
      if (this.type === 'reset') {
        let data = {
          UserId: this.userForm.id,
          NewPassword: this.form.newPassword
        }   
        resetUserPwd(data).then(() => {
          this.$message.success('密码重置成功')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        if (this.form.currentPassword === this.form.newPassword) {
          this.$message.warning('新密码不能和旧密码相同！')
          return 
        }
        let data = {
          CurrentPassword: this.form.currentPassword,
          NewPassword: this.form.newPassword
        }
        updatePersonalPwd(data).then(() => {
          this.$message.success('密码修改成功')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    close () {
      this.$emit('update:visible', false)        
    }
  }
}
</script>
