<template>
  <div id="myChart" :style="{ width: '100%', height: '1000px' }"></div>
  <div class="demo-progress">
    <div v-for="value in arr">
      <label>{{ value.billTypeName }}</label>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="value.percentage" :color="value.color" />
    </div>
  </div>
</template>
<style scoped>
.demo-progress .el-progress--line {
  margin-top: 5px;
  margin-bottom: 15px;
  width: 100%;
}

.demo-progress>>>.el-progress-bar__innerText {
  color: rgba(0, 0, 0);
}

.demo-progress>>>.el-progress-bar__outer {
  background-color: rgba(128, 126, 126, 0.2);
}
</style>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { ref, unref, reactive } from 'vue';
import { GetBillStackedLine, GetPercentage } from '@/js/api/billApi';
import { typeColor } from '@/js/api/commonUtil';
export default {
  setup () {
    const datas = reactive({ arr: [] });

    GetPercentage('').then((res) => {
      for (var i = 0; i < res.data.length; i++) {
        var name = res.data[i].billTypeName
        res.data[i].color = typeColor.get(name)

      }
      datas.arr = res.data;
    });


    return datas;
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
            ob2.itemStyle = { color: typeColor.get(respJSON[i].billTypeName) }
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
