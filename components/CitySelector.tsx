'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CitySelectorProps {
  value: string
  onChange: (city: string) => void
  onYearChange: (year: string) => void
  disabled?: boolean
}

const years = ['2024', '2023', '2022']

export default function CitySelector({ value, onChange, onYearChange, disabled = false }: CitySelectorProps) {
  const [cities, setCities] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState('2024')
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // 获取城市列表
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch('/api/cities')
        const result = await response.json()

        if (result.success) {
          console.log('加载城市列表:', result.cities)
          setCities(result.cities)
          // 如果没有选中城市，选择第一个
          if (!value && result.cities.length > 0) {
            console.log('自动选择第一个城市:', result.cities[0])
            onChange(result.cities[0])
          }
        }
      } catch (error) {
        console.error('获取城市列表失败：', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [value, onChange])

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    onYearChange(year)
  }

  const handleCitySelect = (city: string) => {
    onChange(city)
    setIsOpen(false)
  }

  return (
    <div className="flex space-x-4">
      {/* 城市选择器 */}
      <div className="relative flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          选择城市
        </label>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm
            ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}
          `}
        >
          <span className="block truncate text-gray-900">
            {loading ? '加载中...' : (value || '请选择城市')}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </span>
        </button>

        {isOpen && !disabled && !loading && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {cities.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-3 text-gray-500">
                暂无城市数据
              </div>
            ) : (
              cities.map((city) => (
                <div
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50
                    ${value === city ? 'bg-blue-100 font-semibold' : ''}
                  `}
                >
                  <span className={`block truncate text-gray-900 ${value === city ? 'font-semibold' : ''}`}>
                    {city}
                  </span>
                  {value === city && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 年份选择器 */}
      <div className="w-32">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          选择年份
        </label>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          disabled={disabled}
          className="block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-900 shadow-sm
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm
            disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}