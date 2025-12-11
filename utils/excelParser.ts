import * as XLSX from 'xlsx'
import { City, Salary } from '@/types/database'

// 解析城市标准 Excel 文件（服务端版本）
export function parseCitiesExcel(buffer: ArrayBuffer): Omit<City, 'id'>[] {
  try {
    // 将 ArrayBuffer 转换为 Uint8Array
    const uint8Array = new Uint8Array(buffer)
    const workbook = XLSX.read(uint8Array, { type: 'array' })

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Excel 文件中没有工作表')
    }

    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

    if (!jsonData || jsonData.length === 0) {
      throw new Error('Excel 文件中没有数据')
    }

    // 转换数据格式
    const cities: Omit<City, 'id'>[] = jsonData.map((row: any) => ({
      city_name: String(row.city_name || row.城市名 || '').trim(),
      year: String(row.year || row.年份 || '').trim(),
      base_min: Number(row.base_min || row.基数下限 || 0),
      base_max: Number(row.base_max || row.基数上限 || 0),
      rate: Number(row.rate || row.费率 || 0),
    }))

    // 验证数据完整性
    const invalidRows = cities.filter(city =>
      !city.city_name ||
      !city.year ||
      isNaN(city.base_min) ||
      isNaN(city.base_max) ||
      isNaN(city.rate)
    )

    if (invalidRows.length > 0) {
      console.error('无效的城市数据行:', invalidRows)
      throw new Error('城市标准文件格式错误：请确保所有字段都已正确填写')
    }

    return cities
  } catch (error) {
    console.error('Excel 解析错误:', error)
    throw new Error('解析城市标准文件失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 解析员工工资 Excel 文件（服务端版本）
export function parseSalariesExcel(buffer: ArrayBuffer): Omit<Salary, 'id'>[] {
  try {
    // 将 ArrayBuffer 转换为 Uint8Array
    const uint8Array = new Uint8Array(buffer)
    const workbook = XLSX.read(uint8Array, { type: 'array' })

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Excel 文件中没有工作表')
    }

    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

    if (!jsonData || jsonData.length === 0) {
      throw new Error('Excel 文件中没有数据')
    }

    // 转换数据格式
    const salaries: Omit<Salary, 'id'>[] = jsonData.map((row: any) => ({
      employee_id: String(row.employee_id || row.员工ID || '').trim(),
      employee_name: String(row.employee_name || row.员工姓名 || '').trim(),
      month: String(row.month || row.月份 || '').trim(),
      salary_amount: Number(row.salary_amount || row.工资金额 || 0),
    }))

    // 验证数据完整性
    const invalidRows = salaries.filter(salary =>
      !salary.employee_id ||
      !salary.employee_name ||
      !salary.month ||
      isNaN(salary.salary_amount)
    )

    if (invalidRows.length > 0) {
      console.error('无效的工资数据行:', invalidRows)
      throw new Error('员工工资文件格式错误：请确保所有字段都已正确填写')
    }

    // 验证月份格式 (YYYYMM)
    const invalidMonths = salaries.filter(salary =>
      !/^\d{4}(0[1-9]|1[0-2])$/.test(salary.month)
    )

    if (invalidMonths.length > 0) {
      console.error('无效的月份格式:', invalidMonths.map(s => s.month))
      throw new Error('员工工资文件格式错误：月份格式应为 YYYYMM，例如：202401')
    }

    return salaries
  } catch (error) {
    console.error('Excel 解析错误:', error)
    throw new Error('解析员工工资文件失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

// 导出数据到 Excel
export function exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}