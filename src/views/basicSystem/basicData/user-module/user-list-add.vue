<template>
<el-dialog class="t-dialog" :title="userForm.id?'编辑用户信息': '新增用户信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="50%" @close="close">
  <el-form class="t-form-block" ref="form" :model="form" :rules="form.id?rules2:rules" label-width="90px" size="small">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="工号" prop="employeeId">
          <el-input v-model="form.employeeId"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="登录账户" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-show="form.id?false:true">
          <el-input v-model="form.password"></el-input>
          <el-tag v-show="form.id?false:true">必须由数字、小写字母、大写字母和特殊符号构成，不能小于8位</el-tag>
        </el-form-item>
        <el-form-item label="角色" prop="roleNames">
          <el-input v-model="roleNamesString" @focus="showTransfer"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="在职状态" prop="currentWorkingStatus">
          <el-select v-model="form.currentWorkingStatus">
            <el-option v-for="(item,i) of dictionary.workingStatus" :key="i" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex">
            <el-option v-for="(item,i) of dictionary.sex" :key="i" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="identityType">
          <el-col :span="8">
            <el-select v-model="form.identityType">
              <el-option v-for="(item,i) of dictionary.SFZJLX" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <el-input v-model="form.identity"></el-input>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属机构" prop="attachedId">
          <el-input placeholder="请选择用户类型后，再输入机构名称过滤" v-model="filterlabel" @focus="showTreeVisible">
            <el-button slot="append" size="small" @click="clear">清空已选机构</el-button>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">保 存</el-button>
    <el-button type="primary" size="small" @click="save('saveGoon')" v-show="form.id?false:true">保存并继续新增</el-button>
  </div>
  <!-- 选择角色：模态框类型的穿梭框 dataList-所有角色，chooseValue-已分配的角色， -->
  <transfer :visible.sync="transferVisible" :dataList="transferData" :alias="alias" :chooseValue="chooseValue" @changeVisibility="transferHide" @saveTransfer="getTransferDate"></transfer>
  <!-- 选择机构 -->
  <el-dialog title="提示" :visible.sync="treeVisible" width="30%" append-to-body :before-close="handleClose">
    <tree-checkbox ref="CheckboxTree" treeType="school" :isMultiple="false" :checkBoxLevel="checkBoxLevel" :currentNodeKeysAll="currentNodeKeysAll" @transmitCheckedList="getTransmitCheckedList"></tree-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="treeVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="TreeSubmit">确 定</el-button>
    </span>
  </el-dialog>
