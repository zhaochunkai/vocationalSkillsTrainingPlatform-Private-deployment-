<template>
<el-dialog class="t-dialog" v-if="visible" title="毕业审批" :visible="visible" :close-on-click-modal="false" width="80%" @close="close" >
  <!-- 单个学生审批 -->  
  <div >
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="approval">审 批</el-button>
  </div>
  <!-- 学生基本信息  -->
  <div class="t-header-title">
    <span>学生基本信息</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="studentInfo" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column prop="institution" sortable label="准考证号" show-overflow-tooltip></el-table-column>
    <el-table-column prop="idCard" label="证件号" ></el-table-column>
    <el-table-column prop="name" label="姓名" width="100"></el-table-column>
    <el-table-column prop="trainingProgramsName" label="学习项目"></el-table-column>
    <el-table-column prop="className" label="班级"></el-table-column>
    <el-table-column prop="sex" label="性别" width="100"></el-table-column>
    <el-table-column prop="education" label="学历" width="170">
      <template slot-scope="scope">
        <el-select v-model="scope.row.education" disabled size="small">
          <el-option v-for="(item,i) of educationList" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="tel" label="联系电话" width="100"></el-table-column>
  </el-table>
  <!-- 毕业判定项目 -->
  <div class="t-header-title">
    <span>毕业判定项目</span>
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
    <el-table-column  fixed="right" label="操作" width="220" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="small" @click="update(scope.row)">修改达标状态</el-button>
        <el-button type="primary" size="small" @click="privew(scope.row)">查看成绩</el-button>
      </template>
    </el-table-column>
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
  <!-- 审批 -->
  <el-dialog width="30%" title="审批" :visible.sync="approvalVisible" append-to-body>    
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="110px" size="small">   
      <el-form-item label="审批意见" prop="approveOpinion">
        <el-input v-model="form.approveOpinion" type="textarea" ></el-input>
      </el-form-item>
      <el-form-item label="毕业判定结果" prop="result">
        <el-select v-model="form.result" filterable clearable>
          <el-option v-for="(item,i) of statusList" :key="i" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" @click="approvalVisible=false">关 闭</el-button>
        <el-button type="primary" size="small" @click="saveAproval">保 存</el-button>
      </el-form-item>
    </el-form>  
  </el-dialog>
</el-dialog>
</template>
<script>
import { 
  getGraduationRecordById,
  createGraduationJudgement,updateGraduationJudgement,
  updateGraduationRecordApprove,updateGraduationRecordPassState
} from '@/server/examination-module';
import { 
  getStudentBasicInfoById
} from '@/server/training-module';
export default {
  props:['visible','statusList','educationList','dataForm'],
  data(){
    return {
      // ------------------------------学生基本信息
      studentInfo:[],
      tableData:[],
      // -----达标状态
      statusVisible:false,
      passForm:{},
      passRules:{
        reason:[{ required: true, message: '请输入修改原因', trigger: 'blur' }],
        pass:[{ required: true, message: '请输入选择达标状态', trigger: 'blur' }],
      },
      // -----审批
      approvalVisible:false,
      form:{},
      rules: {
        approveOpinion:[{ required: true, message: '请输入审批意见', trigger: 'blur' }],
        result:[{ required: true, message: '请输入选择判定结果', trigger: 'blur' }],
      },
    }
  },
  watch:{
    visible(newVal){
      if(newVal){      
        this.passForm={};  
        this.form = {}  
        if(this.dataForm.id){
          this._getGraduationRecordById();
        }
        if(this.dataForm.studentId){
          this._getStudentBasicInfoById();
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
    _getStudentBasicInfoById(){
      this.studentInfo=[]
      let data={
        id:this.dataForm.studentId,
        trainingProgramsId:this.dataForm.trainingProgramsId
      }
      getStudentBasicInfoById(data).then(result=>{
        this.studentInfo.push(result)
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
      this.$alert('暂无此功能！')
    },
    approval(){
      this.approvalVisible=true;
    },
    saveAproval(){  // 审批    
      this.$refs.form.validate((valid) => {
        if(!valid) return;
        let ids=[this.dataForm.id];
        this.$set(this.form,'ids',ids)
        updateGraduationRecordApprove(this.form).then(()=>{
          this.$alert('审批成功！')
          this.approvalVisible=false;
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
    close(){
      this.$emit('initialData');
      this.$emit('update:visible', false)
    },
    save(){
      // console.log(this.form)
      // if(this.dataForm.id){
      //   updateGraduationJudgement(data).then(()=>{
      //     this.$message.success('保存成功！');
      //     this.$emit('initialData');
      //     this.close()
      //   }).catch(err=>{ 
      //     this.$message({
      //       showClose: true,
      //       message:err.message,
      //       type: 'error'
      //     });
      //   })  
      // }else{
      //   createGraduationJudgement(data).then(()=>{
      //     this.$message.success('保存成功！');
      //     this.$emit('initialData')
      //     this.close()
      //   }).catch(err=>{ 
      //     this.$message({
      //       showClose: true,
      //       message:err.message,
      //       type: 'error'
      //     });
      //   })        
      // }      
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