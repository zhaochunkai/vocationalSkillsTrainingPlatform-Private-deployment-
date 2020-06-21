<template>
<el-dialog class="t-dialog" v-if="visible" title="手工组卷" :visible="visible" :close-on-click-modal="false" width="70%" @close="close" >
  <!-- 手工组卷 -->  
  <div class="t-header-title">
    <span>基本信息</span>
  </div>   
  <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">   
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="所属题库" prop="examinationQuestionName">
          <el-input v-model="form.examinationQuestionName" disabled></el-input>
        </el-form-item>
        <el-form-item label="试卷名称" prop="examinationPaperName">
          <el-input type="text" v-model="form.examinationPaperName" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="总分" prop="grossScore">
          <el-input v-model.number="form.grossScore" type="number" min="1" @input="change($event)">
            <el-button slot="append">分</el-button>
          </el-input>
        </el-form-item>
      </el-col>  
      <el-col :span="12"> 
        <el-form-item label="学习项目" prop="trainingProgramsId">
          <el-select v-model="trainingProgramsId" filterable clearable placeholder="请选择学习项目">
            <el-option v-for="(item,i) of programs" :key="i" :label="item.projectName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>         
        <el-form-item label="考试科目" prop="courseId">
          <el-input v-model="dataForm.examinationQuestionName" disabled></el-input>
        </el-form-item> 
        <div style="display:flex;">
          <el-form-item label="试卷总量" prop="examinationPaperCount">
            <el-input  v-model.number="form.examinationPaperCount" type="number" min="1" disabled>
              <el-button slot="append">套</el-button>
            </el-input>
          </el-form-item>    
          <el-form-item label="考试时间" prop="examinationPaperTime">
            <el-input  v-model.number="form.examinationPaperTime" type="number" min="1" @input="change($event)">
              <el-button slot="append">分钟</el-button>
            </el-input>
          </el-form-item>                   
        </div>
      </el-col> 
    </el-row>
  </el-form>
  <!-- 试题类型 -->
  <div class="t-header-title">
    <span>试题类型</span>
  </div> 
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" border size="small" show-summary :data="questionTypeList" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="questionTypeName" sortable label="试题类型名称" show-overflow-tooltip></el-table-column>
    <el-table-column prop="score" label="每题分值"  width="150">
      <template slot-scope="scope">
        <el-input class="input-append" size="mini" min="0" max="10" v-model.number="scope.row.score" @input="change($event)">
          <el-button slot="append">分</el-button>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column prop="empQuestionCount" label="试题数量" width="100">  
      <template slot-scope="scope">
        {{scope.row.empQuestionCount=scope.row.examinationPaper.length}}
      </template>
    </el-table-column>
    <el-table-column prop="empQuestionTotalScore" label="分值(数量*单题分值)" width="200">
      <template slot-scope="scope">
        {{scope.row.empQuestionTotalScore=scope.row.score?Number(scope.row.score) * scope.row.examinationPaper.length:0}}
      </template>
    </el-table-column>
    <el-table-column  fixed="right" label="操作" width="220" align="center">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="chooseExam(scope.row)">抽取试题</el-button>
        <el-button type="text" size="small" @click="replaceEaxm(scope.row)">查看试题</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 操作按钮 -->
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
  </div>
  <!-- 抽取试题 -->
  <choose-exam :dataForm="ExamForm" :visible.sync="chooseExamVisible" :chooseValue="examinationPaper" @save="generateExamList"></choose-exam>
  <!-- 查看试题 -->
  <replace-exam :dataForm="ExamForm" :visible.sync="replaceExamVisible" :chooseValue="examinationPaper" @remove="removeExamList"></replace-exam>
