<template>
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>学生信息</span>
  </div>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basicInfo">
      <basic-info :basicForm="student"></basic-info>
    </el-tab-pane>
    <el-tab-pane label="缴费信息" name="payment">
      <payment-info :basicForm="basicForm"></payment-info>
    </el-tab-pane>
    <el-tab-pane label="考勤信息" name="attendance">
      <attendance-page :studentId="studentId" :trainingProgramId="programId"></attendance-page>
    </el-tab-pane>
    <el-tab-pane label="学习进度" name="learningProgress">学习进度</el-tab-pane>
    <el-tab-pane label="成绩信息" name="achievement">成绩信息</el-tab-pane>
    <el-tab-pane label="毕业信息" name="graduation">毕业信息</el-tab-pane>
    <el-tab-pane label="学习报告" name="learningReport">学习报告</el-tab-pane>
  </el-tabs>
</el-card>
</template>
<script>
import { getStudentBasicInfoById,getTrainingProgramsById } from '@/server/training-module'; 
import basicInfo from './basic-info/basic-info.vue'
import paymentInfo from './payment-info/payment-info.vue'
import attendancePage from './attendance-info/attendance-page'
export default {
  components: {basicInfo, paymentInfo, attendancePage},
  data() {
    return {
      style: '',
      activeName: 'basicInfo',
      id: '',
      basicForm: {},
      program: {},
      student: {},
      programId: '',
      studentId: ''
    };
  },
  created() {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    // if (!this.programId) {
      this.programId=this.$route.query.programId
    // }
    // if (!this.studentId) {
      this.studentId=this.$route.query.studentId
    // }
    console.log('=====')
    this._getStudentBasicInfoById()
  },
  watch: {
    
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 根据学生id获取学生信息
    _getStudentBasicInfoById() {
      let data={
        id: this.studentId,
        trainingProgramsId: this.programId
      }
      getStudentBasicInfoById(data).then(result => {
        this.student=Object.assign({},result);
      }).catch(err => { 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
  }
};

</script>