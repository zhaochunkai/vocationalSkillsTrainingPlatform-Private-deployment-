<template>
  <el-dialog class="t-dialog" :title="form.id?'编辑项目信息': '新增项目信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="110px" size="small">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="form.projectName"  :disabled="form.id?true:false"></el-input>
          </el-form-item>
          <el-form-item label="招生人数" prop="recruitStudentsNumbers">
            <div class="t-flex">
              <el-input v-model.number="form.recruitStudentsNumbers" type="number" :min="0"></el-input>
              <div class="t-margin-left"><el-checkbox v-model="form.limit">限制人数</el-checkbox></div>
            </div>
          </el-form-item>
          <el-form-item label="报名时间段" prop="recruitStudentsStartDate">
            <div class="t-flex">
              <el-date-picker v-model="form.recruitStudentsStartDate" type="date" placeholder="开始日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
              <div style="width:50px;" class="text-center"> ~ </div>
              <el-date-picker v-model="form.recruitStudentsStopDate" type="date" placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"> </el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="trainingProgramType" >
            <el-select v-model="form.trainingProgramType">
              <el-option v-for="(item,i) of dictionary.PXXMLX" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学习费用" prop="charge" >
            <el-input v-model.number="form.charge" :min="0" type="number">
              <el-button slot="append">元</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="institution">
            <el-input v-model="filterlabel" @focus="showTreeVisible">
              <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="学习说明" prop="description" >
            <Vue-editor v-model="form.description" :editorToolbar="customToolbar"></Vue-editor>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="state" v-show="form.id?true:false">
            <el-select v-model="form.state">
              <el-option v-for="(item,i) of dictionary.PXXMZT" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 人脸 -->
    <div class="t-header-title">
      <span>设置人脸考勤间隔时长</span>
    </div>
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="130px" size="small">
       <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="在线学习考勤间隔" prop="onlineFaceAttendanceCycle">
            <el-input v-model.number="form.onlineFaceAttendanceCycle" type="number" min="0" placeholder="请输入间隔时间">
              <el-button slot="append">分钟</el-button>
            </el-input>
            <el-tag>在线资源学习时进行人脸识别，0表示不启用</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="直播课堂考勤间隔" prop="liveFaceAttendanceCycle">
            <el-input v-model.number="form.liveFaceAttendanceCycle" type="number" min="0" placeholder="请输入间隔时间">
              <el-button slot="append">分钟</el-button>
            </el-input>
            <el-tag>直播授课时进行人脸识别，0表示不启用</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="save ('saveGoon')">保存并继续新增</el-button>
    </span>
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
import { VueEditor } from 'vue2-editor'
import { createTrainingPrograms, updateTrainingPrograms } from '@/server/training-module'
import treeCheckbox from '@/components/tree-checkbox.vue'
export default {
  props: ['dataForm', 'visible', 'dictionary'],
  components: {treeCheckbox, VueEditor},
  data () {
    return {
      customToolbar: [
        ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
        // ['blockquote', 'code-block'], // 引用，代码块
        [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
        [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
        // [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
        // [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
        // [{ 'direction': 'rtl' }], // 文本方向
        [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题
        [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
        // [{ 'font': [] }], // 字体
        // [{ 'align': [] }],    // 对齐方式
        [{'align': 'center'}, {'align': 'justify'}, {'align': 'right'}],
        // ['clean'] // 清除字体样式
        // ['image','video']    // 上传图片、上传视频
      ],
      filterlabel: '',
      item: {},
      form: {},
      rules: {
        projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        recruitStudentsNumbers: [{ required: true, message: '请输入招生人数', trigger: 'blur' }],
        recruitStudentsStartDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        recruitStudentsStopDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        trainingProgramType: [{ required: true, message: '请选择项目类型', trigger: 'blur' }],
        institution: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        charge: [{ required: true, message: '请输入费用名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入项目说明', trigger: 'blur' }],
        limit: [{ required: true, message: '请确认是否限制人数', trigger: 'blur' }]
      },
      pickerOptions: { // 大于当前的禁止
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() < _now - 24 * 3600 * 1000
        }
      },
      // 选择机构
      treeVisible: false,
      checkBoxLevel: '机构',
      currentNodeAll: [],
      currentNodeKeysAll: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.currentNodeKeysAll = []
        this.form = Object.assign({}, this.dataForm)
        if (!this.dataForm.id) {
          this.$set(this.form, 'description', `<h6>专业要求</h6><h6>岗位方向</h6><h6>学习要求</h6><h6>考试要求</h6><h6>就业情况</h6>`)
        }
        if (this.dataForm.institution) {
          this.currentNodeKeysAll.push(this.dataForm.institution)
          this.filterlabel = this.dataForm.institutionName
        }
        this.$set(this.form, 'onlineFaceAttendanceCycle', !this.form.onlineFaceAttendanceCycle ? 0 : parseInt(this.form.onlineFaceAttendanceCycle / 60))
        this.$set(this.form, 'liveFaceAttendanceCycle', !this.form.liveFaceAttendanceCycle ? 0 : parseInt(this.form.liveFaceAttendanceCycle / 60))
        this.$set(this.form, 'limit', false)
        this.dictionary.PXXMLX.forEach(element => {
          if (element.name === this.form.trainingProgramType) {
            this.$set(this.form, 'trainingProgramType', element.code)
          }
        })
        this.dictionary.PXXMZT.forEach(element => {
          if (element.name === this.form.trainingProgramType) {
            this.$set(this.form, 'state', element.code)
          }
        })
      }
    },
    'form.recruitStudentsNumbers' (newVal) {
      if (newVal < 0) {
        this.$set(this.form, 'recruitStudentsNumbers', 0)
      }
    },
    'form.charge' (newVal) {
      if (newVal < 0) {
        this.$set(this.form, 'charge', 0)
      }
    },
    'form.onlineFaceAttendanceCycle' (newVal) {
      if (newVal < 0) {
        this.$set(this.form, 'onlineFaceAttendanceCycle', 0)
      }
    },
    'form.liveFaceAttendanceCycle' (newVal) {
      if (newVal < 0) {
        this.$set(this.form, 'liveFaceAttendanceCycle', 0)
      }
    }
  },
  methods: {
    /* -------------------------------------- 选择机构 -------------------------------------- */
    showTreeVisible () {
      setTimeout(() => {
        this.$refs.CheckboxTree.checkNode()
      }, 500)
      this.treeVisible = true
    },
    handleclose () {
      this.treeVisible = false
    },
    getTransmitCheckedList (data) { // 拿到可勾选的数组件中的数据
      this.currentNodeAll = data
    },
    TreeSubmit () { // 点击确定的时候验证，并拿到id，lable，和选中的id集合
      this.currentNodeKeysAll = []
      if (this.currentNodeAll === 0) {
        this.$alert('还未选择任何机构哦！')
        return
      } else {
        this.currentNodeKeysAll.push(this.currentNodeAll[0].id)
        this.$set(this.form, 'institution', this.currentNodeAll[0].id) // 机构id
        this.filterlabel = this.currentNodeAll[0].label
        this.item = this.currentNodeAll[0]
      }
      this.treeVisible = false
    },
    /* -------------------------------------- 操作 -------------------------------------- */
    close () {
      this.$emit('update:visible', false)
    },
    handleClose () {
      this.treeVisible = false
    },
    clear () {
      this.form.institution = ''
      this.filterlabel = ''
    },
    save (type) {
      if (this.form.recruitStudentsNumbers < 0) {
        this.$message.warning('报名人数不能小于0')
        return
      }
      if (this.form.charge < 0) {
        this.$message.warning('金额不能小于0')
        return
      }
      if (this.form.recruitStudentsStartDate > this.form.recruitStudentsStopDate) {
        this.$message.warning('开始时间不能大于结束时间')
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        // 时间间隔单位秒
        this.$set(this.form, 'onlineFaceAttendanceCycle', this.form.onlineFaceAttendanceCycle * 60)
        this.$set(this.form, 'liveFaceAttendanceCycle', this.form.liveFaceAttendanceCycle * 60)
        if (this.form.id) {
          updateTrainingPrograms(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('updateList')
            if (type === 'saveGoon') {
              this.form = Object.assign({}, {
                description: `<h6>专业要求</h6><h6>岗位方向</h6><h6>学习要求</h6><h6>考试要求</h6><h6>就业情况</h6>`,
                limit: false,
                onlineFaceAttendanceCycle: 0,
                liveFaceAttendanceCycle: 0
              })
              this.filterlabel = ''
              this.currentNodeKeysAll = []
            } else {
              this.close()
            }
          }).catch(err => {
            this.$set(this.form, 'onlineFaceAttendanceCycle', this.form.onlineFaceAttendanceCycle / 60)
            this.$set(this.form, 'liveFaceAttendanceCycle', this.form.liveFaceAttendanceCycle / 60)
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createTrainingPrograms(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('updateList')
            if (type === 'saveGoon') {
              this.form = Object.assign({}, {
                description: `<h6>专业要求</h6><h6>岗位方向</h6><h6>学习要求</h6><h6>考试要求</h6><h6>就业情况</h6>`,
                limit: false,
                onlineFaceAttendanceCycle: 0,
                liveFaceAttendanceCycle: 0
              })
              this.filterlabel = ''
              this.currentNodeKeysAll = []
            } else {
              this.close()
            }
          }).catch(err => {
            this.$set(this.form, 'onlineFaceAttendanceCycle', this.form.onlineFaceAttendanceCycle / 60)
            this.$set(this.form, 'liveFaceAttendanceCycle', this.form.liveFaceAttendanceCycle / 60)
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
/deep/.el-form .el-form-item{
  max-width:100%;
}
.ql-editor{
  height:100px;
}
</style>
