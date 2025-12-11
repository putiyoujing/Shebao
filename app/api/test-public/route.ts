import { NextResponse } from 'next/server'
import { supabasePublic } from '@/lib/supabase-public'

export async function GET() {
  try {
    console.log('Testing with public client...')

    // 使用匿名客户端测试
    const { data, error } = await supabasePublic
      .from('cities')
      .select('count', { count: 'exact' })

    if (error) {
      console.error('Public client error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Public client 连接成功',
      citiesCount: data[0]?.count || 0
    })
  } catch (error) {
    console.error('Test public error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: String(error)
    })
  }
}