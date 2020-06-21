<template>
  <!-- 在线学习考勤 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-show="visible">
    <el-tab-pane label="在线学习考勤统计" name="first">
      <el-form ref="form" :model="form_1" label-width="80px" :inline="true">
        <el-form-item label="课程名称">
          <el-select v-model="form_1.courseName" placeholder="全部">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="form_1.studentName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="searchFor">搜索</el-button>
          <el-button type="primary" @click.native="Reset">重置</el-button>
          <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
            <el-button
              v-show="isShow"
              type="primary"
              v-print="'#onlineAttend_1'"
              @click="printCompletion()"
            >打印</el-button>
          </el-tooltip>
          <!-- @click.native="searchFor(scope.row)" -->
        </el-form-item>
      </el-form>
      <el-table
        id="onlineAttend_1"
        :data="tableData_1"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="yearSemesterName" label="学年学期" align="center"></el-table-column>
        <el-table-column prop="projectName" label="培训项目" align="center"></el-table-column>
        <el-table-column prop="className" label="班级" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
        <el-table-column prop="due" label="应到" align="center"></el-table-column>
        <el-table-column prop="actual" label="实到" align="center"></el-table-column>
        <el-table-column prop="leaveEarly" label="早退" align="center"></el-table-column>
        <el-table-column prop="absent" label="缺席" align="center"></el-table-column>
        <el-table-column prop="beLate" label="迟到" align="center"></el-table-column>
        <el-table-column prop="leave" label="请假" align="center"></el-table-column>
        <el-table-column prop="arriveOnTime" label="按时到" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="考勤记录" name="second">
      <el-form ref="form" :model="form_2" label-width="80px" :inline="true">
        <el-form-item label="课程名称">
          <el-select v-model="form_2.courseName" placeholder="全部">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="form_2.studentName"></el-input>
        </el-form-item>
        <el-form-item label="考勤状态">
          <el-select v-model="form_2.attendanceStatus" placeholder="全部">
            <el-option
              v-for="item in attendanceStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="searchFor">搜索</el-button>
          <el-button type="primary" @click.native="Reset">重置</el-button>
          <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
            <el-button
              v-show="isShow"
              type="primary"
              v-print="'#onlineAttend_2'"
              @click="printCompletion()"
            >打印</el-button>
          </el-tooltip>
          <!-- @click.native="searchFor(scope.row)" -->
        </el-form-item>
      </el-form>
      <el-table
        id="onlineAttend_2"
        :data="tableData_2"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="yearSemesterName" label="学年学期" align="center"></el-table-column>
        <el-table-column prop="projectName" label="培训项目" align="center"></el-table-column>
        <el-table-column prop="className" label="班级" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
        <el-table-column prop="attendanceDate" label="考勤日期" align="center">
          <template slot-scope="scope">{{new Date(scope.row.attendanceDate) | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="section" label="节次" align="center"></el-table-column>
        <el-table-column label="考勤状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.attendanceStatus=='Leave'">请假</p>
            <p v-if="scope.row.attendanceStatus=='LeaveEarly'">早退</p>
            <p v-if="scope.row.attendanceStatus=='BeLate'">迟到</p>
            <p v-if="scope.row.attendanceStatus=='Absent'">缺席</p>
            <p v-if="scope.row.attendanceStatus=='OnTime'">准时</p>
          </template>
        </el-table-column>
        <el-table-column label="考勤方式" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.attendanceType=='WeChat'">微信端</p>
            <p v-if="scope.row.attendanceType=='Pc'">PC端</p>
            <p v-if="scope.row.attendanceType=='Unknown'">未知</p>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">{{new Date(scope.row.signInTime) | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination
        ref="pagination"
        :total="total"
        @sizeChange="handleSize"
        @currentChange="handleCurrent"
      ></pagination>
    </div>
  </el-tabs>
</template>
<script>
import { pageSizes, pageSize } from "@/config.js";
import pagination from "@/components/pagination";

import {
  GetAttendanceRecordStatistics,
  GetAttendanceRecord,
  GetCourseList //课程下拉列表
} from "@/server/basic-module";
export default {
  props: ["visible", "data", "nodeId"],
  components: { pagination },
  data() {
    return {
      isShow: true,
      form_1: {
        courseName: null,
        studentName: null
      },
      form_2: {
        courseName: null,
        studentName: null,
        attendanceStatus: null
      },
      total: 0,
      SkipCount: 0,
      pageSizes,
      pageSize,
      activeName: "first",
      tableData_1: [],
      tableData_2: [],
      courseList: [],
      attendanceStatusList: [
        { name: "请假", id: "Leave" },
        { name: "早退", id: "LeaveEarly" },
        { name: "迟到", id: "BeLate" },
        { name: "缺席", id: "Absent" },
        { name: "准时", id: "OnTime" }
      ]
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this._GetCourseList();
        this._GetAttendanceRecord(this.SkipCount, this.pageSize);
      } else {
        this.activeName = "first";
        this.tableData_1 = [];
        this.tableData_2 = [];
        this.form_1 = {
          courseName: null,
          studentName: null
        };
        this.form_2 = {
          courseName: null,
          studentName: null,
          attendanceStatus: null
        };
      }
    },
    activeName() {
      if (this.activeName == "first") {
        this.SkipCount = 0;
        this._GetAttendanceRecord(this.SkipCount, this.pageSize);
      } else {
        this.SkipCount = 0;
        this._GetAttendanceRecordStatistics(this.SkipCount, this.pageSize);
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
    //----------------在线学习考勤记录统计----------------
    _GetAttendanceRecord(SkipCount, pageSize) {
      let data = {
        ClassId: this.nodeId,
        StudentName: this.form_1.studentName,
        CourseId: this.form_1.courseName,
        SkipCount,
        MaxResultCount: pageSize
      };
      GetAttendanceRecord(data).then(res => {
        this.tableData_1 = res.items;
        if (res.totalCount > 0) {
          if (this.activeName == "first") {
            this.total = res.totalCount;
          }
        } else {
          this.total = 0;
        }
      });
    },
    searchFor() {
      if (this.activeName == "first") {
        this._GetAttendanceRecord(this.SkipCount, this.pageSize);
      } else {
        this._GetAttendanceRecordStatistics(this.SkipCount, this.pageSize);
      }
    },
    Reset() {
      if (this.activeName == "first") {
        this.form_1 = {
          courseName: null,
          studentName: null
        };
        this._GetAttendanceRecord(this.SkipCount, this.pageSize);
      } else {
        this.form_2 = {
          courseName: null,
          studentName: null,
          attendanceStatus: null
        };
        this._GetAttendanceRecordStatistics(this.SkipCount, this.pageSize);
      }
    },
    //--------------考勤记录------------------
    _GetAttendanceRecordStatistics(SkipCount, pageSize) {
      let data = {
        ClassId: this.nodeId,
        studentName: this.form_2.studentName,
        CourseId: this.form_2.courseName,
        attendanceStatus: this.form_2.attendanceStatus,
        SkipCount,
        MaxResultCount: pageSize
      };
      GetAttendanceRecordStatistics(data).then(res => {
        this.tableData_2 = res.items;
        if (res.totalCount > 0) {
          if (this.activeName == "second") {
            this.total = res.totalCount;
          }
          // res.items.forEach(item => {
          //   totalLiveTimeNum += item.theLiveTimeSecond;
          //   totalWatchTimeNum += item.watchTheTimeSecond;
          // });
        } else {
          this.total = res.totalCount;
        }
      });
    },

    //课程下拉列表
    _GetCourseList() {
      GetCourseList(this.nodeId).then(res => {
        this.courseList = res;
      });
    },
    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      if (this.activeName == "first") {
        this._GetAttendanceRecord(SkipCount, pageSize);
      } else {
        this._GetAttendanceRecordStatistics(SkipCount, pageSize);
      }
    },

    /*接收当前页数*/
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      if (this.activeName == "first") {
        this._GetAttendanceRecord(SkipCount, pageSize);
      } else {
        this._GetAttendanceRecordStatistics(SkipCount, pageSize);
      }
    },
    formatter(row, column) {
      return row.address;
    },
    handleClick(tab, event) {}
  }
};
</script>

<style lang="less" scoped>
.list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 0;
  margin-top: 10px;
  li {
    &.explanation {
      width: 96.1% !important;
      span {
        &:first-child {
          width: 14.48%;
        }
        &:last-child {
          width: 75.52%;
        }
      }
    }
    width: 48%;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #e5e5ee;
    margin-top: -1px;
    margin-right: -1px;
    span {
      display: block;
      &:first-child {
        width: 30%;
        min-width: 165px;
        background-color: rgba(238, 238, 238, 0.5);
        font-size: 14px;
        color: #333;
        padding-left: 10px;
        white-space: nowrap;
      }
      &:last-child {
        width: 70%;
        color: #000;
        font-size: 12px;
        padding-left: 10px;
        text-align: center;
      }
    }
  }
}
.t-operate-footer {
  margin: 10px 20px 10px 0;
}
</style>