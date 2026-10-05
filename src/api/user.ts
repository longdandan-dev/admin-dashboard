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
