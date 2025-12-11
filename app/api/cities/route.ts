import { NextRequest, NextResponse } from 'next/server'
import { getCityList } from '@/utils/calculator'

export async function GET(request: NextRequest) {
  try {
    const result = await getCityList()

    return NextResponse.json(result)

  } catch (error) {
    console.error('获取城市列表失败：', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '获取城市列表时发生未知错误'
      },
      { status: 500 }
    )
  }
}