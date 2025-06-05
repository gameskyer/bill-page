<template>
  <div id="myChart" :style="{ width: '100%', height: '1000px' }"></div>
  <div id="category" :style="{ width: '100%', height: '500px' }"></div>

</template>


<script>
import * as echarts from 'echarts';
import axios from '@/js/http/axios_http';

import { ref, unref, reactive } from 'vue';
import { GetBillStackedLine, GetPercentage } from '@/js/api/billApi';
import { typeColor } from '@/js/api/commonUtil';
export default {
  setup () {
    const datas = reactive({ arr: [] });
    GetPercentage("").then((res) => {
      console.log(res)
      for (var i = 0; i < res.data.length; i++) {
        var name = res.data[i].billTypeName
        res.data[i].color = typeColor.get(name)
      }
      datas.arr = res;
    });
    return datas;
  },

  async mounted () {



    var chartDoms = document.getElementById('category');
    var categoryChart = echarts.init(chartDoms);
    var categoryOption;

    const category = ref([]);
    const categoryAxis = ref([]);

    for (let i = 0; i < 5; ++i) {
      category.value.push(Math.round(Math.random() * 200));
    }
    categoryOption = {
      xAxis: {
        max: 'dataMax'
      },
      yAxis: {
        type: 'category',
        data: categoryAxis.value,
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        // max: 2 // only the largest 3 bars will be displayed
      },
      series: [
        {
          realtimeSort: true,
          name: 'X',
          type: 'bar',
          data: category.value,
          label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
        }
      ],
      legend: {
        show: true
      },
      animationDuration: 0,
      animationDurationUpdate: 3000,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear'
    };


    categoryOption && categoryChart.setOption(categoryOption);






    const data = ref();
    await GetBillStackedLine().then((res) => {
      data.value = res.data;
    });
    const json2 = unref(data);
    var dom = document.getElementById('myChart');
    var myChart = echarts.init(dom);
    

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
    setTimeout(() => {
      option = {
        toolbox: {
          feature: {
            magicType: {
              type: ['line', 'bar'] //图表类型切换
            },
            icon: "circle"
          },
        },
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
        if (event.name == 'undefined') {
          event.name = '';
        }
        const data3 = ref([]);
        await axios({
          method: 'get',
          url:
            'http://127.0.0.1:8004/cookieimg/CookieImgByBillType/' +
            event.name,
        }).then((res) => {

          GetPercentage(event.name).then((res) => {
            console.log(res)

            categoryAxis.value = []
            category.value = []
            for (var i = 0; i < res.data.length; i++) {
              var name = res.data[i].billTypeName
              res.data[i].color = typeColor.get(name)
            }
            datas.arr = res
          });
          var respData = new Array();
          var respJSON = res;
          console.log(respJSON)

          for (var i = 0; i < respJSON.length; i++) {
            var ob2 = new Object();
            categoryAxis.value.push(respJSON[i].billTypeName)
            category.value.push(respJSON[i].billPrice)
            ob2.value = respJSON[i].billPrice;
            ob2.name = respJSON[i].billTypeName;
            ob2.itemStyle = { color: typeColor.get(respJSON[i].billTypeName) }
            ob2.label = { color: typeColor.get(respJSON[i].billTypeName) }
            respData.push(ob2);
          }
          data3.value = respData;
        });
        categoryChart.setOption({
          yAxis: {
            type: 'category',
            data: categoryAxis.value,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            // max: 2 // only the largest 3 bars will be displayed
          },
          series: [
            {
              type: 'bar',
              data: category.value,
            }
          ]
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
