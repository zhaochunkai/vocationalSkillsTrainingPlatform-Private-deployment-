<template>
<div>
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>{{title}}</span>
    </div>
    <el-button style="margin-bottom:10px;" type="primary" size="small" @click="goBack">返回</el-button>
    <el-form class="t-form-block" ref="form" :model="form" label-position="left" label-width="150px" size="small">
      <el-form-item label="发送短信/微信提醒：">
        <el-switch v-model="switchVal" active-color="#13ce66" inactive-color="#ff4949" @change="saveSwitch"></el-switch>
      </el-form-item>
      <el-form-item label="发送方式：">
        <el-checkbox-group v-model="checkList" @change="saveCheckBox">
          <el-checkbox label="Sms">手机短信</el-checkbox>
          <el-checkbox label="WeChatOfficialAccount" >微信分析消息（需要认证公众号）</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>手机短信模板展示</span>
      </div>
      <div class="text item">
        尊敬的学员：您成绩已成功导入，成绩为：{0}，导入时间：{1}，详情点击：{2}。
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>微信模板信息展示</span>
      </div>
      <div class="wechat">
        <h4>{{title}}</h4>
        <p>XX月xx日</p>
        <p>尊敬的xxx先生/女士，您于xxxx-xx-xx的考试成绩已经成功导入系统。</p>
        <p>导入时间：xxxx</p>
        <p>成绩明细：【XXX课程：YYY分】</p>
        <p>导入人：xxxx</p>
        <p>感谢您的支持与信任！</p>
        <div class="footer">
          <span>详情</span>
          <span>></span>
        </div>
      </div>
    </el-card>
    <el-button type="primary" size="small" @click="goBack">返回</el-button>
  </el-card>
</div>
</template>
<script>
import {updateEtsGlobalSetting,getEtsGlobalSettingAll } from '@/server/resource-module';
export default {
  data() {
    return {
      style: '',
      title: '',
      form: {},
      checkList: ['WeChatOfficialAccount','Sms'],
      switchVal:true, // 开关
      checkedVal: '',
      formData: [],
    }
  },
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.title=this.$route.query.title;
    this.name=this.$route.query.name;
    this._getEtsGlobalSettingAll();
    /*  Yes.WeChatOfficialAccount.Sms : 表示启用 并且通过 微信公众号和短信 推送通知
        Yes 表示启用但不通过任何方式通知
        Yes.WeChatOfficialAccount 表示启用 通过微信公众号 推送通知
        Yes.Sms 表示启用 通过短信 推送通知
        No 表示关闭
    */
  },
  methods: {
		_getEtsGlobalSettingAll() {
			getEtsGlobalSettingAll().then(result => {
				result.forEach((item) => {
          if (item.name==this.name) {
            this.form=Object.assign({},item);
            if (item.currentValue=='No') { // 根据值判断开关状态
              this.switchVal=false;
              this.checkList= []
            // }else if (item.currentValue=='Yes' || item.currentValue=='Yes.WeChatOfficialAccount.Sms') {
            }else if (item.currentValue=='Yes') {
              this.switchVal=true;
              this.checkList= []
            } else {
              this.switchVal=true;
              this.checkList=item.currentValue.split('.').slice(1);
            }
          }
        })
      })
    },
    saveSwitch() {      
      if (this.switchVal==false) {
        this.checkList=[]
        this.checkedVal='No';
      }else if (this.switchVal==true) {
        this.checkList=['WeChatOfficialAccount','Sms'];
        this.checkedVal='Yes.WeChatOfficialAccount.Sms';
      }

      this.$set(this.form,'value',this.checkedVal)
      this._updateEtsGlobalSetting();
    },
    saveCheckBox(val) {
      if (val.length==0) {
        this.switchVal=false;
        this.checkedVal='No';
      } else {
        this.switchVal=true;
        this.checkedVal='Yes.'+val.join('.');
      }
      this.$set(this.form,'value',this.checkedVal)

      this._updateEtsGlobalSetting();
    },
    _updateEtsGlobalSetting() {      
      this.formData= []
      let data={
        name: this.form.name,
        value: this.form.value,
      }
      this.formData.push(data)
      updateEtsGlobalSetting(this.formData).then(
        this.$message.success('设置成功')
      ).catch(err => { 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      }) 
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>
<style lang="less" scoped>
.box-card{
  font-size:.9rem;
  max-width:70%;
  background: #eee;
  border:1px solid #ddd;
  margin-bottom:30px;
  .clearfix{
    padding:5px;
  }
  /deep/.el-card__body{
    background: #fff;
  }
  .text {
    font-size: 14px;
    padding:30px 10px;
    background: #eee;
  }
  .wechat{
    border:1px solid #ddd;
    padding:20px 30px;
    max-width:50%;
    border-radius:10px;
    .footer{
      margin-top:20px;
      border-top:1px solid #ddd;
      padding-top:20px;
      display:flex;
      justify-content:space-between ;
    }
  }

}
</style>