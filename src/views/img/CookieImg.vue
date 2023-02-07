<template>
  <el-cascader v-model="value" :options="dateList" @change="handleChange" clearable />
  <div id="myChart" :style="{ width: '100%', height: '1000px' }"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import router from '../../router';
import { GetCookieImtData, GetBillDateList } from '@/js/api/billApi'
import { ref, unref } from 'vue';
export default {

  setup () {
    const dateList = ref();
    GetBillDateList().then((res) => {
      let arr = new Array();
      for (var data of res.data) {
        let obj = new Object();
        obj = data
        arr.push(obj);
      }
      dateList.value = arr;
    });
    return { dateList }
  },
  mounted () {
    this.drawLine();
  },
  methods: {
    handleChange: function (value) {
      var date2 = ""
      if (!value) {
        this.drawLine();
      } else {
        for (const aa of value) {
          date2 += aa
        }
        this.drawLine(date2);
      }
    },
    drawLine (data) {
      GetCookieImtData(data).then(function (response) {
        var echartsData = '[';
        response.data.forEach((element) => {
          let node =
            '{"value":' +
            element.billPrice +
            ',"name":"' +
            element.billTypeName +
            '"},';
          echartsData += node;
        });
        echartsData = echartsData.substring(
          0,
          echartsData.length - 1
        );
        echartsData = echartsData + ']';
        let jsonData = JSON.parse(echartsData);

        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(
          document.getElementById('myChart')
        );
        myChart.setOption({
          tooltip: {
            trigger: 'item',
          },
          legend: {
            top: '5%',
            left: 'center',
          },
          //圆角
          // itemStyle: {
          // 	borderRadius: 8,
          // 	borderColor: '#fff',
          // 	borderWidth: 4,
          // },
          series: [
            {
              name: '消费',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                //高亮扇区和标签样式配置
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold', //字体粗细
                },
              },
              labelLine: {
                show: false,
              },
              data: jsonData,
            },
          ],
        });
        myChart.on('click', function (parm) {
          console.log('parm', parm.name);
          router.push({
            name: 'BillByType',
            params: { type: parm.name },
          }).herf;
        });
      })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
        });
    },
  },
};
</script>
