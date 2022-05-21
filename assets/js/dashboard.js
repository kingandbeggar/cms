// 班级情况
axios({
  method: 'get',
  url: '/student/overview',
}).then(({ data: res }) => {
  //成功回调
  if (res.code === 0) {
    // console.log(res);
    document.querySelector('.total').innerHTML = res.data.total
    document.querySelector('.avgAge').innerHTML = res.data.avgAge
    document.querySelector('.avgSalary').innerHTML = res.data.avgSalary
    document.querySelector('.proportion').innerHTML = res.data.proportion
  }
})
pieData()
//扇形图
function pieData(data) {
  const mycharts = echarts.init(document.querySelector('.pie'))
  const option = {
    title: {
      text: '籍贯 Hometown',
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}<b>{c}</b>人 占比{d}%'
    },
    series: [
      {
        name: '各地人员分别',
        type: 'pie',
        radius: [20, 150],
        center: ['50%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 8
        },
        data: data
      }
    ]
  };
  mycharts.setOption(option)
}
//折线图
function lineData(salary, truesalary, user) {
  const mycharts = echarts.init(document.querySelector('.line'))
  const
    option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      legend: {},
      title: {
        text: '薪资 Salary',
        textStyle: {
          color: '#ccc'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: user
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 10
        }
      ],
      series: [
        {
          name: '期望薪资',
          type: 'line',
          symbol: 'none',
          sampling: 'lttb',
          smooth: true,
          data: salary
        },
        {
          name: '实际薪资',
          type: 'line',
          symbol: 'none',
          smooth: true,
          sampling: 'lttb',
          data: truesalary
        }
      ]
    };
  mycharts.setOption(option)

}
//柱形图
function barData(obj) {
  const mycharts = echarts.init(document.querySelector('.barChart'))
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    grid: { top: 30, bottom: 30, left: '7%', right: '7%' },
    legend: {},
    xAxis: [
      {
        type: 'category',
        data: obj.group,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        interval: 10,
        axisLabel: {
          formatter: '{value}分'
        }
      },
      {
        type: 'value',
        min: 0,
        max: 10,
        interval: 1,
        axisLabel: {
          formatter: '{value}人'
        }
      }
    ],
    series: [
      {
        name: '平均分',
        type: 'bar',
        barWidth: '15',
        yAxisIndex: 0,
        data: obj.avgScore
      },
      {
        name: '低于60的人',
        type: 'bar',
        barWidth: '15',
        yAxisIndex: 1,
        data: obj.lt60
      },
      {
        name: '60-80的人',
        type: 'bar',
        barWidth: '15',
        yAxisIndex: 1,
        data: obj.gt60
      },
      {
        name: '高于80的人',
        type: 'bar',
        barWidth: '15',
        yAxisIndex: 1,
        data: obj.gt80
      },

    ]
  };
  mycharts.setOption(option)
}
//地图

