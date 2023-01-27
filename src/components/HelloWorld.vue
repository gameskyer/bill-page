<template>
	<div class="hello">
		<h1>
			查询共{{ count }}条消费记录，共计消费{{
				priceSum
			}}元，平局每笔消费{{ priceAvg }}元
		</h1>
	</div>
</template>

<script>
export default {
	name: 'HelloWorld',
	props: {
		count: Number,
		priceSum: Number,
		priceAvg: Number,
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
