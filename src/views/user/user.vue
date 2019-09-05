<template>
  <div class="usesr">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-view">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;margin-bottom: 15px">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px"
        @keydown.enter.native="init"
      >
        <el-button slot="append" icon="el-icon-view" @click="init"></el-button>
      </el-input>
      <el-button
        type="success"
        plain
        style="margin-left:10px"
        @click="addDialogFormVisible = true"
      >添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table border ref="singleTable" :data="userlist" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" @click="showeddit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" @click="delteUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addform" :label-width="'80px'" ref="addForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户数据 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="edditform" :label-width="'100px'" :rules="rules" ref="edditForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="edditform.username" auto-complete="off" disabled style="width:80px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edditform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="edditform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="eddit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色 -->
    <el-dialog title="角色分配" :visible.sync="grantDialogFormVisible">
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
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserall,
  addUser,
  edditUser,
  delteById,
  updateUserState,
  Userrole
} from '@/api/user_index'
import { getAllRoleList } from '@/api/role_index'
export default {
  data () {
    return {
      // 角色
      roleList: [],
      grantDialogFormVisible: false,
      grantform: {
        username: '',
        rid: '',
        id: ''
      },
      // 编辑用户
      editDialogFormVisible: false,
      edditform: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 添加用户
      addDialogFormVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      status: true,
      total: 0,
      userlist: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
    // 获取页面
    handleSizeChange (val) {
      console.log(val)
      this.userobj.pagesize = val
      this.init()
    },
    // 点击分页数
    handleCurrentChange (val) {
      console.log(val)
      this.userobj.pagenum = val
      this.init()
    },
    init () {
      getUserall(this.userobj)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.userlist = res.data.data.users
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            this.$router.push({ name: 'login' })
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$message.error('服务器异常')
        })
    },
    // 添加用户
    add () {
      //  实现二次验证
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addform)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success('添加用户成功')
                this.init()
                this.addDialogFormVisible = false
                this.$refs.addForm.resetFields()
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {
              this.$message.warning('用户新增失败')
            })
        } else {
          this.$message.warning('请输入数据')
        }
      })
    },
    // 编辑用户-弹出对话框-获取到当前数据
    showeddit (row) {
      console.log(row)
      this.editDialogFormVisible = true
      this.edditform.id = row.id
      this.edditform.username = row.username
      this.edditform.email = row.email
      this.edditform.mobile = row.mobile
    },
    // 编辑用户-发送请求
    eddit () {
      edditUser(this.edditform)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success('编辑用户成功')
            this.init()
            this.editDialogFormVisible = false
            this.$refs.edditForm.resetFields()
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$message.warning('编辑用户失败')
        })
    },
    // 删除
    delteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delteById(id)
            .then(res => {
              console.log(res)
              if (res.daata.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if (this.userlist.length === 0) {
                  this.userobj.pagenum--
                }
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
          // eslint-disable-next-line handle-callback-err
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          })
        })
    },
    // 修改用户状态
    changeState (id, type) {
      updateUserState(id, type)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '修改状态成功!'
            })
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$message({
            type: 'error',
            message: '修改状态失败'
          })
        })
    },
    // 角色数据
    showGrantDialog (row) {
      console.log(row)
      this.grantDialogFormVisible = true
      this.grantform.username = row.username
      this.grantform.id = row.id
      this.grantform.rid = row.rid
    },
    // 修改角色，发送请求
    grantUser () {
      // console.log(this.grantform)
      //  要判断当前是否选择了角色---rid
      if (this.grantform.rid) {
        Userrole(this.grantform)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.grantDialogFormVisible = false
              this.init()
            }
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.$message.error('用户编辑失败')
          })
      } else {
        this.$message.error('请选择角色')
      }
    }
  },
  // 一加载网页就能获取到数据
  mounted () {
    this.init()
    // 加载菜单角色数据列表
    getAllRoleList()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less">
</style>
