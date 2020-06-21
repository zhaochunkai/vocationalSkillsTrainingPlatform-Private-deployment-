<template>
<el-dialog class="t-dialog" v-if="visible" :title="dataForm.id?'编辑毕业判定条件':'新增毕业判定条件'" :visible="visible" :close-on-click-modal="false" width="630px" @close="close" >
  <!-- 毕业判定条件 -->    
  <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">   
    <el-form-item label="学年学期">
      <el-input v-model="form.semesterName" disabled></el-input>
    </el-form-item>
    <el-form-item label="学习项目" prop="trainingProgramId">
      <el-select v-model="form.trainingProgramId" filterable clearable placeholder="请选择培训中的学习项目">
        <el-option v-for="(item,i) of programs" :key="i" :label="item.projectName" :value="item.id"></el-option>
      </el-select>
    </el-form-item> 
    <el-form-item label="标准" prop="standard">
      <div v-for="(item,i) of standardList" :key="i" style="dislpay:flex;justify-content: space-between">
        <el-checkbox v-model="item.value">{{item.label}}</el-checkbox>
        <div v-if="item.type=='totalScoreNotBelow' && item.value" class="input-div" style="width:124px;float:right;">
          <el-input v-model="item.score" type="number" size="mini" min="0">
            <el-button slot="append" size="small">分</el-button>
          </el-input>
        </div>
      </div>      
    </el-form-item> 
    <el-form-item label="达标要求">
      <el-radio-group v-model="requirement">
        <el-radio v-for="(item,i) of requirementList" :key="i" :label="item.name">{{item.name}} <el-tag style="margin:6px 0;color:#777;background-color:#fffbea;" size="medium">{{item.desc}}</el-tag></el-radio>
      </el-radio-group>
    </el-form-item> 
    <el-form-item label="毕业判定机构" prop="examinationPaperCount">
      <el-input v-model="filterlabel" @focus="chooseUnit">
        <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
      </el-input>
      <el-dialog width="30%" title="选取机构" :visible.sync="UnitTreeVisible" append-to-body>
        <div class="t-header-title">
          <span>已选机构：{{filterlabel}}</span>
        </div>
        <el-button type="primary" @click="UnitTreeVisible = false">确 定</el-button>
        <el-tree :data="SchoolTree" ref="tree" node-key="id" :default-checked-keys="schoolDefault"  @node-click="haddleOrganizationNode" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
        <el-tree :data="EnterpriseTree" ref="tree" node-key="id" :default-checked-keys="EnterpriseDefault"  @node-click="haddleOrganizationNode" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
      </el-dialog>
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
  getDefaultSemester,getSchoolTree,getEnterpriseTree
} from '@/server/basic-module';
import { 
  getTrainingProgramsList
} from '@/server/training-module';
import { 
  createGraduationJudgement,updateGraduationJudgement,getGraduationJudgementById
} from '@/server/examination-module';
export default {
  props:['visible','dataForm'],
  data(){
    return {
      id:null,
      form:{},
      rules: {
        // examinationPaperName:[{ required: true, message: '请输入试卷名称', trigger: 'blur' }],
      },
      requirement:'任意一个标准达标',
      requirementList:[
        {type:'Any',name:'任意一个标准达标',desc:'以上勾选的标准，任意一个达标即可（至少勾选2个标准）'},
        {type:'All',name:'所有标准都要达标',desc:'以上勾选的标准，全部都要达标（至少勾选1个标准）'}
      ],
      standardList:[
        {type:'allCoursePass',label:'培训项目内的课程都必须及格',value:false},
        {type:'nationalExaminationPass',label:'国考成绩必须及格',value:true},
        {type:'totalScoreNotBelow',label:'培训项目内课程成绩总分不能低于',value:false,score:null,},
        {type:'allPaid',label:'培训费用已缴清',value:false}
      ],
      programs:[],
      //--------机构----
      filterlabel:'',
      UnitTreeVisible:false,
      SchoolTree:[],
      EnterpriseTree:[],
      institutionIds:[],
      schoolDefault:[],
      EnterpriseDefault:[],
    }
  },
  watch:{
    visible(newVal){
      if(newVal){
        this._getDefaultSemester();
        this._getTrainingProgramsList();
        this._getSchoolTree()
        this._getEnterpriseTree(); 
        this.requirement='任意一个标准达标';
        this.standardList=[
          {type:'allCoursePass',label:'培训项目内的课程都必须及格',value:false},
          {type:'nationalExaminationPass',label:'国考成绩必须及格',value:true},
          {type:'totalScoreNotBelow',label:'培训项目内课程成绩总分不能低于',value:false,score:null,},
          {type:'allPaid',label:'培训费用已缴清',value:false}
        ];
        this.form=Object.assign({},this.dataForm) 
        if(this.dataForm.id){
          this._getGraduationJudgementById()
        }
      }
    },
  },
  activated(){
        
    
  },
  methods:{
    //-----------------------------------------查询-----------------------------------   
    // 获取默认学期
    _getDefaultSemester () {
      getDefaultSemester().then(result => {
        if (result.id) { // 如果存在默认学期
          this.$set(this.form, 'semesterId', result.id)
          this.$set(this.form, 'semesterName', result.semesterName)
        } else {			// 不存在默认学期则前往设置
          this.$confirm(`请前往【学年学期】模块设置默认学期， 是否前往？`, '提示', {
            confirmButtonText: '前往',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({path: '/academicYear/semester'})
          }).catch()
        }
      })
    },
    _getTrainingProgramsList(){ // 状态为“3-培训中”的项目
      let data = {
				SkipCount: 0, 
				MaxResultCount: 200,
				// Status:3 
			};
			getTrainingProgramsList(data).then(result=>{
				this.programs=result.items;
			})
    }, 
    // 获取学校信息树
    _getSchoolTree(){
      this.SchoolTree=[]
      getSchoolTree().then(result=>{
        this.SchoolTree.push(result);
      })
    },
    // 获取企业信息树
    _getEnterpriseTree(){
      this.EnterpriseTree=[]
      getEnterpriseTree().then(result=>{
        this.EnterpriseTree.push(result);
      })
    },  
    renderContent(h, { node, data, store },trueOrFalse=true) {  // 只有知识点节点，可选择
      // trueOrFalse=data.trueOrFalse || false; 
      trueOrFalse=node.checked || false;
      return (
        <span class="custom-tree-node">
          <span v-show={(data.level!='机构' && data.level!='企业') || data.id==-1}>{node.label}</span>
          <span v-show={(data.level=='企业' && data.id!=-1) || data.level=='机构'}> 
            <el-checkbox checked={trueOrFalse} v-model={trueOrFalse} style="margin-right:1rem;" on-change={(trueOrFalse)=>this.changeOptions(data,trueOrFalse)}> {node.label}</el-checkbox>     
          </span>
        </span>
      );
    },  
    _getGraduationJudgementById(){
      getGraduationJudgementById(this.dataForm.id).then(result=>{
        this.form=Object.assign({},result)
        this.$set(this.form, 'semesterName', result.yearSemester)
        this.requirement=result.requirement;
        this.standardList.forEach(item=>{
          for(let key in result.standard){
            if(key=item.type){
              if(key=='totalScoreNotBelow'){                
                if(result.standard[key]==false){
                  item.value=false
                  item.score=null
                }else{
                  item.value=true;
                  item.score=result.standard[key]
                }
              }else{
                item.value=result.standard[key]
              }
            }
          }
        })
        this.institutionIds=result.competentAuthorityList;
        this.schoolDefault=[];
        this.EnterpriseDefault=[];
        this.filterlabel=''
        this.institutionIds.forEach(item=>{  
          if(item.competentAuthorityType=='School'){  // 将查询出来的机构设置为树上的默认值
            this.schoolDefault.push(item.id)
          }else{
            this.EnterpriseDefault.push(item.id)
          }
          item.trueOrFalse=true;  // 给选中数据增加属性 trueOrFalse。
          this.filterlabel+=(item.name+','); // 机构名称拼接为字符串
        })
      })
    },
    //----------------------------------------操作-----------------------------------------
    
    changeOptions(node,trueOrFalse){  // 复选框选择知识点
      let type=node.level=='机构'?'School':'Enterprise';
      let obj={
        trueOrFalse:trueOrFalse,
        id:node.id,  // 机构id
        name:node.label,
        competentAuthorityType:type,  // 机构类型
      }
      let arr=JSON.parse(JSON.stringify(this.institutionIds)); // id集合
      let finds=arr.find((item,i) => {
        return item.id==obj.id && item.competentAuthorityType==obj.competentAuthorityType;
      });
      arr.forEach((item,i) => {
        if(item.id==obj.id && item.competentAuthorityType==obj.competentAuthorityType && !obj.trueOrFalse){  // 如果集合中存在知识点id，但是又没有被选择，则从集合中删除该数据
          this.institutionIds.splice(i,1);
        }
      });
      if(!finds && obj.trueOrFalse){ // 如果集合中不存在该知识点id，且被选中，则push
        this.institutionIds.push(obj)
      }
      this.filterlabel=''
      this.institutionIds.forEach(item=>{
        this.filterlabel+=(item.name+',')
      })
    },
    chooseUnit(){
      this.UnitTreeVisible=true;
    },
    /* 选择的组织机构 */
    haddleOrganizationNode(node){
      // console.log(node)
    },
    clear(){  // 清空已选机构
      this.filterlabel = ''
      this.institutionIds=[];
      this.schoolDefault=[];
      this.EnterpriseDefault=[];
    },
    close(){
      this.$emit('update:visible', false)
    },
    save(){
      let standard={};
      this.standardList.forEach(item=>{
        if(item.type=='totalScoreNotBelow'){
          if(item.value && item.score<=0){
            this.$alert('分数必须大于0')
            return;
          }
          this.$set(standard,item.type,item.value?item.score:-1)
        }else{
          this.$set(standard,item.type,item.value)
        }        
      })
      this.form=Object.assign(this.form,{
        standard:standard,
        competentAuthorityList:this.institutionIds,
        requirement:this.requirement
      })      
      if(this.dataForm.id){
        updateGraduationJudgement(this.form).then(()=>{
          this.$message.success('保存成功！');
          this.$emit('initialData');
          this.close()
        }).catch(err=>{ 
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })  
      }else{
        createGraduationJudgement(this.form).then(()=>{
          this.$message.success('保存成功！');
          this.$emit('initialData')
          this.close()
        }).catch(err=>{ 
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })        
      }      
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
.t-header-title span{
  width:100%;
  text-align:left;
  line-height:1.6;
  padding:6px;
}
</style>