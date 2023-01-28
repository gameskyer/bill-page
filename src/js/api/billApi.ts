// import axios from '@/js/http/axios_http';


import { ComponentInternalInstance, getCurrentInstance } from "vue";
const currentInstance = getCurrentInstance();
console.log(currentInstance)
const { $axios } = currentInstance!.appContext.config.globalProperties;


export function SelectBill(params: Object) {
  return $axios({
    method: 'post',
    url: '/table/getTableData',
    data: params,
    headers: { 'Content-Type': 'application/json' },
  });
}
export function UpdateBillType(params: Object) {
  return $axios({
    method: 'put',
    url: '/table/updateType',
    data: params,
    headers: { 'Content-Type': 'application/json' },
  });
}
export function GetTableHeader(params: Object) {
  return $axios({
    method: 'get',
    url: '/tableHeader',
  });
}
export function GetBillStackedLine() {
  return $axios({
    method: 'post',
    url: '/lineimg/getBillStackedLine',
    headers: { 'Content-Type': 'application/json' },
  });
}
export function GetNoTypeData(params: Object) {
  return $axios({
    method: 'post',
    url: '/table/getNoTypeData',
    data: params,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GetBillTypeList() {
  return await $axios.get('/table/getBillTypeList');
}

export async function GetBillDateList() {
  return await $axios.get('/table/getDateList');
}