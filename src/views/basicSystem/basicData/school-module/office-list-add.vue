<template>
  <el-dialog
    class="t-dialog"
    :title="form.id?'编辑机构信息': '新增机构信息'"
    v-if="visible"
    :visible="visible"
    :close-on-click-modal="false"
    width="40%"
    @close="close"
  >
    <el-form
      class="t-form-block"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="small"
    >
      <el-form-item label="机构代码" prop="institutionNumber">
        <el-input v-model="form.institutionNumber"></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="institutionName">
        <el-input v-model="form.institutionName"></el-input>
      </el-form-item>
      <el-form-item label="机构简称" prop="institutionAbbreviation">
        <el-input v-model="form.institutionAbbreviation"></el-input>
      </el-form-item>
      <el-form-item label="隶属机构" prop="parentId">
        <el-input v-model="form.parentName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="隶属校区" prop="campusId">
        <el-input v-model="form.campusName" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <template slot-scope="scope">
            <el-radio v-model="scope.row.status" label="Enable">启用</el-radio>
            <el-radio v-model="scope.row.status" label="Disable">停用</el-radio>
        </template>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="saveGoon">保存并继续新增</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ["dataForm", "visible", "moduleLevel"],
  data() {
    return {
      showModule: 0,
      form: {},
      rules: {
        institutionNumber: [
          { required: true, message: "请输入机构代码", trigger: "blur" },
          {
            pattern: /^[0-9a-zA-Z-_]{0,20}$/,
            message: "只能由20字以内的数字、字母、下划线或横线组成",
            trigger: "blur"
          }
        ],
        institutionName: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm)
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    save () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$emit('save', this.form)
        this.close()
      })
    },
    saveGoon () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$emit('save', this.form)
      })
      this.form = Object.assign({}, this.dataForm)
    }
  }
}
</script>
