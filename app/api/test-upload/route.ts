import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 添加 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // 尝试解析 FormData
    const formData = await request.formData()
    const file = formData.get('file') as File

    // 调试信息
    console.log('File received:', file?.name)
    console.log('File size:', file?.size)
    console.log('File type:', file?.type)

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: '请选择要上传的文件',
          debug: {
            hasFormData: !!formData,
            formDataKeys: formData ? Array.from(formData.keys()) : []
          }
        },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 简单验证
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        {
          success: false,
          message: '请上传 Excel 文件（.xlsx 或 .xls 格式）'
        },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 返回成功信息（不实际处理文件）
    return NextResponse.json({
      success: true,
      message: `文件 ${file.name} 接收成功，大小: ${(file.size / 1024).toFixed(2)} KB`,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Test upload error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '上传失败: ' + (error instanceof Error ? error.message : String(error)),
        error: String(error)
      },
      { status: 500 }
    )
  }
}