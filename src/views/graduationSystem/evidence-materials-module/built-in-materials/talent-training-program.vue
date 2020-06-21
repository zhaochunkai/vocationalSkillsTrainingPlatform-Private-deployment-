<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-show="visible">
    <el-tab-pane label="项目基本信息" name="first">
      <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
        <el-button
          v-show="isShow"
          type="primary"
          v-print="'#printCompletion_1'"
          @click="printCompletion()"
        >打印</el-button>
      </el-tooltip>
      <ul class="list" id="printCompletion_1">
        <li>
          <span>培训项目名称</span>
          <span>{{talentTrainData.projectName}}</span>
        </li>
        <li>
          <span>培训项目类型</span>
          <span>{{talentTrainData.trainingProgramType}}</span>
        </li>
        <li>
          <span>招生人数</span>
          <span>{{talentTrainData.recruitStudentsNumbers}}</span>
        </li>
        <li>
          <span>所属组织</span>
          <span>{{talentTrainData.institutionName}}</span>
        </li>
        <li>
          <span>已报名人数</span>
          <span>{{talentTrainData.registeredNumber}}</span>
        </li>
        <li>
          <span>应修学分</span>
          <span>{{talentTrainData.totalCredits}}</span>
        </li>
        <li>
          <span>报名时间</span>
          <span>{{talentTrainData.registrationTime}}</span>
        </li>
        <li>
          <span>培训费</span>
          <span>￥{{talentTrainData.charge}}</span>
        </li>
        <li class="explanation">
          <span>培训说明</span>
          <span v-html="talentTrainData.description"></span>
        </li>
        <li>
          <span>是否允许超员</span>
          <span>{{talentTrainData.limit?"是":"否"}}</span>
        </li>
        <li>
          <span>毕业要求证书</span>
          <span>
            <p
              v-for="item in talentTrainData.certificateList"
              :key="item.CertificateName"
            >{{item.CertificateName}}</p>
          </span>
        </li>
        <li>
          <span></span>
          <span></span>
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="项目培养方案" name="second">
      <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
        <el-button
          v-show="isShow"
          type="primary"
          v-print="'#printCompletion_2'"
          @click="printCompletion()"
        >打印</el-button>
      </el-tooltip>
      <el-table
        id="printCompletion_2"
        :data="talentTrainData.bindingCourseList"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" sortable align="center"></el-table-column>
        <el-table-column prop="creditHour" label="课时" align="center"></el-table-column>
        <el-table-column prop="hour" label="学分" align="center"></el-table-column>
        <el-table-column prop="passScore" label="及格分数" align="center"></el-table-column>
        <el-table-column prop="teacher" label="主讲教师（人）" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { GetTalentTrainingProgramInfo } from "@/server/basic-module";
export default {
  props: ["visible", "data", "nodeId"],
  data() {
    return {
      isShow: true,
      activeName: "first",
      talentTrainData: {}
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this._GetTalentTrainingProgramInfo();
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
    //----------------------获取列表信息-----------------------
    _GetTalentTrainingProgramInfo() {
      GetTalentTrainingProgramInfo(this.nodeId).then(res => {
        this.talentTrainData = res;
      });
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