</el-dialog>
</template>
<script>
import { getExaminationPaperById } from '@/server/examination-module';
import chooseExam from './examinationPaper-manual-chooseExam'
import replaceExam from './examinationPaper-manual-replaceExam'
export default {
  props: ['visible','dataForm','programs'],
  components: {chooseExam,replaceExam},
  data() {
    return {
      id:null,
      trainingProgramsId:null,
      // programs: [],
      courseList: [],
      courseId:null,
      form: {},
      rules: {
        examinationPaperName: [{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
        questionAssembleStrategyId: [{ required: true, message: '请选择组卷策略', trigger: 'blur' }],
        grossScore: [{ required: true, message: '请输入总分', trigger: 'blur' }],
        examinationPaperCount: [{ required: true, message: '请输入试题数量', trigger: 'blur' }],
        examinationPaperTime: [{ required: true, message: '请设置考试时间', trigger: 'blur' }],
        trainingProgramsId: [{ required: true, message: '请选择学习项目', trigger: 'blur' }],
        courseId: [{ required: true, message: '请选择考试科目', trigger: 'blur' }],
      },
      questionTypeList: [
        {questionType: 'SingleChoice',questionTypeName: '单选题',examinationPaper: []},
        {questionType: 'MultipleChoice',questionTypeName: '多选题',examinationPaper: []},
        {questionType: 'TrueFalse',questionTypeName: '判断题',examinationPaper: []},
        // {questionType: 'BlankFill',questionTypeName: '填空题'},
        // {questionType: 'ShortAnswer',questionTypeName: '解答题'},
        // {questionType: 'Read',questionTypeName: '阅读题'}
      ],
      chooseExamVisible:false,
      replaceExamVisible:false,
      ExamForm: {},
      examinationPaper: [],
      
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.trainingProgramsId='';
        this.$set(this.form,'trainingProgramsId','')
        this.$set(this.form,'courseId',this.dataForm.examinationQuestionId)
        this.questionTypeList=[
          {questionType: 'SingleChoice',questionTypeName: '单选题',examinationPaper: []},
          {questionType: 'MultipleChoice',questionTypeName: '多选题',examinationPaper: []},
          {questionType: 'TrueFalse',questionTypeName: '判断题',examinationPaper: []},
          // {questionType: 'BlankFill',questionTypeName: '填空题'},
          // {questionType: 'ShortAnswer',questionTypeName: '解答题'},
          // {questionType: 'Read',questionTypeName: '阅读题'}
        ];
        this.examinationPaper= []
        this.form=Object.assign({},this.dataForm);  
        this.$set(this.form,'examinationPaperCount',1)
        if (this.dataForm.id) {
          this.trainingProgramsId=this.dataForm.trainingProgramsId;
          this._getExaminationPaperById();
        }
      }
    },
    trainingProgramsId(newVal) {
      if (newVal) {
        this.$set(this.form,'trainingProgramsId',newVal)
        this.$set(this.form,'courseId',this.dataForm.examinationQuestionId)
      }
    },
    form: {
      handler(newVal,oldVal) {
        if (this.form.grossScore<1) {
          this.$set(this.form,'grossScore',1)
        }    
        if (this.form.examinationPaperTime<1) {
          this.$set(this.form,'examinationPaperTime',1)
        }
      },
      immediate: true,
      deep: true
    },
    questionTypeList: {
      handler(newVal,oldVal) {
        newVal.forEach(item => {
          if (item.score<0) {
            this.$set(item,'score',0)
          }          
        })
      },
      immediate:true,
      deep:true
    }
  },
  methods: {
    // -----------------------------------------查询-----------------------------------  
    _getExaminationPaperById() {
      getExaminationPaperById(this.dataForm.id).then(result => {      
        this.questionTypeList.forEach(el => {
          el.examinationPaper= []
          if (result && result.length>0) {
            result.forEach(item => {
              if (el.questionType == item.questionType) {
                el.examinationPaper.push(item)
                this.$set(el,'score',item.score)
              }
            })
          }
        })
      })
    },
    // ----------------------------------------操作-----------------------------------------
    change (e) {
      this.$forceUpdate()
    },
    chooseExam(row) {  // 抽取试题 
      this.ExamForm=Object.assign({},row,this.dataForm)
      // this.ExamForm={
      //   questionType:row.questionType,
      //   questionTypeName:row.questionTypeName,
      //   id: this.dataForm.id, // 试卷id
      //   examinationQuestionId: this.dataForm.examinationQuestionId, // 题库目录id
      //   examinationQuestionName: this.dataForm.examinationQuestionName, // 题库目录名称
      //   trainingProgramsId: this.dataForm.trainingProgramsId,
      //   courseId: this.dataForm.courseId,
      //   courseName: this.dataForm.courseName,
      // }
      this.examinationPaper=row.examinationPaper;
      this.chooseExamVisible=true;
    },
    replaceEaxm(row) { // 查看试题
      this.ExamForm=Object.assign({},row,this.dataForm)
      this.examinationPaper=row.examinationPaper;
      this.replaceExamVisible=true;
    },
    generateExamList(data,questionType) {  // 获得试题列表
      this.questionTypeList.forEach(el => {
        if (el.questionType==questionType) {
          data.forEach(item => {
            let obj={
              questionId:item.id,
              questionType:item.questionType,
              questionTypeName:item.questionTypeName,
              score:item.score,
            } 
            el.examinationPaper.push(obj)
          })
        }
      }) 
    },
    removeExamList(data,questionType) {  // 移除试题
      this.questionTypeList.forEach(el => {
        if (el.questionType==questionType) {
          data.forEach(item => {
            let obj={
              questionId:item.id,
              questionType:item.questionType,
              questionTypeName:item.questionTypeName,
              score:item.score,
            } 
            el.examinationPaper=el.examinationPaper.filter(list => {
              return list.questionId!=item.id
            })
          })
          
        }
      }) 
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      let totalScore=0; // 抽屉的试题总分数
      let examinationPaper= []
      for(let i=0;i<this.questionTypeList.length;i++) {
        let item=this.questionTypeList[i];
        if (!item.score && item.examinationPaper.length>0) {
          this.$alert(`请设置【${item.questionTypeName}】的分值！`)
          return ;
        }
        item.examinationPaper.forEach(el => {
          el.score=item.score;
          el.examinationPaperId=this.form.id;
          totalScore += item.score
        })
        examinationPaper=examinationPaper.concat(item.examinationPaper)        
      }
      this.$set(this.form,'constructionExaminationWay','Manual');
      this.$set(this.form,'examinationPaper',examinationPaper);
      
      if (this.form.grossScore!=totalScore) {
        this.$alert('基本信息中的总分和试题类型中计算得到的总分不一致！')
        return;        
      }      
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save',this.form)
        this.close()
      })      
    },
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
</style>