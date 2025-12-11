import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // 添加测试城市数据
    const cities = [
      { city_name: '北京', year: '2024', base_min: 6326, base_max: 33891, rate: 0.17 },
      { city_name: '上海', year: '2024', base_min: 7310, base_max: 36549, rate: 0.165 },
      { city_name: '广州', year: '2024', base_min: 5284, base_max: 26421, rate: 0.155 },
      { city_name: '深圳', year: '2024', base_min: 3523, base_max: 26421, rate: 0.155 },
      { city_name: '佛山', year: '2024', base_min: 3958, base_max: 21048, rate: 0.15 }
    ]

    const { error: citiesError } = await supabaseAdmin
      .from('cities')
      .upsert(cities, { onConflict: 'city_name, year' })

    if (citiesError) throw citiesError

    return NextResponse.json({
      success: true,
      message: `成功添加 ${cities.length} 个城市数据`
    })
  } catch (error) {
    console.error('Seed data error:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}