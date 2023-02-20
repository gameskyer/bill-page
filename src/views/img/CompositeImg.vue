<template>
  <div id="myChart" :style="{ width: '100%', height: '1000px' }"></div>
  <div class="demo-progress">
    <div v-for="value in arr"> <label>{{ value.title }}</label>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="value.percentageNub" color="#aaa" />
    </div>

    <el-progress :text-inside="true" :stroke-width="20" :percentage="70" color="#aaa" />
    <el-progress :text-inside="true" :stroke-width="20" :percentage="100" status="success" />
    <el-progress :text-inside="true" :stroke-width="20" :percentage="80" status="warning" />
    <el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="exception" />
  </div>
</template>
<style scoped>
.demo-progress .el-progress--line {
  margin-top: 5px;
  margin-bottom: 15px;
  width: 100%;
}
</style>
<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { ref, unref } from 'vue';
import { GetBillStackedLine } from '@/js/api/billApi';
export default {
  setup () {
    const datas = {
      arr: [
        {
          title: '星期一',
          percentageNub: 90
        }, {
          title: '星期二',
          percentageNub: 10

        }, {
          title: '星期三',
          percentageNub: 30

        }

      ]
    }
    return datas
  },
  async mounted () {
    const data = ref();
    await GetBillStackedLine().then((res) => {
      data.value = res.data;
    });
    const json2 = unref(data);
    var dom = document.getElementById('myChart');
    var myChart = echarts.init(dom);
    var app = {};

    var seriesData = new Array();
    var datas = json2.billStackedLineType;
    for (var i = 0; i < datas.length; i++) {
      var ob = new Object();
      ob.name = datas[i].billType;
      ob.type = 'bar';
      ob.stack = 'Search Engine';
      ob.emphasis = {
        focus: 'series',
      };
      var intArr = new Array();
      for (var j = 0; j < datas[i].billStackedLineData.length; j++) {
        intArr.push(
          datas[i].billStackedLineData[j] === 0
            ? null
            : datas[i].billStackedLineData[j]
        );
      }
      ob.data = intArr;
      seriesData.push(ob);
    }
    seriesData.push({
      type: 'pie',
      id: 'pie',
      radius: '30%',
      center: ['50%', '25%'],
      emphasis: {
        focus: 'self',
      },
      label: {
        formatter: '{b}:({d}%)',
      },
    });

    var option;
    setTimeout(function () {
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '55%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: json2.billDate,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: seriesData,
      };
      myChart.on('click', 'series', async function (event) {
        const data3 = ref([]);
        await axios({
          method: 'get',
          url:
            'http://127.0.0.1:8004/cookieimg/CookieImgByBillType/' +
            event.name,
        }).then((res) => {
          var respData = new Array();
          var respJSON = res.data;
          for (var i = 0; i < respJSON.length; i++) {
            var ob2 = new Object();
            ob2.value = respJSON[i].billPrice;
            ob2.name = respJSON[i].billTypeName;
            respData.push(ob2);
          }
          data3.value = respData;
        });
        myChart.setOption({
          series: [
            {
              id: 'pie',
              label: {
                show: true,
                formatter: '{b}:{c}--{d}%',
              },
              labelLine: {
                show: true,
              },
              data: data3.value,
            },
          ],
        });
      });
      myChart.setOption(option);
    });
    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
  },
};
</script>
