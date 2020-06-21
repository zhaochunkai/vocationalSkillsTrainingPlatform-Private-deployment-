<template>
<!-- <el-drawer v-if="visible" :visible.sync="visible" :direction="direction" size="80%" @close="close"> -->
<el-drawer v-if="visible" :visible="visible" :direction="direction" size="80%" @close="close">
  <span slot="title">{{dataForm.examinationPaperName}}</span>  
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <!-- 基本信息 -->
    <el-tab-pane label="基本信息" name="basicInfo">  
      <el-form class="t-form-block" ref="form" :model="dataForm" label-width="84px" size="small">   
        <el-form-item label="试卷名称" prop="examinationPaperName">
          <el-input v-model="dataForm.examinationPaperName" disabled></el-input>
        </el-form-item>
        <el-form-item label="组卷策略" prop="constructionExaminationWayName">
          <el-input v-model="dataForm.constructionExaminationWayName" disabled></el-input>
        </el-form-item>
        <el-form-item label="考试课程" prop="courseName">
          <el-input v-model="dataForm.courseName" disabled></el-input>
        </el-form-item> 
        <el-form-item label="考试时长" prop="examinationPaperTime">
          <el-input v-model="dataForm.examinationPaperTime" disabled>
            <el-button slot="append">分钟</el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!-- 试卷 -->
    <el-tab-pane label="试卷" name="paper">
      <!-- 题目分数合计 -->
      <el-table class="t-table-list" ref="multipleTable" border size="small" :data="scoreCount" tooltip-effect="dark" style="width: 100%;">
        <el-table-column prop="indexName" label="题号"></el-table-column>
        <el-table-column v-for="(item,i) of questionTypeList" :key="i" :label="`${item.label}${item.children && item.children.length>0?'（共'+item.children.length+'题，每题'+item.children[0].score+'分）': ''}`" :prop="item.name"></el-table-column>
        <el-table-column prop="totalScore" label="总分"></el-table-column>
      </el-table>   
      <!-- 试卷内容：题目 -->
      <el-row v-for="(item,i) of tableData" :key="i">
        <el-col>
          <h4 class="big-title">{{generateNum(i+1)}}、{{item.label}}
            <span style="font-size:14px;">（ 共 {{item.children.length}} 题{{item.children && item.children.length>0?'，每题 '+item.children[0].score+' 分': ''}}）</span>
          </h4>
        </el-col>
        <el-col v-for="(sub,j) of item.children" :key="j">
          <div class="question-title">
            {{j+1}}、<div class="t-editorContent" v-html="decodeURI(sub.title)"></div>
          </div>          
          <!-- 单选题型 | 判断题 -->
          <el-radio-group v-model="sub.checkValue" v-if="item.name=='SingleChoice' || item.name=='TrueFalse'">
            <el-radio :label="aws.optionNumber" v-for="(aws,a) of sub.examPaperQuestionOptionsResponse" :key="a">   
              <div style="display:flex;"> 
                <span style="margin-left:1rem;margin-right:0.4rem;">{{aws.optionNumber}}. </span> 
                <span class="t-editorContent" v-html="decodeURI(aws.optionContent)"></span>
              </div>
            </el-radio>
          </el-radio-group>
          <!-- 多选题型 | 判断题 -->
          <el-checkbox-group v-model="sub.checkedList" v-if="item.name=='MultipleChoice'">
            <el-checkbox :label="aws.optionNumber" v-for="(aws,a) of sub.examPaperQuestionOptionsResponse" :key="a">          
              <div style="display:flex;"> 
                <span style="margin-left:1rem;margin-right:0.4rem;line-height:1.6;">{{aws.optionNumber}}. </span> 
                <span class="t-editorContent" v-html="decodeURI(aws.optionContent)"></span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
          <!-- 填空题 -->
          <!-- 解答题 -->
          <!-- 阅读题 -->

        </el-col>
      </el-row>
    </el-tab-pane>    
  </el-tabs>
