<template>

  <el-dialog class="t-dialog" title="设置单科分数段" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" @close="close">
    <el-table :data="tableData" @selection-change="handleSelectionChange" class="t-table-list" ref="multipleTable" border size="small" tooltip-effect="dark">      
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column property="min" label="最小值" width="150"></el-table-column>
      <el-table-column property="max" label="最大值" width="200"></el-table-column>
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div>	
    <div style="margin:20px 0;display:block;">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props:['tableData', 'visible','courseId'],
  data () {
    return {
      isSelectAll:false,
      multipleSelection:[],
    }
  },
  methods: {
    /*---------------------------------------------------------操作按钮------------------------------------------------ */
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        });
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    selectAll(){
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
        // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length
    },
    close(){
      this.$emit('update:visible', false)
    },
    save(){
      this.$emit('save', this.multipleSelection,this.courseId);
      this.close()
    },
  }
}
</script>