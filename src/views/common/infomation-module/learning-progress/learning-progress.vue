<template>
  <div>
    <div v-if="!dataForm.classId || (courseList && courseList.length==0)">
      <el-tag size="large" style="color:#f00;" type="warning">该项目暂未设置课程或未对该学生分配班级，无法查询相关数据！</el-tag>
    </div>
    <div v-else>
      <el-form class="t-form-block" ref="form" label-width="60px" size="small" inline>
        <el-form-item label="课程" v-if="courseList">
          <el-select v-model="courseId" filterable clearable>
            <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="display:flex;justify-content:space-between;">
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
      </div>
      <!-- 树形表格 -->
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        :tree-props="{children: 'children', hasChildren:'hasChildren'}"
        v-loading="loading"
        :element-loading-text="courseId?'请选择查询的班级和课程':'选择课程后，自动加载数据'"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(250,250,250,0.8)"
      >
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="title" label="章节目录" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="!scope.row.fileKey">{{scope.row.title}}</span>
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
        <el-table-column prop="progress" label="学习进度" align="center">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress" v-if="scope.row.isBind"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="neededTime" label="要求学习时长" width="120"></el-table-column>
        <el-table-column prop="learnedTime" label="已学习时长" width="120"></el-table-column>
      </el-table>
      <!-- 资源文件内容 -->
      <files-info ref="fileInformation" :dataForm="fileFrom" :visible.sync="fileVisible"></files-info>
    </div>
  </div>
</template>
<script>
import {
  getLearnToTrackStudentInfo,
  getLearnToTrackDetails
} from "@/server/statistical-module";
import filesInfo from "../../../onlineLearningSystem/repository-management/repository-infomation/resource-files-info";
export default {
  props: ["dataForm", "courseList", "checkedTabName"],
  components: { filesInfo },
  data() {
    return {
      courseId: null,
      studentInfo: {},
      tableData: [],
      loading: true,
      classId: null,
      // ------------
      fileFrom: {},
      fileVisible: false
    };
  },
  watch: {
    checkedTabName(newVal) {
      if (newVal === "learningProgress") {
        if (this.courseId && this.dataForm.classId) {
          setTimeout(() => {
            this.queryList();
          }, 500);
        }
      }
    },
    courseList(newVal) {
      if (newVal && newVal.length > 0) {
        // 默认取第一个课程id
        this.courseId = newVal[0].id;
      }
    }
  },
  methods: {
    /* ------------------------------------ 查询 -------------------------- */
    queryList() {
      if (!this.courseId) {
        this.$message.warning("请选择课程！");
        return;
      }
      this._getLearnToTrackDetails();
      this._getLearnToTrackStudentInfo();
    },
    _getLearnToTrackStudentInfo() {
      let data = {
        StudentId: this.dataForm.studentId,
        classId: this.dataForm.classId,
        courseId: this.courseId
      };
      // 获取追踪学生信息
      getLearnToTrackStudentInfo(data).then(result => {
        this.studentInfo = Object.assign({}, result);
      });
    },
    // 获取学习追踪进度详情
    _getLearnToTrackDetails() {
      let data = {
        trainingProgramId: this.dataForm.programId,
        StudentId: this.dataForm.studentId,
        courseId: this.courseId
      };
      this.loading = true;
      getLearnToTrackDetails(data).then(result => {
        this.tableData = result;
        this.loading = false;
      });
    },
    /* ------------------------------------ 操作 -------------------------- */
    fileInfo(row) {
      let data = {
        id: row.id,
        trustedFileName: row.title,
        fileKey: row.fileKey
      };
      this.fileFrom = data;
      this.fileVisible = true;
      // 在父组件中调用子组件的方法
      this.$refs.fileInformation.choose();
    }
  }
};
</script>
<style lang="less" scoped>
.studentInfo {
  color: #333;
  background: #fbf7e7;
  // height:60px;
  line-height: 1.6;
  padding: 4px 10px;
  font-size: 14px;
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
