<template>
	<div id="main" :style="{ width: '100%', height: '1000px' }"></div>
</template>

<script lang="ts">
import * as echarts from 'echarts';
import { forIn } from 'lodash';
import { json } from 'stream/consumers';
import { ref, reactive, unref } from 'vue-demi';
import { GetBillStackedLine } from '@/js/api/billApi';
export default {
	created() {},
	mounted() {
		type BillStackedLineType = {
			billType: string;
			billStackedLineData: Array<string | number | Date>;
		};
		type BillData = {
			billType: Array<string | number | Date>;
			billDate: (string | number | Date)[];
			billStackedLineType: Array<BillStackedLineType>;
		};

		type EChartsOption = echarts.EChartsOption;

		var chartDom = document.getElementById('main')!;
		var myChart = echarts.init(chartDom);
		var option: EChartsOption = {};

		setTimeout(async function () {
			const data = reactive<BillData>({
				billType: [],
				billDate: [],
				billStackedLineType: [] as BillStackedLineType[],
			});
			//使用async await同步获取数据
			await GetBillStackedLine().then((res) => {
				Object.assign(data, res.data as BillData);
			});
			//图形数据
			let sourceData: Array<Array<string | number | Date>> = [];
			//拼接数据
			let arr: BillStackedLineType[] = [];
			arr = data.billStackedLineType as BillStackedLineType[];
			let date: (string | number | Date)[] = [];
			date.push('product');
			date = date.concat(data.billDate as (string | number | Date)[]);
			sourceData.push(date);
			const newArr: Array<string | number | Date> = [];

			for (let i in arr) {
				let arr2: Array<string | number | Date> = [];
				arr2.push(arr[i].billType);
				for (let j in arr[i].billStackedLineData) {
					let one: string | number | Date =
						arr[i].billStackedLineData[j];
					arr2.push(one);
				}
				sourceData.push(arr2);
			}
			let seriesData:
				| echarts.SeriesOption
				| echarts.SeriesOption[]
				| undefined = [];
			for (var i = 1; i < sourceData.length; i++) {
				seriesData.push({
					type: 'line',
					smooth: true,
					seriesLayoutBy: 'row',
					emphasis: { focus: 'series' },
				});
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
					show: true,
					formatter: '{b}: {@[2019-07]} ({d}%)',
				},
				encode: {
					itemName: 'product',
					value: '2019-07',
					tooltip: '2019-07',
				},
			});
			option = {
				legend: {},
				tooltip: {
					trigger: 'axis',
					showContent: false,
				},
				dataset: {
					source: sourceData,
				},
				xAxis: { type: 'category' },
				yAxis: { gridIndex: 0 },
				grid: { top: '55%' },
				series: seriesData,
			};

			myChart.on('updateAxisPointer', function (event: any) {
				const xAxisInfo = event.axesInfo[0];

				if (xAxisInfo) {
					const dimension = xAxisInfo.value + 1;
					myChart.setOption<echarts.EChartsOption>({
						series: {
							id: 'pie',
							label: {
								formatter: '{b}: {@[' + dimension + ']} ({d}%)',
							},
							encode: {
								value: dimension,
								tooltip: dimension,
							},
						},
					});
				}
			});

			myChart.setOption<echarts.EChartsOption>(option);
		});

		option && myChart.setOption(option);
	},
	methods: {},
};
</script>
