<template>
<el-dialog class="t-dialog" v-if="visible" title="补考安排详情" :visible="visible" :close-on-click-modal="false" width="70%" @close="close">
  <el-tabs v-model="activeName" type="card">
    <!-- 考试基本信息 -->
    <el-tab-pane label="考试基本信息" name="basicInfo">      
      <el-form class="t-operate-filter" :model="form" size="small">
        <el-form-item label="考试名称" label-width="80px">
          <div class="t-info-div">{{form.examName}}</div>
        </el-form-item>
        <el-form-item label="考试班级" label-width="80px">
          <div class="t-info-div">{{form.className}}</div>
        </el-form-item>
        <el-form-item label="考试方式" label-width="80px">
          <div class="t-info-div">{{dataForm.methodOfExaminationName}}</div>
        </el-form-item>
        <el-form-item label="学年学期" label-width="80px">
          <div class="t-info-div">{{form.academicYearSemesterName}}</div>
        </el-form-item>
        <el-form-item label="主管单位" label-width="80px">
          <div class="t-info-div">{{form.sponsorUnitName}}</div>
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <div class="t-info-div t-textarea">{{form.remark}}</div>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!-- 相关科目安排 -->
    <el-tab-pane label="课程安排" name="courseArrange">
      <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="courseName" sortable label="课程" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="candidateNo" label="考试时间" width="300">
          <template slot-scope="scope">
            {{scope.row.examinationBeginTime?new Date(scope.row.examinationBeginTime).toLocaleString(): '' }} ~
            {{scope.row.examinationEndTime?new Date(scope.row.examinationEndTime).toLocaleString(): '' }}
          </template>
        </el-table-column>
        <el-table-column prop="examinationPlaceConfig" label="考场" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-show="scope.row.classRoomName">考试场地：{{scope.row.classRoomName}}<br></span>
            <span v-show="scope.row.invigilatorTeacherName">监考老师：{{scope.row.invigilatorTeacherName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="constructionExaminationPaperName" label="考卷" width="260">
          <template slot-scope="scope">
            <!-- <el-tooltip class="item" effect="dark" content="可点击预览并打印" placement="top-start">
              <el-button type="text" @click="previewPaper(scope.row)">{{scope.row.constructionExaminationPaperName}}</el-button>
            </el-tooltip> -->
            {{scope.row.constructionExaminationPaperName}}
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close" size="small">关 闭</el-button>
  </div>
</el-dialog>
</template>
<script>
import { getSupplementaryArrangeById } from '@/server/examination-module'
export default {
  props: ['visible', 'dataForm'],
  data () {
    return {
      // -------------表格------------
      tableData: [],
      // ----------
      form: {},
      activeName: 'basicInfo'
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName = 'basicInfo'
        this.initialData() // 获取考务信息
      }
    }
  },
  methods: {
    initialData () { // 获取考试相关课程安排列表
      getSupplementaryArrangeById(this.dataForm.id).then(result => {
        this.form = Object.assign({}, result)
        if (result.examSupplementaryArrangeWithInfos) {
          this.tableData = result.examSupplementaryArrangeWithInfos
        }
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    // 预览试卷
    previewPaper (row) {
      this.$alert('暂无此功能！')
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
