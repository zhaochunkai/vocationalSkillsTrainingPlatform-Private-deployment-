<template>
  <el-dialog
    class="t-dialog"
    title="学生学习进度"
    v-if="visible"
    :visible="visible"
    :close-on-click-modal="true"
    width="80%"
    @close="close"
    :append-to-body="true"
  >
    <el-form class="t-form-block" ref="form" label-width="60px" size="small" inline>
      <!-- <el-form-item label="培训项目">
        <el-input v-model="dataForm.trainingProgramId"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button size="small" @click="close">关 闭</el-button>
      </el-form-item>
      <el-form-item label="课程">
        <el-select v-model="courseId" filterable clearable>
          <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="display:flex;justify-content:space-between;">
      <div>
        <el-button type="info" size="small" @click="next">上一个</el-button>
      </div>
      <div class="studentInfo">
        <span>
          姓名：
          <strong style="font-size:1rem;">{{studentInfo.name}}</strong>
        </span>
        <span>班级：{{studentInfo.className}}</span>
        <span>性别：{{studentInfo.sex}}</span>
        <span>年龄：{{studentInfo.age}}</span>
        <span>学历：{{studentInfo.education}}</span>
        <span>联系电话：{{studentInfo.tel}}</span>
        <span>来源：{{studentInfo.source}}</span>
        <span>本课程要求学习时长：{{studentInfo.planningStudyTotalDuration}}</span>
        <span>本课程实际学习时长：{{studentInfo.actualStudyTotalDuration}}</span>
        <div v-if="courseId">
          <div style="float:left;width:120px">本课程学习进度：</div>
          <el-progress
            :percentage="studentInfo.progress"
            style="float:left;width:60%;margin-top:4px;"
          ></el-progress>
        </div>
      </div>
      <div>
        <el-button type="info" size="small" @click="next">下一个</el-button>
      </div>
    </div>
    <!-- 树形表格 -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      v-loading="loading"
      :element-loading-text="courseId?'数据加载中...': '选择课程后，自动加载数据'"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(250,250,250,0.8)"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="title" label="章节目录" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.neededTime.split('|').length!=3">{{scope.row.title}}</span>
          <span v-else>
            <i class="fa fa-eye" aria-hidden="true">{{scope.row.count}}</i>
            <span class="fileTitle">
              <el-button
                type="text"
                style="color:#00f;"
                @click="fileInfo(scope.row)"
              >{{scope.row.title}}</el-button>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="neededTime" label="要求学习时长（分钟）" width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.neededTime.split('|').length!=3">{{scope.row.neededTime}}</span>
          <span v-else>{{scope.row.neededTime.split('|')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="learnedTime" label="实际学习时长（分钟）" width="120" align="center"></el-table-column>
      <el-table-column prop="progress" label="学习进度" align="center">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.progress" v-if="scope.row.isBind"></el-progress>
        </template>
      </el-table-column>
    </el-table>
    <!-- 资源文件内容 -->
    <files-info ref="fileInformation" :dataForm="fileFrom" :visible.sync="fileVisible"></files-info>
  </el-dialog>
</template>
<script>
import { getTrainingProgramsBindCourse } from "@/server/training-module";
import filesInfo from "../../../../onlineLearningSystem/repository-management/repository-infomation/resource-files-info";
import {
  getLearnToTrackStudentInfo,
  getLearnToTrackDetails
} from "@/server/statistical-module";
export default {
  props: ["dataForm", "visible"],
  components: { filesInfo },
  data() {
    return {
      courseList: [],
      courseId: null,
      studentInfo: {},
      tableData: [],
      loading: true,
      // ------------
      fileFrom: {},
      fileVisible: false
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.courseId = null;
        this.tableData = [];
        if (this.dataForm.trainingProgramId) {
          this._getTrainingProgramsBindCourse();
          this._getLearnToTrackStudentInfo();
        }
      }
    },
    courseId(newVal) {
      if (newVal) {
        this.initialData();
        this._getLearnToTrackStudentInfo();
      }
    }
  },
  methods: {
    /* ------------------------------------ 查询 -------------------------- */
    _getTrainingProgramsBindCourse() {
      // 根据项目id查询课程
      this.courseList = [];
      getTrainingProgramsBindCourse(this.dataForm.trainingProgramId).then(
        result => {
          this.courseList = result;
        }
      );
    },
    _getLearnToTrackStudentInfo() {
      let data = {
        StudentId: this.dataForm.studentId,
        classId: this.dataForm.classId,
        courseId: this.courseId
      };
      getLearnToTrackStudentInfo(data).then(result => {
        // 获取追踪学生信息
        this.studentInfo = Object.assign({}, result);
      });
    },
    initialData() {
      let data = {
        trainingProgramId: this.dataForm.trainingProgramId,
        StudentId: this.dataForm.studentId,
        courseId: this.courseId
      };
      this.loading = true;
      getLearnToTrackDetails(data).then(result => {
        // 获取学习追踪进度详情
        this.tableData = result;
        this.loading = false;
      });
    },
    /* ------------------------------------ 操作 -------------------------- */
    fileInfo(row) {
      let data = {
        id: row.neededTime.split("|")[1],
        trustedFileName: row.neededTime.split("|")[2]
      };

      this.fileFrom = data;
      console.log(data, "打印data");
      this.fileVisible = true;
      this.$refs.fileInformation.choose(); // 在父组件中调用子组件的方法
    },
    next() {},
    close() {
      this.$emit("update:visible", false);
    },
    handleSelectionChange(val) {}
    // -----------------------树形表格
  }
};
</script>
<style lang="less" scoped>
// .row-expand-cover td:last-child .el-icon-arrow-right{visibility: hidden;}
.studentInfo {
  color: #333;
  background: #fbf7e7;
  // height:60px;
  line-height: 1.6;
  padding: 4px 10px;
  span {
    margin-right: 1rem;
  }
}
.fa-eye {
  position: relative;
  top: -15px;
}
.fileTitle {
  display: inline-block;
  max-width: 70%;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
