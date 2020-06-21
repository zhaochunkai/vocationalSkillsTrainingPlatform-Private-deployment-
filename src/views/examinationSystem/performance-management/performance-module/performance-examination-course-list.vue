<template>
<el-drawer title="成绩管理 > 课程列表" v-if="visible" :visible="visible" direction="rtl" size="90%" @close="close">
  <!-- 成绩管理班级课程列表 -->
  <el-select v-model="classId" size="small">
    <el-option v-for="(item,i) of classLists" :key="i" :label="item.name" :value="item.id"></el-option>
  </el-select>
  <el-tag>请先选择课程，选中课程后自动更新列表中的数据</el-tag>
  <!-- 表格 -->
  <el-table v-loading="loading"
  element-loading-text="数据加载中" class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="courseName" sortable label="课程" show-overflow-tooltip></el-table-column>
    <el-table-column prop="trainingProgramName" label="学习项目"></el-table-column>
    <el-table-column prop="className" label="班级"></el-table-column>
    <el-table-column prop="marginalScore" label="及格分数" width="100" v-if="dataForm.examinationType=='Official'">
      <template slot-scope="scope">
        {{scope.row.courseExamRecordRecordInfo.marginalScore}}
      </template>
    </el-table-column>
    <el-table-column prop="numberToBeEntered" label="应录入人数" width="100" v-if="dataForm.examinationType=='Official'">
      <template slot-scope="scope">
        {{scope.row.courseExamRecordRecordInfo.numberToBeEntered}}
      </template>
    </el-table-column>
    <el-table-column prop="unrecordedNumber" label="未录入人数" width="100" v-if="dataForm.examinationType=='Official'">
      <template slot-scope="scope">
        {{scope.row.courseExamRecordRecordInfo.unrecordedNumber}}
      </template>
    </el-table-column>
    <el-table-column prop="saveTheNumberOfUncommitted" label="保存未提交人数" width="120" v-if="dataForm.examinationType=='Official'">
      <template slot-scope="scope">
        {{scope.row.courseExamRecordRecordInfo.saveTheNumberOfUncommitted}}
      </template>

    </el-table-column>
    <el-table-column prop="numberOfSubmissions" label="已提交人数" width="120" v-if="dataForm.examinationType=='Official'">
      <template slot-scope="scope">
        {{scope.row.courseExamRecordRecordInfo.numberOfSubmissions}}
      </template>
    </el-table-column>
    <el-table-column prop="examPaperStatusName" label="状态" width="100" v-if="dataForm.examinationType=='Official'">
      <template slot-scope="scope">
        {{scope.row.courseExamRecordRecordInfo.examPaperStatusName}}
      </template>
    </el-table-column>
    <el-table-column  fixed="right" label="操作" :width="dataForm.examinationType=='Official'?330:160" align="center">
      <template slot-scope="scope">
        <div v-if="listType=='search'">
          <el-button type="primary" size="mini" @click="viewAccuracyRate(scope.row)">查看学员成绩</el-button>
        </div>
        <div v-else>
          <div v-if="dataForm.examinationType=='Official'">
            <!-- <el-button type="primary" size="mini" @click="editScore(scope.row)">设置及格分和满分</el-button> -->
            <el-button type="primary" size="mini" @click="editAchievement(scope.row)">录入成绩</el-button>
            <!-- <el-button type="text" size="small" @click="delAchievement(scope.row)">删除成绩</el-button>            -->
          </div>
          <div v-else>
            <el-button type="primary" size="mini" @click="viewAccuracyRate(scope.row)">查看学员正确率</el-button>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 学生列表-单科成绩录入 -->
  <score-entry :dataForm="studentScoreForm" :visible.sync="studentScoreVisible" @initialData="initialData"></score-entry>
  <!-- 查看学生正确率 -->
  <accuracy-rate :dataForm="studentScoreForm" :visible.sync="studentAccuracyVisible"></accuracy-rate>
  <!-- 设置及格分和满分 -->
  <el-dialog title="设置及格分和满分" :visible.sync="scoreSetting" width="30%">      
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">    
      <el-form-item label="及格分" prop="Attendance">
        <div class="input-div">
          <el-input v-model="form.Attendance" type="number" min="0">
            <el-button slot="append">分</el-button>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="国考成绩满分" prop="NationalExamination">
        <div class="input-div">
          <el-input v-model="form.NationalExamination" type="number" min="0">
            <el-button slot="append">分</el-button>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="期末成绩满分" prop="Training">
        <div class="input-div">
          <el-input v-model="form.Training" type="number" min="0">
            <el-button slot="append">分</el-button>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="scoreSetting = false">取 消</el-button>
      <el-button size="small" type="primary" @click="saveScoreSetting">保 存</el-button>
    </span>
  </el-dialog>
