<template>
  <div>
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>{{form.id?'编辑企业信息': '新增企业信息'}}</span>
      </div>
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
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
        <el-form-item >
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="save (scope.row)">保 存</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { createEnterprise,updateEnterprise,getEnterpriseById } from '@/server/basic-module'
export default {
  props: ['nodeId','nodeLevel'],
  data () {
    return {
      style: '',
      form: {},
      rules: {
        name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
            { max: 50, message: '字符长度必须小于50', trigger: 'blur' }
          ],
        contact: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { max: 20, message: '字符长度必须小于20', trigger: 'blur' }
          ],
        address: [
            { required: true, message: '请输入地址', trigger: 'blur' },
            { max: 100, message: '字符长度必须小于100', trigger: 'blur' }
          ],
        fax: [{ max: 20, message: '字符长度必须小于20', trigger: 'blur' }],
        email: [{ type: 'email',message: '请输入正确的邮箱', trigger: 'blur' }],
        remark: [{ max: '200',message: '字符长度必须小于200', trigger: 'blur' }],
      },
    }
  },
  watch: {
    nodeId(newVal) {
      if (newVal!=-1 && this.nodeLevel=='企业') {
        getEnterpriseById(newVal).then(result => {
          this.form=Object.assign({},result);
        })
      }
    }
  },
  created() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
  },
  methods: {
    save () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateEnterprise(this.form).then(result => {
            this.$message.success('保存成功');
            this.$emit('updateSchoolTree')
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createEnterprise(this.form).then(result => {
            this.$message.success('保存成功');
            this.$emit('updateSchoolTree')
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
  }
}
</script>
