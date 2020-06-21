<template>
  <el-dialog
    class="t-dialog"
    v-if="visible"
    :title="`【${examName}】合格率`"
    :visible="visible"
    :close-on-click-modal="false"
    width="70%"
    @close="close"
  >
    <el-form class="t-operate-filter" size="small" inline>
      <el-form-item label="班级">
        <div class="t-info-div">
          <span>{{className}}</span>
        </div>
      </el-form-item>
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" size="small">关 闭</el-button>
    </div>
    <pie-graph v-if="terminaFlag" height="400px" :dataList="terminalData" :legendData="terminalLegendData" labelFormatter="{b|{b}}：{d}%" tooltipFormatter="{b}：<br/> 占比：{d}%" orient="horizontal"></pie-graph> 
  </el-dialog>
</template>
<script>
import { getExaminationArrangeById } from '@/server/examination-module'
import { getPercentOfPassByCourseId } from '@/server/statistical-module'
import pieGraph from '@/components/pie-graph'
export default {
  components: { pieGraph },
  props: ['visible', 'dataForm'],
  data () {
    return {
      examName: '',
      // -------------查询条件------------
      courseList: [],
      courseId: null,
      classId: null,
      className: null,
      trainingProgramId: null,
      // ------------- 图表 ------------
      terminaFlag: false,
      terminalData: [],
      terminalLegendData: []
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
      }
    },
    courseId (newVal) {
      if (newVal) {
        this._getPercentOfPassByCourseId()
      }
    }
  },
  methods: {
    // 获取考试相关课程安排详情
    _getExaminationArrangeById () {
      getExaminationArrangeById(this.dataForm.id).then(result => {
        this.classId = result.assignSubject.classId
        this.className = result.assignSubject.className
        this.examName = result.examName
        if (result.assignSubject.examinationCourseConfig) {
          this.courseList = result.assignSubject.examinationCourseConfig
        }
        if (this.courseList && this.courseList.length > 0) {
          this.courseId = this.courseList[0].courseId
        }
      })
    },
    // 获取课程考试 合格率
    _getPercentOfPassByCourseId () {
      let data = {
        courseId: this.courseId,
        ExaminationArrangeId: this.dataForm.id
      }
      getPercentOfPassByCourseId(data).then(res => {
        this.PercentOfPassInfo = res
        this.terminalData = [
          {value: Number(res.passRate), name: '合格率'},
          {value: 100 - Number(res.passRate), name: '不合格率'}
        ]
        this.terminalLegendData = ['合格率', '不合格率']
        this.terminaFlag = true
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