function mapData(map1, map2) {
  const mycharts = echarts.init(document.querySelector('.map'))

  // 位置 + 经纬度
  var chinaGeoCoordMap = map1;
  var chinaDatas = map2;

  var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = chinaGeoCoordMap[dataItem[0].name];
      var toCoord = [116.4551, 40.2539]; // 目标点经纬度（北京顺义校区）
      if (fromCoord && toCoord) {
        res.push([{
          coord: fromCoord,
          value: dataItem[0].value
        }, {
          coord: toCoord,
        }]);
      }
    }
    return res;
  };
  var series = [];
  [['顺义校区', chinaDatas]].forEach(function (item, i) {
    series.push({
      type: 'lines',
      zlevel: 2,
      effect: {
        show: true,
        period: 4, //箭头指向速度，值越小速度越快
        trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
        symbol: 'arrow', //箭头图标
        symbolSize: 5, //图标大小
      },
      lineStyle: {
        normal: {
          width: 1, //尾迹线条宽度
          opacity: 1, //尾迹线条透明度
          curveness: 0.2 //尾迹线条曲直度
        }
      },
      data: convertData(item[1])
    }, {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 2,
      rippleEffect: { //涟漪特效
        period: 4, //动画时间，值越小速度越快
        brushType: 'stroke', //波纹绘制方式 stroke, fill
        scale: 4 //波纹圆环最大限制，值越大波纹越大
      },
      label: {
        normal: {
          show: true,
          position: 'right', //显示位置
          offset: [5, 0], //偏移设置
          formatter: function (params) {//圆环显示文字
            return params.data.name;
          },
          fontSize: 12
        },
        emphasis: {
          show: true
        }
      },
      symbol: 'circle',
      symbolSize: function (val) {
        return 4 + val[2] * 5; //圆环大小
      },
      itemStyle: {
        normal: {
          show: false,
          color: '#f00'
        }
      },
      data: item[1].map(function (dataItem) {
        return {
          name: dataItem[0].name,
          value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
        };
      }),
    },
      //被攻击点
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          period: 4,
          brushType: 'stroke',
          scale: 4
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            offset: [5, 0],
            color: '#9eca7f', // 目标点文字颜色
            formatter: '{b}',
            textStyle: {
              color: "#9eca7f"
            }
          },
          emphasis: {
            show: true,
            color: "#f60", // 目标点鼠标移入的颜色
          }
        },
        symbol: 'pin',
        symbolSize: 50,
        data: [{
          name: item[0],
          value: chinaGeoCoordMap[item[0]].concat([10]),
        }],
      }
    );
  });

  let option = {
    title: {
      text: '来京路线 From',
      textStyle: {
        color: '#6d767e'
      }
    },
    // tooltip: {
    //   trigger: 'item',
    //   backgroundColor: 'rgba(166, 200, 76, 0.82)',
    //   borderColor: '#FFFFCC',
    //   showDelay: 0,
    //   hideDelay: 0,
    //   enterable: true,
    //   transitionDuration: 0,
    //   extraCssText: 'z-index:100',
    //   formatter: function (params, ticket, callback) {
    //     //根据业务自己拓展要显示的内容
    //     var res = "";
    //     var name = params.name;
    //     var value = params.value[params.seriesIndex + 1];
    //     res = "<span style='color:#fff;'>" + name + "</span><br/>数据：" + value;
    //     return res;
    //   }
    // },
    // backgroundColor: "#013954",
    // visualMap: { //图例值控制
    //   min: 0,
    //   max: 1,
    //   calculable: true,
    //   show: false,
    //   color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
    //   textStyle: {
    //     color: '#fff'
    //   }
    // },
    geo: {
      map: 'china',
      zoom: 1.2,
      label: {
        emphasis: {
          show: false
        }
      },
      roam: true, //是否允许缩放
      itemStyle: {
        normal: {
          // color: 'rgba(51, 69, 89, .5)', //地图背景色
          // color: '#5a6fc0', //地图背景色
          // borderColor: '#516a89', //省市边界线00fcff 516a89
          borderWidth: 1
        },
        emphasis: {
          color: 'rgba(37, 43, 61, .5)' //悬浮背景
        }
      }
    },
    series: series
  };

  mycharts.setOption(option)
}

//点击三个点
const btn = document.querySelector('.btn')
const batch = document.querySelector('#batch')
btn.addEventListener('click', () => {
  if (batch.style.display === 'none') {
    batch.style.display = 'block'
  } else {
    batch.style.display = 'none'
  }
})

//成绩
const lis = document.querySelectorAll('#batch li')
for (let i = 0; i < lis.length; i++) {

  lis[i].addEventListener('click', () => {
    axios({
      method: 'get',
      url: '/score/batch',
      params: { batch: i + 1 }
    }).then(({ data: res }) => {
      //成功回调
      // console.log(res.data);
      barData(res.data)
    })
  })
}
lis[0].click()

//其他三个
axios({
  method: 'get',
  url: '/student/list',
}).then(({ data: res }) => {
  //成功回调
  if (res.code === 0) {
    // console.log(res);
    let data = []
    let user = []
    let salary = []
    let truesalary = []

    let map1 = {
      "顺义校区": [
        116.4551,
        40.2539
      ]
    }
    let map2 = [
    ]
    res.data.forEach(item => {
      let num = data.findIndex(ele => ele.name == item.province)
      if (num == -1) {
        data.push({ value: '1', name: item.province })
      } else {
        data[num].value++
      }
      salary.push(item.salary)
      user.push(item.name)
      truesalary.push(item.truesalary)
      map1[item.county] = [item.jing, item.wei]
      let a = map2.findIndex(ele => ele[0].name == item.county)
      if (a == -1) {
        map2.push([{ name: item.county, value: 1 }])

      } else {
        map2[a][0].value++
      }

    })
    console.log(map1, map2);
    pieData(data)
    lineData(salary, truesalary, user)
    mapData(map1, map2)
  }
})