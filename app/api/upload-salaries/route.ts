import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { parseSalariesExcel } from '@/utils/excelParser'
import { Salary } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: '未找到文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, message: '仅支持 Excel 文件格式' },
        { status: 400 }
      )
    }

    // 解析 Excel 文件
    const buffer = await file.arrayBuffer()
    const salaries = parseSalariesExcel(buffer)

    if (!salaries || salaries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Excel 文件中没有有效的工资数据' },
        { status: 400 }
      )
    }

    // 清空现有数据
    const { error: deleteError } = await supabaseAdmin
      .from('salaries')
      .delete()
      .neq('id', 0) // 删除所有数据

    if (deleteError) {
      console.error('清空工资数据失败:', deleteError)
      return NextResponse.json(
        { success: false, message: '清空现有数据失败' },
        { status: 500 }
      )
    }

    // 插入新数据
    const { data, error: insertError } = await supabaseAdmin
      .from('salaries')
      .insert(salaries)
      .select()

    if (insertError) {
      console.error('插入工资数据失败:', insertError)
      return NextResponse.json(
        { success: false, message: '插入数据失败: ' + insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `成功导入 ${salaries.length} 条工资数据`,
      data: data
    })

  } catch (error) {
    console.error('上传工资数据失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '上传失败'
      },
      { status: 500 }
    )
  }
}