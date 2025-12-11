import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// 验证环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  const health = {
    status: 'ok',
    checks: {} as any,
    timestamp: new Date().toISOString()
  }

  // 检查环境变量
  health.checks.env = {
    hasUrl: !!supabaseUrl,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
    hasKey: !!supabaseKey,
    keyLength: supabaseKey ? supabaseKey.length : 0
  }

  // 检查 Supabase 连接
  try {
    console.log('Testing Supabase connection...')

    // 首先尝试简单的连接测试
    const { error: testError } = await supabaseAdmin
      .from('cities')
      .select('id')
      .limit(1)

    if (testError) {
      throw new Error(`连接失败: ${testError.message}`)
    }

    // 获取城市数量
    const { data, error } = await supabaseAdmin.from('cities').select('count', { count: 'exact' })
    if (error) throw error

    health.checks.supabase = {
      status: 'ok',
      citiesCount: data[0]?.count || 0,
      message: '连接成功'
    }
  } catch (error) {
    console.error('Supabase health check error:', error)
    health.checks.supabase = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any).code,
      details: (error as any).details
    }
    health.status = 'error'
  }

  // 检查必需的环境变量
  const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    health.checks.env = {
      status: 'error',
      missing: missingVars
    }
    health.status = 'error'
  } else {
    health.checks.env = { status: 'ok' }
  }

  const statusCode = health.status === 'ok' ? 200 : 500
  return NextResponse.json(health, { status: statusCode })
}