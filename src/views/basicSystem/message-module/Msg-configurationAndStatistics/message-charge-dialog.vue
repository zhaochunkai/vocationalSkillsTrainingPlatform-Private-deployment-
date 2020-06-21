<template>
<el-dialog class="t-dialog" title="短信充值套餐" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" @close="close">
  <el-row :gutter="20" style="margin-left:0;margin-right:0;">
    <el-col v-for="(item,i) of listData" :key="i" :span="6" style="margin-bottom:1rem;">
      <el-tooltip class="item" effect="dark" content="点击显示微信支付码" placement="top">
        <el-button class="card" @click="chooseCard(item)">
          <div class="t-text-center strategy-title">{{item.displayName}}</div>
          <div class="title-charge">{{item.amount}}条</div>
          <div class="content-charge">{{item.price}}元（{{(item.price/item.amount).toFixed(4)}}元/条）</div>
          <!-- <div class="t-text-center">{{item.description}}</div> -->
        </el-button>
      </el-tooltip>
    </el-col>
  </el-row>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">关 闭</el-button>
  </div>
  <!-- 微信二维码 -->
  <el-dialog width="30%" title="微信扫码支付，有效时间5分钟" :visible.sync="showCode" append-to-body>
    <div class="cutdown">
      <span>倒计时： </span>
      <span style="color:#f00" v-if="countDownTime">{{timeFormat(formatTime_min(countDownTime))}} 分 {{timeFormat(formatTime_second(countDownTime))}} 秒</span>
    </div>
    <div class="imgs" >
      <img width="240" :src="src">
    </div>
    <el-button class="refresh" v-if="tipShow" @click="wechatCode">
      二维码已失效<br>
      <span style="color:#00f">点我刷新</span>
    </el-button>
  </el-dialog>
</el-dialog>
</template>
<script>
import { getMsgPayStrategy, getMsgPayStrategyCode } from '@/server/message-module'
export default {
  name: 'chargeDialog',
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      id: '', // 选中的支持策略id
      listData: [], // 支付策略
      showCode: false,
      src: '', // 图片
      countDownTxt: '',
      tipShow: false,
      timer: null,
      countDownTime: null
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this._getMsgPayStrategy()
      }
    }
  },
  methods: {
    _getMsgPayStrategy () { // 获取支付策略
      const data = {
        SkipCount: 0,
        MaxResultCount: 200
      }
      getMsgPayStrategy(data).then(result => {
        this.listData = result.items
        this.total = result.totalCount
      })
    },
    timeFormat (param) {
      return param < 10 ? '0' + param : param
    },
    formatTime_min (time) { // 时间转换：时分秒
      return parseInt(time % (60 * 60 * 24) % 3600 / 60)
    },
    formatTime_second (time) { // 时间转换：时分秒
      return parseInt(time % (60 * 60 * 24) % 3600 % 60)
    },
    countDown (endTime) {
      this.timer = setInterval(() => {
        // 获取当前时间，同时得到活动结束时间数组
        let newTime = new Date().getTime()
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
          this.countDownTime = (endTime - newTime) / 1000
        } else { // 活动已结束，全部设置为'00'
          this.countDownTime = null
          clearInterval(this.timer)
          this.tipShow = true
        }
      }, 1000)
    },
    chooseCard (data) { // 选择套餐
      this.id = data.id
      this.wechatCode()
    },
    close () {
      clearInterval(this.timer)
      this.countDownTime = null
      this.timer = null
      this.$emit('save', this.dataForm.id)
      this.$emit('updateList')
      this.$emit('update:visible', false)
    },
    /* --------------------生成二维码-------------------- */
    wechatCode () {
      this.tipShow = false
      if (!this.id) {
        this.$message.warning('请选择充值套餐')
        return
      }
      getMsgPayStrategyCode(this.id).then(result => {
        this.src = result.image
        console.log(typeof this.src)
        let endTime = new Date().getTime() + 5 * 60 * 1000 // 二维码失效截止的毫秒数
        this.showCode = true
        if (this.countDownTime) return
        this.countDown(endTime)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.t-header-content{
  /deep/.el-form .el-form-item{
    max-width:100%;
  }
}
/deep/.el-form .el-form-item {
    max-width: 80%;
}
/deep/.el-card{
  border:1px solid #ddd;
  margin-left:30px;
}
// /deep/.el-radio__label{
//   display: inline-block;
// }
/deep/.el-radio--medium.is-bordered {
  width:100%;
  height:100%;
  padding-bottom:30px;
}
.strategy-title{
  font-weight: 600;
  font-size: 15px;
  color: #4290e6;
}
.card{
  width:100%;
  text-align:center;
  line-height:30px;
  padding-top:2rem;
  padding-bottom:2rem;
}

.title-charge{
  font-size: 1.3rem;
  color:#993;
  font-weight: 600;
}
.imgs{
  display:block;
  text-align:center;
  margin:30px auto;
  box-sizing: border-box;
  img{
    // border:1px solid #ddd;
  }
}
.cutdown{
  text-align:center;
  font-size:1.1rem;
}
.refresh{
  display:block;
  width:240px;
  height:240px;
  text-align:center;
  position: absolute;
  left:50%;
  top:50%;
  color:#f00;
  font-size:1.2rem;
  line-height:1.8rem;
  font-weight: 600;
  background: rgba(255,255,255,0.95);
  margin-left:-120px;
  margin-top:-90px;
}
</style>
