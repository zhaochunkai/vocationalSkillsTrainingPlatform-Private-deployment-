<template>
  <div class="content" id="printCompletion">
    <div
      class="img_left"
      :style="{backgroundImage: 'url(' + (data.backgroundImg) + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
    >
      <div class="leftImg_content">
        <div class="c_top">
          <div class="top_logo">
            <img :src="`${baseURL}/${data.logoImgUrl}`" width="80px" alt />
            <p style="font-size:24px;margin-left:20px;letter-spacing:6px">{{data.schoolName}}</p>
          </div>
          <p style="font-size:40px;margin:-10px;letter-spacing:12px">结业证书</p>
        </div>
        <div class="c_center">
          <div>
            <img :src="`${baseURL}/${data.photo}`" height="120px" alt />
          </div>
          <div class="center_content">
            学生
            <span>{{data.studentName}}</span>
            (
            <span>{{data.idCard}}</span>)，于
            <span>{{new Date(data.startTime) | formatDate_1}} 至 {{new Date(data.endTime) | formatDate_1}}</span>完成了
            <span>{{data.projectName}}</span>项目
            （
            <span>{{data.projectName}}</span>）专业线上学习，
            课时
            <span>{{data.classHours}}</span>学时
            <span>{{data.minutes}}</span>分钟
            ，完成规定的课程内容，经考核成绩合格，准予结业。
          </div>
        </div>
        <div class="c_bot">
          <div class="bot_one">
            <span>证书编号：{{data.certificateCode}}</span>
            <span>发证机构：{{data.schoolName}}</span>
            <span>发证日期：{{new Date(data.grantTime) | formatDate_1}}</span>
          </div>
          <img :src="`${baseURL}/${data.officialSealImgUrl}`" alt class="bot_img" height="114px" />
        </div>
      </div>
    </div>
    <el-tooltip class="item" effect="dark" content="建议横向打印" placement="right">
      <el-button
        v-show="isShow"
        type="primary"
        v-print="'#printCompletion'"
        @click="printCompletion(data.certificatesGrantId)"
        style="width:120px;letter-spacing:10px;"
      >打印</el-button>
    </el-tooltip>
  </div>
</template>
<script>
import { baseURL } from "@/config";
import {
  GetCertificatePageList,
  GetCertificate,
  SetBackgroundImg,
  DeleteCertificate,
  UpdateCertificatesGrantStatus
} from "@/server/basic-module";
export default {
  props: ["visible", "data"],
  data() {
    return {
      baseURL,
      isShow: true,
      id: "",
      digitalMark: 0,
      imgUrlBig: require("@/assets/images/diplomaBackground1.png")
    };
  },
  watch: {},
  mounted() {},
  activated() {},
  methods: {
    _UpdateCertificatesGrantStatus(id) {
      UpdateCertificatesGrantStatus(id).then(res => {});
    },
    printCompletion(id) {
      this._UpdateCertificatesGrantStatus(id);
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 1000);
    },
    // 获取详情数据
    _GetCertificate(id) {
      GetCertificate(id).then(res => {
        this.imgUrlBig = res.backgroundImg;
      });
    },
    // 选择证书模板
    _SetBackgroundImg(id, img) {
      let data = {
        id: id,
        backgroundImg: img
      };
      SetBackgroundImg(data);
    },
    //证书模板保存
    handleUploadFileToCos() {
      this._SetBackgroundImg(this.id, this.imgUrlBig);
      this.digitalMark = 0;
    },
    changeImg(el) {
      this.imgUrlBig = el.target.src;
      this.digitalMark = el.target.alt;
    },
    close() {
      this.digitalMark = 0;
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img_left {
    width: 990px;
    min-width: 990px;
    height: 700px;
    .leftImg_content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .c_top {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 60px;
        .top_logo {
          display: flex;
          justify-content: center;
        }
      }
      .c_center {
        margin: 120px 0 40px 0;
        width: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        .center_content {
          line-height: 30px;
          margin: 0 40px;
          & > span {
            margin: 10px;
          }
        }
      }
      .c_bot {
        width: 700px;
        margin-top: 20px;
        position: relative;
        .bot_one {
          margin-left: 400px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          span {
            margin: 10px;
          }
        }
        .bot_img {
          position: absolute;
          top: 0;
          left: 480px;
        }
      }
    }
  }
}
</style>
