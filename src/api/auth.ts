const FAKE_USER = 'admin'
const FAKE_PASS = '123456'


export async function loginApi(username:string, password:string):Promise<string>{
    await new Promise((r)=> setTimeout(r,600))
    if(username === FAKE_USER && password === FAKE_PASS){
        return 'fake-token' + Date.now()
    }else throw new Error('账号或密码错误')
}
export async function changePwdApi(oldPwd:string, newPwd:string):Promise<void> {
    await new Promise((r)=> setTimeout(r,500))
    if(oldPwd != '123456')throw new Error('原密码不正确')
    if(newPwd === oldPwd )throw new Error('新密码不能和原密码相同')
}
