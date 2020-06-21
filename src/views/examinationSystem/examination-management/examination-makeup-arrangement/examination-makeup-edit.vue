<template>
<el-dialog class ="t-dialog" v-if="visible" :title ="form.id?'编辑补考安排': '新增补考安排'" :visible ="visible" :close-on-click-modal ="false" width ="80%" @close ="close" >
  <el-tabs v-model ="activeName" type ="card">
    <el-tab-pane label ="考试基本信息" name ="BasicInfo">
      <el-form class ="t-form-block" ref ="form" :model ="form" :rules ="rules" label-width ="120px" size ="small">
        <el-row :gutter ="20">
          <el-col :span ="12">
            <el-form-item label ="考试安排" prop ="examinationArrangeId">
              <el-select v-model ="form.examinationArrangeId" filterable clearable placeholder ="请选择考试安排" :disabled="form.id?true:false">
                <el-option v-for ="(item,i) of ExaminationArrangeList" :key ="i" :label ="item.examName" :value ="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label ="项目名称" prop ="trainingProgramId">
              <el-input v-model ="form.trainingProgramName" disabled placeholder ="选择考试安排后自动生成"></el-input>
            </el-form-item>
            <el-form-item label ="考试名称" prop ="examName">
              <el-input v-model ="form.examName"></el-input>
            </el-form-item>
            <el-form-item label="考试方式" prop="methodOfExamination">
              <el-radio-group v-model="form.methodOfExamination">
                <el-radio v-for="(item,i) of methodOfExamination" :key="i" :label="item.type">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span ="12">
            <el-form-item label ="默认学期">
              <el-input v-if="!form.id" v-model ="defaultSemester.semesterName" disabled ></el-input>
              <el-input v-else v-model ="form.academicYearSemesterName" disabled ></el-input>
            </el-form-item>
            <el-form-item label ="班级名称" prop ="classId">
              <el-input v-model ="form.className" disabled placeholder ="选择考试安排后自动生成"></el-input>
            </el-form-item>
            <el-form-item label="主管单位" prop="sponsorUnit">
              <el-input v-model="filterlabel" @focus="showTreeVisible">
                <el-button slot="append" size="small" @click="clear">清空已选单位</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label ="备注" prop ="remark">
              <el-input v-model ="form.remark" type ="textarea" :autosize="{minRows:2,maxRows:6}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <el-button size ="small" @click ="close">返 回</el-button>
        <el-button type ="primary" size ="small" @click ="save">保存</el-button>
        <el-button type ="primary" size ="small" @click ="next('ArrangePaper')">下一页</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label ="课程考安排" name ="ArrangePaper" v-if="showArrange">
      <!-- 分别对需要考试的课程学生设置试题 -->
      <course-setting :courseLists="courseLists" :dataForm="form" @next="next" @close="close" @save="save"></course-setting>
    </el-tab-pane>
  </el-tabs>
  <!-- 选择机构 -->
  <el-dialog title="请选择机构" :visible.sync="treeVisible" width="30%" append-to-body :before-close="handleClose">
    <tree-checkbox ref="CheckboxTree" treeType="school" :isMultiple="false" :checkBoxLevel="checkBoxLevel" :currentNodeKeysAll="currentNodeKeysAll" @transmitCheckedList="getTransmitCheckedList"></tree-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="treeVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="TreeSubmit">确 定</el-button>
    </span>
  </el-dialog>
