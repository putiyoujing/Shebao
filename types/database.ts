export interface City {
  id: number
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
  created_at?: string
  updated_at?: string
}

export interface Salary {
  id: number
  employee_id: string
  employee_name: string
  month: string  // YYYYMM 格式
  salary_amount: number
  created_at?: string
  updated_at?: string
}

export interface Result {
  id: number
  employee_id: string
  employee_name: string
  city_name: string
  year: string
  avg_salary: number
  contribution_base: number
  company_fee: number
  calculated_at?: string
  created_at?: string
}

// 数据库表名
export const TABLES = {
  CITIES: 'cities',
  SALARIES: 'salaries',
  RESULTS: 'results'
} as const