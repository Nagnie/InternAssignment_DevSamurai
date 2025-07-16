import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface ChartDataItem {
    date?: string
    month?: string
    count: number
    displayDate?: string
    displayMonth?: string
}

interface UserChartProps {
    stats: {
        chartData: {
            daily: ChartDataItem[]
            monthly: ChartDataItem[]
        }
    } | undefined
}

const UserChart: React.FC<UserChartProps> = ({ stats }) => {
    const [chartType, setChartType] = useState('daily')

    const formatDate = (dateString: string | number | Date): string => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const formatChartData = (data: ChartDataItem[] | undefined, type: string): ChartDataItem[] => {
        if (type === 'daily') {
            return data?.map(item => ({
                ...item,
                displayDate: item.date ? formatDate(item.date) : ''
            })) || []
        } else {
            return data?.map(item => ({
                ...item,
                displayMonth: item.month ? new Date(item.month + '-01').toLocaleDateString('vi-VN', {
                    month: 'short',
                    year: 'numeric'
                }) : ''
            })) || []
        }
    }

    const chartData = chartType === 'daily'
        ? formatChartData(stats?.chartData?.daily, 'daily')
        : formatChartData(stats?.chartData?.monthly, 'monthly')

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">User Registration Trends</CardTitle>
                    <div className="flex space-x-2">
                        <Button
                            variant={chartType === 'daily' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('daily')}
                        >
                            Daily
                        </Button>
                        <Button
                            variant={chartType === 'monthly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('monthly')}
                        >
                            Monthly
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'daily' ? (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="displayDate"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(label) => `Date: ${label}`}
                                    formatter={(value) => [value, 'Users']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        ) : (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="displayMonth"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(label) => `Month: ${label}`}
                                    formatter={(value) => [value, 'Users']}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserChart