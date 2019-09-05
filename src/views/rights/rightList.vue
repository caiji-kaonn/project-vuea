<template>
  <div class="rightList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-view">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格数据 -->
    <el-table :data="rightlist" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
          <template  slot-scope="scope">
          <span> {{ scope.row.level  | levelforma}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getallLevel } from '@/api/right_index'
export default {
  data () {
    return {
      rightlist: []
    }
  },
  mounted () {
    getallLevel('list')
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rightlist = res.data.data
        } else {
          this.$message.error('数据获取失败')
        }
      })
      // eslint-disable-next-line handle-callback-err
      .catch(err => {
        this.$message.error('不给你看')
      })
  },
  //   对层级做数据格式转换
  filters: {
    levelforma (level) {
      console.log(level)
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}

</script>
<style lang="less">
</style>