</el-drawer>
</template>
<script>
import { getCourseWithExamArrangeId,getClassWithExamArrangeId } from '@/server/examination-module'
import scoreEntry from './performance-examination-score-entry'
import accuracyRate from './performance-examination-accuracyRate'
export default {
  props: ['visible', 'dataForm'],
  components: { scoreEntry,accuracyRate },
  data() {
    return {
      examinationArrangeId: '',
      examinationType: '',
      listType: '',
      loading:true,
      // ----------表格
      tableData: [],
      // ----------班级列表
      classLists: [],
      classId: '',
      // ----------分数设置
      scoreSetting:false,
      form: {},
      rules: {
        evaluationName: [
          { required: true, message: '请输入评价名称', trigger: 'blur' },
          { max: 30, message: '字符长度必须小于30', trigger: 'blur' }
        ],
        evaluationType: { required: true, message: '请选择培训类型', trigger: 'blur' },
      },
      // ----------成绩录入
      studentScoreForm: {},
      studentScoreVisible: false,
      // ----------学生正确率
      studentAccuracyVisible: false,
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.classId = ''
        if (this.dataForm.type) {
          this.listType = this.dataForm.type
        }
        if (this.dataForm.examinationArrangeId) {
          this._getClassWithExamArrangeId()
        }
      }
    },
    classId (newVal) {
      if (newVal) {
        this.loading = true
        this.initialData()
      }
    }
  },
  methods: {
    /* ------------------------------------ 查询 -------------------------- */
    // 获取课程列表
    initialData() {
      let data={
        examinationArrangeId: this.dataForm.examinationArrangeId,
        classId: this.classId,
      }
      getCourseWithExamArrangeId(data).then(result => {
        this.tableData = result.items
        this.loading = false
      })
    },
    // 根据考试安排Id查询出所有的班级
    _getClassWithExamArrangeId() {
      getClassWithExamArrangeId(this.dataForm.examinationArrangeId).then(result => {
        this.classLists = result.items
        if (result.items && result.items.length>0) {
          this.classId = result.items[0].id
        }
      })
    },
    /* ------------------------------------ 操作 -------------------------- */
    editScore(row) {  // 设置分数
      this.scoreSetting=true;
    },
    saveScoreSetting() { // 保存及格分和满分设置

    },
    editAchievement(row) { // 录入成绩
      this.studentScoreForm={
        classId:row.classId,
        courseId:row.courseId,
        courseName:row.courseName,
        examinationArrangeId: this.dataForm.examinationArrangeId,
        examinationType: this.dataForm.examinationType
      };
      this.studentScoreVisible=true;
    },
    delAchievement(row) { // 删除成绩

    },
    viewAccuracyRate (row) { // 查看学员正确率
      this.studentScoreForm = {
        classId: row.classId,
        courseId: row.courseId,
        courseName: row.courseName,
        examinationArrangeId: this.dataForm.examinationArrangeId,
        examinationType: this.dataForm.examinationType
      }
      if (this.listType) {
        this.$set(this.studentScoreForm, 'type', this.listType)
      }
      this.studentAccuracyVisible = true
    },
    close () {
      this.$emit('update:visible', false)
    },
  }
}
</script>