'use client'

import { useState } from 'react'

export default function TestUploadPage() {
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setUploadResult(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/test-excel', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      setUploadResult(result)
    } catch (error) {
      setUploadResult({
        success: false,
        message: '上传失败: ' + String(error)
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">文件上传测试</h1>

        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择文件
            </label>
            <input
              type="file"
              name="file"
              accept=".xlsx,.xls"
              required
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            {uploading ? '上传中...' : '上传'}
          </button>
        </form>

        {uploadResult && (
          <div className={`mt-8 p-4 rounded-md ${
            uploadResult.success ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <h3 className="font-semibold mb-2">结果：</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}