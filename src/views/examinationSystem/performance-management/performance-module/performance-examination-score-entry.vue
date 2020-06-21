<template>
  <el-drawer :title="`${dataForm.courseName}成绩录入`" v-if="visible" :visible="visible"  :modal="false" :append-to-body="true" size="85%" @close="close">   
    <!-- <el-form class="t-form-block" ref="conditionForm" size="small" inline>      
      <el-form-item label="准考证号">
        <el-input v-model="conditionForm.candidateNo"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="type">
        <el-input v-model="conditionForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button size="small" type="primary" @click="queryList">成绩导入</el-button>
      <el-button size="small" type="primary" @click="queryList">下载</el-button>
    </div>       -->
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="candidateNo" sortable label="准考证号" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="160"></el-table-column>
      <el-table-column prop="tel" label="手机号" width="100" align="center"></el-table-column>
      <el-table-column prop="examinationPaperName" label="试卷名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="nationalExaminationResultsScore" label="国考成绩" width="100" align="center">
        <!-- <template slot="header" slot-scope="scope">
          <span>国考成绩({{achievementConstitute.NationalExamination}}%)</span>
        </template> -->
        <template slot-scope="scope">
          <span v-if="scope.row.examStudentInfoScore.examScoreState=='Submit'">
            {{scope.row.examStudentInfoScore.nationalExaminationResultsScore}}
          </span>
          <el-input v-else v-model="scope.row.examStudentInfoScore.nationalExaminationResultsScore" type="number" min="0" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="examinationPaperScore" label="试卷成绩" width="100" align="center">
        <!-- <template slot="header" slot-scope="scope">
          <span>试卷成绩({{achievementConstitute.Training}}%)</span>
        </template> -->
        <template slot-scope="scope">
          {{scope.row.examStudentInfoScore.examinationPaperScore}}
          <!-- <span v-if="scope.row.examStudentInfoScore.examScoreState=='Submit'">
            {{scope.row.examStudentInfoScore.examinationPaperScore}}
          </span>
          <el-input v-else v-model="scope.row.examStudentInfoScore.examinationPaperScore" type="number" min="0" size="mini"></el-input> -->
        </template>
      </el-table-column>
      <el-table-column prop="score" label="补考成绩" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.examStudentInfoScore.resitExaminationPaperScore}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="finalJudgementScore" label="期末总评" width="80">
        <template slot-scope="scope">
          {{scope.row.examStudentInfoScore.finalJudgementScore?scope.row.examStudentInfoScore.finalJudgementScore: ''}}
        </template>
      </el-table-column> -->
      <el-table-column prop="examCorrectRate" label="正确率" width="70" align="center">
        <template slot-scope="scope">
          {{parseInt(scope.row.examCorrectRate)}}%
        </template>
      </el-table-column>
      <el-table-column prop="examPaperStatusName" label="参考状态" width="100" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" width="150" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.examStudentInfoScore.remark" clearable size="mini" placeholder="请选择备注说明" :disabled="scope.row.examStudentInfoScore.examScoreState=='Submit'">
            <el-option v-for="(item,i) of remark" :key="i" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="评语" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.examStudentInfoScore.comment" size="mini" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" :readonly="scope.row.examStudentInfoScore.examScoreState=='Submit'"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="examScoreStateName" label="保存状态" width="80" align="center">
        <template slot-scope="scope">{{scope.row.examStudentInfoScore.examScoreStateName}}</template>
      </el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll ()">全选</el-checkbox>
    </div>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <div>
      <el-button size="small" @click="close">返 回</el-button>
      <el-button size="small" type="primary" @click="save">保 存</el-button>
      <el-button size="small" type="primary" @click="submit">提 交</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { getEtsGlobalSettingAll } from '@/server/resource-module'
