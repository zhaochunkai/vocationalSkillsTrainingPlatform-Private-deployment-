<template>
<el-dialog class="t-dialog" :title="dataForm.id?'编辑评价计划':'新增评价计划'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="80%" @close="close">   
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>     
    <el-button type="primary" size="small" @click="save">保 存</el-button>  
  </span>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="评价计划信息" name="first">   
      <div style="margin-bottom:10px;display:block;">  
        <el-button type="primary" size="mini" @click="next('second')">下一页</el-button>
      </div>
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">         
        <el-form-item label="评价计划名称" prop="evaluationName">
          <el-input v-model="form.evaluationName"></el-input>
        </el-form-item>
        <el-form-item label="评价类型" prop="evaluationType">
          <el-radio-group v-model="form.evaluationType">
            <el-radio label="CourseEvaluation">课程评价</el-radio>
            <el-radio label="RoutineEvaluation">常规评价</el-radio>
            <el-radio label="StudentEvaluationTeacher">学生评教师</el-radio>
            <el-radio label="TeacherEvaluationStudent">教师评学生</el-radio>
            <el-radio label="TeacherMutualEvaluation">教师互评</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评价周期" prop="evaluationPeriod">
          <el-radio-group v-model="form.evaluationPeriod">
            <el-radio label="Semester">学期</el-radio>
            <el-radio label="Date">日期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学期" prop="semesterId" v-show="form.evaluationPeriod=='Semester'">
          <el-select v-model="form.semesterId">
            <el-option :label="semesterList.semesterName" :value="semesterList.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" v-show="form.evaluationPeriod=='Date'">
          <div class="dateGroup">
            <el-date-picker v-model="form.startDate" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="datespan">-</span>
            <el-date-picker v-model="form.endDate" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="学习项目" prop="trainingProgramsId" v-if="form.evaluationType!='RoutineEvaluation'" :rules="trainingProgramRule">
          <el-select v-model="programeId" clearable>
            <el-option v-for="(item,i) of programeList" :key="i" :label="item.projectName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教授课程" prop="courseId" v-if="programeId && form.evaluationType=='CourseEvaluation'"  :rules="CourseRule">
          <el-select v-model="form.courseId" clearable>
            <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价计划描述" prop="description">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="设置评价指标" name="second">        
      <div style="margin-bottom:10px;display:block;">     
        <el-button size="mini" type="primary" @click="next('first')">上一页</el-button>     
        <el-button size="mini" type="primary" @click="next('third')">下一页</el-button>   
        <el-tag type="danger" style="color:#f00;font-size:14px;margin-left:100px;">注意：每个评价最多只能分配 <span style="font-size:20px;">5</span> 个指标！</el-tag>    
      </div>
      <el-row :gutter="120">
        <el-col :span="12">
          <el-card>
            <div slot="header" class="t-box-card-header">
              <span>未分配指标</span>
            </div>
            <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="mini">
              <el-form-item label="名称">
                <el-input class="input-append" v-model="conditionForm.IndicatorName"></el-input>	
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="conditionForm.IndicatorType">
                  <el-option label="全部" value="-1"></el-option>
                  <el-option v-for="(item,i) of dictionary.PJZBLX" :key="i" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
              </el-form-item>
            </el-form>
            <!-- 表格 -->
            <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40"> </el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>     
              <el-table-column prop="indicatorName" label="指标名称"></el-table-column>
              <el-table-column prop="indicatorTypeName" label="指标类型" width="80" align="center"></el-table-column>
              <el-table-column prop="isDeduction" label="为扣分项" width="80" align="center">
                <template slot-scope="scope">
                  {{scope.row.isDeduction?'是':'否'}}
                </template>
              </el-table-column>
              <el-table-column label="分值范围" width="80" align="center">
                <template slot-scope="scope">
                  {{scope.row.minScore}} ~ {{scope.row.maxScore}}
                </template>
              </el-table-column>
            </el-table>
            <!-- 全选 -->
            <div class="t-batch-operate">
              <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
            </div>
            <!-- 分页组件 -->
            <div class="t-operate-footer">
              <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div slot="header" class="t-box-card-header">
              <span>已分配指标</span>
            </div>
            <!-- 表格 -->
            <el-table class="t-table-list"  ref="multipleTableIndicator" stripe size="small" :data="tableDataIndicator" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChangeIndicator">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>      
              <el-table-column prop="indicatorName" label="指标名称"></el-table-column>
              <el-table-column prop="indicatorTypeName" label="指标类型" width="80" align="center"></el-table-column>
              <el-table-column prop="isDeduction" label="为扣分项" width="80" align="center">
                <template slot-scope="scope">
                  {{scope.row.isDeduction?'是':'否'}}
                </template>
              </el-table-column>
              <el-table-column label="分值范围" width="80" align="center">
                <template slot-scope="scope">
                  {{scope.row.minScore}} ~ {{scope.row.maxScore}}
                </template>
              </el-table-column>
            </el-table>
            <!-- 全选 -->
            <div class="t-batch-operate">
              <el-checkbox v-model="isSelectAllIndicator" class="t-select-all" @change="selectAllIndicator()">全选</el-checkbox>
            </div>
          </el-card>
        </el-col>
        <div><el-button class="divide" type="success" size="medium" @click="DivideIndicator">分配 &gt;</el-button></div>
        <div><el-button class="Undivide" type="success" size="medium" @click="UnDivideIndicator">&lt; 解绑</el-button></div>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="设置被考评者" name="third">
      <div style="margin-bottom:10px;display:block;">     
        <el-button size="mini" type="primary" @click="next('second')">上一页</el-button> 
        <el-button type="success" size="small" @click="showProfessional('BeCommentator')">选择被考评人员</el-button>      
        <el-button size="mini" type="primary" @click="next('fourth')">下一页</el-button> 
      </div>
      <el-table class="t-table-list" ref="BeCommentatorTable" stripe size="small" :data="BeCommentator" tooltip-effect="dark" style="max-width: 100%;margin-top:10px;">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="被考评者" width="200"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index,BeCommentator)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="设置评价者" name="fourth">
      <div style="margin-bottom:10px;display:block;">   
        <el-button size="mini" type="primary" @click="next('third')">上一页</el-button> 
        <el-button type="success" size="small" @click="showProfessional('Commentator')">选择评价人员</el-button>          
      </div>
      <el-table class="t-table-list" ref="CommentatorTable" stripe size="small" :data="Commentator" tooltip-effect="dark" style="max-width: 100%;margin-top:10px;">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="被考评者" width="200"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index,Commentator)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
  <!-- 选取专业课 -->
  <commentators-profession :dataForm="professionForm" :visible.sync="ProfessionalCommentatorsVisible" @getProfessional="getProfessional"></commentators-profession>
