
<template>
  <div>
    <!-- 毕业判定条件 -->
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>毕业判定条件</span>
      </div>
      <!-- 查询 -->
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="机构名称" prop>
          <el-input v-model="filterlabel" @focus="showTreeVisible">
            <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="学年" prop="AcademicYear">
          <el-select
            v-model="conditionForm.AcademicYearId"
            filterable
            clearable
            placeholder="请选择学年"
          >
            <el-option
              v-for="(item,i) of AcademicYearData"
              :key="i"
              :label="item.academicYearName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期" prop="SemesterId" v-if="conditionForm.AcademicYearId">
          <el-select v-model="conditionForm.SemesterId" filterable clearable>
            <el-option
              v-for="(item,i) of SemesterList"
              :key="i"
              :label="item.semesterName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习项目">
          <el-select
            v-model="conditionForm.TrainingProgramId"
            filterable
            placeholder="请选择培训中的学习项目"
            remote
            reserve-keyword
            :remote-method="_getTrainingProgramsPullDown"
          >
            <el-option v-for="(item,i) of programs" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 操作按钮 -->
      <div class="t-operate-buttons">
        <el-button type="primary" size="small" @click="edit()">新增</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        class="t-table-list"
        ref="multipleTable"
        stripe
        size="small"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-top:10px;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column
          prop="trainingProgram"
          label="培训项目"
          width="180"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span style="font-weight:600;color:#333;">{{scope.row.trainingProgram}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="academicYearName" label="学年" width="140" align="center"></el-table-column>
        <el-table-column prop="semesterName" label="学期" width="140" align="center"></el-table-column>
        <el-table-column
          prop="competentAuthorityNames"
          sortable
          label="毕业判定机构"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="standard" label="判定条件" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(item,i) of scope.row.standard.split(',')" :key="i">
              {{item}}
              <br />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="requirement"
          label="达标要求"
          width="130"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
            <!-- <el-button type="primary" size="mini" @click="privew(scope.row)">查看</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="t-operate-footer">
        <pagination
          ref="pagination"
          :total="total"
          @sizeChange="handleSize"
          @currentChange="handleCurrent"
        ></pagination>
      </div>
      <!-- 编辑毕业判定条件 -->
      <add-edit
        :dataForm="editForm"
        :academicYearLists="AcademicYearData"
        :visible.sync="addEditVisible"
        @initialData="initialData"
      ></add-edit>
      <!-- 查看毕业判定条件 -->
      <!-- <judge-info :dataForm="editForm" :visible.sync="infoVisible"></judge-info> -->
      <!-- 选择机构 -->
      <el-dialog
        title="请选择机构"
        :visible.sync="treeVisible"
        width="30%"
        append-to-body
        :before-close="handleClose"
      >
        <tree-checkbox
          ref="CheckboxTree"
          treeType="school"
          :isMultiple="false"
          :checkBoxLevel="checkBoxLevel"
          :currentNodeKeysAll="currentNodeKeysAll"
          @transmitCheckedList="getTransmitCheckedList"
        ></tree-checkbox>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="treeVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="TreeSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  getAcademicYearSpinnerData,
  getSemesterSpinnerData
} from '@/server/basic-module'
import { getTrainingProgramsPullDown } from '@/server/training-module'
import {
  getGraduationJudgement,
  deleteGraduationJudgementById
} from '@/server/graduation-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import addEdit from './graduation-judgement-list-edit'
// import judgeInfo from './graduation-judgement-infomation'
import treeCheckbox from '@/components/tree-checkbox.vue'
export default {
  components: { pagination, addEdit, treeCheckbox },
  data () {
    return {
      style: '',
      conditionForm: {},
      // -------------表格------------
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [],
      isSelectAll: false,
      multipleSelection: [],
      // -------------检索------------
      AcademicYearData: [],
      SemesterList: [],
      ExaminationType: [
        { name: '全部', type: 'All' },
        { name: '模拟考试', type: 'Simulation' },
        { name: '正式考试', type: 'Official' }
      ],
      programs: [],
      filterlabel: '',
      // -------------编辑------------
      editForm: {},
      addEditVisible: false,
      paperForm: {},
      paperVisible: false,
      // -----------查看-------------
      infoVisible: false,
      // 选择机构
      treeVisible: false,
      checkBoxLevel: '机构',
      currentNodeAll: [],
      currentNodeKeysAll: []
    };
  },
  watch: {
    'conditionForm.AcademicYearId' (newVal) {
      if (newVal) {
        this.$set(this.conditionForm, 'SemesterId', '')
        // 根据学年获取下属学期
        this._getSemesterSpinnerData()
      }
    },
    'conditionForm.SemesterId' (newVal) {
      if (newVal) {
        this.$set(this.conditionForm, 'TrainingProgramId', '')
        // 根据学期获取对应的项目列表
        this._getTrainingProgramsPullDown()
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
    this._getAcademicYearSpinnerData()
    this._getTrainingProgramsPullDown()
    this.initialData()
  },
  methods: {
    /* --------------------------------------------查询--------------------------------------- */
    // 获取学年下拉框数据
    _getAcademicYearSpinnerData () {
      getAcademicYearSpinnerData().then(result => {
        this.AcademicYearData = result
      })
    },
    // 根据学年获取下属学期
    _getSemesterSpinnerData () {
      getSemesterSpinnerData(this.conditionForm.AcademicYearId).then(result => {
        this.SemesterList = result
      })
    },
    // 获取培训项目下拉列表
    _getTrainingProgramsPullDown (query) {
      let data = {
        name: query,
        status: '0,1,2,3,4'
      }
      this.$set(data, 'semesterId', this.conditionForm.SemesterId)
      getTrainingProgramsPullDown(data).then(res => {
        this.programs = res
      })
    },
    /* *接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initialData(SkipCount, pageSize)
    },
    queryList () {
      this.initialData(this.SkipCount, this.pageSize)
    },
    // 获取试题列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      };
      if (this.conditionForm.orgId) {
        this.$set(data, 'CompetentAuthorityId', this.conditionForm.orgId)
      }
      if (this.conditionForm.TrainingProgramId) {
        this.$set(
          data,
          'TrainingProgramId',
          this.conditionForm.TrainingProgramId
        )
      }
      if (this.conditionForm.AcademicYearId && this.conditionForm.SemesterId) {
        this.$set(data, 'SemesterId', this.conditionForm.SemesterId)
      }
      getGraduationJudgement(data).then(result => {
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
      this.isSelectAll =
      this.tableData.length === this.multipleSelection.length
    },
    /* ------------------------------------ 操作按钮 -------------------------- */
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
    // 拿到可勾选的数组件中的数据
    getTransmitCheckedList (data) {
      this.currentNodeAll = data;
    },
    // 点击确定的时候验证，并拿到id，lable，和选中的id集合
    TreeSubmit () {
      this.currentNodeKeysAll = [];
      if (this.currentNodeAll === 0) {
        this.$alert('还未选择任何机构哦！')
        return
      } else {
        this.currentNodeKeysAll.push(this.currentNodeAll[0].id)
        this.$set(this.conditionForm, 'orgId', this.currentNodeAll[0].id) // 机构id
        this.filterlabel = this.currentNodeAll[0].label
        this.item = this.currentNodeAll[0]
      }
      this.treeVisible = false
    },
    // privew (data) {
    //   this.editForm = data || {}
    //   this.infoVisible = true
    // },
    clear () {
      // 清空已选机构
      this.conditionForm.orgId = ''
      this.filterlabel = ''
      this.currentNodeKeysAll = []
    },
    edit (row) {
      let data = row || {}
      // if (data) {
      //   this.$set(this.editForm,'id',data.id)
      // }
      this.editForm = data
      this.addEditVisible = true
    },
    del (row) {
      this.$confirm(
        `此操作将删除项目【${row.trainingProgram}】的毕业判定条件 ， 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      ).then(() => {
        deleteGraduationJudgementById(row.id)
          .then(() => {
            this.$message.success('删除成功！')
            this.$refs.pagination.currentPage = 1
            this.initialData()
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
      })
    },
    handleClose () {
      this.treeVisible = false
    }
  }
}
</script>
