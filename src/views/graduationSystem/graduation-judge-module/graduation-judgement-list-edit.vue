<template>
<el-dialog class="t-dialog" v-if="visible" :title="dataForm.id?'编辑毕业判定条件': '新增毕业判定条件'" :visible="visible" :close-on-click-modal="false" width="630px" @close="close" >
  <!-- 毕业判定条件 -->
  <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">
    <el-form-item label="学年" prop="academicYearId">
      <el-select v-model="form.academicYearId" filterable clearable placeholder="请选择学年" :disabled="isDisabled">
        <el-option v-for="(item,i) of academicYearLists" :key="i" :label="item.academicYearName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学期" prop="semesterId" v-if="form.academicYearId">
      <el-select v-model="form.semesterId" filterable clearable placeholder="请选择学期" :disabled="isDisabled">
        <el-option v-for="(item,i) of semesterLists" :key="i" :label="item.semesterName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="学习项目" prop="trainingProgramId">
      <el-select v-model="form.trainingProgramId" filterable placeholder="可输入项目名称过滤"
        remote
        reserve-keyword
        :remote-method="_getTrainingProgramsPullDown"
      >
        <el-option v-for="(item,i) of programs" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="判定标准" prop="standard">
      <div v-for="(item,i) of standardList" :key="i" class="standard-list">
        <el-checkbox v-model="item.value">{{item.label}}</el-checkbox>
        <div v-if="item.type=='nationalExaminationPass' && item.value" class="input-div">
          <el-input v-model="item.num" type="number" size="mini" min="0">
            <el-button slot="append">分</el-button>
          </el-input>
        </div>
        <div v-if="item.type=='totalScoreNotBelow' && item.value" class="input-div">
          <el-input v-model="item.num" type="number" size="mini" min="0">
            <el-button slot="append">分</el-button>
          </el-input>
        </div>
        <div v-if="item.type=='attendance' && item.value" class="input-div">
          <el-input v-model="item.num" type="number" size="mini" min=0 max=100>
            <el-button slot="append">%</el-button>
          </el-input>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="达标要求">
      <el-radio-group v-model="requirement">
        <el-radio v-for="(item,i) of requirementList" :key="i" :label="item.name">{{item.name}} <el-tag style="margin:6px 0;color:#777;background-color:#fffbea;" size="medium">{{item.desc}}</el-tag></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="判定机构" prop="examinationPaperCount">
      <template slot="label">
        <span class="t-color-danger">* </span>判定机构
      </template>
      <el-input v-model="filterlabel" @focus="chooseUnit">
        <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
      </el-input>
      <el-tag style="margin:6px 0;color:#777;background-color:#fffbea;" size="medium">该机构下的成员，可进行毕业审批</el-tag>
      <el-dialog width="30%" title="选取机构" :visible.sync="UnitTreeVisible" append-to-body>
        <div class="t-header-title">
          <span>已选机构：{{filterlabel}}</span>
        </div>
        <el-button type="primary" @click="UnitTreeVisible = false">确 定</el-button>
        <el-tree :data="SchoolTree" ref="tree" node-key="id" :default-checked-keys="schoolDefault"  @node-click="haddleOrganizationNode" default-expand-all :expand-on-click-node="false" :render-content="renderContent"></el-tree>
      </el-dialog>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
  </div>
