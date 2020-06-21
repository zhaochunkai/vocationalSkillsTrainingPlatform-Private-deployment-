<template>
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>成绩单构成</span>
  </div>
	<div>
		<el-button type="primary" size="small" @click="save">保 存</el-button>
		<el-button type="info" plain size="small" @click="reset">重置为默认值</el-button>
	</div>
  <div v-for="(group,i) in promissionGroups" :key="i">
    <!-- <div class="t-header-title">
      <span>{{group.displayName}}</span>
    </div> -->
    <div class="t-header-content">
      <el-row>
        <el-col v-for="(item,j) in group.child" :key="j" style="margin-top:20px;">
					<div style="margin-bottom:10px"><el-tag type="warning" style="color:#ff8100;" v-show="item.description">{{item.discribe.desc}}</el-tag></div>
					<div v-show="item.discribe.type=='多个输入'">
						<el-form class="t-form-block" ref="form" :model="item.newCurrentValue" label-width="120px" size="small">    
							<el-form-item label="考勤成绩占比" prop="Attendance">
								<el-input v-model="item.newCurrentValue.Attendance" type="number" min="0" max="100">
									<el-button slot="append">%</el-button>
								</el-input>
							</el-form-item>
							<el-form-item label="国考成绩占比" prop="NationalExamination">
								<el-input v-model="item.newCurrentValue.NationalExamination" type="number" min="0" max="100">
									<el-button slot="append">%</el-button>
								</el-input>
							</el-form-item>
							<el-form-item label="培训成绩占比" prop="Training">
								<el-input v-model="item.newCurrentValue.Training" type="number" min="0" max="100">
									<el-button slot="append">%</el-button>
								</el-input>
							</el-form-item>
							<el-form-item label="合计">
								<span>{{Number(item.newCurrentValue.Attendance)+Number(item.newCurrentValue.NationalExamination)+Number(item.newCurrentValue.Training)}} %</span>
							</el-form-item>
						</el-form>
					</div>		
					<el-input v-model="item.currentValue" v-show="item.discribe.type=='输入'"></el-input>
					<el-radio-group v-model="item.currentValue" v-show="item.discribe.type=='单选'">
						<el-radio :label="val.label" v-for="(val,i) of item.values" :key="i">{{val.name}}</el-radio>
					</el-radio-group>
					<div><el-tag type="danger" style="color:#f00;" v-show="item.description">{{item.discribe.options}}%</el-tag></div>
        </el-col>
      </el-row>
    </div>        
  </div>
</el-card>
</template>
<script>
import {updateEtsGlobalSetting,getEtsGlobalSettingAll } from '@/server/resource-module';
export default {
  data () {
    return {
      style: '',
      form: {},    
			promissionGroups: [],
			summary:0,
    }
  },
  activated() { 
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
		this._getEtsGlobalSettingAll();
	 },
	 watch: {
		 'promissionGroups': {
			 handler(newVal,oldVal) {
				if (newVal[0]) {
					newVal[0].child.forEach(item => {
						if (item.newCurrentValue.Attendance<0) {
							this.$set(item.newCurrentValue,'Attendance',0)
						}   
						if (item.newCurrentValue.NationalExamination<0) {
							this.$set(item.newCurrentValue,'NationalExamination',0)
						}   
						if (item.newCurrentValue.Training<0) {
							this.$set(item.newCurrentValue,'Training',0)
						}   
					})
				}
			 },
			 immediate:true,
			 deep:true
		 },
	 },
  methods: {
		_getEtsGlobalSettingAll() {
			getEtsGlobalSettingAll().then(result => {
				let newResult=[]
				let newPermissions= []
        newResult=result.filter((group,i) => {
					if (group.name.indexOf('Ets.Score')>-1) {
						if (group.name.split('.').length==2) { // 将name分割后长度为2的数据，存为一级元素
							let obj=Object.assign({},group,{
								child: [],
							})
							newPermissions.push(obj)
						}
						return group; // 将name中含有'Ets.Score'的数据添加到新数组newResult中
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
              if (obj.discribe.type=='多个输入') {
                this.$set(obj,'newCurrentValue',JSON.parse(obj.currentValue))
              }
              ele.child.push(obj);
              
						}
					}
				})
				this.promissionGroups=Object.assign([],newPermissions);
				// console.log(this.promissionGroups)
			})
		},
    save () {
      let arr= []
      let bool=true;
			this.promissionGroups.forEach(element => {
				element.child.forEach(item => {
          let obj={}
          if (item.discribe.type=='多个输入') {
            // Object.values(item.newCurrentValue)
            // 累加对象中属性值，判断累加后是否等于100，不等则不能保存
            if (Object.values(item.newCurrentValue).reduce((a,b)=>Number(a)+Number(b)) !=100) {
              this.$alert('任意整数值搭配，总和不等于100，请修正后再保存')
              bool=false;;
            }
            obj={
              name:item.name,
              value:JSON.stringify(item.newCurrentValue)
            }
          } else {
            obj={
              name:item.name,
              value:item.currentValue
            }
          }
					arr.push(obj)
				})
      })
      if (!bool) {
        return;
      }
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
.txt{
  background: #eee;
  line-height:1.8;
  
}
</style>
