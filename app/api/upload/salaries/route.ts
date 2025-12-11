import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { parseSalariesExcel } from '@/utils/excelParser'

export async function POST(request: NextRequest) {
  // 添加 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  // 处理 OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择要上传的文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, message: '请上传 Excel 文件（.xlsx 或 .xls 格式）' },
        { status: 400 }
      )
    }

    // 解析 Excel 文件
    const buffer = await file.arrayBuffer()
    const salaries = parseSalariesExcel(buffer)

    // 清空现有数据
    const { error: deleteError } = await supabaseAdmin
      .from('salaries')
      .delete()
      .gte('id', 0)

    if (deleteError) {
      throw new Error('清空现有数据失败：' + deleteError.message)
    }

    // 批量插入新数据
    const { error: insertError } = await supabaseAdmin
      .from('salaries')
      .insert(salaries)

    if (insertError) {
      throw new Error('插入数据失败：' + insertError.message)
    }

    return NextResponse.json({
      success: true,
      message: `成功上传 ${salaries.length} 条员工工资数据`
    }, { headers })

  } catch (error) {
    console.error('上传员工工资失败：', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '上传过程中发生未知错误'
      },
      { status: 500, headers }
    )
  }
}