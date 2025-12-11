import Link from 'next/link'
import { Upload, FileSpreadsheet } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          五险一金计算器
        </h1>
        <p className="text-center text-gray-600 mb-12">
          根据员工工资和城市社保标准，快速计算公司应缴纳的社保公积金费用
        </p>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* 数据上传卡片 */}
          <Link
            href="/upload"
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-8 cursor-pointer border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                数据上传
              </h2>
              <p className="text-gray-600 leading-relaxed">
                上传城市标准和员工工资数据<br />
                支持 Excel 格式文件
              </p>
            </div>
          </Link>

          {/* 结果查询卡片 */}
          <Link
            href="/results"
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-8 cursor-pointer border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                结果查询
              </h2>
              <p className="text-gray-600 leading-relaxed">
                查看已计算的公司缴纳费用<br />
                支持多维度数据筛选
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
