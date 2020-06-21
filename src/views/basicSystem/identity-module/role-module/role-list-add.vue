<template>
<el-dialog class="t-dialog" :title="form.id?'编辑角色信息': '新增角色信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" @close="close">
<!-- <el-drawer title="角色管理" :visible.sync="visible" direction="rtl" size="84%" :before-close="handleClose"> -->
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="角色信息" name="info">
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-bottom:20px" class="t-text-right">
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="primary" size="small" @click="saveInfo">保 存</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="批量添加用户" name="auth" v-if="id?true:false">
      <el-row :gutter="10">
        <el-col :span="6">
          <org-tree :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>
        </el-col>
        <el-col :span="18">
          <el-transfer  filterable :filter-method="filterMethod" filter-placeholder="请输入名称检索" v-model="value" :data="transferData" :props="alias" :titles="['未分配', '已分配']"></el-transfer>
        </el-col>
      </el-row>
      <div style="margin-bottom:20px;" class="t-text-right">
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="primary" size="small" @click="saveAuth">保 存</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
<!-- </el-drawer> -->
</el-dialog>
</template>
<script>
import orgTree from '@/components/orgTree.vue'
import treeTransfer from '@/components/tree-transfer'
import {
  getUserListByAttach,
  getIdentityUsersToRole,
  updateIdentityUsersToRole,
  updateIdentityRoles,
  createIdentityRoles
} from '@/server/identity-module'
import {
  getSchoolTree
} from '@/server/basic-module'
export default {
  name: 'roleListAdd',
  props: ['dataForm', 'visible'],
  data () {
    return {
      filterlabel: '',
      item: {},
      form: {},
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      activeName: 'info',
      // -------
      nodeId: '',
      nodeLevel: '',
      nodeName: '',
      // ---------
      userType: 'Faculty', // 用于判断用户类型是企业还是学校。默认学校用户
      title: '',
      alias: {key: 'id', label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      TreeData: [],
      transferData: [],
      value: [],
      filterMethod (query, item) {
        if (item.title) {
          item.name = item.title
        }
        return item.name.indexOf(query) > -1
      },
      // -------
      id: ''
    }
  },
  components: {orgTree, treeTransfer},
  watch: {
    visible (newVal) {
      if (newVal) {
        this.activeName = 'info'
        console.log(this.dataForm)
        if (this.dataForm.type === 'addUser') {
          this.activeName = 'auth'
        }
        this.form = Object.assign({}, this.dataForm)
        this.id = this.dataForm.id
        this._getTeachTreeData()
        if (this.id) {
          this._getIdentityUsersToRole()
        }
      }
    }
  },
  methods: {
    /* ----------------------------- 查询 ----------------------------- */
    // 用户--右侧数据列表--初始化
    _getIdentityUsersToRole () {
      this.value = []
      getIdentityUsersToRole(this.id).then(result => {
        let arr = result.items
        arr.forEach(item => {
          this.value.push(item.id)
        })
      })
    },
    // 获取用户列表，传递数据给穿梭框
    usersDataList () {
      this.transferData = []
      let data = {
        id: this.nodeId,
        type: this.userType
      }
      getUserListByAttach(data).then(result => {
        this.transferData = result
      })
    },
    // 用户树（学校）
    _getTeachTreeData () {
      this.TreeData = []
      getSchoolTree().then(result => {
        this.TreeData.push(result)
      })
    },
    /* ----------------------------- 操作 ----------------------------- */
    handleClick (tab, event) { // tab切换
      // console.log(tab, event);
    },
    handleClose (done) {
      this.$emit('changeVisibility', false)
    },
    close () {
      this.$emit('changeVisibility', false)
    },
    /* --------------------保存角色信息-------------------- */
    saveInfo () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateIdentityRoles(this.form)
            .then(result => {
              this.$message.success('角色名称保存成功')
              this.$emit('queryList')
              this.close()
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
        } else {
          createIdentityRoles(this.form)
            .then(result => {
              this.$message.success('角色名称保存成功')
              this.form = Object.assign({}, result)
              this.id = result.id
              this.$emit('queryList')
              this.activeName = 'auth'
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              })
            })
        }
      })
    },
    // 保存角色权限
    saveAuth () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        // 为角色批量添加用户
        updateIdentityUsersToRole(this.form.id, this.value).then(result => {
          this.$message.success('角色批量设置用户成功！')
          this.close()
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      })
    },
    /* 选择的树节点。根据树的不同，加载不同的数据 */
    haddleOrganizationNode (node) {
      this.nodeId = node.id
      this.nodeName = node.label
      this.nodeLevel = node.level
      if (this.nodeLevel === '企业') {
        this.userType = 'EnterpriseUser'
      }
      if (node.level !== null) {
        this.usersDataList()
      }
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
</style>
