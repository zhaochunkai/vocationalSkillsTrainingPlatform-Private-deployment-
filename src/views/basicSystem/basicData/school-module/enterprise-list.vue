<template>
<div>
	<!-- 学校信息 -->
	<el-card :style="style">
		<div slot="header" class="t-box-card-header">
			<span>企业信息</span>
		</div>
		<el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
			<el-form-item label="企业名称">
				<el-input class="input-append"  v-model="conditionForm.name" placeholder="请输入校区名称"></el-input>	
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="conditionForm.UsageStatus">
					<el-option label="全部" value="ALL"></el-option>
					<el-option label="启用" value="enable"></el-option>
					<el-option label="停用" value="disable"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="queryList">查询</el-button>
			</el-form-item>
		</el-form>                
		<!-- 操作按钮 -->
		<div class="t-operate-buttons">
			<!-- <el-button type="primary" size="mini">导入</el-button> -->
			<el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
			<!-- <el-button type="primary" size="mini" @click="isEneble()">启用</el-button>
			<el-button type="primary" size="mini" @click="isEneble()">停用</el-button> -->
		</div>
		<!-- 表格 -->
		<el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"> </el-table-column>
			<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
			<el-table-column prop="name" sortable label="企业名称">
				<!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
			</el-table-column>
			<el-table-column prop="contact" label="联系电话">
			</el-table-column>
			<el-table-column prop="fax" label="传真电话">
			</el-table-column>
			<el-table-column prop="email" label="电子信箱">
			</el-table-column>
			<el-table-column prop="address" label="企业地址">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<el-table-column prop="usageStatus" label="状态" width="100">
				<template slot-scope="scope">
					{{scope.row.usageStatus=='Enable'?'停用': '启用'}}
				</template>
			</el-table-column>
			<el-table-column  fixed="right" label="操作" width="150" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="isEneble(scope.row)">{{scope.row.usageStatus=='Enable'?'停用': '启用'}}</el-button>
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
	<!-- 新增/修改页面 -->
	<add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave"></add-edit>
</div>
</template>
<script>
import { getEnterpriseList,createEnterprise,updateEnterprise,updateEnterpriseEnable } from '@/server/basic-module'
import { pageSizes, pageSize } from '@/config.js'
import addEdit from "./enterprise-list-add"
import pagination from '@/components/pagination'
export default {
    name: 'enterpriseList',
    data() {return {
			pageSizes,
			pageSize,
			SkipCount:0,
			style: '',
			currentPage:0,
			isSelectAll:false,
			addEditVisible:false,
			addEditForm: {},
			conditionForm: {},
			tableData: [],
			// tab切换
			activeName: 'first',
			form: {},
			rules: {},
			total:0,
    }},
    components: {addEdit,pagination},
    activated() {
			this.initDataList();
			this.style = `height:${document.body.clientHeight - 200}px;overflow:scroll;`
    },
    methods: {
		queryList() {
			this.initDataList(this.SkipCount, this.pageSize);
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
		// 获取企业列表
		initDataList(SkipCount = 0, pageSize = this.pageSize) {
			let data = {
				SkipCount: SkipCount,
				MaxResultCount: pageSize,
				name: this.conditionForm.name,
				UsageStatus: this.conditionForm.UsageStatus
			};
			getEnterpriseList(data).then(result => {
				this.tableData = result.items
				this.total = result.totalCount;
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
		selectAll () {
			this.$refs.multipleTable.toggleAllSelection()
		},
		handleSelectionChange (val) {
			this.multipleSelection = val
			// 判断是否是全选
			this.isSelectAll = this.tableData.length === this.multipleSelection.length
		},
		addEdit (row) {
			this.addEditForm = row || {}
			this.addEditVisible = true
		},
		addEditSave (data) {
			if (data.id) {
				updateEnterprise(data).then(result => {
					this.$message.success('保存成功');
					this.queryList()
					this.$emit('updateSchoolTree')
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				})
			} else {
				createEnterprise(data).then(result => {
					this.$message.success('保存成功');
					this.queryList()
					this.$emit('updateSchoolTree')
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				})
			}				
		},
		// 启用停用
		isEneble(row) {
			this.$confirm(`此操作将 ${row.usageStatus=='Enable'?'停用': '启用'} 【${row.name}】数据， 是否继续？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
			}).then(() => {
				// row.enable=!row.enable;
				if (row.usageStatus=='Enable') {
					row.enable=false
				} else {
					row.enable=true
				}
				updateEnterpriseEnable(row).then(() => {
					this.$message.success('状态修改成功！')
					this.$emit('updateSchoolTree');
					this.queryList()
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				})						
			}).catch(() => {})
		},
		// tab切换
		handleClick(tab, event) {
			// console.log(tab, event);
		}
	}
}
</script>
<style lang="less" scoped>

</style>
