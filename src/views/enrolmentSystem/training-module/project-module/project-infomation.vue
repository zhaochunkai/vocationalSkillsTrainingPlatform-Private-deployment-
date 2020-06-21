<template>
  <el-drawer
    title="学习项目详细信息"
    v-if="visible"
    :visible="visible"
    direction="rtl"
    :before-close="handleClose"
    size="80%"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="学习项目信息" name="project">
        <el-form class="t-operate-filter" :model="infoForm" size="small" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="项目名称">
                <div class="t-info-div">{{infoForm.projectName}}</div>
              </el-form-item>
              <el-form-item label="项目费用">
                <div class="t-info-div">{{infoForm.charge}}</div>
              </el-form-item>
              <el-form-item label="应修学分">
                <div class="t-info-div">{{infoForm.recruitStudentsNumbers}}</div>
              </el-form-item>
              <el-form-item label="招生开始时间">
                <div
                  class="t-info-div"
                >{{new Date(infoForm.recruitStudentsStartDate).toLocaleDateString()}}</div>
              </el-form-item>
              <el-form-item label="项目描述">
                <div class="t-textarea" v-html="infoForm.description"></div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目类型">
                <el-select v-model="infoForm.trainingProgramType" disabled>
                  <el-option
                    v-for="(item,i) of dictionary.PXXMLX"
                    :key="i"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="招生人数">
                <div class="t-info-div">{{infoForm.recruitStudentsNumbers}}</div>
              </el-form-item>
              <el-form-item label="所属组织">
                <div class="t-info-div">{{infoForm.institutionName}}</div>
              </el-form-item>
              <el-form-item label="招生结束时间">
                <div
                  class="t-info-div"
                >{{new Date(infoForm.recruitStudentsStopDate).toLocaleDateString()}}</div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="教学课程" name="course">
        <!-- 表格 -->
        <el-table
          class="t-table-list"
          ref="multipleTable"
          stripe
          size="small"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="label" label="课程名称" sortable></el-table-column>
          <el-table-column prop="credit" label="学分" sortable></el-table-column>
          <el-table-column prop="teacherName" label="主讲教师"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <!-- <div class="t-operate-footer">
          <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div> -->
      </el-tab-pane>
      <el-tab-pane label="学员" name="students">
        <student-list :activeName="activeName" :projectId="projectId" :program="infoForm"></student-list>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script>
import {
  getTrainingProgramsById,
  getTrainingProgramsBindCourse
} from '@/server/training-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import studentList from './student-list'
export default {
  props: ['visible', 'dataForm', 'dictionary'],
  components: { pagination, studentList },
  data () {
    return {
      pageSizes,
      pageSize,
      style: '',
      currentPage: 0,
      total: 0,
      isSelectAll: false,
      conditionForm: {},
      tableData: [],
      // tab切换
      activeName: 'project',
      form: {},
      projectId: '',
      infoForm: {}
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName = 'project'
        this.projectId = this.dataForm.id
        if (this.projectId) {
          this._getTrainingProgramsById()
          this._getTrainingProgramsBindCourse()
        }
      }
    }
  },
  created () {
    this.style = `max-height:${document.body.clientHeight}px;overflow:scroll;`
  },
  methods: {
    _getTrainingProgramsBindCourse () {
      this.tableData = []
      getTrainingProgramsBindCourse(this.projectId).then(result => {
        // 获取项目下绑定的课程
        this.tableData = result
      })
    },
    _getTrainingProgramsById () {
      // 获取项目详细信息
      getTrainingProgramsById(this.projectId).then(result => {
        this.infoForm = Object.assign({}, result)
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
      this.isSelectAll =
        this.tableData.length === this.multipleSelection.length
    },
    // tab切换
    handleClick (tab, event) {
    },
    handleClose (done) {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
  max-width: 100%;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  background: #eee;
}
/deep/.el-select {
  width: 100%;
}
.t-textarea {
  background: #eee;
  height: 128px;
  padding: 10px;
}
</style>
