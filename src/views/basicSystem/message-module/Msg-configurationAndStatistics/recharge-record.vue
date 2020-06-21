<template>
  <div>
    <el-tag type="warning" style="display:block;color:#000;margin-bottom:10px;" effect="dark">
      <el-button style="margin-left:100px;" size="mini">短信充值</el-button>
    </el-tag>
    <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="classroomName" sortable label="充值时间"></el-table-column>
      <el-table-column prop="buildingId" label="充值金额"></el-table-column>
      <el-table-column prop="buildingId" label="充值条款"></el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </div>
</template>
<script>
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
export default {
  data () {
    return {
      pageSize,
      SkipCount: 0,
      total: 0,
      tableData: []
    }
  },
  components: {pagination},
  methods: {
    /* ------------------------------- 查询 ------------------------------- */
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    // 获取列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      // let data = {
      //   SkipCount: SkipCount,
      //   MaxResultCount: pageSize
      // }
      // getSiteList(data).then(result => {
      //     this.tableData = result.items
      //     this.total = result.totalCount;
      // })
    },
  }
}
</script>
