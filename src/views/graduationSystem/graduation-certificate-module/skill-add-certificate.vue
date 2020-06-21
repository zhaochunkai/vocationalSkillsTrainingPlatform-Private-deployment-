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
        <p style="width:90px">证书名称</p>
        <el-input v-model="input" placeholder="请输入" style="width:250px"></el-input>
        <p style="color:red;width:20px;text-align:center">*</p>
      </div>
      <div class="int">
        <p style="width:90px">证书查询地址</p>
        <el-input v-model="address" placeholder="请输入" style="width:250px"></el-input>
        <p style="color:#AAAAAA;margin-left:10px">用于证书查询</p>
      </div>
      <div slot="footer" style="margin-top:40px">
        <el-button type="primary" size="small" @click="sendMsg">保存</el-button>
        <el-button type="primary" size="small" @click="close">返回</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { CreateCertificate } from "@/server/basic-module";
export default {
  props: ["visible"],
  data() {
    return {
      input: "",
      address: "",
      changeList: []
    };
  },
  watch: {
    visible(newVal) {
      this.tableData = [];
      if (newVal) {
        this.tableData.push(this.dataForm);
      }
    }
  },
  activated() {},
  methods: {
    sendMsg() {
      if (this.input == "") {
        this.$message.error("请输入证书名称");
        return;
      }
      if (this.address != "") {
        const reg = /^(((file|gopher|news|nntp|telnet|http|ftp|https|ftps|sftp):\/\/)|(www\.))+(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(\/[a-zA-Z0-9\&%_\./-~-]*)?$/;
        if (!reg.test(this.address)) {
          this.$message.error("请输入正确域名");
          return;
        }
      }
      this._CreateCertificate(this.input, 1, this.address);
    },
    close() {
      this.input = "";
      this.address = "";
      this.$emit("update:visible", false);
    },
    // 添加
    _CreateCertificate(CertificateName, CertificateType, InquireUrl) {
      let data = { CertificateName, CertificateType, InquireUrl };
      CreateCertificate(data)
        .then(res => {
          this.input = "";
          this.$message.success("添加成功");
          this.$emit("update:visible", false);
        })
        .catch(err => {
          this.$message.error(err);
        });
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
      margin-top: 40px;
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