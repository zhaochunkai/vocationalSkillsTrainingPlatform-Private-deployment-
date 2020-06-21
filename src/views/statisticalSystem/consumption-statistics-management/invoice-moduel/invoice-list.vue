<template>
<div>
  <!-- 发票管理 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>发票管理</span>
    </div>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="t-text-center">
            <h4>可索取发票金额</h4>
            <p>￥0.00</p>
            <el-button type="danger">索取发票</el-button>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="t-text-center">
            <h4>发票信息</h4>
            <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">
              <el-form-item label="默认抬头" prop="code">
                <el-input v-model="form.code"  :disabled="form.id?true:false"></el-input>
              </el-form-item>
              <el-form-item label="税号" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="开具类型" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-button style="width:50%" size="small" type="primary">保存</el-button>
            </el-form>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="t-text-center">
            <h4>默认寄送地址</h4>
            <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
              <el-form-item label="收件人" prop="code">
                <el-input v-model="form.code"  :disabled="form.id?true:false"></el-input>
              </el-form-item>
              <el-form-item label="详细地址" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="邮政编码" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <div class="t-header-title">
      <span>开票历史</span>
    </div>
    <!-- 查询 -->
    <el-form class="t-operate-filter t-margin-top" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="发票申请时间">
        <el-date-picker v-model="conditionForm.startTime" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="~">
        <el-date-picker v-model="conditionForm.establishTime" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width:100%;" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="examName" sortable label="申请时间" align="center"></el-table-column>
      <el-table-column label="开票类型" align="center"></el-table-column>
      <el-table-column prop="examinationTypeName" label="发票抬头" align="center"></el-table-column>
      <el-table-column prop="methodOfExaminationName" label="发票总额" align="center"></el-table-column>
      <el-table-column prop="sponsorUnitName" label="发票备注" align="center"></el-table-column>
      <el-table-column prop="sponsorUnitName" label="发票性质" align="center"></el-table-column>
      <el-table-column prop="sponsorUnitName" label="开票状态" align="center"></el-table-column>
      <el-table-column  fixed="right" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="viewDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <!-- 开票详情 -->
    <invoice-details :dataForm="editForm" :visible.sync="detailsVisible"></invoice-details>
  </el-card>
</div>
</template>
<script>
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import invoiceDetails from './invoice-list-details'
export default {
  components: {pagination, invoiceDetails},
  data () {
    return {
      style: '',
      // ----发票信息
      form: {},
      rules: {
        code: [
          { required: true, message: '请输入课程代码', trigger: 'blur' },
          { max: 20, message: '字符长度必须小于20', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { max: 100, message: '字符长度必须小于100', trigger: 'blur' }
        ]
      },
      // 查询条件
      conditionForm: {},
      // 表格
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: [
        {id: 1}
      ],
      isSelectAll: false,
      multipleSelection: [],
      // 详情
      editForm: {},
      detailsVisible: false
    }
  },
  watch: {
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
  },
  methods: {
    /* ------------------------------------ 查询数据 -------------------------- */
    queryList () {
      //
    },
    // 获取已经生成了考务信息的正式考试安排列表
    initialData (SkipCount = 0, pageSize = this.pageSize) {
      // let data = {
      //   SkipCount: SkipCount,
      //   MaxResultCount: pageSize,
      //   ExamName: this.conditionForm.ExamName
      // }
      // if (this.conditionForm.AcademicYearId) {
      //   this.$set(data, 'AcademicYearId', this.conditionForm.AcademicYearId)
      // }
      // if (this.conditionForm.SemesterId) {
      //   this.$set(data, 'SemesterId', this.conditionForm.SemesterId)
      // }
      // getExaminationArrangeListsHasArrangeInfo(data).then(result => {
      //   this.tableData = result.items
      //   this.total = result.totalCount
      // })
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
    /* ------------------------------------ 操作按钮 -------------------------- */
    // 查看开票详情
    viewDetails (row) {
      this.editForm = row
      this.detailsVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-card__body {
    padding: 10px;
}
</style>