</el-drawer>
</template>
<script>
import { getExaminationPaperById } from '@/server/examination-module';
export default {
  props: ['dataForm', 'visible','title'],
  components: {},
  data () {
    return {
      values: [],
      height:400,
      direction: 'rtl',
      // ----------试卷头部
      desc: '', // 评语
      // ----------题目分数合计
      scoreCount: [
        {indexName: '分数',SingleChoice:0,MultipleChoice:0,TrueFalse:0,BlankFill:0,ShortAnswer:0,Read:0,totalScore:0},
        {indexName: '阅卷人',SingleChoice: '',MultipleChoice: '',TrueFalse: '',BlankFill: '',ShortAnswer: '',Read: ''},
      ],
      questionTypeList: [
        {name: 'SingleChoice',label: '单选题'},
        {name: 'MultipleChoice',label: '多选题'},
        {name: 'TrueFalse',label: '判断题'},
        // {name: 'BlankFill',label: '填空题'},
        // {name: 'ShortAnswer',label: '解答题'},
        // {name: 'Read',label: '阅读题'}
      ],
      // ----------试卷内容----
      tableData: [],
      // ----
      activeName: 'basicInfo',
      
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName='paper'
        this.height=document.body.clientHeight;  
        this.initialData();
      }
    },
  },
  methods: {      
    /* -------------------------------------------查询----------------------------------- */
    // 获取考卷信息
    initialData() {
      this.scoreCount=[
        {indexName: '分数',SingleChoice:0,MultipleChoice:0,TrueFalse:0,BlankFill:0,ShortAnswer:0,Read:0,totalScore:0},
        {indexName: '阅卷人',SingleChoice: '',MultipleChoice: '',TrueFalse: '',BlankFill: '',ShortAnswer: '',Read: ''},
      ];
      this.questionTypeList = [
        {name: 'SingleChoice',label: '单选题'},
        {name: 'MultipleChoice',label: '多选题'},
        {name: 'TrueFalse',label: '判断题'},
        // {name: 'BlankFill',label: '填空题'},
        // {name: 'ShortAnswer',label: '解答题'},
        // {name: 'Read',label: '阅读题'}
      ]
      this.tableData= []
      getExaminationPaperById(this.dataForm.id).then(res => {
        this.questionTypeList.forEach(item => {
          item.children = []
          let obj=Object.assign({},item,{
            children: []
          }) 
          res.forEach(el => {
            if (item.name==el.questionType) {
              this.scoreCount[0][item.name]+=el.score;  // 计算每种题型的合计分数
              let que=Object.assign({},el,{
                checkedList: [],
                checkValue: ''
              })
              obj.children.push(que); 
              item.children.push(que); 
            }
          })
          this.tableData.push(obj);
        })
        // 截取数据，计算试卷总分
        let scoreArr=Object.values(this.scoreCount[0]).slice(1,-1); 
        this.scoreCount[0].totalScore = scoreArr.reduce((a,b)=>a+b);
      }).catch(err => { 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      }) 
    },
    /* -------------------------------------------操作----------------------------------- */
    generateNum (num) {
      let chNum = ''
      switch (num) {
        case 1:
          chNum = '一'
          break;
        case 2:
          chNum = '二'
          break;
        case 3:
          chNum = '三'
          break;
        case 4:
          chNum = '四'
          break;
        case 5:
          chNum = '五'
          break;
        case 6:
          chNum = '六'
          break;
        default:
          chNum = '无'
      }
      return chNum
    },
    handleClick(tab, event) { },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog{
  max-height: 90vh;
  height:90vh;
}
/deep/.el-drawer__body{
  margin:0 1rem;
  overflow: scroll;
}
// 选项样式
/deep/.el-radio-group{
  width: 100%;
}
/deep/.el-radio,
/deep/.el-checkbox{
  display:block;
  padding:0.8rem 0;
  border-bottom: 1px dashed #ddd;
}
/deep/.el-radio{
  display: flex;
}
/deep/.el-radio+.el-radio ,
/deep/.el-checkbox+.el-checkbox {
  margin-left: 0;
}
/deep/.el-radio__label,
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
// 题目、题干样式
.question-title{
  display:flex;
  font-size:14px;
  margin-top:1rem;
  font-weight: 600;
  background: #eef5fb;
  padding: 10px;
}
.big-title{
  margin:0;
  padding: 20px 10px;
  background: #f5f5f5;
}
</style>
