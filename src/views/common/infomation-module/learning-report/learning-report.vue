<template>
  <div class="student-detail-container" id="printContent">
    <div class="tab">
      <div class="top-title">
        <h3>个人学习报告</h3>
        <div>
          <el-tooltip class="item" effect="dark" content="建议横向打印；为了更好的效果，请勾选背景图形；若遇到显示不全的现象，请自定义缩放">
            <!-- 70 -->
            <el-button
              type="primary"
              v-print="'#printContent'"
              v-show="isShow"
              @click="printCompletion"
            >打印</el-button>
          </el-tooltip>
        </div>
      </div>
      <!-- 证书说明 -->
      <div class="certificate">
        <div class="content">
          <div class="wrap">
            <span>{{studentBasicinfo.overview}}</span>
          </div>
          <div class="comp">
            <span>{{studentBasicinfo.issuer}}</span>
            <span>{{new Date() | formatDate_1}}</span>
            <img :src="officialIMG" alt />
          </div>
        </div>
      </div>
      <!-- 基本信息 -->
      <div class="title">
        <span>基本信息</span>
        <span class="line"></span>
      </div>
      <!-- 学员基础信息 -->
      <div class="infos">
        <div class="left">
          <el-avatar
            size="medium"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          ></el-avatar>
          <h4>个人信息</h4>
        </div>
        <div class="right">
          <p>
            姓名：
            <span>{{studentBasicinfo.name}}</span>
          </p>
          <p>
            性别：
            <span>{{studentBasicinfo.sex}}</span>
          </p>
          <p>
            出生日期：
            <span>{{new Date(studentBasicinfo.birthday) | formatDate_1}}</span>
          </p>
          <p>
            学历：
            <span>{{ studentBasicinfo.education}}</span>
          </p>
          <p>
            身份证号：
            <span>{{studentBasicinfo.idCard}}</span>
          </p>
          <p>
            联系电话：
            <span>{{studentBasicinfo.tel}}</span>
          </p>
          <p>
            邮箱：
            <span>{{studentBasicinfo.email}}</span>
          </p>
        </div>
      </div>
      <!-- 项目基本信息 -->
      <div class="project_info">
        <h4>项目基本信息</h4>
        <ul class="list">
          <li>
            <span>培训项目名称</span>
            <span>{{studentBasicinfo.projectName}}</span>
          </li>
          <li>
            <span>报名时间</span>
            <span>{{new Date(studentBasicinfo.recruitStudentsStartDate) | formatDate_1}}</span>
          </li>
          <li>
            <span>培训费用</span>
            <span>￥{{studentBasicinfo.charge}}</span>
          </li>
          <li>
            <span>招生人数</span>
            <span>{{studentBasicinfo.recruitStudentsNumbers}}</span>
          </li>
          <li>
            <span>培训时间段</span>
            <span>{{studentBasicinfo.trainingPeriod}}</span>
          </li>
          <li>
            <span>所在班级</span>
            <span>{{studentBasicinfo.class}}</span>
          </li>
          <li>
            <span>项目类型</span>
            <span>{{studentBasicinfo.type}}</span>
          </li>
          <li>
            <span>计划学时</span>
            <span>{{studentBasicinfo.planningTotalHours}}</span>
          </li>
          <!-- <li>
            <span>培训机构</span>
            <span>{{studentBasicinfo.issuer}}</span>
          </li>-->
          <li>
            <span>实际学时</span>
            <span>{{studentBasicinfo.actualStudyTotalDuration}}</span>
          </li>
        </ul>
      </div>
      <!-- 培训课程 -->
      <div class="course">
        <h4>培训课程</h4>
        <el-table
          class="t-table-list"
          ref="table"
          border
          size="small"
          tooltip-effect="dark"
          :data="studentBasicinfo.courses"
          row-key="id"
        >
          <el-table-column prop="name" label="课程名称" align="center"></el-table-column>
          <el-table-column prop="planningStudyDuration" label="要求学时" align="center"></el-table-column>
          <el-table-column prop="actualStudyDuration" label="实际学时" align="center"></el-table-column>
          <el-table-column prop="achieved" label="学习结果" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.achieved">达标</span>
              <span v-else style="color:red">未达标</span>
            </template>
          </el-table-column>
          <el-table-column prop="teacher" label="主讲教师" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- 在线学习 -->
      <div class="title">
        <span>在线学习</span>
        <span class="line"></span>
      </div>
      <div class="online-study" v-for="item in onlineStudyData" :key="item.courseName">
        <h4>{{item.courseName}}</h4>
        <!-- 树形表格 -->
        <el-table
          class="t-table-list"
          :data="item.learningRecord"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          size="small"
          :tree-props="{children: 'children', hasChildren:'hasChildren'}"
          default-expand-all
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="title" label="章节目录" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cumulativeTime" label="累计学习时长" align="center" width></el-table-column>
          <el-table-column label="学习时间段" align="center">
            <template slot-scope="scope">{{scope.row.studyStartTime}}—{{scope.row.studyEndTime}}</template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 直播学习记录 -->
      <div class="title">
        <span>直播学习记录</span>
        <span class="line"></span>
      </div>
      <!-- 统计 -->
      <div class="statistics">
        <div class="percentage-box" style="position: relative;">
          <el-progress
            type="circle"
            :percentage="percentage"
            :show-text="false"
            :width="300"
            :stroke-width="25"
            color="#0092da"
          ></el-progress>
          <div
            style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);color: #333;display:flex;flex-direction: column;align-items:center;"
          >
            <span style="font-size: 48px;display: block;text-align: center;">{{should}}次</span>
            <span style="font-size: 24px;display: block;text-align: center;margin:18px 0;">应参加</span>
            <span style="font-size: 32px;display: block;text-align: center;">考勤统计</span>
          </div>
        </div>
        <div class="box1">
          <span>
            缺勤：
            <em>{{absence}}</em>次
          </span>
          <span>
            实际参加：
            <em>{{actual}}</em>次
          </span>
          <span>
            迟到：
            <em>{{beLate}}</em>次
          </span>
        </div>
      </div>
      <div class="statistics-table">
        <h4>
          直播学习累计学时：
          <span>{{liveStudyData.cumulativeTime}}</span>
        </h4>
        <el-table
          class="t-table-list"
          ref="table"
          border
          size="small"
          tooltip-effect="dark"
          :data="liveStudyData.learningRecord"
          row-key="id"
        >
          <el-table-column prop="liveName" label="直播名称" align="center"></el-table-column>
          <el-table-column prop="courseName" label="所属课程" align="center"></el-table-column>
          <el-table-column prop="liveTime" label="直播时间" align="center"></el-table-column>
          <!-- <el-table-column prop="firstEnterTime" label="初始进入时间" align="center"></el-table-column>
          <el-table-column prop="lastEnterTime" label="最后退出时间" align="center"></el-table-column>-->
          <el-table-column prop="watchTime" label="观看时长" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- 成绩 -->
      <div class="title">
        <span>成绩</span>
        <span class="line"></span>
      </div>
      <ul class="achievement">
        <li>
          <span>课程名称</span>
          <span>{{achievementData.courseName}}</span>
        </li>
        <li>
          <span>成绩</span>
          <span>{{achievementData.score}}</span>
        </li>
        <li>
          <span>类型</span>
          <span>{{achievementData.examinationTypeName}}</span>
        </li>
      </ul>
      <!-- <div class="achievement-table">
        <h4>
          <span>
            总成绩：
            <em>{{overallResult}}</em>
          </span>
        </h4>
        <el-table
          class="t-table-list"
          ref="table"
          border
          size="small"
          tooltip-effect="dark"
          :data="achievementData"
          row-key="id"
        >
          <el-table-column prop="courseName" label="课程名称" align="center"></el-table-column>
          <el-table-column prop="score" label="成绩" align="center"></el-table-column>
          <el-table-column prop="credit" label="学分" align="center"></el-table-column>
          <el-table-column prop="examinationTypeName" label="类型" align="center"></el-table-column>
        </el-table>
      </div>-->
      <!-- 评价 -->
      <!-- <div class="title">
        <span>评价</span>
        <span class="line"></span>
      </div>
      <div class="achievement-table">
        <h4>
          <span>
            平均得分：
            <em>{{averageScore}}</em>
          </span>
        </h4>
        <el-table
          class="t-table-list"
          ref="table"
          border
          size="small"
          :data="evaluationData"
          row-key="id"
        >
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="EvaluationName" label="评价名称" align="center"></el-table-column>
          <el-table-column prop="EvaluationTypeName" label="评价类型" align="center"></el-table-column>
          <el-table-column prop="FullMarks" label="满分" align="center"></el-table-column>
          <el-table-column prop="Score" label="得分" align="center"></el-table-column>
        </el-table>
      </div>-->
    </div>
  </div>
