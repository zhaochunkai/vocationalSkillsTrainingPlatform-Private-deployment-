<template>
<div>
  <!-- 考试安排：设置考场和试卷等 -->
  <div>
    <el-tag type="danger" style="color:#f00;margin-right:10px;">请对每个课程设置相应的【考卷】和【考场】</el-tag>
  </div>
  <div class="t-header-title">
    <span>所属项目：{{dataForm.trainingProgramName}} </span>
    <span style="background:#c6e3f7;">所在班级：{{dataForm.className}}</span>
  </div>
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="courseName" label="考试科目" width="200" show-overflow-tooltip></el-table-column>
    <el-table-column prop="teacherId" label="录入成绩老师" width="100"></el-table-column>
    <el-table-column prop="examinationBeginTime" sortable label="考试开始时间" width="204" align="center">
      <template slot-scope="scope">
        <el-date-picker style="width:180px" size="mini" v-model="scope.row.examinationBeginTime" type="datetime" placeholder="开始时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column prop="examinationEndTime" sortable label="考试结束时间" width="204" align="center">
      <template slot-scope="scope">
        <el-date-picker style="width:180px" size="mini" v-model="scope.row.examinationEndTime" type="datetime" placeholder="结束时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
      </template>
    </el-table-column>
    <el-table-column prop="constructionExaminationPaperName" label="试卷" show-overflow-tooltip></el-table-column>
    <el-table-column label="考场" show-overflow-tooltip>
      <template slot-scope="scope">
        <span v-show="scope.row.classRoomName">考试场地：{{scope.row.classRoomName}}<br></span>
        <span v-show="scope.row.invigilatorTeacherName">监考老师：{{scope.row.invigilatorTeacherName}}</span>
      </template>
    </el-table-column>
    <el-table-column  fixed="right" label="操作" width="130" align="center">
      <template slot-scope="scope">
        <div style="margin-bottom:5px;"><el-button type="success" style="background-color: #40bb04;" size="mini" @click="drawPaper(scope.row)">①抽取试卷</el-button></div>
        <div><el-button type="success" style="background-color: #40bb04;" size="mini" @click="examSet(scope.row)">②设置考场</el-button></div>
        <div><el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button></div>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top:10px;">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保存考场安排</el-button>
    <el-button type="primary" size="small" @click="next">上一页</el-button>
  </div>
  <!-- 设置考场 -->
  <exam-site :visible.sync="showExamSite" :dataForm="courseFrom" @save="saveSiteArrange"></exam-site>
  <!-- 抽取试卷 -->
  <paper-select :visible.sync="showPaper" :dataForm="courseFrom" @save="savePaper"></paper-select>
</div>
</template>
<script>
// import transfer from "@/components/transfer.vue"
import examSite from './eaxmimation-site-setting'
import paperSelect from './examination-paper-select'
export default {
  components: { examSite, paperSelect },
  props: ['id', 'courseLists', 'dataForm'],
  data () {
    return {
      // ----时间选择器范围
      pickerOptions: { // 大于当前的禁止
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() < _now - 24 * 3600 * 1000
        }
      },
      // ------课程列表
      tableData: [],
      // ------考场设置
      showExamSite: false,
      courseFrom: {},
      // -------抽取试卷
      showPaper: false
    }
  },
  watch: {
    courseLists: {
      handler (newVal) {
        console.log('courseLists')
        if (newVal) {
          this.tableData = JSON.parse(JSON.stringify(newVal))
        }
      },
      immediate: true,
      deep: true
    },
    dataForm (newVal) {
      if (newVal) {
        if (this.dataForm.id) {
          this.tableData = []
          this.courseLists.forEach(item => {
            this.dataForm.examSupplementaryArrangeWithInfos.forEach(el => {
              el.examinationBeginTime = el.examinationBeginTime.replace(/T/, ' ')
              el.examinationEndTime = el.examinationEndTime.replace(/T/, ' ')
              if (item.courseId === el.courseId) {
                item = Object.assign({}, item, el)
              }
            })
            this.tableData.push(item)
          })
          console.log('dataForm', this.tableData, this.dataForm.examSupplementaryArrangeWithInfos)
        } else {
          if (this.courseLists) {
            this.tableData = JSON.parse(JSON.stringify(this.courseLists))
          }
        }
      }
    }
  },
  methods: {
    // -----------------------------------------查询-----------------------------------
    // -----------------------------------------操作-----------------------------------
    close () {
      this.$emit('close')
    },
    next () {
      this.$emit('next', 'BasicInfo')
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    // 保存考场安排设置
    save () {
      this.$emit('save', this.tableData)
    },
    // 抽取试卷
    drawPaper (row) {
      this.courseFrom = row
      this.showPaper = true
    },
    // 关联选取的试卷id
    savePaper (data, courseId) {
      this.tableData.forEach(item => {
        if (item.courseId === courseId && data.length > 0) {
          this.$set(item, 'constructionExaminationPaperId', data[0].constructionExaminationPaperId) // 试卷id
          this.$set(item, 'constructionExaminationPaperName', data[0].examinationPaperName) // 试卷名称
        }
      })
    },
    // 设置考场
    examSet (row) {
      this.courseFrom = row
      this.showExamSite = true
    },
    // 获取选择的考场数据
    saveSiteArrange (siteFrom) {
      if (siteFrom) {
        this.tableData.forEach(item => {
          if (item.courseId === siteFrom.courseId) {
            this.$set(item, 'classRoomId', siteFrom.classRoomId) // 教室id
            this.$set(item, 'classRoomName', siteFrom.classRoomName) // 教室名称
            this.$set(item, 'invigilatorTeacherId', siteFrom.invigilatorTeacherId) // 监考老师id
            this.$set(item, 'invigilatorTeacherName', siteFrom.invigilatorTeacherName) // 监考老师名称
          }
        })
      }
    }
  }
}
</script>
