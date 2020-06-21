<template>
<div>
	<el-card :style="style">     
    <div class="t-header-title">
      <span>题目信息</span>
    </div>
    <el-form class="t-operate-filter basic-info" :model="infoForm" size="small" label-width="100px">
      <el-form-item>
        <div>（{{infoForm.questionTypeName}}， {{infoForm.difficultyLevelName}}）</div>
      </el-form-item>
      <el-form-item label="题目">
        <div class="t-bgcolor-grey t-editorContent" v-html="decodeURI(infoForm.title)"></div>
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
            <div class="t-bgcolor-grey t-editorContent" :title="infoForm.knowledgePointWithQuestionName">{{infoForm.knowledgePointWithQuestionName}}</div>
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
    <div class="t-batch-operate">
      <!-- <el-button type="primary" size="small" @click="preview">预 览</el-button> -->
      <el-button size="small" @click="close">返 回</el-button>
    </div>
	</el-card>    
	<!-- 新增/修改页面 -->
	<info-preview :dataForm="infoForm" :visible.sync="previewVisible"></info-preview>
</div>
</template>
<script>
import { getQuestionById, } from '@/server/examination-module';
import infoPreview from './question-info-preview'
export default {
  data() {
    return {
      style: '',
      id: '',
      infoForm: {},
      tableData: [],
      previewVisible:false,
    }
  },
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.id=this.$route.query.id;
    if (this.id) {
      this._getQuestionById();
      
    }
  },
  components: {infoPreview},
  methods: {
    _getQuestionById() {
      getQuestionById(this.id).then(result => {
        this.infoForm=result;
      })
    },
    preview() {
      this.previewVisible=true;
    },
    close () {
      this.$router.go(-1);
    },
  }
}
</script>
<style lang="less" scoped>
.basic-info{
  /deep/.el-form-item {
      max-width: 800px;
  }
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner{    
  border-color: #0a0;
  background-color: #0a0;
}

</style>