<template>
<div>
  <!-- dataForm.isBeCommentator  false-评价者     true-被评者
    dataForm.evaluationType        评价者       ,  被评价者
    StudentEvaluationTeacher 学生评老师：1个班级，        1个老师
    TeacherEvaluationStudent 老师评学生：1个班级 ，       多个老师
    TeacherMutualEvaluation  老师评老师：多个老师-穿梭框， 1个老师
   -->
   <div class="t-margin-bottom">
    <el-tag v-if="this.dataForm.evaluationType !== 'TeacherMutualEvaluation'&& !dataForm.classId" type="warning" style="padding:0 30px;color:#f00;font-size:14px;">请在评价计划中选择班级！</el-tag>
    <el-tag v-if="!isMultiple" type="danger" style="padding:0 30px;color:#fff;background:#ff3f05;font-size:14px;">注意：只能选择一条数据！</el-tag>
    <el-tag v-else type="danger" style="padding:0 30px;color:#fff;background:#ff3f05;font-size:14px;">注意：支持多选！</el-tag>
   </div>
  <el-row :gutter="130">
    <el-col :span="12">
      <el-card>
        <div slot="header" class="t-box-card-header">
          <span>未分配列表</span>
        </div>
        <!-- 数据列表：班级|老师 -->
        <el-table class="t-table-list" ref="multipleTableNoDivid" stripe size="small" :data="commentatorData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChangeNoDivid">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="姓名" align="center"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="12" >
      <el-card>
        <div slot="header" class="t-box-card-header">
          <span>已分配列表</span>
        </div>
        <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="姓名" align="center"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <div><el-button class="divide" type="success" size="medium" @click="toRight">到右边 &gt;</el-button></div>
    <div><el-button class="Undivide" type="success" size="medium" @click="toLeft">&lt; 到左边</el-button></div>
  </el-row>
</div>
</template>
<script>
import { getEvaluationTeacherListByClassId, getEvaluationTeacherListByTpId } from '@/server/online-module'
export default {
  props: ['dataForm', 'commentatorData', 'commentatorChooseData'],
  data () {
    return {
      tips: '',
      isSelectAll: false,
      isMultiple: false,
      // 未分配数据
      multipleSelectionNoDivid: [], // 选中数据
      // 已分配数据
      tableData: [], // 教师|班级列表
      multipleSelection: []
    }
  },
  watch: {
    'commentatorChooseData' (newVal) {
      if (newVal) {
        this.tableData = []
        newVal.forEach(item => {
          let obj = {
            id: item.teacherId,
            name: item.name
          }
          this.tableData.push(obj)
        })
      }
    },
    'dataForm.evaluationType' (newVal) {
      if (newVal) {
        if (this.dataForm.evaluationType === 'TeacherEvaluationStudent') {
          this.isMultiple = true
        } else {
          this.isMultiple = false
        }
      }
    },
    'dataForm.trainingProgramsId' (newVal) {
      if (newVal) {
        if (!this.dataForm.id) {
          this.tableData = []
        }
        this.isSelectAll = false
        this.multipleSelection = []
      }
    },
    'dataForm.classId' (newVal) {
      if (newVal) {
        if (!this.dataForm.id) {
          this.tableData = []
        }
        this.isSelectAll = false
        this.multipleSelection = []
      }
    }
    // dataForm: {
    //   handler (newVal) {
    //     if (newVal) {
    //       /* if (this.dataForm.evaluationType === 'StudentEvaluationTeacher') {
    //         // 学生评老师 评价者默认为所选择的班级
    //         if (this.dataForm.isBeCommentator) {
    //           // 被评价者-老师： 根据 班级id（this.dataForm.classId）查看授课的教师列表 ，单选
    //         }
    //       } else if (this.dataForm.evaluationType === 'TeacherEvaluationStudent') {
    //         // 老师评学生 被考评者默认为所选的班级；评价者默认为所选择的班级
    //         if (!this.dataForm.isBeCommentator) {
    //           // 评价者-老师： 根据 班级id（this.dataForm.classId）查看授课的教师列表 ，多选
    //         }
    //       } else {
    //         // 教师互评
    //         if (this.dataForm.isBeCommentator) {
    //           // 被评价者-老师： 根据项目id（this.dataForm.trainingProgramsId）查看授课的教师列表 ，单选
    //           // this._getEvaluationNotPlanTeacherOrganizeInfo()
    //         } else {
    //           // 评价者：机构的所有老师
    //         }
    //       } */
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    /* ********************************************** 查询 ********************************************** */
    // 根据班级id 获取教师列表
    _getEvaluationTeacherListByClassId () {
      getEvaluationTeacherListByClassId(this.dataForm.classId).then(res => {
        this.commentatorData = res
      })
    },
    // 根据项目id 获取教师列表
    _getEvaluationTeacherListByTpId () {
      getEvaluationTeacherListByTpId(this.dataForm.trainingProgramsId).then(res => {
        this.commentatorData = res
      })
    },
    // 已分配数据-多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.isSelectAll = this.tableData.length === this.multipleSelection.length // 判断是否是全选
    },
    // 未分配数据-多选
    handleSelectionChangeNoDivid (val) {
      this.multipleSelectionNoDivid = val
      if (!this.isMultiple && this.multipleSelectionNoDivid.length > 1) {
        // 单选
        this.$refs.multipleTableNoDivid.toggleRowSelection(this.multipleSelectionNoDivid[0])
      } else {
        // 多选
        this.isSelectAll = this.commentatorData.length === this.multipleSelectionNoDivid.length // 判断是否是全选
      }
    },
    /* ********************************************** 操作 ********************************************** */
    // 分配
    toRight () {
      let add = JSON.parse(JSON.stringify(this.multipleSelectionNoDivid)) // 待新增的数据
      if (add.length === 0) {
        this.$message.warning(`请选择要分配的教师！`)
        return
      }
      if (!this.isMultiple || this.tableData.length === 0) { 
        // 单选 或 已分配中无数据时，可直接赋值
        this.tableData = add
      } else {
        let selectedIds = []
        this.tableData.forEach(el => {
          selectedIds.push(el.id)
        })
        add.forEach(item => {
          if (selectedIds.indexOf(item.id) === -1) {
            this.tableData.push(item)
          }
        })
      }
      this.tableData.forEach(el => {
        this.commentatorData.forEach((item, i) => {
          if (el.id === item.id) {
            this.commentatorData.splice(i, 1)
          }
        })
      })
      console.log('分配',this.tableData)
      this.$emit('getProfessional', this.tableData)
    },
    // 取消分配
    toLeft () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning(`请选择需要取消的教师！`)
        return
      }
      this.multipleSelection.forEach(item => {
        this.tableData.forEach((el, i) => {
          if (el.id === item.id) {
            this.tableData.splice(i, 1)
            this.commentatorData.unshift(item)
          }
        })
      })
      console.log('取消分配',this.tableData)
      this.$emit('getProfessional', this.tableData)
    }
  }
}
</script>
<style lang="less" scoped>
.Undivide,
.divide{
  position: absolute;
  top:20%;
  left:50%;
  margin-left:-48px;
}
.divide{
  margin-top:-40px;
}
.Undivide{
  margin-top:10px;
}
</style>
