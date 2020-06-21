<template>
  <!-- 直播考勤 -->
  <el-tabs v-model="activeName" type="card" v-show="visible">
    <el-tab-pane label="直播考勤" name="first">
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="课程名称">
          <el-select v-model="form.courseName" placeholder="全部">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.studentName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="searchFor">搜索</el-button>
          <el-button type="primary" @click.native="Reset">重置</el-button>
          <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
            <el-button
              v-show="isShow"
              type="primary"
              v-print="'#liveAttend'"
              @click="printCompletion()"
            >打印</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-table
        id="liveAttend"
        :data="tableData"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="projectName" label="项目" align="center"></el-table-column>
        <el-table-column prop="courseName" label="所属课程" align="center"></el-table-column>
        <el-table-column prop="accumulatedLearningTime" label="累计学时（学时）" align="center"></el-table-column>
        <el-table-column prop="due" label="应参加" align="center"></el-table-column>
        <el-table-column prop="actual" label="实际参加" align="center"></el-table-column>
        <el-table-column prop="beLate" label="迟到" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { pageSizes, pageSize } from "@/config.js";
import pagination from "@/components/pagination";
import {
  GetCourseList, //课程下拉列表
  GetLiveAttendance
} from "@/server/basic-module";
export default {
  props: ["visible", "data", "nodeId"],
  components: { pagination },
  data() {
    return {
      isShow: true,
      courseList: [],
      form: { courseName: null, studentName: null },
      total: 0,
      pageSizes,
      pageSize,
      activeName: "first",
      tableData: []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this._GetCourseList();
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
    //搜索
    searchFor() {
      this._GetLiveAttendance();
    },
    //重置
    Reset() {
      this.form = {
        courseName: null,
        studentName: null
      };
      this._GetLiveAttendance();
    },
    //获取列表信息
    _GetLiveAttendance() {
      let data = {
        ClassId: this.nodeId,
        StudentName: this.form.studentName,
        CourseId: this.form.courseName
      };
      GetLiveAttendance(data).then(res => {
        this.tableData = res;
      });
    },
    //课程下拉列表
    _GetCourseList() {
      GetCourseList(this.nodeId).then(res => {
        this.courseList = res;
        this._GetLiveAttendance();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.t-operate-footer {
  margin: 10px 20px 10px 0;
}
</style>