</el-dialog>
</template>
<script>
import { getDefaultSemester } from '@/server/basic-module'
import { getNeedMakeupExaminationArrangeSpinner, getMakeupExaminationArrangeCourseSpinner, getSupplementaryArrangeById, createSupplementaryArrange, updateSupplementaryArrange } from '@/server/examination-module'
import orgTree from '@/components/orgTree.vue'
import treeCheckbox from '@/components/tree-checkbox.vue'
import treeTransfer from '@/components/tree-transfer-dialog'
import courseSetting from './examination-makeup-course-setting'
export default {
  props: ['visible', 'dataForm'],
  components: {orgTree, treeTransfer, courseSetting, treeCheckbox},
  data () {
    return {
      tabList: ['BasicInfo', 'Arrange'],
      activeName: 'BasicInfo',
      form: {},
      rules: {
        examinationArrangeId: { required: true, message: '请选择考试安排', trigger: 'blur' },
        examName: { required: true, message: '请输入考试名称', trigger: 'blur' },
        sponsorUnit: { required: true, message: '请选择主办单位', trigger: 'blur' }
      },
      methodOfExamination: [
        {name: '在线考试', type: 'Online'},
        {name: '离线考试', type: 'Offline '}
      ],
      defaultSemester: {}, // 默认学期
      courseLists: [], // 课程列表
      // --------选取机构---
      // 选择机构
      treeVisible: false,
      checkBoxLevel: '机构',
      currentNodeAll: [],
      currentNodeKeysAll: [],
      filterlabel: '', // 机构过滤
      // --------------------试卷设置-----
      showArrangePaper: false,
      transferData: [],
      // --------------------考场安排下拉数据----------
      ExaminationArrangeList: [],
      showArrange: false

    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.currentNodeKeysAll = []
        this.activeName = 'BasicInfo'
        this.form = Object.assign({}, this.dataForm)
        this.$set(this.form, 'methodOfExamination', 'Online')
        this.filterlabel = this.dataForm.sponsorUnit || ''
        this.showArrange = false
        if (this.dataForm.id) {
          this._getSupplementaryArrangeById()
          this.showArrange = true
        }
        this._getDefaultSemester() // 获取默认学期
        this._getNeedMakeupExaminationArrangeSpinner()
      }
    },
    'form.examinationArrangeId' (newVal) {
      if (newVal) {
        // 根据考试安排id，获取到项目id，班级id，需要补考的课程列表
        let obj = this.ExaminationArrangeList.find(item => {
          return newVal === item.id
        })
        if (!this.dataForm.id) {
          this.$set(this.form, 'trainingProgramId', obj.trainingProgramId)
          this.$set(this.form, 'trainingProgramName', obj.trainingProgramName)
          this.$set(this.form, 'classId', obj.classId)
          this.$set(this.form, 'className', obj.className)
        }
        this._getMakeupExaminationArrangeCourseSpinner()
        console.log('form.examinationArrangeId')
      }
    }
  },
  methods: {
    // -----------------------------------------查询-----------------------------------
    // 获取默认学期
    _getDefaultSemester () {
      getDefaultSemester().then(result => {
        this.defaultSemester = Object.assign({}, result)
      })
    },
    // 获取有考试未合格人员的考试安排下拉框
    _getNeedMakeupExaminationArrangeSpinner () {
      getNeedMakeupExaminationArrangeSpinner().then(result => {
        this.ExaminationArrangeList = result
      })
    },
    // 获取有考试未合格人员的考试安排的课程列表
    _getMakeupExaminationArrangeCourseSpinner () {
      getMakeupExaminationArrangeCourseSpinner(this.form.examinationArrangeId).then(res => {
        this.courseLists = res
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })
    },
    // 获取补考安排详情
    _getSupplementaryArrangeById () {
      getSupplementaryArrangeById(this.dataForm.id).then(result => {
        this.form = Object.assign({}, result)
        this.filterlabel = result.sponsorUnitName
        this.currentNodeKeysAll.push(result.sponsorUnit)
      })
    },

    // -----------------------------------------操作-----------------------------------
    // 显示机构树选择
    showTreeVisible () {
      setTimeout(() => {
        this.$refs.CheckboxTree.checkNode()
      }, 500)
      this.treeVisible = true
    },
    // 关闭机构树选择
    handleClose () {
      this.treeVisible = false
    },
    // 拿到可勾选的数组件中的数据
    getTransmitCheckedList (data) {
      this.currentNodeAll = data
    },
    // 点击确定的时候验证，并拿到id，lable，和选中的id集合
    TreeSubmit () {
      this.currentNodeKeysAll = []
      if (this.currentNodeAll === 0) {
        this.$alert('还未选择任何机构哦！')
        return
      } else {
        this.currentNodeKeysAll.push(this.currentNodeAll[0].id)
        this.$set(this.form, 'sponsorUnit', this.currentNodeAll[0].id) // 机构id
        this.filterlabel = this.currentNodeAll[0].label
        this.item = this.currentNodeAll[0]
      }
      this.treeVisible = false
    },
    clear () { // 清空已选机构
      this.form.sponsorUnit = ''
      this.filterlabel = ''
    },
    next (str) {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$alert('请完善信息！')
          this.showArrange = false
          return
        }
        this.activeName = str
        this.showArrange = true
      })
    },
    // 保存补考安排
    save (courseData) {
      let canSave = false
      this.$refs.form.validate((valid) => {
        if (valid) {
          canSave = true
        } else {
          this.$alert('请完善基本信息！')
        }
      })
      if (canSave) {
        if (!Array.isArray(courseData) || courseData.length === 0) {
          this.$alert('请设置课程考试安排')
          return
        } else {
          for (let i = 0; i < courseData.length; i++) {
            let item = courseData[i]
            if (new Date(item.examinationBeginTime) >= new Date(item.examinationEndTime)) {
              this.$alert(`${item.courseName}的考试开始时间必须小于考试结束时间`)
              return
            }
            if (!item.examinationBeginTime || !item.examinationEndTime) {
              this.$alert(`请设置【${item.courseName}】的考试时间`)
              return
            }
            if (!item.classRoomId || !item.constructionExaminationPaperId || !item.invigilatorTeacherId) {
              this.$alert(`请设置【${item.courseName}】的试卷或考试场地或监考老师！`)
              return
            }
          }
        }
        this.$set(this.form, 'supplementaryArrangeWithInfos', courseData)
        if (this.form.id) {
          updateSupplementaryArrange(this.form).then(result => {
            this.$message.success('保存成功')
            this.close()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          this.$set(this.form, 'semesterId', this.defaultSemester.id)
          this.$set(this.form, 'academicYear', this.defaultSemester.academicYearId)
          createSupplementaryArrange(this.form).then(result => {
            this.$set(this.form, 'id', result.id)
            this.$message.success('保存成功')
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
    },
    close () {
      this.$emit('queryList')
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang ="less" scoped>

</style>
