import axios from 'axios';

export function SelectBill(params: Object) {
	return axios({
		method: 'post',
		url: '/SelectBill',
		data: params,
		headers: { 'Content-Type': 'application/json' },
	});
}

export function GetTableHeader(params: Object) {
	return axios({
		method: 'get',
		url: '/tableHeader',
	});
}

export async function GetBillTypeList() {
	return await axios.get('/getBillTypeList');
}
export function GetBillStackedLine() {
	return axios({
		method: 'post',
		url: '/getBillStackedLine',
		headers: { 'Content-Type': 'application/json' },
	});
}
