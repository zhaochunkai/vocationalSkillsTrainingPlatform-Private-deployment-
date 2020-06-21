<template>
  <div>
    <!-- 到课率统计 -->
    <el-form :inline="true" :model="conditionForm" class="t-operate-filter" size="small">
      <el-form-item label="学习课程">
        <el-select v-model="conditionForm.courseId" placeholder="请选择学习课程">
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择考勤类型">
        <el-select v-model="conditionForm.attendance" placeholder="请选择考勤类型">
          <el-option label="直播到课率" value="live"></el-option>
          <el-option label="线下到课率" value="offline"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 到课率统计 -->
  </div>
</template>
<script>
import { GetLiveArrivalRateList, GetOfflineArrivalRateList } from '@/server/statistical-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  props: ['courseList'],
  components: { pagination },
  data () {
    return {
      conditionForm: {},
      tableData: [],
      total: 0,
      loading: false,
      loadText: '数据加载中...'
    }
  },
  methods: {
    // 线下到课率
    _GetLiveArrivalRateList (data) {
      GetLiveArrivalRateList(data)
        .then(result => {
          this.tableData = result.items
          this.total = result.totalCount
          this.loading = false
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    // 直播到课率
    _GetOfflineArrivalRateList (data) {
      GetOfflineArrivalRateList(data)
        .then(result => {
          this.tableData = result.items
          this.total = result.totalCount
          this.loading = false
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
    },
    // 获取个人考情记录列表
    queryList (SkipCount = 0, pageSize = this.pageSize) {
      if (!this.conditionForm.courseId) {
        this.$alert('请先选择课程！')
        return
      }
      if (!this.conditionForm.attendance) {
        this.$alert('请先选择考勤类型！')
        return
      }
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize
      }
      this.loading = true
      this.loadText = '数据加载中...'
      if (this.conditionForm.attendance === 'live') {
        this._GetLiveArrivalRateList(data)
      } else {
        this._GetOfflineArrivalRateList(data)
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
