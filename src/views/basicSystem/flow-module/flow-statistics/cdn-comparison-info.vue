<template>
<el-drawer v-if="visible" :visible="visible" :direction="direction" size="70%" :before-close="handleClose">
  <span slot="title">CDN流量说明</span>
  <el-tag type="danger" style="color:#f00;">CDN流量是在原有流量基础上，以CDN流量+CDN回源流量替代昂贵的外网下行流量，极大地降低访问成本</el-tag>
  <el-row type="flex" :gutter="30">
    <el-col :span="12">
      <el-card>
        <div slot="header" class="t-box-card-header">
          <span>基础流量策略（必须）</span>
        </div>
        <el-table class="t-table-list" stripe size="small" :data="FluxPayStrategy" tooltip-effect="dark" style="width: 100%;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="unitPrice" sortable label="单价(元)"></el-table-column>
          <el-table-column prop="count" label="流量(GB)"></el-table-column>
          <el-table-column prop="money" sortable label="总价(元)"></el-table-column>
	    	</el-table>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <div slot="header" class="t-box-card-header">
          <span>CDN流量策略（选用）</span>
        </div>
        <el-table class="t-table-list" stripe size="small" :data="CdnAllPayStrategy" tooltip-effect="dark" style="width: 100%;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="singePrice" sortable label="单价(元)"></el-table-column>
          <el-table-column prop="count" label="流量(GB)"></el-table-column>
          <el-table-column prop="totalPrice" sortable label="总价(元)"></el-table-column>
	    	</el-table>
      </el-card>
    </el-col>
  </el-row>
</el-drawer>
</template>
<script>
import { getFluxPayStrategy,getCdnAllPayStrategy } from '@/server/resource-module.js'
export default {
  props: ['dataForm', 'visible','title'],
  components: {},
  data () {
    return {
      height:400,
      direction: 'rtl',
      FluxPayStrategy: [], // 流量策略
      CdnAllPayStrategy: [], // CDN流量策略
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.height=document.body.clientHeight;
        this._getFluxPayStrategy();
        this._getCdnAllPayStrategy();
      }
    },
  },
  created() {

  },
  methods: {      
    /* -----------------------------------查询----------------------------------- */
		_getFluxPayStrategy() {  // 获取流量支付策略
			getFluxPayStrategy().then(result => {
				this.FluxPayStrategy=result
			})
    },
		_getCdnAllPayStrategy() {  // 获取CDN支付策略
			getCdnAllPayStrategy().then(result => {
				this.CdnAllPayStrategy=result
			})
    },
    /* -----------------------------------操作----------------------------------- */
    handleClose(done) { // 抽屉关闭    
      this.$emit('update:visible',false)
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog{
  max-height: 90vh;
  height:90vh;
}
/deep/.el-drawer__body{
  overflow: scroll;
  margin:0 10px;
}
</style>
