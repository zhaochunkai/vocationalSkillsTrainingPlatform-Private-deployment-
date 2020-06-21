<template>
  <div>
    <!-- 证书发放 -->
    <el-row :gutter="10">
      <el-col :span="5">
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
      <el-col :span="19">
        <el-card
          :style="style"
          v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level=='班级'"
        >
          <!-- 查询 -->
          <el-form class="t-form-block" ref="form" size="small" inline>
            <el-form-item label="姓名">
              <el-input v-model="conditionForm.studentName"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" width>
              <el-input v-model="conditionForm.idCard"></el-input>
            </el-form-item>
            <el-form-item label="证书类型">
              <el-select v-model="conditionForm.CertificateType" filterable placeholder="请选择">
                <el-option
                  v-for="(item,i) of AcademicYearData"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryList">搜索</el-button>
            </el-form-item>
          </el-form>
          <!-- 操作按钮 -->
          <div class="t-operate-buttons">
            <el-button type="primary" size="small" @click="issuingJudge()">发放证书</el-button>
            <el-button type="primary" size="small" @click="exportFile()">全部导出</el-button>
          </div>
          <!-- 表格 -->
          <el-table
            v-loading="loading"
            class="t-table-list"
            ref="multipleTable"
            stripe
            size="small"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin-top:10px;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              prop="studentName"
              sortable
              label="姓名"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="color:#00f"
                  @click="toInfomationPage(scope.row)"
                >{{scope.row.studentName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号" align="center"></el-table-column>
            <el-table-column prop="semesterName" label="学期" align="center"></el-table-column>
            <el-table-column prop="className" label="班级" align="center"></el-table-column>
            <el-table-column prop="projectName" label="培训项目" align="center"></el-table-column>
            <el-table-column prop="graduationTime" label="毕业年月" align="center">
              <template
                slot-scope="scope"
              >{{new Date(scope.row.graduationTime).toLocaleDateString()}}</template>
            </el-table-column>
            <el-table-column label="证书类型" align="center">
              <template slot-scope="scope">
                <div
                  style="margin: 8px 0"
                  v-for="item in scope.row.certificateGrantInfoList"
                  :key="item.certificatesGrantId"
                >{{item.certificateType}}</div>
              </template>
            </el-table-column>
            <el-table-column label="证书名称" align="center">
              <template slot-scope="scope">
                <div
                  style="margin: 8px 0"
                  v-for="item in scope.row.certificateGrantInfoList"
                  :key="item.certificatesGrantId"
                >{{item.certificateName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="证书编号" width="120" align="center">
              <template slot-scope="scope">
                <div
                  style="margin: 8px 0"
                  v-for="item in scope.row.certificateGrantInfoList"
                  :key="item.certificatesGrantId"
                >{{item.certificateCode}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="grantStatus" label="是否发放证书" width="100" align="center">
              <template slot-scope="scope">
                <div
                  style="margin: 8px 0"
                  v-for="item in scope.row.certificateGrantInfoList"
                  :key="item.certificatesGrantId"
                >
                  <div v-if="item.grantStatus=='已发放'" style="color:green;font-weight:bold">已发放</div>
                  <div v-else style="color:red;font-weight:bold">未发放</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="grantTime" label="发证日期" align="center">
              <template slot-scope="scope">
                <div
                  style="margin: 8px 0"
                  v-for="item in scope.row.certificateGrantInfoList"
                  :key="item.certificatesGrantId"
                >{{item.grantTime?new Date(item.grantTime).toLocaleDateString():''}}</div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <div
                  style="margin: 8px 0"
                  v-for="item in scope.row.certificateGrantInfoList"
                  :key="item.certificatesGrantId"
                >
                  {{item.certificatesGrantId?'':'暂无证书信息'}}
                  <span
                    style="color:blue;cursor:pointer;margin:0 2px"
                    @click="deleteIteam(item.certificatesGrantId)"
                    v-show="item.certificatesGrantId"
                  >删除</span>
                  <span
                    style="color:blue;cursor:pointer;margin:0 2px"
                    @click="viewItem(item.grantStatus,item.certificatesGrantId,scope.row.trainingProgramId)"
                    v-show="item.certificatesGrantId"
                  >查看</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <div class="t-operate-footer">
            <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
          </div>
          <!-- 学生证书信息详情 -->
          <student-certificate :viewForm="viewForm" :visible.sync="certificateVisible"></student-certificate>
          <!-- 证书发放 -->
          <distribute-certificate
            :bascinforData="bascinforData"
            :SelectedList="SelectedList"
            :visible.sync="distributeVisible"
          ></distribute-certificate>
        </el-card>
      </el-col>
    </el-row>
    <!-- 学生档案 -->
    <student-profile :nodeId="nodeId" :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
  </div>
</template>
<script>
import studentCertificate from "./certificate-management/student-certificate-information.vue";
import distributeCertificate from "./distribute-certificate-content.vue";
import studentProfile from "@/views/common/infomation-module/student-profile.vue";
import {
  getDictionaryItems,
  getGradeTree,
  GetGraduationStudentInfo,
  GetCertificateInfo,
  DeleteCertificatesGrant
} from "@/server/basic-module";
import orgTree from "@/components/orgTree.vue";
import pagination from "@/components/pagination";
import { pageSizes, pageSize } from "@/config.js";
import axios from "axios";
import { baseURL } from "../../../config";
export default {
  components: {
    orgTree,
    pagination,
    studentCertificate,
    distributeCertificate,
    studentProfile
  },
  data() {
    return {
      loading: true,
      bascinforData: {},
      profileVisible: false,
      addEditForm: {},
      style: "",
      style2: "",
      // -------------树
      TreeData: [],
      nodeSelect: {},
      nodeId: "",
      nodeName: "",
      className: "",
      TrainingProgramId: "",
      // -------------表格------------
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      GrantStatus: 2, // 发放状态 默认0 已发放1 2全部（用于查询）
      // -------------检索------------
      stautsList: [],
      conditionForm: {
        studentName: "",
        idCard: "",
        CertificateType: 2
      },
      AcademicYearData: [
        {
          name: "全部",
          id: 2
        },
        {
          name: "毕业证书",
          id: 0
        },
        {
          name: "技能证书",
          id: 1
        }
      ],
      candidateNo: "",
      name: "",
      /* -------------- 数据字典- 字典码 -------------- */
      dicJudgeName: {
        BYPDJG: "BYPDJG", // 毕业判定结果
        Education: "Education" // 学历
      },
      dictionary: {},
      /* -------------- 证书详情查看 -------------- */
      certificateVisible: false,
      viewForm: [],
      /* -------------- 证书详情发放 -------------- */
      SelectedList: [], // 传输的数组
      distributeVisible: false,
      //----------------------------导出------------------------------------
      studentIdList: []
    };
  },
  watch: {
    distributeVisible() {
      if (!this.distributeVisible) {
        this._GetGraduationStudentInfo();
      }
    },
    nodeId() {
      this.conditionForm.studentName = "";
      this.conditionForm.idCard = "";
    }
  },
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._getGradeTree();
    /* -------------- 数据字典- 获取数据字典下拉数据 -------------- */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result);
      });
    }
  },
  methods: {
    /* -------------------------- 查询 -------------------------- */
    _GetCertificateInfo(studentId, classId, tpId) {
      let data = {
        id: studentId,
        classId: classId,
        tpId: tpId
      };
      GetCertificateInfo(data)
        .then(res => {
          this.viewForm = res;
          this.certificateVisible = true;
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    _getGradeTree() {
      // 项目班级树
      this.TreeData = [];
      getGradeTree()
        .then(result => {
          this.TreeData.push(result);
        })
        .then(() => {
          if (this.nodeSelect.level === "班级") {
            this._GetGraduationStudentInfo();
          }
        });
    },
    //-----------获取证书学生列表--------------
    _GetGraduationStudentInfo(SkipCount = 0, pageSize = this.pageSize) {
      this.tableData = [];
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ClassId: this.nodeId,
        CertificatesType: this.conditionForm.CertificateType,
        StudentName: this.conditionForm.studentName,
        IdCard: this.conditionForm.idCard,
        GrantStatus: this.GrantStatus
      };
      GetGraduationStudentInfo(data).then(res => {
        if (res.totalCount > 0) {
          res.items.forEach(item => {
            item.certificateGrantInfoList.forEach(i => {
              if (i.grantStatus === 0) {
                i.grantStatus = "未发放";
                i.certificateType = "";
              } else if (i.grantStatus === 1) {
                i.grantStatus = "已发放";
                if (i.certificateType === "Graduation") {
                  i.certificateType = "毕业证书";
                } else {
                  i.certificateType = "技能证书";
                }
              }
            });
            this.tableData.push(item);
          });
          this.loading = false;
        }
        if (res.items[0]) {
          this.TrainingProgramId = res.items[0].trainingProgramId;
        } else {
          this.TrainingProgramId = "";
        }
        this.total = res.totalCount;
        // 传输基本信息
        this.bascinforData = {
          ClassId: this.nodeId,
          TrainingProgramId: this.TrainingProgramId
        };
      });
    },
    /* 接收改变后每页多少条 */
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetGraduationStudentInfo(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetGraduationStudentInfo(SkipCount, pageSize);
    },
    queryList() {
      this._GetGraduationStudentInfo();
    },
    /* -------------------------- 操作 -------------------------- */
    toInfomationPage(row) {
      // 跳转至学生档案模块
      this.addEditForm = {
        studentId: row.studentId, // 学生id
        name: row.studentName, // 学生姓名
        programId: row.trainingProgramId // 项目id
      };
      this.profileVisible = true;
    },
    viewItem(grantStatus, certificatesGrantId, trainingProgramId) {
      if (grantStatus === "已发放") {
        this._GetCertificateInfo(
          certificatesGrantId,
          this.nodeId,
          trainingProgramId
        );
      } else {
        this.$message.error("证书未发放,请发放证书后重试");
      }
    },
    issuingJudge() {
      if (this.SelectedList.length === 0) {
        this.$message.error("请选择学生");
        return;
      }
      this.distributeVisible = true;
      // 发放证书
    },
    deleteIteam(certificatesGrantId) {
      // 删除
      this.loading = true;
      this._DeleteCertificatesGrant(certificatesGrantId);
    },
    _DeleteCertificatesGrant(id) {
      DeleteCertificatesGrant(id).then(res => {
        this._GetGraduationStudentInfo();
      });
    },
    //-------------------------------导出-------------------------------
    exportFile() {
      // 导出
      this.studentIdList = [];
      this.SelectedList.forEach(item => {
        this.studentIdList.push(item.studentId);
      });
      if (this.studentIdList.length === 0) {
        this.exportFileData = {
          ClassId: this.nodeId,
          CertificatesType: this.conditionForm.CertificateType,
          StudentName: this.conditionForm.studentName,
          IdCard: this.conditionForm.idCard,
          GrantStatus: this.GrantStatus
        };
      } else {
        this.exportFileData = {
          ClassId: this.nodeId,
          CertificatesType: this.conditionForm.CertificateType,
          StudentName: this.conditionForm.studentName,
          IdCard: this.conditionForm.idCard,
          GrantStatus: this.GrantStatus,
          StudentIds: this.studentIdList.join(",")
        };
      }
      let Authorization = JSON.parse(localStorage.getItem("Authorization"));
      axios
        .get(`${baseURL}/Api/CertificateGrant/Export`, {
          headers: {
            Authorization:
              Authorization.token_type + " " + Authorization.access_token
          },
          responseType: "blob",
          params: this.exportFileData
        })
        .then(res => {
          const link = document.createElement("a");
          let blob = new Blob([res.data], { type: "application/ms-excel" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", "证书管理信息表格.xls"); //下载的文件名：link.download = data.fileName
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    // 全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    selectAll() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    handleSelectionChange(val) {
      this.SelectedList = val;
    },
    /* 选择的组织机构 */
    haddleOrganizationNode(node) {
      this.nodeSelect = node;
      this.nodeId = node.id;
      if (this.nodeSelect.level === "班级") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this._GetGraduationStudentInfo();
        }, 500);
      }
    },
    close() {
      this.$router.push({ path: "/marking/paper/list" });
    }
  }
};
</script>