</el-dialog>
</template>
<script>
import {
  getIdentityRoles,
  getIdentityUserById,
  createIdentityUser,
  updateIdentityUser,
  getIdentityUserRoles
} from '@/server/identity-module'
import {
  getDictionaryItems
} from '@/server/basic-module'
import orgTree from '@/components/orgTree.vue'
import transfer from '@/components/transfer.vue'
import treeCheckbox from '@/components/tree-checkbox.vue'
export default {
  props: ['userForm', 'visible'],
  components: {orgTree, transfer, treeCheckbox},
  data () {
    return {
      transferVisible: false,
      transferData: [],
      alias: {key: 'name', label: 'name'},
      chooseValue: [],
      filterlabel: '',
      item: {},
      form: {},
      rules: {
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        attachedId: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        employeeId: [
          { max: 50, message: '字符长度必须小于50', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,50}$/, message: '只能由50字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        identity: [{ max: 20, message: '字符长度必须小于20', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入登录用户名', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [
          { required: true, message: '密码必须包含数字，长度不能小于8位', trigger: 'blur' },
          { min: 8, message: '密码长度不得小于8位', trigger: 'blur' },
          { max: 32, message: '密码长度不得大于32位', trigger: 'blur' },
          { pattern: /^(?![^a-z]+$)(?![^A-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{8,32}$/, message: '请输入正确的密码', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { max: 16, message: '字符长度必须小于16', trigger: 'blur' },
          { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      rules2: {
        attachedId: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        employeeId: [
          { max: 50, message: '字符长度必须小于50', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z-_]{0,50}$/, message: '只能由50字以内的数字、字母、下划线或横线组成', trigger: 'blur' }
        ],
        identity: [{ max: 20, message: '字符长度必须小于20', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入登录用户名', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { max: 16, message: '字符长度必须小于16', trigger: 'blur' },
          { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[189])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
      },
      schoolListTree: [],
      enterpriseList: [],
      dicJudgeName: {
        workingStatus: 'JZGDQZT',
        sex: 'SEX',
        SFZJLX: 'SFZJLX'
      },
      dictionary: {},
      roleNamesString: '',
      id: '',
      // 选择机构
      treeVisible: false,
      checkBoxLevel: '机构',
      currentNodeAll: [],
      currentNodeKeysAll: []
    }
  },
  activated () {
    // 获取数据字典下拉数据-----------------------------
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.roleNamesString = ''
        this.filterlabel = ''
        this.chooseValue = []
        this._getIdentityRoles()
        if (this.userForm.id) {
          this._getIdentityUserById()
        } else {
          this.form = {}
          this.$set(this.form, 'identityUserType', 'Faculty')
        }
      }
    }
  },
  methods: {
    // 根据地址栏中的id查询详细数据
    _getIdentityUserById () {
      this.currentNodeKeysAll = []
      getIdentityUserById(this.userForm.id).then(result => {
        this.form = result
        this.filterlabel = this.form.attachedName
        this.currentNodeKeysAll.push(this.form.attachedId)
        // 查询用户角色列表
        getIdentityUserRoles(result).then(result => {
          this.chooseValue = []
          for (var item of result.items) {
            this.chooseValue.push(item.name)
          }
          this.roleNamesString = this.chooseValue.join()
        })
      })
    },
    showTransfer () { // 显示角色穿梭框
      this.transferVisible = true
    },
    transferHide (data) { // 隐藏穿梭框
      this.transferVisible = data
    },
    getTransferDate (data) { // 获得穿梭框的数据
      this.roleNamesString = data.join(',')
      this.form.roleNames = data
    },
    // 获取角色列表，传递数据给穿梭框
    _getIdentityRoles () {
      this.transferData = []
      getIdentityRoles().then(result => {
        this.transferData = result.items
      })
    },
    close () {
      this.$emit('update:visible', false)
    },
    clear () {
      this.form.attachedId = ''
      this.filterlabel = ''
    },
    save (type) {
      if (this.form.identityUserType === 'Faculty') {
        if (this.item.level !== '机构') {
          this.$message.warning('请选择正确的机构')
          return
        }
      } else {
        if (this.item.id === -1) {
          this.$message.warning('请选择正确的企业')
          return
        }
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        if (this.form.id) {
          updateIdentityUser(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('queryList')
            if (type === 'saveGoon') {
              this.form = {}
              this.filterlabel = ''
            } else {
              this.close()
            }
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else {
          createIdentityUser(this.form).then(result => {
            this.$message.success('保存成功')
            this.$emit('queryList')
            if (type === 'saveGoon') {
              this.form = {}
              this.filterlabel = ''
            } else {
              this.close()
            }
          }).catch(err => {
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      })
    },
    // --------------------------------------- 选择机构 -------------------------------
    showTreeVisible () {
      setTimeout(() => {
        this.$refs.CheckboxTree.checkNode()
      }, 500)
      this.treeVisible = true
    },
    handleclose () {
      this.treeVisible = false
    },
    getTransmitCheckedList (data) { // 拿到可勾选的数组件中的数据
      this.currentNodeAll = data
    },
    TreeSubmit () { // 点击确定的时候验证，并拿到id，lable，和选中的id集合
      this.currentNodeKeysAll = []
      if (this.currentNodeAll === 0) {
        this.$alert('还未选择任何机构哦！')
        return
      } else {
        this.currentNodeKeysAll.push(this.currentNodeAll[0].id)
        this.$set(this.form, 'attachedId', this.currentNodeAll[0].id) // 机构id
        this.filterlabel = this.currentNodeAll[0].label
        this.item = this.currentNodeAll[0]
      }
      this.treeVisible = false
    },
    handleClose () {
      this.treeVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item {
    max-width:600px;
}
</style>
