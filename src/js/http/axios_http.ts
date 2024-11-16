import axios from "axios"
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: 'http://localhost:8004',
  // url = base url + request url
  // withCredentials: true, 
  // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(function (config) {
  //在发送请求之前做某件事

  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});


// response interceptor
service.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data.message;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default service