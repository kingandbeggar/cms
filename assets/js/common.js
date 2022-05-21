axios.defaults.baseURL = 'http://itcbc.com:8000';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers['Authorization'] = localStorage.getItem('token')
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么

  return response;
}, function (error) {
  // 对响应错误做点什么  
  // console.dir(error);
  if (error.response.data.message == '身份认证失败') {
    toastr.error('抱歉，身份认证失败')
    if (location.href.indexOf('index.html') !== -1) {
      location.href = './login.html'
    } else {
      window.parent.location.href = './login.html'
    }
  } else {
    toastr.error(error.response.data.message)
  }
  return Promise.reject(error);
});