<template>
<div>
	<el-row :gutter="10">
		<el-col :span="5">
			<el-card :style="style">
				<!-- 机构树 -->
				<org-tree ref="orgTree" :currentNodeAll="nodeSelect" :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>                                
			</el-card>
		</el-col>
		<el-col :span="19">
			<!-- 资源库信息列表 -->
			<el-card :style="style">
				<div slot="header" class="t-box-card-header">
					<span>资源库列表 </span>
					<el-tag v-if="nodeSelect.label">当前节点：【 {{nodeSelect.label}} 】</el-tag>
				</div>   
				<!-- 操作按钮 -->
				<div class="t-operate-buttons">
					<!-- <el-button type="primary" size="mini">导入</el-button> -->
					<el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
					<!-- <el-button type="primary" size="mini" @click="del()">删除</el-button> -->
				</div>
				<!-- 表格 -->
				<el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"> </el-table-column>
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="name" sortable label="资源库名称">
							<!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
					</el-table-column>
					<el-table-column prop="parentName" label="上级资源库名称">
					</el-table-column>
					<el-table-column prop="description" label="描述">
					</el-table-column>
					<el-table-column  fixed="right" label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="addEdit(scope.row)">修改</el-button>
							<el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
							<el-button type="text" size="small" @click="moveUp(scope.row)" v-show="scope.$index!=0">上移</el-button>
							<el-button type="text" size="small" @click="moveDown(scope.row)" v-show="scope.$index!=tableData.length-1">下移</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- 全选 -->
				<div class="t-batch-operate">
					<el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
				</div>			
				<!-- 分页组件 -->
				<div class="t-operate-footer">
					<pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
				</div>
			</el-card>
		</el-col>
	</el-row>
	<!-- 弹出层：新增/编辑资源库信息 -->
	<add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave"></add-edit>
</div>
</template>
<script>
import { getWarehouseTree } from '@/server/basic-module';
import { getWarehouseList,createWarehouse,updateWarehouse,deleteWarehouse,
    updateWarehouseMoveUp,updateWarehouseMoveDown,
} from '@/server/resource-module';
import orgTree from '@/components/orgTree.vue'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from "./resource-list-add.vue" 
export default {
	data() {return {
		pageSizes,
		pageSize,
		SkipCount:0,
		style: '',
		currentPage:0,
		total:0,
		resourceTree: [],
		conditionForm: {},
		tableData: [],
		isSelectAll:false,
		addEditVisible:false,
		addEditForm: {},
		parentId: '',
		parentName: '',
		nodeSelect: {},
	}},
	components: {orgTree,pagination,addEdit},
	activated() {
		this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
		this._getWarehouseTree();
		if (this.nodeSelect && JSON.stringify(this.nodeSelect)!='{}') {
			this.foucsOnNode();
		}
	},
	methods: {
		/* ----------------------------------- 查询 -------------------------------- */
		_getWarehouseTree() {
			this.resourceTree= []
			getWarehouseTree().then(result => {
				this.resourceTree.push(result);
				if (JSON.stringify(this.nodeSelect) == "{}") {   // 若未选择节点，则直接加载根节点的数据
					this.parentId=this.resourceTree[0].id;
					this.parentName=this.resourceTree[0].label;
				}
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
			getWarehouseList(data).then(result => {
				this.tableData = result.items
				this.total = result.totalCount;
			})
		},
		/* ----------------------------------- 操作 -------------------------------- */
		/* 选择的组织机构 */
		haddleOrganizationNode (node) {
			this.nodeSelect=node;
			this.parentId=node.id;
			this.parentName=node.label;
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
		selectAll () {
			this.$refs.multipleTable.toggleAllSelection()
		},
		handleSelectionChange (val) {
			this.multipleSelection = val
			// 判断是否是全选
			this.isSelectAll = this.tableData.length === this.multipleSelection.length
		},
		foucsOnNode() {
			setTimeout(() => {
				this.$refs.orgTree.checkNode();
			},500)
		},
		addEdit (row) {
			this.addEditForm = row || {}
			this.addEditVisible = true
			this.addEditForm.parentId=this.parentId;
			this.addEditForm.parentName=this.parentName;
		},
		addEditSave (data) {
			if (data.id) {
				updateWarehouse(data).then(result => {
					this._getWarehouseTree();
					this.$message.success('保存成功')
					this.foucsOnNode();
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				}) 
			} else {
				createWarehouse(data).then(result => {
					this._getWarehouseTree();
					this.$message.success('保存成功')
					this.foucsOnNode();
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				}) 
			}
		},
		del(data) {
			let row= data || this.multipleSelection[0];
			this.$confirm(`此操作将删除选中的数据 【${row.name}】数据， 是否继续？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {                
				deleteWarehouse(row).then(() => {
					this.$message.success('数据删除成功！')
					this._getWarehouseTree();
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				}) 
			}).catch(() => {})
		},
		moveUp(row) {             
			updateWarehouseMoveUp(row).then(() => {
				this.$message.success('数据上移成功！')
				this._getWarehouseTree();
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
		moveDown(row) {        
			updateWarehouseMoveDown(row).then(() => {
				this.$message.success('数据下移成功！')
				this._getWarehouseTree();
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
.t-header-title{
	span{
		width:320px;
		font-size:14px;
	}

}
</style>