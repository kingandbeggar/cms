/**
 * 侧边导航关闭折叠控制
 */

function toggleSlide() {
  $('.nav > li > a').on('click', function () {
    let childMenu = $(this).next('ul');
    childMenu.slideToggle(400);
    let icon = childMenu.prev().find('.toggle');
    if (icon.hasClass('open')) {
      icon.removeClass('open').addClass('close');
    } else {
      icon.removeClass('close').addClass('open');
    }
  })

  // 默认第一个菜单展开
  $('.nav > li > a').eq(0).trigger('click');

  // 所有子菜单切换时加背景色
  $('.nav ul a').on('click', function () {
    $(this).addClass('active')
    $('.nav ul a').not($(this)).removeClass('active');
  })

}

toggleSlide();

//退出
const logout = document.querySelector('.logout a')
logout.addEventListener('click', () => {
  localStorage.removeItem('token')
  location.href = './login.html'
})
//初始化数据
const init = document.querySelector('.init')
init.addEventListener('click', () => {
  axios({
    method: 'get',
    url: '/init/data',
  }).then(({ data: res }) => {
    //成功回调
    if (res.code === 0) {
      TransformStream.success(res.message)
    }
    if (res.code === 1) {
      toastr.error(res.message)
    }
  })
})

