<template>
<el-dialog class="t-dialog" v-if="visible" :visible="visible" :title="`${dataForm.courseName?'【'+dataForm.courseName+'】-': ''}【${dataForm.name}】 人脸识别考勤记录`" :close-on-click-modal="false" width="800px" append-to-body  @close="close">
  <div class="block t-margin-bottom">
    <div class="radio">
      排序：
      <el-radio-group v-model="reverse">
        <el-radio :label="true">倒序</el-radio>
        <el-radio :label="false">正序</el-radio>
      </el-radio-group>
    </div>
  </div>
  <el-timeline :reverse="reverse">
    <el-timeline-item :timestamp="item.attendanceTime.replace(/T/,' ')" placement="top" v-for="(item,i) of tableData" :key="i" 
      v-infinite-scroll="load" infinite-scroll-disabled="disabled">
      <el-card>
        <div class="t-flex">
          <!-- <i class="fa fa-user-o" aria-hidden="true" style="display:block;font-size:40px;line-height:90px;color:#9595ff;"></i> -->
          <el-avatar shape="square" :size="90" :src="item.imageUrl"></el-avatar>
          <el-progress class="t-margin-left t-margin-right" type="circle" :percentage="parseInt(item.score)" :width="90" :stroke-width="4" show-text :format="format"></el-progress>
          <div v-if="item.status" class="attence-status">
            <i class="el-icon-success"></i>
            <span>核验成功</span>
          </div>
          <div v-else class="attence-status">
            <i class="el-icon-warning"></i>
            <span>核验失败</span>
          </div>
        </div>
      </el-card>
    </el-timeline-item>
  </el-timeline>
  <p v-if="loading" class="t-text-center">加载中...</p>
  <p v-if="noMore" class="t-text-center">没有更多了</p>
</el-dialog>
</template>
<script>
import { getFaceAttendanceRecordById,getLivingFaceAttendanceRecordById } from '@/server/online-module';
export default {
  props: ['dataForm', 'visible' , 'type'],
  components: {},
  data () {
    return {
      tableData: [],
      total:0,
      reverse:true,
      count: 0,
      loading: false
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.count=0;
        this.tableData= []
        if (this.dataForm.id) {
          this.initDataList();
        }
      }
    },
  },
  computed: {
    noMore () {
      return this.count > this.total
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
		/* ------------------------------- 查询 ------------------------------- */
    initDataList(SkipCount = this.count) {
      let data={
        SkipCount: SkipCount,
        MaxResultCount: 10,
        recordId: this.dataForm.id,
      }
      if (this.type=='learning') {
        getFaceAttendanceRecordById(data).then(result => {
          this.tableData=this.tableData.concat(result.items);
          this.total = result.totalCount
        })
      } else {
        this.$set(data,'checkInId',this.dataForm.id)
        delete data.recordId
        getLivingFaceAttendanceRecordById(data).then(result => {
          this.tableData=this.tableData.concat(result.items);
          this.total = result.totalCount
        })
      }
    },
		/* ------------------------------- 操作 ------------------------------- */
    load () {
      this.loading = true      
      setTimeout(() => {
        this.count += 10
        this.loading = false
        this.initDataList(this.count)
      }, 500)
    },
    format(percentage) {
      return `相似度 ${percentage}%`
    },
    close () {
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang="less" scoped>
.t-margin-left,
.t-margin-right{
  margin:0 20px;
}
.attence-status{
  height:90px;
  line-height:90px;
  .el-icon-success,
  .el-icon-warning{
    font-size:24px;
    color:#f00    
  }
  .el-icon-success{
    color: #0a0;
  }
}

</style>
