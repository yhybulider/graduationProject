<template>
  <div id="app">
    Current Detection
      <div id="time">
      {{ dateFormat(date) }} <span style="color: #f00">{{ weather }}</span
      ><span v-if="lower">{{ lower }}~{{ higher }}</span>
    </div>
    <div id="main" style="width: 1500px; height: 600px; display: inline">
      测试
    </div>

    <div id="secmain" style="width: 1500px; height: 600px; display: inline">
      测试2
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
      tempdata:[],
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
        this.tempdata = res1.temp;
      }
      this.setChart2();
      this.setChart();
    },
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("main")); // console.log(this.chart) // 指定图表的配置项和数据

      var option = {
        title: {
          text: "电流环境分析—（单位：℃/A）",
          textStyle: {
            color: "blue",
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
            top: 65,
            left: "15%",
        },
        legend: {
          data: [
            {
              name:"温度",
              textStyle:{
                color:"red"
              }
          }, {
            name:"电流数据",
            textStyle:{
                color:"black"
              }
          }],
          textStyle: {
            fontSize: 16,
            y: "center", //延Y轴居中
            x: "left", //居右显示
          },
        },
        xAxis: {
           data: ["Mon", "Tue", "Wed", "Thu","Fri","Sat","Sun"],
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
            name: "电流数据",
            type: "bar",
            data: this.currdata,
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
            name: "温度",
            type: "line",
            smooth: true,
            data: this.tempdata,
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
    setChart2() {
      this.chart2 = echarts.init(document.getElementById("secmain")); // console.log(this.chart) // 指定图表的配置项和数据
      var option2 = {
        title: {
          text: "电流检测(单位:A)",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "15%",
         
        },
        legend: {
          data: ["电流"],
          textStyle: {
            fontSize: 16,
            color: "green",
          },
        },
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu","Fri","Sat","Sun"],
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
            name: "电流",
            type: "bar",
            data: this.currdata,
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
          // {
          //   name: "操作id",
          //   type: "line",
          //   smooth: true,
          //   data: this.id,
          // },
        ],
      };
      this.chart2.setOption(option2);
      window.addEventListener("resize", function () {
        this.chart2.resize();
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