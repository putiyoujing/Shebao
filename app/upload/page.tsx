'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calculator, CheckCircle, AlertCircle } from 'lucide-react'
import CitySelector from '@/components/CitySelector'
import FileUpload from '@/components/FileUpload'

export default function UploadPage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [calculating, setCalculating] = useState(false)
  const [calculateStatus, setCalculateStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // 上传城市标准数据
  const uploadCities = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-cities', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    return result
  }

  // 上传员工工资数据
  const uploadSalaries = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-salaries', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    return result
  }

  // 执行计算
  const handleCalculate = async () => {
    if (!selectedCity) {
      setCalculateStatus({
        type: 'error',
        message: '请先选择城市'
      })
      return
    }

    setCalculating(true)
    setCalculateStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cityName: selectedCity,
          year: selectedYear
        })
      })

      const result = await response.json()
      setCalculateStatus({
        type: result.success ? 'success' : 'error',
        message: result.message
      })
    } catch (error) {
      setCalculateStatus({
        type: 'error',
        message: error instanceof Error ? error.message : '计算失败'
      })
    } finally {
      setCalculating(false)
    }
  }

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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">数据上传与管理</h1>

        {/* 城市选择区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">选择计算城市和年份</h2>
          <CitySelector
            value={selectedCity}
            onChange={setSelectedCity}
            onYearChange={setSelectedYear}
          />
        </div>

        {/* 文件上传区域 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <FileUpload
            onUpload={uploadCities}
            title="上传城市标准数据"
            description="上传各城市的社保缴费基数和费率标准"
            exampleText="提示：Excel 文件应包含列：city_name(城市名)、year(年份)、base_min(基数下限)、base_max(基数上限)、rate(费率)"
          />

          <FileUpload
            onUpload={uploadSalaries}
            title="上传员工工资数据"
            description="上传员工各月份的工资金额信息"
            exampleText="提示：Excel 文件应包含列：employee_id(员工ID)、employee_name(员工姓名)、month(月份，YYYYMM格式)、salary_amount(工资金额)"
          />
        </div>

        {/* 计算按钮区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">执行计算</h2>
          <button
            onClick={handleCalculate}
            disabled={calculating || !selectedCity}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
              calculating || !selectedCity
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Calculator className="mr-2 h-5 w-5" />
            {calculating ? '正在计算...' : '执行计算并存储结果'}
          </button>

          {/* 计算状态提示 */}
          {calculateStatus.type && (
            <div className={`mt-4 flex items-center space-x-2 p-4 rounded-md ${
              calculateStatus.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {calculateStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm">{calculateStatus.message}</p>
            </div>
          )}
        </div>

        {/* 操作提示 */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">操作流程说明：</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>选择目标城市和年份</li>
            <li>上传城市标准数据文件（cities.xlsx）</li>
            <li>上传员工工资数据文件（salaries.xlsx）</li>
            <li>点击"执行计算并存储结果"按钮</li>
            <li>计算完成后，可在"结果查询"页面查看计算结果</li>
          </ol>
        </div>
      </div>
    </main>
  )
}