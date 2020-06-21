<template>
<div>
  <!-- 消费明细 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>消费明细</span>
    </div>
    <div class="dateGroup">
      <span style="line-height:30px;">统计时间：</span>
      <el-menu :default-active="EvaluationTimeTypeEnum" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="短息消费明细" name="messageCharges">
        短息消费明细
      </el-tab-pane>
      <el-tab-pane label="直播消费明细" name="livingCharges">
        直播消费明细
      </el-tab-pane>
    </el-tabs>

  </el-card>
</div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      style: '',
      activeName: 'messageCharges',
      EvaluationTimeTypeEnum: 'All', // 默认评价时间类型
      btns: [
        {type: 'All', name: '全部'},
        {type: 'Today', name: '今日'},
        {type: 'Yesterday', name: '昨日'},
        {type: 'Week', name: '本周'},
        {type: 'Month', name: '本月'},
        {type: 'CustomDate', name: '其他时间'}
      ]
    }
  },
  watch: {
    activeName (newVal) {
      if (newVal) {
        if (newVal === 'messageCharges') {
          // 短信消费明细
        } else {
          // 直播消费明细
        }        
      }
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.activeName = 'messageCharges'
  },
  methods: {
    /* ------------------------------------ 查询数据 -------------------------- */
    /* ------------------------------------ 操作按钮 -------------------------- */
    handleSelect (key, keyPath) {
      // console.log(key, keyPath);
      this.EvaluationTimeTypeEnum = key
      // this.initDataList();
    },
    handleClick (tab, event) {
      // console.log(tab, event);
    }
  }
}
</script>
<style lang="less" scoped>
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom-color: transparent;
  color: #303133;
  border-radius: 4px;
  background: #4593bf;
  color:#fff;
}
</style>
