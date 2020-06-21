<template>
  <!-- 成绩信息 -->
  <div class="content" v-show="visible">
    <!-------------------------------------------------------------------------------- 第一部分 ------------------------------------------------------------------------------------------>
    <div class="content_one" v-if="isInquire">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="成绩信息查询" name="first">
          <el-form ref="form" :model="form" label-width="80px" :inline="true">
            <el-form-item label="考试名称">
              <el-input v-model="form.examName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="考试类别">
              <el-select v-model="form.examType" placeholder="全部">
                <el-option
                  v-for="item in examTypeData"
                  :key="item.ExamSupplementaryArrangeType"
                  :label="item.name"
                  :value="item.ExamSupplementaryArrangeType"
                >{{item.name}}</el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click.native="searchFor">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData_1"
            style="width: 100%"
            :default-sort="{prop: 'date', order: 'descending'}"
          >
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column prop="examName" label="考试名称" align="center"></el-table-column>
            <!-- <el-table-column label="考试类别" align="center">
              <template slot-scope="scope">{{scope.row.examinationArrangeId?"补考":"正式考试"}}</template>
            </el-table-column>-->
            <el-table-column label="考试方式" align="center">
              <template slot-scope="scope">{{scope.row.methodOfExamination=="Online"?"在线考试":"离线考试"}}</template>
            </el-table-column>
            <el-table-column label="是否为补考" align="center">
              <template slot-scope="scope">{{scope.row.examSupplementaryArrangeId==null?"否":"是"}}</template>
            </el-table-column>
            <el-table-column prop="yearSemesterName" label="学年学期" align="center"></el-table-column>
            <el-table-column prop="examTime" label="考试时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click.native="checkResults(scope.row.examSupplementaryArrangeId,scope.row.examinationArrangeId)"
                >查询成绩</el-button>
              </template>
            </el-table-column>
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
    </div>
    <!-------------------------------------------------------------------------------- 第二部分 ------------------------------------------------------------------------------------------>
    <div class="content_two" v-else>
      <el-row :gutter="20" class="el-row">
        <el-col :span="6">
          <el-card :style="style">
            <el-tree
              :data="TreeData"
              ref="tree"
              node-key="id"
              default-expand-all
              @node-click="haddleOrganizationNode"
            ></el-tree>
          </el-card>
        </el-col>
        <el-col :span="18" v-show="nodeLevel">
          <el-card :style="style">
            <!-- 查询 -->
            <el-form class="t-form-block" ref="form" :model="form" size="small" inline>
              <el-form-item label="准考证号" width>
                <el-input v-model="form.idCard"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="form.studentName"></el-input>
              </el-form-item>
              <el-form-item inline>
                <input type="checkbox" v-model="form.isFail" />
                <span style="color:#AAAAAA">不及格名单</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList()">搜索</el-button>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="建议横向打印,若遇显示不全的现象请自定义缩放"
                  placement="right"
                >
                  <el-button
                    v-show="isShow"
                    type="primary"
                    v-print="'#printCompletion_10'"
                    @click="printCompletion()"
                  >打印</el-button>
                </el-tooltip>
              </el-form-item>
            </el-form>
            <!-- 表格 -->
            <el-table
              id="printCompletion_10"
              v-loading="loading"
              class="t-table-list"
              ref="multipleTable"
              stripe
              size="small"
              :data="tableData_2"
              tooltip-effect="dark"
              style="width: 100%;margin-top:10px;"
            >
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="idCard" sortable label="准考证号" align="center" width="92"></el-table-column>
              <el-table-column prop="studentName" label="姓名" align="center"></el-table-column>
              <el-table-column prop="theTestResults" label="国考成绩" align="center"></el-table-column>
              <el-table-column prop="score" label="分数" align="center"></el-table-column>
              <el-table-column prop="remark" label="备注" align="center"></el-table-column>
              <el-table-column prop="comment" label="评语" align="center"></el-table-column>
              <el-table-column prop="inputName" label="录入者" align="center"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  GetTheTestInformation, //成绩查询详情
  GetExaminationArrangeTree, //成绩查询树
  GetRecord, //获取成绩信息
  getDictionaryItems,
  getGradeTree,
  GetCertificateInfo
} from "@/server/basic-module";
import orgTree from "@/components/orgTree.vue";
import { pageSizes, pageSize } from "@/config.js";
import pagination from "@/components/pagination";
export default {
  props: ["visible", "nodeId"],
  components: { pagination },
  data() {
    return {
      isShow: true,
      isInquire: true,
      //---------------------------------第一部分------------------------------------
      courseList: [],
      form: {
        examName: null,
        examType: null,
        isFail: true, //一二部分通用
        idCard: null,
        studentName: null
      },
      total: 0,
      SkipCount: 0,
      pageSizes,
      pageSize,
      activeName: "first",
      tableData_1: [],
      tableData_2: [],
      transmittedValue: {},
      //---------------------------------第二部分------------------------------------
      TreeData: [],
      examTypeData: [
        {
          ExamSupplementaryArrangeType: true,
          name: "补考"
        },
        {
          ExamSupplementaryArrangeType: false,
          name: "正式考试"
        }
      ],
      style: "",
      nodeLevel: "",
      nodeSelect: "",
      NodeId: "",
      level: "",
      loading: true,
      conditionForm: {
        studentName: "",
        idCarde: "",
        CertificateType: 2
      }
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this._GetRecord(this.SkipCount, this.pageSize);
      } else {
        this.isInquire = true; //监听visible，退出恢复
        this.nodeLevel = "";
      }
    },
    isInquire() {
      if (this.isInquire) {
        this._GetExaminationArrangeTree();
      } else {
        this.form = {
          idCard: null,
          studentName: null,
          isFail: true,
          examName: null,
          examType: null
        };
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
    //---------------------------------第一部分------------------------------------
    //获取列表
    _GetRecord(SkipCount, pageSize) {
      let data = {
        ClassId: this.nodeId,
        examName: this.form.examName,
        ExamSupplementaryArrangeType: this.form.examType,
        SkipCount,
        MaxResultCount: pageSize
      };
      GetRecord(data).then(res => {
        this.tableData_1 = res.items;
        this.total = res.totalCount;
      });
    },
    //查询
    checkResults(examSupplementaryArrangeId, examinationArrangeId) {
      this.transmittedValue = {
        ExamSupplementaryArrangeId: examSupplementaryArrangeId,
        ExaminationArrangeId: examinationArrangeId
      };
      this.isInquire = false;
      this.SkipCount = 0;
      this._GetExaminationArrangeTree(
        examSupplementaryArrangeId,
        examinationArrangeId
      );
    },
    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetRecord(SkipCount, pageSize);
    },

    /*接收当前页数*/
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetRecord(SkipCount, pageSize);
    },
    searchFor() {
      this._GetRecord(this.SkipCount, this.pageSize);
    },
    //---------------------------------第二部分------------------------------------
    //----------------------------树-------------------------------
    _GetExaminationArrangeTree(bad, good) {
      this.TreeData = [];
      let data = {};
      if (bad == null) {
        data = { examinationArrangeId: good };
      } else {
        data = { examSupplementaryArrangeId: bad };
      }
      GetExaminationArrangeTree(data).then(res => {
        this.TreeData.push(res);
      });
    },
    /* -------------------------- 查询 -------------------------- */
    _GetTheTestInformation(SkipCount, pageSize) {
      let data = {};
      if (this.transmittedValue.ExamSupplementaryArrangeId) {
        data = {
          idCard: this.form.idCard,
          studentName: this.form.studentName,
          flagPassMark: !this.form.isFail,
          courseId: this.NodeId,
          ExamSupplementaryArrangeId: this.transmittedValue
            .ExamSupplementaryArrangeId
        };
      } else {
        data = {
          idCard: this.form.idCard,
          studentName: this.form.studentName,
          flagPassMark: !this.form.isFail,
          courseId: this.NodeId,
          ExaminationArrangeId: this.transmittedValue.ExaminationArrangeId,
          SkipCount,
          MaxResultCount: pageSize
        };
      }
      GetTheTestInformation(data)
        .then(res => {
          this.tableData_2 = res;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    queryList() {
      this.loading = true;
      this._GetTheTestInformation();
    },
    /* -------------------------- 操作 -------------------------- *
    /* 选择的组织机构 */
    haddleOrganizationNode(node) {
      this.nodeSelect = node;
      this.NodeId = node.id;
      this.nodeName = node.label;
      this.nodeLevel = node.level; //显示右边
      if (this.nodeSelect.level == 2) {
        this.loading = true;
        setTimeout(() => {
          this._GetTheTestInformation();
        }, 500);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.t-operate-footer {
  margin: 10px 20px 10px 0;
}
.content {
  .content_one {
  }
  .content_two {
    margin-top: 30px;
    height: 800px;
    width: 100%;
    /deep/.el-row {
      height: 100%;
      .el-col {
        height: 100%;
        .el-card {
          height: 100%;
          overflow: scroll;
        }
      }
    }
  }
}
</style>