import { City, Salary, Result } from '@/types/database'
import { supabaseAdmin } from '@/lib/supabase'

// 执行社保计算
export async function calculateSocialInsurance(cityName: string, year: string) {
  try {
    // 1. 获取城市标准
    const { data: cityData, error: cityError } = await supabaseAdmin
      .from('cities')
      .select('*')
      .eq('city_name', cityName)
      .eq('year', year)
      .maybeSingle()

    if (cityError) {
      console.error('城市查询错误详情:', cityError)
      throw new Error(`查询城市数据失败: ${cityError.message}`)
    }

    if (!cityData) {
      throw new Error(`未找到 ${cityName} ${year} 年的社保标准`)
    }

    // 2. 获取所有员工工资数据
    const { data: salaryData, error: salaryError } = await supabaseAdmin
      .from('salaries')
      .select('*')
      .order('employee_id, month')

    if (salaryError) {
      throw new Error('获取员工工资数据失败：' + salaryError.message)
    }

    if (!salaryData || salaryData.length === 0) {
      throw new Error('没有找到员工工资数据')
    }

    // 3. 按员工分组计算年度月平均工资
    const employeeGroups = salaryData.reduce((groups: Record<string, Salary[]>, salary) => {
      const key = salary.employee_id
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(salary)
      return groups
    }, {})

    // 4. 计算每个员工的结果
    const results: Omit<Result, 'id' | 'created_at'>[] = Object.entries(employeeGroups).map(([employeeId, salaries]) => {
      // 计算年度月平均工资
      const avgSalary = salaries.reduce((sum, s) => sum + s.salary_amount, 0) / salaries.length

      // 确定缴费基数
      let contributionBase = avgSalary
      if (avgSalary < cityData.base_min) {
        contributionBase = cityData.base_min
      } else if (avgSalary > cityData.base_max) {
        contributionBase = cityData.base_max
      }

      // 计算公司应缴金额
      const companyFee = contributionBase * cityData.rate

      // 获取员工姓名（使用第一条记录的姓名）
      const employeeName = salaries[0].employee_name

      return {
        employee_id: employeeId,
        employee_name: employeeName,
        city_name: cityName,
        year: year,
        avg_salary: Math.round(avgSalary * 100) / 100, // 保留两位小数
        contribution_base: Math.round(contributionBase * 100) / 100,
        company_fee: Math.round(companyFee * 100) / 100,
        calculated_at: new Date().toISOString()
      }
    })

    // 5. 清空现有结果
    const { error: deleteError } = await supabaseAdmin
      .from('results')
      .delete()
      .gte('id', 0) // 删除所有记录

    if (deleteError) {
      throw new Error('清空现有结果失败：' + deleteError.message)
    }

    // 6. 批量插入新结果
    const { error: insertError } = await supabaseAdmin
      .from('results')
      .insert(results)

    if (insertError) {
      throw new Error('保存计算结果失败：' + insertError.message)
    }

    return {
      success: true,
      message: `成功计算并保存了 ${results.length} 位员工的社保数据`,
      results: results.length
    }

  } catch (error) {
    console.error('计算社保失败：', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '计算过程中发生未知错误',
      results: 0
    }
  }
}

// 获取计算结果
export async function getCalculationResults() {
  try {
    const { data, error } = await supabaseAdmin
      .from('results')
      .select('*')
      .order('employee_name')

    if (error) {
      throw new Error('获取计算结果失败：' + error.message)
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    console.error('获取结果失败：', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 获取城市列表
export async function getCityList() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('city_name')
      .order('city_name')

    if (error) {
      throw new Error('获取城市列表失败：' + error.message)
    }

    // 去重
    const cities = [...new Set(data?.map(c => c.city_name) || [])]

    return {
      success: true,
      cities
    }
  } catch (error) {
    console.error('获取城市列表失败：', error)
    return {
      success: false,
      cities: [],
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}