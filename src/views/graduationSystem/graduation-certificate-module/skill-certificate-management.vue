<template>
  <div>
    <!-- 毕业证书管理 -->
    <el-card :style="style" v-loading="loading">
      <div class="beforeShow">
        <!-- 查询 -->
        <el-form class="t-operate-filter" :inline="true" size="small">
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
            <el-button type="primary" @click="addCert">增加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="modifyCert">修改</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="DeleteCert">删除</el-button>
          </el-form-item>
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
          <el-table-column label="是否设置证书查询地址" width="200" align="center">
            <template slot-scope="scope">{{scope.row.inquireUrl?"是":"否"}}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="styleDesign(scope.row.id,scope.row.certificateName,scope.row.inquireUrl)"
                align="center"
              >证书样式设计</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination
            ref="pagination"
            :total="total"
            @sizeChange="handleSize"
            @currentChange="handleCurrent"
          ></pagination>
        </div>
      </div>
      <!-- 增加 -->
      <add-certificate :visible.sync="infoVisible"></add-certificate>

      <!-- 修改 -->
      <modify-evidence :removeList="removeList" :visible.sync="modifyVisible"></modify-evidence>
      <!-- 证书样式页 -->
      <skill-certificate :visible.sync="styleVisible" :skillForm="skillForm"></skill-certificate>
    </el-card>
  </div>
</template>
<script>
import skillCertificate from "./certificate-management/skill-certificate.vue";
import { pageSizes, pageSize } from "@/config.js";
import addCertificate from "./skill-add-certificate";
import pagination from "@/components/pagination";
import {
  GetCertificatePageList,
  DeleteCertificate,
  UpCertificateStatus
} from "@/server/basic-module";
import modifyEvidence from "./modify-evidence-column";
export default {
  components: { addCertificate, pagination, skillCertificate, modifyEvidence },
  data() {
    return {
      loading: false,
      removeId: [],
      removeList: [],
      approvalList: [], //证书列表
      isSelectAll: false,
      multipleSelection: [],
      id: "",
      infoVisible: false,
      imgUrlBig: "",
      digitalMark: 0,
      style: "",
      pageSizes,
      pageSize,
      CertificateType: 1,
      CertificateName: "",
      total: 0,

      modifyVisible: false,
      /* -----------------------------证书样式设计-------------- */
      styleVisible: false,
      skillForm: [], //证书样式数据传递
      //---------------启用-----------------
      numEnable: 0,
      //---------------禁用-----------------
      numDisable: 0
    };
  },
  watch: {
    modifyVisible() {
      if (this.modifyVisible == false) {
        this._GetCertificatePageList(
          this.SkipCount,
          this.pageSize,
          this.CertificateType,
          this.CertificateName
        );
      }
    },
    infoVisible() {
      if (this.infoVisible == false) {
        setTimeout(() => {
          this._GetCertificatePageList(
            this.SkipCount,
            this.pageSize,
            this.CertificateType,
            this.CertificateName
          );
        }, 500);
      }
    }
  },
  mounted() {},
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
      if (this.removeId.length == 0) {
        this.$message("请选择要启用的技能证书");
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
      if (this.removeId.length == 0) {
        this.$message("请选择要禁用的技能证书");
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
        id: this.removeId,
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
    //样式设计，进入详情
    styleDesign(id, name, url) {
      this.skillForm = { id, name, url };
      this.styleVisible = true;
    },
    //增加
    addCert() {
      this.infoVisible = true;
    },
    //修改
    modifyCert() {
      if (this.removeId.length == 0) {
        this.$message("请选择要修改的技能证书");
        return;
      } else if (this.removeId.length > 1) {
        this.$message("最多选择一条");
        return;
      } else {
        this.modifyVisible = true;
      }
    },
    //删除
    DeleteCert() {
      if (this.removeId.length == 0) {
        this.$message("请选择要修改的技能证书");
        return;
      }
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._DeleteCertificate(this.removeId.join(","));
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    _DeleteCertificate(list) {
      let vm = this;
      DeleteCertificate(list)
        .then(res => {
          vm._GetCertificatePageList(
            vm.SkipCount,
            vm.pageSize,
            vm.CertificateType,
            vm.CertificateName
          );
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    /* --------------------------------------------查询--------------------------------------- */
    // 获取培训项目列表
    _GetCertificatePageList(
      SkipCount,
      pageSize,
      CertificateType,
      CertificateName
    ) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        CertificateType: CertificateType,
        CertificateName: CertificateName
      };
      GetCertificatePageList(data).then(res => {
        res.items.forEach(item => {
          if (item.status == "Disable") {
            item.status = "禁用";
          } else {
            item.status = "启用";
          }
        });
        this.total = res.totalCount;
        this.approvalList = res.items;
      });
    },
    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetCertificatePageList(
        SkipCount,
        pageSize,
        this.CertificateType,
        this.CertificateName
      ); // 获取审批列表
    },
    /*接收当前页数*/
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GetCertificatePageList(
        SkipCount,
        pageSize,
        this.CertificateType,
        this.CertificateName
      );
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
      let arr1 = [];
      this.numEnable = 0;
      this.numDisable = 0;
      val.forEach(item => {
        arr.push(item.id);
        arr1.push(item); //certificateName
        //-------------判断状态是否一致------------------
        if (item.status == "启用") {
          this.numEnable++;
        } else if (item.status == "禁用") {
          this.numDisable++;
        }
        //----------------------------------------------
      });
      this.removeId = [...new Set(arr)];
      this.removeList = [...new Set(arr1)];
      this.multipleSelection = val;
      // 判断是否是全选
      this.isSelectAll =
        this.approvalList.length === this.multipleSelection.length;
    },
    inputReturn() {
      this.flag = true;
      this.markFlag = false; //隐藏有样式部分
      this.digitalMark = 0; //退出都不选中
    }
  }
};
</script>
<style lang="less" scoped>
</style>