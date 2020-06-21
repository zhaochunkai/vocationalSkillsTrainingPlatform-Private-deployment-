
<template>
  <div>
    <!-- 毕业判定条件 -->
    <el-card :style="style">
      <div class="schoolSeal">
        <p style="margin-top: 10px;width: 130px;">学校印章设置</p>
        <div class="seal_Upload">
          <div class="upload_top">
            <el-upload
              class="avatar-uploader"
              :http-request="handleUploadFileToCos_1"
              action="fakeaction"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
            >
              <!-- :on-success="handleAvatarSuccess_1" -->
              <el-button style="width: 150px;" slot="trigger" size="small" type="primary">选择文件并上传</el-button>
              <!-- <el-button
                style="margin-left: 20px;width: 80px;"
                size="small"
                type="success"
                @click="submitUpload"
              >上传</el-button>-->
            </el-upload>
          </div>
          <div class="upload_bot">
            <img v-if="imageUrl_1" :src="imageUrl_1" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <p
              style="margin-left: 20px;color:#8c939d;line-height:30px;font-size:0.8em;max-width:500px"
            >
              印章将用于微信公众号/小程序中个人学习报告盖章，建议上传尺寸100PX*100PX，效果更佳
              文件大小请在3M以内，仅支持PNG透明格式。
            </p>
          </div>
        </div>
      </div>
      <div class="schoolLogo">
        <p style="margin-top: 10px;width: 130px;">学校LOGO设置</p>
        <div class="logo_Upload">
          <div class="upload_top">
            <el-upload
              class="avatar-uploader"
              :http-request="handleUploadFileToCos_2"
              action="fakeaction"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess_2"
            >
              <el-button style="width: 150px;" slot="trigger" size="small" type="primary">选择文件并上传</el-button>
              <!-- <el-button
                style="margin-left: 20px;width: 80px;"
                size="small"
                type="success"
                @click="submitUpload"
              >上传</el-button>-->
            </el-upload>
          </div>
          <div class="upload_bot">
            <img v-if="imageUrl_2" :src="imageUrl_2" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <p
              style="margin-left: 20px;color:#8c939d;line-height:30px;font-size:0.8em;max-width:500px"
            >
              学校logo将用于毕业证书/技能证书页面设计，建议上传尺寸100PX*100PX，效果更佳
              文件大小请在3M以内，仅支持PNG透明格式。
            </p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { baseURL } from "@/config";
import { createResource, UploadExternalFiles } from "@/server/files-module";
// var COS = require("cos-js-sdk-v5"); // 引入COS
import {
  GetInstitutionsBasicInfo,
  CreateUpInstitutionsBasicInfo
} from "@/server/basic-module";
// import { getTempFileUploadToken } from "@/server/online-module";
export default {
  data() {
    return {
      trustedFileNameLists: [],
      style: "",
      imageUrl_1: null,
      imageUrl_2: null,
      key1: "",
      key2: "",
      // config: {
      //   Bucket: sessionStorage.getItem("TenancyId") + "-1301412513",
      //   Region: "ap-chengdu"
      // },
      // cos: null,
      // expireTime: "", // COSToken过期时间
      file: null
    };
  },
  watch: {},
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._GetInstitutionsBasicInfo();
  },
  created() {
    // this._getTempFileUploadToken();
  },
  methods: {
    handlePictureCardPreview(file) {},
    handleAvatarSuccess_1(res, file) {},
    handleAvatarSuccess_2(res, file) {
      this.imageUrl_2 = URL.createObjectURL(file.raw);
    },
    // 获取机构logo
    _GetInstitutionsBasicInfo() {
      GetInstitutionsBasicInfo().then(res => {
        this.imageUrl_2 = `${baseURL}/${res.logoImgUrl} `;
        this.imageUrl_1 = `${baseURL}/${res.officialSealImgUrl} `;
      });
    },
    //上传机构logo
    _CreateUpInstitutionsBasicInfo() {
      let data = {
        LogoImgUrl: this.key2,
        OfficialSealImgUrl: this.key1
      };
      if (this.key1 == "") {
        data = {
          LogoImgUrl: this.key2
        };
      }
      if (this.key2 == "") {
        data = {
          OfficialSealImgUrl: this.key1
        };
      }
      if (this.key1 == "" && this.key2 == "") {
        data = {};
      }
      CreateUpInstitutionsBasicInfo(data).then(res => {
        this._GetInstitutionsBasicInfo();
        this.$message.success("上传成功");
      });
    },
    // submitUpload() {
    // },
    beforeAvatarUpload(file) {
      const isPNG = file.type === "image/png";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isPNG) {
        this.$message.error("上传图片只能是 PNG 格式!");
      }
      if (!isLt3M) {
        this.$message.error("图片大小不能超过 3MB!");
      }
      return isPNG && isLt3M;
    },
    /* ------------------------------------------- COS 初始化实例 ---------------------------------------- */
    // COS 初始化实例
    // _getTempFileUploadToken() {
    //   getTempFileUploadToken().then(res => {
    //     this.expireTime = new Date(res.expireTime * 1000);
    //     this.cos = new COS({
    //       getAuthorization: function(options, callback) {
    //         callback({
    //           TmpSecretId: res.tempAppId,
    //           TmpSecretKey: res.tempAppSecret,
    //           XCosSecurityToken: res.tempToken,
    //           StartTime: res.startTimestamp, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
    //           ExpiredTime: res.endTimestamp // 时间戳，单位秒，如：1580000900
    //         });
    //       }
    //     });
    //   });
    // },

    formatDate(time) {
      // 日期时间转换为 yyyymmdd
      const date = new Date(time);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      // eslint-disable-next-line no-unused-vars
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      // eslint-disable-next-line no-unused-vars
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      // eslint-disable-next-line no-unused-vars
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "" + m + "" + d;
    },
    formatWholeDate(time) {
      // 日期时间转换为 YYYYMMDDhhmmss
      const date = new Date(time);
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "" + m + "" + d + "" + h + "" + minute + "" + second;
    },
    handleUploadFileToCos_1(params) {
      // -----------文件上传-----COS上传|本地上传，size 单位 Kb
      let file = params.file;
      let formData = new FormData();
      formData.append("upload", file);
      params.onProgress({ percent: 0 });
      UploadExternalFiles(formData)
        .then(res => {
          this.key1 = res;
          this._CreateUpInstitutionsBasicInfo();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    handleUploadFileToCos_2(params) {
      // -----------文件上传-----COS上传|本地上传，size 单位 Kb
      let file = params.file;
      let formData = new FormData();
      formData.append("upload", file);
      params.onProgress({ percent: 0 });
      UploadExternalFiles(formData)
        .then(res => {
          this.key2 = res;
          this._CreateUpInstitutionsBasicInfo();
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.schoolSeal {
  display: flex;
  .seal_Upload {
    margin-left: 20px;
    .upload_top {
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
    }
    .upload_bot {
      display: flex;
      margin-top: 20px;
      .avatar-uploader-icon {
        min-width: 150px;
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
        border: 1px solid #d9d9d9;
      }
      .avatar {
        min-width: 150px;
        width: 150px;
        display: block;
      }
    }
  }
}
.schoolLogo {
  display: flex;
  margin-top: 40px;
  .logo_Upload {
    margin-left: 20px;
    .upload_top {
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
    }
    .upload_bot {
      display: flex;
      margin-top: 20px;
      .avatar-uploader-icon {
        min-width: 150px;
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
        border: 1px solid #d9d9d9;
      }
      .avatar {
        min-width: 150px;
        width: 150px;
        display: block;
      }
    }
  }
}
</style>