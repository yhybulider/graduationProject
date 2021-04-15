<template>
  <div id="app">
    <div id="time">
      {{ dateFormat(date) }} <span style="color: #f00">{{ weather }}</span
      ><span v-if="lower">{{ lower }}~{{ higher }}</span>
    </div>
    <div id="main" style="width: 1500px; height: 600px; display: inline">
      图表1
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  created() {
    this.getAllEcharts();
    this.getWeather();
  },
  data() {
    return {
      chart: null,
      chart2: null,
      id: [],
      currdata: [],
      voltdata:[],
      totaldata: [],
      createtime: [],
      date: new Date(),
    };
  },
  methods: {
    getWeather() {
      this.$http
        .get("http://wthrcdn.etouch.cn/weather_mini?city=珠海")
        .then((res) => {
          this.weather = res.data.data.forecast[0].type
            ? res.data.data.forecast[0].type
            : "";
          this.lower = res.data.data.forecast[0].low.substr(2);
          this.higher = res.data.data.forecast[0].high.substr(2);
          console.log(res.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async getAllEcharts() {
      const { data: res1 } = await this.$http.get("getSpyData");
      console.log(res1);
      if (res1) {
        this.currdata = res1.curr;
        this.id = res1.id;
        this.voltdata = res1.volt;
        this.createtime  = res1.time;

        for (let i = 0; i < this.currdata.length; i++) {
             this.totaldata[i] = (this.currdata[i] * this.voltdata[i] * 10  / 1000).toFixed(2);
        }
      }

      this.setChart();
    },
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("main")); // console.log(this.chart) // 指定图表的配置项和数据

      var option = {
        title: {
          text: "用电量检测—（单位：kW·h/A）",
          x: "left",
          y: "1px",
          textStyle: {
            color: "#3A7BD5",
            fontSize: 18,
          },
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 60,
          left: "15%",
          //   right: "15%",
          //   bottom: "10%",
          //   containLabel: true,
          // right: "37%",
        },
        legend: {
          data: [
            {
              name:"电流",
              textStyle:{
                color:"red"
              }
          }, {
            name:"用电量数据",
            textStyle:{
                color:"black"
              }
          }],
          textStyle: {
            fontSize: 16,
            orient: "vertical", //垂直显示
            y: "center", //延Y轴居中
            x: "left", //居右显示
          },
        },
        xAxis: {
          data: this.createtime,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              fontSize: "12",
              color: "green",
            },
          },
        },
        series: [
          {
            name: "用电量数据",

            type: "line",
            data: this.totaldata,
            lineStyle: {
                width: 5,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#fe9a'
                    },
                    {
                        offset: 1,
                        color: '#fe9a8b'
                    }
                ]),
                shadowColor: 'rgba(254,154,139, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20
            },
            itemStyle: {
              normal: {
                color: "#d3c5b0",
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "black",
                    fontSize: 16,
                  },
                },
              },
            },
          },
          {
            name: "电流",
            type: "line",
            smooth: true,
            data: this.currdata,
            lineStyle: {
                width: 5,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#ff2400'
                    },
                    {
                        offset: 1,
                        color: '#ff4d40'
                    }
                ]),
                shadowColor: 'rgba(254,154,139, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20
            },
            label: {
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "red",
                fontSize: 13,
              },
            },
          },
        ],
      };

      this.chart.setOption(option);
      window.addEventListener("resize", function () {
        this.chart.resize();
      });
      window.onresize = function () {
        this.chart2.resize();
      };
    },
  
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
  },
  mounted() {
    //显示当前日期时间
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date(); // 修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
};
</script>

<style scoped>
.app {
  height: 70%;
}
#time {
  float: right;
}
</style>