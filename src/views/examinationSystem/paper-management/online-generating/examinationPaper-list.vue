
<template>
<div>
  <!-- 在线组卷 -->
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 专业树 -->
        <org-tree :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>                                
      </el-card>
    </el-col>
    <el-col :span="19" v-show="nodeLevel">
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}' && this.nodeLevel=='课程'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>【{{nodeName}}】 试卷列表</span>
        </div>
        <!-- 查询 -->
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="试卷名称" prop="examinationPaperName">
            <el-input class="input-append" v-model="conditionForm.examinationPaperName" placeholder="请输入试卷名称"></el-input>	
          </el-form-item>
          <!-- <el-form-item label="学习项目" prop="trainingProgramsId">
            <el-select v-model="trainingProgramsId" filterable clearable placeholder="请选择培训中的学习项目">
              <el-option v-for="(item,i) of programs" :key="i" :label="item.projectName" :value="item.id"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="考试科目" prop="courseId" v-if="trainingProgramsId">
            <el-select v-model="conditionForm.courseId" filterable clearable>
              <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="组卷方式">
            <el-select v-model="conditionForm.constructionExaminationWay" clearable>
              <el-option v-for="(item,i) of constructionExaminationWay" :key="i" :label="item.name" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>                               
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <el-button type="primary" size="mini" @click="edit('Auto',{})">自动组卷</el-button>
          <el-button type="primary" size="mini" @click="edit('Manual',{})">手工组卷</el-button>
          <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button> -->
        </div>
        <!-- 表格 -->
        <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="examinationPaperName" sortable label="试卷名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)" title="点击预览">{{scope.row.examinationPaperName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="constructionExaminationWayName" label="组卷方式" width="100" align="center"></el-table-column>
          <el-table-column prop="creatorName" label="创建者" width="100" align="center"></el-table-column>
          <el-table-column prop="creationTime" label="创建时间" width="100">
            <template slot-scope="scope">
              {{new Date(scope.row.creationTime).toLocaleDateString()}}
            </template>
          </el-table-column>
          <el-table-column  fixed="right" label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="edit(scope.row.constructionExaminationWay,scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
              <el-button type="primary" size="mini" @click="toInfomationPage(scope.row)">预览试卷</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>			
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
        <!-- 自动组卷：新增/编辑 -->
        <auto-edit :dataForm="editForm" :strategys="strategyDropDown" :visible.sync="autoEditVisible" @save="saveAutoData"></auto-edit>
        <!-- 手工组卷：新增/编辑 -->
        <manual-edit :dataForm="editForm" :programs="programsDropDown" :visible.sync="manualEditVisible" @save="saveManualData"></manual-edit>
      </el-card>
    </el-col>
  </el-row>
  <!-- 试卷 -->
  <exam-paper :dataForm="paperForm" :visible.sync="PaperVisible" :title="editForm.title"></exam-paper>
</div>
</template>
<script>
import { getMajorCourseTree } from '@/server/basic-module';
import { getTrainingProgramsList,getTrainingProgramsBindCourse } from '@/server/training-module';
import { 
  getExaminationPaperList,getProjectByCourseIdAndState,getStrategyByCourseId,
  createExaminationPaperManual,createExaminationPaperAuto,
  updateExaminationPaper,deleteExaminationPaperyById  
} from '@/server/examination-module';
import orgTree from '@/components/orgTree.vue' // 机构树
import pagination from '@/components/pagination' // 分页组卷
import { pageSizes, pageSize } from '@/config.js'
import autoEdit from './examinationPaper-auto-edit' // 编辑自动组卷
import manualEdit from './examinationPaper-manual-edit' // 编辑手工组卷
import examPaper from '../examination-paper'  // 试卷
export default {
  components: {orgTree,pagination,autoEdit,manualEdit,examPaper},
  data() {
    return {
      style: '',
      conditionForm: {},
      // -------------树---------------
      TreeData: [],
      nodeSelect: {},
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      // -------------表格------------
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
      tableData: [],
      isSelectAll:false,
      multipleSelection: [],
      // -------------检索------------ 
      trainingProgramsId:null,
      programs: [],
      courseList: [],
      constructionExaminationWay: [
        {name: '全部',type: 'All'},
        {name: '自动组卷',type: 'Auto'},
        {name: '手工组卷',type: 'Manual'}
      ],
      // -------------编辑------------
      strategyDropDown: [],
      programsDropDown: [],
      editForm: {},
      autoEditVisible:false,
      manualEditVisible:false,
      // -------------试卷------------
      PaperVisible:false,
      paperForm: {},
    }
  },
  watch: {
    trainingProgramsId(newVal) {
      if (newVal) {
        this.$set(this.conditionForm,'trainingProgramsId',newVal)
        this._getTrainingProgramsBindCourse(); // 获取学习项目下的课程
      }
    }
  },
  activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getMajorCourseTree();
    this._getTrainingProgramsList();
  },
  methods: {
    /* --------------------------------------------查询--------------------------------------- */
    _getStrategyByCourseIde() { // 根据[课程Id和项目状态码]查询所有绑定该课程的策略
      let data={
        courseId: this.nodeId,
        state:3
      }
      getStrategyByCourseId(data).then(res => {
        this.strategyDropDown=res
      })
    }, 
    _getProjectByCourseIdAndState() { // 根据[课程Id和项目状态码]查询所有绑定该课程的项目
      let data={
        courseId: this.nodeId,
        state:3
      }
      getProjectByCourseIdAndState(data).then(res => {
        this.programsDropDown=res
      })
    }, 
    _getMajorCourseTree() {  // 专业课程树
      this.TreeData= []
      getMajorCourseTree().then(result => {
        this.TreeData.push(result);
      }).then(() => { 
        if (this.nodeId && this.nodeLevel!='根') {
          this.initialData()
        }
      })
    },
    _getTrainingProgramsList() { // 状态为“3-培训中”的项目
      let data = {
				SkipCount: 0, 
				MaxResultCount: 200,
				// Status:3 
			};
			getTrainingProgramsList(data).then(result => {
				this.programs=result.items;
			})
    }, 
    _getTrainingProgramsBindCourse() { // 根据项目id查询课程
      this.courseList= []
      getTrainingProgramsBindCourse(this.trainingProgramsId).then(result => {
        this.courseList=result
      })
    }, 
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
			this.SkipCount = SkipCount
			this.pageSize = pageSize
      this.initialData(SkipCount, pageSize);
    },
    queryList() {  
      this.initialData(this.SkipCount, this.pageSize);
    },
    // 获取试题列表
    initialData(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ConstructionExaminationWay: this.conditionForm.constructionExaminationWay,
        ExaminationPaperName: this.conditionForm.examinationPaperName,
        ExaminationQuestionId: this.nodeId,
      }
      if (this.trainingProgramsId) {
        this.$set(data,'TrainingProgramsId',this.trainingProgramsId)
      }
      if (this.trainingProgramsId && this.conditionForm.courseId) {
        this.$set(data,'CourseId',this.conditionForm.courseId)
      }
      getExaminationPaperList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    toInfomationPage(row) {  // 进入试卷页面
      this.paperForm=row||{};
      this.PaperVisible=true;
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
        // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect=node;
      this.nodeId = node.id
      this.nodeName=node.label;        
      this.nodeLevel = node.level 
      if (node.level=='课程') {
        this.initialData();
        this._getProjectByCourseIdAndState();
        this._getStrategyByCourseIde();
      }
    },    
    edit(type,row) {
      this.editForm=row || {}
      this.$set(this.editForm,'examinationQuestionName',this.nodeName) // 题库目录名称
      this.$set(this.editForm,'examinationQuestionId',this.nodeId);  // 题库目录id
      if (type=='Auto') {
        this.autoEditVisible=true;        
      } else {        
        this.manualEditVisible=true; 
      }
    },
    saveAutoData(data) {  
      if (data.id) {
        updateExaminationPaper(data).then(() => {
          this.$message.success('保存成功！');
          this.queryList()
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })  
      } else {
        createExaminationPaperAuto(data).then(() => {
          this.$message.success('保存成功！');
          this.queryList()
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })        
      }
    },
    saveManualData(data) {      
      if (data.id) {
        updateExaminationPaper(data).then(() => {
          this.$message.success('保存成功！');
          this.queryList()
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })  
      } else {
        createExaminationPaperManual(data).then(() => {
          this.$message.success('保存成功！');
          this.queryList()
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })        
      }
    },
    del(row) {
      this.$confirm(`此操作将删除选中的试卷 【${row.examinationPaperName}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
        type: 'warning'
      }).then(() => { 
        deleteExaminationPaperyById(row.id).then(() => {
          this.$message.success('试卷删除成功！');
          this.initialData();
          this.$refs.pagination.currentPage=1
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })   
      })
    },
    importFile() {

    },
  }
}
</script>