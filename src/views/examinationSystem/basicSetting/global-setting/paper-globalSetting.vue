<template>
<el-card :style="style">
	<div slot="header" class="t-box-card-header">
		<span>全局设置</span>
	</div>
	<div>
		<el-button type="primary" size="small" @click="save">保 存</el-button>
		<el-button type="info" plain size="small" @click="reset">重置为默认值</el-button>
	</div>
  <div v-for="(group,i) in promissionGroups" :key="i">
    <div class="t-header-title">
      <span>{{group.displayName}}</span>
    </div>
    <div class="t-header-content">
      <el-row>
        <el-col v-for="(item,j) in group.child" :key="j" style="margin-top:20px;">
          <el-form class="t-form-block" label-width="150px" size="small">
            <el-form-item :label="item.displayName">							
          		<el-input v-model="item.currentValue" v-show="item.discribe.type=='输入'"></el-input>
							<el-radio-group v-model="item.currentValue" v-show="item.discribe.type=='单选'">
								<el-radio :label="val.label" v-for="(val,i) of item.values" :key="i">{{val.name}}</el-radio>
							</el-radio-group>
							<div><el-tag v-show="item.description">{{item.discribe.desc}}</el-tag></div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>        
  </div>
	<span slot="footer" class="dialog-footer">
		<el-button type="primary" size="small" @click="save">保 存</el-button>
	</span>
</el-card>
</template>
<script>
import {updateEtsGlobalSetting,getEtsGlobalSettingAll } from '@/server/resource-module';
export default {
  data () {
    return {
			style: '',
			promissionGroups: [],
      form: {},
      rules: {},
    }
  },
	activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
		this._getEtsGlobalSettingAll();
	},
  methods: {
		_getEtsGlobalSettingAll() {
			getEtsGlobalSettingAll().then(result => {
				let newResult=[]
				let newPermissions= []
        newResult=result.filter((group,i) => {
					if (group.name.indexOf('Ets.KnowledgePoint')>-1) {
						if (group.name.split('.').length==2) { // 将name分割后长度为2的数据，存为一级元素
							let obj=Object.assign({},group,{
								child: [],
							})
							newPermissions.push(obj)
						}
						return group; // 将name中含有'Ets.KnowledgePoint'的数据添加到新数组newResult中
					}
				})
				
				newPermissions.forEach(ele => {
					for(let i=0;i<newResult.length;i++ ) {
						if (newResult[i].name.substr(0,newResult[i].name.lastIndexOf('.'))==ele.name) {
							let description=JSON.parse(newResult[i].description);
							if (description.options && description.options!='*') {
								let radios=description.options.split(',');
								var values= []
								radios.forEach(r => {
									let vals=r.split('|');
									let valName=Object.assign({},{
										name:vals[0],
										label:vals[1],
									})	
									values.push(valName)								
								})
							}
							let obj=Object.assign({},newResult[i],{
								discribe:description,
								values:values
							})
							ele.child.push(obj)
						}
					}
				})
				this.promissionGroups=Object.assign([],newPermissions);
			})
		},
    save () {
			let arr= []
			this.promissionGroups.forEach(element => {
				element.child.forEach(item => {
					let obj={
						name:item.name,
						value:item.currentValue
					}
					arr.push(obj)
				})
			})
			updateEtsGlobalSetting(arr).then(result => {
				this._getEtsGlobalSettingAll();
				this.$message.success('修改成功！')
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 	
    },
    reset() {
			this.$confirm(`此操作将重置数据为默认值， 是否继续？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
			}).then(() => {                
				let arr= []
				this.promissionGroups.forEach(element => {
					element.child.forEach(item => {
						let obj={
							name:item.name,
							value:item.defaultValue
						}
						arr.push(obj)
					})
				})
				updateEtsGlobalSetting(arr).then(result => {
					this._getEtsGlobalSettingAll();
					this.$message.success('数据重置成功！')
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				}) 	
			}).catch(() => {})
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item{
	max-width:80%;
}
</style>
