<template>
  <div class="lits">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-view">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;margin-bottom: 15px">
      <el-input
        placeholder="请输入内容"
        v-model="goodlist.query"
        class="input-with-select"
        style="width:300px"
        @keydown.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-view"></el-button>
      </el-input>
      <el-button
        type="success"
        plain
        style="margin-left:10px"
        @click="$router.push({name:'add'})"
      >添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table border ref="singleTable" :data="alllist" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="100"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态" width="50"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="120">
        <template slot-scope="scope">{{scope.row.add_time | timeforma}}</template>
      </el-table-column>
    </el-table>
      <!-- 操作按钮 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
    <el-button type="primary" icon="el-icon-edit"></el-button>
  </el-tooltip>
  <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
    <el-button type="success" icon="el-icon-share"></el-button>
  </el-tooltip>
  <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
    <el-button type="danger" icon="el-icon-delete"></el-button>
  </el-tooltip>
     </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodlist.pagenum"
      :page-sizes="[10, 20, 30, 40,50]"
      :page-size="goodlist.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 角色 -->
    <!-- <el-dialog title="角色分配" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantform" :label-width="'80px'">
        <el-form-item label="用户名">
          <span>{{grantform.username}}</span>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select v-model="grantform.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUser">确 定</el-button>
      </div>
    </el-dialog> -->
    </div>
</template>
<script>
import { getAllgoodlist } from '@/api/good_list'
import { timeforma } from '@/utils/myfilters'

export default {
  data () {
    return {
      // 添加用户
      goodlist: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      total: 0,
      // 数据加载
      alllist: []
    }
  },
  methods: {
    async init () {
      let res = await getAllgoodlist(this.goodlist)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.alllist = res.data.data.goods
      }
    },
    handleSizeChange (val) {
      console.log(val)
      this.goodlist.pagesize = val
    },
    handleCurrentChange (val) {
      console.log(val)
    }
  },
  mounted () {
    this.init()
  },
  filters: {
    timeforma
  }
}
</script>
<style lang="less">
</style>
