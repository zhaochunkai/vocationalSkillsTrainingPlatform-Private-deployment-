<template>
  <div class="content" id="printDegree">
    <div
      class="img_left"
      :style="{backgroundImage: 'url(' + (imgUrlBig) + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
    >
      <div class="leftImg_content">
        <div class="c_top">
          <img :src="imageUrl_2" style="width:80px;height:80px" alt />
          <p style="font-size:40px;margin-top:10px">学士学位证书</p>
        </div>
        <div class="c_center">
          <div>
            <img :src="`${baseURL}/${data.photo}`" height="120px" alt />
          </div>
          <div class="center_content">
            学生
            <span>{{data.studentName}}</span>
            性别
            <span v-if="data.sex==1">男</span>，
            <span v-if="data.sex==0">未知的性别</span>，
            <span v-if="data.sex==9">未说明的性别</span>，
            <span v-if="data.sex==2">女</span>，
            <span>{{new Date(data.birthday) | formatDate_1}}</span>日生，
            在
            <span>{{data.schoolName}}</span>专业完成了
            <span>${专业名}</span>项目，现已毕业，经审核符合《中华人名共和国学位条列》的规定，授予
            <span>${学位分类}</span>
            <span>${学位层次}</span>学位。
          </div>
        </div>
        <div class="c_bot">
          <div class="bot_one">
            <span>校（院）长：${校长}</span>
            <span>学位评定委员会主席</span>
          </div>
          <div class="bot_two">
            <span>校名：${XXXX学校}</span>
            <span>发证机构：${XXXX机构}</span>
            <span>发证日期：${}年${}月${}日</span>
          </div>
          <img :src="imageUrl_1" alt class="bot_img" width="100px" />
        </div>
      </div>
    </div>
    <el-tooltip class="item" effect="dark" content="建议纵向向打印" placement="right">
      <el-button
        v-show="isShow"
        type="primary"
        v-print="'#printDegree'"
        @click="printDegree()"
        style="width:120px;letter-spacing:10px;"
      >打印</el-button>
    </el-tooltip>
  </div>
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
      isShow: true,
      imageUrl_1: null, //学校logo
      imageUrl_2: null, //公章
      id: "",
      imgUrlBig: "",
      digitalMark: 0,
      imgUrlBig: require("@/assets/images/diplomaBackground1.png")
    };
  },
  watch: {},
  mounted() {},
  activated() {
    this._GetInstitutionsBasicInfo();
  },
  methods: {
    printDegree() {
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
    // 获取机构logo
    _GetInstitutionsBasicInfo() {
      GetInstitutionsBasicInfo().then(res => {
        this.imageUrl_1 = res.logoImgUrl;
        this.imageUrl_2 = res.officialSealImgUrl;
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
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img_left {
    width: 596px;
    min-width: 596px;
    height: 840px;
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
        width: 86%;
        margin-top: 20px;
        position: relative;
        .bot_one {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-right: 30px;
          span {
            margin: 6px;
          }
        }
        .bot_two {
          margin: 60px 0 0 50px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          span {
            margin: 6px;
          }
        }
        .bot_img {
          position: absolute;
          bottom: 0;
          left: 26%;
        }
      }
    }
    .big {
      width: 100%;
    }
  }
}
</style>