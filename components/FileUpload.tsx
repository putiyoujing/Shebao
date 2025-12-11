'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onUpload: (file: File) => Promise<{ success: boolean; message: string }>
  title: string
  description: string
  acceptedFileTypes?: string[]
  exampleText?: string
}

export default function FileUpload({
  onUpload,
  title,
  description,
  acceptedFileTypes = ['.xlsx', '.xls'],
  exampleText
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles
  } = useDropzone({
    onDrop: async (files) => {
      if (files.length === 0) return

      const file = files[0]
      setUploading(true)
      setUploadStatus({ type: null, message: '' })

      try {
        const result = await onUpload(file)
        setUploadStatus({
          type: result.success ? 'success' : 'error',
          message: result.message
        })

        // 清空文件列表
        if (result.success) {
          acceptedFiles.length = 0
        }
      } catch (error) {
        setUploadStatus({
          type: 'error',
          message: error instanceof Error ? error.message : '上传失败'
        })
      } finally {
        setUploading(false)
      }
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: uploading
  })

  const removeFile = () => {
    acceptedFiles.length = 0
    setUploadStatus({ type: null, message: '' })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {exampleText && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">{exampleText}</p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600">正在上传...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? '松开鼠标上传文件'
                : '点击或拖拽文件到此区域'
              }
            </p>
            <p className="text-xs text-gray-500">
              支持 {acceptedFileTypes.join(', ')} 格式
            </p>
          </div>
        )}
      </div>

      {/* 显示已选择的文件 */}
      {acceptedFiles.length > 0 && (
        <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {acceptedFiles[0].name}
              </p>
              <p className="text-sm text-gray-500">
                {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="ml-3 flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 显示上传状态 */}
      {uploadStatus.type && (
        <div className={`mt-4 flex items-center space-x-2 p-3 rounded-md ${
          uploadStatus.type === 'success'
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <p className="text-sm">{uploadStatus.message}</p>
        </div>
      )}
    </div>
  )
}