</template>
<script>
import { baseURL } from "@/config";
import { GetInstitutionsBasicInfo } from "@/server/basic-module";
import { CourseScoreByTp } from "@/server/examination-module";
// import { getPayItemList } from '@/server/training-module'
import {
  getLivingCheckInHistoryStatistic,
  StudentBasicInfo,
  LiveStudy,
  OnlineStudy,
  EvaluationList
} from "@/server/studentProfile-module";
export default {
  props: ["dataForm", "checkedTabName"], // 学生基本信息
  data() {
    return {
      hasChildren: true,
      baseURL,
      // 学生基本信息
      studentBasicinfo: {},
      officialIMG: "",
      isShow: true,
      // 缴费信息部分
      payment: {},
      // 在线学习部分
      liveStudyData: [],
      // 直播学习部分
      onlineStudyData: [],
      percentage: 0,
      should: 0, // 应参加
      actual: 0, // 实际
      beLate: 0, // 迟到
      absence: 0, // 缺勤
      // 成绩部分
      achievementData: {},
      // achievementData: [],
      // overallResult: 0, // 总成绩id
      // 评价部分
      evaluationData: [],
      averageScore: 0 // 平均成绩
    };
  },
  watch: {
    checkedTabName(newVal) {
      if (newVal === "learningReport") {
        setTimeout(() => {
          this._getLivingCheckInHistoryStatistic();
          this._GetInstitutionsBasicInfo();
          this._StudentBasicInfo();
          this._LiveStudy();
          this._OnlineStudy();
          // this._EvaluationList();
        }, 500);
      }
    }
  },
  methods: {
    // ---------------------------------学生基本信息--------------------------
    _StudentBasicInfo() {
      let data = {
        studentId: this.dataForm.studentId,
        projectId: this.dataForm.programId
      };
      StudentBasicInfo(data).then(res => {
        this.studentBasicinfo = res || [];
        this._CourseScoreByTp(res.tel);
      });
    },
    // ----------------------------------------------------------------------
    // ------------------------------------直播学习------------------------------
    _LiveStudy() {
      let data = {
        studentId: this.dataForm.studentId,
        projectId: this.dataForm.programId
      };
      LiveStudy(data).then(res => {
        this.liveStudyData = res || [];
      });
    },
    // ----------------------------------------------------------------------------
    // ---------------------------------------在线学习---------------------------------
    _OnlineStudy() {
      let data = {
        studentId: this.dataForm.studentId,
        projectId: this.dataForm.programId
      };
      OnlineStudy(data).then(res => {
        this.onlineStudyData = res || [];
      });
    },
    // -----------------------------------------------------------------------------------
    // ---------------------------------------获取机构logo-------------------------------
    _GetInstitutionsBasicInfo() {
      GetInstitutionsBasicInfo().then(res => {
        this.officialIMG = `${this.baseURL}/${res.officialSealImgUrl}`;
      });
    },
    // ---------------------------------------------------------------------------
    // -------------------------------------获取成绩-------------------------------
    _CourseScoreByTp(tel) {
      let data = {
        TrainingProgramId: this.dataForm.programId,
        ClassId: this.dataForm.classId,
        Tel: tel
      };
      CourseScoreByTp(data).then(res => {
        this.achievementData = res || {};
        // this.achievementData = res || [];
        // res.forEach(item => {
        //   this.overallResult += item.score;
        // });
      });
    },
    // --------------------------------------------------------------------------
    // ------------------------------------ 查询-直播学习考勤 -----------------------------------
    // 获取直播考勤统计
    _getLivingCheckInHistoryStatistic() {
      let data = {
        studentId: this.dataForm.studentId,
        trainingProgramId: this.dataForm.programId
      };
      if (this.courseId) {
        this.$set(data, "courseId", this.courseId);
      }
      getLivingCheckInHistoryStatistic(data).then(res => {
        if (res.length === 0) {
          return;
        }
        res.forEach(item => {
          this.should += item.should; // 应参加
          this.actual += item.actual; // 实际
          this.beLate += item.beLate; // 迟到
        });
        this.absence = this.should - this.actual; // 缺勤
        if (this.should !== 0) {
          this.percentage = Number(
            ((this.actual / this.should) * 100).toFixed(this.beLate)
          );
        }
      });
    },
    // --------------------------------------------------评价------------------------------------------------------
    // _EvaluationList() {
    //   let data = {
    //     studentId: this.dataForm.studentId,
    //     projectId: this.dataForm.programId
    //   };
    //   EvaluationList(data).then(res => {
    //     if (res.items.length === 0) {
    //       return;
    //     }
    //     this.evaluationData = res.items;
    //     let totalScore = 0;
    //     res.items.forEach(item => {
    //       totalScore += item.Score;
    //     });
    //     this.averageScore = totalScore / res.items.length;
    //   });
    // },
    // 打印
    printCompletion() {
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 1000);
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        return {
          rowspan: 99999999,
          colspan: 1
        };
      }
    }
  }
};
</script>
<style lang="less" scoped>
.student-detail-container {
  .tab {
    overflow: scroll;
    height: 100%;
    background: url("../../../../assets/images/background.png") repeat center;
    background-size: cover;
    .top-title {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 60px 0 44px 0;
      h3 {
        font-size: 36px;
        font-weight: normal;
        color: #333;
        margin: 0;
        margin-right: 20px;
      }
      .el-button {
        padding: 12px 42px;
      }
    }
    .certificate {
      padding: 40px 0;
      background: url("../../../../assets/images/img3.png") no-repeat center;
      opacity: 0.5;
      .content {
        width: 80%;
        margin: 0 auto;
        .wrap {
          margin-bottom: 34px;
          span {
            font-size: 18px;
            width: 60%;
            padding: 0 5px;
            line-height: 40px;
            letter-spacing: 6px;
          }
        }
        .comp {
          display: flex;
          align-items: flex-end;
          flex-direction: column;
          position: relative;
          span {
            color: #000;
            line-height: 36px;
            letter-spacing: 6px;
            &:first-child {
              font-size: 18px;
            }
            &:last-child {
              font-size: 14px;
            }
          }
          img {
            position: absolute;
            top: -30px;
            width: 100px;
            height: 100px;
          }
        }
      }
    }
    .title {
      display: flex;
      align-items: center;
      margin: 30px 0;
      span {
        &:first-child {
          font-family: "MicrosoftYaHei";
          font-size: 18px;
          letter-spacing: 0px;
          color: #0092da;
          white-space: nowrap;
          margin-right: 5px;
        }
        &:last-child {
          height: 1px;
          // width: 95%;
          flex: 1;
          background-color: #ccc;
        }
        &:first-child {
          color: #000;
          font-size: 32px;
          line-height: 36px;
        }
      }
    }
    .achievement {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      li {
        width: 33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        span {
          height: 50px;
          width: 100%;
          line-height: 50px;
          list-style: none;
          text-align: center;
          border: 1px solid #e5e5ee;
          &:nth-child(1) {
            font-size: 14px;
            font-weight: bold;
          }
          &:nth-child(2) {
            color: #909399;
          }
        }
      }
    }
    .infos {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      background-color: rgba(238, 238, 238, 0.5);
      margin-bottom: 30px;
      .left {
        width: 10%;
        border-right: 2px solid #e5e5ee;
        text-align: center;
        h4 {
          margin: 0;
          line-height: 36px;
        }
      }
      .right {
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding-left: 10px;
        p {
          font-size: 14px;
          width: 25%;
          margin: 0;
          color: #666;
          span {
            color: #000;
          }
        }
      }
    }
    .project_info {
      margin-bottom: 40px;
      h4 {
        height: 60px;
        line-height: 60px;
        background-color: #3aabe2;
        color: #fff;
        font-size: 18px;
        font-weight: normal;
        text-align: center;
        margin: 0;
      }
      ul {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin: 0;
        li {
          width: 33.1%;
          height: 50px;
          line-height: 50px;
          display: flex;
          justify-content: space-between;
          border: 1px solid #e5e5ee;
          border-top: none;
          border-left: none;
          span {
            display: block;
            &:first-child {
              width: 30%;
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
            }
          }
        }
      }
    }
    .course,
    .online-study {
      h4 {
        height: 60px;
        line-height: 60px;
        background-color: #3aabe2;
        color: #fff;
        font-size: 18px;
        font-weight: normal;
        text-align: center;
        margin: 0;
      }
      /deep/.el-table__row {
        .el-table_33_column_216 {
          color: red;
        }
      }
    }
    .statistics {
      text-align: center;
      margin-bottom: 20px;
      .box1 {
        display: flex;
        justify-content: center;
        font-size: 18px;
        span {
          margin-right: 30px;
          em {
            font-size: 24px;
            font-style: normal;
            padding-right: 5px;
          }
          &:nth-child(1) {
            em {
              color: #da1f00;
            }
          }
          &:nth-child(2) {
            em {
              color: #0092da;
            }
          }
          &:nth-child(3) {
            em {
              color: #e6e61a;
            }
          }
        }
      }
    }
    .statistics-table {
      h4 {
        height: 60px;
        display: flex;
        align-items: center;
        background-color: #3aabe2;
        color: #fff;
        font-weight: normal;
        margin: 0;
        padding-left: 20px;
        font-size: 18px;
        span {
          font-size: 32px;
        }
      }
    }
    .achievement-table {
      h4 {
        height: 60px;
        line-height: 60px;
        background-color: #3aabe2;
        color: #fff;
        font-size: 18px;
        font-weight: normal;
        margin: 0;
        display: flex;
        padding: 10px 0;
        box-sizing: border-box;
        span {
          padding: 0 20px;
          display: flex;
          align-items: center;
          em {
            font-style: normal;
            font-size: 32px;
          }
        }
      }
    }
  }
}
</style>
