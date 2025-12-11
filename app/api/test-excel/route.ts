import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: '请选择文件' },
        { status: 400 }
      )
    }

    // 读取文件
    const buffer = await file.arrayBuffer()
    console.log('File size:', buffer.byteLength)

    // 使用 XLSX 解析
    let workbook
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' })
    } catch (e) {
      console.error('XLSX read error:', e)
      throw new Error('无法读取 Excel 文件: ' + String(e))
    }

    console.log('Workbook sheets:', workbook.SheetNames)

    // 读取第一个工作表
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 转换为 JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    console.log('Excel data (first 5 rows):', jsonData.slice(0, 5))

    // 解析数据
    const headers = jsonData[0] as string[]
    const dataRows = jsonData.slice(1) as any[]

    // 检查必需的列
    const requiredColumns = ['city_name', 'year', 'base_min', 'base_max', 'rate']
    const hasColumns = requiredColumns.map(col =>
      headers.some(h => String(h).toLowerCase().includes(col.toLowerCase()))
    )

    return NextResponse.json({
      success: true,
      message: 'Excel 文件解析成功',
      data: {
        headers,
        totalRows: dataRows.length,
        hasRequiredColumns: hasColumns,
        sampleData: dataRows.slice(0, 3)
      }
    })

  } catch (error) {
    console.error('Excel parsing error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '解析失败: ' + (error instanceof Error ? error.message : String(error))
      },
      { status: 500 }
    )
  }
}