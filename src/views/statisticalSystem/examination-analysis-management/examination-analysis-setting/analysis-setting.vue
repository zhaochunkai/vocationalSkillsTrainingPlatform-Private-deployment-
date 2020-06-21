
<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <el-card :style="style" v-show="JSON.stringify(nodeSelect) != '{}'&& nodeSelect.id!=-1">
        <div slot="header" class="t-box-card-header">
          <span>【{{nodeSelect.label}}】分析设置</span>
        </div>
        <!-- 1. 设置可用分数段 -->
        <el-card>
          <div slot="header" class="t-box-card-header">
            <span>1.设置可用分数段</span>
          </div>
          <el-form :model="form" ref="form" label-width="140px" :rules="rules" size="small">
            <el-col :span="12">
              <el-form-item prop="passAverageScore" label="平均及格分数基数">
                <el-input v-model.number="form.passAverageScore"></el-input>
              </el-form-item>
              <el-form-item :rules="{type: 'number', message: '分数必须为数字值', trigger: 'blur'}" label="单科分数段设置">
                <div v-for="(domain, i) in form.courseSettingList" :key="i">
                  <div style="display:flex;margin-bottom:4px;">
                    <el-input v-model.number="domain.min" class="t-margin-right"></el-input>
                    <span class="t-margin-right">~</span>
                    <el-input v-model.number="domain.max" class="t-margin-right"></el-input>
                    <el-button @click.prevent="removeDomain(domain)" icon="el-icon-minus" circle></el-button>
                    <el-button type="success" @click="addDomain" icon="el-icon-plus" circle></el-button>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="excellentAverageScore" label="平均优秀分数基数">
                <el-input v-model.number="form.excellentAverageScore"></el-input>
              </el-form-item>
              <el-form-item :rules="{type: 'number', message: '分数必须为数字值', trigger: 'blur'}" label="总分分数段设置">
                <div v-for="(totalDomain, i) in form.totalScoreSetting" :key="i">
                  <div style="display:flex;margin-bottom:4px;">
                    <el-input v-model.number="totalDomain.min" class="t-margin-right"></el-input>
                    <span class="t-margin-right">~</span>
                    <el-input v-model.number="totalDomain.max" class="t-margin-right"></el-input>
                    <el-button @click.prevent="removeTotalDomain(totalDomain)" icon="el-icon-minus" circle></el-button>
                    <el-button type="success" @click="addTotalDomain" icon="el-icon-plus" circle></el-button>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-form>
          <div class="t-margin-top t-text-right">
            <el-button size="small" type="primary" @click="saveDomains('form')">确 定</el-button>
            <el-button size="small" @click="resetForm('form')">重 置</el-button>
          </div>
        </el-card>
        <!-- 2. 设置科目分数段 -->
        <el-card>
          <div slot="header" class="t-box-card-header">
            <span>2.设置科目分数段</span>
          </div>
          <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
            <el-table-column type="index" label="序号" width="48" align="center"></el-table-column>
            <el-table-column prop="courseName" sortable label="课程" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column label="单科分数段列表" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.scoreRangeList" v-for="(item,i) in scope.row.scoreRangeList" :key="i" >
                  <el-tag style="margin-right:5px;" closable :disable-transitions="false" @close="handleClose(scope.row.scoreRangeList,i)">{{item.min}}~{{item.max}}</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column  fixed="right" label="操作" width="130" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="setCourseScore(scope.row)">设置分数段</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="t-margin-top t-text-right">
            <el-button type="primary" size="small" @click="save">保 存</el-button>
          </div>
        </el-card>
      </el-card>
    </el-col>
  </el-row>
  <!-- 弹出层：新增/编辑报名信息 -->
  <choose-scores :tableData="UncourseSettingList" :courseId="courseId" :visible.sync="dialogTableVisible" @save="getCourseScore"></choose-scores>

