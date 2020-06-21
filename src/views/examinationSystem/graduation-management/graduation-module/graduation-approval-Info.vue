<template>
<el-dialog class="t-dialog" v-if="visible" title="审批信息" :visible="visible" :close-on-click-modal="false" width="80%" @close="close" >
  <!-- 查看审批信息 --> 
  <div >
    <el-button size="small" @click="close">返 回</el-button>
  </div>
  <!-- 毕业判定项目 -->
  <div class="t-header-title">
    <span>学生【{{dataForm.studentName}}】毕业判定项目达标情况</span>
  </div>
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <!-- <el-table-column prop="institution" sortable label="判定项目" show-overflow-tooltip></el-table-column> -->
    <el-table-column prop="standard" label="标准"></el-table-column>
    <el-table-column prop="requirement" label="达标要求"></el-table-column>
    <el-table-column prop="pass" label="达标状态" width="80">
      <template slot-scope="scope">
        {{scope.row.pass?'达标':'不达标'}}
      </template>
    </el-table-column>
    <el-table-column prop="notPassReason" label="未通过原因" width="100"></el-table-column>
    <el-table-column prop="passStateModificationReason" label="修改原因" width="100"></el-table-column>
    <el-table-column  fixed="right" label="操作" width="200" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="update(scope.row)">修改达标状态</el-button>
        <el-button type="primary" size="small" @click="privew(scope.row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>	 
  <!-- 审批历史  -->
  <div class="t-header-title">
    <span>审批历史</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column prop="approver" label="审核人"></el-table-column>
    <el-table-column prop="approveTime" label="审核时间">
      <template slot-scope="scope">
        {{new Date(scope.row.approveTime).toLocaleString()}}
      </template>
    </el-table-column>
    <el-table-column prop="approveOpinion" label="审核意见"></el-table-column>
  </el-table>  

  <!-- 修改状态 -->
  <el-dialog width="30%" title="修改达标状态" :visible.sync="statusVisible" append-to-body>    
    <el-form class="t-form-block" ref="passForm" :model="passForm" :rules="passRules" label-width="110px" size="small">   
      <el-form-item label="修改原因" prop="reason">
        <el-input v-model="passForm.reason" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item label="达标状态" prop="pass">
        <el-radio-group v-model="passForm.pass">
          <el-radio :label="true">达标</el-radio>
          <el-radio :label="false">不达标</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" @click="statusVisible=false">关 闭</el-button>
        <el-button type="primary" size="small" @click="savePass">保 存</el-button>
      </el-form-item>
    </el-form>  
  </el-dialog>
</el-dialog>
</template>
<script>
import { 
  getGraduationRecordById,
  updateGraduationRecordApprove,updateGraduationRecordPassState
} from '@/server/examination-module';
import { 
  getStudentBasicInfoById
} from '@/server/training-module';
export default {
  props:['visible','dataForm'],
  data(){
    return {
      // ------------------------------
      tableData:[],
      // -----达标状态
      statusVisible:false,
      passForm:{},
      passRules:{
        reason:[{ required: true, message: '请输入修改原因', trigger: 'blur' }],
        pass:[{ required: true, message: '请输入选择达标状态', trigger: 'blur' }],
      },
    }
  },
  watch:{
    visible(newVal){
      if(newVal){    
        this.passForm={}    
        if(this.dataForm.id){
          this._getGraduationRecordById();
        }
      }
    },
  },
  methods:{
    //----------------------------------------查询-----------------------------------------
    _getGraduationRecordById(){
      this.tableData=[]
      getGraduationRecordById(this.dataForm.id).then(result=>{
        this.tableData.push(result)
      })
    },
    //----------------------------------------操作-----------------------------------------
    update(row){
      this.$set(this.passForm,'pass',row.pass)
      this.statusVisible=true;
    },
    savePass(){
      this.$refs.passForm.validate((valid) => {
        if(!valid) return;
        updateGraduationRecordPassState(this.dataForm.id,this.passForm).then(()=>{
          this.$alert('状态修改成功！')
          this._getGraduationRecordById();
          this.statusVisible=false;
        }).catch(err=>{ 
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })
      });
    },
    privew(){
          this.$alert('暂未处理')
    },
    close(){
      this.$emit('update:visible', false)
      this.$emit('initialData');
    },
    
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  max-width: 100%;
}
/deep/.el-input.is-disabled .el-input__inner{
  color:#666;
  background-color: #fff;
  border-color: #fff;
}
/deep/.el-select .el-input .el-select__caret {
  color: #fff;
}
</style>