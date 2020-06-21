<template>
<el-drawer v-if="visible" :visible="visible" :direction="direction" size="80%" :before-close="handleClose">
  <span slot="title">{{dataForm.examName}}</span>
  <el-row type="flex" :gutter="30">
    <!-- 试卷 -->
    <el-col>
      <!-- 标题|基本信息 -->
      <div class="paperHeader">
        <div>
          <p class="t-font-normal">
            <span class="t-font-btm-border t-text-center t-margin-right">2018─2019</span>
            <span>学年 第</span>
            <span class="t-font-btm-border t-text-center t-margin-right">{{dataForm.academicYearWithSemester}}</span>
            <span>学期</span>
          </p>
          <p class="t-font-strong">
            <span class="t-font-btm-border t-text-center t-margin-right">{{dataForm.courseName}}</span>
            <span>课程试卷</span>
            <span>得分</span>
            <span class="t-font-btm-border t-text-center t-margin-right"> </span>
          </p>
          <p class="t-font-normal">
            <!-- <span class="t-margin-right">考试日期： {{dataForm.examinationBeginTime?new Date(dataForm.examinationBeginTime).toLocaleString(): ''}} ~
              {{dataForm.examinationEndTime?new Date(dataForm.examinationEndTime).toLocaleString(): ''}}</span> -->
            <span>考试时间： {{parseInt(this.examSeconds/60)}} 分钟</span>
          </p>
          <p class="t-font-normal">
            <span>培训项目</span>
            <span class="t-font-btm-border t-text-center t-margin-right">{{dataForm.trainingProgramName}}</span>
            <span>班级</span>
            <span class="t-font-btm-border t-text-center t-margin-right">{{dataForm.className}}</span>
            <span>准考证号</span>
            <span class="t-font-btm-border t-text-center t-margin-right">{{dataForm.trainingProgramName}}</span>
            <span>身份证号</span>
            <span class="t-font-btm-border t-text-center t-margin-right">{{dataForm.trainingProgramName}}</span>
            <span>姓名</span>
            <span class="t-font-btm-border t-text-center t-margin-right">{{dataForm.trainingProgramName}}</span>
          </p>
          <!-- 考场注意事项 -->
          <div class="t-font-normal">
            <el-form ref="form" label-width="100px">
              <el-form-item label="考场注意事项">
                <el-input type="textarea" v-model="dataForm.remark" :autosize="{ minRows: 1, maxRows: 20}" show-word-limit maxlength="500" disabled=""></el-input>
              </el-form-item>
            </el-form>
          </div>      
        </div>
      </div>
      <!-- 题目分数合计 -->
      <el-table class="t-table-list" ref="multipleTable" border size="small" :data="scoreCount" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
        <el-table-column prop="indexName" label="题号"></el-table-column>
        <el-table-column v-for="(item,i) of questionTypeList" :key="i" :label="item.label" :prop="item.name"></el-table-column>
        <el-table-column prop="totalScore" label="总分"></el-table-column>
      </el-table>	
      <!-- 试卷内容：题目 -->
      <el-row v-for="(item,i) of tableData" :key="i">
        <el-col>
          <h4 class="big-title">{{i+1}}、{{item.label}}
            <span style="font-size:14px;">（ 共 {{item.children.length}} 题 ）</span>
          </h4>
        </el-col>
        <el-col v-for="(sub,j) of item.children" :key="j">
          <a class="t-mao" :name="`${item.label}_${sub.questionId}`">
            <div class="question-title">
              {{j+1}}、<div class="t-editorContent" v-html="decodeURI(sub.Title)"></div>
           </div>      
          </a>    
          <!-- 单选题型 | 判断题 -->
          <el-radio-group v-model="sub.checkValue" v-if="item.name=='SingleChoice' || item.name=='TrueFalse'" disabled>
            <el-radio :label="aws.QuestionSubjectOptionId" v-for="(aws,a) of sub.ExamPaperQuestionOptionsRequests" :key="a">   
              <div style="display:flex;"> 
                <span style="margin-left:1rem;margin-right:0.4rem;">{{aws.OptionNumber}}. </span> 
                <span class="t-editorContent" v-html="decodeURI(aws.OptionContent)"></span>
              </div>
            </el-radio>
          </el-radio-group>
          <!-- 多选题型 | 判断题 -->
          <el-checkbox-group v-model="sub.checkedList" v-if="item.name=='MultipleChoice'" disabled>
            <el-checkbox :label="aws.QuestionSubjectOptionId" v-for="(aws,a) of sub.ExamPaperQuestionOptionsRequests" :key="a">          
              <div style="display:flex;"> 
                <span style="margin-left:1rem;margin-right:0.4rem;line-height:1.6;">{{aws.OptionNumber}}. </span> 
                <span class="t-editorContent" v-html="decodeURI(aws.OptionContent)"></span>
              </div>
            </el-checkbox>
          </el-checkbox-group>
          <!-- 填空题 -->
          <!-- 解答题 -->
          <!-- 阅读题 -->
          <!-- 解析 -->
          <div class="question-title question-analysis">
            <strong style="color:#0a0;">答案：【 {{sub.correctAns}} 】</strong> 
          </div>  
          <div class="question-title question-analysis" v-if="sub.AnswerAnalysis && sub.AnswerAnalysis!='undefined'">
            <strong>分析：</strong>             
            <div class="t-editorContent" v-html="sub.AnswerAnalysis=='undefined'?'':decodeURI(sub.AnswerAnalysis)"></div>
          </div>  
        </el-col>
      </el-row>
    </el-col>
    <!-- 答题卡 -->
    <el-col style="width:300px;">
      <div class="answerCard">
        <div class="answerCard-contain">
          <div class="sheetTitle sheet-padding">答题卡</div>
          <div class="sheet-padding" style="font-size:13px;">
            <p>
              <strong>答题卡：</strong> 
              <span><i class="answered"></i> 已回答</span>
              <span><i class="unanswered"></i> 未回答</span>
            </p>
            <!-- 题号 -->
            <el-row v-for="(item,i) of tableData" :key="i">
              <el-col>                
                <p><strong>{{i+1}}、{{item.label}}</strong></p>
                <div>
                  <span class="question-number" v-for="(sub,j) of item.children" :key="j" :style="sub.checkValue || sub.checkedList.length>0?'background-color:#00d609;color:#fff': ''">
                    <a class="t-mao" :href="`#${item.label}_${sub.questionId}`">{{j+1}}</a>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</el-drawer>
