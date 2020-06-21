<template>
<div>
  <el-row :gutter="10">
    <el-col :span="14">
      <el-card :style="style" class="t-setting">
        <div slot="header" class="t-box-card-header">
          <span>设置作息时间</span>
        </div>                           
        <!-- 操作按钮 -->
        <div class="t-operate-buttons" style="text-align:right;">
          <el-button type="primary" size="mini" @click="save">保存并预览</el-button>
          <el-button type="success" size="mini" @click="preview">预 览</el-button>
          <el-button size="mini" @click="clearTimeTable">清除作息时间</el-button>
        </div>
        <!-- 设置表格 -->
        <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" style="width: 100%;margin-top:10px;">
          <el-table-column prop="pointInTimeName" label='' width="70" align="center"></el-table-column>
          <el-table-column prop="startTime" label="第一节课开始时间" min-width="135">
            <template slot-scope="scope">
              <el-time-picker v-if="scope.row.pointInTime=='Forenoon'" v-model="scope.row.startTime" size="mini" :picker-options="ForenoonPickerOptions" placeholder="请选择时间点" format="HH:mm:ss" value-format="HH:mm:ss"></el-time-picker>
              <el-time-picker v-if="scope.row.pointInTime=='AfterNoon'" v-model="scope.row.startTime" size="mini" :picker-options="AfterNoonPickerOptions" placeholder="任意时间点" format="HH:mm:ss" value-format="HH:mm:ss"></el-time-picker>
              <el-time-picker v-if="scope.row.pointInTime=='Night'" v-model="scope.row.startTime" size="mini" :picker-options="NightPickerOptions" placeholder="任意时间点" format="HH:mm:ss" value-format="HH:mm:ss"></el-time-picker>
            </template>
          </el-table-column>
          <el-table-column prop="pitchNumber" label="课节数" min-width="130">
            <template slot-scope="scope">
              <div class="numInput">
                <el-input class="input-append" size="mini" min="0" max="10" v-model.number="scope.row.pitchNumber" type="number">
                  <el-button slot="append">节</el-button>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="classTimes" label="课程分钟数" min-width="140">
            <template slot-scope="scope">
              <div class="numInput">
                <el-input class="input-append" size="mini" min="0" max="60" v-model.number="scope.row.classTimes" type="number">
                  <el-button slot="append">分钟</el-button>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="theRestTime" label="休息分钟数" min-width="140">
            <template slot-scope="scope">
              <div class="numInput">
                <el-input class="input-append" size="mini" min="0" max="60" v-model.number="scope.row.theRestTime" type="number">
                  <el-button slot="append">分钟</el-button>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column  fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="reset(scope.row)">重置数据</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card :style="style" class="t-timeTable">
        <div slot="header" class="t-box-card-header">
          <span>作息时间表</span>
        </div>
        <div class="t-operate-buttons" >
          <el-button
            type="primary"
            size="small"
            v-print="print"
          >打印作息时间表</el-button>
        </div>
        <!-- 作息时间表格 -->
        <el-table id="printCompletion" class="t-table-list" ref="multipleTable" border size="small" :data="timeTable" tooltip-effect="dark" style="width: 100%;margin-top:10px;" :span-method="objectSpanMethod">
          <el-table-column prop="pointInTimeName" label='' width="70" align="center"></el-table-column>
          <el-table-column prop="type" label="节次" width="130" align="center">
            <template slot-scope="scope">
              第 {{scope.row.lessonNumber}} 节
            </template>
          </el-table-column>
          <el-table-column prop="creatorName" label="时间">
            <template slot-scope="scope">
             {{scope.row.startTime?new Date(scope.row.startTime).toLocaleTimeString(): ''}}~{{scope.row.endTime?new Date(scope.row.endTime).toLocaleTimeString(): ''}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>
<script>
import {
  createDailySchedule,
  updateDailySchedule,
  getDailySchedule,
  ClearTimeTable
} from '@/server/basic-module'
export default {
  data () {
    return {
      style: '',
      tableData: [
        {pointInTimeName: '上午', pointInTime: 'Forenoon', pitchNumber: 0, classTimes: 0, theRestTime: 0},
        {pointInTimeName: '下午', pointInTime: 'AfterNoon', pitchNumber: 0, classTimes: 0, theRestTime: 0},
        {pointInTimeName: '晚上', pointInTime: 'Night', pitchNumber: 0, classTimes: 0, theRestTime: 0}
      ],
      timeTable: [],
      forenoonNum: 0,
      noonNum: 0,
      nightNum: 0,
      isEmpty: true,
      ForenoonPickerOptions: {selectableRange: '06:00:00 - 12:00:00'},
      AfterNoonPickerOptions: {selectableRange: '12:00:00 - 18:00:00'},
      NightPickerOptions: {selectableRange: '18:00:00 - 23:59:59'},
      print: {
        id: '#printCompletion',
        popTitle: `作息时间表`,
        extraCss: '',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getDailySchedule()
  },
  methods: {
    reset (row) {
      this.$set(row, 'pitchNumber', 0)
      this.$set(row, 'classTimes', 0)
      this.$set(row, 'theRestTime', 0)
    },
    _getDailySchedule () {
      getDailySchedule().then(result => {
        result.dailySchedule.forEach(item => {
          result.dailyScheduleConfig.forEach(el => {
            if (el.pointInTimeName === item.pointInTimeName) {
              this.$set(item, 'pitchNumber', el.pitchNumber)
            }
          })
        })
        // 生成作息时间表
        this.timeTable = Object.assign([], result.dailySchedule)
        if (result.dailyScheduleConfig.length > 0) {
          this.isEmpty = false
          result.dailyScheduleConfig.forEach(item => {
            item.startTime = new Date(item.startTime)
          })
          this.tableData = Object.assign([], result.dailyScheduleConfig) // 取得课节安排
        }
        this.getLessonNumber()
      })
    },
    // 合并行
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0 && this.forenoonNum) {
          return {
            rowspan: this.forenoonNum,
            colspan: 1
          }
        } else if (rowIndex === this.forenoonNum && this.noonNum) {
          return {
            rowspan: this.noonNum,
            colspan: this.noonNum ? 1 : 0
          }
        } else if (rowIndex === this.forenoonNum + this.noonNum && this.nightNum) {
          return {
            rowspan: this.nightNum,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 预览作息时间表
    preview () {
      let arr = JSON.parse(JSON.stringify(this.tableData))
      this.timeTable = []
      arr.forEach(item => {
        let numbers = Number(item.pitchNumber)
        // 转化时间为固定日期格式
        if (typeof item.startTime === 'object') {
          item.startTime = this.formatDate(item.startTime, 'yyyy-MM-dd HH:mm:ss')
        } else if (item.startTime && typeof item.startTime === 'string' && item.startTime.length <= 8) {
          item.startTime = this.formatDate(new Date('1970-01-01 ' + item.startTime), 'yyyy-MM-dd HH:mm:ss')
        }
        // 根据开始时间、课节数、上课时间、休息时间计算出时间段
        for (let i = 0; i < numbers; i++) {
          let classTimes = Number(item.classTimes) * 60 * 1000 // 上课时间，单位ms
          let theRestTime = Number(item.theRestTime) * 60 * 1000 // 休息时间，单位ms
          let firstTime = new Date(item.startTime).getTime() // 第一节课开始时间，毫秒数
          let startTime = new Date(firstTime + i * (classTimes + theRestTime))
          let endTime = new Date(firstTime + (i + 1) * classTimes + i * theRestTime)
          let timeObj = {
            pointInTimeName: item.pointInTimeName,
            pointInTime: item.pointInTime,
            lessonNumber: i + 1,
            pitchNumber: Number(item.pitchNumber),
            startTime: startTime,
            endTime: endTime
          }
          this.timeTable.push(timeObj)
        }
      })
      this.getLessonNumber()
    },
    clearTimeTable () {
      ClearTimeTable().then(res => {
        this.isEmpty = true
        this.$message.success(`数据清除成功！`)
        this._getDailySchedule()
        this.tableData = [
          {pointInTimeName: '上午', pointInTime: 'Forenoon', pitchNumber: 0, classTimes: 0, theRestTime: 0},
          {pointInTimeName: '下午', pointInTime: 'AfterNoon', pitchNumber: 0, classTimes: 0, theRestTime: 0},
          {pointInTimeName: '晚上', pointInTime: 'Night', pitchNumber: 0, classTimes: 0, theRestTime: 0}
        ]
      }).catch(err => {
        this.btnShow = false
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 计算出上午，下午，晚上分别所占有的行号
    getLessonNumber () {
      this.forenoonNum = 0
      this.noonNum = 0
      this.nightNum = 0
      this.timeTable.forEach((item, i) => {
        if (item.pointInTimeName === '上午') {
          this.forenoonNum++
        } else if (item.pointInTimeName === '下午') {
          this.noonNum++
        } else {
          this.nightNum++
        }
      })
    },
    formatDate (date, format) {
      if (!date) return
      if (!format) format = 'yyyy-MM-dd'
      switch (typeof date) {
        case 'string':
          date = new Date(date.replace(/-/, '/'))
          break
        case 'number':
          date = new Date(date)
          break
      }
      if (!(date instanceof Date)) return
      var dict = {
        'yyyy': date.getFullYear(),
        'M': date.getMonth() + 1,
        'd': date.getDate(),
        'H': date.getHours(),
        'm': date.getMinutes(),
        's': date.getSeconds(),
        'MM': ('' + (date.getMonth() + 101)).substr(1),
        'dd': ('' + (date.getDate() + 100)).substr(1),
        'HH': ('' + (date.getHours() + 100)).substr(1),
        'mm': ('' + (date.getMinutes() + 100)).substr(1),
        'ss': ('' + (date.getSeconds() + 100)).substr(1)
      }
      return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
        return dict[arguments[0]]
      })
    },
    save () {
      let AfterNoonTime, ForenoonTime, NightTime
      for (let i = this.tableData.length - 1; i >= 0; i--) {
        let item = this.tableData[i]
        // 课节、上课分钟数和休息分钟数为number类型
        item.pitchNumber = Number(item.pitchNumber)
        item.classTimes = Number(item.classTimes)
        item.theRestTime = Number(item.theRestTime)
        // 转化时间为固定日期格式
        if (typeof item.startTime === 'object') {
          item.startTime = this.formatDate(item.startTime, 'yyyy-MM-dd HH:mm:ss')
        } else if (item.startTime && typeof item.startTime === 'string' && item.startTime.length <= 8) {
          item.startTime = this.formatDate(new Date('1970-01-01 ' + item.startTime), 'yyyy-MM-dd HH:mm:ss')
        }
        // 获取早中晚的开始时间，用于比较大小
        if (item.pointInTime === 'Forenoon') {
          ForenoonTime = item.startTime
        } else if (item.pointInTime === 'AfterNoon') {
          AfterNoonTime = item.startTime
        } else {
          NightTime = item.startTime
        }
      }
      let dailyScheduleDate = JSON.parse(JSON.stringify(this.tableData))
      for (let i = dailyScheduleDate.length - 1; i >= 0; i--) {
        let item = dailyScheduleDate[i]
        // 对于课节或分钟数不存在的数据进行处理，删除或提示
        if (!item.pitchNumber &&  !item.classTimes) {
          dailyScheduleDate.splice(i, 1)
        } else if ((!item.pitchNumber && item.classTimes) || (item.pitchNumber && !item.classTimes)) {
          this.$alert(`请完善【${item.pointInTimeName}】的课节数或上课分钟数！`)
          return
        }
      }
      if (dailyScheduleDate.length === 0) {
        this.$alert(`未设置任何有效的数据，请核查！`)
        return
      }
      if (ForenoonTime > AfterNoonTime) {
        this.$alert('上午第一节课的开始时间不得大于下午的时间')
        return
      }
      if (NightTime !== '1970-01-01 00:00:00' && ForenoonTime > NightTime) {
        this.$alert('上午第一节课的开始时间不得大于晚上的时间')
        return
      }
      if (NightTime !== '1970-01-01 00:00:00' && AfterNoonTime > NightTime) {
        this.$alert('下午第一节课的开始时间不得大于晚上的时间')
        return
      }
      if (this.isEmpty) {
        createDailySchedule(dailyScheduleDate).then(result => {
          this.$message.success('保存成功')
          this._getDailySchedule()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        updateDailySchedule(dailyScheduleDate).then(result => {
          this.$message.success('保存成功')
          this._getDailySchedule()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.t-setting{
  /deep/.el-table th > .cell,
  /deep/.el-table--border td:first-child .cell{
    font-weight: 600;
    color:#333;
  }
  /deep/.el-date-editor.el-input,
  /deep/.el-date-editor.el-input__inner{
    width:100%;
  }
}
.t-timeTable{
  /deep/.el-table th > .cell,
  /deep/.el-table--border td:first-child .cell{
    font-weight: 600;
    color:#333;
  }
  /deep/.el-table--border td[rowspan="1"] .cell{
    font-weight: normal;
  }
  /deep/.el-table--border th,
  /deep/.el-table--border td{
    background: #a3d3ff;
  }
  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td  {
    background-color: #c4e3ff;
  }
  /deep/.el-table--border td[rowspan="1"]{
    background-color: #fff;
  }
}
.numInput{
  /deep/.el-input__inner{
    padding:0 7px;
  }
}
</style>
