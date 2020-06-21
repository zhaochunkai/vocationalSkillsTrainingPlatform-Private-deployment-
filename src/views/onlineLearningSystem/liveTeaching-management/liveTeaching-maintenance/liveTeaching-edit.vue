<template>
  <el-dialog class="t-dialog" :title="dataForm.id?'编辑直播教室信息': '新增直播教室信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="80%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="140px" size="small">
      <el-form-item label="直播标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="直播类型" prop="liveRoomType">
        <el-radio-group v-model="form.liveRoomType">
          <!-- <el-radio label="Public">公开课</el-radio> -->
          <el-radio label="Professional">专业课</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学习项目" prop="trainingProgramId">
        <el-select
          v-model="form.trainingProgramId"
          filterable
          remote
          reserve-keyword
          :remote-method="_getTrainingProgramsPullDown"
          placeholder="请选择学习项目"
          :disabled="form.id?true: false"
        >
          <el-option v-for="(item,i) of programs" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学习课程" prop="courseId" v-if="form.trainingProgramId">
        <el-select v-model="form.courseId" filterable clearable placeholder="请选择项目后，再选择课程" :disabled="form.id?true: false">
          <el-option v-for="(item,i) of courseList" :key="i" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="直播讲师" prop="anchorId" >
        <el-input v-model="teacherName" @focus="chooseJKTeacher">
          <el-button slot="append" size="small" @click="clearJK">清空已选老师</el-button>
        </el-input>
        <tree-transfer :visible.sync="showTeachers" TreeType="user" title="选择直播教师" :alias="alias" :chooseValue="ZBTeacherIds" :isMultiple="false" @saveTransfer="getNewTransfer"></tree-transfer>
      </el-form-item>
      <el-form-item label="直播计划开始时间" prop="planStartTime">
        <el-date-picker size="mini" v-model="form.planStartTime" type="datetime" placeholder="开始时间" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
      </el-form-item>
      <el-form-item label="签到有效时长" prop="checkInValidPeriod">
        <el-input v-model.number="form.checkInValidPeriod" type="number" placeholder="请输入整数，范围1~30" min="1" max="30">
          <el-button slot="append">分钟</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="听课班级" prop="classIdList" >
        <el-input v-model="classNames" type="textarea" :placeholder="this.form.liveRoomType === 'Professional'?'请先选择直播类型和讲师': '请先选择直播类型'" :autosize="{ minRows: 1, maxRows: 3}" @focus="chooseClass" :disabled="!this.form.liveRoomType ||(!this.form.anchorId && this.form.liveRoomType === 'Professional')"></el-input>
        <el-tag style="color:#f00" type="danger" size="medium">说明：严禁发布包括反动、暴力、色情、违法及侵权内容的文件 、平台有义务配合有关部门将发布违规信息的用户信息保存，并保留因配合调查及冻结账户的权利。</el-tag>
      </el-form-item>
      <el-form-item label="直播简介" prop="description">
        <el-input  v-model="form.description" type="textarea" :autosize="{ minRows: 1, maxRows: 3}" maxlength="150" show-word-limit></el-input>
        <el-tag size="mini">字数不超过150个字</el-tag>
      </el-form-item>
      <el-form-item label="" prop="description">
        <el-checkbox v-model="checked">我已阅读</el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save" :disabled="!checked">保 存</el-button>
    </div>
    <!-- 选择上课的班级 -->
    <el-dialog width="70%" title="设置听课班级" :visible.sync="showClass" append-to-body>
      <el-tree v-if="form.liveRoomType === 'Public'" :data="TreeData" :render-content="renderContent" ref="tree" node-key="id" default-expand-all :expand-on-click-node="false"></el-tree>
      <div v-else>
        <el-button size="small" @click="showClass=false">关 闭</el-button>
        <el-button type=“primary” size="small" @click="saveClass">确 定</el-button>
        <!-- 表格 -->
        <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="班级名称"></el-table-column>
          <el-table-column prop="description" label="班级描述"></el-table-column>
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showClass=false">关 闭</el-button>
        <el-button type="primary" size="small" @click="saveClass">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { getIdentityUserList } from '@/server/identity-module'
