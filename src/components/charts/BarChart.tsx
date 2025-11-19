import ReactECharts from 'echarts-for-react';

interface BarChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#1d1d1f',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.name),
      axisLine: {
        lineStyle: {
          color: '#d2d2d7',
        },
      },
      axisLabel: {
        color: '#6e6e73',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#6e6e73',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        data: data.map((item) => item.value),
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: '#ff6000',
        },
        emphasis: {
          itemStyle: {
            color: '#ff7a26',
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
};
