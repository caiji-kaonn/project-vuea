<template>
  <div class="rolelist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-view">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="success" plain style="margin-bottom:15px" @click="showka">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolelist" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 一级权限 -->
          <el-row
            v-for="first in props.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #f00;"
          >
            <!-- 设置标签 -->
            <el-col :span="4">
              <el-tag
                closable
                :type="'danger'"
                @close="cnt=0;deleta(props.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="cnt=0;deleta(props.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'success'"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-right:15px;margin-bottom:15px"
                    @close="cnt=0;deleta(props.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="props.row.children.length===0">还没分配角色噢，请分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top-start">
            <el-button type="primary" icon="el-icon-share" @click="openlist(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="primary" icon="el-icon-delete" @click="delbyid(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配角色 -->
    <el-dialog title="角色授权" :visible.sync="fenpeidialogTableVisible">
      <el-tree
        :data="rolerole"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkAll"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fenpeidialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grant">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
      <el-form :model="addform" :label-width="'80px'">
        <el-form-item label="角色名称">
          <el-input v-model="addform.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addform.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delekyalakuta, kyalakutaupdata, addkyara, deleid } from '@/api/role_index'
import { getallLevel } from '@/api/right_index'
export default {
  data () {
    return {
      // 添加角色
      adddialogFormVisible: false,
      addform: {
        roleName: '',
        roleDesc: ''
      },
      // 授权角色
      roleId: '',
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      fenpeidialogTableVisible: false,
      checkAll: [],
      rolerole: [],
      // 删除
      cnt: '0',
      rolelist: []
    }
  },
  mounted () {
    //   获取角色例表
    this.init()
    // 设置默认加载数据
    getallLevel('tree')
      .then(res => {
        // console.log(res)
        this.rolerole = res.data.data
      })
  },
  methods: {
    // 删除角色权限
    async deleta (row, rightId) {
      // console.log(row)
      // console.log(row.id, rightId)
      let res = await delekyalakuta(row.id, rightId)
      // console.log(res)
      if (res.data.meta.status === 200) {
        row.children = res.data.data
        if (this.cnt === 0) {
          this.$message(res.data.meta.msg)
          this.cnt++
        }
        row.children.forEach(v1 => {
          if (v1.children.length === 0) {
            this.deleta(row, v1.id)
          } else {
            v1.children.forEach(v2 => {
              if (v2.children.length === 0) {
                this.deleta(row, v2.id)
              }
            })
          }
        })
      }
    },
    // 角色授权---展开显示所对应当行的权限数据---要获取到当前的角色Id
    openlist (row) {
      // console.log(row)
      this.roleId = row.id
      console.log(this.roleId)
      this.fenpeidialogTableVisible = true
      // 设置节点被选中
      this.rolerole = [...this.rolerole]
      this.checkAll.length = 0
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.checkAll.push(third.id)
              })
            }
          })
        }
      })
    },
    init () {
      getAllRoleList().then(res => {
      // console.log(res)
        if (res.data.meta.status === 200) {
          this.rolelist = res.data.data
        }
      })
    },
    // 获取节点被选中的角色id和权限id
    async grant () {
      // 获取到了 arr={[id:xx,pid:xx]}
      let arr = this.$refs.tree.getCheckedNodes()
      console.log(arr)
      let temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      temp = temp.join(',').split(',')
      temp = [...new Set(temp)]
      // ['105','105','101']
      // console.log(temp.join(','))
      let res = await kyalakutaupdata(this.roleId, temp.join(','))
      // temp.join(',')
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.fenpeidialogTableVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 添加角色
    showka () {
      this.adddialogFormVisible = true
    },
    async add () {
      let res = await addkyara(this.addform)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message(res.data.meta.msg)
        this.adddialogFormVisible = false
      }
    },
    // 删除角色
    delbyid (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleid(id)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message(res.data.meta.msg)
              this.init()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less">
</style>
