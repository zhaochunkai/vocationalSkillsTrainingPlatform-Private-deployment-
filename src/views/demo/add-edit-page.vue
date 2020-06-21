<template>
    <div>
      <el-card>
        <div slot="header" class="t-box-card-header">
          <span>添加学生</span>
        </div>
        <el-form class="t-page-form t-form-block" ref="form" :model="form" :rules="rules" label-width="80px" size="small">
            <el-row :gutter="50">
                <el-col :span="12">
                    <el-form-item label="姓名：" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="地址：" prop="address">
                        <el-select v-model="form.address" placeholder="请选择">
                        <el-option label="北京" value="beijing"></el-option>
                        <el-option label="上海" value="shanghai"></el-option>
                        <el-option label="成都" value="chengdu"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="年龄：" prop="age">
                        <el-input v-model="form.age"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>
<script>
export default {
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
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    save () {
       this.$refs.form.validate((valid) => {
        if (!valid) return

        this.$message.success('保存成功');
       })
    }
  }
}
</script>