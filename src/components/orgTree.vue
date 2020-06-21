
<template>
<div>
  <el-tree accordion class="filter-tree" ref="OrganizationTree" node-key="id" :data="dataList" :props="props" :highlight-current="true" :expand-on-click-node="false" default-expand-all @node-click="haddleSelectNode" :filter-node-method="filterNode" :render-content="renderContent"></el-tree>
</div>
</template>
<script>
import { getSchoolTree } from '@/server/basic-module'

export default { 

  data() {
    return {
      props: {
        children: 'children',
        label: 'label'          
      },
    };
  },
  props: ['dataList','filterText','currentNode','currentNodeAll'],
  watch: {
    filterText(val) {
      this.$refs.OrganizationTree.filter(val);
    },
    
  },
  activated() { 
  },
  methods: { 
    checkNode() {
      this.$refs.OrganizationTree.setCurrentNode(this.currentNodeAll); // 设置新节点被选中
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span title={node.label}>{node.label}</span>
        </span>
      );
    },
  
    /*选中的机构*/
    haddleSelectNode(node) {
      this.$emit('selectNode', node);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  }
};
</script>
<style lang="less" scoped>
/deep/.el-tree-node__content{
  font-size:14px;
}
</style>