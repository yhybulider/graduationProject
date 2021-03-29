<template>
  <div id="app">
    电流页面
    <div id="main" style="width: 600px; height: 400px">测试</div>
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
      this.setChart();
    },
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("main")); // console.log(this.chart) // 指定图表的配置项和数据
      var option = {
        title: {
          text: "电流分布",
        },
        tooltip: {},
        grid: {
            top: 100,
            left: '20%',
            right: '15%',
            bottom: '1%',
            containLabel: true
          },
        legend: {
          data: ['电流数据', '电流'],
            textStyle:{
               fontSize: 16,
              color: 'green',
            }
        },
        xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu']
    
          
        },
        yAxis: {
         
        },
        series: [
          {
            name: "电流",
            type: "bar",
            data: this.currdata,
          },
          {
              name:"电流数据",
              type: "line",
              data: this.currdata,
          }
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped>
</style>