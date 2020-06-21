<template>
  <el-drawer :title="`【${dataForm.examName}】成绩分析`" v-if="visible" :visible="visible" direction="rtl" size="80%" @close="close">
    <div class="t-header-title">
      <span>考试信息</span>
    </div>
    <el-table class="t-table-list" :data="examInfoDate" stripe size="small" tooltip-effect="dark" style="width:100%;" >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="examName" label="考试名称" align="center"> </el-table-column>
      <el-table-column label="学年学期" align="center">
        <template slot-scope="scope">
          {{dataForm.semesterName}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="班级" align="center">
        <template slot-scope="scope">
          {{className}}
        </template>
      </el-table-column>
      <el-table-column prop="examinationTypeName" label="考试类别" align="center"></el-table-column>
      <el-table-column prop="methodOfExaminationName" label="考试方式" align="center"></el-table-column>
      <el-table-column prop="" label="考试时间" align="center" width="260">
        <template slot-scope="scope">
          {{new Date(scope.row.examinationBeginTime) | formatAllDate}}
          ~
          {{new Date(scope.row.examinationEndTime) | formatAllDate}}
        </template>
      </el-table-column>
    </el-table>
    <div class="t-header-title">
      <span>考试分析</span>
    </div>
    <el-form class="t-operate-filter" size="small" inline>
      <el-form-item label="课程">
        <el-select v-model="courseId" clearable>
          <el-option
            v-for="(item,i) of courseList"
            :key="i"
            :label="item.courseName"
            :value="item.courseId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="概要统计" name="first">
        <el-form class="t-operate-filter" size="small" label-width="150px" inline :model="summaryVo">
          <el-form-item label="项目总人数">
            {{summaryVo.trainingProgramPersonCount}}人
          </el-form-item>
          <el-form-item label="参加考试人数">
            {{summaryVo.examPersonCount}}人
          </el-form-item>
          <el-form-item label="参考率">
            {{summaryVo.examRatio}}%
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="成绩详情" name="second">
        <!-- 表格 -->
        <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="recordDetailsData" tooltip-effect="dark" style="width:100%;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="candidateNo" label="准考证号" align="center"></el-table-column>
          <el-table-column prop="studentName" label="学生姓名" align="center"></el-table-column>
          <el-table-column prop="className" label="班级" align="center"></el-table-column>
          <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
          <el-table-column prop="examTotalPoints" label="试卷总分" align="center"></el-table-column>
          <el-table-column prop="score" label="试卷得分" align="center"></el-table-column>
          <el-table-column prop="classRanking" label="班级排名" align="center"></el-table-column>
          <!-- <el-table-column prop="trainingProgramRanking" label="项目排名" align="center"></el-table-column> -->
          <el-table-column prop="examPaperStatusName" label="参考状态" align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="small">关 闭</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { getExaminationArrangeById } from '@/server/examination-module'
import { getExamAnalyze } from '@/server/statistical-module'
export default {
  props: ['visible', 'dataForm'],
  data () {
    return {
      examInfoDate: [],
      // -------------查询条件------------
      courseList: [],
      courseId: null,
      classId: null,
      className: null,
      trainingProgramId: null,
      // ------------- tabs ------------
      activeName: 'first',
      summaryVo: {}, // 概要
      recordDetailsData: [] // 成绩详情
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.courseId = null
        this.classId = null
        this.className = null
        this.courseList = []
        this._getExaminationArrangeById()
        // this.examInfoDate = [this.dataForm]
      }
    },
    courseId (newVal) {
      if (newVal) {
        this._getExamAnalyze()
      }
    }
  },
  methods: {
    /* ------------------------------------ 查询数据 -------------------------- */
    // 获取考试相关课程安排详情
    _getExaminationArrangeById () {
      getExaminationArrangeById(this.dataForm.id).then(result => {
        this.classId = result.assignSubject.classId
        this.className = result.assignSubject.className
        if (result.assignSubject.examinationCourseConfig) {
          this.courseList = result.assignSubject.examinationCourseConfig
        }
        if (this.courseList && this.courseList.length > 0) {
          this.courseId = this.courseList[0].courseId
        }
      })
    },
    // 获取课程考试 合格率
    _getExamAnalyze () {
      let data = {
        courseId: this.courseId,
        ExaminationArrangeId: this.dataForm.id,
        classId: this.dataForm.classId
      }
      getExamAnalyze(data).then(res => {
        if (res) {
          this.examInfoDate = [res.examArrangeVo]
          this.summaryVo = res.summaryVo
          this.recordDetailsData = res.recordDetailsVo
        }
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    handleClick (tab, event) { },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
