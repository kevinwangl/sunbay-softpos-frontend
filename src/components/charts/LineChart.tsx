import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  data: { date: string; score: number }[];
  xField: string;
  yField: string;
  height?: number;
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xField,
  yField,
  height = 300,
  title,
}) => {
  const xData = data.map((item) => item[xField as keyof typeof item]);
  const yData = data.map((item) => item[yField as keyof typeof item]);

  const option = {
    title: title
      ? {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: '#1d1d1f',
          },
        }
      : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
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
      boundaryGap: false,
      data: xData,
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
      axisLabel: {
        color: '#666',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#d9d9d9',
        },
      },
      axisLabel: {
        color: '#666',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: yData,
        lineStyle: {
          width: 3,
          color: '#1890ff',
        },
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(24, 144, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.05)',
              },
            ],
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: `${height}px` }} />;
};
