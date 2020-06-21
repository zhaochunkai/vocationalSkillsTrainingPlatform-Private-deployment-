<template>
<el-card :style="style">
  <div slot="header" class="t-box-card-header">
    <span>角色权限设置</span>
  </div>
  <div>
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="savePermissions">保 存</el-button>
  </div>
  <div v-for="(group,i) in promissionGroups" :key="i">
    <div class="t-header-title">
      <span>{{group.displayName}}</span>
    </div>
    <div class="t-header-content">
      <el-row>
        <el-col v-for="(item,j) in group.newPermissions" :key="j">
          <el-form class="t-form-block" label-width="150px" size="small">
            <el-form-item :label="item.displayName" v-show="item.child.length!=0">
              <template>
                <div style="display:flex;">
                  <el-checkbox :indeterminate="item.isGranted" v-model="item.isGranted" @change="handleCheckAllChange(item)">全选</el-checkbox>
                  <span style="margin:0 20px;color:#999;font-size:10px;">|</span>
                  <el-checkbox-group v-model="item.checkedItems" @change="handleCheckedChange(item)">
                    <el-checkbox v-for="(list,j) of item.child" :key="j" :label="list.name" >{{list.displayName}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </template>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
  <div>
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="savePermissions">保 存</el-button>
  </div>
</el-card>
</template>
<script>
import {
  updateProfilePermission,
  getProfilePermission
} from '@/server/identity-module'
export default {
  name: 'roleListPermission',
  data () {
    return {
      style: '',
      providerKey: '',
      promissionGroups: []
    }
  },
  activated () {
    this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    this.providerKey = this.$route.query.name
    if (this.providerKey) {
      this._getProfilePermission()
    }
  },

  methods: {
    /* ------------------------- 操作-复选框选框 ------------------------- */
    handleCheckAllChange (item) {
      item.checkedItems = []
      for (let i = 0; i < item.child.length; i++) {
        item.child[i].isGranted = item.isGranted
        if (item.isGranted) {
          item.checkedItems.push(item.child[i].name)
        }
      }
    },
    handleCheckedChange (item) {
      item.isGranted = item.checkedItems.length === item.child.length
      let chekcs = item.checkedItems
      let name = chekcs.find(ele => {
        return ele.indexOf('ManagePermissions') !== -1 || ele.indexOf('Management') !== -1
      })
      if (!name) {
        item.child.forEach(element => {
          element.isGranted = false
        })
        item.checkedItems = []
      } else {
        item.child.forEach((ele, i) => {
          if (item.checkedItems.indexOf(ele.name) > -1) {
            ele.isGranted = true
          } else {
            ele.isGranted = false
          }
        })
      }
    },
    /* ------------------------- 查询-权限列表 ------------------------- */
    // 查询角色的所有权限
    _getProfilePermission () {
      getProfilePermission(this.providerKey).then(result => {
        this.promissionGroups = Object.assign([], result.groups)
        let groups = this.promissionGroups
        groups.forEach(group => {
          let newPermissions = []
          group.permissions.forEach(item => {
            // if (item.name.split('.').length==2) {
            if (item.parentName === null) { // 一级元素
              let obj = Object.assign({}, item, {child: [], checkedItems: []})
              newPermissions.push(obj)
            }
          })
          this.$set(group, 'newPermissions', newPermissions)
          group.newPermissions.forEach((item, i) => {
            let txt = item.name
            for (let i = 0; i < group.permissions.length; i++) {
              let arr = group.permissions
              // if (txt==arr[i].name.substr(0,arr[i].name.lastIndexOf('.')) && item.name!=arr[i].name) {
              if (txt === arr[i].parentName) { // parentName：一级元素的下一级-》二级
                item.child.push(arr[i])
                if (arr[i].isGranted) {
                  item.checkedItems.push(arr[i].name)
                }
              }
            }
            // for(let i=0;i<item.child.length;i++) { // 二级元素：将【查看】排序在第一位
            //   let ele=item.child[i]
            //   let lastName=ele.name.substr(ele.name.lastIndexOf('.')+1);
            //   if (lastName=='ManagePermissions' || lastName=='Management') {
            //     item.child.splice(i,1);
            //     item.child.unshift(ele);
            //     return;
            //   }
            //   item.child.unshift(ele);
            // }
          })
        })
      })
    },
    /* ------------------------- 查询-保存角色权限 ------------------------- */
    savePermissions () {
      let obj = {
        permissions: []
      }
      let newData = []
      this.promissionGroups.forEach(group => {
        group.newPermissions.forEach(item => {
          newData.push(item)
          item.child.forEach(ele => {
            newData.push(ele)
          })
        })
      })
      obj.permissions = newData
      updateProfilePermission(this.providerKey, obj).then(result => {
        this.$message.success('权限设置成功！')
      })
    },
    close () {
      this.$router.push({path: '/role/list'})
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item{
  max-width:100%;
}
</style>
