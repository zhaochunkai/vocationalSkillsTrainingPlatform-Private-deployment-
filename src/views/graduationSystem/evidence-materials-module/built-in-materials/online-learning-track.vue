 <template>
  <!-- 在线学习跟踪记录 -->
  <div v-show="visible">
    <!-- 表格 -->
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="在线学习跟踪记录">
        <el-tooltip class="item" effect="dark" content="建议横向打印,若遇显示不全的现象请自定义缩放" placement="right">
          <el-button
            v-show="isShow"
            type="primary"
            v-print="'#onlineLearn'"
            @click="printCompletion()"
          >打印</el-button>
        </el-tooltip>
        <el-table
          id="onlineLearn"
          class="t-table-list"
          ref="multipleTable"
          border
          size="small"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          v-loading="loading"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(250,250,250,0.8)"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="姓名" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color:#00f"
                @click="toStudentTrack(scope.row)"
              >{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="examinationType" label="总体学习进度" align="center">
            <template slot-scope="scope">
              <el-progress :percentage="scope.row.progress"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="age" label="年龄" width="80" align="center"></el-table-column>
          <el-table-column label="性别" width="80" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.sex==1">男</p>
              <p v-if="scope.row.sex==2">女</p>
              <p v-if="scope.row.sex==0">未知的性别</p>
              <p v-if="scope.row.sex==9">未说明的性别</p>
            </template>
          </el-table-column>
          <el-table-column label="学历" width="120" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.education=='0'">高中中专及以下</p>
              <p v-if="scope.row.education=='1'">大专</p>
              <p v-if="scope.row.education=='2'">本科</p>
              <p v-if="scope.row.education=='3'">双学士</p>
              <p v-if="scope.row.education=='4'">硕士</p>
              <p v-if="scope.row.education=='5'">博士</p>
            </template>
          </el-table-column>
          <el-table-column prop="tel" label="联系电话" width="120" align="center"></el-table-column>
          <el-table-column prop="source" label="来源" width="150" align="center">
            <template slot-scope="scope">{{scope.row.Offline=="Offline"?"线下":"线上"}}</template>
          </el-table-column>
          <el-table-column prop="lastActiveTime" label="最后一次活跃时间" width="150" align="center"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <!-- 跟踪学生学习情况 -->
    <student-track :dataForm="dataForm" :visible.sync="studentVisible"></student-track>
  </div>
</template>
<script>
import {
  getGradeTree,
  getDictionaryItems,
  GetOnlineLearningTrackingRecords
} from "@/server/basic-module";
import pagination from "@/components/pagination";
import orgTree from "@/components/orgTree";
import { pageSizes, pageSize } from "@/config.js";
import studentTrack from "./children-components/learning-tracking-student";
export default {
  props: ["visible", "data", "nodeId"],
  components: { pagination, orgTree, studentTrack },
  data() {
    return {
      isShow: true,
      style: "",
      // -------------表格------------
      pageSizes,
      pageSize,
      total: 0,
      tableData: [],
      loading: true,
      // -------------检索------------
      trainingProgramsId: null,
      programs: [],
      courseList: [],
      resourceList: [
        { name: "全部", type: "All" },
        { name: "线上（移动端）", type: "Simulation" },
        { name: "线下", type: "Official" }
      ],
      // -------------编辑------------
      dataForm: {},
      studentVisible: false,
      /* ------------------[-----------数据字典- 字典码-------------- */

      dicJudgeName: {
        Education: "Education" // 学历
      },
      dictionary: {}
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.initialData();
      }
    }
  },
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._getGradeTree();
    /* ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */

    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result);
      });
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
    _getGradeTree() {
      this.resourceTree = [];
      getGradeTree({ state: "3,4" }).then(result => {
        // 查询状态为3-培训中、4-已结束的项目
        this.resourceTree.push(result);
      });
    },
    /**接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent(SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize);
    },
    queryList() {
      this.initialData();
    },
    // 获取试题列表
    initialData(SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        classId: this.nodeId,
        skipCount: SkipCount,
        maxResultCount: pageSize
      };
      this.loading = true;
      GetOnlineLearningTrackingRecords(data)
        .then(result => {
          if (result.totalCount > 0) {
            this.total = result.totalCount;
          } else {
            this.total = 0;
          }
          this.tableData = result.items;
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: "error"
          });
        });
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    toStudentTrack(row) {
      this.dataForm = {
        trainingProgramId: row.trainingProgramId,
        studentId: row.studentId,
        classId: this.nodeId
      };
      this.studentVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.t-header-title span {
  font-size: 14px;
  width: 300px;
  text-align: left;
  padding-left: 10px;
}
</style>