<template>
<div
  v-loading="loading"
  element-loading-text="页面跳转中，请稍后"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(255, 255, 255, 0.6)" class="t-main">
...sdf sd
</div>
</template>
<script>
export default {
  data () {
    return {
      loading:true,
    }
  },
  created () {
    this.loading = true
    localStorage.removeItem('Authorization')
    
    let defineNames = [
      {name: 'parameter1',type: 'Authorization'},
      {name: 'parameter2',type: 'TenancyId'}
    ]
    let isPush = true
    let queryString = window.location.href.split('?')
    if (queryString[1]) {
      let queryData =  queryString[1].split('&')
      queryData.forEach(item => {
        let parameters = item.split('=')
        
        defineNames.forEach(el => {
          isPush = true
          if (el.name == 'parameter1' && el.name == parameters[0]) {
            localStorage.setItem(el.type, decodeURIComponent(parameters[1])) 
          }else if (el.name == 'parameter2' && el.name == parameters[0]) {
            sessionStorage.setItem(el.type, parameters[1])
          } else {
            isPush = false
          }
        }) 
      })
    }    
    if (isPush) {
      setTimeout(() => {
        this.loading =false
        this.$router.push({ name: 'data-list-item' })
      },1000)
    }
  }
}
</script>
<style lang="less" scoped>
.t-main{
  width:100%;
  height:100%;
  /deep/.el-loading-text{
    font-size:16px;
  }
}
</style>