<template>
  <div>
    <el-table
      class="t-table-list"
      ref="onlineLearningTable"
      stripe
      border
      size="small"
      :data="performanceInfoData"
      tooltip-effect="dark"
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <!-- <el-table-column prop="semesterName" label="学年" align="center"></el-table-column> -->
      <el-table-column prop="semesterName" label="学期" align="center"></el-table-column>
      <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
      <el-table-column prop="examinationPaperName" label="试卷名称" align="center"></el-table-column>
      <el-table-column prop="examinationTypeName" label="考试类型" align="center"></el-table-column>
      <el-table-column prop="methodOfExaminationName" label="考试方式" align="center"></el-table-column>
      <el-table-column prop="examCount" label="考试次数" align="center"></el-table-column>
      <el-table-column prop="examTime" label="考试时间" width align="center"></el-table-column>
      <!-- <el-table-column prop="leave" label="培训考试成绩" width="" align="center"></el-table-column> -->
      <!-- <el-table-column prop="score" label="国考成绩" width="" align="center"></el-table-column> -->
      <el-table-column prop="examPaperStatusName" label="考试状态" width align="center"></el-table-column>
      <el-table-column prop="score" label="最终成绩" width align="center"></el-table-column>
      <!-- <el-table-column prop="leaveEarly" label="获得学分" width="" align="center"></el-table-column> -->
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </div>
</template>
<script>
import { getExamPaperRecord } from "@/server/studentProfile-module";
import { pageSizes, pageSize } from "@/config.js";
import pagination from "@/components/pagination";
export default {
  components: { pagination },
  props: ["dataForm", "checkedTabName"],
  data() {
    return {
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      performanceInfoData: []
    };
  },
  watch: {
    checkedTabName(newVal) {
      if (newVal === "achievement") {
        setTimeout(() => {
          this._getExamPaperRecord();
        }, 500);
      }
    }
  },
  methods: {
    /* 接收改变后每页多少条 */
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._getExamPaperRecord(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._getExamPaperRecord(SkipCount, pageSize);
    },
    // 获取学生成绩信息
    _getExamPaperRecord(SkipCount = 0, pageSize = this.pageSize) {
      let data = Object.assign({}, this.dataForm, {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        TrainingProgramId: this.dataForm.programId
      });
      getExamPaperRecord(data).then(res => {
        this.performanceInfoData = res.items;
        this.total = res.totalCount;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.t-operate-footer {
  padding-bottom: 10px;
}
</style>
