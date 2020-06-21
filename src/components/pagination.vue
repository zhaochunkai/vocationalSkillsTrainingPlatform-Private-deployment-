<template>
    <!-- 分页 -->
    <el-pagination class="t-table-pagination" small background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :total="total"
        layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
</template>
<script>
import { pageSizes, pageSize } from '@/config.js'
export default {
    name: 'pagination',
    props: {
        total: {
            type: Number,
            default: () => {
                return 0
            }
        }
    },
    data () {
        return {
            currentPage: 1,
            pageSizes,
            pageSize,
            SkipCount: 0
        }
    },
    methods: {
        /* 
         * 计算跳过多少条
         */
        skipCount (currentPage, pageSize) {
            let skipCount = (currentPage - 1) * pageSize;
            return skipCount;
        },
        /* 
         * 改变每页多少条
         */
        handleSizeChange (val) {
            this.pageSize = val;
            this.SkipCount = this.skipCount(this.currentPage, this.pageSize);
            this.$emit('sizeChange', this.SkipCount, this.pageSize);
        },
        /* 
         * 当前页数
         */
        handleCurrentChange (val) {
            this.currentPage = val;
            this.SkipCount = this.skipCount(this.currentPage, this.pageSize);
            this.$emit('currentChange', this.SkipCount, this.pageSize);
        }
    }

}
</script>