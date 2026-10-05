const FAKE_USER = 'admin'
const FAKE_PASS = '123456'


export async function loginApi(username:string, password:string):Promise<string>{
    await new Promise((r)=> setTimeout(r,600))
    if(username === FAKE_USER && password === FAKE_PASS){
        return 'fake-token' + Date.now()
    }else throw new Error('账号或密码错误')
}

