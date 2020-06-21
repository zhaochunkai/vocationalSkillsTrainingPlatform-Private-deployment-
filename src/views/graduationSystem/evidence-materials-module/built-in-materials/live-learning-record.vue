<template>
  <!-- 直播学习记录 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-show="visible">
    <el-tab-pane label="直播学习统计" name="first">
      <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
        <el-button
          v-show="isShow"
          type="primary"
          v-print="'#liveStudy_1'"
          @click="printCompletion()"
        >打印</el-button>
      </el-tooltip>
      <el-table
        id="liveStudy_1"
        :data="tableData_1"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="studentName" label="用户姓名" align="center"></el-table-column>
        <el-table-column prop="className" label="所在班级" align="center"></el-table-column>
        <el-table-column prop="totalViewingTime" label="总观看时长" align="center"></el-table-column>
        <el-table-column prop="shouldAttend" label="应参加" align="center"></el-table-column>
        <el-table-column prop="theActualToAttend" label="实际参加" align="center"></el-table-column>
        <el-table-column prop="absent" label="缺席" align="center"></el-table-column>
        <el-table-column prop="beLate" label="迟到" align="center"></el-table-column>
        <el-table-column prop="normal" label="正常" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="直播学习记录" name="second">
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item label="学生姓名">
          <el-input v-model="form.studentName"></el-input>
        </el-form-item>
        <el-form-item label="课程">
          <el-select v-model="form.courseName" placeholder="全部">
            <el-option
              v-for="item in courseList"
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
              v-print="'#liveStudy_2'"
              @click="printCompletion()"
            >打印</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <el-table
        id="liveStudy_2"
        :data="tableData_2"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="liveName" label="直播名称" align="center"></el-table-column>
        <el-table-column prop="projectName" label="所属项目" align="center"></el-table-column>
        <el-table-column prop="courseName" label="所属课程" align="center"></el-table-column>
        <el-table-column prop="theLiveTime" label="直播时间" align="center"></el-table-column>
        <el-table-column prop="watchTheTime" label="观看时长" align="center"></el-table-column>
        <el-table-column label="学习状态" align="center">
          <template slot-scope="scope">{{scope.row.learningState?"正常":"异常"}}</template>
        </el-table-column>
        <el-table-column label="考勤状态" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.attendanceStatus=='NotCheck'">未到</p>
            <p v-if="scope.row.attendanceStatus=='Normal'">正常</p>
            <p v-if="scope.row.attendanceStatus=='Late'">迟到</p>
            <p v-if="scope.row.attendanceStatus=='Exception'">异常</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="header">
        <span>总直播时间：{{totalLiveTime}}</span>
        <span>观看总时长：{{totalWatchTime}}</span>
      </div>
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
import {
  GetCourseList, //课程下拉列表
  GetLiveLearningStatistics, //直播学习统计
  GetLiveLearningRecord //直播学习记录
} from "@/server/basic-module";
import pagination from "@/components/pagination";
export default {
  props: ["visible", "data", "nodeId"],
  components: { pagination },
  data() {
    return {
      isShow: true,
      form: {
        studentName: null,
        courseName: null
      },
      total: 0,
      SkipCount: 0,
      pageSizes,
      pageSize,
      activeName: "first",
      courseList: [],
      tableData_1: [],
      tableData_2: [],
      totalLiveTime: "", //总直播时间
      totalWatchTime: "" //观看总时长
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this._GetLiveLearningStatistics(this.SkipCount, this.pageSize);
      } else {
        this.activeName = "first";
        this.form = { studentName: null, courseName: null };
      }
    },
    activeName() {
      if (this.activeName == "first") {
        this.SkipCount = 0;
        this._GetLiveLearningStatistics(this.SkipCount, this.pageSize);
      } else {
        this.SkipCount = 0;
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
    //---------------------------------直播学习统计--------------------------------
    _GetLiveLearningStatistics(SkipCount, pageSize) {
      let data = {
        ClassId: this.nodeId,
        SkipCount,
        MaxResultCount: pageSize
      };
      GetLiveLearningStatistics(data).then(res => {
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
    //--------------------------------------直播学习记录--------------------------

    Reset() {
      this.form = {
        courseName: null,
        studentName: null
      };
      this._GetLiveLearningRecord(this.SkipCount, this.pageSize);
    },
    searchFor() {
      this._GetLiveLearningRecord(this.SkipCount, this.pageSize);
    },
    //课程下拉列表
    _GetCourseList() {
      GetCourseList(this.nodeId).then(res => {
        this.courseList = res;
        this._GetLiveLearningRecord(this.SkipCount, this.pageSize);
      });
    },
    _GetLiveLearningRecord(SkipCount, pageSize) {
      let totalLiveTimeNum = 0;
      let totalWatchTimeNum = 0;
      let data = {
        ClassId: this.nodeId,
        StudentName: this.form.studentName,
        CourseId: this.form.courseName,
        SkipCount,
        MaxResultCount: pageSize
      };
      GetLiveLearningRecord(data).then(res => {
        this.tableData_2 = res.items;
        if (res.totalCount > 0) {
          if (this.activeName == "second") {
            this.total = res.totalCount;
          }
          res.items.forEach(item => {
            totalLiveTimeNum += item.theLiveTimeSecond;
            totalWatchTimeNum += item.watchTheTimeSecond;
          });
        } else {
          this.total = 0;
        }
        this.totalLiveTime = this.MS_Change(totalLiveTimeNum);
        this.totalWatchTime = this.MS_Change(totalWatchTimeNum);
      });
    },
    //秒分转换
    MS_Change(second) {
      let d = Math.floor(second / (60 * 60 * 24));
      let h = Math.floor((second % (60 * 60 * 24)) / (60 * 60));
      let m = Math.floor(((second % (60 * 60 * 24)) % (60 * 60)) / 60);
      let s = Math.floor(((second % (60 * 60 * 24)) % (60 * 60)) % 60);
      return `${d}天${h}时${m}分${s}秒`;
    },
    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      if (this.activeName == "first") {
        this._GetLiveLearningStatistics(SkipCount, pageSize);
      } else {
        this._GetLiveLearningRecord(SkipCount, pageSize);
      }
    },

    /*接收当前页数*/
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      if (this.activeName == "first") {
        this._GetLiveLearningStatistics(SkipCount, pageSize);
      } else {
        this._GetLiveLearningRecord(SkipCount, pageSize);
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
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 40px;
    line-height: 40px;
    background-color: #ebebd0;
    border: 1px solid #bdbd65;
    padding: 0 20px;
    margin: 0 20px;
  }
}
.t-operate-footer {
  margin: 10px 20px 10px 0;
}
</style>