</div>
</template>
<script>
import { getTrainingProgramsTree } from '@/server/basic-module'
import { SettingExamAnalysis, GetSettingExamAnalysis,UpdSettingExamAnalysis } from '@/server/statistical-module'
import { getTrainingProgramsBindCourse } from '@/server/training-module';
import pagination from '@/components/pagination'
import orgTree from '@/components/orgTree'
import chooseScores from './analysis-setting-chooseScores'
export default {
  components: {pagination, orgTree, chooseScores},
  data () {
    return {
      style: '',
      conditionForm: {},
      tpId: null, // 项目id
      courseList: [], // 课程列表
      tableData: [],
      // -------------树------------
      resourceTree: [],
      nodeSelect: {},
      // -------------检索------------
      form: {
        courseSettingList: [{
          min: '',
          max: ''
        }],
        totalScoreSetting: [{
          min: '',
          max: ''
        }]
      },
      rules: {
        passAverageScore: {type: 'number', message: '分数必须为数字值', trigger: 'blur'},
        excellentAverageScore: {type: 'number', message: '分数必须为数字值', trigger: 'blur'},
      },
      // ----
      courseSettingList: [], // 单科分数段列表
      dialogTableVisible: false,
      courseId: '',
      UncourseSettingList: [], // 未设置的单科分数段列表
      // ----
      isPut: false // 判断请求方法：false-POST,true-PUT
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this._getTrainingProgramsTree()
  },
  methods: {
    _getTrainingProgramsTree () {
      this.resourceTree = []
      getTrainingProgramsTree().then(result => {
        this.resourceTree.push(result)
      })
    },
    _getTrainingProgramsBindCourse () { // 根据项目id查询课程
      this.tableData = []
      getTrainingProgramsBindCourse(this.tpId).then(result => {
        result.forEach(item => {
          let obj = {
            courseId: item.id,
            courseName: item.label
          }
          this.tableData.push(obj)
        })
      }).then(() => {
        this._GetSettingExamAnalysis()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    _GetSettingExamAnalysis () {
      GetSettingExamAnalysis(this.tpId).then(result => {
        this.isPut = !result ? false : true // 判断请求方法：false-POST,true-PUT
        this.form = Object.assign({
          passAverageScore: result.passAverageScore,
          excellentAverageScore: result.excellentAverageScore
        })
        if (result.totalScoreSetting) {
          this.$set(this.form,'totalScoreSetting',result.totalScoreSetting)
        } else {
          this.$set(this.form,'totalScoreSetting',[{
            min: '',
            max: ''
          }])
        }
        let arr = []
        if (result.courseSettingList) {        
          let courseSettingList = result.courseSettingList
          courseSettingList.forEach(list => {
            list.scoreRangeList.forEach(el => {
              let res = arr.find(obj => {
                return obj.min === el.min && obj.max === el.max
              })
              if (!res) {
                arr.push(el)
              }
            })          
          })
          arr.sort((value1, value2) => { // 按照min的值顺序排序
            return value1.min - value2.min
          })
          this.$set(this.form, 'courseSettingList', arr)

          courseSettingList.forEach(item => { // 在表格中显示分数段
            this.tableData.forEach(el => {
              if (item.courseId === el.courseId) {
                this.$set(el, 'scoreRangeList', item.scoreRangeList)
              }
            })
          })

        } else {   
          this.$set(this.form,'courseSettingList',[{
            min: '',
            max: ''
          }])
        }
      })
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
    /* 选择的树节点 */
    haddleOrganizationNode (node) {
      this.nodeSelect = node
      if (node.id !== -1) {
        this.tpId = node.id
        this._getTrainingProgramsBindCourse() // 获取学习项目下的课程
      }
    },
    resetForm (formName) { // 重置分数段输入框
      this.$refs[formName].resetFields()
      this.$set(this.form, 'courseSettingList', [{
        min: '',
        max: ''
      }])
      this.$set(this.form,'totalScoreSetting',[{
        min: '',
        max: ''
      }])
    },
    removeDomain (item) { // 移除单科分数段输入框
      var index = this.form.courseSettingList.indexOf(item)
      if (index !== -1) {
        this.form.courseSettingList.splice(index, 1)
      }
    },
    removeTotalDomain (item) { // 移除总分分数段输入框
      var index = this.form.totalScoreSetting.indexOf(item)
      if (index !== -1) {
        this.form.totalScoreSetting.splice(index, 1)
      }
    },
    addDomain () { // 新增单科分数段输入框
      this.form.courseSettingList.push({
        min: '',
        max: ''
      })
    },
    addTotalDomain () { // 新增总分分数段输入框
      this.form.totalScoreSetting.push({
        min: '',
        max: ''
      })
    },
    saveDomains () { // 保存分数段
      this.courseSettingList = JSON.parse(JSON.stringify(this.form.courseSettingList))
    },
    setCourseScore (row) { // 设置课程的单科分数段
      this.dialogTableVisible = true
      this.courseId = row.courseId
      this.UncourseSettingList = JSON.parse(JSON.stringify(this.form.courseSettingList))
      if (row.scoreRangeList) {
        row.scoreRangeList.forEach(item => {
          this.UncourseSettingList.forEach((el, i) => {
            if (item.min === el.min && item.max === el.max) {
              this.UncourseSettingList.splice(i, 1)
            }
          })
        })
      }
    },
    handleClose (list, item) { // 删除课程的某分数段
      list.splice(item, 1)
    },
    getCourseScore (data, courseId) { // 获取设置的单科课程分数段
      this.tableData.forEach(item => {
        if (item.courseId === courseId) {
          if (item.scoreRangeList) {
            item.scoreRangeList.forEach(ele => {
              data.forEach((el, i) => {
                if (ele.min === el.min && ele.max === el.max) {
                  data.splice(i, 1)
                }
              })
            })
            item.scoreRangeList = item.scoreRangeList.concat(data)
          } else {
            this.$set(item, 'scoreRangeList', data)
          }
        }
      })
    },
    save () {
      let data = {
        passAverageScore: this.form.passAverageScore,
        excellentAverageScore: this.form.excellentAverageScore,
        totalScoreSetting: this.form.totalScoreSetting,
        courseSettingList: this.tableData
      }
      if (this.isPut) { // 判断请求方法：false-POST,true-PUT
        UpdSettingExamAnalysis(this.tpId, data).then(() => {
          this.$message.success('更新成功！')
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        SettingExamAnalysis(this.tpId, data).then(() => {
          this.$message.success('保存成功！')
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.t-header-title span{
  font-size:14px;
  width:300px;
  text-align:left;
  padding-left:10px;
  
}
</style>