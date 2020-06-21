<template>
<el-dialog class="t-dialog" v-if="visible" title="毕业批量审批" :visible="visible" :close-on-click-modal="false" width="630px" @close="close" >
  <!-- 批量审批 -->    
  <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">   
    <el-form-item label="审批意见">
      <el-input v-model="form.approveOpinion" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="毕业判定结果">
      <el-select v-model="form.result" filterable clearable>
        <el-option v-for="(item,i) of statusList" :key="i" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </el-form-item>
  </el-form>  
  <div >
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
  </div>
</el-dialog>
</template>
<script>
import { 
  updateGraduationRecordApprove
} from '@/server/examination-module';
export default {
  props:['visible','chooseList','statusList'],
  data(){
    return {
      form:{
        reason:'',
        stauts:''
      },
      rules: {
        approveOpinion:[{ required: true, message: '请输入审批意见', trigger: 'blur' }],
        result:[{ required: true, message: '请输入选择判定结果', trigger: 'blur' }],
      },
      /**-----------------------------数据字典- 字典码-------------- */ 
      dicJudgeName:{
        BYPDJG:'BYPDJG', // 毕业判定结果
      },
      dictionary:{},
    }
  },
  watch:{
    visible(newVal){
      if(newVal){
        
      }
    },
  },
  activated(){
        
    
  },
  methods:{
    //----------------------------------------查询-----------------------------------------
    //----------------------------------------操作-----------------------------------------
    close(){
      this.$emit('update:visible', false)
    },
    save(){
      this.$refs.form.validate((valid) => {
        if(!valid) return;
        this.$set(this.form,'ids',this.chooseList)
        updateGraduationRecordApprove(this.form).then(()=>{
          this.$alert('批量审批成功！');
          this.$emit('initialData')
          this.close()
        }).catch(err=>{ 
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })
      });   
    },
    
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  max-width: 100%;
}
/deep/.el-input.is-disabled .el-input__inner{
  color:#999;
}
</style>