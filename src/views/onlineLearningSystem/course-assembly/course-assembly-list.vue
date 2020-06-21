<template>
  <div>
    <!-- 课程组装 -->
    <el-card :style="style">
      <div slot="header" class="t-box-card-header">
        <span>课程列表</span>
      </div>
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="课程名称">
          <el-input class="input-append" v-model="conditionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="conditionForm.UsageStatus">
            <el-option label="全部" value="All"></el-option>
            <el-option label="启用" value="Enable"></el-option>
            <el-option label="停用" value="Disable"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        class="t-table-list"
        ref="multipleTable"
        stripe
        size="small"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" sortable label="课程名称" align="center"></el-table-column>
        <el-table-column prop="code" label="课程代码" align="center"></el-table-column>
        <el-table-column prop="teachingWay" label="授课方式" align="center"></el-table-column>
        <el-table-column prop="usageStatus" label="状态" align="center">
          <template slot-scope="scope">{{scope.row.usageStatus=='Enable'?'启用': '停用'}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="260" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="assembly(scope.row)">课程组装</el-button>
            <el-button type="primary" size="mini" @click="preview(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="t-operate-footer">
        <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
      </div>
    </el-card>
    <!-- 新增/编辑 -->
    <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="saveData"></add-edit>
    <!--  预览 -->
    <knowledge-infomation :visible.sync="infomationVisible" :courseId="courseId" :title="title"></knowledge-infomation>
  </div>
</template>
<script>
import { getCourseList } from "@/server/basic-module";
import { pageSizes, pageSize } from "@/config.js";
import pagination from "@/components/pagination";
import addEdit from "./course-assembly-bind";
import knowledgeInfomation from "./course-knowledge-infomation";
export default {
  data () {
    return {
      style: '',
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0,
      conditionForm: {},
      tableData: [],
      // 课程组装
      addEditVisible: false,
      addEditForm: {},
      // 课程预览
      infomationVisible: false,
      title: "课程预览",
      courseId: ""
    };
  },
  components: { pagination, addEdit, knowledgeInfomation },
  activated() {
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`;
    this.initDataList();
  },
  methods: {
    /* 接收改变后每页多少条*/
    handleSize(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this.initDataList(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent(SkipCount, pageSize) {
      this.SkipCount = SkipCount;
      this.pageSize = pageSize;
      this.initDataList(SkipCount, pageSize);
    },
    queryList() {
      this.initDataList(this.SkipCount, this.pageSize);
    },
    // 获取课程列表，应该增加子库id绑定查询
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        name: this.conditionForm.name,
        usageStatus: this.conditionForm.usageStatus
      };
      getCourseList(data).then(result => {
        this.tableData = result.items;
        this.total = result.totalCount;
      });
    },
    saveData(row) {
      //
    },
    assembly(row) {
      this.addEditVisible = true
      // let courseId = row.id
      this.addEditForm = {
        courseId: row.id
      }
      // this.$router.push({
      //   path: "/courseassembly/list/bind",
      //   query: { courseId }
      // });
    },
    preview(row) {
      this.courseId = row.id;
      this.infomationVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.specialCol {
  background: #a5f373;
  /deep/.el-button {
    span {
      color: #00f;
    }
  }
}
</style>