import { getLiveRoomById, createLiveRoom, updateLiveRoomById } from '@/server/online-module'
import { getGradeTree } from '@/server/basic-module'
import { getTrainingProgramsPullDown, getTrainingProgramsBindCourse, getClassListByTeacher } from '@/server/training-module'
import treeTransfer from '@/components/tree-transfer-dialog'
import { pageSizes, pageSize } from '@/config.js'
export default {
  props: ['dataForm', 'visible', 'title'],
  components: {treeTransfer},
  data () {
    return {
      form: {},
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        liveRoomType: [{ required: true, message: '请选择直播类型', trigger: 'blur' }],
        anchorId: [{ required: true, message: '请选择直播老师', trigger: 'blur' }],
        trainingProgramId: [{ required: true, message: '请选择学习项目', trigger: 'blur' }],
        courseId: [{ required: true, message: '请选择课程', trigger: 'blur' }],
        planStartTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        description: [{ required: true, message: '请输入直播简介', trigger: 'blur' }],
        classIdList: [{ required: true, message: '请选择听课班级', trigger: 'blur' }],
        checkInValidPeriod: [{ required: true, message: '请输入1-30范围内的数值', trigger: 'blur' }]
      },
      pickerOptions: { // 大于当前的禁止
        disabledDate (time) {
          let _now = Date.now()
          return time.getTime() < _now - 24 * 3600 * 1000
        }
      },
      checked: false,
      classIdList: [], // 班级id集合
      programs: [], // 项目列表
      courseList: [], // 课程列表
      // -------------- 选择用户 -------------
      teacherName: '', // 监考老师姓名
      showTeachers: false, // 是否显示用户穿梭框
      ZBTeacherIds: [], // 已选择的老师
      userLists: [], // 获取所有用户列表
      alias: {key: 'id', label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      // ----------- 设置上课的班级 -----------
      showClass: false,
      TreeData: [], // 班级项目树
      trueOrFalse: false,
      chooseClassList: [], // 已选择的班级列表
      tableData: [], // 教师排课的班级列表
      pageSizes,
      pageSize,
      total: 0,
      isSelectAll: false,
      multipleSelection: [],
      classNames: '' // 班级名称
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this._getTrainingProgramsPullDown()
        this._getIdentityUserList()
        this.form = {}
        this.teacherName = ''
        this.classNames = ''
        this.checked = false
        this.$set(this.form, 'liveRoomType', 'Professional')
        if (this.dataForm.id) {
          this._getLiveRoomById()
        }
      }
    },
    'form.trainingProgramId' (newVal) {
      if (newVal) {
        this.chooseClassList = []
        if (!this.dataForm.id) {
          this.classNames = ''
          this.$set(this.form, 'classIdList', [])
          this.$set(this.form, 'courseId', '')
        }
        this._getTrainingProgramsBindCourse()
        if (this.form.anchorId && this.form.liveRoomType === 'Professional') {
          this._getClassListByTeacher()
        }
      }
    },
    'form.liveRoomType' (newVal) {
      if (newVal === 'Public') {
        this._getGradeTree()
      } else if (newVal === 'Professional' && this.form.anchorId) {
        this._getClassListByTeacher()
      }
    },
    'form.anchorId' (newVal) {
      if (newVal && this.form.liveRoomType === 'Professional') {
        this.chooseClassList = []
        if (!this.dataForm.id) {
          this.classNames = ''
        }
        this.$set(this.form, 'classIdList', [])
        this._getClassListByTeacher()
      }
    },
    'form.checkInValidPeriod' (newVal) {
      if (!newVal || newVal > 30 || newVal < 1) {
        this.$set(this.form, 'checkInValidPeriod', 30)
      }
    },
    showClass (newVal) {
      if (newVal) {
        let arr = []
        if (this.form.audiences) {
          this.form.audiences.forEach(item => {
            this.tableData.forEach(el => {
              if (item.id === el.id) {
                arr.push(el)
              }
            })
          })
          setTimeout(() => {
            if (this.$refs.multipleTable && arr.length > 0) {
              arr.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row, true)
              })
            }
          }, 2)
        }
      }
    }
  },
  methods: {
    /* ------------------------------------------  查询 ------------------------------------------ */
    _getLiveRoomById () {
      this.ZBTeacherIds = []
      getLiveRoomById(this.dataForm.id).then(result => {
        this.form = Object.assign({}, result)
        this.ZBTeacherIds.push(result.anchorId)
        this.teacherName = result.anchor
        this.classNames = ''
        this.checked = true
        let arr = []
        result.audiences.forEach(item => {
          this.classNames += item.name + ' '
          arr.push(item.id)
        })
        this.$set(this.form, 'classIdList', arr)
      })
    },
    _getGradeTree () {
      this.TreeData = []
      getGradeTree().then(result => {
        this.TreeData.push(result)
      })
    },
    // 获取培训项目下拉列表
    _getTrainingProgramsPullDown (query) {
      let data = {
        name: query,
        status: '3',
        semesterId: this.form.semesterId
      }
      getTrainingProgramsPullDown(data).then(res => {
        this.programs = res
      })
    },
    // 根据项目id查询课程
    _getTrainingProgramsBindCourse () {
      this.courseList = []
      getTrainingProgramsBindCourse(this.form.trainingProgramId).then(result => {
        this.courseList = result
      })
    },
    // 获取用户列表
    _getIdentityUserList (SkipCount = 0) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: 400
      }
      getIdentityUserList(data).then(result => {
        this.userLists = result.items
      })
    },
    // 只有知识点节点，可选择
    renderContent (h, { node, data, store }, trueOrFalse = true) {
      trueOrFalse = data.trueOrFalse || false
      return (
        <span class="custom-tree-node">
          <span v-show={data.level !== '班级'}>
            {node.label}
          </span>
          <span v-show={data.level === '班级'}>
            <el-checkbox checked={trueOrFalse} v-model={trueOrFalse} style="margin-right:1rem;" on-change={(trueOrFalse) => this.changeOptions(data, trueOrFalse)}> {node.label}</el-checkbox>
          </span>
        </span>
      )
    },
    // ----------------------------查询教师授课的班级列表
    _getClassListByTeacher () {
      let data = {
        teacherId: this.form.anchorId,
        tpId: this.form.trainingProgramId
      }
      getClassListByTeacher(data).then(result => {
        this.tableData = result.items
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
    /* ------------------------------------------  操作 ------------------------------------------ */
    chooseJKTeacher () {
      this.showTeachers = true
    },
    clearJK () { // 清空已选监考老师
      this.teacherName = ''
      this.ZBTeacherIds = []
      this.$set(this.form, 'anchorId', '')
    },
    getNewTransfer (ids, nodeName) { // 获取穿梭框中的最新数据
      this.$set(this.form, 'anchorId', ids[0])
      this.ZBTeacherIds = ids
      this.userLists.forEach(item => {
        if (ids.indexOf(item.id) !== -1) {
          this.teacherName = item.name + '（' + nodeName + '） '
        }
      })
    },
    chooseClass () {
      this.showClass = true
    },
    changeOptions (node, trueOrFalse) { // 复选框选择知识点
      let obj = {
        trueOrFalse: trueOrFalse,
        classId: node.id
      }
      let arr = JSON.parse(JSON.stringify(this.chooseClassList)) // 将知识点集合重赋值
      let finds = arr.find((item, i) => {
        return item.classId === obj.classId
      })
      arr.forEach((item, i) => {
        if (item.classId === obj.classId && !obj.trueOrFalse) { // 如果集合中存在知识点id，但是又没有被选择，则从集合中删除该数据
          this.chooseClassList.splice(i, 1)
        }
      })
      if (!finds && obj.trueOrFalse) { // 如果集合中不存在该知识点id，且被选中，则push
        this.chooseClassList.push(obj)
      }
    },
    saveClass () {
      this.classNames = ''
      if (this.form.liveRoomType === 'Public') {
        let arr = []
        this.chooseClassList.push(item => {
          arr.push(item.id)
          this.classNames += item.label + ' '
        })
        this.$set(this.form, 'classIdList', arr)
      } else {
        let arr2 = []
        this.multipleSelection.forEach(item => {
          arr2.push(item.id)
          this.classNames += item.name + ' '
        })
        this.$set(this.form, 'classIdList', arr2)
      }
      this.showClass = false
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      if (!this.form.classIdList || this.form.classIdList.length === 0) {
        this.$alert('请选择听课班级！')
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateLiveRoomById(this.form).then(result => {
            this.$message.success('更新成功')
            this.$emit('updateQuery')
            this.close()
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createLiveRoom(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('updateQuery')
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

.t-batch-operate{
  margin-bottom:10px;
}
</style>
