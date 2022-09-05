<script setup>
import { ref ,computed, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import {Search,Info,Income,RankingList,SettingOne,SunOne,Moon} from '@icon-park/vue-next';
import { createGlobalState, useStorage } from '@vueuse/core'
import { io } from "socket.io-client"
const useState = createGlobalState(() =>
  useStorage('fg-user-config', {
    bgimg: '',
	color: ["#FF0000","#0000FF","#008000","#800080","#A52A2A","#FFA500","#FFC0CB","#FFFF00"]
  }),
)
const state = useState()
import axios from 'axios'
const isDark = useDark()
const toggleDark = useToggle(isDark)
function showname(name,rating){
	rating=parseInt(rating);
	if(rating<1200)return '<span class="newbiw">'+name+'</span>';
	if(rating<1400)return '<span class="pupil">'+name+'</span>';
	if(rating<1600)return '<span class="specialist">'+name+'</span>';
	if(rating<1900)return '<span class="expert">'+name+'</span>';
	if(rating<2100)return '<span class="candidate-master">'+name+'</span>';
	if(rating<2400)return '<span class="master">'+name+'</span>';
	if(rating<3000)return '<span class="grandmaster">'+name+'</span>';
	return '<span class="legendary-grandmaster">'+name+'</span>';
}
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
var userid = getCookie("userid");
var user = decodeURIComponent(getCookie("username"));
var pswd = getCookie("pswd");
var vip = getCookie("vip");
var rating = getCookie("rating");
let ranking=ref(false);
let ranking_content=ref({});
function showrank(){
	ranking.value=true;
	axios.get('/ratingrk').then((response)=>{
		if(response.data.status=="success")
			ranking_content.value=response.data.data;
	})
}
let dranking=ref(false);
let dranking_content=ref({});
function showdrank(){
	dranking.value=true;
	axios.get('/donationrk').then((response)=>{
		if(response.data.status=="success")
			dranking_content.value=response.data.data;
	})
}
let infos=ref(false);
let infos_content=ref({});
function showinfo(){
	infos.value=true;
	axios.get('/infos').then((response)=>{
		infos_content.value=response.data.data;
	})
}
let qrating=ref(false);
let qrating_content=ref({status:'err','data':'?'});
function showqrating(){
	qrating.value=true;
}
let setting=ref(false);
function showsetting(){
	setting.value=true;
}
let name=ref(0);
function handleChange(value){
  axios.get('/qry?name='+value).then((response)=>{
		qrating_content.value=response.data;
	})
}
document.body.onselectstart=document.body.oncontextmenu=function(){return false;};
let roomid=ref("");
function jump(){
	location.href='/room/'+roomid.value;
}
</script>
<template>
	<component is="style">
		body {
			{{state.bgimg?'background:url("'+state.bgimg+'");':''}}
			background-size: cover;
 		   	background-position: center;
		}
	</component>
	<el-drawer
		v-model="ranking"
		:direction="'ltr'"
	>
	<template #title>
      <h1>rating榜</h1>
    </template>
    <template #default>
        <el-table :data="ranking_content" stripe style="width: 100%">
			<el-table-column label="排名" v-slot="slotProps" width="60" align="center">
				{{slotProps.$index+1}}
			</el-table-column>
			<el-table-column label="用户名" v-slot="slotProps" align="center">
				<span v-html="slotProps.row.name"></span>
			</el-table-column>
			<el-table-column label="rating" v-slot="slotProps" align="center">
				<span v-html="slotProps.row.rating"></span>
			</el-table-column>
		</el-table>
    </template>
	</el-drawer>
	<el-drawer
		v-model="dranking"
		:direction="'ltr'"
	>
	<template #title>
      <h1>donation榜</h1>
    </template>
    <template #default>
        <el-table :data="dranking_content" stripe style="width: 100%">
			<el-table-column label="排名" v-slot="slotProps" width="60" align="center">
				{{slotProps.$index+1}}
			</el-table-column>
			<el-table-column label="用户名" v-slot="slotProps" align="center">
				<span v-html="slotProps.row.name"></span>
			</el-table-column>
		</el-table>
    </template>
	</el-drawer>
	<el-drawer
		v-model="infos"
		:direction="'ltr'"
	>
	<template #title>
      <h1>说明</h1>
    </template>
    <template #default>
        <div v-html="infos_content"></div>
    </template>
	</el-drawer>
	<el-drawer
		v-model="qrating"
		:direction="'ltr'"
	>
	<template #title>
      <h1>rating变化查询</h1>
    </template>
    <template #default>
		<el-input-number v-model="name" @change="handleChange" /> 
		<el-link type="primary" v-bind:href="'replay?name='+name" target="_blank" v-if="qrating_content.status=='success'">回放</el-link>
		<br><br>
        <el-table :data="qrating_content.data" stripe style="width: 100%" v-if="qrating_content.status=='success'">
			<el-table-column label="排名" v-slot="slotProps" width="60" align="center">
				{{slotProps.$index+1}}
			</el-table-column>
			<el-table-column label="用户名" v-slot="slotProps" align="center">
				<span v-html="slotProps.row.name"></span>
			</el-table-column>
			<el-table-column label="△" v-slot="slotProps" align="center">
				<span v-html="slotProps.row.delta"></span>
			</el-table-column>
			<el-table-column label="变化" v-slot="slotProps" align="center">
				<span v-html="slotProps.row.change"></span>
			</el-table-column>
		</el-table>
		<div v-else>{{qrating_content.data}}</div>
    </template>
	</el-drawer>
	<el-drawer
		v-model="setting"
		:direction="'ltr'"
	>
	<template #title>
      <h1>设置</h1>
    </template>
    <template #default>
		<h2>背景图片</h2>
		<el-input v-model="state.bgimg" placeholder="背景图片" clearable/>
		<h2>配色方案</h2>
		<el-color-picker v-model="state.color[0]" />
		<el-color-picker v-model="state.color[1]" />
		<el-color-picker v-model="state.color[2]" />
		<el-color-picker v-model="state.color[3]" />
		<el-color-picker v-model="state.color[4]" />
		<el-color-picker v-model="state.color[5]" />
		<el-color-picker v-model="state.color[6]" />
		<el-color-picker v-model="state.color[7]" />
		<br>
		<el-button type="success" plain @click='state.color=["#FF0000","#0000FF","#008000","#800080","#A52A2A","#FFA500","#FFC0CB","#FFFF00"]'>
        	恢复到默认
     	</el-button>
		<h2>黑暗模式</h2>
		<el-button-group style="margin:10px;">
			<el-button style="margin:10px;" type="info" plain @click="toggleDark()">
        		<moon v-if="isDark"  theme="outline" size="24" fill="#333"/>
				<sun-one v-else theme="outline" size="24" fill="#333"/>
     		</el-button>
		</el-button-group>
    </template>
	</el-drawer>
	 <el-menu
    class="el-menu-vertical-demo"
	:collapse="true"
	style="position:fixed;right:0;bottom:0"
    v-if="!start"
	>
    <el-menu-item index="1" @click="showqrating()">
      <search theme="outline" size="24" fill="#333"/>
      <template #title>Rating查询</template>
    </el-menu-item>
	<el-menu-item index="2" @click="showinfo()">
      <info theme="outline" size="24" fill="#333"/>
      <template #title>说明</template>
    </el-menu-item>
	<el-menu-item index="3" @click="showdrank();">
      <income theme="outline" size="24" fill="#333"/>
      <template #title>donation榜</template>
    </el-menu-item>
	<el-menu-item index="4" @click="showrank();">
      <ranking-list theme="outline" size="24" fill="#333"/>
      <template #title>Rating榜</template>
    </el-menu-item>
	<el-menu-item index="5" @click="showsetting();">
      <setting-one theme="outline" size="24" fill="#333"/>
      <template #title>设置</template>
    </el-menu-item>
  </el-menu>
	<a href="https://github.com/juruocjl/fake-generals" target="_blank" class="ribbons" v-if="!start">
		<img loading="lazy" width="149" height="149" src="./forkme_right_darkblue_121621.png" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1">
	</a>
	<div class="index" v-if="!start">
		<div class="contain">
			<div class="name"><span v-html="showname(user,rating)"></span><i v-bind:class="'vip'+vip"/></div>
			<div>当前rating为<span v-html="showname(rating,rating)"></span></div>
			<br>
			<el-input
				v-model="roomid"
				class="w-50 m-2"
				size="large"
				placeholder="1-3位房间号"
			/><br><br><el-button type="success" @click="jump()">go</el-button>
		</div>
	</div>
</template>

