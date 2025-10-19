import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { DailyStats, SubjectStats } from '@/types'
import { format, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface DailyChartProps {
  data: DailyStats[]
}

export const DailyChart = ({ data }: DailyChartProps) => {
  const chartData = {
    labels: data.map(d => format(parseISO(d.date), 'M/d(E)', { locale: ja })),
    datasets: [
      {
        label: '学習時間（分）',
        data: data.map(d => d.totalMinutes),
        backgroundColor: 'rgba(56, 178, 172, 0.6)',
        borderColor: 'rgba(56, 178, 172, 1)',
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '日別学習時間',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number | string) => `${value}分`
        }
      }
    }
  }

  return (
    <div className="h-64 md:h-80">
      <Bar data={chartData} options={options} />
    </div>
  )
}

interface SubjectChartProps {
  data: SubjectStats[]
}

export const SubjectChart = ({ data }: SubjectChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        データがありません
      </div>
    )
  }

  const colors = [
    'rgba(56, 178, 172, 0.8)',
    'rgba(99, 102, 241, 0.8)',
    'rgba(251, 146, 60, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(251, 191, 36, 0.8)',
    'rgba(239, 68, 68, 0.8)'
  ]

  const chartData = {
    labels: data.map(d => d.subject),
    datasets: [
      {
        label: '学習時間',
        data: data.map(d => d.totalMinutes),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map(c => c.replace('0.8', '1')),
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: '科目別学習時間',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed || 0
            const hours = Math.floor(value / 60)
            const mins = value % 60
            const timeStr = hours > 0 ? `${hours}時間${mins}分` : `${mins}分`
            return `${label}: ${timeStr}`
          }
        }
      }
    }
  }

  return (
    <div className="h-64 md:h-80">
      <Pie data={chartData} options={options} />
    </div>
  )
}
