<template>
  <div class="t-navigationBar navigationBar-theme" style="height: 100%;position:relative;">
    <div class="logo">
      <img src="../../assets/images/logo.png" >
      <!-- <span style="font-size:26px;">{{activeModuleName}}</span> -->
    </div>
    <div class="list">
      <!-- <el-tabs class="t-module-wrap" v-model="activeModuleName">{{index}}
        <el-tab-pane v-for="(item, index) in modules" :key="index" :label="item" :name="item"></el-tab-pane>
      </el-tabs> -->
      <el-tabs class="t-module-wrap" v-model="activeModuleName">
        <el-tab-pane class="modulelist" v-for="(item, index) of mouduleData" :key="index" :label="item.name" :name="item.name">
          <span slot="label">
            <div class="t-nav-icon">
              <img :src="item.src">
              <span class="modulename">{{item.name}}</span>
            </div>
          </span>
        </el-tab-pane>
      </el-tabs>
      <div class="item-wrap">
        <!-- 消息 -->
        <!-- <div class="item">
          <i class="icon fa fa-volume-up"></i>
          <span class="border-right">(<span class="small">0</span>)</span>
        </div> -->
        <div class="item">
          <el-button type="text" style="color:#fff;" @click="showPwdDialog">修改密码</el-button>
          <span class="border-right"></span>
        </div>
        <div class="item">
          <span>{{name}}</span>
          <span class="border-right">(<span class="small">{{trueName}}</span>)</span>
        </div>
        <div class="item">
          <span @click="exit">退出</span>
        </div>
      </div>
    </div>
    <!-- 重置密码-超级管理员 -->
    <update-password :userForm="userForm" type="update" :visible.sync="pwdDialogVisible"></update-password>
  </div>
</template>
<script>
import { MENU_LIST } from '../../store/mutations.js'
import updatePassword from '@/components/updatePassword'
export default {
  data () {
    return {
      mouduleData: [
        {name: '基础平台', src: require('../../assets/images/nav1.png'), path: ''},
        {name: '报名录取', src: require('../../assets/images/nav2.png'), path: ''},
        {name: '在线学习', src: require('../../assets/images/nav3.png'), path: ''},
        {name: '在线考试', src: require('../../assets/images/nav4.png'), path: ''},
        {name: '毕业管理', src: require('../../assets/images/nav5.png'), path: ''},
        {name: '统计分析', src: require('../../assets/images/nav5.png'), path: ''},
      ],
      pwdDialogVisible: false,
      userForm: ''
    }
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
      name: '',
      trueName: ''
    }
  },
  components: {updatePassword},
  created () {
    this.getUserName()
  },
  methods: {
    showPwdDialog (row) {
      this.pwdDialogVisible = true
    },
    getUserName () {
      let token = JSON.parse(localStorage.getItem('Authorization'))
      // eyJhbGciOiJSUzI1NiIsImtpZCI6InpZbmdwanV4VkxONXFqaFZVRWRQd0EiLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1NzY3NzQxNjgsImV4cCI6MTYwODMxMDE2OCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjoiRXh0ZXJuYWxUcmFpbmluZ1N5c3RlbSIsImNsaWVudF9pZCI6IkV4dGVybmFsVHJhaW5pbmdTeXN0ZW0iLCJzdWIiOiI3MTk0NzM2OC03OGFkLTM2NzItYjMxMC0zOWYxZmJjZmRlOTUiLCJhdXRoX3RpbWUiOjE1NzY3NzQxNjgsImlkcCI6ImxvY2FsIiwicm9sZSI6ImFkbWluIiwibmFtZSI6ImFkbWluIiwicGhvbmVfbnVtYmVyIjoiMDAwMC0wMDAwMDAwIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjpmYWxzZSwic2NvcGUiOlsiRXh0ZXJuYWxUcmFpbmluZ1N5c3RlbSJdLCJhbXIiOlsicHdkIl19.OamnY-NkoZmffpOBQKfIF40pDsdxmQ-Ra0JbsVF8jBwqBMhBkKkPdrBgPCdWGeoUeSC9U_KNz88zBV1owDc7HeKlWXKHJNh6uhYIgWCRJvdDQZxUL9HHr9pBFkLmeJAXJCPy-KGj8HyYlESJlU1ibp-_Xm0YD2luveUbDjrh2WuMU3uCcwOj2Xg3_k75ASnNZ_xsXSzhNmrO_rXq-YqPtOSrQP9vlOykFAPRhpfeui7zMap2mgnCIDatQwjnU1MzG1PW59h9JCy9T4iPQO_HjbbiAkUVysT4H1WJWvsYuDjf3JlRZuL4RzM_cWO-P59gzHfPPZHpYz6Lin5OkDqC-Q
      // let userString = decodeURIComponent(escape(window.atob(token.access_token.split('.')[1])));
      // // {"nbf":1576774168,"exp":1608310168,"iss":"http://localhost:5000","aud":"ExternalTrainingSystem","client_id":"ExternalTrainingSystem","sub":"71947368-78ad-3672-b310-39f1fbcfde95","auth_time":1576774168,"idp":"local","role":"admin","name":"admin","phone_number":"0000-0000000","phone_number_verified":false,"scope": ["ExternalTrainingSystem"],"amr": ["pwd"]}

      this.name = token.UserName
      this.trueName = token.TrueName
    },
    collapse () {
      this.$emit('update:isCollapse', !this.isCollapse)
    },
    exit () {
      localStorage.removeItem('Authorization')
      this.$router.push({name: 'login'})
    }
  },
  computed: {
    modules () {
      return this.$store.getters.modules
    },
    activeModuleName: {
      get () {
        return this.$store.state.menuList.activeModuleName
      },
      set (val) {
        this.$store.commit(MENU_LIST.SET_ACTICE_MENU_INDEX, '-1') // 切换模块后，清除菜单index === -1
        this.$store.commit(MENU_LIST.SET_ACTICE_MODULE_NAME, val)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url("../../assets/less/common/navigationBar.less");
.t-module-wrap{
  .t-nav-icon{
    height:80px;
    padding:0 10px;
    border:1px solid #fff;
    border-radius:6px;
    margin-top:9px;
    background: rgba(255,255,255,0.1);
  }
  img{
    display: block;    
    margin:12px auto 0;
  }
  .modulename{
    display: block;
    height:34px;
    line-height:34px;
    // font-size:14px;
    margin:0 auto;
  }
}
</style>
