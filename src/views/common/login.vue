<template>
<div class="wrap">
  <div class="wrapBox" :style="'margin-top: -'+mTop+'px;margin-left:-'+mleft+'px;'">
    <div class="contentBox" id="contentBox">
      <div class="login-title">
        <h1><span class="login-title-theme">职业技能</span> 培训平台</h1>
      </div>
      <div class="login-section">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="账户密码登录" name="byUsername">
            <el-form ref="form" :rules="rules" :model="form" @keyup.enter.native="login">
              <el-form-item prop="userName">
                <el-input v-model="form.userName" autofocus placeholder="请输入账号">
                  <template slot="prepend"><i class="fa fa-user"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码">
                  <template slot="prepend"><i class="fa fa-lock"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="userInput">
                <el-input v-model="form.userInput" placeholder="请输入验证码">
                  <template slot="prepend"><i class="fa fa-random"></i></template>
                  <!-- <template slot="append"><img class="qr-code" src="../../assets/images/auth_code.jpg" alt=""></template> -->
                  <template slot="append"><img class="qr-code" :src="imgSrc" @click="changImg"></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="login-btn" @click="login">登录</el-button>
                <div><el-tag size="small">注意：密码输错5次后，账户将被自动锁定5分钟</el-tag></div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="短信验证登录" name="byPhone">
            <el-form ref="PhoneForm" :rules="PhoneRules" :model="PhoneForm" @keyup.enter.native="login">
              <el-form-item prop="phoneNumber">
                <div style="display:flex;">
                  <el-input v-model="PhoneForm.phoneNumber" autofocus placeholder="请输入手机号" type="phoneNumber">
                    <template slot="prepend"><i class="el-icon-phone"></i></template>
                  </el-input>
                  <el-button type="success" :disabled="disableBtn" @click="sendTel">发送{{duration?`(${duration}s)`:''}}</el-button>
                </div>
              </el-form-item>
              <el-form-item prop="userInput">
                <el-input v-model="PhoneForm.userInput" placeholder="请输入验证码">
                <template slot="prepend"><i class="fa fa-random"></i></template>
                  <!-- <template slot="append"><img class="qr-code" src="../../assets/images/auth_code.jpg" alt=""></template> -->
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="login-btn" @click="login">登录</el-button>
                <div><el-tag size="small">注意：密码输错5次后，账户将被自动锁定5分钟</el-tag></div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import {
  getVerificationPicture,
  loginSystem,
  getVerificationCode,
  loginSystemByTel
} from '@/server/login-module'
import { pageSizes, pageSize } from '@/config.js'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      activeName: 'byUsername',
      form: {
        userName: '',
        password: ''
      },
      imgSrc: '',
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_]+$/, message: '账号必须是数字、字母、下划线', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        userInput: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      // 手机号登录
      PhoneForm: {},
      PhoneRules: {
        phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        userInput: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      mTop: 220,
      mleft: 400,
      duration: 0, // 倒计时长
      timer: 0, // 定时器编号
      disableBtn: false // 短信发送按钮状态
    }
  },
  created () {
    this._getVerificationPicture()
    clearInterval(this.timer)
    this.duration = 0
    this.disableBtn = false
  },
  watch: {
    'PhoneForm.phoneNumber' (newVal) {
      if (newVal) {
        clearInterval(this.timer)
        this.duration = 0 // 单位秒
        this.disableBtn = false
      }
    }
  },
  methods: {
    /* -----------------------------------------------查询数据-------------------------------------------- */
    // 更换验证图片
    changImg () {
      this._getVerificationPicture()
    },
    // 获取登录验证码图片
    _getVerificationPicture () {
      getVerificationPicture().then(result => {
        this.form.pictureId = result.id
        this.imgSrc = result.picture
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    /* -----------------------------------------------操作-------------------------------------------- */
    // 发送手机号
    sendTel () {
      if (!this.PhoneForm.phoneNumber) {
        this.$message.warning('请输入手机号')
        return
      }
      getVerificationCode(this.PhoneForm.phoneNumber).then(result => {
        this.$message.success('短信发送成功，请注意查收！')
        this.setCutDown()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 倒计时
    setCutDown () {
      clearInterval(this.timer)
      this.duration = 300 // 单位秒
      this.disableBtn = false
      this.timer = setInterval(() => {
        if (this.duration === 0) {
          clearInterval(this.timer)
          this.disableBtn = false
        } else {
          this.disableBtn = true
          this.duration--
        }
      }, 1000)
    },
    // 登录
    login () {
      if (this.activeName === 'byUsername') {
        this.$refs.form.validate((valid) => {
          if (!valid) return
          loginSystem(this.form).then(result => {
            localStorage.setItem('Authorization', JSON.stringify(result))
            this.$router.push({ name: 'data-list-item' })
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        })
      } else {
        this.$refs.PhoneForm.validate((valid) => {
          if (!valid) return
          loginSystemByTel(this.PhoneForm).then(result => {
            localStorage.setItem('Authorization', JSON.stringify(result))
            this.$router.push({ name: 'data-list-item' })
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        })
      }
    }
  },
  destroyed () {
    clearInterval(this.timer)
    this.duration = 0 // 单位秒
  }
}
</script>
<style lang="less" scoped>
@import url("../../assets/less/common/login.less");
.wrapBox{
  position: absolute;
  top: 50%;
  left: 50%;
}
.contentBox{
  width:800px;
  margin:0 auto;
  display:flex;
  background-color: rgba(255,255,255,1);
  background-size: cover;
  border-radius:10px;
  // margin-top:8%;
}
/deep/.el-tabs__item{
  color:#99a9bf;
}
// /deep/.el-tabs__nav-scroll{
//   // background-color: rgba(255,255,255,0.8);
// }
/deep/.el-tabs__item.is-active{
  color:#01a1fd;
  background-color: rgba(218,242,255,0.5);
}
/deep/.el-tabs__active-bar{
  background-color: #fff;
  // border: 1px solid #01a1fd;
}
/deep/.el-tabs--card>.el-tabs__header .el-tabs__nav{
  border: none;
}
/deep/.el-form-item:last-child{
  margin-bottom:0;
}
/deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  border: 1px solid #01a1fd;
  border-bottom-color: #fff;
}
/deep/.el-select {
  width: 100%;
}
/deep/.el-input--prefix .el-input__inner {
  padding-left: 70px;
}
/deep/.el-input__prefix {
  left: 0;
}
.icon-home{
  display: inline-block;
  width: 55px;
  height: 40px;
  background: #F5F7FA;
  border: 1px solid #DCDFE6;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  box-sizing: border-box;
}
/deep/.el-input__prefix, .el-input__suffix {
  color: #909399;
}
</style>
