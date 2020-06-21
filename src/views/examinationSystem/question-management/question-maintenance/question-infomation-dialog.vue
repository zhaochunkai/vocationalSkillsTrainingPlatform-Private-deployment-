<template>
<el-dialog class="t-dialog" v-if="visible" title="查看试题详情" :visible="visible" :close-on-click-modal="false" width="50%" @close="close" append-to-body>   
  <div class="t-header-title">
    <span>题目信息</span>
  </div>
  <el-form class="t-operate-filter basic-info" :model="infoForm" size="small" label-width="100px">
    <el-form-item label="">
      <div>（{{infoForm.questionTypeName}}， {{infoForm.difficultyLevelName}}）</div>
    </el-form-item>
    <el-form-item label="题目">
      <div class="t-info-div t-editorContent" v-html="decodeURI(infoForm.title)"></div>
    </el-form-item>
    <el-form-item label="答案选项">
      <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="infoForm.questionSubjectOptions" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="optionNumber" label="选项" width="50" align="center"></el-table-column>
        <el-table-column prop="label" label="正确答案" width="80" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.flagAnswer" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="答案内容">
          <template slot-scope="scope">
            <div class="t-editorContent" v-html="decodeURI(scope.row.optionContent)"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item label="分析提示">
      <div class="t-bgcolor-grey t-editorContent" v-html="decodeURI(infoForm.answerAnalysis)"></div>
    </el-form-item>
  </el-form>     
  <div class="t-header-title">
    <span>关联信息</span>
  </div>
  <el-form class="t-operate-filter"  :model="infoForm" size="small" label-width="100px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="课程">
          <div class="t-info-div">{{infoForm.courseName}}</div>
        </el-form-item>
        <el-form-item label="知识点">
          <div class="t-bgcolor-grey t-editorContent">{{infoForm.knowledgePointWithQuestionName}}</div>
        </el-form-item>
        <el-form-item label="关键词">
          <div class="t-info-div">{{infoForm.keyWord}}</div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建人">
          <div class="t-info-div">{{infoForm.creatorName}}</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="t-info-div">{{infoForm.creationTime?new Date(infoForm.creationTime).toLocaleDateString():null}}</div>
        </el-form-item>
        <el-form-item label="修改人">
          <div class="t-info-div">{{infoForm.lastModificationName}}</div>
        </el-form-item>
        <el-form-item label="修改时间">
          <div class="t-info-div">{{infoForm.lastModificationTime?new Date(infoForm.lastModificationTime).toLocaleDateString():null}}</div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>   
  <div slot="footer" class="dialog-footer">
    <!-- <el-button type="primary" size="small" @click="preview">预 览</el-button> -->
    <el-button size="small" @click="close">关 闭</el-button>
  </div>  
	<!-- 新增/修改页面 -->
	<info-preview :dataForm="infoForm" :visible.sync="previewVisible"></info-preview>

</el-dialog>
</template>
<script>
import { getQuestionById, } from '@/server/examination-module';
import infoPreview from './question-info-preview'
export default {
  components: {infoPreview},
  props: ['visible','dataForm'],
  data() {
    return {
      id:null,
      infoForm: {},
      previewVisible:false,
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.id=this.dataForm.id
        if (this.id) {
          this._getQuestionById();
          
        }
      }
    },
  },
  methods: {
    _getQuestionById() {
      getQuestionById(this.id).then(result => {
        this.infoForm=result;
        this.$set(this.infoForm,'questionTypeName',this.dataForm.questionTypeName)
      })
    },
    preview() {
      this.previewVisible=true;
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
</style>


