<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <img src="@/assets/logo.png" alt srcset class="logo" />
        <el-menu
          default-active="2"
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
        <!-- 第一行用户 动态获取权限-->
          <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+submit.path" v-for="submit in item.children" :key="submit.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{submit.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 头和组件结构 -->
      <el-container>
        <el-header>
          <i class="el-icon-view toggle-btn" ></i>
           <i class="el-icon-view toggle-btn" ></i>
          <i class="el-icon-view toggle-btn" ></i>
          <i class="el-icon-view toggle-btn" ></i>
         <h2 class="system-title">后台管理</h2>
         <a href="javascript" class="welcome">退出</a>
        </el-header>
        <!-- 组件位置 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLeftMenu } from '@/api/right_index'
export default {
  data () {
    return {
      menuList: []
    }
  },
  mounted () {
    getLeftMenu()
      .then(res => {
        console.log(res)
        this.menuList = res.data.data
      })
  }
}
</script>
<style lang="less">
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 60px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
