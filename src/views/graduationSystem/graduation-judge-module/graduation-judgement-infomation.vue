<template>
<el-dialog class="t-dialog" v-if="visible" title="毕业判定条件" :visible="visible" :close-on-click-modal="false" width="70%" @close="close" >
  <div class="t-text-center">
    <strong style="font-size:1.1rem;"><span style="font-size:1.5rem;">{{dataForm.trainingProgram}}</span> 毕业条件</strong>
  </div>
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="competentAuthorityNames" label="毕业判定机构" show-overflow-tooltip></el-table-column>
    <el-table-column prop="academicYearName" label="学年" width="120"></el-table-column>
    <el-table-column prop="semesterName" label="学期" width="120"></el-table-column>
    <el-table-column prop="trainingProgram" label="培训项目" width="150" show-overflow-tooltip></el-table-column>
    <el-table-column prop="standard" label="判定条件" show-overflow-tooltip></el-table-column>
    <el-table-column prop="requirement" label="达标要求" width="130" show-overflow-tooltip></el-table-column>
  </el-table>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
  </div>
</el-dialog>
</template>
<script>
export default {
  props: ['visible', 'dataForm'],
  data () {
    return {
      form: {},
      tableData: []
    }
  },
  watch: {
    visible (newVal) {
      this.tableData = []
      if (newVal) {
        this.tableData.push(this.dataForm)
      }
    }
  },
  methods: {
    // -----------------------------------------查询-----------------------------------   
    // ----------------------------------------操作------------------------------------
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  max-width: 100%;
}
/deep/.el-input.is-disabled .el-input__inner{
  color:#999;
}
.t-header-title span{
  width:100%;
  text-align:left;
  line-height:1.6;
  padding:6px;
}
</style>
