<template>
  <el-dialog
    class="t-dialog"
    v-if="visible"
    title="毕业要求审批"
    :visible="visible"
    :close-on-click-modal="true"
    width="500px"
    @close="close"
  >
    <div class="content">
      <div class="certificateImg">
        <div class="certificate" v-for="item in certificateList" :key="item.id">
          <img :src="item.certificateUrl?item.certificateUrl:certificateImg" alt />
          <p>{{item.certificateName?item.certificateName: '暂无相关信息'}}</p>
        </div>
      </div>
      <div class="opinion">
        <p>审批意见</p>
        <textarea cols="30" rows="10" v-model="dataForm.approvalComments"></textarea>
      </div>
      <div class="result">
        <p>判定结果</p>
        <div class="res_select">
          <el-radio v-model="radio" label="1">通过</el-radio>
          <el-radio v-model="radio" label="2">未通过</el-radio>
        </div>
        <p style="color:red;margin-left:20px">*</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveContent">保存</el-button>
        <el-button type="primary" size="small" @click="close">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { StudentCertificate, ApproveCertificate } from "@/server/basic-module";
export default {
  props: ["visible", "dataForm"],
  data() {
    return {
      radio: 0,
      form: {},
      certificateList: [{}, {}], //学生证书列表
      pass: false, //是否通过
      certificateImg: require("@/assets/images/u32.png")
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this._StudentCertificate();
      }
    }
  },
  mounted() {},
  methods: {
    // -----------------------------------------获取学生证书-----------------------------------
    _StudentCertificate() {
      let data = {
        studentId: this.dataForm.studentId,
        trainingProgramsId: this.dataForm.trainingProgramsId
      };
      StudentCertificate(data).then(res => {
        if (res[0] == null) {
          return;
        }
        this.certificateList = res;
      });
    },
    // ----------------------------------------审批------------------------------------
    _ApproveCertificate(pass, approvalComments) {
      let data = {
        id: this.dataForm.studentId,
        pass: this.pass,
        trainingProgramsId: this.dataForm.trainingProgramsId,
        approvalComments: this.dataForm.approvalComments
      };
      ApproveCertificate(data)
        .then(res => {
          this.$alert("审核成功");
          this.$emit("update:visible", false);
          this.radio = 0;
        })
        .catch(err => {
          this.$alert(err.message);
        });
    },
    close () {
      this.$emit("update:visible", false);
      this.radio = 0;
    },
    saveContent() {
      if (this.radio == 0) {
        this.$message.error("判定结果未勾选");
        return;
      } else if (this.radio == 1) {
        this.pass = true;
      } else {
        this.pass = false;
      }
      this._ApproveCertificate();
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
    .certificateImg {
      display: flex;
      .certificate {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
        img {
          width: 150px;
          height: 150px;
          display: block;
        }
      }
    }
    .opinion {
      display: flex;
      margin-top: 40px;
      p {
        margin-right: 10px;
      }
    }
    .result {
      display: flex;
      align-items: center;
      margin-top: 20px;
      p {
        margin-right: 10px;
      }
      .res_select {
        margin-left: 40px;
      }
    }
    .btn {
      margin-top: 40px;
      .el-button {
        margin: 20px;
      }
    }
  }
}
</style>