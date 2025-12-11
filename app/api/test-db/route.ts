import { NextResponse } from 'next/server'

export async function GET() {
  const result = {
    envVars: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'missing',
      supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'exists' : 'missing',
      supabaseService: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing',
    },
    nodeEnv: process.env.NODE_ENV
  }

  // 测试创建 Supabase 客户端
  try {
    const { createClient } = require('@supabase/supabase-js')
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    result['supabaseClient'] = 'created'

    // 尝试连接
    const { data, error } = await client.from('cities').select('count', { count: 'exact' })

    if (error) {
      result['connectionError'] = error.message
      result['connectionDetails'] = {
        message: error.message,
        hint: error.hint,
        code: error.code
      }
    } else {
      result['connectionSuccess'] = true
      result['citiesCount'] = data[0]?.count || 0
    }
  } catch (e: any) {
    result['supabaseClientError'] = e.message
  }

  return NextResponse.json(result)
}