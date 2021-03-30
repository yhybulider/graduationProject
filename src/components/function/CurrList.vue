<template>
  <div id="app">
    Current Detection
    <div id="main" style="width: 800px; height: 400px">测试</div>

    <div id="secmain" style="width: 800px; height: 400px">测试2</div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  created() {
    this.getAllEcharts();
  },
  data() {
    return {
      chart: null,
      chart2: null,
      id: [],
      currdata: [],
    };
  },
  methods: {
    async getAllEcharts() {
      const { data: res1 } = await this.$http.get("getSpyData");
      console.log(res1);
      if (res1) {
        this.currdata = res1.curr;
        this.id = res1.id;
      }
      this.setChart2();
      this.setChart();
    },
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("main")); // console.log(this.chart) // 指定图表的配置项和数据

      var option = {
        title: {
          text: "电流分布(单位:A)",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          //   top: 10,
          //   left: "20%",
          //   right: "15%",
          //   bottom: "10%",
          //   containLabel: true,
          right: "37%",
         
        },
        legend: {
          data: ["电流数据", "电流"],
          textStyle: {
            fontSize: 16,
            color: "green",
          },
        },
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu"],
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
          {
            name: "电流数据",
            type: "line",
            smooth: true,
            data: this.currdata,
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
          text: "电流分布(单位:A)",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          right: "37%",
         
        },
        legend: {
          data: ["电流数据", "电流"],
          textStyle: {
            fontSize: 16,
            color: "green",
          },
        },
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu"],
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
            data: this.id,
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
            name: "电流数据",
            type: "line",
            smooth: true,
            data: this.id,
          },
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
  },
};
</script>

<style scoped>
.app {
  height: 70%;
}
</style>