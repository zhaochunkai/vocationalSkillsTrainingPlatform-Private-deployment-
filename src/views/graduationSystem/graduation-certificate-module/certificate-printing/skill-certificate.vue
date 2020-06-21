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
          <p style="font-size:40px;margin:0;letter-spacing:12px">{{data.projectName}}</p>
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
        <div class="urlAddress" v-if="data.inquireUrl">
          <p class="u_one">证书查询地址：</p>
          <p class="u_two">{{data.inquireUrl}}</p>
        </div>
        <div class="urlAddress" v-else>
          <p class="u_one"></p>
          <p class="u_two"></p>
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
import { UpdateCertificatesGrantStatus } from "@/server/basic-module";
export default {
  props: ["visible", "data"],
  data() {
    return {
      baseURL,
      isShow: true,
      id: "",
      imgUrlBig: "",
      digitalMark: 0
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        console.log(data);
      }
    }
  },
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
        margin-top: 80px;
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
      .urlAddress {
        width: 70%;
        display: flex;
        align-items: center;
        justify-content: center;
        .u_one {
          font-size: 18px;
          min-width: 126px;
        }
        .u_two {
          font-size: 16px;
          height: auto;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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
