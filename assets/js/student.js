function renderstudent() {
  axios({
    method: 'get',
    url: '/student/list',
  }).then(({ data: res }) => {
    //成功回调
    if (res.code === 0) {
      // console.log(res);
      let arr = []
      res.data.map(item => arr.push(`
      <tr>
        <th scope="row">${item.id}</th>
        <td>${item.name}</td>
        <td>${item.age}</td>
        <td>${item.sex}</td>
        <td>${item.group}</td>
        <td>${item.phone}</td>
        <td>${item.salary}</td>
        <td>${item.truesalary}</td>
        <td>${item.city + item.province + item.county}</td>
        <td>
          <button data-id="${item.id}" type="button" class="interface btn btn-primary btn-sm" data-bs-toggle="modal"
            data-bs-target="#updateModal">修改</button>
          <button data-id="${item.id}" type="button" class="btn btn-danger btn-sm del">删除</button>
        </td>
      </tr>
      `))
      document.querySelector('tbody').innerHTML = arr.join('')
    }
  })
}
renderstudent()




function place(id) {
  const province = document.querySelector(`#${id} [name="province"]`)
  const county = document.querySelector(`#${id} [name="county"]`)
  const city = document.querySelector(`#${id} [name="city"]`)
  axios({
    method: 'get',
    url: '/geo/province',
  }).then(({ data: res }) => {
    //成功回调
    console.log(res);
    let arr = ['<option selected value="">--省--</option>']
    arr.push(res.map(item => `<option value="${item}">${item}</option>`))
    province.innerHTML = arr.join('')


  })
  province.addEventListener('change', function () {
    county.innerHTML = '<option selected value="">--区--</option>'

    if (this.value === '') return city.innerHTML = `<option selected value="">--市--</option>`
    let pname = this.value
    axios({
      method: 'get',
      url: '/geo/city',
      params: { pname },
    }).then(({ data: res }) => {
      //成功回调
      console.log(res);
      let arr = ['<option selected value="">--市--</option>']
      arr.push(res.map(item => `<option value="${item}">${item}</option>`))
      city.innerHTML = arr.join('')

    })
  })

  city.addEventListener('change', function () {
    if (this.value === '') return
    let pname = province.value
    let cname = city.value
    axios({
      method: 'get',
      url: '/geo/county',
      params: { pname, cname },
    }).then(({ data: res }) => {
      //成功回调
      console.log(res);
      let arr = ['<option selected value="">--区--</option>']
      arr.push(res.map(item => `<option value="${item}">${item}</option>`))
      county.innerHTML = arr.join('')

    })
  })
}
place('updateModal')
place('addModal')

// 删除
document.querySelector('tbody').addEventListener('click', function (e) {
  if (!e.target.classList.contains('del')) return
  axios({
    method: 'DELETE',
    url: '/student/delete',
    params: { id: e.target.dataset.id },
  }).then(({ data: res }) => {
    //成功回调
    if (res.code === 0) {
      toastr.success('删除成功')
      renderstudent()
    }
  })
})


//修改
document.querySelector('tbody').addEventListener('click', function (e) {
  if (!e.target.classList.contains('interface')) return
  axios({
    method: 'get',
    url: '/student/one',
    params: { id: e.target.dataset.id },
  }).then(({ data: res }) => {
    //成功回调
    if (res.code === 0) {
      console.log(res);
      document.querySelector('#updateModal [name="name"]').value = res.data.name
      document.querySelector('#updateModal [name="id"]').value = res.data.id
      document.querySelector('#updateModal [name="age"]').value = res.data.age
      document.querySelector('#updateModal [name="phone"]').value = res.data.phone
      document.querySelector('#updateModal [name="group"]').value = res.data.group
      document.querySelector('#updateModal [name="salary"]').value = res.data.salary
      document.querySelector('#updateModal [name="truesalary"]').value = res.data.truesalary
      const lis = document.querySelectorAll('#updateModal [name="sex"]')
      lis.forEach(item => item.checked = item.value == res.data.sex)

      document.querySelector('#updateModal [name="province"]').value = res.data.province
      document.querySelector('#updateModal [name="city"]').innerHTML = `<option selected value="${res.data.city}">${res.data.city}</option>`
      document.querySelector('#updateModal [name="county"]').innerHTML = `<option selected value="${res.data.county}">${res.data.county}</option>`

    }
  })
  document.querySelector('#updateModal form').addEventListener('submit', function (e) {
    e.preventDefault()
    axios({
      method: 'put',
      url: '/student/update',
      data: $(this).serialize(),
    }).then(({ data: res }) => {
      //成功回调
      if (res.code === 0) {
        toastr.success('修改成功')
        document.querySelector('#updateModal .btn-close').click()
        renderstudent()
      }
    })
  })
})

document.querySelector('#addModal form').addEventListener('submit', function (e) {
  e.preventDefault()
  axios({
    method: 'post',
    url: '/student/add',
    data: $(this).serialize(),
  }).then(({ data: res }) => {
    //成功回调
    if (res.code === 0) {
      toastr.success('添加成功')
      document.querySelector('#addModal .btn-close').click()
      renderstudent()
    }
  })
})

