import { NextRequest, NextResponse } from 'next/server'
import { calculateSocialInsurance } from '@/utils/calculator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cityName, year } = body

    if (!cityName || !year) {
      return NextResponse.json(
        { success: false, message: '请选择城市和年份' },
        { status: 400 }
      )
    }

    // 执行计算
    const result = await calculateSocialInsurance(cityName, year)

    return NextResponse.json(result)

  } catch (error) {
    console.error('计算失败：', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '计算过程中发生未知错误'
      },
      { status: 500 }
    )
  }
}