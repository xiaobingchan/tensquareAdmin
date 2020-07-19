<!-- MVVM框架（Model - View - ViewModel）：   template 标签 相当于View -->
<template>
  <div class="app-container">
    <!-- 查询表单样式 -->
    <el-form :inline="true" :model="searchMap" class="demo-form-inline">
        <el-form-item label="活动名称">
            <el-input v-model="searchMap.name" placeholder="填入活动名称查询"></el-input>
        </el-form-item>
        <el-form-item label="活动日期">
            <el-date-picker v-model="searchMap.starttime" type="date" placeholder="选择开始日期"></el-date-picker>
            <el-date-picker v-model="searchMap.endtime" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="feachData" icon="el-icon-search">搜索</el-button>
            <el-button type="success" @click="dialogVisible = true;pojo={};id=''" icon="el-icon-plus">新增</el-button>
        </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table :data="list" border style="width: 100%">
        <el-table-column prop="id" label="活动ID" ></el-table-column>
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column prop="sponsor" label="主办方" ></el-table-column>
        <el-table-column prop="address" label="活动地址" ></el-table-column>
        <el-table-column prop="starttime" label="开始时间"></el-table-column>
        <el-table-column prop="endtime" label="结束时间" ></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
                <el-button @click="findById(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="deleteById(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <br>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[12, 20, 30, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 弹出框 -->
    <el-dialog title="活动信息编辑" :visible.sync="dialogVisible" width="70%" >
        <el-form label-width="80px">
            <el-form-item label="活动名称">
                <el-input v-model="pojo.name" placeholder="活动名称"></el-input>
            </el-form-item>
            <el-form-item label="基本地址">
                <el-input v-model="pojo.address"  placeholder="基本地址"></el-input>
            </el-form-item>
            <el-form-item label="开始日期">
                <el-date-picker type="date"  v-model="pojo.starttime" placeholder="开始日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="截至日期">
                <el-date-picker type="date" v-model="pojo.endtime"  placeholder="截至日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="报名截止">
                <el-date-picker type="date" v-model="pojo.enrolltime"  placeholder="报名截止"></el-date-picker>
            </el-form-item>
            <el-form-item label="活动详情">
                <el-input v-model="pojo.detail" placeholder="活动详情" type="textarea" :rows="4"></el-input>
            </el-form-item>
            <el-form-item label="城市">
                <el-select v-model="pojo.city" filterable placeholder="请选择">
                    <el-option
                    v-for="(item,index) in cityList"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否可见">
                <el-switch active-value="1" inactive-value="0" v-model="pojo.state"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSave">保存</el-button>
                <el-button @click="dialogVisible = false" >关闭</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<!-- script标签相当于ViewModel -->
<script>
// 导入活动api
import gatheringApi from '@/api/gathering'
// 导入城市的api
import cityApi from '@/api/city'
export default {
  data() {
    return {
      // 这里定义的对象相当于Model
      list: [],
      pageNo: 1,
      pageSize: 12,
      searchMap: {}, // 查询条件
      total: 0, // 总记录数
      dialogVisible: false,
      pojo: {}, // 编辑表单对象
      cityList: [], // 城市列表
      id: '' // 更新标记
    }
  },
  // 生命周期钩子会自动触发
  created() {
    // 调用方法
    this.feachData()
    // 给城市列表赋值
    cityApi.getList().then(res => {
      this.cityList = res.data
    })
  },
  methods: {
    feachData() {
      // 调用api去获取数据
      gatheringApi.search(this.pageNo, this.pageSize, this.searchMap).then(res => {
        // 给数组赋值
        this.list = res.data.rows
        // 给总记录数赋值
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      // 给页大小赋值
      this.pageSize = val
      // 查询
      this.feachData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // 给当前页赋值
      this.pageNo = val
      // 查询
      this.feachData()
    },
    handleSave() {
      // 保存和更新都是这个方法 ： 跟 SpringDataJpa 中的 save方法很像
      if (this.id === '') {
        gatheringApi.save(this.pojo).then(res => {
          // 提醒
          // alert(res.message)
          this.$message({
            message: res.message,
            type: (res.flag ? 'success' : 'error')
          })
          // 如果成功：关闭弹窗，刷新列表
          if (res.flag) {
            this.dialogVisible = false
            this.feachData()
          }
        })
      } else {
        // 更新
        gatheringApi.update(this.id, this.pojo).then(res => {
          // 提醒
          this.$message({
            message: res.message,
            type: (res.flag ? 'success' : 'error')
          })
          // 如果成功：关闭弹窗，刷新列表
          if (res.flag) {
            this.dialogVisible = false
            this.feachData()
          }
        })
      }
    },
    findById(obj) {
      // 第一种
      // alert(JSON.stringify(obj))
      // 给pojo赋值
      // this.pojo = obj
      // 弹窗
      // this.dialogVisible = true

      // 第二种：实时去查询数据回显
      gatheringApi.findById(obj.id).then(res => {
        // 成功： 赋值和弹窗
        if (res.flag) {
          this.pojo = res.data
          this.dialogVisible = true
          // 给id标记赋值
          this.id = obj.id
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    deleteById(id) {
      // alert(id)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '删除活动信息提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用api进行活动信息的删除
        gatheringApi.delete(id).then(res => {
          this.$message({
            type: (res.flag ? 'success' : 'error'),
            message: res.message
          })
          if (res.flag) {
            // 删除成功刷新列表
            this.feachData()
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
