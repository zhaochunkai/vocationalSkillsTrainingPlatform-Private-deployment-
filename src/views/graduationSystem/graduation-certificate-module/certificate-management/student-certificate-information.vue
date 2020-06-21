<template>
  <el-drawer title="证书发放信息" v-if="visible" :visible="visible" size="70%" :before-close="close">
    <div class="content">
      <div class="t-operate-buttons">
        <h4>{{viewForm.studentName}}</h4>
        <!-- <el-button type="primary" size="small">上一位</el-button>
        <el-button type="primary" size="small">下一位</el-button>-->
      </div>
      <ul class="list">
        <li>
          <span>姓名</span>
          <span>{{viewForm.studentName}}</span>
          <span>身份证号</span>
          <span>{{viewForm.idCard}}</span>
        </li>
        <li>
          <span>培训项目</span>
          <span>{{viewForm.projectName}}</span>
          <span>学期</span>
          <span>{{viewForm.semesterName}}</span>
        </li>
        <li>
          <span>班级</span>
          <span>{{viewForm.className}}</span>
          <span>毕业年月</span>
          <span>{{new Date(viewForm.grantTime) | formatDate_1}}</span>
        </li>
        <li>
          <span>证书类型</span>
          <span>{{viewForm.certificateType=="Skill"?"技能证书":"毕业证书"}}</span>
          <span>证书编号</span>
          <span>{{viewForm.certificateCode}}</span>
        </li>
        <li>
          <span>证书名称</span>
          <span>{{viewForm.certificateName}}</span>
          <span>是否打印</span>
          <span>{{viewForm.printStatus==0?"未打印":"已打印"}}</span>
        </li>
        <li>
          <span>是否发放证书</span>
          <span>{{viewForm.grantStatus==1?'是':'否'}}</span>
          <span>发证日期</span>
          <span>{{new Date() | formatDate_1}}</span>
        </li>
        <li>
          <span>证书附件</span>
          <span>
            <el-button type="primary" size="small" @click="previewCert()">预览证书</el-button>
          </span>
          <span>备注</span>
          <span>{{viewForm.remarks}}</span>
        </li>
      </ul>
    </div>
    <!-- 预览证书 -->
    <el-drawer
      title="证书预览"
      :append-to-body="true"
      :before-close="innerClose_one"
      :visible.sync="innerDrawer_one"
      size="60%"
      class="innerCert"
    >
      <!-- 技能证书页 -->
      <skill-certificate :data="skillForm"></skill-certificate>
    </el-drawer>
    <el-drawer
      title="证书预览"
      :append-to-body="true"
      :before-close="innerClose_two"
      :visible.sync="innerDrawer_two"
      size="60%"
      class="innerCert"
    >
      <!-- 毕业证书 -->
      <diploma-certificate :data="diplomaForm"></diploma-certificate>
    </el-drawer>
    <el-drawer
      title="证书预览"
      :append-to-body="true"
      :before-close="innerClose_three"
      :visible.sync="innerDrawer_three"
      size="60%"
      class="innerCert"
    >
      <!-- 结业证书 -->
      <completion-certificate :data="completionForm"></completion-certificate>
    </el-drawer>
    <el-drawer
      title="证书预览"
      :append-to-body="true"
      :before-close="innerClose_fore"
      :visible.sync="innerDrawer_fore"
      size="60%"
      class="innerCert"
    >
      <!-- 学士学位证书 -->
      <degree-certificate :data="degreeForm"></degree-certificate>
    </el-drawer>
  </el-drawer>
</template>
<script>
import skillCertificate from "../certificate-printing/skill-certificate.vue";
import completionCertificate from "../certificate-printing/completion-certificate.vue";
import degreeCertificate from "../certificate-printing/degree-certificate.vue";
import diplomaCertificate from "../certificate-printing/diploma-certificate.vue";
export default {
  props: ["visible", "viewForm"],
  components: {
    skillCertificate,
    completionCertificate,
    degreeCertificate,
    diplomaCertificate
  },
  data() {
    return {
      isShow: true,
      innerDrawer_one: false,
      innerDrawer_two: false,
      innerDrawer_three: false,
      innerDrawer_fore: false,

      degreeForm: [], //学士学位证书传递数据
      completionForm: [], //结业证书传递数据
      diplomaForm: [], //毕业证书传递数据
      skillForm: [] //技能证书传递数据
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        // console.log(this.viewForm);
      }
    }
  },
  activated() {},
  methods: {
    // ------------------------证书发放信息----------------------
    previewCert() {
      if (this.viewForm.certificateType == "Graduation") {
        if (this.viewForm.certificateName == "毕业证书") {
          this.diplomaForm = this.viewForm;
          this.innerDrawer_two = true;
        } else if (this.viewForm.certificateName == "结业证书") {
          this.completionForm = this.viewForm;
          this.innerDrawer_three = true;
        } else {
          this.innerDrawer_fore = true;
          // this.degreeForm = this.viewForm;
        }
      } else {
        this.skillForm = this.viewForm;
        this.innerDrawer_one = true;
      }
    },
    close() {
      this.$emit("update:visible", false);
    },
    innerClose_one() {
      this.innerDrawer_one = false;
    },
    innerClose_two() {
      this.innerDrawer_two = false;
    },
    innerClose_three() {
      this.innerDrawer_three = false;
    },
    innerClose_fore() {
      this.innerDrawer_fore = false;
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-drawer__header {
  margin: 0;
  border-bottom: 1px solid #e5e5ee;
  span {
    margin: 10px;
  }
}
/deep/.el-drawer__body {
  overflow: scroll;
  .content {
    .t-operate-buttons {
      display: flex;
      align-items: center;
      h4 {
        font-size: 24px;
        margin-right: 40px;
      }
      .el-button {
        width: 72px;
        height: 34px;
        margin: 10px;
      }
    }
    ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      padding-left: 0;
      margin: 0;
      li {
        width: 100%;
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #e5e5ee;
        border-top: none;
        border-left: none;
        text-align: center;
        &:nth-child(2n-1) {
          background-color: rgba(238, 238, 238, 0.5);
        }
        span {
          display: block;
          &:nth-child(2n-1) {
            width: 30%;
            font-size: 14px;
            color: #333;
            padding-left: 10px;
            white-space: nowrap;
            border-right: 1px solid #e5e5ee;
            border-left: 1px solid #e5e5ee;
          }
          &:nth-child(2n) {
            width: 70%;
            color: #000;
            font-size: 12px;
            padding-left: 10px;
          }
        }
      }
    }
  }
}
</style>