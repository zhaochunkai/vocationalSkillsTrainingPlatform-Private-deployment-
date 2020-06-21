<template>
<el-dialog class="t-dialog" v-if="visible" title="考试安排详情" :visible="visible" :close-on-click-modal="false" width="70%" @close="close" > 
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <!-- 考试基本信息 -->
    <el-tab-pane label="考试基本信息" name="basicInfo">      
      <el-form class="t-operate-filter" :model="dataForm" size="small">
        <el-form-item label="考试名称" label-width="80px">
          <div class="t-info-div">{{dataForm.examName}}</div>
        </el-form-item>
        <el-form-item label="考试类别" label-width="80px">
          <div class="t-info-div">{{dataForm.examinationTypeName}}</div>
        </el-form-item>
        <el-form-item label="考试方式" label-width="80px">
          <div class="t-info-div">{{dataForm.methodOfExaminationName}}</div>
        </el-form-item>
        <el-form-item label="学年学期" label-width="80px">
          <div class="t-info-div">{{dataForm.semesterName}}</div>
        </el-form-item>
        <el-form-item label="主管单位" label-width="80px">
          <div class="t-info-div">{{dataForm.sponsorUnitName}}</div>
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <div class="t-info-div t-textarea">{{dataForm.remark}}</div>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!-- 相关科目安排 -->
    <el-tab-pane label="课程安排" name="courseArrange">
      <!-- 可以根据考试时间和班级查询 -->
      <el-form class="t-operate-filter" :model="conditionForm" size="small" inline>
        <el-form-item label="考试开始时间">
          <el-date-picker v-model="conditionForm.startTime" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="考试结束时间">
          <el-date-picker v-model="conditionForm.endTime" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="班级" >
          <el-select v-model="classId">
            <el-option v-for="(item,i) of classList" :key="i" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
        <!-- 表格 -->
      <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"> </el-table-column>
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
            <span v-html="generateExamPlaceAndTeacher(scope.row.examinationPlaceConfig)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="examArrangeWithExaminationPapers" sortable label="考卷" width="260">
          <template slot-scope="scope">
            <!-- <span v-html="generateExamPaper(scope.row.examArrangeWithExaminationPapers)"></span> -->
            <span v-if="Array.isArray(scope.row.examArrangeWithExaminationPapers)">
              <!-- <span v-for="(item,i) of scope.row.examArrangeWithExaminationPapers" :key="i">
                <el-tooltip class="item" effect="dark" content="可点击预览并打印" placement="top-start">
                  <el-button type="text" @click="previewPaper(item)">{{item.constructionExaminationPaperName}}</el-button>
                </el-tooltip>
                <br>
              </span> -->
              <span v-for="(item,i) of scope.row.examArrangeWithExaminationPapers" :key="i">
                {{item.constructionExaminationPaperName}}
                <br>
              </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 全选 -->
      <div class="t-batch-operate">
        <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
      </div>			
      <!-- 分页组件 -->
      <!-- <div class="t-operate-footer">
        <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
      </div>       -->
    </el-tab-pane>
  </el-tabs>       
 
  <div slot="footer" class="dialog-footer">
    <el-button @click="close" size="small">关 闭</el-button>
  </div>
</el-dialog>  
</template>
<script>
import { getExaminationArrangeInformation, getExaminationArrangeById } from '@/server/examination-module';
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
export default {
  components: {pagination},
  props: ['visible','dataForm'],
  data() {
    return {
      // -------------表格------------
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
      tableData: [],
      isSelectAll:false,
      multipleSelection: [],
      // ----------
      activeName: 'basicInfo',
      classList: [],
      classId:null,
      conditionForm: {}
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
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },  
    initialData () { // 获取考试相关课程安排列表
      getExaminationArrangeById(this.dataForm.id).then(result => {
        if (result.assignSubject.examinationCourseConfig) {
          this.tableData = result.assignSubject.examinationCourseConfig
        }
      })
    },
    queryList () {
      this.initialData(this.SkipCount, this.pageSize)
    },  
    /* ------------------------------------ 操作按钮 -------------------------- */
    // 预览试卷
    previewPaper (row) {
      this.$alert('暂无此功能！')
    },
    // 重构考场片段
    generateExamPlaceAndTeacher (data) {
      let ExamPlaceAndTeacher = ''
      if (Array.isArray(data)) {
        data.forEach(item => {
          ExamPlaceAndTeacher += `${item.examinationPlaceName} （ 可容纳${item.numberOfPeople}人，监考老师：${item.teacherNames} ）<br>`
        })
      }
      return ExamPlaceAndTeacher
    },
    // generateExamPaper (data) {
    //   let ExamPaper=''
    //   if (Array.isArray(data)) {
    //     data.forEach(item => {
    //       ExamPaper += `${item.constructionExaminationPaperName}<br>`
    //     })
    //   }
    //   return ExamPaper;
    // },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    toInfomationPage (row) {

    },
    close () {
      this.$emit('update:visible', false)
    }
    
  }
}
</script>
