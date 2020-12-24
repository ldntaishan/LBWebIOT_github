<template>
  <el-row :gutter="40" class="panel-group">

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="max-width: 360px">
      <div class="card-panel" @click="handleIndexSensorNumber()">
        <div class="card-panel-icon-wrapper color-red1">
          <svg-icon icon-class="alert" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            报警数:
          </div>
          <count-to :start-val="0" :end-val="indexSensorNumber.alertTotal" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="margin-left:15px;margin-top: 15px;">
      <div class="card-panel" style="border-radius: 10px;" @click="handleIndexSensorNumber()">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            停用数:
          </div>
          <count-to :start-val="0" :end-val="indexSensorNumber.disableTotal" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col> -->
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="max-width: 360px">
      <div class="card-panel" @click="handleIndexSensorNumber()">
        <div class="card-panel-icon-wrapper color-green1">
          <svg-icon icon-class="normal" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            正常数:
          </div>
          <count-to :start-val="0" :end-val="indexSensorNumber.normalTotal" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="max-width: 360px">
      <div class="card-panel" @click="handleIndexSensorNumber()">
        <div class="card-panel-icon-wrapper color-gray1">
          <svg-icon icon-class="offline3" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            掉线数:
          </div>
          <count-to :start-val="0" :end-val="indexSensorNumber.offlineTotal" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="max-width: 360px">
      <div class="card-panel" @click="handleIndexSensorNumber() ">
        <div class="card-panel-icon-wrapper color-blue1">
          <svg-icon icon-class="node-red" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            点位总数:
          </div>
          <count-to :start-val="0" :end-val="indexSensorNumber.allTotal" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {
  index_sensor_number
  // update_useState
} from '@/api/article'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      timer: null,
      indexSensorNumber: {
        'allTotal': 0,
        'disableTotal': 0,
        'alertTotal': 0,
        'offlineTotal': 0,
        'normalTotal': 0
      }
    }
  },
  created() {
    this.handleIndexSensorNumber()
    this.timer = setInterval(() => {
      setTimeout(this.handleIndexSensorNumber, 0)
    }, 1000 * 6)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {

    handleIndexSensorNumber() {
      index_sensor_number().then(response => {
        this.indexSensorNumber = response
        // console.log(response.randomValue)
        // this.indexSensorNumber.allTotal=response.randomValue
      })
    }
  }
  // activated() {
  //   console.log("执行activated")
  //    // if(timer==null){
  //      this.timer = setInterval(() => {
  //        setTimeout(this.handleIndexSensorNumber, 0)
  //      }, 1000 * 3)
  //    // }
  // },
  // deactivated() {
  //   console.log("执行activated")
  //   clearInterval(this.timer);
  //   this.timer = null;
  // },

}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .color-red1 {
          background: #d81e06;
        }
        .color-green1 {
          background: #29cc40;
        }
        .color-gray1 {
          background: #919491;
        }
        .color-blue1 {
          background: #2589ef;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .color-red1 {
        color: #d81e06;
      }
      .color-green1 {
        color: #29cc40;
      }
      .color-gray1 {
        color: #919491;
      }
      .color-blue1 {
        color: #2589ef;
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
