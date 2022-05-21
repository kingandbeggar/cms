const register = document.querySelector('.register')
const register_a = document.querySelector('.register a')
const login = document.querySelector('.login')
const login_a = document.querySelector('.login a')
register_a.addEventListener('click', () => {
  register.style.display = 'none'
  login.style.display = 'block'
})
login_a.addEventListener('click', () => {
  // register.querySelector('[name="username"]').value = ''
  // register.querySelector('[name="password"]').value = ''
  register.style.display = 'block'
  login.style.display = 'none'
})
//注册
const resform = document.querySelector('.register form')
resform.addEventListener('submit', function (e) {
  e.preventDefault()
  axios({
    method: 'post',
    url: '/api/register',
    data: $(this).serialize(),
  }).then(({ data: res }) => {
    console.log(11);
    //成功回调
    if (res.code === 0) {
      console.log(res);
      register_a.click()
    }
  })
})
//登录
const loginform = document.querySelector('.login form')
loginform.addEventListener('submit', function (e) {
  e.preventDefault()
  axios({
    method: 'post',
    url: '/api/login',
    data: $(this).serialize(),
  }).then(({ data: res }) => {
    //成功回调
    if (res.code === 0) {
      console.log(res);
      localStorage.setItem('token', res.token)
      location.href = './index.html'
    }
  })
})
