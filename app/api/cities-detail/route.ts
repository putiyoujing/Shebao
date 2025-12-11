import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('*')
      .limit(10)

    if (error) {
      console.error('查询城市数据失败:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error) {
    console.error('获取城市列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}