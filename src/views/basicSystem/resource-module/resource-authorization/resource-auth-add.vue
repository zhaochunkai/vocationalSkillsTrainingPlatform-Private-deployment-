<template>
<div>
  <el-card>
    <div slot="header" class="t-box-card-header">
      <span>批量分配用户角色</span>
    </div>
    <el-row :gutter="10">
        <el-col :span="8">
          <el-card>
            <!-- 机构树 -->
            <org-tree :dataList="schoolListTree" @selectNode="haddleOrganizationNode"></org-tree>
            <!-- 企业树 -->
            <org-tree :dataList="enterpriseList" @selectNode="haddleOrganizationNode"></org-tree>
          </el-card>  
        </el-col>
        <el-col :span="16">
          <el-card>
            <el-transfer filterable :filter-method="filterMethod" filter-placeholder="姓名检索" v-model="value" :data="data"> </el-transfer>
            <!-- 操作按钮 -->
            <div class="t-operate-buttons">
                <el-button type="primary" size="mini" @click="addEdit()">保存</el-button>
                <el-button type="primary" size="mini" @click="back()">返回</el-button>
            </div>
          </el-card>
        </el-col>
    </el-row>
  </el-card>
</div>
</template>
<script>
import { getSchoolTree,getEnterpriseTree } from '@/server/basic-module'

import { getWarehouseAdmin,updateWarehouseSetAdmin } from '@/server/resource-module';
import orgTree from '@/components/orgTree.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  data() {
    const generateData = _ => {
      const data = [];
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都','000000'];
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu','0000'];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      return data;
    };
    return {
      pageSizes,
      pageSize,
      SkipCount:0,
      currentPage:0,
      total:0,
      resourceTree: [],
      schoolListTree: [],
      enterpriseList: [],
      conditionForm: {},
      tableData: [],
      isSelectAll:false,
      addEditVisible:false,
      addEditForm: {},
      parentId: '',
      parentName: '',
      nodeSelect: {},
      row: {},
      // ----------
        data: generateData(),
      value: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      }
  }},
  components: {orgTree,pagination},
  activated() {
    this._getSchoolTree()
    this._getEnterpriseTree();
    this.parentId=this.$route.params.id;
    this.row=this.$route.params.row;
  },
  methods: {
    // 机构树
    _getSchoolTree() {
      this.schoolListTree= []
      getSchoolTree().then(result => {
        this.schoolListTree.push(result);
        if (JSON.stringify(this.nodeSelect) == "{}") {   // 若未选择节点，则直接加载根节点的数据
          this.parentId=this.schoolListTree[0].id;
          this.parentName=this.schoolListTree[0].label;
        }
      }).then(() => {
        this.initDataList()
      })
    },
    // 企业树
    _getEnterpriseTree() {
      this.enterpriseList= []
      getEnterpriseTree().then(result => {
        this.enterpriseList.push(result);
      }).then(() => {
        this.initDataList()
      })
    },
    /* 接收改变后每页多少条*/
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
    // 获取资源库列表
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount,
        MaxResultCount: pageSize,
        ParentId: this.parentId
      };
      getWarehouseAdmin(data).then(result => {
        this.tableData = result.items
        this.total = result.totalCount;
      })
    },
    /* 选择的组织机构 */
    haddleOrganizationNode (node) {
      this.nodeSelect=node;
      this.parentId=node.id;
      this.parentName=node.label;
      this.initDataList();
    },
    addEdit (row) {
      this.addEditForm = row || {}
      this.addEditVisible = true
      this.addEditForm.parentId=this.parentId;
      this.addEditForm.parentName=this.parentName;
    },
    back() {
      this.$router.go(-1);
    },
    addEditSave (data) {
      // console.log(data)
      // if (data.id) {
      //   updateWarehouse(data).then(result => {
      //     this._getSchoolTree()
      //     this.$message.success('保存成功')
      //   })
      // } else {
      //   createWarehouse(data).then(result => {
      //     this._getSchoolTree()
      //     this.$message.success('保存成功')
      //   })
      // }
    },
  },
}
</script>
<style lang="less" scoped>

</style>