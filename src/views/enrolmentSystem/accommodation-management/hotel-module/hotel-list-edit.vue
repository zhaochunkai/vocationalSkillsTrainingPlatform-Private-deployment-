<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑酒店': '新增酒店'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-col :span="12">
        <el-form-item label="酒店名称">
          <el-input v-model="form.nodeName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="楼层数" prop="name">
          <el-input v-model.number="form.name" type="number" :min="0"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" autosize></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属地区" prop="sex">
          <div class="t-flex">
            <el-select v-model="form.sex">
              <el-option v-for="(item,i) of provinceList" :key="i" :label="item.name" :value="item.type"></el-option>
            </el-select>
            <el-select v-model="form.sex">
              <el-option v-for="(item,i) of provinceList" :key="i" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" autosize></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save()">保 存</el-button>
      <el-button type="primary" size="small" @click="save('saveGoon')">保存并继续新增</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      provinceList: [
        {type: 'All', name: '浙江'},
        {type: 'Enable', name: '四川'},
        {type: 'Disable', name: '上海'}
      ],
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {max: 30, message: '字符长度必须小于30', trigger: 'blur'}
        ],
      },
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm)
        if (this.dataForm.id) {
          
        }
      }
    }
  },
  methods: {
    /* --------------------------- 查询 --------------------------- */
    
    /* --------------------------- 操作 --------------------------- */
    close () {
      this.$emit('update:visible', false)
    },
    save (type) {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.dataForm.id) {
          // updateStudentEntryAgainEnroll(this.form).then(() => {
          //   this.$message.success('保存成功！')
          //   this.$emit('updateList')
          //   if (type === 'saveGoon') {
          //     this.form = Object.assign({}, this.dataForm)
          //   } else {
          //     this.close()
          //   }
          // }).catch(err => {
          //   this.$message({
          //     showClose: true,
          //     message: err.message,
          //     type: 'error'
          //   })
          // })
        } else {
          // createStudentEntryAgainEnroll(this.form).then(() => {
          //   this.$message.success('保存成功！')
          //   this.$emit('updateList')
          //   if (type === 'saveGoon') {
          //     this.form = Object.assign({}, this.dataForm)
          //   } else {
          //     this.close()
          //   }
          // }).catch(err => {
          //   this.$message({
          //     showClose: true,
          //     message: err.message,
          //     type: 'error'
          //   })
          // })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-upload {
    text-align: left;
}
</style>
