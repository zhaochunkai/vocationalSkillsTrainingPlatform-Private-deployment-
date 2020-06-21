<template>
  <el-dialog class="t-dialog" title="绑定资源" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree :data="data" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current :props="defaultProps" :filter-node-method="hideNode" :default-checked-keys="defaultkeys">
</el-tree>
    <el-button @click="getCheckedNodes">通过 node 获取</el-button>
    <el-button @click="getCheckedKeys">通过 key 获取</el-button>
    <el-button @click="setCheckedNodesee">通过 node 设置</el-button>
    <el-button @click="resetChecked">清空</el-button>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="saveGoon">保存并继续新增</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSchoolTree,getMajorById } from '@/server/basic-module';
import orgTree from '@/components/orgTree.vue'
export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      filterlabel: '',
      filterText: '',
      defaultkeys: [4,6], // 默认值 
       data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2',
              disabled: true
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        
      
    }
  },
  components: {orgTree},
  activated () {
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        // this.form = Object.assign({}, this.dataForm);
        // this.filterlabel=this.form.agencyName;  
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    hideNode(value, data, node) {
      // this.data.forEach((item,i) => {
      //   console.log(this.defaultkeys.indexOf(item.id) !== -1)
      //   return this.defaultkeys.indexOf(item.id) !== -1
      // })
    },
    getCheckedNodes() {
      // console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      // console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodesee() {      
      this.$refs.tree.setCheckedNodes([{    // 默认值
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    nodes(item,node) {
    },
    close () {
      this.$emit('update:visible', false)
    },
    save () {
      if (JSON.stringify(this.form) == "{}") {
        // {{new Date(scope.row.academicYearBeginTime).toLocaleDateString()}}
        // this.form.establishTime=new Date(this.form.establishTime).toLocaleDateString()
      }
       this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save', this.form)
        this.close()
       })
    },
    saveGoon () {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        this.$emit('save', this.form)
      })
      this.form = {}
      this.filterlabel = ''
    },
    clear () {
        this.filterlabel = ''
        this.form.agencyId='';
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.$set(this.form, 'agencyId', node.id)// 机构id
      this.item = node
      this.filterlabel = node.label
    },
  }
}
</script>
