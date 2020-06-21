<template>
  <el-drawer :title="data.name" :visible="visible" size="70%" :before-close="close">
    <!-- 人才培养方案 -->
    <talent-training :visible.sync="talentTrainVisible" :data="talentTrainData" :nodeId="nodeId"></talent-training>
    <!-- 学员花名册 -->
    <student-roster :visible.sync="studentRosterVisible" :data="studentRosterData" :nodeId="nodeId"></student-roster>
    <!-- 课表 -->
    <class-schedule :visible.sync="classScheduleVisible" :data="classScheduleData" :nodeId="nodeId"></class-schedule>
    <!-- 直播考勤  -->
    <live-attendance
      :visible.sync="liveAttendanceVisible"
      :data="liveAttendanceData"
      :nodeId="nodeId"
    ></live-attendance>
    <!-- 直播学习记录 -->
    <live-learning-record
      :visible.sync="liveLearningRecordVisible"
      :data="liveLearningRecordData"
      :nodeId="nodeId"
    ></live-learning-record>
    <!-- 在线学习考勤 -->
    <online-attendance
      :visible.sync="onlineAttendanceVisible"
      :data="onlineAttendanceData"
      :nodeId="nodeId"
    ></online-attendance>
    <!-- 在线学习跟踪记录 -->
    <online-learning-track
      :visible.sync="onlineLearningTrackVisible"
      :data="onlineLearningTrackData"
      :nodeId="nodeId"
    ></online-learning-track>
    <!-- 成绩信息 -->
    <results-information
      :visible.sync="resultsInformationVisible"
      :data="resultsInformationData"
      :nodeId="nodeId"
    ></results-information>
  </el-drawer>
</template>
<script>
import studentRoster from "./student-roster.vue";
import talentTraining from "./talent-training-program.vue";
import classSchedule from "./class-schedule.vue";
import liveAttendance from "./live-attendance.vue";
import liveLearningRecord from "./live-learning-record.vue";
import onlineAttendance from "./online-attendance.vue";
import onlineLearningTrack from "./online-learning-track.vue";
import resultsInformation from "./results-information.vue";
export default {
  components: {
    studentRoster,
    talentTraining,
    classSchedule,
    liveAttendance,
    liveLearningRecord,
    onlineAttendance,
    onlineLearningTrack,
    resultsInformation
  },
  props: ["visible", "data", "nodeId"],
  data() {
    return {
      //-------------人才培养方案-------------
      talentTrainVisible: false,
      talentTrainData: [],
      //------------------------------------
      //-------------学员花名册----------------
      studentRosterVisible: false,
      studentRosterData: [],
      //-----------------------------------
      //-------------课表----------------
      classScheduleVisible: false,
      classScheduleData: [],
      //-----------------------------------
      //-------------直播考勤-----------
      liveAttendanceVisible: false,
      liveAttendanceData: [],
      //---------------------------------------
      //-------------直播学习记录-----------
      liveLearningRecordVisible: false,
      liveLearningRecordData: [],
      //---------------------------------------
      //-------------在线学习考勤-----------
      onlineAttendanceVisible: false,
      onlineAttendanceData: [],
      //---------------------------------------
      //-------------在线学习跟踪记录-----------
      onlineLearningTrackVisible: false,
      onlineLearningTrackData: [],
      //---------------------------------------
      //-------------成绩信息-----------
      resultsInformationVisible: false,
      resultsInformationData: []
      //---------------------------------------
    };
  },
  watch: {
    visible() {
      this.judgingStatus(this.visible);
    }
  },
  methods: {
    judgingStatus(visible) {
      let transferData = this.data;
      if (!visible) {
        transferData = [];
      }
      setTimeout(() => {
        switch (this.data.name) {
          case "人才培养方案":
            this.talentTrainVisible = visible;
            this.talentTrainData = transferData;
            break;
          case "学员花名册":
            this.studentRosterVisible = visible;
            this.studentRosterData = transferData;
            break;
          case "课表":
            this.classScheduleVisible = visible;
            this.classScheduleData = transferData;
            break;
          case "直播考勤":
            this.liveAttendanceVisible = visible;
            this.liveAttendanceData = transferData;
            break;
          case "直播学习记录":
            this.liveLearningRecordVisible = visible;
            this.liveLearningRecordData = transferData;
            break;
          case "在线学习考勤":
            this.onlineAttendanceVisible = visible;
            this.onlineAttendanceData = transferData;
            break;
          case "在线学习跟踪记录":
            this.onlineLearningTrackVisible = visible;
            this.onlineLearningTrackData = transferData;
            break;
          case "成绩信息":
            this.resultsInformationVisible = visible;
            this.resultsInformationData = transferData;
            break;
          default:
            this.$message.error("未找到相关模块");
            break;
        }
      }, 100);
    },
    close() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style>
</style>