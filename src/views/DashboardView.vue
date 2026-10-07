<script setup lang="ts">
import { computed, onMounted, ref} from 'vue'
import { fetchStats, type UserStats , fetchRecentUsers, type DayCount, fetchDailyCounts } from '../api/user';
import { ElMessage } from 'element-plus';
import {  type User} from '../data/users'

const recent = ref<User[] | null> (null)
const daily = ref<DayCount[] | null >(null)
const stats = ref<UserStats | null >(null)
const cards = computed(()=>
[
    {label:'总用户数', value:stats.value ? stats.value.total : '-', tip:'全部账号'},
    {label:'正常用户', value:stats.value ? stats.value.normal : '-', tip:'状态正常'},
    {label:'待审核用户数', value:stats.value ? stats.value.pending : '-', tip:'等待处理'},
    {label:'已停用用户数', value:stats.value ? stats.value.disabled : '-', tip:'已禁止登录'},
])
const barHeight = (n:number)=>{
    const counts = (daily.value ?? []).map((d)=> d.count)
    const max = counts.length ? Math.max(...counts) : 1
    return (n / max) * 100 + '%'
}

async function loadAll(){
    try{
        stats.value = await fetchStats()
        recent.value = await fetchRecentUsers(5)
        daily.value = await fetchDailyCounts()
    }catch{
        ElMessage.error('数据加载失败')
    }
    
}
onMounted(loadAll)
</script>

<template>
    <section class="page">
    <h2>数据概览</h2>
    <div class="cards">
        <div v-for="c in cards" :key="c.label" class="card">
            <p class="card-label">{{ c.label }}</p>
            <p class="card-value">{{ c.value }}</p>
            <p class="card-tip">{{ c.tip }}</p>
        </div>
    </div>

    <div class="panels">
        <section class="panel">
            <div class="panel-head">
                <h3 class="panel-title">近 7 日新增用户</h3>
                <span v-if="daily && daily.length" class="panel-sub">{{ daily[0].day }} ~ {{ daily[daily.length - 1].day.slice(5) }}</span>
            </div>
            <p v-if="daily === null" class="tip">加载中…</p>
            <div v-else class="chart">
                <div v-for="d in daily" :key="d.day" class="col">
                    <div class="bar-wrap">
                        <div class="bar" :style="{height:barHeight(d.count)}"></div>
                    </div>
                    <span class="col-label"> {{ d.day.slice(5) }}</span>
                </div>
            </div>
        </section>
        <section class="panel">
            <div class="panel-head">
                <h3 class="panel-title">最近新增的 5 个人</h3>
            </div>
            <p v-if="recent === null" class="tip">加载中…</p>
            <div v-else class="rank">
                <div v-for="(u, i) in recent" :key="u.id" class="rank-row" >
                    <span class="rank-no">{{ i + 1}}</span>
                    <span class="rank-name">{{ u.name }}</span>
                    <span class="rank-time">{{ u.createdAt.slice(5) }}</span>
                </div>
            </div>
        </section>
    </div>
    </section>
</template>

<style scoped>
.page { padding: 4px; }

.card::before,
.panel::before{
    content: '';
    position: absolute;
    inset: 0 0 auto 0;                    
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--side-brand));
}

.card{
    position: relative;                 
    overflow: hidden;                    
    background: #fff;
    border: 1px solid var(--border-l);
    border-radius: var(--radius);
    padding: var(--sp-4);
}
.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sp-4);
  margin-top: var(--sp-4);
}
.card-label{
    font-size: var(--fs-sm);
    color: var(--text-2);               
}
.card-value{
    font-size: var(--fs-xl);
    font-weight: 700;
    color: var(--text-1);
    margin-top: var(--sp-1);
}
.card-tip{
    font-size: var(--fs-xs);
    color: var(--text-2);                 
    margin-top: var(--sp-1);
}

.panels {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--sp-4);
  margin-top: var(--sp-4);
}
.panel {
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--border-l);
  border-radius: var(--radius);
  padding: var(--sp-4);
}
.panel-head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp-2);
}
.panel-title{
    font-size: var(--fs-md);
    font-weight: 700;
}
.panel-sub{
    font-size: var(--fs-xs);
    color: var(--text-2);
    white-space: nowrap;
}

.tip {
    font-size: var(--fs-sm);
    color: var(--text-2);
    margin-top: var(--sp-2);
}

.rank{
    display: flex;
    flex-direction: column;
    gap: var(--sp-3);
}
.rank-row{
    display: flex;
    align-items: center;
    gap: var(--sp-3);
}
.rank-no{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #fff;
    background: var(--primary-d);         
    font-size: var(--fs-md);               
    font-weight: 700;
    display: flex;
    align-items: center;                 
    justify-content: center;
    flex: none;
}
.rank-name{
    flex: 1;
}
.rank-time{
    font-size: var(--fs-xs);
    color: var(--text-2);
    white-space: nowrap;
}

.chart{
    display: flex;
    align-items: flex-end;
    gap: var(--sp-3);
    margin-top: var(--sp-4);
}

.col{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.col-label{
    font-size: var(--fs-xs);
    color: var(--text-2);
    margin-top: 6px;
    white-space: nowrap;                 
}

.bar-wrap{
    height: 170px;
    display: flex;
    align-items: flex-end;
    width: 100%;
}
.bar{
    width: 100%;
    background: var(--primary);
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    transition: height var(--tr);
}

@media (max-width: 900px) {
  .cards { grid-template-columns: repeat(2, 1fr); }   
  .panels { grid-template-columns: 1fr; }            
}
@media (max-width: 480px) {
  .cards { gap: var(--sp-3); }
  .card { padding: var(--sp-3) var(--sp-3) var(--sp-2); }
  .card-value { font-size: var(--fs-lg); }            
}
</style>


