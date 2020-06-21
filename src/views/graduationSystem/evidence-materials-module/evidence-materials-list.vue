<template>
  <div>
    <!-- 佐证材料 -->
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
      <el-col :span="19" v-show="nodeLevel">
        <el-card :style="style" v-show="JSON.stringify(nodeSelect) != '{}' && nodeLevel=='班级'">
          <!-- 表单 -->
          <!-- <div class="header">
            <span>备注：佐证材料准备齐全后，方可提交，一旦提交则不可再修改</span>
            <span>审批意见：{{tableData.reason?tableData.reason:"无"}}</span>
            <span>状态：{{approvalStatus}}</span>
            <div
              style="cursor: pointer;width:80px;min-width:80px;height:40px;line-height:40px;  background-color: #4593bf; text-align:center;border-radius:4px"
            >
              <el-dropdown @command="submitContent">
                <p style="font-size:16px;color:#ffff;line-height:4px">提交到</p>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="item in governmentList"
                    :key="item.id"
                    :command="item.id"
                  >{{item.displayName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>-->
          <!-- 表格 -->
          <el-table
            v-loading="loading"
            class="t-table-list"
            ref="multipleTable"
            stripe
            size="small"
            :data="tableData.submitContentsJsons"
            tooltip-effect="dark"
            style="width: 100%;margin-top:10px;"
            align="center"
            @selection-change="handleSelectionChange"
          >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              prop="name"
              sortable
              label="佐证材料名称"
              show-overflow-tooltip
              align="center"
            ></el-table-column>
            <el-table-column prop="type" label="类型" align="center">
              <template slot-scope="scope">{{scope.row.type==0?"系统内置":"自定义"}}</template>
            </el-table-column>
            <!-- <el-table-column prop="remarks" label="备注" align="center"></el-table-column> -->
            <!-- <el-table-column prop="fileName" label="上传文件" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.materialList.length==0">
                  <ul
                    v-for="(item,i) in scope.row.fileName"
                    :key="item.id"
                    style="display:flex;align-items:center"
                  >
                    <li style="list-style:none;color:#1A1AE6;margin-right:2px">{{item}}</li>
                    <li
                      class="el-icon-close"
                      style="cursor:pointer;color:red"
                      @click="removeItem(scope.row.fileName,scope.row.filePath,scope.row.nameApath,i)"
                    ></li>
                  </ul>
                </div>
                <div v-else>
                  <ul
                    v-for="item in scope.row.materialList"
                    :key="item.id"
                    style="display:flex;align-items:center"
                  >
                    <li
                      @click="downLoad(item.imgUrl)"
                      style="list-style:none;color:#1A1AE6;margin-right:2px;cursor:pointer"
                    >{{item.name}}</li>
                  </ul>
                </div>
              </template>
            </el-table-column>-->
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.type==0">
                  <el-button size="small" type="primary" @click.native="searchFor(scope.row)">查看</el-button>
                </div>
                <div v-else>
                  <div v-if="scope.row.materialList.length==0">
                    <el-upload
                      class="upload-demo"
                      :http-request="handleUploadFileToCos"
                      action="fakeaction"
                      :show-file-list="false"
                      :on-success="imgHandleSuccess"
                      multiple
                    >
                      <el-button size="small" type="primary" @click.native="uploadCert(scope)">上传</el-button>
                    </el-upload>
                  </div>
                  <div v-else>
                    <el-button size="small" type="warning" plain disabled>不能重复上传</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 内置佐证材料查看 -->
    <built-in :visible.sync="searchForVisible" :data="searchForData" :nodeId="nodeId"></built-in>
  </div>
</template>
<script>
import builtIn from "./built-in-materials/built-in-materials-list.vue"; //组件不需要加{}，而变量则需要加上
import {
  getGradeTree,
  GetSupportingMaterialsAuditInfo,
  SubmitReview
  // GetGovernmentInformation
} from "@/server/basic-module";
import orgTree from "@/components/orgTree.vue";
export default {
  components: { builtIn },
  data() {
    return {
      //-----内置佐证材料查看----
      searchForVisible: false,
      searchForData: [],
      loading: false,
      governmentList: [], // 政府端列表
      // 审核状态
      approvalStatus: "",
      fileSubmitContents: [],
      nameApath: [],
      filePathName: [],
      selectedList: [],
      style: "",
      // -------------树
      TreeData: [],
      nodeSelect: {},
      nodeId: "",
      nodeName: "",
      nodeLevel: "",
      classId: "",
      className: "",
      TrainingProgramId: "",
      // -------------表单------------
      // -------------表格-----------
      tableData: [],
      conditionForm: {
        studentName: "",
        idCarde: "",
        CertificateType: 0
      },
      // 上传成功后返回的地址
      fileName: [],
      filePath: [],
      index: null
    };
  },
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._getGradeTree();
  },
  methods: {
    //--------------------------------系统内置查看-------------------------------
    searchFor(row) {
      this.searchForVisible = true;
      this.searchForData = row;
    },
    //-------------------------------------------------------------
    //_GetGovernmentInformation(id) {
    //  GetGovernmentInformation(id).then(res => {
    //   this.governmentList = res;
    //  });
    //},
    handleClick() {
      console.log(111);
    },
    downLoad(imgUrl) {
      window.open(imgUrl, "_blank");
    },
    removeItem(arrFile, arrPath, nameApath, index) {
      arrFile.splice(index, 1);
      arrPath.splice(index, 1);
      nameApath.splice(index, 1);
    },
    // -------------------------------------查询-------------------------------------
    _getGradeTree() {
      // 项目班级树
      this.TreeData = [];
      getGradeTree().then(result => {
        this.TreeData.push(result);
      });
    },
    // 佐证材料列表
    _GetSupportingMaterialsAuditInfo(id) {
      GetSupportingMaterialsAuditInfo(id).then(res => {
        if (res.auditStatus == "Auditing") {
          this.approvalStatus = "审批中";
        } else if (res.auditStatus == "Pass") {
          this.approvalStatus = "通过";
        } else if (res.auditStatus == "NotPass") {
          this.approvalStatus = "未通过";
        } else if (res.auditStatus == "NotSubmitted") {
          this.approvalStatus = "未提交";
        }
        this.tableData = res;
        this.loading = false;
      });
    },
    /* ------------------------------------ 操作 -------------------------- */
    // 上传
    uploadCert(scope) {
      if (this.index == null) {
        this.index = scope.$index;
        return;
      }
      if (this.index == scope.$index) {
        return;
      }
      this.fileName = [];
      this.filePath = [];
      this.nameApath = [];
      this.index = scope.$index;
    },
    // 上传文件
    uploadFile(index, name) {
      return this.$set(
        this.tableData.submitContentsJsons[index],
        "fileName",
        name
      );
    },
    // 上传文件地址
    uploadPath(index, path) {
      return this.$set(
        this.tableData.submitContentsJsons[index],
        "filePath",
        path
      );
    },
    // 提交文件，对象类型
    upnameApath(index, nameApath) {
      return this.$set(
        this.tableData.submitContentsJsons[index],
        "nameApath",
        nameApath
      );
    },
    // 提交
    submitContent(command) {
      if (this.approvalStatus == "审批中") {
        this.$message("材料审批中，请勿重复提交");
        return;
      } else if (this.approvalStatus == "通过") {
        this.$message("提交材料已通过，请勿重复提交");
        return;
      } else if (this.approvalStatus == "未通过") {
        if (this.selectedList.length == 0) {
          this.$message("请选择上传材料");
          return;
        } else {
          this._SubmitReview(command);
          return;
        }
      } else if (this.approvalStatus == "未提交") {
        if (this.selectedList.length == 0) {
          this.$message("请选择上传材料");
          return;
        } else {
          this._SubmitReview(command);
          return;
        }
      }
    },
    _SubmitReview(id) {
      let data = {
        GovId: id,
        ClassId: this.classId,
        SubmitContentsJson: this.fileSubmitContents
      };
      SubmitReview(data)
        .then(res => {
          this.$message("提交成功");
          this.approvalStatus = "审批中";
          this._GetSupportingMaterialsAuditInfo(this.classId);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // ----------------------上传--------------------

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
      val.forEach(item => {
        this.fileSubmitContents.push({
          Name: item.name,
          Remarks: item.remarks,
          MaterialList: item.nameApath ? item.nameApath : [],
          Type: 1
        });
      });
      this.selectedList = val;
    },
    /* ------------------------------------------- COS 初始化实例 ---------------------------------------- */
    formatDate(time) {
      // 日期时间转换为 yyyymmdd
      const date = new Date(time);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      // eslint-disable-next-line no-unused-vars
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      // eslint-disable-next-line no-unused-vars
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      // eslint-disable-next-line no-unused-vars
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "" + m + "" + d;
    },
    formatWholeDate(time) {
      // 日期时间转换为 YYYYMMDDhhmmss
      const date = new Date(time);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "" + m + "" + d + "" + h + "" + minute + "" + second;
    },
    // ---------------------------上传腾讯云---------------------------
    handleUploadFileToCos(params) {
      // -----------文件上传-----COS上传|本地上传，size 单位 Kb
      let file = params.file;
      let dataTime = new Date();
      let vm = this;
    },
    // 缩略图上传成功后
    imgHandleSuccess(filesponse) {
      if (filesponse.statusCode === 200) {
        let name = filesponse.Key.substr(filesponse.Key.indexOf("_") + 1);
        let path = filesponse.Key;
        this.fileName.push(name);
        this.filePath.push(path);
        this.nameApath.push({
          Name: name,
          ImgUrl: path
        });
        this.uploadFile(this.index, this.fileName);
        this.uploadPath(this.index, this.filePath);
        this.upnameApath(this.index, this.nameApath);
      }
    },
    /* 选择的组织机构 */
    haddleOrganizationNode(node) {
      this.loading = true;
      this.nodeSelect = node;
      this.nodeId = node.id;
      this.nodeName = node.label;
      this.nodeLevel = node.level; // 显示右边
      this.classId = "";
      this.className = "";
      if (node.level == "班级") {
        this.tableData.submitContentsJsons = [
          {
            name: "人才培养方案",
            type: 0,
            materialList: []
          },
          {
            name: "课表",
            type: 0,
            materialList: []
          },
          {
            name: "学员花名册",
            type: 0,
            materialList: []
          },
          {
            name: "成绩信息",
            type: 0,
            materialList: []
          },
          {
            name: "直播学习记录",
            type: 0,
            materialList: []
          },
          {
            name: "直播考勤",
            type: 0,
            materialList: []
          },
          {
            name: "在线学习考勤",
            type: 0,
            materialList: []
          },
          {
            name: "在线学习跟踪记录",
            type: 0,
            materialList: []
          }
        ];
        setTimeout(() => {
          this.loading = false;
        }, 500);
        this.classId = node.id;
        this.className = node.label;
        // this._GetGovernmentInformation(this.classId);
        // this._GetSupportingMaterialsAuditInfo(this.classId);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
</style>