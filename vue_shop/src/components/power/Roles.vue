<template>
  <!-- 权限分配给角色 再给角色分配用户 不同角色拥有不同权限 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <!-- 绑定数据源 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5"
                ><el-tag
                  @close="removeRightById(scope.row, item1.id)"
                  closable
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <!-- :class="['bdtop']" 给每行都添加上bdtop类名 -->
              <el-col :span="19">
                <!-- 绑定数据 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i
                  ></el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      @close="removeRightById(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
            <!-- 左侧一级 中间右侧二三级 栅格系统的布局-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="300px">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色信息"
      :visible.sync="dialogFormVisible"
      @close="addDialogClosed"
    >
      <el-form
        :model="roleForm"
        :rules="roleFormRules"
        ref="roleFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->

    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形结构的权限数据 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加角色信息对话框可见与否
      dialogFormVisible: false,
      // 修改角色信息对话框可见与否
      editDialogVisible: false,
      // 添加角色的信息
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加表单的验证规则对象
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '用户名的长度在1~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '角色描述在1~15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 查询到的角色信息对象
      editForm: {},
      //  修改角色信息的规则
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '用户名的长度在1~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '角色描述在1~15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点ID值数组
      defKeys: [],
      // 当前即将分配角色权限的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.roleList = res.data
      // console.log(this.roleList)
    }, // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      // 关闭之后重置添加角色的表单
      this.$refs.roleFormRef.resetFields()
    },
    // 添加角色
    addRole() {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起添加角色的网络请求
        const { data: res } = await this.$http.post('roles', {
          roleName: this.roleForm.roleName,
          roleDesc: this.roleForm.roleDesc
        })
        console.log(res.meta.status)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色信息失败！')
        }
        // 提示修改成功
        this.$message.success('添加角色信息成功！')
        // 关闭对话框
        this.dialogFormVisible = false
        // 刷新数据列表
        this.getRolesList()
      })
    },
    // 删除角色
    async removeRoleById(id) {
      // 询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).catch((error) => {
        return error
      })
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户去萧删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      console.log(res.meta.status)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户信息失败！')
      }
      // 提示修改成功
      this.$message.success('删除用户信息成功！')
      // 刷新数据列表
      this.getRolesList()
    },
    // 展示编辑对话框
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      console.log(this.editForm)
    },
    // 监听修改用户对话框的关闭事件 需要重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交 预校验
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        console.log(res.meta.status)

        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新角色信息成功！')
      })
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      // 弹框确认删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).catch((error) => {
        return error
      })
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户去萧删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // 把返回值的data内包含了更新后的权限 可以避免整个页面的刷新
      role.children = res.data
      // 提示修改成功
      this.$message.success('删除权限成功！')
      // this.getRolesList() 需要重新渲染
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据

      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户权限数据失败')
      }
      //  获取到的权限数据保存到data中
      this.rightsList = res.data
      // 递归获取三级阶段的id
      this.getLeaveKeys(role, this.defKeys)
      this.setRightDialogVisible = true
      console.log(this.rightsList)
    },
    // 通过递归的形式获取角色下所有三级权限的id并保存到数组中
    getLeaveKeys(node, arr) {
      if (!node.children) {
        // 如果当前node节点不包含children 是三级节点
        return arr.push(node.id)
      }
      // 否则不是三级节点,通过递归函数
      node.children.forEach((item) => this.getLeaveKeys(item, arr))
    },
    // 监听分配权限对话框关闭事件,重置权限的data内保存的数组
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 转换成以逗号分隔的字符串
      const idStr = keys.join(',')
      // 在这里无法传入id因此再显示对话框的时候应该将获取的id保存到data中
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
      // console.log(keys)
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