</el-dialog>
</template>
<script>
import {
  getDefaultSemester,
  getDictionaryItems
} from '@/server/basic-module';
import {
  getTrainingProgramsList,
  getTrainingProgramsBindCourse
} from '@/server/training-module';
import {
  getEvaluationPlanById,
  getEvaluationIndicator,
  getEvaluationPlanIndicator,
  createEvaluationPlan,
  updateEvaluationPlan
} from '@/server/online-module';
import pagination from "@/components/pagination";
import { pageSizes, pageSize } from "@/config.js";
import commentatorsProfession from './evaluating-commentators-professional'
export default {
  props:['dataForm', 'visible'],
  components:{commentatorsProfession,pagination},
  data () {
    return {
      id:'',  // 评价计划id
      activeName:'first',      
      show:false,
      /* ------------------------评价计划--------------------------- */
      form: {},
      rules: {
        evaluationName:[
          { required: true, message: '请输入评价名称', trigger: 'blur' },
          { max: 30, message: '字符长度必须小于30', trigger: 'blur' }
        ],
        evaluationType:{ required: true, message: '请选择评价类型', trigger: 'blur' },
        evaluationPeriod:{ required: true, message: '请选择评价周期', trigger: 'blur' },
      },
      trainingProgramRule:{ required: true, message: '请选择学习项目', trigger: 'blur' },
      CourseRule:{ required: true, message: '请选择教授课程', trigger: 'blur' },
      semesterList:{},
      programeList:[],
      programeId:'',
      projectName:'',
      courseList:[],
      /* ------------------------未分配--------------------------- */
      conditionForm:{
        IndicatorType:'-1'
      },
      isSelectAll:false,
      tableData:[],
      multipleSelection:[],
      pageSizes,
      pageSize,
      SkipCount:0,
      total:0,
      /* ------------------------已分配--------------------------- */
      isSelectAllIndicator:false,
      tableDataIndicator:[],
      multipleSelectionIndicator:[],
      /* ------------------------评价者------------------------ */ 
      checkList:[],
      evaluatorData:[],
      evaluatorList:[],
      attachedName:'',
      /* ------------------------项目或班级相关评论/被评论者------------------------ */ 
      ProfessionalCommentatorsVisible:false,
      professionForm:{},
      Commentator:[], // 评价者
      BeCommentator:[], // 被评价者
      /* ------------------------------------------------ */ 
      /* ------------------------数据字典- 字典码------------------------ */ 
      dicJudgeName:{
        PJZBLX:'PJZBLX', // 学历
      },
      dictionary:{},
    }
  },
  activated(){
    /* ------------------数据字典- 获取数据字典下拉数据-------------- */ 
    for(let item in this.dicJudgeName){
      getDictionaryItems(this.dicJudgeName[item]).then(result=>{
          this.$set(this.dictionary, item, result)   
      })
    }
  },
  watch: {
    visible(newVal){
      if(newVal){      
        this.programeId=null;  
        this._getDefaultSemester();   // 获取默认学期
        this._getTrainingProgramsList(); // 获取状态为“3-培训中”培训项目
        this.initDataListAll(); // 获取所有的指标列表
        this.BeCommentator=[];
        this.Commentator=[];
        if(this.dataForm.id){
          this.id=this.dataForm.id; // 评价计划id
          getEvaluationPlanById(this.dataForm.id).then(result=>{
            this.form = Object.assign({}, result)
            this.programeId=result.trainingProgramsId;
          })
          this.show=true;
          this.activeName="second"
        }else{
          this.form = new Object();
          this.id='';
          this.show=false;
          this.activeName='first'
        }
      }
    },
    programeId(newVal){
      if(newVal){
        this.$set(this.form,'trainingProgramsId',this.programeId)
        this._getTrainingProgramsBindCourse();        
        this.BeCommentator=[];
        this.Commentator=[];
        this.programeList.forEach(item=>{
          if(item.id==newVal){
            this.projectName=item.projectName
          }
        })
      }
    },
  },
  methods: {
    /***************************************************************************************************
     * ********************************************** 查询 ********************************************* 
     * ************************************************************************************************ */
    /* ---------------------------------- 评价计划基本信息 ---------------------------------- */   
    _getDefaultSemester(){ // 获取默认学期
      getDefaultSemester().then(result=>{
        this.semesterList=Object.assign({},result)
      })
    },    
    _getTrainingProgramsList(){   // 获取状态为“3-培训中”培训项目
      getTrainingProgramsList({Status:3,MaxResultCount:200}).then(result=>{
        this.programeList=result.items;        
      })
    },
    _getTrainingProgramsBindCourse(){// 获取课程   
      this.courseList=[];
      getTrainingProgramsBindCourse(this.programeId).then(result=>{
        this.courseList=result;
      })
    },
    /* ---------------------------------- 所有的指标列表 ---------------------------------- */    
    toggleSelection (rows) { // 全选   
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll(){          // 全选   
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val){  // 多选    
      this.multipleSelection = val 
      if(this.multipleSelection.length> 5 - this.tableDataIndicator.length){  // 判断已分配数据和新选中数据之和是否大于5.大于5，则提示可选个数
        this.$message.warning(`最多只能选择 ${5 - this.tableDataIndicator.length} 个指标！`);
        return;
      }
      this.isSelectAll = this.tableData.length === this.multipleSelection.length       // 判断是否是全选
    },
    handleSize (SkipCount, pageSize) { /**接收改变后每页多少条*/
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataListAll(SkipCount, pageSize);
    },      
    handleCurrent (SkipCount, pageSize) { /* 接收当前页数 */
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataListAll(SkipCount, pageSize);
    },
    queryList(){
      this.initDataListAll(this.SkipCount, this.pageSize);
    },
    initDataListAll(SkipCount = 0, pageSize = this.pageSize){ // 初始化：根据获取指标列表
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        IndicatorName:this.conditionForm.IndicatorName,
        IndicatorType:this.conditionForm.IndicatorType,
      }
      getEvaluationIndicator(data).then(result=>{
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },  
    /* ---------------------------------- 已选择的指标列表 ---------------------------------- */  
    toggleSelection (rows) { // 全选   
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTableIndicator.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTableIndicator.clearSelection()
      }
    },
    selectAllIndicator(){          // 全选   
      this.$refs.multipleTableIndicator.toggleAllSelection()
    },
    handleSelectionChangeIndicator(val){  // 多选
      this.multipleSelectionIndicator = val;       
      this.isSelectAllIndicator = this.tableDataIndicator.length === this.multipleSelectionIndicator.length;       // 判断是否是全选
    },
    _getEvaluationPlanIndicator(){  // 获取已分配的评价指标
      getEvaluationPlanIndicator(this.id).then(result=>{
        this.tableDataIndicator=result
      })
    },
    /***************************************************************************************************
     * ********************************************** 操作 ********************************************* 
     * ************************************************************************************************ */
    next(data){  // 下一步
      this.$refs.form.validate((valid) => {
        if(!valid) {
          this.$alert('请完成评价计划信息填写！');
          this.activeName='first'
          return;
        }else{
          this.activeName=data;
        }
      });
      if(data=='third' && this.tableDataIndicator.length==0){
        this.$alert('请选择评价指标！');
        this.activeName='second'
        return;
      }else{
        this.activeName=data;
      }      
      if(data=='fourth' && this.BeCommentator.length==0){
        this.$alert('请设置被考评人员！');
        this.activeName='third'
        return;
      }
    },   
    UnDivideIndicator(){  // 解除绑定
      if(this.multipleSelectionIndicator.length==0){
        this.$message.warning(`请选择需要解除绑定的指标！`);
        return;
      }
      this.multipleSelectionIndicator.forEach(item=>{
        this.tableDataIndicator.forEach((el,i)=>{
          if(el.id==item.id){
            this.tableDataIndicator.splice(i,1);
            this.tableData.unshift(item)
          }
        })
      })
    }, 
    DivideIndicator(){   // 绑定指标
      let add=this.multipleSelection;// 待新增的数据
      let odd=this.tableDataIndicator;// 已有的数据
      let tab=JSON.parse(JSON.stringify(this.tableData)); // 所有指标
      if(add.length==0){
        this.$message.warning(`请选择要分配的指标！`);
        return;
      }
      if(add.length>5-odd.length){
        this.$message.warning(`最多只能选择 ${5 - odd.length} 个指标！`);
        return;
      } 
      if(this.tableDataIndicator.length==0){
        this.tableDataIndicator=JSON.parse(JSON.stringify(add));
      }else{        
        let selectedIds=[];
        this.tableDataIndicator.forEach(el=>{
          selectedIds.push(el.id)
        });
        add.forEach(item=>{
          if(selectedIds.indexOf(item.id)==-1){
            this.tableDataIndicator.push(item);         
          }
        })
      }    
      this.tableDataIndicator.forEach(el=>{
        this.tableData.forEach((item,i)=>{
          if(el.id==item.id){
            this.tableData.splice(i,1);
          }
        })
      })      
    },
    showProfessional(type){ // 专业评价：考评人和被考评人选择 type=BeCommentator被考评人,Evaluator考评人
      let personType=null;
      if(this.form.evaluationType=='StudentEvaluationTeacher'){ // 学生评价老师
        if(type=='BeCommentator'){  // 被评价者身份-教师
          personType='Teacher'
        }else{                    // 评价者身份-学生
          personType='student'
        }       
      }else if(this.form.evaluationType=='TeacherEvaluationStudent'){ // 教师评学生
        if(type=='BeCommentator'){ 
          personType='student'
        }else{
          personType='Teacher'
        }       
      }else if(this.form.evaluationType=='TeacherMutualEvaluation'){ // 教师互评
        personType='student'
      }
      this.professionForm={
        personType:personType,
        isBeCommentator:type=='BeCommentator'?true:false,
        title:type=='BeCommentator'?'选择被考评人员':'选取评价者',
        programeId:this.programeId,
        projectName:this.projectName,
      }
      this.ProfessionalCommentatorsVisible=true;
    },
    getProfessional(dataList,dataForm){ // 获取选取的人员数据
      // dataList-选取的人员列表, dataForm-传递过去的表单信息
      if(dataForm.isBeCommentator){ // 被评人
        if(this.BeCommentator.length==0){          
          dataList.forEach(item=>{
            let obj={
              commentatorType:dataForm.personType,
              isBeCommentator:true,
              name:item.name
            }
            if(dataForm.personType=='Teacher'){
              this.$set(obj,'teacherId',item.id)
            }else{
              this.$set(obj,'studentId',item.id)
            }
            this.BeCommentator.push(obj)
          })    
        }else{          
          let BeCommentatorIds=[];
          if(dataForm.personType=='Teacher'){
            this.BeCommentator.forEach(el=>{
              BeCommentatorIds.push(el.teacherId)
            })
          }else{
            this.BeCommentator.forEach(el=>{
              BeCommentatorIds.push(el.studentId)
            })
          }
          dataList.forEach(item=>{
            if(BeCommentatorIds.indexOf(item.id)==-1){
              let obj={                
                commentatorType:dataForm.personType,
                isBeCommentator:true,
                name:item.name,
              }              
              if(dataForm.personType=='Teacher'){
                this.$set(obj,'teacherId',item.id)
              }else{
                this.$set(obj,'studentId',item.id)
              }
              this.BeCommentator.push(obj)
            }
          })
        }
      }else{ // 评论者
        if(this.Commentator.length==0){          
          dataList.forEach(item=>{
            let obj={
              commentatorType:dataForm.personType,
              isBeCommentator:false,
              name:item.name
            }
            if(dataForm.personType=='Teacher'){
              this.$set(obj,'teacherId',item.id)
            }else{
              this.$set(obj,'studentId',item.id)
            }
            this.Commentator.push(obj)
          })    
        }else{          
          let CommentatorIds=[];
          if(dataForm.personType=='Teacher'){
            this.Commentator.forEach(el=>{
              CommentatorIds.push(el.teacherId)
            })
          }else{
            this.Commentator.forEach(el=>{
              CommentatorIds.push(el.studentId)
            })
          }
          dataList.forEach(item=>{
            if(CommentatorIds.indexOf(item.id)==-1){
              let obj={                
                commentatorType:dataForm.personType,
                isBeCommentator:false,
                name:item.name,
              }              
              if(dataForm.personType=='Teacher'){
                this.$set(obj,'teacherId',item.id)
              }else{
                this.$set(obj,'studentId',item.id)
              }
              this.Commentator.push(obj)
            }
          })
        }
      }
    },    
    deleteRow(index, rows) {  // 删除考评人或被考评人数据
      rows.splice(index, 1);
    },
    save(){  // 评价计划保存    
      this.$refs.form.validate((valid) => {
        if(!valid) {
          this.$alert('请检查基本信息是否填写正确');
          this.activeName='first'
          return;
        }        
      });
      if(this.tableDataIndicator.length==0){
        this.$alert('请选择评价指标！');
        this.activeName='second'
        return;
      }
      if(this.BeCommentator.length==0){
        this.$alert('请设置被考评人员！');
        this.activeName='third'
        return;
      }
      if(this.Commentator.length==0){
        this.$alert('请设置考评人员！');
        this.activeName='fourth'
        return;
      }
      let indicators=[];
      this.tableDataIndicator.forEach(item=>{
        let obj={
          evaluationIndicatorId:item.id
        }
        indicators.push(obj)
      })
      this.$set(this.form,'indicators',indicators); // 指标
      let commentators=this.BeCommentator.concat(this.Commentator);
      this.$set(this.form,'commentators',commentators); // 评价者或被评价者
      if(this.form.id){
        updateEvaluationPlan(this.form).then(()=>{
          this.$message.success('修改成功！');
          this.close()
          this.$emit('updateList')
        }).catch(err=>{
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })
      }else{
        createEvaluationPlan(this.form).then(()=>{
          this.$message.success('保存成功！')
          this.close()
          this.$emit('updateList')
        }).catch(err=>{
          this.$message({
            showClose: true,
            message:err.message,
            type: 'error'
          });
        })
      }
    },
    handleClick(tab, event) {
      this.next(this.activeName);
    },
    close(){
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang="less" scoped>
.dateGroup{
  display: flex;
  justify-content: space-between;   
  border-bottom: none;
  padding:0;
  margin-bottom: 0; 
  .datespan{
    padding:0 5px;
  }
}
/deep/.el-dialog {
  max-width: 1200px;
}
/deep/.el-card__header{
  color:#303030;
  background:#ddd;
  font-weight: 600;
}
/deep/.el-form .el-form-item {
  max-width: 700px;
}
.Undivide,
.divide{
  position: absolute;
  top:20%;
  left:50%;
  margin-left:-43px;
}
.divide{
  margin-top:-40px;
}
.Undivide{
  margin-top:10px;
}
</style>
