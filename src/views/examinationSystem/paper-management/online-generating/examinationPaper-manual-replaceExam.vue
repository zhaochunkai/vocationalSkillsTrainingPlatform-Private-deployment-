<template>
<el-dialog class="t-dialog" v-if="visible" :title="`【课程：${dataForm.examinationQuestionName}】 查看试题`" :visible="visible" append-to-body :close-on-click-modal="false" width="60%" @close="close" >
  <!-- 自动组卷 -->    
  <div >
    <el-button size="small" @click="close">关 闭</el-button>
    <el-button type="primary" size="small" @click="save">从试卷中移除</el-button>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list"  ref="multipleTable" border size="small" :data="tableData" @selection-change="handleSelectionChange" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="title" sortable label="题干" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)" v-html="decodeURI(scope.row.title)"></el-button>
      </template>
    </el-table-column>
    <el-table-column prop="keyWord" label="关键词"  width="100"></el-table-column>
    <el-table-column prop="difficultyLevelName" label="难易程度" width="100"></el-table-column>
    <el-table-column prop="creatorName" label="发布者" width="100"></el-table-column>
    <el-table-column prop="creationTime" label="发布时间" width="100">
      <template slot-scope="scope">
        {{new Date(scope.row.creationTime).toLocaleDateString()}}
      </template>
    </el-table-column>
    <el-table-column prop="auditStatusName" label="审核状态" width="100"></el-table-column>
  </el-table>
  <!-- 全选 -->
  <div class="t-batch-operate">
    <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
  </div>			
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>

  <question-infomation-dialog :dataForm="infoFrom" :visible.sync="infoVisible"></question-infomation-dialog>
</el-dialog>
</template>
<script>
import { 
  getTrainingProgramsList,getTrainingProgramsBindCourse
} from '@/server/training-module';
import { 
  getAssembleStrategyList,getQuestionList,
} from '@/server/examination-module';
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import questionInfomationDialog from '../../question-management/question-maintenance/question-infomation-dialog'
export default {
  props: ['visible','dataForm','chooseValue'],
  components: {pagination,questionInfomationDialog},
  data() {
    return {
      id:null,
      trainingProgramsId:null,
      programs: [],
      courseList: [],
      AssembleStrategyList: [],
      questionAssembleStrategyId:null, // 策略ID
      conditionForm: {},
      difficultyLevel: '',
      DifficultyLevelEnumList: [
        {name: '全部',type: 'All'},
        {name: '容易',type: 'Easy'},
        {name: '初级',type: 'Primary'},
        {name: '中级',type: 'MiddleRank'},
        {name: '高级',type: 'Advanced'},
        {name: '困难',type: 'Difficulty'}
      ],
      judgeList: [
        {name: '等于',type:0},
        {name: '大于',type:1},
        {name: '小于',type:2},
      ],
      tableData: [],
      pageSizes,
      pageSize,
		  SkipCount:0,
      total:0,
      isSelectAll:false,
      multipleSelection: [],
      chooseIds: [],
      infoFrom: {},
      infoVisible:false,
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.trainingProgramsId=null;
        this._getTrainingProgramsList(); // 学习项目列表  
        this.conditionForm=Object.assign({},this.dataForm)        
        if (this.dataForm) {
          this.id=this.dataForm.id;          // 试卷id
        }    
        this.chooseIds= []
        this.chooseValue.forEach(item => {
          this.chooseIds.push(item.questionId)
        })
        this.initialData();   
      }
    },
    difficultyLevel(newVal) {
      if (newVal) {
        this.$set(this.conditionForm,'difficultyLevel',newVal)
      }
    },
    trainingProgramsId(newVal) {
      if (newVal) {
        this.$set(this.conditionForm,'trainingProgramsId',newVal);
        this._getTrainingProgramsBindCourse();
      }
    }
  },
  methods: {
    // -----------------------------------------查询----------------------------------- 
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
        ExaminationQuestionId: this.conditionForm.examinationQuestionId,
        QuestionType: this.conditionForm.questionType,
        KeyWord: this.conditionForm.KeyWord,
        DifficultyLevelEnum: this.conditionForm.DifficultyLevelEnum,
        auditStatus: 'Pass',  // 审核通过的试题
        questionQueryType: 'Choose', // 查询已选择的试题
        questionIds: this.chooseIds.join(','), // 已选择的试题
      }
      getQuestionList(data).then(result => {
        this.tableData=result.items
        this.total = result.totalCount;

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
    // ----------------------------------------操作-----------------------------------------
    toInfomationPage(row) {
      this.infoFrom=row;
      this.infoVisible=true;
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      this.$confirm(`此操作将在试卷中移除选中的试题， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
        type: 'warning'
      }).then(() => { 
        this.$emit('remove',this.multipleSelection,this.dataForm.questionType)
        this.close()
      })
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
/deep/.el-button--text{
  img{
    display: none;
  }
  p{
    margin:0;
  }
}
</style>