import { NextRequest, NextResponse } from 'next/server'
import { getCalculationResults } from '@/utils/calculator'

export async function GET(request: NextRequest) {
  try {
    const result = await getCalculationResults()

    return NextResponse.json(result)

  } catch (error) {
    console.error('获取结果失败：', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : '获取结果时发生未知错误'
      },
      { status: 500 }
    )
  }
}