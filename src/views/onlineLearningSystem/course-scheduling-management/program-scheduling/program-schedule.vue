<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 班级树 -->
        <org-tree ref="orgTree" :currentNodeAll="nodeSelect" :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <!-- 排课 -->
      <el-card v-show="JSON.stringify(nodeSelect) != '{}' && nodeSelect.level=='班级'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>学习项目排课</span>
        </div>
        <!-- 学期/周-过滤  -->
        <el-form class="t-operate-filter" :inline="true" :model="form" size="small">
          <el-form-item label="学期：" class="noBorder">
            <el-input class="input-append" v-model="SemesterList.semesterName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="周次" >
            <el-select v-model="weekOfSemester">
              <el-option v-for="(item, i) of semeterWeekList" :key="i" :label="`第 ${item.week} 周 ${item.flagCourseScheduling?'【已排课】': '未排课'}`" :value="item.week"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="noBorder">
            {{startDate}} ~ {{endtDate}}
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="background:#015171;" title="锁定当前学期的所有课表" @click="lockSchedule">{{SemesterList.flagLock?'解除锁定': '锁定课表'}}</el-button>
          </el-form-item>
        </el-form>
        <!-- 排课表 -->
        <div class="weeks">
          <el-table class="t-table-list"  ref="formTabel" border size="small" :data="cellData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @cell-click="chooseCell" v-if="cellData.length>0">
            <el-table-column label="节次/星期" width="140" align="center" prop="jieci"></el-table-column>
            <el-table-column label="" align="center" prop="Monday" v-if="cellData[0].Monday">
              <template slot="header" slot-scope="scope">
                <span>星期一</span><br/>
                <span>{{weekDays[0]}}</span>
              </template>
              <template slot-scope="scope">
                <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
                <div v-else>
                  <span>{{scope.row[scope.column.property].classRoomName}}</span>
                  <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                  <span>{{scope.row[scope.column.property].courseName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="星期二" align="center" prop="Tuesday" v-if="cellData[0].Tuesday">
              <template slot="header" slot-scope="scope">
                <span>星期二</span><br/>
                <span>{{weekDays[1]}}</span>
              </template>
              <template slot-scope="scope">
                <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
                <div v-else>
                  <span>{{scope.row[scope.column.property].classRoomName}}</span>
                  <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                  <span>{{scope.row[scope.column.property].courseName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="星期三" align="center" prop="Wednesday" v-if="cellData[0].Wednesday">
              <template slot="header" slot-scope="scope">
                <span>星期三</span><br/>
                <span>{{weekDays[2]}}</span>
              </template>
              <template slot-scope="scope">
                <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
                <div v-else>
                  <span>{{scope.row[scope.column.property].classRoomName}}</span>
                  <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                  <span>{{scope.row[scope.column.property].courseName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="星期四" align="center" prop="Thursday" v-if="cellData[0].Thursday">
              <template slot="header" slot-scope="scope">
                <span>星期四</span><br/>
                <span>{{weekDays[3]}}</span>
              </template>
              <template slot-scope="scope">
                <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
                <div v-else>
                  <span>{{scope.row[scope.column.property].classRoomName}}</span>
                  <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                  <span>{{scope.row[scope.column.property].courseName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="星期五" align="center" prop="Friday" v-if="cellData[0].Friday">
              <template slot="header" slot-scope="scope">
                <span>星期五</span><br/>
                <span>{{weekDays[4]}}</span>
              </template>
              <template slot-scope="scope">
                <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
                <div v-else>
                  <span>{{scope.row[scope.column.property].classRoomName}}</span>
                  <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                  <span>{{scope.row[scope.column.property].courseName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="星期六" align="center" prop="Saturday" v-if="cellData[0].Saturday">
              <template slot="header" slot-scope="scope">
                <span>星期六</span><br/>
                <span>{{weekDays[5]}}</span>
              </template>
              <template slot-scope="scope">
                <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
                <div v-else>
                  <span>{{scope.row[scope.column.property].classRoomName}}</span>
                  <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                  <span>{{scope.row[scope.column.property].courseName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="星期日" align="center" prop="Sunday" v-if="cellData[0].Sunday">
              <template slot="header" slot-scope="scope">
                <span>星期日</span><br/>
                <span>{{weekDays[6]}}</span>
              </template>
              <template slot-scope="scope">
                <div class="showCell" v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging">禁排</div>
                <div v-else>
                  <span>{{scope.row[scope.column.property].classRoomName}}</span>
                  <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                  <span>{{scope.row[scope.column.property].courseName}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 教师们的排课数据 -->
        <el-row :gutter="10">
          <el-col style="margin-top:1rem;" :span="12" v-for="(item, i) of teachSchelding" :key="i"  v-show="JSON.stringify(nodeSelect) != '{}' && nodeSelect.level=='班级'">
            <!-- {{item}} -->
            <teacher-schedule :teacherId="item.teacherId" :teacherName="item.teacherName" :cellData="item.TeacherCellData"></teacher-schedule>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <!-- 设置排课教室、老师、课程 -->
  <setting-schedule :dataForm="addEditForm" :visible.sync="addEditVisible" @save="savaData" @_getCourseScheduling="_getCourseScheduling"></setting-schedule>
</div>
</template>
<script>
import {
  getGradeTree,
  getDefaultSemester,
  getTeachCalendar
} from '@/server/basic-module'
import {getClassInfoById} from '@/server/training-module'
import {
  getCourseScheduling,
  getCourseSchedulingByWeek,
  LockCourseScheduling,
  getTeacherCourseScheduling
} from '@/server/online-module'
import orgTree from '@/components/orgTree.vue'
import settingSchedule from './setting-schedule.vue'
import teacherSchedule from './teacher-schedule.vue'
export default {
  data () {
    return {
      style: '',
      resourceTree: [],
      addEditVisible: false,
      addEditForm: {},
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      nodeSelect: {},
      weekOfSemester: 1, // 周次
      semeterWeekList: [],
      weeks: '', // 周数
      weekStatus: [], // 周排课状态
      startDate: '',
      endtDate: '',
      /* -------------------------------课表格子----------------------------------- */
      form: {},
      SemesterList: [],
      semesterId: '',
      cellData: [],
      checkedWeeks: [],
      tableData: [],
      gradeSchedule: [],
      cellDefaultData: [],
      CourseSchedulingId: '', // 周-课表id
      weekNum: '',
      weekDays: [], // 一周的日期
      teacherArr: [],
      teachSchelding: []
    }
  },
  components: {orgTree, settingSchedule, teacherSchedule},
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getGradeTree()
    this._getDefaultSemester()
    if (this.nodeSelect && JSON.stringify(this.nodeSelect) !== '{}') {
      setTimeout(() => {
        this.$refs.orgTree.checkNode()
        this.haddleOrganizationNode(this.nodeSelect)
        this._getCourseScheduling()
      }, 100)
    }
  },
  watch: {
    weekOfSemester (newVal) {
      if (newVal) {
        this.getWeekDate(this.SemesterList.semesterBeginTime, newVal)
        if (this.nodeId) {
          this._getCourseScheduling()
        }
      }
    },
    nodeId (newVal) { // 选中班级节点时，给每个周增加是否排课的状态
      if (newVal) {
        if (this.weeks && newVal && this.nodeLevel === '班级') {
          this._getCourseScheduling()
        }
      }
      this.weekStatus = []
      // if (this.weeks && newVal &&this.nodeLevel=='班级') {
      //   for(let i=1;i<=Number(this.weeks);i++) {
      //     let data = {
      //       SemesterId: this.semesterId,
      //       GradeId: this.nodeId,
      //       Week: i
      //     }
      //     getCourseScheduling(data).then(result => {
      //       let weekSta=''
      //       if (result[0]) {
      //         weekSta='【已排课】';
      //       } else {
      //         weekSta='';
      //       }
      //       this.$set(this.weekStatus, i-1,weekSta)
      //     })
      //   }
      // }
    }
  },
  methods: {
    // ---------------------------------------------教学日程模板---------------------------------------------------
    _getDefaultSemester () { // --------------------获取默认学期
      getDefaultSemester().then(result => {
        if (result.id) { // 如果存在默认学期
          this.SemesterList = Object.assign({}, result) // 学期列表
          this.semesterId = result.id // 学期id
          let startWeekDay = new Date(result.semesterBeginTime).getDay() === 0 ? 7 : new Date(result.semesterBeginTime).getDay() // 开始时间的星期数 1-7
          let endWeekDay = new Date(result.semesterEndTime).getDay() === 0 ? 7 : new Date(result.semesterEndTime).getDay() // 结束时间的星期数 1-7
          this.weeks = Math.ceil((new Date(result.semesterEndTime) - new Date(result.semesterBeginTime) + 24 * 3600 * 1000) / 7 / 24 / 3600 / 1000) // 学期总周数
          if (startWeekDay > endWeekDay) {
            this.weeks += 1 // 学期总周数
          }
          this._getTeachCalendar() // 通过默认学期查询教学日程设置
          if (this.SemesterList.semesterBeginTime) {
            this.getNowWeek() // 获取当天所在的周
            this.getWeekDate(this.SemesterList.semesterBeginTime, this.weekOfSemester)
          }
        } else {
          // 不存在默认学期则前往设置
          this.$confirm(`请前往【学年学期】模块设置默认学期， 是否前往？`, '提示', {
            confirmButtonText: '前往',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({path: '/academicYear/semester'})
          }).catch()
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    _getTeachCalendar () { // -----------------------查询默认学期的教学日程
      getTeachCalendar(this.semesterId).then(result => {
        this.form = Object.assign({}, result)
        this.checkedWeeks = this.form.weekIds.split(', ')
        this.count = this.form.forenoonCount + this.form.afternoonCount + this.form.nightCount
        this.tableData = [] // 课节表格框架
        this.blkj('上午', this.form.forenoonCount, 'Forenoon')
        this.blkj('下午', this.form.afternoonCount, 'AfterNoon')
        this.blkj('晚上', this.form.nightCount, 'Night')
        this.cellData = Object.assign([], this.tableData)
        let data = Object.assign([], this.form.teachCalendars)
        this.cellData.forEach(item => {
          data.forEach(arr => {
            if (item.pointInTime === arr.pointInTime && item.lessonNumber === arr.lessonNumber) {
              // 若节次相同，那么将星期作为元素插入
              let newArr = Object.assign({}, arr)
              this.$set(item, arr.week, newArr)
            }
          })
        })
        this.cellDefaultData = JSON.parse(JSON.stringify(this.cellData))
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // -------------------------遍历课节数字
    blkj (kj, num, pointInTime) {
      for (var i = 1; i <= num; i++) {
        let ss = ''
        if (i === 1) {
          ss = '一'
        } else if (i === 2) {
          ss = '二'
        } else if (i === 3) {
          ss = '三'
        } else if (i === 4) {
          ss = '四'
        }
        this.tableData.push({
          jieci: kj + '第' + ss + '节',
          pointInTime: pointInTime,
          lessonNumber: i,
          flagBanOnArranging: false
        })
      }
    },
    _getCourseSchedulingByWeek () { // 获取默认学期，某班的周次排课情况
      getCourseSchedulingByWeek(this.nodeId).then(result => {
        this.semeterWeekList = result
      })
    },
    /* ------------------------------------ 排课格子 ------------------------------------ */
    _getCourseScheduling () { // ---------------获取某学期某班级某周的排课内容----------------
      this.cellData = JSON.parse(JSON.stringify(this.cellDefaultData))
      let data = {
        SemesterId: this.semesterId,
        GradeId: this.nodeId,
        Week: this.weekOfSemester
      }
      getCourseScheduling(data).then(result => {
        this.gradeSchedule = result
        if (result.length) {
          this.CourseSchedulingId = result[0].id
        }
        // 获取行程安排列表
        let schedulingArr = []
        result.forEach(res => {
          schedulingArr = schedulingArr.concat(res.scheduling)
        })
        let teacherArr = []
        if (result.length) {
          // 将本周所有的排课老师筛选出来，放入数组中
          result[0].scheduling.forEach(item => {
            if (teacherArr.indexOf(item.teacherId) === -1) {
              teacherArr.push(item.teacherId)
            }
          })
        }
        this.teachSchelding = []
        teacherArr.forEach(item => { // 查询老师们 本周的课程安排
          this._getTeacherCourseScheduling(item)
        })
        this.displayScheduling(schedulingArr, this.cellData)
      })
    },
    // 组合显示排课数据
    displayScheduling (schedulingArr, cellData) {
      let weekIds = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
      cellData.forEach(item => {
        weekIds.forEach((week, i) => {
          if (!!item[week]) {
            item[week] = Object.assign(item[week], {
              dataTime: this.weekDays[i]
            })
          }
        })
      })
      if (schedulingArr.length === 0) {
        cellData.forEach(item => {
          weekIds.forEach((week) => {
            if (!!item[week]) {
              this.$set(item[week], 'classRoomName', '')
              this.$set(item[week], 'courseName', '')
              this.$set(item[week], 'teacherName', '')
            }
          })
        })
      } else {
        schedulingArr.forEach(scheduling => {
          // 筛选时间课程节点
          let currentTimeLession = cellData.find(cell => cell.pointInTime === scheduling.pointInTime && cell.lessonNumber === scheduling.lessonNumber)
          if (currentTimeLession && scheduling.week) {
            this.$set(currentTimeLession[scheduling.week], 'classRoomName', scheduling.classRoomName)
            this.$set(currentTimeLession[scheduling.week], 'courseName', scheduling.courseName)
            this.$set(currentTimeLession[scheduling.week], 'teacherName', `【${scheduling.teacherName}】`)
            this.$set(currentTimeLession[scheduling.week], 'courseId', scheduling.courseId)
            this.$set(currentTimeLession[scheduling.week], 'teacherId', scheduling.teacherId)
            this.$set(currentTimeLession[scheduling.week], 'classRoomId', scheduling.classRoomId)
            this.$set(currentTimeLession[scheduling.week], 'dataTime', scheduling.dataTime) // 将当天的日期添加到表格中
            currentTimeLession[scheduling.week].createScheduling = []
            currentTimeLession[scheduling.week].createScheduling.push(scheduling)
          }
        })
      }
    },
    // 组合显示教师的排课数据
    displayTeacherScheduling (schedulingArr, TeacherCellData, teacherId, teacherName) {
      // let teachCell = Object.assign([],TeacherCellData)
      let teachCell = JSON.parse(JSON.stringify(TeacherCellData))
      let weekIds = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
      if (schedulingArr.length === 0) {
        teachCell.forEach(item => {
          weekIds.forEach((week) => {
            this.$set(item[week], 'isSchedule', '')
          })
        })
      } else {
        schedulingArr.forEach(scheduling => {
          // 筛选时间课程节点
          let currentTimeLession = teachCell.find(cell => cell.pointInTime === scheduling.pointInTime && cell.lessonNumber === scheduling.lessonNumber)
          if (currentTimeLession && scheduling.week) {
            this.$set(currentTimeLession[scheduling.week], 'isSchedule', '有课')
          }
        })
      }
      let obj = {
        teacherId,
        teacherName,
        TeacherCellData: teachCell
      }
      this.teachSchelding.push(obj)
      //  console.log(this.teachSchelding)
    },
    getNowWeek () { // -------------------获取今天所在的周---------------------
      // let begin=new Date(this.SemesterList.semesterBeginTime);
      // let now= new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
      // let days=Math.ceil((now-begin+24*3600*1000)/7/24/3600/1000);    // 今天是第几周
      // this.weekOfSemester=days>=1?days:1;

      let startWeekDay = new Date(this.SemesterList.semesterBeginTime).getDay() === 0 ? 7 : new Date(this.SemesterList.semesterBeginTime).getDay() // 开始时间的星期数 1-7
      let endWeekDay = new Date().getDay() === 0 ? 7 : new Date().getDay() // 今天星期数 1-7
      let days = Math.ceil((new Date() - new Date(this.SemesterList.semesterBeginTime)) / 7 / 24 / 3600 / 1000) // 今天是第几周
      if (startWeekDay > endWeekDay) {
        days += 1
      }
      this.weekOfSemester = days >= 1 ? days : 1
    },
    getWeekDate (semesterStart, weeks) { // ---------------获取所选周次的开始和结束日期--------------------
      let week = Number(weeks)
      let weekNum = new Date(semesterStart).getDay() === 0 ? 7 : new Date(semesterStart).getDay() // 获取开始时间所在的星期 ，1-7

      let ms = new Date(semesterStart).getTime() // 获取学期开始时间的毫秒数
      let start = ms + (week - 1) * 7 * 24 * 3600 * 1000 // N周后，和学期开始时间的星期相同的时间，如N周后的星期几
      this.weekDays = []
      for (let i = 1; i <= 7; i++) {
        let dateTime = new Date(start - (weekNum - i) * 24 * 3600 * 1000).toLocaleDateString()
        this.weekDays.push(dateTime)
      }
      this.startDate = this.weekDays[0] // 本周开始时间或学期开始时间
      this.endtDate = this.weekDays[6] // 本周开始时间
    },
    // 获取老师本周的排课
    _getTeacherCourseScheduling (teacherId) {
      let data = {
        teacherId,
        weekOfSemester: this.weekOfSemester
      }
      getTeacherCourseScheduling(data).then(result => { // 获取课程安排列表
        let TeacherCellData = JSON.parse(JSON.stringify(this.tableData))
        let teachCalendars = JSON.parse(JSON.stringify(this.form.teachCalendars))
        TeacherCellData.forEach(item => {
          teachCalendars.forEach(arr => {
            if (item.pointInTime === arr.pointInTime && item.lessonNumber === arr.lessonNumber) {
              // 若节次相同，那么将星期作为元素插入
              let newArr = Object.assign({}, arr)
              this.$set(item, arr.week, newArr)
            }
          })
        })
        if (result[0]) {
          this.displayTeacherScheduling(result, TeacherCellData, teacherId, result[0].teacherName)
        }
        // let obj = {
        //   teacherId,
        //   teacherName: result[0].teacherName,
        //   TeacherCellData: TeacherCellData
        // }
        // console.log(2, TeacherCellData)
        // this.teachSchelding.push(obj)
      })
    },
    /* *********************************************************
     * ************************ 操作 * *************************
     ********************************************************* */
    // 点击格子事件
    chooseCell (row, column, cell, event) {
      if (this.SemesterList.flagLock) {
        this.$alert('课表已锁定，请解锁后再安排课节')
        return
      }
      if (new Date(row[column.property].dataTime) < new Date().toLocaleDateString()) {
        this.$alert('该日期已经是过去时间，无法更改课节安排！')
        return
      }
      // 得到这个格子的数据 row[column.property]
      if (column.property !== 'jieci' && row[column.property].flagBanOnArranging === false) {
        let cell = row[column.property]
        delete (cell.id)
        this.addEditForm = Object.assign({}, cell, {
          semesterName: this.SemesterList.semesterName, // 学期名称
          semesterId: this.SemesterList.id, // 学期ID
          weekOfSemester: this.weekOfSemester, // 周次
          gradeId: this.nodeId, // 班级ID
          gradeName: this.nodeName, // 班级名称
          CourseSchedulingId: this.CourseSchedulingId // 周的课表id
        })
        // 根据班级信息查看学习项目id和名称
        getClassInfoById(this.nodeId).then(result => {
          this.$set(this.addEditForm, 'trainProjectId', result.programId) // 学习项目ID
          this.$set(this.addEditForm, 'programName', result.programName) // 学习项目名称
        }).then(() => {
          this.addEditVisible = true
        })
      } else {
        this.$alert('该课节禁止排课！')
      }
    },
    // 查询 非已结束状态 的班级项目树
    _getGradeTree () {
      this.resourceTree = []
      getGradeTree({state: '0,1,2,3'}).then(result => {
        this.resourceTree.push(result)
      })
    },
    // 锁定|解锁课表
    lockSchedule () {
      this.$confirm(`此操作将 ${this.SemesterList.flagLock ? '解除当前默认学期的课表锁定' : '锁定当前默认学期的课表'}， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let flagLock = !this.SemesterList.flagLock
        LockCourseScheduling(this.semesterId, flagLock).then(result => {
          this.$message.success(`${this.SemesterList.flagLock ? '课表解锁成功' : '锁定课表成功'}`)
          this.SemesterList.flagLock = flagLock
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }).catch(() => {})
    },
    /* 选择的树节点 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      this.nodeId = node.id
      this.nodeName = node.label
      this.nodeLevel = node.level
      if (node.level === '班级') {
        this._getCourseSchedulingByWeek()
      }
    },
    savaData (data) { // 保存
      this._getCourseScheduling()
    }
  }
}
</script>
<style lang="less" scoped>
.showCell{
    display:block;
    text-align:center;
    background: #ddd;
}

.noBorder{
  /deep/.el-input__inner{
    border:none;
  }
}
.weeks{
  /deep/.el-table--border th{
    background: #eee;
  }
  /deep/.el-table__body{
    td:first-child{
      background: #eee;
      font-weight: 600;
      color:#303030;
      font-size:0.9rem;
    }

  }
  /deep/.el-table__row--striped{
    td:first-child{
      background: #eee;
      font-weight: 600;
    }
  }
  /deep/.el-table th.is-leaf{
    font-weight: 600;
    font-size:0.9rem;
  }
  /deep/.el-table--border,
  /deep/.el-table--group{
    border: 1px solid #a4bdcc;
  }
  /deep/.el-table--border td,
  /deep/.el-table--border th,
  /deep/.el-table__body-wrapper,
  /deep/.el-table--border.is-scrolling-left~.el-table__fixed {
      border-right: 1px solid #a4bdcc;
  }
  /deep/.el-table td,
  /deep/.el-table th.is-leaf {
      border-bottom: 1px solid #a4bdcc;
  }
  /deep/.el-table--small td,
  /deep/.el-table--small th {
      padding: 0;
  }
  /deep/.el-table .cell{
    line-height:1.6rem;
    padding: 0;
  }
}
</style>
