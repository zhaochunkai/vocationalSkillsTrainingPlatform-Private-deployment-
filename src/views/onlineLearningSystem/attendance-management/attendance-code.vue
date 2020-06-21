<template>
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>在线考勤</span>
  </div>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">         
        <el-form-item label="学习项目" prop="trainingProgramId">
          <el-input v-model="form.trainingProgramName" disabled></el-input>
        </el-form-item>
        <el-form-item label="考勤课节" prop="attendanceTime">
          <div class="t-info-div">
            <span v-if="form.pointInTimeName">{{form.pointInTimeName}} 第{{form.lessonNumber}}节课 {{getWeek(form.attendanceTime)}}</span>
          </div>
        </el-form-item>
        <el-form-item label="班级" prop="classId">
          <el-input v-model="form.className" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程" prop="courseId">
          <el-input v-model="form.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="authCode">
          <el-input v-model="form.authCode"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="validity">
          <el-input  v-model="form.validity">
            <el-button slot="append">分钟</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="预览有效期" v-show="form.validity">
          {{new Date(form.attendanceTime).toLocaleString()}}
          ~
          {{new Date(new Date(form.attendanceTime).getTime()+Number(form.validity)*60*1000).toLocaleString()}}
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12" v-if="imgCode">
      <el-tag type="danger" style="color:#f00;font-size:14px;">注意：本次考勤验证码和二维码不会存储在系统中，一旦刷新将不再页面中显示！！</el-tag>
      <div class="t-margin-top">
        <el-button
          type="primary"
          size="small"
          v-print="print"
        >打印二维码</el-button>
      </div>
      <div class="t-text-center">
        <img id="printCompletion" height="50%" height:200px :src="imgCode">
      </div>
    </el-col>
  </el-row>
  <div style="margin-left:120px;display:block;">
    <el-button type="success" size="medium" @click="save">生成签到码</el-button>
    <!-- <el-button type="primary" size="medium" @click="send">推送给本班学生</el-button> -->
  </div>
</el-card>
</template>
<script>
import {
  getAttendanceInitiateInfo,
  AttendanceInitiate,
  SendToStudentsOfClass
} from '@/server/online-module'
export default {
  data () {
    return {
      style: '',
      form: {},
      rules: {
        authCode: [
          { required: true, message: '请输入签到码', trigger: 'blur' },
          { min: 4, message: '长度不得小于4个字符', trigger: 'blur' }
        ]
      },
      programs: [],
      classList: [],
      courseList: [],
      lessonList: [],
      programId: '',
      classId: '',
      courseId: '',
      section: '',
      imgCode: '', // 二维码图片
      print: {
        id: '#printCompletion',
        popTitle: '考勤二维码',
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getAttendanceInitiateInfo()
  },
  methods: {
    _getAttendanceInitiateInfo () {
      getAttendanceInitiateInfo().then(result => {
        this.form = Object.assign({}, result)
        let date = new Date() // 默认获取当前日期
        this.$set(this.form, 'attendanceTime', date)
      })
    },
    getWeek (val) {
      let date = new Date(val)
      date.getDay()
      if (date.getDay() === 0) {
        return '星期日'
      } else if (date.getDay() === 1) {
        return '星期一'
      } else if (date.getDay() === 2) {
        return '星期二'
      } else if (date.getDay() === 3) {
        return '星期三'
      } else if (date.getDay() === 4) {
        return '星期四'
      } else if (date.getDay() === 5) {
        return '星期五'
      } else if (date.getDay() === 6) {
        return '星期六'
      }
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        AttendanceInitiate(this.form).then(result => {
          this.$alert('签到码生成成功！')
          this.imgCode = result
          console.log(result, '======')
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      })
    },
    send () {
      if (!this.form.authCode) {
        this.$alert('请输入签到码')
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.classId) {
          SendToStudentsOfClass(this.form).then(() => {
            this.$alert('发送签到提醒成功！')
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.txt{
  background: #eee;
  line-height:1.8;
}
</style>
