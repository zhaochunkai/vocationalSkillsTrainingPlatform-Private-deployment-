<template>
  <el-card :style="style">
		<!-- 微信公众号配置 -->			
    <div slot="header" class="t-box-card-header">
			<span class="title">微信公众号配置</span>	
    </div>
		<div class="message-check" v-for="(item,j) in wechatCheckList" :key="j">
			<el-form class="t-form-block" label-width="160px" size="small">
				<el-form-item :label="item.displayName">							
					<div style="display:flex;">
						<el-input v-model="item.currentValue" ></el-input>
						<el-tag style="margin-left:10px;" v-show="item.description">{{item.description}}</el-tag>
					</div>
				</el-form-item>
			</el-form>				
		</div>						
		<el-button style="margin-bottom:20px;margin-left:130px;" type="primary" size="small" @click="saveFlowSetting">保 存</el-button>
	</el-card>
</template>
<script>
import {
	updateEtsGlobalSetting,getEtsGlobalSettingAll
} from '@/server/resource-module';
export default {
  data () {
    return {
			style: '',
			wechatCheckList: [],
			ResidueFlux:null,
    }
	},
	activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
		this._getEtsGlobalSettingAllMessage();
	},
  methods: {
		/* ------------------------------------------查询------------------------------- */   
		_getEtsGlobalSettingAllMessage() { // 流量验证配置
			getEtsGlobalSettingAll().then(result => {
				let newResult=[]
				this.wechatCheckList= []
        newResult=result.filter((group,i) => {
					if ( group.name.indexOf('Ets.Admin.WeChatOfficialAppId')>-1 || 
							group.name.indexOf('Ets.Admin.WeChatOfficialAppSecret')>-1 || 
							group.name.indexOf('Ets.Admin.WeChatOfficialOAuthRedirectUrl')>-1
						) { 
						this.wechatCheckList.push(group)
					}
				})
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
    /* ------------------------------------------操作------------------------------- */   		
    saveFlowSetting() {
			let arr=[]
			this.wechatCheckList.forEach(item => {
				let obj={
					name:item.name,
					value:item.currentValue
				}
				arr.push(obj)
			})
			updateEtsGlobalSetting(arr).then(result => {
				this._getEtsGlobalSettingAllMessage();
				this.$message.success('设置成功！');
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 	
    },	
  }
}
</script>
<style lang="less" scoped>
.cardItem{
	margin:20px 20px 10px;
	color:#993;
	line-height:40px;
	.buttons{
		display:flex;
		justify-content: space-around;
	}
}
.message-check{
	margin-top:10px;
	/deep/.el-form-item{
		max-width:750px;
	}
}
</style>
