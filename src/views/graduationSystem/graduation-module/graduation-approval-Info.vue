<template>
<el-dialog class="t-dialog" v-if="visible" title="审批信息" :visible="visible" :close-on-click-modal="false" width="80%" @close="close" >
  <!-- 查看审批信息 -->
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
  </div>
  <!-- 毕业判定项目 -->
  <div class="t-header-title">
    <span>学生【{{dataForm.studentName}}】毕业判定项目达标情况</span>
  </div>
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="dataDetail.graduationList" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <!-- <el-table-column prop="institution" sortable label="判定项目" show-overflow-tooltip></el-table-column> -->
    <el-table-column prop="title" label="标准"></el-table-column>
    <el-table-column prop="requirements" label="达标要求"></el-table-column>
    <el-table-column prop="state" label="达标状态" width="80">
      <!-- <template slot-scope="scope">
        {{scope.row.pass?'达标': '不达标'}}
      </template> -->
    </el-table-column>
  </el-table>
  <!-- 审批历史  -->
  <div class="t-header-title">
    <span>审批历史</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="dataDetail.approverList" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column prop="userName" label="审核人"></el-table-column>
    <el-table-column prop="createTime" label="审核时间"></el-table-column>
    <el-table-column prop="opinion" label="审核意见"></el-table-column>
  </el-table>
</el-dialog>
</template>
<script>
import {
  getGraduationRecordById,
  // eslint-disable-next-line no-unused-vars
  updateGraduationRecordApprove, updateGraduationRecordPassState
} from '@/server/examination-module'
import {
  // eslint-disable-next-line no-unused-vars
  getStudentBasicInfoById
} from '@/server/training-module'
export default {
  props: ['visible', 'dataForm', 'dataDetail'],
  data () {
    return {
      // ------------------------------
      tableData: [],
      // -----达标状态
      statusVisible: false,
      passForm: {},
      passRules: {
        reason: [{ required: true, message: '请输入修改原因', trigger: 'blur' }],
        pass: [{ required: true, message: '请输入选择达标状态', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.passForm = {}
        if (this.dataForm.id) {
          this._getGraduationRecordById()
        }
      }
    }
  },
  methods: {
    // ----------------------------------------查询-----------------------------------------
    _getGraduationRecordById () {
      this.tableData = []
      getGraduationRecordById(this.dataForm.id).then(result => {
        this.tableData.push(result)
      })
    },
    // ----------------------------------------操作-----------------------------------------
    update (row) {
      this.$set(this.passForm, 'pass', row.pass)
      this.statusVisible = true
    },
    savePass () {
      this.$refs.passForm.validate((valid) => {
        if (!valid) return
        updateGraduationRecordPassState(this.dataForm.id, this.passForm).then(() => {
          this.$alert('状态修改成功！')
          this._getGraduationRecordById()
          this.statusVisible = false
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      })
    },
    privew () {
      this.$alert('暂未处理')
    },
    close () {
      this.$emit('update:visible', false)
      this.$emit('initialData')
    }

  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  max-width: 100%;
}
/deep/.el-input.is-disabled .el-input__inner{
  color:#666;
  background-color: #fff;
  border-color: #fff;
}
/deep/.el-select .el-input .el-select__caret {
  color: #fff;
}
</style>
