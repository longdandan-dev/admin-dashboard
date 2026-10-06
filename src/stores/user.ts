import { ref, watch } from "vue";
import { defineStore } from "pinia";

const USER_KEY = 'admin_username'

function readUser():string{
    return localStorage.getItem(USER_KEY) ?? ''
}

export const useUserStore = defineStore('user',()=>{
    const username = ref(readUser())
    function setUser(name:string ){username.value = name}
    
    function clearUser(){
        username.value = ''
    }

    watch(username,((newName)=>{
        localStorage.setItem(USER_KEY,newName)
    }))

    return {username, setUser, clearUser }
})
