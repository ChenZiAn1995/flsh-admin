<template>
    <div class="app-container">
        <el-card class="app-card">
            <div class="app-search">
                <el-row :gutter="20">
                    <el-col :xs="24" :sm="12" :md="6" :xl="4">
                        <el-input
                            v-model="searchForm.keyword"
                            :disabled="loading"
                            size="mini"
                            placeholder="请输入文章标题模糊搜索"
                            clearable
                            @change="getData"
                        />
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="6" :xl="4">
                        <el-select
                            v-model="searchForm.categoryId"
                            :disabled="loading"
                            clearable
                            style="width: 100%"
                            size="mini"
                            placeholder="请选择文章分类"
                            @change="getData"
                        >
                            <el-option
                                v-for="item in categoryData"
                                :key="item.catName"
                                :label="item.catName"
                                :value="item.id"
                            />
                        </el-select>
                    </el-col>
                </el-row>
            </div>
            <div class="app-table">
                <el-table v-loading="loading" :data="tableData" border size="mini" style="width: 100%">
                    <el-table-column prop="artTitle" label="文章标题" width="180" align="center" />
                    <el-table-column prop="artDesc" label="文章副标题" width="180" align="center" />
                    <el-table-column prop="artCover" label="文章主图" align="center">
                        <template slot-scope="scope">
                            <el-image :src="scope.row.artCover" lazy>
                                <div slot="placeholder" class="image-slot">
                                    加载中<span class="dot">...</span>
                                </div>
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="artContent" label="文章内容" align="center" :show-overflow-tooltip="true" />
                    <el-table-column prop="catName" label="文章分类" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column prop="updateTime" label="更新时间" align="center" />
                    <el-table-column prop="statusName" label="文章状态" align="center" />
                    <el-table-column label="操作" align="center" width="240">
                        <template slot-scope="scope">
                            <el-button
                                v-permission="['10011001']"
                                size="mini"
                                type="text"
                                @click="enterForm(scope.row)"
                            >详情
                            </el-button>
                            <el-button v-permission="['10011005']" size="mini" type="text">恢复</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="app-pagination">
                <el-pagination
                    layout="prev, pager, next"
                    :current-page.sync="searchForm.page"
                    :page-size="searchForm.pageSize"
                    :total="searchForm.total"
                    @current-change="getData"
                />
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { articleStatus } from '@/utils/dictionary'
import { getArticleList } from '@/api/blog'
import { parseTime } from '@/utils/index'

export default {
    name: 'Index',
    data() {
        return {
            searchForm: {
                keyword: '',
                status: 0,
                categoryId: '',
                page: 1,
                pageSize: 10,
                isLastPage: false,
                lastPage: '',
                total: 0
            },
            tableData: [],
            articleStatus: articleStatus.slice(1)
        }
    },
    computed: {
        ...mapGetters(['categoryData', 'loading'])
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            getArticleList(this.searchForm).then(res => {
                const { blogData, total, lastPage, isLastPage } = res.data
                this.tableData = blogData.map(item => {
                    item.statusName = this.$getValueToKey('articleStatus', { value: item.artStatus })
                    item.create_time = parseTime(item.createTime)
                    item.update_time = parseTime(item.updateTime)
                    return item
                })
                this.searchForm.total = total
                this.searchForm.lastPage = lastPage
                this.searchForm.isLastPage = isLastPage
            })
        },
        enterForm(row) {
            this.$router.push({ path: `/article/detail/${row.artId}`, query: { status: 'recycle' }})
        }
    }
}
</script>

<style scoped>

</style>