import { getStudentPerformanceWithRecord, entryStudentScore, updateStudentScore, submitStudentScore } from '@/server/examination-module';
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
export default {
  props: ['dataForm', 'visible'],
  components: {pagination},
  data () {
    return {
      // ----------搜索
      conditionForm: {},
      // ----------成绩构成占比
      achievementConstitute: {},
      // ----------表格
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      remark: [
        {name: '缺考', type: 'Absent'},
        {name: '缓考', type: 'DelayedExam'},
        {name: '作弊', type: 'Plagiarize'},
        {name: '取消考试资格', type: 'Disqualification'},
        {name: '企业在岗学习', type: 'QiYeZaiGangXueXi'}
      ]
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this._getEtsGlobalSettingAll()
        this.initialData()
      }
    },
    tableData: {
      handler (newVal) {
        newVal.forEach(item => {
          if (item.examStudentInfoScore.nationalExaminationResultsScore < 0) {
            this.$set(item.examStudentInfoScore, 'nationalExaminationResultsScore', 0)
          }
          if (item.examinationPaperScore < 0) {
            this.$set(item.examStudentInfoScore, 'examinationPaperScore', 0)
          }
          let sum = (
            Number(item.examStudentInfoScore.nationalExaminationResultsScore) * Number(this.achievementConstitute.NationalExamination) +
            Number(item.examStudentInfoScore.examinationPaperScore) * Number(this.achievementConstitute.Training)
          ) / 100
          // 暂时取消期末总评成绩计算
          // this.$set(item.examStudentInfoScore,'finalJudgementScore',sum)
        })
      },
      deep: true
    }
  },
  methods: {
    /* -----------------------------------------------------------查询----------------------------------- */
		_getEtsGlobalSettingAll () { // 获取成绩构成占比数据
			getEtsGlobalSettingAll().then(result => {
				let newResult = []
				let newPermissions = []
        newResult = result.filter((group, i) => {
					if (group.name.indexOf('Ets.Score') > -1) {
						if (group.name.split('.').length === 2) { // 将name分割后长度为2的数据，存为一级元素
							let obj = Object.assign({}, group, {
								child: []
							})
							newPermissions.push(obj)
						}
						return group // 将name中含有'Ets.Score'的数据添加到新数组newResult中
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
        let arr=newPermissions[0].child
        this.achievementConstitute=JSON.parse(arr[0].currentValue);
			})
		},
    queryList() {
      this.initialData(this.SkipCount, this.pageSize);
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
    // 获取学生列表
    initialData(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        classId: this.dataForm.classId,
        courseId: this.dataForm.courseId,
        examinationArrangeId: this.dataForm.examinationArrangeId
      }
      getStudentPerformanceWithRecord(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
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
    /* -----------------------------------------------------------操作----------------------------------- */
    close () {
      this.$emit('update:visible', false)
      this.$emit('initialData');
    },
    save () {
      if (this.multipleSelection.length === 0) {
        this.$alert('请勾选要保存的学生数据！')
        return;
      }
      for(let i=0;i<this.multipleSelection.length;i++) {
        let item=this.multipleSelection[i]
        this.$set(item.examStudentInfoScore,'nationalExaminationPercentage',this.achievementConstitute.NationalExamination) // 国考成绩占比
        this.$set(item.examStudentInfoScore,'finalExamPercentage',this.achievementConstitute.Training) // 试卷成绩占比
        // if (!item.examStudentInfoScore.nationalExaminationResultsScore) {
        //   this.$alert('请输入国考成绩！')
        //   return;
        // }
        if (!item.examStudentInfoScore.examinationPaperScore) {
          this.$alert('请输入本次考试试卷成绩！')
          return;
        }
        let data=Object.assign({},item.examStudentInfoScore,{
          examPaperRecordId:item.id
        })
        if (item.examStudentInfoScore.examScoreState=='WaitSave') { // 第一次保存
          entryStudentScore(data).then(res => {
            this.$message.success('保存成功')
            this.queryList()
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })  
        }else if (item.examStudentInfoScore.examScoreState=='Save') { // 更新保存
          updateStudentScore(data).then(res => {
            this.$message.success('保存成功')
            this.queryList()
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })  
        }
      }
    },
    submit() {  // 提交
      if (this.multipleSelection.length === 0) {
        this.$alert('请勾选要提交的学生数据！')
        return;
      }        
      this.$confirm(`成绩一旦提交后就不能再进行更改，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
        type: 'warning'
      }).then(() => { 
        for(let i=0;i<this.multipleSelection.length;i++) {
          let item=this.multipleSelection[i]        
          if (item.examStudentInfoScore.examScoreState=='Save') { // 
            submitStudentScore(item.examStudentInfoScore.examResultsId).then(res => {
              this.$message.success('提交成功')
              this.queryList()
              this.close()
            }).catch(err => { 
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })  
          }
        }
      })    

    },
  }
}
</script>
<style lang="less" scoped>

</style>
