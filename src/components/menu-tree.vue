<template>
    <div>
        <template v-for="item in menuLIst">
            <el-submenu v-if="item.children && item.children.length" :key="item.index" :index="item.index">
                <template slot="title">
                    <span>{{item.label}}</span>
                </template>
                <MenuTree :menuLIst="item.children" @clickMenuItem="clickMenu"></MenuTree>
            </el-submenu>
            <el-menu-item v-else :key="item.index" :index="item.index" @click="goto(item)">{{item.label}}</el-menu-item>
        </template>
    </div>
</template>
<script>
export default {
  props: ['menuLIst'],
  name: 'MenuTree',
  methods: {
    goto (item) {
      this.$emit('clickMenuItem', item)
    },
    clickMenu (item) {
      this.goto(item)
    }
  }
}
</script>
