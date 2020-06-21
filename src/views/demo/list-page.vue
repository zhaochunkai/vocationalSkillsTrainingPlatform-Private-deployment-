<template>
  <div>
    <div class="t-operate-top">
      <!-- 查询条件 -->
      <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item>
          <el-input v-model="conditionForm.keyword" placeholder="输入关键字">
            <el-button slot="append">查询</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="地址：">
          <el-select v-model="conditionForm.address" placeholder="请选择">
            <el-option label="北京" value="beijing"></el-option>
            <el-option label="上海" value="shanghai"></el-option>
            <el-option label="成都" value="chengdu"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表 -->
    <el-card>
      <div slot="header" class="t-box-card-header">
        <span>学生列表</span>
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <el-button type="primary" size="mini">导入</el-button>
          <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table class="t-table-list" ref="table" stripe size="small" tooltip-effect="dark"
         :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" :show-overflow-tooltip="true" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="t-operate-footer">
        <!-- 批量操作 -->
        <div class="t-batch-operate">
          <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
          <el-button type="primary" size="mini" :disabled="!this.multipleSelection.length">删除</el-button>
        </div>

        <!-- 分页 -->
        <el-pagination class="t-table-pagination" small background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :total="200"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
      
    </el-card>

    <addEdit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave"></addEdit>
  </div>
</template>
<script>
import addEdit from "./add-edit-dialog";
import { pageSizes, pageSize } from '@/config.js'
export default {
  data () {
    return {
      pageSizes,
      pageSize,
      conditionForm: {},
      tableData: [
        { id: 1, age: '16', name: '张三', address: '北京' }, 
        { id: 2, age: '18', name: '李四', address: '成都' }, 
        { id: 3, age: '19', name: '张三', address: '北京' }, 
        { id: 4, age: '14', name: '李四', address: '成都' }, 
        { id: 5, age: '16', name: '张三', address: '北京' }, 
        { id: 6, age: '19', name: '张三', address: '上海' }, 
        { id: 7, age: '15', name: '李四', address: '成都' }, 
      ],
      isSelectAll: false,
      multipleSelection: [],
      currentPage: 1,
      addEditForm: {},
      addEditVisible: false
    }
  },
  activated() {
    // console.log('处理更新的数据');
  },
  methods: {
    /* 
     * 改变每页多少条
     */
    handleSizeChange (val) {
      this.pageSize = val;
    },
    /* 
     * 当前页数
     */
    handleCurrentChange (val) {
      this.currentPage = val;
    },
    /* 
     * 新增编辑
     */
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
    },
    addEditSave (form) {
      this.$message.success('保存成功');
    },
    /* 
     * 删除
     */
    del (row) {
      this.$confirm(`此操作将删除[${row.name}]数据， 是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('删除成功');
        }).catch(() => {
          this.$message.info('已取消删除');          
        })
    },
    /* 
     * 全选
     */
    selectAll () {
      this.$refs.table.toggleAllSelection()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    }
  },
  components: {
    addEdit
  }
}
</script>
