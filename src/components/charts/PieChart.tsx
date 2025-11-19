import ReactECharts from 'echarts-for-react';

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
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
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      left: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: data,
      },
    ],
    color: ['#ff6000', '#52c41a', '#faad14', '#1890ff', '#722ed1'],
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
};
