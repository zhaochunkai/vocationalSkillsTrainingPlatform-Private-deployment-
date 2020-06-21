<template>
<el-dialog class="t-dialog" v-if="visible" title="抽取试卷" append-to-body :visible="visible" :close-on-click-modal="false" width="60%" @close="close" >
    <!-- 查询 -->
  <el-form :inline="true" size="small">
    <el-form-item label="试卷名称" prop="examinationPaperName">
      <el-input class="input-append" v-model="examinationPaperName" placeholder="请输入试卷名称"></el-input>	
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="queryList">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-tag type="danger" style="color:#f00;font-weight:600;">请在列表中选取本次考试中需要的试卷</el-tag>
    </el-form-item>
  </el-form>
  <div>
    <el-button type="warning" @click="choose" size="small">选 取</el-button>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list" ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;"  @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="examinationPaperName" sortable label="试卷名称" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.examinationPaperName}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="grossScore" label="总分"  width="100"></el-table-column>
    <el-table-column prop="examinationPaperTime" label="考试时长(分钟)"  width="120"></el-table-column>
    <el-table-column prop="examinationPaperCount" label="套数"  width="100"></el-table-column>
    <el-table-column prop="constructionExaminationWayName" label="组卷方式" width="100"></el-table-column>
    <el-table-column prop="personName" label="创建者" width="100"></el-table-column>
    <el-table-column prop="creationTime" label="创建时间" width="100">
      <template slot-scope="scope">
        {{new Date(scope.row.creationTime).toLocaleDateString()}}
      </template>
    </el-table-column>
    <el-table-column prop="courseName" label="课程名称" width="100"></el-table-column>
  </el-table>
  <!-- 全选 -->
  <div class="t-batch-operate">
    <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
  </div>			
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
  </div>
</el-dialog>  
</template>
<script>
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import { getExaminationPaperList } from '@/server/examination-module';
export default {
  props: ['visible','dataForm'],
  components: { pagination },
  data() {
    return {
      // -------------查询----------
      examinationPaperName: '',
      // -------------表格------------
      pageSizes,
      pageSize,
      total:0,
      tableData: [],
      isSelectAll:false,
      multipleSelection: [],
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.initialData();
      }
    },
  },
  methods: {
    // --------------------------------------------查询----------------------------------------------
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initialData(SkipCount, pageSize);
    },
    queryList() {  
      this.initialData();
    },
    // 获取试卷列表
    initialData(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ExaminationPaperName: this.examinationPaperName,
        CourseId: this.dataForm.courseId,
      }
      getExaminationPaperList(data).then(result => {
        result.items.forEach(item => {
          this.$set(item,'constructionExaminationPaperId',item.id);
          delete(item.id)
        })
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    // --------------------------------------------操作----------------------------------------------
    choose() {  
      this.$emit('save',this.multipleSelection,this.dataForm.courseId);
      this.close()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
        // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    close () {
      this.$emit('update:visible', false)
    },
  }

}
</script>
<style lang="less" scoped>

</style>