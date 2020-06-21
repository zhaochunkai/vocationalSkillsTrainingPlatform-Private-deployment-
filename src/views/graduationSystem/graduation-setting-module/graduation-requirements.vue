
<template>
  <div>
    <!-- 毕业判定条件 -->
    <el-card :style="style">
      <!-- 查询 -->
      <el-form class="t-operate-filter" :model="form" size="small" inline>
        <el-form-item label="培训项目">
          <el-select v-model="form.Program" filterable>
            <el-option
              v-for="(item,i) of ProgramsList"
              :key="i"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop>
          <el-input v-model="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.Status" filterable>
            <el-option v-for="(item,i) of StatusList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="SearchFor">搜索</el-button>
        </el-form-item>
      </el-form>
      <!--毕业要求审批列表 -->
      <el-table
        class="t-table-list"
        ref="multipleTable"
        stripe
        size="small"
        :data="approvalList"
        tooltip-effect="dark"
        style="width: 100%;margin-top:10px;"
        v-loading="loading"
        :element-loading-text="loadText"
      >
        <!-- @selection-change="handleSelectionChange" -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column
          prop="studentName"
          sortable
          label="姓名"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="tel" label="电话" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
        <el-table-column
          prop="trainingProgramsName"
          label="培训项目"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="className" label="班级" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop label="提交时间" show-overflow-tooltip align="center">
          <template
            slot-scope="scope"
          >{{scope.row.submitTime==null?"":new Date(scope.row.submitTime).toLocaleDateString()}}</template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop label="审批时间" show-overflow-tooltip align="center">
          <template
            slot-scope="scope"
          >{{scope.row.processingTime==null?"":new Date(scope.row.processingTime).toLocaleDateString()}}</template>
        </el-table-column>
        <el-table-column prop="judgementStatus" label="状态" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="approvalComments" label="备注" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope" align="center">
            <el-button type="info" size="mini" disabled v-if="scope.row.judgementStatus=='已通过'">审批</el-button>
            <el-button type="primary" size="mini" @click="approval(scope.row)" v-else>审批</el-button>
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
      <!-- 审批 -->
      <approval-module :dataForm="editForm" :visible.sync="infoVisible"></approval-module>
    </el-card>
  </div>
</template>
<script>
//培训项目列表请求
import { getTrainingProgramsPullDown } from "@/server/training-module";
import pagination from "@/components/pagination";
import { pageSizes, pageSize } from "@/config.js";
import approvalModule from "./graduation-requirements-approval";
import {
  GetCertificatePageList,
  GraduationRequirementsList
} from "@/server/basic-module";
export default {
  //   components: {orgTree,pagination,addEdit,judgeInfo},
  components: { approvalModule, pagination },
  data() {
    return {
      loadText: "",
      loading: true,
      style: "",
      form: {
        name: "",
        tel: "",
        Status: 99
      },
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      infoVisible: false,
      editForm: {},
      ProgramsList: [], //项目名称下拉列表
      StatusList: [
        {
          name: "全部",
          id: 99
        },
        {
          name: "待审批",
          id: 0
        },
        {
          name: "已通过",
          id: 1
        },
        {
          name: "未通过",
          id: 2
        }
      ], //状态下拉列表
      approvalList: [] //毕业要求审批列表
    };
  },
  watch: {
    infoVisible(val) {
      if (!val) {
        this._GraduationRequirementsList();
      }
    },
    "form.Program"() {
      this._GraduationRequirementsList();
    }
  },
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this._getTrainingProgramsPullDown();
    this._GraduationRequirementsList();
  },
  methods: {
    /* --------------------------------------------查询--------------------------------------- */
    // 获取培训项目下拉列表
    _getTrainingProgramsPullDown(query) {
      let data = {
        name: query,
        status: "0,1,2,3,4"
      };
      getTrainingProgramsPullDown(data).then(res => {
        this.ProgramsList = res;
      });
    },
    // 获取毕业要求审批列表
    _GraduationRequirementsList(SkipCount = 0, MaxResultCount = 10) {
      if (this.form.Program == undefined) {
        this.loadText = "选择培训项目后，自动加载列表";
        return;
      }
      this.loadText = "加载中...";
      let data = {
        Name: this.form.name,
        Tel: this.form.tel,
        TrainingProgramsId: this.form.Program,
        Status: this.form.Status,
        SkipCount: SkipCount,
        MaxResultCount: MaxResultCount
      };
      GraduationRequirementsList(data).then(res => {
        this.loading = false;
        this.total = res.totalCount;
        this.approvalList = res.items;
      });
    },

    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GraduationRequirementsList(this.SkipCount, this.pageSize);
    },
    /*接收当前页数*/
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this._GraduationRequirementsList(this.SkipCount, this.pageSize);
    },
    // 搜索
    SearchFor() {
      this._GraduationRequirementsList(this.SkipCount, this.pageSize);
    },

    /* ------------------------------------ 操作按钮 -------------------------- */

    // 全选
    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach(row => {
    //       this.$refs.multipleTable.toggleRowSelection(row);
    //     })
    //   } else {
    //     this.$refs.multipleTable.clearSelection();
    //   }
    // },
    // selectAll() {
    //   this.$refs.multipleTable.toggleAllSelection();
    // },
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    //   // 判断是否是全选
    //   this.isSelectAll =
    //     this.tableData.length === this.multipleSelection.length;
    // },
    approval(row) {
      let data = row || {};
      this.editForm = data || {}; //主要用于传递审批意见
      this.infoVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
</style>