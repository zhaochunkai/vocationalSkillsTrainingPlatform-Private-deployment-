<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-show="visible">
    <el-tab-pane label="项目课表" name="first">
      <div class="header">
        <div style="width:264px;min-width:264px">
          <span>学期</span>
          <span
            style="font-size:24px;font-weight:bold;margin-left:10px"
          >{{SemesterList.semesterName}}</span>
        </div>
        <ul>
          <li
            v-for="item in weekData"
            :key="item.week"
            @click="changeBG($event,item.week)"
            :class="{active:digitalMark==`${item.week}周`}"
          >{{`${item.week}周`}}</li>
        </ul>
      </div>

      <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
        <el-button
          v-show="isShow"
          type="primary"
          v-print="'#printCompletion_11'"
          @click="printCompletion()"
        >打印</el-button>
      </el-tooltip>
      <!-- 排课表 -->
      <div class="weeks" id="printCompletion_11">
        <el-table
          class="t-table-list"
          ref="formTabel"
          border
          size="small"
          :data="cellData"
          tooltip-effect="dark"
          style="width: 100%;margin-top:10px;"
          v-if="cellData.length>0"
        >
          <el-table-column label="节次/星期" width="140" align="center" prop="jieci"></el-table-column>
          <el-table-column label align="center" prop="Monday" v-if="cellData[0].Monday">
            <template slot="header" slot-scope="scope">
              <span>星期一</span>
              <br />
              <span>{{weekDays[0]}}</span>
            </template>
            <template slot-scope="scope">
              <div
                class="showCell"
                v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
              >不上课</div>
              <div v-else>
                <span>{{scope.row[scope.column.property].classRoomName}}</span>
                <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                <span>{{scope.row[scope.column.property].courseName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期二" align="center" prop="Tuesday" v-if="cellData[0].Tuesday">
            <template slot="header" slot-scope="scope">
              <span>星期二</span>
              <br />
              <span>{{weekDays[1]}}</span>
            </template>
            <template slot-scope="scope">
              <div
                class="showCell"
                v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
              >不上课</div>
              <div v-else>
                <span>{{scope.row[scope.column.property].classRoomName}}</span>
                <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                <span>{{scope.row[scope.column.property].courseName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期三" align="center" prop="Wednesday" v-if="cellData[0].Wednesday">
            <template slot="header" slot-scope="scope">
              <span>星期三</span>
              <br />
              <span>{{weekDays[2]}}</span>
            </template>
            <template slot-scope="scope">
              <div
                class="showCell"
                v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
              >不上课</div>
              <div v-else>
                <span>{{scope.row[scope.column.property].classRoomName}}</span>
                <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                <span>{{scope.row[scope.column.property].courseName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期四" align="center" prop="Thursday" v-if="cellData[0].Thursday">
            <template slot="header" slot-scope="scope">
              <span>星期四</span>
              <br />
              <span>{{weekDays[3]}}</span>
            </template>
            <template slot-scope="scope">
              <div
                class="showCell"
                v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
              >不上课</div>
              <div v-else>
                <span>{{scope.row[scope.column.property].classRoomName}}</span>
                <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                <span>{{scope.row[scope.column.property].courseName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期五" align="center" prop="Friday" v-if="cellData[0].Friday">
            <template slot="header" slot-scope="scope">
              <span>星期五</span>
              <br />
              <span>{{weekDays[4]}}</span>
            </template>
            <template slot-scope="scope">
              <div
                class="showCell"
                v-if="scope.row[scope.column.property] && scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
              >不上课</div>
              <div v-else>
                <span>{{scope.row[scope.column.property].classRoomName}}</span>
                <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                <span>{{scope.row[scope.column.property].courseName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期六" align="center" prop="Saturday" v-if="cellData[0].Saturday">
            <template slot="header" slot-scope="scope">
              <span>星期六</span>
              <br />
              <span>{{weekDays[5]}}</span>
            </template>
            <template slot-scope="scope">
              <div
                class="showCell"
                v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
              >不上课</div>
              <div v-else>
                <span>{{scope.row[scope.column.property].classRoomName}}</span>
                <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                <span>{{scope.row[scope.column.property].courseName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期日" align="center" prop="Sunday" v-if="cellData[0].Sunday">
            <template slot="header" slot-scope="scope">
              <span>星期日</span>
              <br />
              <span>{{weekDays[6]}}</span>
            </template>
            <template slot-scope="scope">
              <div
                class="showCell"
                v-if="scope.row[scope.column.property] && scope.row[scope.column.property].flagBanOnArranging"
              >不上课</div>
              <div v-else>
                <span>{{scope.row[scope.column.property].classRoomName}}</span>
                <span style="color:#00f">{{scope.row[scope.column.property].teacherName}}</span>
                <span>{{scope.row[scope.column.property].courseName}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import {
  getGradeTree,
  getDefaultSemester,
  getTeachCalendar
} from "@/server/basic-module";
import {
  getCourseSchedulingByWeek,
  getCourseScheduling
} from "@/server/online-module";
import { pageSizes, pageSize } from "@/config.js";
import pagination from "@/components/pagination";
export default {
  props: ["visible", "data", "nodeId"],
  components: { pagination },
  data() {
    return {
      isShow: true,
      gradeSchedule: [],
      SemesterId: "",
      weekDays: [],
      SemesterList: [],
      cellDefaultData: [],
      weekOfSemester: 1, // 周次
      cellData: [],
      digitalMark: "",
      total: 0,
      pageSizes,
      pageSize,
      activeName: "first",
      tableData: [],
      weekData: []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this._getCourseSchedulingByWeek();
        this._getDefaultSemester();
      }
    }
  },
  methods: {
    //----------------------打印---------------------------
    printCompletion() {
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 1000);
    },
    _getTeachCalendar() {
      // -----------------------查询默认学期的教学日程
      getTeachCalendar(this.semesterId).then(result => {
        this.form = Object.assign({}, result);
        this.checkedWeeks = this.form.weekIds.split(",");
        this.count =
          this.form.forenoonCount +
          this.form.afternoonCount +
          this.form.nightCount;
        this.tableData = []; // 课节表格框架
        this.blkj("上午", this.form.forenoonCount, "Forenoon");
        this.blkj("下午", this.form.afternoonCount, "AfterNoon");
        this.blkj("晚上", this.form.nightCount, "Night");
        let weekIdList = this.checkedWeeks;
        this.cellData = Object.assign([], this.tableData);
        let data = Object.assign([], this.form.teachCalendars);
        this.cellData.forEach(item => {
          data.forEach(arr => {
            if (
              item.pointInTime == arr.pointInTime &&
              item.lessonNumber == arr.lessonNumber
            ) {
              // 若节次相同，那么将星期作为元素插入
              let newArr = Object.assign({}, arr);
              this.$set(item, arr.week, newArr);
            }
          });
        });
        this.cellDefaultData = JSON.parse(JSON.stringify(this.cellData));
      });
    },

    blkj(kj, num, pointInTime) {
      // -------------------------遍历课节数字
      for (var i = 1; i <= num; i++) {
        let ss = "";
        if (i == 1) {
          ss = "一";
        } else if (i == 2) {
          ss = "二";
        } else if (i == 3) {
          ss = "三";
        } else if (i == 4) {
          ss = "四";
        }
        this.tableData.push({
          jieci: kj + "第" + ss + "节",
          pointInTime: pointInTime,
          lessonNumber: i,
          flagBanOnArranging: false
        });
      }
    },
    _getCourseSchedulingByWeek() {
      // 获取默认学期，某班的周次排课情况
      getCourseSchedulingByWeek(this.nodeId).then(result => {
        this.weekData = result;
      });
    },
    getNowWeek() {
      // -------------------获取今天所在的周---------------------
      let startWeekDay =
        new Date(this.SemesterList.semesterBeginTime).getDay() == 0
          ? 7
          : new Date(this.SemesterList.semesterBeginTime).getDay(); // 开始时间的星期数 1-7
      let endWeekDay = new Date().getDay() == 0 ? 7 : new Date().getDay(); // 今天星期数 1-7
      let days = Math.ceil(
        (new Date() - new Date(this.SemesterList.semesterBeginTime)) /
          7 /
          24 /
          3600 /
          1000
      ); // 今天是第几周
      if (startWeekDay > endWeekDay) {
        days += 1;
      }
      this.weekOfSemester = days >= 1 ? days : 1;
      this.digitalMark = `${this.weekOfSemester}周`;
      this._getCourseScheduling();
    },
    /* --------------------------------------------------------------------排课格子-------------------------------------------------- */
    _getCourseScheduling() {
      // ---------------获取某学期某班级某周的排课内容----------------
      this.cellData = JSON.parse(JSON.stringify(this.cellDefaultData));
      let data = {
        GradeId: this.nodeId,
        Week: this.weekOfSemester
      };
      getCourseScheduling(data).then(result => {
        // weekOfSemester
        this.gradeSchedule = result;
        // 获取行程安排列表
        let schedulingArr = [];
        result.forEach(res => {
          schedulingArr = schedulingArr.concat(res.scheduling);
        });
        let teacherArr = [];
        if (result.length) {
          // 将本周所有的排课老师筛选出来，放入数组中
          result[0].scheduling.forEach(item => {
            if (teacherArr.indexOf(item.teacherId) === -1) {
              teacherArr.push(item.teacherId);
            }
          });
        }
        this.displayScheduling(schedulingArr, this.cellData);
      });
    },
    changeBG(e, week) {
      this.getWeekDate(this.SemesterList.semesterBeginTime, week);
      this.digitalMark = e.target.innerHTML;
      this.weekOfSemester = week; // 周次
      this._getCourseScheduling();
    },
    handleClick(tab, event) {
      //   console.log(tab, event);
    },
    _getDefaultSemester() {
      // --------------------获取默认学期
      getDefaultSemester()
        .then(result => {
          if (result.id) {
            // 如果存在默认学期
            this.SemesterList = Object.assign({}, result); // 学期列表
            this.semesterId = result.id; // 学期id
            let startWeekDay =
              new Date(result.semesterBeginTime).getDay() === 0
                ? 7
                : new Date(result.semesterBeginTime).getDay(); // 开始时间的星期数 1-7
            let endWeekDay =
              new Date(result.semesterEndTime).getDay() === 0
                ? 7
                : new Date(result.semesterEndTime).getDay(); // 结束时间的星期数 1-7
            this.weeks = Math.ceil(
              (new Date(result.semesterEndTime) -
                new Date(result.semesterBeginTime) +
                24 * 3600 * 1000) /
                7 /
                24 /
                3600 /
                1000
            ); // 学期总周数
            if (startWeekDay > endWeekDay) {
              this.weeks += 1; // 学期总周数
            }
            this._getTeachCalendar(); // 通过默认学期查询教学日程设置
            if (this.SemesterList.semesterBeginTime) {
              this.getNowWeek(); // 获取当天所在的周
              this.getWeekDate(
                this.SemesterList.semesterBeginTime,
                this.weekOfSemester
              );
            }
          } else {
            // 不存在默认学期则前往设置
            this.$confirm(
              `请前往【学年学期】模块设置默认学期， 是否前往？`,
              "提示",
              {
                confirmButtonText: "前往",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.$router.push({ path: "/academicYear/semester" });
              })
              .catch();
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: "error"
          });
        });
    },
    getWeekDate(semesterStart, weeks) {
      // ---------------获取所选周次的开始和结束日期--------------------
      let week = Number(weeks);
      let weekNum =
        new Date(semesterStart).getDay() === 0
          ? 7
          : new Date(semesterStart).getDay(); // 获取开始时间所在的星期 ，1-7

      let ms = new Date(semesterStart).getTime(); // 获取学期开始时间的毫秒数
      let start = ms + (week - 1) * 7 * 24 * 3600 * 1000; // N周后，和学期开始时间的星期相同的时间，如N周后的星期几
      this.weekDays = [];
      for (let i = 1; i <= 7; i++) {
        let dateTime = new Date(
          start - (weekNum - i) * 24 * 3600 * 1000
        ).toLocaleDateString();
        this.weekDays.push(dateTime);
      }
    },

    // 组合显示排课数据
    displayScheduling(schedulingArr, cellData) {
      let weekIds = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ];
      cellData.forEach(item => {
        weekIds.forEach((week, i) => {
          if (!!item[week]) {
            item[week] = Object.assign(item[week], {
              dataTime: this.weekDays[i]
            });
          }
        });
      });
      if (schedulingArr.length === 0) {
        cellData.forEach(item => {
          weekIds.forEach(week => {
            if (!!item[week]) {
              this.$set(item[week], "classRoomName", "");
              this.$set(item[week], "courseName", "");
              this.$set(item[week], "teacherName", "");
            }
          });
        });
      } else {
        schedulingArr.forEach(scheduling => {
          // 筛选时间课程节点
          let currentTimeLession = cellData.find(
            cell =>
              cell.pointInTime === scheduling.pointInTime &&
              cell.lessonNumber === scheduling.lessonNumber
          );
          if (currentTimeLession && scheduling.week) {
            this.$set(
              currentTimeLession[scheduling.week],
              "classRoomName",
              scheduling.classRoomName
            );
            this.$set(
              currentTimeLession[scheduling.week],
              "courseName",
              scheduling.courseName
            );
            this.$set(
              currentTimeLession[scheduling.week],
              "teacherName",
              `【${scheduling.teacherName}】`
            );
            this.$set(
              currentTimeLession[scheduling.week],
              "courseId",
              scheduling.courseId
            );
            this.$set(
              currentTimeLession[scheduling.week],
              "teacherId",
              scheduling.teacherId
            );
            this.$set(
              currentTimeLession[scheduling.week],
              "classRoomId",
              scheduling.classRoomId
            );
            this.$set(
              currentTimeLession[scheduling.week],
              "dataTime",
              scheduling.dataTime
            ); // 将当天的日期添加到表格中
            currentTimeLession[scheduling.week].createScheduling = [];
            currentTimeLession[scheduling.week].createScheduling.push(
              scheduling
            );
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.t-operate-footer {
  margin: 10px 20px 10px 0;
}
.header {
  display: flex;
  align-items: center;
  ul {
    display: flex;
    flex-wrap: wrap;
  }
  li {
    list-style: none;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    width: 60px;
    height: 25px;
    line-height: 25px;
    color: #333333;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.349019607843137);
    margin: 6px;
  }
  .active {
    background-color: rgba(153, 153, 153, 1);
    color: #ffff;
  }
}
</style>