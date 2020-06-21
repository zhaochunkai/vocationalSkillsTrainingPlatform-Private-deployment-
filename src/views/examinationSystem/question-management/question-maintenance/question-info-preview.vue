<template>
<el-dialog class="t-dialog" v-if="visible" :title="`预览${dataForm.questionTypeName}`" :visible="visible" :close-on-click-modal="false" width="45%" @close="close" append-to-body>
  <div class="t-header-title">
    难度：<strong class="t-margin-right">{{dataForm.difficultyLevelName}}</strong>  
    课程：<strong>{{dataForm.courseName}} </strong> <br>
    考察知识点：<strong>{{dataForm.knowledgePointWithQuestionName}}</strong>
  </div>    
  <el-form class="t-operate-filter basic-info" :model="dataForm" size="small" label-width="70px">
    <el-form-item style="background-color:#d7eaf5;">
      <span slot="label" style="font-weight:600;color:#333;">题 目</span>
      <div class="t-editorContent" v-html="decodeURI(dataForm.title)"></div>
    </el-form-item>
    <el-form-item label="">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(item,i) of dataForm.questionSubjectOptions" :key="i" :label="item.id" disabled>
          <div style="display:flex;"> 
            <span style="margin-left:1rem;margin-right:0.4rem;line-height:1.6;">{{item.optionNumber}}</span> 
            <span class="t-editorContent" v-html="decodeURI(item.optionContent)"></span>
          </div>
        </el-checkbox>
        <!-- <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="禁用" disabled></el-checkbox>
        <el-checkbox label="选中且禁用" disabled></el-checkbox> -->
      </el-checkbox-group>
      <!-- <el-checkbox v-model="scope.row.flagAnswer" style="margin-right:1rem;" @change="changeCheckbox(scope.row)"></el-checkbox> -->      
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">关 闭</el-button>
  </div>
</el-dialog>
</template>
<script>
export default {
  props: ['visible','dataForm'],
  data() {
    return {
      checkList: [],
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.checkList= []
        this.dataForm.questionSubjectOptions.forEach(item => {
          if (item.flagAnswer) {
            this.checkList.push(item.id)
          }
        })
      }
    },
  },
  methods: {
    changeCheckbox(row) {
      if (row.flagAnswer && (this.questionType=='SingleChoice' || this.questionType=='TrueFalse') ) {  // 判断题|单选题：勾选当前选框，其他选框取消勾选
        this.questionSubjectOptions.forEach(item => {
          if (item.optionNumber!=row.optionNumber) {
            item.flagAnswer=false;
          }
        })
      }
    },
    close () {
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item{
  max-width:100%;
}
.addBtn{
  position: absolute;
  right:0;bottom:10px;
}
.fiexdBtns{
  margin:20px 0;
  display:block;
}
.t-header-title span{
  width:100%;
}
/deep/.el-checkbox{
  display:block;
  border-bottom: 1px dashed #ddd;
}
/deep/.el-checkbox+.el-checkbox {
  margin-left: 0;
}
/deep/.el-checkbox__label{
  clear: both;
  span{
    color:#333;
    font-size:12px;
  }
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner{    
  border-color: #0a0;
  background-color: #0a0;
}
p {
  margin-block-start: 0!important;
  margin-block-end: 0!important;
}
.t-header-title{
  line-height:1.6rem;
}
</style>


