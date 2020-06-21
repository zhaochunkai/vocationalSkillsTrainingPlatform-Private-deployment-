<template>
  <div>
    <el-card>
      <div slot="header" class="t-box-card-header">
        <span>教学日程设置</span>
      </div>
      <el-form
        class="t-form-block"
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        :inline="true"
      >
        <el-col>
          <el-form-item label="学年学期" prop="semesterId">
            <el-select v-model="form.semesterId">
              <!-- <el-option v-for="(item,i) of SemesterList" :key="i" :label="item.semesterName" :value="item.id"></el-option> -->
              <el-option :label="SemesterList.semesterName" :value="SemesterList.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="星期安排" prop="weekIds">
            <template slot-scope="scope">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
            </template>
          </el-form-item>
          <el-form-item>
            <template slot-scope="scope">
              <el-checkbox-group v-model="checkedWeeks" @change="handleCheckedWeeksChange">
                <el-checkbox v-for="(week,i) of Weeks" :label="weekIds[i]" :key="i">{{week}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="节次安排" prop="name"></el-form-item>
          <el-form-item
            v-for="(item,i) of dailyScheduleConfig"
            :key="i"
            :label="item.label"
            prop="name"
          >
            <template slot-scope="scope">
              <el-select v-model="form[item.type]" width="30%">
                <el-option
                  v-for="index of item.count"
                  :label="index+'节'"
                  :value="index"
                  :key="index"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </el-form>
      <el-button type="primary" size="small" @click="generate">生成课节</el-button>
    </el-card>
    <el-card>
      <div slot="header" class="t-box-card-header">
        <span style="margin-right:20px;">课节安排</span>
        <el-tag type="danger" style="color:#f00;">注：点击格子，标识无课时间</el-tag>
      </div>
      <el-table
        class="t-table-list"
        ref="formTabel"
        border
        size="small"
        :data="cellData"
        tooltip-effect="dark"
        style="width: 100%;margin-top:10px;"
        @cell-click="chooseCell"
        v-if="cellData.length>0"
      >
        <el-table-column label="节次/星期" width="100" align="center" prop='jieci'></el-table-column>
        <el-table-column
          label="星期一"
          width="100"
          align="center"
          prop="Monday"
          v-if="cellData[0].Monday"
        >
          <template slot-scope="scope">
            <div
              class="showCell"
              v-show="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
            >禁排</div>
          </template>
        </el-table-column>
        <el-table-column
          label="星期二"
          width="100"
          align="center"
          prop="Tuesday"
          v-if="cellData[0].Tuesday"
        >
          <template slot-scope="scope">
            <div
              class="showCell"
              v-show="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
            >禁排</div>
          </template>
        </el-table-column>
        <el-table-column
          label="星期三"
          width="100"
          align="center"
          prop="Wednesday"
          v-if="cellData[0].Wednesday"
        >
          <template slot-scope="scope">
            <div
              class="showCell"
              v-show="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
            >禁排</div>
          </template>
        </el-table-column>
        <el-table-column
          label="星期四"
          width="100"
          align="center"
          prop="Thursday"
          v-if="cellData[0].Thursday"
        >
          <template slot-scope="scope">
            <div
              class="showCell"
              v-show="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
            >禁排</div>
          </template>
        </el-table-column>
        <el-table-column
          label="星期五"
          width="100"
          align="center"
          prop="Friday"
          v-if="cellData[0].Friday"
        >
          <template slot-scope="scope">
            <div
              class="showCell"
              v-show="scope.row[scope.column.property] && scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
            >禁排</div>
          </template>
        </el-table-column>
        <el-table-column
          label="星期六"
          width="100"
          align="center"
          prop="Saturday"
          v-if="cellData[0].Saturday"
        >
          <template slot-scope="scope">
            <div
              class="showCell"
              v-show="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
            >禁排</div>
          </template>
        </el-table-column>
        <el-table-column
          label="星期日"
          width="100"
          align="center"
          prop="Sunday"
          v-if="cellData[0].Sunday"
        >
          <template slot-scope="scope">
            <div
              class="showCell"
              v-show="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
            >禁排</div>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
    </el-card>
  </div>
</template>
<script>
import {
  getDailySchedule,
  getDefaultSemester,
  getTeachCalendar,
  createTeachCalendar,
  updateTeachCalendar
} from '@/server/basic-module'
export default {
  data () {
    return {
      // 星期全选
      checkAll: false,
      checkedWeeks: [],
      Weeks: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ],
      weekIds: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      isIndeterminate: true,
      form: {},
      rules: {
        semesterId: [{ required: true, message: '学期id', trigger: 'blur' }],
        weekIds: [{ required: true, message: '请选择星期', trigger: 'blur' }]
      },
      showInfo: false,
      InfoVisible: false,
      tableData: [],
      semesterId: '',
      SemesterList: {},
      count: 0,
      cellData: [],
      cellDefaultData: [],
      // 可安排课程节次
      dailyScheduleConfig: []
    }
  },
  activated () {
    this._getDailySchedule()
    this._getDefaultSemester()
  },
  watch: {
    checkedWeeks (newVal) {
      let weekIdsStr = this.checkedWeeks.join()
      if (newVal) {
        this.$set(this.form, 'weekIds', weekIdsStr)
      }
    }
  },
  methods: {
    // 获取作息时间
    _getDailySchedule () {
      this.dailyScheduleConfig = []
      getDailySchedule().then(res => {
        if (!res.dailyScheduleConfig || res.dailyScheduleConfig.length === 0) {
          this.$alert('请先设置作息时间！')
          return
        }
        res.dailyScheduleConfig.forEach(el => {
          let type = 'nightCount'
          if (el.pointInTime === 'Forenoon') {
            type = 'forenoonCount'
          } else if (el.pointInTime === 'AfterNoon') {
            type = 'afternoonCount'
          }
          let obj = {
            type: type,
            label: el.pointInTimeName,
            count: el.pitchNumber
          }
          this.dailyScheduleConfig.push(obj)
        })
      })
    },
    // 获取默认学期
    _getDefaultSemester () {
      getDefaultSemester().then(result => {
        if (result.id) {
          // 如果存在默认学期
          this.SemesterList = Object.assign({}, result)
          this.semesterId = result.id
          this.$set(this.form, 'semesterId', result.id)
          this._getTeachCalendar() // 通过默认学期查询教学日程设置
        } else {
          // 不存在默认学期则前往设置
          this.$confirm(
            `请前往【学年学期】模块设置默认学期， 是否前往？`,
            '提示',
            {
              confirmButtonText: '前往',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.$router.push({ path: '/academicYear/semester' })
            })
            .catch()
        }
      })
    },
    // 查询默认学期的教学日程
    _getTeachCalendar () {
      getTeachCalendar(this.semesterId).then(result => {
        this.form = Object.assign({}, result)
        this.checkedWeeks = this.form.weekIds.split(',')
        this.count =
          this.form.forenoonCount +
          this.form.afternoonCount +
          this.form.nightCount
        this.tableData = [] // 课节表格框架
        this.blkj('上午', this.form.forenoonCount, 'Forenoon')
        this.blkj('下午', this.form.afternoonCount, 'AfterNoon')
        this.blkj('晚上', this.form.nightCount, 'Night')
        this.cellData = Object.assign([], this.tableData)
        let data = Object.assign([], this.form.teachCalendars)
        this.cellData.forEach(item => {
          data.forEach(arr => {
            if (
              item.pointInTime === arr.pointInTime &&
              item.lessonNumber === arr.lessonNumber
            ) {
              // 若节次相同，那么将星期作为元素插入
              let newArr = Object.assign({}, arr)
              this.$set(item, arr.week, newArr)
            }
          })
        })
        this.cellDefaultData = JSON.parse(JSON.stringify(this.cellData))
      })
    },
    // 遍历课节数字
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
    chooseCell (row, column, cell, event) {
      // 得到这个格子的数据 row[column.property]
      // console.log(column.property)
      if (column.property !== 'jieci') {
        row[column.property] = Object.assign({}, row[column.property])
        row[column.property].flagBanOnArranging = !row[column.property]
          .flagBanOnArranging
      }
    },
    handleCheckAllChange (val) {
      this.checkedWeeks = val ? this.weekIds : []
      this.isIndeterminate = false
    },
    handleCheckedWeeksChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.Weeks.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.Weeks.length
    },
    generate () {
      // 根据上面选择的日程安排，生成课节格子
      this.count =
        this.form.forenoonCount +
        this.form.afternoonCount +
        this.form.nightCount
      this.tableData = [] // 课节表格框架
      this.blkj('上午', this.form.forenoonCount, 'Forenoon')
      this.blkj('下午', this.form.afternoonCount, 'AfterNoon')
      this.blkj('晚上', this.form.nightCount, 'Night')
      let weekIdList = this.checkedWeeks
      // this.cellData = Object.assign([], this.tableData)
      let cellDataTemp = Object.assign([], this.tableData)
      cellDataTemp.forEach(item => {
        let cell = this.cellDefaultData.find(cell => item.jieci === cell.jieci)
        weekIdList.forEach(week => {
          if (cell && cell[week]) {
            this.$set(item, week, cell[week])
          } else {
            this.$set(item, week, {
              flagBanOnArranging: false,
              // fromTheTeachCalendarId: 1,
              lessonNumber: item.lessonNumber,
              pointInTime: item.pointInTime,
              week
            })
          }
        })
      })
      this.cellData = cellDataTemp
      // 给每个tableData元素内添加星期字段
      // this.cellData.forEach((item, i) => {
      //   weekIdList.forEach(week => {
      //     let newItem = Object.assign({}, item)
      //     this.$set(newItem, 'week', week)
      //     this.$set(item, week, newItem)
      //   })
      // })
    },
    save () {
      this.form.semesterId = this.semesterId
      this.form.teachCalendars = []
      this.cellData.forEach(item => {
        this.checkedWeeks.forEach(week => {
          this.form.teachCalendars.push(item[week])
        })
      })
      this.$refs.form.validate(valid => {
        if (!valid) return
        if (this.form.id) {
          updateTeachCalendar(this.form)
            .then(() => {
              this.$message.success('保存成功')
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
        } else {
          createTeachCalendar(this.form)
            .then(() => {
              this.$message.success('保存成功')
            })
            .catch(err => {
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
/deep/.el-form .el-form-item {
  max-width: 800px;
}
.hideStyle {
  width: 100%;
  height: 100%;
  display: none;
}
.showCell {
  display: block;
  color: #000;
  text-align: center;
  background: #ddd;
}

/deep/.el-table--small td,
/deep/.el-table--small th {
  padding: 0;
}
/deep/.el-table .cell {
  line-height: 3rem;
  padding-left: 0;
  padding-right: 0;
}
</style>