</el-dialog>
</template>
<script>
import { getSchoolTree, getSemesterSpinnerData } from '@/server/basic-module'
import { getTrainingProgramsPullDown } from '@/server/training-module'
import { createGraduationJudgement, updateGraduationJudgement, getGraduationJudgementById } from '@/server/graduation-module'
export default {
  props: ['visible', 'dataForm', 'academicYearLists'],
  data () {
    return {
      id: null,
      form: {},
      rules: {
        academicYearId: [{ required: true, message: '请选择学年', trigger: 'blur' }],
        semesterId: [{ required: true, message: '请选择学期', trigger: 'blur' }],
        trainingProgramId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
      },
      requirement: '任意一个标准达标',
      requirementList: [
        {type: 'Any', name: '任意一个标准达标', desc: '以上勾选的标准，任意一个达标即可（至少勾选2个标准）'},
        {type: 'All', name: '所有标准都要达标', desc: '以上勾选的标准，全部都要达标（至少勾选1个标准）'}
      ],
      standardList: [],
      programs: [],
      // --------学年学期----
      // academicYearLists: [],
      semesterLists: [],
      isDisabled: false,
      // --------机构----
      filterlabel: '',
      UnitTreeVisible: false,
      SchoolTree: [],
      institutionIds: [],
      schoolDefault: [],
      EnterpriseDefault: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.filterlabel = ''
        this.schoolDefault = []
        this.EnterpriseDefault = []
        this.isDisabled = false
        this._getSchoolTree()
        this.requirement = '任意一个标准达标'
        this.standardList = [
          {type: 'allCoursePass', label: '培训项目内的课程都必须及格', value: false},
          {type: 'nationalExaminationPass', label: '国考及格成绩', value: false},
          {type: 'totalScoreNotBelow', label: '培训项目内课程成绩总分不能低于', value: false, num: null},
          {type: 'allPaid', label: '培训费用已缴清', value: false},
          {type: 'learningTime', label: '每门课程实际学习时长达标', value: false},
          {type: 'attendance', label: '考勤出勤率达到', value: false, num: null},
          {type: 'graduationCertificate', label: '毕业要求证书上传并审批通过', value: false}
        ]
        this.form = Object.assign({}, this.dataForm)
        if (this.dataForm.id) {
          this._getGraduationJudgementById()
          this.isDisabled = true
        }
      }
    },
    'form.academicYearId' (newVal) {
      if (newVal) {
        if (!this.form.id) {
          this.$set(this.form, 'semesterId', null)
        }
        this._getSemesterSpinnerData()
      }
    },
    'form.semesterId' (newVal) {
      if (newVal) {
        if (!this.form.id) {
          this.$set(this.form, 'trainingProgramId', null)
        }
        this._getTrainingProgramsPullDown()
      }
    },
    standardList: {
      handler (newVal) {
        if (newVal) {
          newVal.forEach(item => {
            if (item.num < 0) {
              this.$set(item, 'num', 0)
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // -----------------------------------------查询-----------------------------------
    // 获取学年列表
    _getSemesterSpinnerData () {
      getSemesterSpinnerData(this.form.academicYearId).then(res => {
        this.semesterLists = res
      })
    },
    // 获取培训项目下拉列表
    _getTrainingProgramsPullDown (query) {
      let data = {
        name: query,
        status: '1,2,3',
        semesterId: this.form.semesterId
      }
      getTrainingProgramsPullDown(data).then(res => {
        this.programs = res
      })
    },
    // 获取学校信息树
    _getSchoolTree () {
      this.SchoolTree = []
      getSchoolTree().then(result => {
        this.SchoolTree.push(result)
      })
    },
    renderContent (h, { node, data, store }, trueOrFalse = true) { // 只有知识点节点，可选择
      // trueOrFalse=data.trueOrFalse || false
      trueOrFalse = node.checked || false
      return (
        <span class="custom-tree-node">
          <span v-show={(data.level !== '机构' && data.level !== '企业') || data.id === -1}>{node.label}</span>
          <span v-show={(data.level === '企业' && data.id !== -1) || data.level === '机构'}>
            <el-checkbox checked={trueOrFalse} v-model={trueOrFalse} style="margin-right:1rem;" on-change={(trueOrFalse) => this.changeOptions(data, trueOrFalse)}> {node.label}</el-checkbox>
          </span>
        </span>
      )
    },
    _getGraduationJudgementById () {
      getGraduationJudgementById(this.dataForm.id).then(result => {
        this.form = Object.assign({}, result)
        this.$set(this.form, 'semesterId', result.semesterId)
        this.requirement = result.requirement
        this.standardList.forEach(item => {
          for (let key in result.standard) {
            if (key === item.type) {
              if (key === 'totalScoreNotBelow' || key === 'nationalExaminationPass' || key === 'attendance') {
                if (result.standard[key] === false || result.standard[key] === -1) {
                  this.$set(item, 'value', false)
                  this.$set(item, 'num', null)
                } else {
                  item.value = true
                  this.$set(item, 'num', result.standard[key])
                }
              } else {
                this.$set(item, 'value', result.standard[key])
              }
            }
          }
        })
        this.institutionIds = result.competentAuthorityList
        this.schoolDefault = []
        this.EnterpriseDefault = []
        this.filterlabel = ''
        this.institutionIds.forEach(item => {
          // 将查询出来的机构设置为树上的默认值
          if (item.competentAuthorityType === 'School') {
            this.schoolDefault.push(item.id)
          } else {
            this.EnterpriseDefault.push(item.id)
          }
          item.trueOrFalse = true // 给选中数据增加属性 trueOrFalse。
          this.filterlabel += (item.name + ',') // 机构名称拼接为字符串
        })
      })
    },
    // ----------------------------------------操作-----------------------------------------    
    changeOptions (node, trueOrFalse) { // 复选框选择
      let type = node.level === '机构' ? 'School' : 'Enterprise'
      let obj = {
        trueOrFalse: trueOrFalse,
        id: node.id, // 机构id
        name: node.label,
        competentAuthorityType: type // 机构类型
      }
      let arr = JSON.parse(JSON.stringify(this.institutionIds)) // id集合
      let finds = arr.find((item, i) => {
        return item.id === obj.id && item.competentAuthorityType === obj.competentAuthorityType
      })
      arr.forEach((item, i) => {
        // 如果集合中存在知识点id，但是又没有被选择，则从集合中删除该数据
        if (item.id === obj.id && item.competentAuthorityType === obj.competentAuthorityType && !obj.trueOrFalse) {
          this.institutionIds.splice(i, 1)
        }
      })
      // 如果集合中不存在该知识点id，且被选中，则push
      if (!finds && obj.trueOrFalse) {
        this.institutionIds.push(obj)
      }
      this.filterlabel = ''
      this.institutionIds.forEach(item => {
        this.filterlabel += (item.name + ',')
      })
    },
    chooseUnit () {
      this.UnitTreeVisible = true
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      // console.log(node)
    },
    clear () { // 清空已选机构
      this.filterlabel = ''
      this.institutionIds = []
      this.schoolDefault = []
      this.EnterpriseDefault = []
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      let standard = {}
      let isChooseStandard = false
      let checkedLength = 0
      this.standardList.forEach(item => {
        if (item.type === 'totalScoreNotBelow' || item.type === 'nationalExaminationPass' || item.type === 'attendance') {
          if (item.value && item.num <= 0) {
            this.$alert('请输入大于0的数值')
            return
          }
          this.$set(standard, item.type, item.value ? item.num : -1)
        } else {
          this.$set(standard, item.type, item.value)
        }
        if (item.value) {
          isChooseStandard = true
          checkedLength += 1
        }
      })
      if (!isChooseStandard) {
        this.$alert('请选择至少一个判定标准！')
        return
      }
      console.log(this.requirement, checkedLength)
      if (this.requirement === '任意一个标准达标' && checkedLength < 2) {
        this.$alert('当选择为【任意一个标准达标】时，请选择至少二个判定标准！')
        return
      }
      if (this.institutionIds.length === 0) {
        this.$alert('请选择至少一个判定机构！')
        return
      }
      this.form = Object.assign(this.form, {
        standard: standard,
        competentAuthorityList: this.institutionIds,
        requirement: this.requirement
      })
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.dataForm.id) {
          updateGraduationJudgement(this.form).then(() => {
            this.$message.success('保存成功！')
            this.$emit('initialData')
            this.close()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createGraduationJudgement(this.form).then(() => {
            this.$message.success('保存成功！')
            this.$emit('initialData')
            this.close()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      })
    }
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
.standard-list{
  display: flex;
  .input-div{
    margin-left: 10px;
    width:100px;
  }
}
</style>