<template>
  <el-dialog class="t-dialog" title="排课设置" v-if="visible" :visible="visible" :close-on-click-modal="false" width="80%" @close="close">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程设置" name="course">
        <!-- <div class="t-box-card-header">
          <span>基本信息</span>
        </div> -->
        <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
          <el-form-item label="周次">
            <div class="info">{{form.weekOfSemester}}</div>
          </el-form-item>
          <el-form-item label="时间">
            <div class="info">{{form.dataTime}} {{form.weekName}} {{form.pointInTimeName}} 第 {{form.lessonNumber}} 节</div>
          </el-form-item>
          <el-form-item label="学习项目">
            <div class="info">{{dataForm.programName}}</div>
          </el-form-item>
          <el-form-item label="班级">
            <div class="info">{{form.gradeName}}</div>
          </el-form-item>
          <el-form-item label="课程" prop="courseId">
            <el-select v-model="courseId" filterable placeholder="可输入课程名称过滤">
              <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item align="right">
            <el-button size="small" @click="close">返 回</el-button>
            <!-- <el-button type="primary" size="small" @click="savaBasic">保存基本信息</el-button>  -->
            <el-button type="primary" size="small"  @click="next(tabsName[1])">下一页</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="user" v-if="courseId">
        <span slot="label"><span style="color:#f00;">*</span> 设置任课教师</span>
        <tree-transfer :TreeType="TreeType" :title="title" :alias="alias" :chooseValue="chooseTeacher" :isMultiple="false" @saveTransfer="getNewTransfer"></tree-transfer>
        <div style="text-align:right;margin-bottom:20px;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small"  @click="prev(tabsName[0])">上一页</el-button>
          <el-button type="primary" size="small"  @click="next(tabsName[2])" v-show="placeShow">下一页</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="place" v-if="courseId && placeShow">
        <span slot="label"><span style="color:#f00;">*</span> 设置上课地点</span>
        <tree-transfer :TreeType="TreeType" :title="title" :alias="aliasPlace" :chooseValue="chooseClassRoomId" :isMultiple="false" @saveTransfer="getNewTransfer"></tree-transfer>
        <div style="text-align:right;margin-bottom:20px;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small"  @click="prev(tabsName[1])">上一页</el-button>
          <el-button type="primary" size="small"  @click="next(tabsName[3])">下一页</el-button>
          <el-button type="primary" size="small"  @click="save">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="Knowledge" v-if="courseId && placeShow && userShow">
        <span slot="label">设置教学任务</span>
        <!--    树+穿梭框。根据 TreeType 判断需要什么树形结构。'TreeData','title' ,'alias','chooseTasks','isMultiple'
          resource-资源树,  user-用户树（学校+企业）,
          programs-项目树,  Knowledge-知识点树,
          resource-资源树,  grade-班级树, place-教室树    -->
        <tree-transfer :TreeType="TreeType" :courseId="courseId" :title="title" :alias="aliasTask" :chooseValue="chooseTasks" :isMultiple="true" @saveTransfer="getNewTransfer"></tree-transfer>
        <div style="text-align:right;margin-bottom:20px;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small"  @click="prev(tabsName[2])">上一页</el-button>
          <el-button type="primary" size="small"  @click="save">保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import {
  createCourseScheduling,
  updateCourseScheduling
} from '@/server/online-module'
import { getTrainingProgramsBindCourse } from '@/server/training-module'
import treeTransfer from '@/components/tree-transfer'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      tabsName: ['course', 'user', 'place', 'Knowledge'],
      activeName: 'course',
      form: {},
      semesterId: '',
      rules: {
        creditHour: { required: true, message: '请输入学分', trigger: 'blur' },
        passCreditHour: { required: true, message: '请输入及格学分', trigger: 'blur' },
        courseId: {required: true, message: '请选择课程', trigger: 'blur'},
        teachingTaskIds: {required: true, message: '请设置教学任务', trigger: 'blur'},
        teacherId: {required: true, message: '请设置任课教师', trigger: 'blur'},
        classRoomId: {required: true, message: '请设置上课地点', trigger: 'blur'}
      },
      courseList: [],
      TreeType: '',
      obj: {},
      show: false,
      userShow: false,
      placeShow: false,
      courseId: '',
      // ----------------------树+穿梭框--------------------
      title: '',
      alias: {key: 'id', label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      aliasTask: {key: 'idLevel', label: 'name'}, // 教务任务：在id上加上level用于判断是章节还是知识点
      aliasPlace: {key: 'id', label: 'name'}, // 教务任务：在id上加上level用于判断是章节还是知识点
      chooseTasks: [],
      chooseTeacher: [],
      chooseClassRoomId: [],
      isMultiple: false // 是否多选，false-单选，true-多选
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName = 'course'
        this.form = Object.assign({}, this.dataForm)
        this.courseId = this.form.courseId
        if (this.dataForm.trainProjectId) {
          this._getTrainingProgramsBindCourse()
        }
        if (this.dataForm.createScheduling) {
          this.chooseTeacher = this.dataForm.createScheduling[0].teacherId.split(',') // 教师
          this.chooseTasks = this.dataForm.createScheduling[0].teachingTaskIds.split(',') // 教学任务
          this.chooseClassRoomId = []
          this.chooseClassRoomId.push(this.dataForm.createScheduling[0].classRoomId) // 教室
          this.obj = Object.assign({}, {
            teacherId: this.dataForm.createScheduling[0].teacherId,
            teachingTaskIds: this.dataForm.createScheduling[0].teachingTaskIds,
            classRoomId: this.dataForm.createScheduling[0].classRoomId,
            id: this.dataForm.createScheduling[0].id
          })
          if (this.dataForm.createScheduling[0].id) {
            this.placeShow = true
            this.userShow = true
            this.show = true
          }
        } else {
          this.form.createScheduling = []
          this.obj = {}
          this.chooseTasks = []
          this.chooseTeacher = []
          this.chooseClassRoomId = []
          this.placeShow = false
          this.userShow = false
          this.show = false
        }
      }
    },
    courseId (newVal) {
      if (newVal) {
        this.$set(this.form, 'courseId', newVal)
      }
    },
    activeName (newVal) {
      this.TreeType = newVal
    }
  },
  components: {treeTransfer},
  activated () {
    this.activeName = 'course'
  },
  methods: {
    _getTrainingProgramsBindCourse () { // 获取学习项目下的课程
      this.courseList = []
      getTrainingProgramsBindCourse(this.dataForm.trainProjectId).then(result => {
        this.courseList = result
      })
    },
    handleClick (tab, event) { // 切换tab的时候更新默认值
      // console.log(tab, event);
      if (this.dataForm.createScheduling) {
        this.chooseTasks = this.dataForm.createScheduling[0].teachingTaskIds.split(',') // 教学任务
        this.chooseTeacher = this.dataForm.createScheduling[0].teacherId.split(',') // 教师
        this.chooseClassRoomId = [] // 教室
        this.chooseClassRoomId.push(this.dataForm.createScheduling[0].classRoomId)
      } else {
        this.form.createScheduling = []
      }
    },
    close () {
      this.$emit('update:visible', false)
    },
    prev (data) {
      this.activeName = data
    },
    next (data) {
      if (!this.courseId) {
        this.$alert('请先完成课程设置，再进行下一步操作！')
        return
      }
      if (this.courseId) {
        this.userShow = true
      }
      if (this.obj.teacherId) {
        this.placeShow = true
      }
      if (!this.chooseTeacher) {
        if (!this.placeShow) {
          this.$alert('请先完成本页设置后再继续下一页！')
          return
        }
      }
      this.activeName = data
      this.TreeType = data
      this.handleClick()
    },
    getNewTransfer (data) { // 获取穿梭框中的最新数据
      if (this.activeName === 'Knowledge') { // 知识点
        if (data) {
          this.$set(this.obj, 'teachingTaskIds', '')
          this.$set(this.obj, 'teachingTaskIds', data.join(','))
        } else {
          this.$set(this.obj, 'teachingTaskIds', '')
        }
        if (data.length > 0) {
          this.userShow = true
        }
      } else if (this.activeName === 'user') { // 用户
        this.$set(this.obj, 'teacherId', data.join(','))
        this.$set(this.form, 'teacherId', data.join(','))
        if (data.length > 0) {
          this.placeShow = true
        }
      } else if (this.activeName === 'place') { // 教室
        this.$set(this.obj, 'classRoomId', data.join(','))
      }
    },
    save () { // 课程安排
      this.obj = Object.assign(this.obj, {
        week: this.form.week,
        pointInTime: this.form.pointInTime,
        lessonNumber: this.form.lessonNumber,
        courseId: this.courseId,
        yearMonthDay: this.form.dataTime
      })
      this.form.createScheduling = []
      this.form.createScheduling.push(this.obj)
      if (!this.form.createScheduling[0].classRoomId) {
        this.$alert('请选择上课地点！')
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.obj.id) {
          this.$set(this.form, 'teachingTaskIds', this.obj.teachingTaskIds)
          updateCourseScheduling(this.obj.id, this.form).then(result => {
            this.$message.success('保存成功！')
            this.$emit('_getCourseScheduling')
            this.close()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createCourseScheduling(this.form).then(result => {
            this.$message.success('保存成功！')
            this.$emit('_getCourseScheduling')
            this.close()
          }).catch(err => {
            //  this.$alert(err.message);
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
.t-box-card-header{
  line-height:40px;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  span{
    padding:11px 100px 12px;
    border:1px solid #ddd;
    background: #ddd;
    border-bottom:none;
    font-weight: 600;
  }
}
.infomation{
  span{
    margin-right:50px;
  }
}
.info{
  background: #eee;
  padding-left:10px;
  border-radius: 5px;
}
.t-form-block{

  /deep/.el-input.is-disabled .el-input__inner {
    background-color: #eee;
    color: #666;
  }
}
.t-operate-footer{
  margin-bottom:1rem;
}
// ---------------穿梭框样式------------------
// /deep/.el-transfer {
//   max-width: 100%!impor;
//   margin-bottom:60px;
//   // margin: 0 auto 60px;
// }
/deep/.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
  font-size:14px;
}
/deep/.el-checkbox__label span{
  font-size:13px;
}
/deep/.el-transfer-panel{
  width:40%;
}
.saveBtn{
  position:absolute;
  right:30px;
  bottom:30px;
}
.backBtn{
  position:absolute;
  right:120px;
  bottom:30px;
}
</style>
