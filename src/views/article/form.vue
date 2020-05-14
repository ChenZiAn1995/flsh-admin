<template>
  <div class="app-container">
    <el-card class="app-card">
      <el-form ref="articleForm" size="mini" :model="articleForm" label-width="100px" class="app-el-form">
        <el-form-item label="文章标题">
          <el-input :disabled="isDisabled" v-model="articleForm.art_title" />
        </el-form-item>
        <el-form-item label="文章副标题">
          <el-input :disabled="isDisabled" v-model="articleForm.art_desc" />
        </el-form-item>
        <el-form-item label="文章主图 ">
          <div class="avatar-wrap">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <el-upload
              v-else
              class="avatar-upload"
              accept="image/jpeg,image/gif,image/png,image/bmp"
              action="fakerAction"
              :show-file-list="false"
              :http-request="uploadSectionFile"
            >
              <i class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select :disabled="isDisabled" v-model="articleForm.cat_id" clearable style="width: 100%" size="mini" placeholder="请选择文章分类">
            <el-option
              v-for="item in categoryData"
              :key="item.cat_name"
              :label="item.cat_name"
              :value="item.cat_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="app-editor">
            <mavon-editor :disabled="isDisabled"  v-model="articleForm.art_content" :editable="type !== 3" :default-open="type === 3?'preview':'edit'" :toolbars="toolbars" code-style="monokai-sublime" :subfield="false" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button v-if="type===1" v-permission="['10011000']" type="primary" @click="submitArticle">立即创建</el-button>
          <el-button v-if="type===2" v-permission="['10011002']" type="primary" @click="submitArticle">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { toolbars } from '@/utils/dictionary'
import { addOrUpdateArt, getArticleList } from '@/api/blog'
export default {
  data() {
    return {
      type: '',
      toolbars,
      articleForm: {
        art_title: '',
        art_desc: '',
        art_content: '',
        art_cover: '',
        cat_id: '',
        art_id: this.$route.params.id || ''
      },
      postData: {},
      imgUrl: ''
    }
  },
  computed: {
    ...mapGetters(['categoryData', 'loading']),
    isDisabled: function() {
      return this.type === 3
    }
  },
  mounted() {
    this.type = this.$route.meta.type
    if (this.type !== 1) {
      this.getArticleData({ art_id: this.$route.params.id, page: 1, pageSize: 1 })
    }
  },
  methods: {
    // 根据id获取文章详情
    getArticleData(params) {
      getArticleList(params).then(res => {
        console.log(res)
        const blogData = res.data.blogData[0]
        this.articleForm = blogData
        this.imgUrl = blogData.art_cover
      })
    },
    // 上传图片
    async uploadSectionFile(params) {
      const file = params.file
      const fileType = file.type
      const isImage = fileType.indexOf('image') !== -1
      const isLt2M = file.size / 1024 / 1024 < 2
      // 这里常规检验，看项目需求而定
      if (!isImage) {
        this.$message.error('只能上传图片格式png、jpg、gif!')
        return
      }
      if (!isLt2M) {
        this.$message.error('只能上传图片大小小于2M')
        return
      }
      const token = await this.getQiniuToken()
      // 根据后台需求数据格式
      const form = new FormData()
      // 文件对象
      form.append('file', file)
      form.append('token', token)
      this.$http.post('https://up-z2.qiniup.com', form).then(res => {
        this.imgUrl = `http://image.chenzian.cn/${res.key}`
        this.articleForm.art_cover = this.imgUrl
      }).catch(err => {
        console.log(err)
      })
    },
    getQiniuToken() {
      return new Promise((resolve, reject) => {
        this.$http.post('/utils/getQiniuToken').then((res) => {
          resolve(res.data.token)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    submitArticle() {
      addOrUpdateArt(this.articleForm).then(res => {
        if (res.resCode === '0000') {
          this.$message({
            type: 'success',
            message: res.msg || '添加成功'
          })
          this.goBack()
        }
      })
    },
    goBack() {
      this.$router.push({ name: 'ArticleList' })
    }

  }

}
</script>

<style lang="scss" scoped>
.article-conver {
  width: 400px;
}
.avatar-wrap {
  width: 400px;
  overflow: hidden;
  height: 250px;
}
.avatar-upload {
  width: 400px;
  overflow: hidden;
  height: 250px;
  border: 1px solid #dadada;
}
.avatar-upload:hover {
  border: 1px solid #bababa;
}
.avatar-upload /deep/ .el-upload {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}
.avatar-wrap .avatar {
  width:100%;
  height:100%;
  user-select: none;
  cursor: pointer;
}
</style>