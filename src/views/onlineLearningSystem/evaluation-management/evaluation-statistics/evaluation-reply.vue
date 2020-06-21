<template>
<el-dialog class="t-dialog" title="回复评价" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
  <div style="display:flex;">
    <div class="t-avatar"><img src="https://img.yzcdn.cn/vant/cat.jpeg" /></div>
    <div class="t-content">
      <div class="t-evaluate-stuInfo">            
        <div style="width:100%;">
          <p class="t-p">{{dataForm.commentPersonName}}</p>
          <div class="t-evaluate-grade">
            <span style="padding-right:2rem;">{{new Date(dataForm.creationTime).toLocaleString()}}</span>
            <el-rate :value="dataForm.score" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled></el-rate>
          </div>
        </div>
      </div>
      <div class="t-evaluate-tag">
        <el-tag color="#fff" style="color:#000;border:1px solid #999;" v-show="list" v-for="(list,j) of dataForm.IndicatorList" :key="j">{{list}}</el-tag>
        <div class="t-evaluate-content">
          {{dataForm.content}}
        </div>
      </div>
      <div class="t-evaluate-Reply" v-show="dataForm.replyContent">
        {{dataForm.replyContent}}
      </div>
      <div v-if="dataForm.replyContent">
        <span>回复时间：{{new Date(item.replyTime).toLocaleString()}}</span>  
        <span>回复人：{{item.replyPersonName}}</span>  
      </div>
      <div><el-input type="textarea" v-model="replyContent" :rows='6'></el-input> </div>      
    </div>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">关 闭</el-button>
    <el-button type="primary" size="small" @click="save" >保 存</el-button>
  </div>
</el-dialog>
</template>
<script>
export default {
  props: ['visible','dataForm'],
  data() {
    return {
      form: {},
      replyContent: '',
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        // this.activeName='details'
        // this.id=this.dataForm.id;
        // if (this.id) {
        //   this._getAttendanceById();
        //   this.initDataList();
        // }
      }
    },
  },
  methods: {
    save () {
      if (!this.replyContent) {
        this.$alert('请输入回复内容！');
        return ;
      }
      this.$emit('save', this.dataForm.id,this.replyContent);
      this.close()
    },
    close () {
      this.$emit('update:visible', false)
    },
  }
  
}
</script>
<style lang="less" scoped>
// 评价列表
.t-avatar{
  margin-right:1rem;
  img{
    width:80px;
    height:80px;
    border-radius:6px;
  }
}
.t-p{
  margin:6px 0;
}
.t-content{
  max-width: 800px;
  width: 100%;
}
.t-evaluate-stuInfo{
  display: flex;
  .t-evaluate-grade{
    display: flex;
    // justify-content: space-between;
  }
}
.t-evaluate-content{
  line-height:1rem;
  margin:0.6rem 0;
}
.t-evaluate-Reply{
  line-height:1.3rem;
  background: #ffebf5;
  border:1px dashed #FF3399;
  color:#FF3399;
  padding:0.6rem;
  border-radius:6px;
}
/deep/.el-tag{
  margin-right:1rem;
}
.t-evaluate-tag{
  margin-top:6px;
}
</style>