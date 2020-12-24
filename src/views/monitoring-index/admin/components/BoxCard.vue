<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
<!--      <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">-->
      <img src="@/assets/gifacc/fengche01.gif">
    </div>
    <div style="position:relative;">
      <mallki class-name="mallki-text" text="" />
      <pan-thumb :image="avatar" class="panThumb" align="left" />

      <div align="justify" style="padding-top:40px;" class="progress-item" >
        <span>报警数</span>
        <el-tag type="danger" style="margin-left:10px;margin-right: 10px ">35</el-tag>

        <span>掉线数</span>
        <el-tag type="info" style="margin-left:10px ;margin-right: 10px">13590</el-tag>
      </div>
      <div align="justify" style="padding-top:10px;" class="progress-item" >
        <span>初始化</span>
        <el-tag type="warning" style="margin-left:10px;margin-right: 10px ">135</el-tag>

        <span>正常数</span>
        <el-tag type="success" style="margin-left:10px ;margin-right: 10px">5</el-tag>
<!--        <el-progress :percentage="100" status="success" text-inside="true" show-text="false"/>-->
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { PanThumb, Mallki },

  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
