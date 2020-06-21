<template>
  <el-dialog
    v-if="visible"
    append-to-body
    :visible="visible"
    width="80%"
    top="5px"
    :before-close="handleClose"
  >
    <span slot="title">{{dataForm.examinationPaperName}}考卷</span>
    <el-row :gutter="10">
      <!-- 试卷 -->
      <el-col :xs="24" :sm="14" :md="16" :lg="18" :xl="19">
        <div class="grid-content bg-purple" id="printCompletion">
          <!-- 标题|基本信息 -->
          <div class="paperHeader">
            <div class="paprt-info t-margin-auto">
              <p class="t-font-normal">
                <!-- <span class="t-font-btm-border t-text-center">{{paperBasicInfo.AcademicYearName}}</span>
                <span class="t-margin-right">学年</span>-->
                <span class="t-font-btm-border t-text-center">第 {{paperBasicInfo.SemesterName}}</span>
                <span>学期</span>
              </p>
              <p class="t-font-strong">
                <span class="t-font-btm-border t-text-center">{{paperBasicInfo.CourseName}}</span>
                <span class="t-margin-right">课程</span>
                <span
                  class="t-font-btm-border t-text-center"
                >{{paperBasicInfo.ExaminationPaperName}}</span>
                <span class="t-margin-right">试卷</span>
                <span>考试得分</span>
                <span class="t-font-btm-border t-text-center t-margin-right">{{paperInfo.Score}}</span>
              </p>
              <p class="t-font-normal">
                <span>考试时间： {{paperBasicInfo.examinationDuration}} 分钟</span>
                {{new Date(paperBasicInfo.ExamStartTime).toLocaleString()}} ~ {{new Date(paperBasicInfo.ExamEndTime).toLocaleString()}}
              </p>
              <p class="t-font-normal">
                <span>准考证号</span>
                <span
                  class="t-font-btm-border t-text-center t-margin-right"
                >{{paperBasicInfo.CandidateNo}}</span>
                <span>身份证号</span>
                <span
                  class="t-font-btm-border t-text-center t-margin-right"
                >{{paperBasicInfo.IdCard}}</span>
                <span>姓名</span>
                <span class="t-font-btm-border t-text-center">{{paperBasicInfo.StudentName}}</span>
              </p>
              <p class="t-font-normal">
                <span>班级</span>
                <span
                  class="t-font-btm-border t-text-center t-margin-right"
                >{{paperBasicInfo.ClassName}}</span>
                <span>教室</span>
                <span
                  class="t-font-btm-border t-text-center t-margin-right"
                >{{paperBasicInfo.SiteName}}</span>
                <span>座位号</span>
                <span
                  class="t-font-btm-border t-text-center t-margin-right"
                >{{paperBasicInfo.ExaminationRoomNo}}</span>
              </p>
              <div
                class="t-font-normal t-padding-bottom t-padding-top"
                style="background-color:#e2eff9;"
              >
                <span>
                  答对
                  <strong>{{correctAnsCount}}</strong> 题
                </span>
                <span>
                  答错
                  <strong>{{errorAnsCount}}</strong> 题
                </span>
                <span>
                  正确率
                  <strong>{{parseInt(paperInfo.ExamCorrectRate)}}%</strong>
                </span>
              </div>
              <div class="t-font-normal">
                <!-- <div class="ExamCorrectRateName">正确率</div>-->
                <el-progress
                  type="circle"
                  :percentage="paperInfo.ExamCorrectRate"
                  show-text
                  :format="format"
                ></el-progress>
              </div>
              <!-- 题目分数合计 -->
              <el-table
                class="t-table-list"
                ref="multipleTable"
                border
                size="small"
                :data="scoreCount"
                tooltip-effect="dark"
                style="width: 100%;max-width:1000px;margin-top:10px;"
              >
                <el-table-column prop="indexName" label="题号"></el-table-column>
                <el-table-column
                  v-for="(item, i) of questionTypeList"
                  :key="i"
                  :label="item.label"
                  :prop="item.name"
                ></el-table-column>
                <el-table-column prop="totalScore" label="总分"></el-table-column>
              </el-table>
            </div>
          </div>
          <!-- 试卷内容：题目 -->
          <el-row v-for="(item, i) of tableData" :key="i">
            <el-col>
              <h4 class="big-title">
                {{generateNum(i+1)}}、{{item.label}}
                <span
                  style="font-size:14px;"
                >（ 共 {{item.children.length}} 题{{item.children && item.children.length>0?'，每题 '+item.children[0].Score+' 分': ''}}）</span>
              </h4>
            </el-col>
            <el-col v-for="(sub, j) of item.children" :key="j">
              <a class="t-mao" :name="`${item.label}_${sub.QuestionId}`">
                <div class="question-title">
                  {{j+1}}、
                  <div class="t-editorContent" v-html="decodeURI(sub.Title)"></div>
                </div>
              </a>
              <!-- 单选题型 | 判断题 -->
              <el-radio-group
                v-model="sub.checkValue"
                v-if="item.name=='SingleChoice' || item.name=='TrueFalse'"
                disabled
              >
                <el-radio
                  :label="aws.QuestionSubjectOptionId"
                  v-for="(aws, a) of sub.ExamPaperQuestionOptionsRequests"
                  :key="a"
                >
                  <div style="display:flex;">
                    <span style="margin-left:1rem;margin-right: 0.4rem;">{{aws.OptionNumber}}.</span>
                    <span class="t-editorContent" v-html="decodeURI(aws.OptionContent)"></span>
                  </div>
                </el-radio>
              </el-radio-group>
              <!-- 多选题型 | 判断题 -->
              <el-checkbox-group
                v-model="sub.checkedList"
                v-if="item.name=='MultipleChoice'"
                disabled
              >
                <el-checkbox
                  :label="aws.QuestionSubjectOptionId"
                  v-for="(aws, a) of sub.ExamPaperQuestionOptionsRequests"
                  :key="a"
                >
                  <div style="display:flex;">
                    <span
                      style="margin-left:1rem;margin-right: 0.4rem;line-height:1.6;"
                    >{{aws.OptionNumber}}.</span>
                    <span class="t-editorContent" v-html="decodeURI(aws.OptionContent)"></span>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
              <!-- 填空题 -->
              <!-- 解答题 -->
              <!-- 阅读题 -->
              <!-- 解析 -->
              <div class="question-title question-analysis">
                <strong style="color:#0048ff;">答案：【 {{sub.correctAns}} 】</strong>
                <strong
                  :style="`color:${sub.judgeAnswer=='回答正确'?'#0a0': '#f00'};`"
                >{{sub.judgeAnswer}}</strong>
              </div>
              <div
                class="question-title question-analysis"
                v-if="sub.AnswerAnalysis && sub.AnswerAnalysis!='undefined'"
              >
                <strong style="min-width:50px;">分析：</strong>
                <div
                  class="t-editorContent"
                  v-html="sub.AnswerAnalysis=='undefined'?'':decodeURI(sub.AnswerAnalysis)"
                ></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!-- 答题卡 -->
      <el-col :xs="24" :sm="10" :md="8" :lg="6" :xl="5">
        <div class="grid-content grid-answerCard bg-purple-light">
          <!-- 答题卡 -->
          <div class="answerCard">
            <div class="answerCard-contain">
              <div class="sheetTitle sheet-padding">答题卡</div>
              <div class="sheet-padding" style="font-size:13px;">
                <p>
                  <strong
                    style="color:#00a;"
                  >正确率 {{parseInt(paperInfo.ExamCorrectRate)}}%</strong>
                  <span>
                    <i class="answered"></i>
                    答对 {{correctAnsCount}} 题
                  </span>
                  <span>
                    <i class="unanswered"></i>
                    答错 {{errorAnsCount}} 题
                  </span>
                </p>
                <!-- 题号 -->
                <el-row v-for="(item, i) of tableData" :key="i">
                  <el-col>
                    <p>
                      <strong>{{i+1}}、{{item.label}}</strong>
                    </p>
                    <div>
                      <span v-for="(sub, j) of item.children" :key="j">
                        <!-- <span class="question-number" v-if="!sub.checkValue && sub.checkedList.length== 0" style="background-color:#fff;">
                        <a class="t-mao" style="color:#333;" :href="`#${item.label}_${sub.QuestionId}`">{{j+1}}</a>
                        </span>-->
                        <span
                          class="question-number"
                          :style="`background-color:${sub.judgeAnswer=='回答正确'?'#0a0': '#f00'};`"
                        >
                          <a
                            class="t-mao"
                            style="color:#fff;"
                            :href="`#${item.label}_${sub.QuestionId}`"
                          >{{j+1}}</a>
                        </span>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  props: ['dataForm', 'visible'],
  components: {},
  data () {
    return {
      height: 400,
      width: '',
      direction: 'rtl',
      tel: '', // 学员手机号
      // ----------试卷头部
      paperBasicInfo: '',
      desc: '', // 评语
      paperResult: '', // 试卷内容
      // ----------题目分数合计
      scoreCount: [
        {
          indexName: '分数',
          SingleChoice: 0,
          MultipleChoice: 0,
          TrueFalse: 0,
          BlankFill: 0,
          ShortAnswer: 0,
          Read: 0,
          totalScore: 0
        },
        {
          indexName: '得分',
          SingleChoice: 0,
          MultipleChoice: 0,
          TrueFalse: 0,
          BlankFill: 0,
          ShortAnswer: 0,
          Read: 0,
          totalScore: 0
        },
        {
          indexName: '阅卷人',
          SingleChoice: '',
          MultipleChoice: '',
          TrueFalse: '',
          BlankFill: '',
          ShortAnswer: '',
          Read: ''
        }
      ],
      questionTypeList: [
        { name: 'SingleChoice', label: '单选题' },
        { name: 'MultipleChoice', label: '多选题' },
        { name: 'TrueFalse', label: '判断题' }
        // {name: 'BlankFill', label: '填空题'},
        // {name: 'ShortAnswer', label: '解答题'},
        // {name: 'Read', label: '阅读题'}
      ],
      // ----------题目
      tableData: [],
      correctAnsCount: 0, // 答对题数
      errorAnsCount: 0, // 答错题数
      // -----试卷信息
      paperInfo: {}
    };
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.height = document.body.clientHeight
        this.width = document.body.clientWidth
        this.tel = sessionStorage.getItem('tel')
        // 获取试卷详细信息
        this.initialData()
      }
    }
  },
  methods: {
    /* -----------------------------------查询----------------------------------- */
    // 获取考卷信息
    initialData () {
      this.scoreCount = [
        {
          indexName: '分数',
          SingleChoice: 0,
          MultipleChoice: 0,
          TrueFalse: 0,
          BlankFill: 0,
          ShortAnswer: 0,
          Read: 0,
          TotalScore: 0
        },
        {
          indexName: '得分',
          SingleChoice: 0,
          MultipleChoice: 0,
          TrueFalse: 0,
          BlankFill: 0,
          ShortAnswer: 0,
          Read: 0,
          TotalScore: 0
        },
        {
          indexName: '阅卷人',
          SingleChoice: '',
          MultipleChoice: '',
          TrueFalse: '',
          BlankFill: '',
          ShortAnswer: '',
          Read: ''
        }
      ]
      this.correctAnsCount = 0
      this.errorAnsCount = 0
      this.paperResult = this.dataForm
      this.paperInfo = JSON.parse(this.dataForm.examPaperContent)
      this.paperBasicInfo = this.paperInfo.ExamPaperHeader
      this.tableData = []
      this.questionTypeList.forEach(item => {
        let obj = Object.assign({}, item, { children: [] })
        this.scoreCount[0][item.name] = 0 // 分数合计
        this.scoreCount[1][item.name] = 0 // 得分合计
        this.paperInfo.ExamPaperRequest.forEach(el => {
          if (item.label === el.QuestionTypeName) {
            this.scoreCount[0][item.name] += el.Score // 计算每种题型的合计分数
            let checkedList = []
            let checkedListLetter = []
            let correctAns = ''
            el.CorrectAnswerLetter = []
            el.ExamPaperQuestionOptionsRequests.forEach(ops => {
              if (ops.FlagChecked === true) {
                checkedList.push(ops.QuestionSubjectOptionId) // 选择的答案id集合
                checkedListLetter.push(ops.OptionNumber) // 选择的答案选项集合
              }
              if (
                el.CorrectAnswerId.indexOf(ops.QuestionSubjectOptionId) !==
                -1
              ) {
                correctAns += ops.OptionNumber + ' '
                el.CorrectAnswerLetter.push(ops.OptionNumber) // 选择的答案选项集合
              }
            })
            checkedList = checkedList.sort((a, b) => a - b) // 选择的答案id集合
            checkedListLetter = checkedListLetter.sort((a, b) => a - b) // 选择的答案选项集合
            let correctAnswerLetter = el.CorrectAnswerLetter.sort((a, b) => a - b) // 正确答案的选项集合
            if (
              checkedListLetter.length > 0 &&
              JSON.stringify(checkedListLetter) ===
              JSON.stringify(correctAnswerLetter)
            ) {
              el.judgeAnswer = '回答正确'
              this.correctAnsCount++
              this.scoreCount[1][item.name] += el.Score // 计算每种题型的合计分数
            } else {
              el.judgeAnswer = '回答错误'
              this.errorAnsCount++
            }
            if (item.name === 'SingleChoice' || item.name === 'TrueFalse') {
              el.checkValue = Number(checkedList.join(','))
            }
            el.checkValue = checkedList.join(',')
            el.checkedList = checkedList
            el.correctAns = correctAns
            obj.children.push(el)
          }
        })
        this.tableData.push(obj)
      })
      // 截取数据，计算试卷总分
      let scoreArr = Object.values(this.scoreCount[0]).slice(1, -1)
      this.scoreCount[0].totalScore = scoreArr.reduce((a, b) => a + b)
      this.scoreCount[1].totalScore = Object.values(this.scoreCount[1])
        .slice(1, -1)
        .reduce((a, b) => a + b)
    },
    /* -----------------------------------操作----------------------------------- */
    generateNum (num) {
      let chNum = ''
      switch (num) {
        case 1:
          chNum = '一'
          break
        case 2:
          chNum = '二'
          break
        case 3:
          chNum = '三'
          break
        case 4:
          chNum = '四'
          break
        case 5:
          chNum = '五'
          break
        case 6:
          chNum = '六'
          break
        default:
          chNum = '无'
      }
      return chNum
    },
    format (percentage) {
      console.log(percentage)
      return `正确率 ${parseInt(percentage)}%`
    },
    handleClose (done) {
      // 抽屉关闭
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog {
  max-height: 99vh;
  height: 99vh;
  margin: 0 0 0 auto;
}
/deep/.el-drawer__body {
  overflow: scroll;
}
/deep/.el-form .el-form-item {
  max-width: 100%;
  margin-right: 20px;
}
.paperHeader {
  display: block;
  text-align: center;
  .paprt-info {
    width: 100%;
  }
  .ExamCorrectRateName {
    color: #0a0;
    margin: 8px 0;
  }
}
// 答题卡
.grid-answerCard {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .answerCard {
    width: 300px;
    position: fixed;
    top: 30%;
    right: 1px;
    background-color: #fff;
    .answerCard-contain {
      width: 100%;
      border: 1px solid #999;
    }
    .sheet-padding {
      padding: 0 10px;
    }
    .sheetTitle {
      height: 50px;
      line-height: 50px;
      background-color: #3a8ee6;
      color: #fff;
      font-size: 15px;
      span {
        font-size: 1rem;
        font-weight: 600;
      }
    }
    .answered,
    .unanswered {
      margin-left: 15px;
      margin-right: 5px;
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 1px solid #ddd;
      position: relative;
      top: 2px;
      border-radius: 4px;
      background-color: #0a0
    }
    .unanswered {
      background-color: #f00
    }
    .question-number {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 4px;
    }
  }
}
@media screen and (max-width: 768px) {
  .grid-answerCard {
    display: none;
  }
  .answerCard{
    display: none;
  }
}
// 题目->选项样式
/deep/.el-radio-group {
  width: 100%;
}
/deep/.el-radio,
/deep/.el-checkbox {
  display: block;
  padding: 0.8rem 0;
  border-bottom: 1px dashed #ddd;
}
/deep/.el-radio {
  display: flex;
}
/deep/.el-radio + .el-radio,
/deep/.el-checkbox + .el-checkbox {
  margin-left: 0;
}
/deep/.el-radio__label,
/deep/.el-checkbox__label {
  clear: both;
  span {
    color: #333;
    font-size: 12px;
    line-height:20px;
  }
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: #0a0;
  background-color: #0a0;
}
// 题目->题干样式
.question-title {
  display: flex;
  font-size: 14px;
  margin-top: 1rem;
  font-weight: 600;
  background: #eef5fb;
  padding: 10px;
}
.big-title {
  margin: 0;
  margin-top: 10px;
  padding: 20px 10px;
  background: #f5f5f5;
}
// 锚点
.t-mao {
  text-decoration: none;
  color: #333;
}
// 答案和分析
.question-analysis {
  background: #fff;
  font-weight: normal;
  padding: 0;
  margin-top: 8px;
}
</style>
