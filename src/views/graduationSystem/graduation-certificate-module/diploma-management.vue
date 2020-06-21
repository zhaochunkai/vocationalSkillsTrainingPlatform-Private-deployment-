<template>
  <div>
    <!-- 毕业证书管理 -->
    <el-card :style="style">
      <div class="beforeShow">
        <!-- 查询 -->
        <el-form class="t-operate-filter" :inline="true" :model="CertificateForm" size="small">
          <el-form-item label="证书名称" prop>
            <el-input v-model="CertificateName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="SearchFor">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 操作 -->
        <el-form class="t-operate-filter" :inline="true" size="small">
          <el-form-item>
            <el-button type="primary" @click="EnableCert">启用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="DisableCert">禁用</el-button>
          </el-form-item>
        </el-form>
        <!-- 证书列表 -->
        <el-table
          class="t-table-list"
          ref="multipleTable"
          stripe
          size="small"
          :data="approvalList"
          tooltip-effect="dark"
          style="width: 100%;margin-top:10px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column
            prop="certificateName"
            sortable
            label="证书名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="styleDesign(scope.row.id,scope.row.certificateName)"
              >证书样式设计</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 增加 -->
      <add-management :visible.sync="infoVisible" @func="addList(arguments)"></add-management>
      <!-- 学士学位证书 -->
      <degree-certificate :visible.sync="degreeVisible" :data="degreeForm"></degree-certificate>
      <!-- 结业证书 -->
      <completion-certificate :visible.sync="completionVisible" :data="completionForm"></completion-certificate>
      <!-- 毕业证书 -->
      <diploma-certificate :visible.sync="diplomaVisible" :data="diplomaForm"></diploma-certificate>
    </el-card>
  </div>
</template>
<script>
import completionCertificate from "./certificate-management/completion-certificate.vue";
import degreeCertificate from "./certificate-management/degree-certificate.vue";
import diplomaCertificate from "./certificate-management/diploma-certificate.vue";
import { pageSizes, pageSize } from "@/config.js";
import addManagement from "./diploma-add-management";
import {
  SetBackgroundIm,
  GetCertificatePageList,
  DeleteCertificate,
  UpCertificateStatus
} from "@/server/basic-module";
export default {
  components: {
    addManagement,
    completionCertificate,
    degreeCertificate,
    diplomaCertificate
  },
  data() {
    return {
      infoVisible: false,
      imgUrlBig: "",
      flag: true,
      style: "",
      CertificateForm: {},
      pageSizes,
      pageSize,
      CertificateType: 0,
      CertificateName: "",
      total: 0,
      approvalList: [], //审批列表
      /* -----------------------------证书样式设计-------------- */
      degreeVisible: false,
      completionVisible: false,
      diplomaVisible: false,
      degreeForm: [], //证书样式数据传递
      completionForm: [], //证书样式数据传递
      diplomaForm: [], //证书样式数据传递
      removeList: [],
      //---------------启用-----------------
      numEnable: 0,
      //---------------禁用-----------------
      numDisable: 0
    };
  },
  watch: {},
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._GetCertificatePageList(
      this.SkipCount,
      this.pageSize,
      this.CertificateType,
      this.CertificateName
    );
  },
  methods: {
    // ---------------启用证书---------------
    EnableCert() {
      if (this.removeList.length == 0) {
        this.$message("请选择要操作的证书");
        return;
      }
      if (this.numEnable == 0 || this.numDisable == 0) {
        this._UpCertificateStatus(1);
      } else {
        this.$confirm("所选材料状态不一致，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this._UpCertificateStatus(1);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消启用"
            });
          });
      }
    },
    // ------------------禁用证书---------------
    DisableCert() {
      if (this.removeList.length == 0) {
        this.$message("请选择要操作的证书");
        return;
      }
      if (this.numEnable == 0 || this.numDisable == 0) {
        this._UpCertificateStatus(2);
      } else {
        this.$confirm("所选材料状态不一致，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this._UpCertificateStatus(2);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消禁用"
            });
          });
      }
    },
    _UpCertificateStatus(status) {
      let data = {
        id: this.removeList,
        status: status
      };
      UpCertificateStatus(data).then(res => {
        if (status == 1) {
          this.$message({
            type: "success",
            message: "已启用"
          });
        } else if (status == 2) {
          this.$message({
            type: "success",
            message: "已禁用"
          });
        }
        this._GetCertificatePageList(
          this.SkipCount,
          this.pageSize,
          this.CertificateType,
          this.CertificateName
        );
      });
    },
    //删除
    DeleteCert() {
      this.loading = true;
      setTimeout(() => {
        this._DeleteCertificate(this.removeList.join(","));
      }, 500);
    },
    _DeleteCertificate(list) {
      let vm = this;
      DeleteCertificate(list).then(res => {
        vm._GetCertificatePageList(
          vm.SkipCount,
          vm.pageSize,
          vm.CertificateType,
          vm.CertificateName
        );
        this.loading = false;
      });
    },
    //样式设计，进入详情
    styleDesign(id, name) {
      if (name == "毕业证书") {
        this.diplomaForm = {
          id: id
        };
        this.diplomaVisible = true;
      } else if (name == "结业证书") {
        this.completionForm = {
          id: id
        };
        this.completionVisible = true;
      } else {
        // this.degreeForm = {
        //   id: id
        // };
        // this.degreeVisible = true;
      }
    },
    /* --------------------------------------------查询--------------------------------------- */
    // 获取培训项目下拉列表
    _GetCertificatePageList(
      SkipCount,
      pageSize,
      CertificateType,
      CertificateName
    ) {
      let data = {
        MaxResultCount: pageSize,
        SkipCount: SkipCount,
        CertificateType: CertificateType,
        CertificateName: CertificateName
      };
      GetCertificatePageList(data).then(res => {
        this.approvalList = [];
        res.items.forEach(item => {
          if (item.status == "Disable") {
            item.status = "禁用";
          } else {
            item.status = "启用";
          }
        });
        this.total = res.totalCount;
        res.items.forEach(item => {
          if (item.certificateName != "学士学位证书") {
            this.approvalList.push(item);
          }
        });
      });
    },
    // 搜索
    SearchFor() {
      this._GetCertificatePageList(
        this.SkipCount,
        this.pageSize,
        this.CertificateType,
        this.CertificateName
      );
    },
    // 获取审批列表

    /* ------------------------------------ 操作按钮 -------------------------- */

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
      let arr = [];
      this.numEnable = 0;
      this.numDisable = 0;
      val.forEach(item => {
        arr.push(item.id);
        //-------------判断状态是否一致------------------
        if (item.status == "启用") {
          this.numEnable++;
        } else if (item.status == "禁用") {
          this.numDisable++;
        }
        //----------------------------------------------
      });
      this.removeList = [...new Set(arr)];
    },
    // 渲染列表,数据来源于子组件传值
    addList(data) {
      this.approvalList = data[0];
    }
  }
};
</script>
<style lang="less" scoped>
</style>