<template>
  <el-dialog
    class="t-dialog"
    v-if="visible"
    title="证书基本信息"
    :visible="visible"
    :close-on-click-modal="true"
    width="500px"
    @close="close"
  >
    <div class="content">
      <div class="int">
        <p style="width:80px">证书名称</p>
        <el-input v-model="input" placeholder="请输入" @keyup.enter.native="sendMsg"></el-input>
        <p style="color:red;width:20px;text-align:center">*</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sendMsg">保存</el-button>
        <el-button type="primary" size="small" @click="close">返回</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { pageSizes, pageSize } from '@/config.js'
import {
  CreateCertificate,
  GetCertificatePageList
} from "@/server/basic-module";
export default {
  props: ["visible"],
  data() {
    return {
      input: "",
      changeList: [],
      pageSize,
      total: 0
    };
  },
  watch: {
    visible (newVal) {
      this.tableData = [];
      if (newVal) {
        this.tableData.push(this.dataForm);
      }
    }
  },
  activated() {},
  methods: {
    sendMsg() {
      this.$emit("update:visible", false);
      setTimeout(() => {
        this._CreateCertificate(this.input, 0);
      }, 500);
    },
    close() {
      this.input = "";
      this.$emit("update:visible", false);
    },
    // 添加
    _CreateCertificate(CertificateName, CertificateType) {
      let data = {
        CertificateName: CertificateName,
        CertificateType: CertificateType
      };
      CreateCertificate(data).then(res => {
        this._GetCertificatePageList(this.pageSize, 0);
        setTimeout(() => {
          this.$alert("添加成功");
          //func: 是父组件指定的传数据绑定的函数，this.input:子组件给父组件传递的数
          this.$emit("func", this.changeList, this.total);
          this.input = "";
        }, 100);
      })
    },

    // 获取培训项目列表
    _GetCertificatePageList(pageSize, CertificateType) {
      let data = {
        MaxResultCount: pageSize,
        CertificateType: CertificateType
      };
      GetCertificatePageList(data).then(res => {
        res.items.forEach(item => {
          if (item.status == "Disable") {
            item.status = "禁用";
          } else {
            item.status = "启用";
          }
        })
        this.total = res.totalCount;
        this.changeList = res.items;
      })
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .int {
      display: flex;
      width: 100%;
    }
    .btn {
      margin-top: 20px;
      .el-button {
        margin: 10px;
      }
    }
  }
}
</style>