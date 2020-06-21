<template>
  <el-drawer title="证书发放信息" v-if="visible" :visible="visible" size="88%" :before-close="close">
    <div class="content">
      <div slot="header" class="t-box-card-header">
        <span style="font-size:20px;">证书样式设计</span>
        <el-button type="primary" @click="handleUploadFileToCos" class="c_btn">保存</el-button>
        <el-button type="primary" @click="close" class="h_btn">返回</el-button>
      </div>
      <div class="content">
        <div class="c_title">
          <span>正在设计：</span>
          <span style="font-size:20px;font-weight:bold">学士学位证书</span>
          <span>证书样式</span>
        </div>
        <div class="c_img">
          <div
            class="img_left"
            :style="{backgroundImage: 'url(' + (imgUrlBig) + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
          >
            <div class="leftImg_content">
              <div class="c_top">
                <img :src="imageUrl_2" height="80px" alt />
                <p style="font-size:40px;margin-top:10px">学士学位证书</p>
              </div>
              <div class="c_center">
                <div>
                  <img src="@/assets/images/u32.png" height="120px" alt />
                </div>
                <div class="center_content">
                  学生
                  <span>XXX</span>
                  性别
                  <span>XX</span>，
                  <span>XXXX 年 XX 月 XX 日</span>生，
                  在
                  <span>XXXX</span>
                  <span>XXXX</span>专业完成了本科学习计划，现已毕业，经审核符合《中华人名共和国学位条列》的规定，授予
                  <span>XXXX</span>
                  <span>XXXX</span>学位。
                </div>
              </div>
              <div class="c_bot">
                <div class="bot_one">
                  <span>校（院）长：XXXX</span>
                  <span>学位评定委员会主席</span>
                </div>
                <div class="bot_two">
                  <span>校名：XXXX</span>
                  <span>发证机构：XXXX</span>
                  <span>发证日期：XXXX</span>
                </div>
                <img :src="imageUrl_1" alt class="bot_img" height="110px" />
              </div>
            </div>
          </div>
          <div class="img_right" @click="changeImg">
            <img
              src="@/assets/images/certificate/degree1.jpg"
              alt="1"
              id="small_1"
              :class="{active:digitalMark==1}"
            />
            <img
              src="@/assets/images/certificate/degree2.jpg"
              alt="2"
              id="small_2"
              :class="{active:digitalMark==2}"
            />
            <img
              src="@/assets/images/certificate/degree3.png"
              alt="3"
              id="small_3"
              :class="{active:digitalMark==3}"
            />
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { baseURL } from "@/config";
import {
  GetInstitutionsBasicInfo,
  GetCertificatePageList,
  GetCertificate,
  SetBackgroundImg,
  DeleteCertificate
} from "@/server/basic-module";
export default {
  props: ["visible", "data"],
  data() {
    return {
      imageUrl_1: null, //学校logo
      imageUrl_2: null, //公章
      imgUrlBig: "",
      digitalMark: 0,
      imgUrlBig: require("@/assets/images/diplomaBackground1.png")
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this._GetCertificate(this.data.id);
        this._GetInstitutionsBasicInfo();
      }
    }
  },
  mounted() {},
  activated() {},
  methods: {
    // 获取详情数据
    _GetCertificate(id) {
      GetCertificate(id).then(res => {
        this.imgUrlBig = res.backgroundImg;
      });
    },
    // 选择证书模板
    _SetBackgroundImg(img) {
      let data = {
        id: this.data.id,
        backgroundImg: img
      };
      SetBackgroundImg(data).then(res => {
        this.$message("保存成功");
        this.digitalMark = 0;
      });
    },
    //证书模板保存
    handleUploadFileToCos() {
      this._SetBackgroundImg(this.imgUrlBig);
    },
    // 获取机构logo
    _GetInstitutionsBasicInfo() {
      GetInstitutionsBasicInfo().then(res => {
        this.imageUrl_2 = `${baseURL}/${res.logoImgUrl}`;
        this.imageUrl_1 = `${baseURL}/${res.officialSealImgUrl}`;
      });
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
/deep/.el-drawer__body {
  overflow: scroll;
}
.content {
  .t-box-card-header {
    margin-bottom: 10px;
    position: relative;
    .c_btn {
      position: absolute;
      right: 100px;
    }
    .h_btn {
      position: absolute;
      right: 10px;
    }
  }
  .content {
    border-top: 1px solid #333333;
    margin-top: 20px;
    .c_title {
      margin-top: 10px;
    }
    .c_img {
      display: flex;
      align-items: flex-start;
      .img_left {
        border: 1px solid #aaa;
        width: 596px;
        min-width: 596px;
        height: 840px;
        margin: 20px;
        .leftImg_content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          .c_top {
            width: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 80px;
          }
          .c_center {
            width: 78%;
            margin: 40px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            .center_content {
              line-height: 30px;
              margin-top: 20px;
              & > span {
                margin: 10px;
              }
            }
          }
          .c_bot {
            width: 700px;
            position: relative;
            .botf_one {
              margin-left: 400px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              span {
                margin: 10px;
              }
            }
            .botf_img {
              position: absolute;
              top: 0;
              left: 480px;
            }
          }
        }
        .big {
          width: 100%;
        }
      }
      .img_right {
        display: flex;
        width: 10%;
        img {
          margin: 10px;
        }
        .active {
          border: 2px solid #ffcc00;
        }
        #small_1 {
          width: 100%;
        }
        #small_2 {
          width: 100%;
        }
        #small_3 {
          width: 100%;
        }
      }
    }
  }
}
</style>