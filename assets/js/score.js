function render() {
  axios({
    method: 'get',
    url: '/score/list',
  }).then(({ data: res }) => {
    //成功回调
    if (res.code === 0) {
      // console.log(res);
      let item = []
      for (let k in res.data) {
        // console.log(k, res.data[k]);
        item.push(`
        <tr>
          <th scope="row">${k}</th>
          <td>${res.data[k].name}</td>
          <td data-id="${k}" index=1 class="score">${res.data[k].score[0]}</td>
          <td data-id="${k}" index=2 class="score">${res.data[k].score[1]}</td>
          <td data-id="${k}" index=3 class="score">${res.data[k].score[2]}</td>
          <td data-id="${k}" index=4 class="score">${res.data[k].score[3]}</td>
          <td data-id="${k}" index=5 class="score">${res.data[k].score[4]}</td>

        </tr>`)
      }
      document.querySelector('tbody').innerHTML = item.join('')
    }
  })
}
render()

document.querySelector('tbody').addEventListener('click', function (e) {
  if (!e.target.classList.contains('score')) return
  if (!/^\d{1,3}$/.test(e.target.innerHTML) && e.target.innerHTML !== 'null') return
  let num = e.target.innerHTML
  let input = document.createElement('input')
  input.value = num
  e.target.innerHTML = ''
  e.target.append(input)
  input.focus()
  input.addEventListener('blur', function () {
    e.target.innerHTML = num

  })
  input.addEventListener('keyup', function (ev) {
    if (ev.key !== 'Enter') return
    axios({
      method: 'post',
      url: '/score/entry',
      data: {
        "stu_id": e.target.dataset.id,
        "batch": e.target.getAttribute('index'),
        "score": this.value
      },
    }).then(({ data: res }) => {
      //成功回调
      if (res.code === 0) {
        toastr.success('修改成功')
        render()
      }
    })
  })

})