</template>
<script>
export default {
  props: ['dataForm', 'visible',],
  components: {},
  data () {
    return {
      height:400,
      direction: 'rtl',
      tel: '', // 学员手机号
      // ----------试卷头部
      desc: '', // 评语
      // ----------题目分数合计
      scoreCount: [
        {indexName: '得分', SingleChoice: 0, MultipleChoice: 0, TrueFalse: 0, BlankFill: 0, ShortAnswer: 0, Read: 0, totalScore: 0},
        {indexName: '阅卷人', SingleChoice: '', MultipleChoice: '', TrueFalse: '', BlankFill: '', ShortAnswer: '', Read: ''}
      ],
      questionTypeList: [
        {name: 'SingleChoice', label: '单选题'},
        {name: 'MultipleChoice', label: '多选题'},
        {name: 'TrueFalse', label: '判断题'}
        // {name: 'BlankFill', label: '填空题'},
        // {name: 'ShortAnswer', label: '解答题'},
        // {name: 'Read', label: '阅读题'}
      ],
      // ----------题目
      tableData: [],
      // -----试卷信息
      paperInfo: {},
      examSeconds: 0, // 考试时长（单位秒）
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.height = document.body.clientHeight
        if (this.dataForm.examPaperContent) { // 获取试卷详细信息
          this.paperInfo = JSON.parse(this.dataForm.examPaperContent)
          this.initialData()
        }
      }
    }
  },
  methods: {
    /* -----------------------------------查询----------------------------------- */
    // 获取考卷信息
    initialData () {
      this.scoreCount = [
        {indexName: '得分', SingleChoice: 0, MultipleChoice: 0, TrueFalse: 0, BlankFill: 0, ShortAnswer: 0, Read: 0, totalScore:0},
        {indexName: '阅卷人', SingleChoice: '', MultipleChoice: '', TrueFalse: '', BlankFill: '', ShortAnswer: '', Read: ''},
      ]
      this.tableData = []
      this.questionTypeList.forEach(item => {
        let obj = Object.assign({}, item, {
          children: []
        })
        this.paperInfo.forEach(el => {
        //   // if (item.name==el.questionType) {
          if (item.label==el.QuestionTypeName) {
            this.scoreCount[0][item.name]+=el.score;  // 计算每种题型的合计分数
            
            let checkValue=''
            let checkedList=[]
            let correctAns='';
            el.ExamPaperQuestionOptionsRequests.forEach(ops=> {
              if (ops.FlagChecked==true) {
                if (item.name=='SingleChoice' || item.name=='TrueFalse') {
                  checkValue=ops.QuestionSubjectOptionId
                }else if (item.name=='MultipleChoice') {
                  checkedList.push(ops.QuestionSubjectOptionId)
                }
                correctAns+=ops.OptionNumber+' '
              }
            })
            el.checkedList=checkedList
            el.checkValue=checkValue
            el.correctAns=correctAns
            
          }
          obj.children.push(el)
        })
        this.tableData.push(obj);
      })
      // 截取数据，计算试卷总分
      let scoreArr=Object.values(this.scoreCount[0]).slice(1,-1); 
      this.scoreCount[0].totalScore = scoreArr.reduce((a,b)=>a+b);
    },
    /* -----------------------------------操作----------------------------------- */
    handleClose(done) { // 抽屉关闭    
      this.$emit('update:visible', false)
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
  margin:0 20px;
  overflow: scroll;
}
.paperHeader{  
  display: flex;
  justify-content: space-between;
  text-align:center;
}
/deep/.el-form .el-form-item{
  max-width: 100%;
  margin-right:20px;
}
// 答题卡
.answerCard{
  width:300px;
  .answerCard-contain{
    width:300px;
    border: 1px solid #999;
    position: fixed;
    top:100px;
    right:1px;
  }
  .sheet-padding{
    padding:0 10px;
  }
  .sheetTitle{
    height:50px;
    line-height:50px;
    background-color: #f59a24;
    color:#fff;
    strong{
      font-size:1.2rem;
    }
  }
  .answered,.unanswered{
    margin-left:15px;
    margin-right:5px;
    display: inline-block;
    width:14px;height:14px;
    border:1px solid #eee;
    position: relative;
    top:2px;
    border-radius: 4px;
  }
  .unanswered{
    background-color: rgb(157, 250, 161);
    border-color: rgb(157, 250, 161);
  }  
  .question-number{
    display: inline-block;
    width:16px;
    height:16px;
    line-height:16px;
    text-align: center;
    border:1px solid #ddd;
    border-radius: 4px;
    margin:4px;
  }  
}
// 题目->选项样式
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
// 题目->题干样式
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
// 锚点
.t-mao{
  text-decoration: none;
  color:#333;
}
// 答案和分析
.question-analysis{
  background:#fff;
  font-weight:normal;
  padding:0;
  margin-top:8px;
}
</style>
