import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { parseCitiesExcel } from '@/utils/excelParser'

export async function POST(request: NextRequest) {
  try {
    // 添加 CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error('FormData parse error:', error)
      return NextResponse.json(
        { success: false, message: '无法解析上传的文件数据' },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择要上传的文件' },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, message: '请上传 Excel 文件（.xlsx 或 .xls 格式）' },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 解析 Excel 文件
    let cities
    try {
      console.log('开始解析 Excel 文件:', file.name)
      cities = await parseCitiesExcel(file)
      console.log('Excel 解析成功，城市数量:', cities.length)
    } catch (parseError) {
      console.error('Excel 解析错误:', parseError)
      return NextResponse.json(
        {
          success: false,
          message: 'Excel 文件解析失败：' + (parseError instanceof Error ? parseError.message : String(parseError))
        },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 清空现有数据
    const { error: deleteError } = await supabaseAdmin
      .from('cities')
      .delete()
      .gte('id', 0)

    if (deleteError) {
      throw new Error('清空现有数据失败：' + deleteError.message)
    }

    // 批量插入新数据
    const { error: insertError } = await supabaseAdmin
      .from('cities')
      .insert(cities)

    if (insertError) {
      throw new Error('插入数据失败：' + insertError.message)
    }

    return NextResponse.json({
      success: true,
      message: `成功上传 ${cities.length} 条城市标准数据`
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('上传城市标准失败：', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '上传过程中发生未知错误'
      },
      {
        status: 500,
        headers: corsHeaders
      }
    )
  }
}