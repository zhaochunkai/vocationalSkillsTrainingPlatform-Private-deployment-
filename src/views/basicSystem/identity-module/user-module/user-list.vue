<template>
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>用户管理</span>
    </div>
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
      <el-form-item label="登录账号">
        <el-input class="input-append" v-model="conditionForm.UserName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <div class="t-operate-buttons">
      <!-- <el-button type="primary" size="mini">导入</el-button> -->
      <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
      <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button> -->
      <!-- <el-button type="primary" size="mini">锁定账户</el-button>
      <el-button type="primary" size="mini">解除锁定</el-button>-->
    </div>
    <!-- 表格 -->
    <el-table
      class="t-table-list"
      ref="multipleTable"
      stripe
      size="small"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top:10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="userName" sortable label="登录账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="attachedName" label="所属组织"></el-table-column>
      <el-table-column prop="phoneNumber" label="联系电话"></el-table-column>
      <el-table-column prop="lockoutEnd" label="用户状态" width="90">
        <template
          slot-scope="scope"
        >{{!scope.row.lockoutEnd || new Date(scope.row.lockoutEnd) < new Date() ?'未锁定': '已锁定'}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="userRoles(scope.row)">查看用户角色</el-button>
          <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          <el-button
            type="text"
            size="small"
            @click="locked(scope.row)"
          >{{!scope.row.lockoutEnd || (new Date(scope.row.lockoutEnd) < new Date())?'锁定账户': '解除锁定'}}</el-button>
          <el-button
            type="text"
            style="color:#dc08dc;"
            size="small"
            @click="showPwdDialog(scope.row)"
          >重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination
        ref="pagination"
        :total="total"
        @sizeChange="handleSize"
        @currentChange="handleCurrent"
      ></pagination>
    </div>
    <!-- 查看用户的角色列表 -->
    <el-dialog title="用户角色列表" :visible.sync="rolesVisible">
      <div class="t-header-title">
        <span>
          姓名：{{realName}}
          <strong style="margin-left:1rem;font-weight:600;">登录账号：{{UserName}}</strong>
        </span>
      </div>
      <el-table
        :data="rolesData"
        v-loading="loading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)"
      >
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="name" label="角色名称" width="200"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">返 回</el-button>
      </div>
    </el-dialog>
    <!-- 重置密码-超级管理员 -->
    <update-password :userForm="userForm" type="reset" :visible.sync="pwdDialogVisible"></update-password>
    <!-- 新增|编辑用户 -->
    <add-edit
      :userForm="addEditForm"
      type="reset"
      :visible.sync="addEditVisible"
      @queryList="queryList"
    ></add-edit>
  </el-card>
</template>
<script>
import {
  getIdentityUserList,
  deleteIdentityUser,
  updateIdentityUserLockout,
  updateIdentityUserUnLock,
  getIdentityUsersRolesList
} from '@/server/identity-module'
import pagination from '@/components/pagination'
import { pageSize } from '@/config.js'
import addEdit from './user-list-add'
import updatePassword from '@/components/updatePassword'
export default {
  name: 'userList',
  data () {
    return {
      pageSize,
      SkipCount: 0,
      style: '',
      total: 0,
      isSelectAll: false,
      conditionForm: {},
      tableData: [],
      activeName: 'first',
      form: {},
      rules: {},
      conditionForm: {},
      userType: [
        { label: "教职工", value: "Faculty" },
        { label: "企业用户", value: "EnterpriseUser" }
      ],
      rolesVisible: false,
      rolesData: [],
      UserName: '',
      realName: '',
      loading: true,
      // 修改密码
      pwdDialogVisible: false,
      userForm: {},
      // 新增|编辑用户
      addEditForm: {},
      addEditVisible: false
    };
  },
  components: { addEdit, pagination, updatePassword },
  activated () {
    this.initDataList()
    this.style = `height:${document.body.clientHeight -
      200}px;overflow:scroll;`
  },
  methods: {
    // 子组件传回父组件的值控制抽屉隐藏
    Visibility (value) {
      this.addEditVisible = value
    },
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataList(SkipCount, pageSize)
    },
    queryList () {
      this.initDataList(this.SkipCount, this.pageSize)
    },
    // 获取用户列表
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        // Sorting: '',
        UserName: this.conditionForm.UserName
      }
      getIdentityUserList(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount
      })
    },
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // 判断是否是全选
      this.isSelectAll =
        this.tableData.length === this.multipleSelection.length;
    },
    userRoles(row) {
      // 查看用户角色列表
      this.UserName = row.userName;
      this.realName = row.name;
      this.rolesVisible = true;
      this.rolesData = [];
      getIdentityUsersRolesList(row.id).then(result => {
        // 获取角色列表
        this.rolesData = result.items;
        this.loading = false;
      });
    },
    del(data) {
      let row = data || this.multipleSelection[0];
      this.$confirm(
        `此操作将删除选中的 【${row.name}】数据， 是否继续？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          deleteIdentityUser(row)
            .then(() => {
              this.$message.success("数据删除成功！");
              this.initDataList()
              this.$refs.pagination.currentPage = 1;
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: err.message,
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    addEdit(row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
    },
    handleClick(tab, event) {
      // tab切换
      // console.log(tab, event)
    },
    showPwdDialog(row) {
      this.userForm = {
        id: row.id,
        name: row.name
      };
      this.pwdDialogVisible = true;
    },
    // 启用停用
    locked(row) {
      this.$confirm(
        `此操作将 ${
          !row.lockoutEnd || new Date(row.lockoutEnd) < new Date()
            ? "锁定账户"
            : "解除锁定"
        } 【${row.name}】， 是否继续？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (!row.lockoutEnd || new Date(row.lockoutEnd) < new Date()) {
            updateIdentityUserLockout(row)
              .then(() => {
                this.$message.success("账户锁定成功");
                this.queryList()
              })
              .catch(err => {
                this.$message({
                  showClose: true,
                  message: err.message,
                  type: "error"
                });
              });
          } else {
            updateIdentityUserUnLock(row)
              .then(() => {
                this.$message.success("账户解锁成功");
                this.queryList()
              })
              .catch(err => {
                this.$message({
                  showClose: true,
                  message: err.message,
                  type: "error"
                });
              });
          }
        })
        .catch(() => {});
    },
    close() {
      this.rolesVisible = false;
      this.loading = true;
    }
  }
};
</script>
<style lang="less" scoped>
.t-header-title {
  span {
    text-align: left;
    width: 350px;
    padding-left: 1rem;
  }
}
</style>