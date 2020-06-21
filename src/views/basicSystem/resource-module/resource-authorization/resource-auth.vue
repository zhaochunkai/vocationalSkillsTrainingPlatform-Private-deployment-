<template>
<div>
	<el-row :gutter="10">
		<el-col :span="5">
			<el-card :style="style"> 
				<!-- 资源库树 -->
				<org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>                                
			</el-card>
		</el-col>
		<el-col :span="19">
			<!-- 资源库信息列表 -->
			<el-card :style="style">
				<div slot="header" class="t-box-card-header">
					<span>资源库列表</span>
				</div>
				<div>
					<el-button type="primary" size="small" @click="saveData">保存</el-button>
				</div>
				<tree-transfer TreeType="user" :title="'所属节点：'+nodeName" :alias="alias" :chooseValue="chooseValue" isMultiple="true" @saveTransfer="getNewTransfer"></tree-transfer>
			</el-card>
		</el-col>
	</el-row>
</div>
</template>
<script>
import { getWarehouseTree } from '@/server/basic-module'
import {getWarehouseAdmin,updateWarehouseSetAdmin,getWarehouseList,createWarehouse,updateWarehouse,deleteWarehouse,	updateWarehouseMoveUp,updateWarehouseMoveDown} from '@/server/resource-module'
import orgTree from '@/components/orgTree.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import treeTransfer from "@/components/tree-transfer"
export default {
	data () {
		return {
			pageSizes,
			pageSize,
			style: '',
			currentPage:0,
			total:0,
			resourceTree: [],
			conditionForm: {},
			tableData: [],
			isSelectAll:false,
			addEditVisible:false,
			addEditForm: {},
			nodeId: '',
			nodeName: '',
			nodeSelect: {},
			// ---------
			title: '',
			alias: {key: 'id',label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
			chooseValue: [],
		}
	},
	components: {orgTree,pagination,treeTransfer},
	activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
		this._getWarehouseTree();
	},
	methods: {
		_getWarehouseTree() {
			this.resourceTree= []
			getWarehouseTree().then(result => {
				this.resourceTree.push(result);
				if (JSON.stringify(this.nodeSelect) == "{}") {   // 若未选择节点，则直接加载根节点的数据
					this.nodeId=this.resourceTree[0].id;
					this.nodeName=this.resourceTree[0].label;
				}
			}).then(() => {
				this.initDataList()
			})
		},
		// 获取资源库列表
		initDataList() {
			getWarehouseAdmin(this.nodeId).then(result => {
				this.tableData=result;
				this.chooseValue= []
				result.forEach(item => {
					this.chooseValue.push(item.id);
				})
			})
		},
		/* 选择的组织机构 */
		haddleOrganizationNode (node) {
			this.nodeSelect=node;
			this.nodeId = node.id
			this.nodeName=node.label;
			this.initDataList();
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
		getNewTransfer(data) {
			this.chooseValue=data;
		},
		saveData() {
			updateWarehouseSetAdmin(this.nodeId,this.chooseValue).then(result => {
				this.$message.success('绑定管理员成功!')
				this.initDataList();
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
	},
}
</script>
<style lang="less" scoped>

</style>