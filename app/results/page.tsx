'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, RefreshCw, AlertCircle } from 'lucide-react'
import { exportToExcel } from '@/utils/excelParser'

interface Result {
  id: number
  employee_id: string
  employee_name: string
  city_name: string
  year: string
  avg_salary: number
  contribution_base: number
  company_fee: number
  calculated_at?: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // 获取计算结果
  const fetchResults = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/results')
      const result = await response.json()

      if (result.success) {
        setResults(result.data)
      } else {
        setError(result.message || '获取数据失败')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取数据时发生错误')
    } finally {
      setLoading(false)
    }
  }

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // 导出 Excel
  const handleExport = () => {
    const exportData = results.map(r => ({
      员工ID: r.employee_id,
      员工姓名: r.employee_name,
      城市: r.city_name,
      年份: r.year,
      年度月平均工资: r.avg_salary,
      缴费基数: r.contribution_base,
      公司应缴金额: r.company_fee,
      计算时间: formatDateTime(r.calculated_at || '')
    }))

    exportToExcel(exportData, `社保计算结果_${new Date().toLocaleDateString()}`)
  }

  useEffect(() => {
    fetchResults()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 返回链接 */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>

        {/* 页面标题和操作按钮 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">计算结果</h1>
          <div className="flex space-x-4">
            <button
              onClick={fetchResults}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新数据
            </button>
            <button
              onClick={handleExport}
              disabled={results.length === 0 || loading}
              className="flex items-center px-4 py-2 bg-blue-600 border border-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              导出 Excel
            </button>
          </div>
        </div>

        {/* 数据表格 */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-lg mb-4">暂无计算结果</p>
              <Link
                href="/upload"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                前往上传数据并进行计算
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      员工ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      员工姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      城市
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      年份
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      年度月平均工资
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      缴费基数
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      公司应缴金额
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      计算时间
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.employee_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.city_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ¥{result.avg_salary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ¥{result.contribution_base.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
                        ¥{result.company_fee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(result.calculated_at || '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      合计
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                      ¥{results.reduce((sum, r) => sum + r.company_fee, 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">员工人数</h3>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">平均应缴金额</h3>
              <p className="text-2xl font-bold text-gray-900">
                ¥{(results.reduce((sum, r) => sum + r.company_fee, 0) / results.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">总应缴金额</h3>
              <p className="text-2xl font-bold text-green-600">
                ¥{results.reduce((sum, r) => sum + r.company_fee, 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}