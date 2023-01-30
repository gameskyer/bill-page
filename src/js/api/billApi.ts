import axios from '@/js/http/axios_http';
import qs from 'qs'




export function SelectBill(params: Object) {
  return axios({
    method: 'post',
    url: '/table/getTableData',
    data: params,
    headers: { 'content-type': 'application/json' },
  });
}
export function UpdateBillType(params: Object) {
  return axios({
    method: 'put',
    url: '/table/updateType',
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
export function GetBillStackedLine() {
  return axios({
    method: 'post',
    url: '/lineimg/getBillStackedLine',
    headers: { 'Content-Type': 'application/json' },
  });
}

// export function GetNoTypeData(params: Object) {
//   console.log("参数", params)
//   return axios.post('/table/getNoTypeData', null, {
//     headers: { 'Content-Type': 'application/json' } //加上这个
//   })
// }
export function GetNoTypeData(params: Object) {
  console.log(params)
  return axios({
    method: 'post',
    url: '/table/getNoTypeData',
    data: params,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
}

export async function GetBillTypeList() {
  return await axios.get('/table/getBillTypeList');
}

export async function GetBillDateList() {
  return await axios.get('/table/getDateList');
}