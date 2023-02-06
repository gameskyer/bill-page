<template>
  <el-form :inline="true" :model="ruleForm" class="demo-form-inline">
    <el-form-item label="日期" prop="date"></el-form-item>
    <el-cascader v-model="value" :options="dateList" />

    </el-form-item>
    <el-button>清除</el-button>

  </el-form>
  <div id="myChart" :style="{ width: '100%', height: '1000px' }"></div>

</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { FormInstance } from 'element-plus';
import { ref, unref, reactive } from 'vue-demi';
import { GetBillStackedLine, GetBillDateList } from '@/js/api/billApi';
export default {
  setup () {
    const dateList = ref();
    const ruleForm = reactive({
      date: ''
    });
    // GetBillDateList().then((res) => {
    //   let arr = new Array();
    //   for (var data of res.data) {
    //     let obj = new Object();
    //     obj = data
    //     arr.push(obj);
    //   }
    //   // Object.keys(res.data).forEach((key) => {
    //   //   let obj = new Object();
    //   //   obj = res.data[key];
    //   //   arr.push(obj);
    //   // });
    //   // console.log(res.data)
    //   dateList.value = arr;
    //   console.log(dateList.value)
    // });
    return ruleForm, dateList
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
  methods: {
    // handleChange: function (value) {
    //   var date = ""
    //   for (const aa of value) {
    //     date += aa
    //   }
    //   ruleForm.date = date
    //   console.log(value)
    // },
    // resetForm: function (formEl) {
    //   if (!formEl) return;
    //   formEl.resetFields();
    // }
  }
};
</script>
