import { users } from '../data/users'
import type { User } from '../data/users'

export interface UserPage {
  list: User[]
  total: number
}

export interface UserQuery {
    name?:string
    status?:string
}
export interface UserStats{
    total:number
    normal:number
    pending:number
    disabled:number
}
export interface DayCount{
    day:string
    count:number
}
export async function fetchUsers(page:number, limit:number, query:UserQuery = {}):Promise<UserPage>{
    await new Promise((r)=> setTimeout(r,300))

    const name = (query.name ?? '').trim()
    const status = query.status ?? ''

    let list = users
    if(name)list = list.filter((u)=> u.name.includes(name))
    if(status)list = list.filter((u)=>u.status === status)

    const start = (page - 1) *limit
    const end = page *limit

    return{
        list: list.slice(start,end),
        total:list.length
    }
}

// 把当前时间格式化成年月日时分（和现有数据一个格式）
function nowText(){
    const d = new Date()
    const p = (n:number) => String(n).padStart(2,'0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate()) } ${p(d.getHours())}:${p(d.getMinutes())}`
}
export async function createUser(data: Omit<User,'id' | 'createdAt'>):Promise<User>{
    await new Promise((r)=> setTimeout(r,300))//假装网络
    const id = Math.max(...users.map((u)=>u.id)) + 1
    const row:User = { id,createdAt:nowText(),...data}

    users.unshift(row) 
    return row
}
export async function updateUser(id: number, data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  await new Promise((r) => setTimeout(r, 300))

  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error(`找不到 id=${id} 的用户`)   

  users[idx] = { ...users[idx], ...data }   
  return users[idx]
}
export async function deleteUser(id:number):Promise<void>{
    await new Promise((r)=>setTimeout(r,300))
    const idx = users.findIndex((u)=>u.id === id)
    if(idx === -1) throw new Error(`找不到id = ${id} 的用户`)
    users.splice(idx,1)
}
export async function fetchStats():Promise<UserStats>{
    await new Promise((r)=> setTimeout(r,300))

    return{
        total:users.length,
        normal:users.filter((r)=>r.status === '正常').length,
        pending:users.filter((r)=>r.status === '待审核').length,
        disabled:users.filter((r)=>r.status === '已停用').length,
    }
}
export async function fetchRecentUsers(limit = 5):Promise<User[]>{
    await new Promise((r)=> setTimeout(r,300))
    const copy = [ ...users]
    copy.sort((a,b)=>b.createdAt.localeCompare(a.createdAt))
    return copy.slice(0,limit)
}
// 把 'YYYY-MM-DD' 往前/往后挪几天（用于"按日历"生成日期轴）
function shiftDay(day: string, delta: number): string {
    const d = new Date(day + 'T00:00:00')          // 不带 Z = 按本地时间解析，不会有跨时区偏一天的问题
    d.setDate(d.getDate() + delta)                 // setDate 会自动处理跨月/跨年
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export async function fetchDailyCounts(): Promise<DayCount[]>{
    await new Promise((r)=> setTimeout(r,300))
    const byDay: Record<string, number>={}
    users.forEach((u)=>{
        const day = u.createdAt.slice(0, 10)
        byDay[day] = (byDay[day] ?? 0) + 1
    })

    const days = Object.keys(byDay).sort()
    if (!days.length) return []                    // 一条数据都没有 → 图也没得画

    // 🔴 日期轴按"日历"生成最后 7 天（含数据里最新那天），而不是"数据里出现过的天"
    //    这样"某一天 0 人"也照样占一根柱子（高度 0），不会整根消失、也不会让日期标签跳号
    const last = days[days.length - 1]
    const axis = Array.from({ length: 7 }, (_, i) => shiftDay(last, i - 6))

    return axis.map((d) => ({ day: d, count: byDay[d] ?? 0 }))
}