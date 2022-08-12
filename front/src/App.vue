<script setup>
import { ref ,computed, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import {Search,Info,Income,RankingList,SettingOne,SunOne,Moon} from '@icon-park/vue-next';
import { createGlobalState, useStorage } from '@vueuse/core'
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
let start = ref(false);
let nowwin = ref("none");
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
var user = decodeURIComponent(getCookie("username"));
var vip = getCookie("vip");
var rating = getCookie("rating");
var ws = new WebSocket("ws://"+location.hostname+":3000");

const base="`~!@#$%^&*()_+qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM[];',./{}|:<>?";
var id=[];for(var i=0;i<base.length;i++)id[base[i]]=i;
class Deque {
	constructor() {this.items = [];this.count = 0;this.lowestCount = 0;}
	addBack(element) {this.items[this.count] = element;this.count++;};
	popFront(){return this.items[this.lowestCount++];};
	popBack() {return this.items[--this.count];};
	size(){return this.count-this.lowestCount;}
	clear(){this.count=this.lowestCount=0;}
	to_string(){var a="";for(var i=this.lowestCount;i<this.count;i++){a+=this.items[i].length;for(var j=0;j<this.items[i].length;j++)a+=base[this.items[i][j]];}return a;}
	from_string(a){this.clear();for(i=0;i<a.length;){var l=parseInt(a[i]);var tmp=[];i++;for(var j=0;j<l;i++,j++)tmp[j]=id[a[i]];this.addBack(tmp);}}
	to_array(){var a=[];for(var i=this.lowestCount;i<this.count;i++)a[i-this.lowestCount]=this.items[i];return a;}
};
let Q = ref(new Deque());
let userlist=ref([]);
let n=ref(0),m=ref(0);
let nowx=ref(-1),nowy=ref(-1),op=ref(0);
let map=ref([]);
let turn=ref('?');
let type=ref('');
let weather=ref([]);
let totpeople=ref(0);
let count=ref([0,0,0,0,0,0]);
let wcount=ref([0,0,0]);
let size=ref(30);
let ranking=ref(false);
let ranking_content=ref({});
watch(type,(newvalue)=>{
	//console.log(newvalue);
	ws.send(JSON.stringify({'typ':'type change','type':newvalue}));
	ws.send(JSON.stringify({'typ':'weather change','type':weather.value}));
})
watch(weather,(newvalue)=>{
	//console.log(JSON.stringify(newvalue));
	ws.send(JSON.stringify({'typ':'weather change','type':newvalue}));
})
function showrank(){
	ranking.value=true;
	axios.get('ratingrk').then((response)=>{
		if(response.data.status=="success")
			ranking_content.value=response.data.data;
	})
}
let dranking=ref(false);
let dranking_content=ref({});
function showdrank(){
	dranking.value=true;
	axios.get('donationrk').then((response)=>{
		if(response.data.status=="success")
			dranking_content.value=response.data.data;
	})
}
let infos=ref(false);
let infos_content=ref({});
function showinfo(){
	infos.value=true;
	axios.get('infos').then((response)=>{
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
  axios.get('qry?name='+value).then((response)=>{
		qrating_content.value=response.data;
	})
}
let vis=computed(()=>{
	var arr=[];
	for(var i=0;i<n.value;i++){
		arr[i]=[];
		for(var j=0;j<m.value;j++)
			arr[i][j]=[0,0,0,0];
	}
	Q.value.to_array().forEach((x)=>{if(x.length==3)arr[x[0]][x[1]][x[2]]=true;});
	return arr;
});
var notinit=true;
function pred(Map,val,add){
	Map=JSON.parse(JSON.stringify(Map));
	if(!add)return Map;
	for(var i=0;i<n.value;i++)
		for(var j=0;j<m.value;j++){
			if(Map[i][j][0]>=0&&Map[i][j][1]>=0){
				if(Map[i][j][0]==0)Map[i][j][2]+=val;
				else if(Map[i][j][0]!=4)Map[i][j][2]++;
				else{
					Map[i][j][2]--;
					if(Map[i][j][2]==0)Map[i][j][1]=-1;
				}
			}
		}
	return Map;
}
function bgcolor(i,j){
	if(map.value[i][j][0]==-2||map.value[i][j][0]==-3)return "#565656";
	if(map.value[i][j][0]==-1||map.value[i][j][0]==5)return "#b3b3b3";
	if(map.value[i][j][0]==0){
		if(map.value[i][j][1]>=0)return state.value.color[map.value[i][j][1]];
		else return "#d7d7d7";
	}
	if(map.value[i][j][1]>=0)return state.value.color[map.value[i][j][1]];
	else return "#757575";
}
let rank = ref([]);
let players=computed(()=>{
	var arr=[];
	for(var i=0;i<rank.value.length;i++)
		if(userlist.value[i].vip==0)
			arr[i]={'name':showname(userlist.value[i].name,userlist.value[i].rating),'color':state.value.color[i],'army':rank.value[i][0],'land':rank.value[i][1]};
		else
			arr[i]={'name':showname(userlist.value[i].name,userlist.value[i].rating)+'<i class="vip'+userlist.value[i].vip+'"></i>','color':state.value.color[i],'army':rank.value[i][0],'land':rank.value[i][1]};
	arr.sort((a,b)=>{
		if(a.army!=b.army)return b.army-a.army;
		if(a.land!=b.land)return b.land-a.land;
		return a.color<b.color?1:-1;
	});
	return arr;
})
function setnow(a,b){
	if(nowx.value!=-1&&nowy.value!=-1&&Math.abs(nowx.value-a)+Math.abs(nowy.value-b)==1){
		var d;
		if(a==nowx.value-1)d=0;
		if(a==nowx.value+1)d=1;
		if(b==nowy.value-1)d=2;
		if(b==nowy.value+1)d=3;
		Q.value.addBack([nowx.value,nowy.value,d]);
		ws.send(JSON.stringify({'typ':'add queue','data':[nowx.value,nowy.value,op.value*4+d]}))
		nowx.value=a,
		nowy.value=b,
		op.value=0;
	}else if(nowx.value==a&&nowy.value==b){
		if(op.value==0)op.value=1;
		else op.value=0,nowx.value=-1,nowy.value=-1;
	}else if(nowx.value>=0&&nowy.value>=0&&map.value[nowx.value][nowy.value][0]==3){
		Q.value.addBack([nowx.value,nowy.value,a,b,op.value]);
		ws.send(JSON.stringify({'typ':'add queue','data':[nowx.value,nowy.value,a,b,op.value]}))
		nowx.value=a,nowy.value=b,op.value=0;
	}else nowx.value=a,nowy.value=b,op.value=0;
}
document.onkeydown=function(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if(e && e.keyCode==32)nowx.value=nowy.value=-1,show();
    if(e && e.keyCode==87)if(nowx.value!=-1&&nowx.value>0)setnow(nowx.value-1,nowy.value);
    if(e && e.keyCode==83)if(nowx.value!=-1&&nowx.value+1<n.value)setnow(nowx.value+1,nowy.value);
    if(e && e.keyCode==65)if(nowy.value!=-1&&nowy.value>0)setnow(nowx.value,nowy.value-1);
    if(e && e.keyCode==68)if(nowy.value!=-1&&nowy.value+1<m.value)setnow(nowx.value,nowy.value+1);
    if(e && e.keyCode==69){
	    if(Q.value.size()){
			var lst=Q.value.popBack();
			nowx.value=lst[0];
			nowy.value=lst[1];
			ws.send(JSON.stringify({'typ':'pop queue'}));
		}
	}if(e && e.keyCode==81){
	    if(Q.value.size()){
			Q.value.clear();
			ws.send(JSON.stringify({'typ':'clear queue'}));
		}
	}if(e && e.keyCode==88){
		var ums=[];
		for(var i=0;i<n.value;i++)for(var j=0;j<m.value;j++)if(map.value[i][j][0]==3)
			ums[ums.length]=[i,j];
		ums.sort((a,b)=>{return map.value[b[0]][b[1]][2]-map.value[a[0]][a[1]][2];});
		var tmpx=nowx.value,tmpy=nowy.value;
		for(var i=0;i<ums.length;i++)
			nowx.value=ums[i][0],nowy.value=ums[i][1],
			setnow(tmpx,tmpy);
	}if(e && e.keyCode==27){
		 ElMessageBox.alert('确定投降吗', '投降', {
			confirmButtonText: '确定',
			callback: (action) => {
				if(action=="confirm")
					ws.send(JSON.stringify({'typ':'surrender'}));
			},
		})
	}
};
function moused(e1) {
	var drag = document.getElementById("map");
	var x1 = e1.clientX;
	var y1 = e1.clientY;
	var l1 = drag.offsetLeft;
	var t1 = drag.offsetTop;
	window.onmousemove = function(e2) {
		var x2 = e2.clientX;
		var y2 = e2.clientY;
		var l2 = l1 + (x2 - x1);
		var t2 = t1 + (y2 - y1);
		drag.style.left = l2 + 'px';
		drag.style.top = t2 + 'px';
	}
}
function mouseu() {
	window.onmousemove = null;
}
function mousew(e){
	if(e.deltaY<0){
		size.value=Math.min(50,size.value+3);
	}else if(e.deltaY>0){
		size.value=Math.max(25,size.value-3);
	}
}
document.body.onselectstart=document.body.oncontextmenu=function(){return false;};
ws.onmessage = (evt)=>{
	var data = JSON.parse(evt.data);
	if (data.typ == 'already start'){
		start.value = true;
		userlist.value = data.users;
		n.value=data.n;
		m.value=data.m;
		for(var i=0;i<n.value;i++){
			map.value[i]=[];
			for(var j=0;j<m.value;j++)
				map.value[i][j]=[-2];
		}
	}
	if(data.typ=="count change"){
		totpeople.value=data.tot;
		count.value=data.count;
		wcount.value=data.wcount;
	}
	if(data.typ=='init game'){
		start.value=true;
		userlist.value = data.users;
		n.value=data.n;
		m.value=data.m;
		notinit=false;
		for(var i=0;i<n.value;i++){
			map.value[i]=[];
			for(var j=0;j<m.value;j++)
				map.value[i][j]=data.firstmap[i*m.value+j]=="1"?[-3]:[-2];
		}
	}
	if(data.typ=='new turn'){
		if(notinit)ws.send(JSON.stringify({'typ': 'get map','full':true}));
		else ws.send(JSON.stringify({'typ': 'get map','full':false}));
		turn.value=Math.ceil(data.turn/2);
		rank.value=data.rank;
	}
	if(data.typ=='map'){
		if(!data.full){
			map.value=pred(map.value,data.val,data.add);
			for(var i=0;i<data.diff.length;i++)
				map.value[data.diff[i][0]][data.diff[i][1]]=data.diff[i][2];
		}else map.value=data.map,notinit=false;
		Q.value.from_string(data.queue);
	}
	if(data.typ=='end'){
		ws.close();
		map.value=data.lstmap;
		rank.value=data.lstrank;
		qrating.value=true;
		name.value=data.name;
		handleChange(data.name);
		window.onmousemove = null;
	}
};
console.log(state.value.color[2]);
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
			<el-button-group style="margin:10px;">
			<el-button style="margin:10px;" type="success" plain @click="ws.send(JSON.stringify({'typ': 'startgame'}));">Start!</el-button>
			</el-button-group><br>
			<el-radio-group style="margin:10px;" v-model="type" size="middle">
				<el-radio-button label="ffa">FFA(rated) ({{count[0]}})</el-radio-button>
				<el-radio-button label="sb">伞兵大战 ({{count[1]}})</el-radio-button>
				<el-radio-button label="dark">浓雾模式 ({{count[2]}})</el-radio-button>
				<el-radio-button label="toxins">掉坑模式 ({{count[3]}})</el-radio-button>
				<el-radio-button label="yinjian">阴间模式 ({{count[4]}})</el-radio-button>
				<el-radio-button label="team">团队模式 ({{count[5]}})</el-radio-button>
			</el-radio-group><br>
			<el-checkbox-group v-model="weather" size="middle" :disabled="type==''">
				<el-checkbox-button label="lightning">
					雷电({{wcount[0]}}/{{totpeople}})
				</el-checkbox-button>
				<el-checkbox-button label="earthquake">
					地震({{wcount[1]}}/{{totpeople}})
				</el-checkbox-button>
				<el-checkbox-button label="wind" disabled>
					大风({{wcount[2]}}/{{totpeople}})
				</el-checkbox-button>
			</el-checkbox-group>
			<el-button-group style="margin:10px;">
				<el-button type="primary" class="teamchoose" @click="type='';weather=[];">cancel</el-button>
			</el-button-group><br>
		</div>
	</div>
	<div class="turn">turn <span id="turn">{{turn}}</span></div>
	<div class="rank">
	<table><tbody id="rank">
		<tr>
			<th>rank</th>
			<th>name</th>
			<th>army</th>
			<th>land</th>
		</tr>
		<tr v-for="(player,index) in players">
			<td v-bind:style="{'color':'white','background':player.color,'font-weight':800}">{{index+1}}</td>
			<td v-html="player.name"></td>
			<td v-html="player.army"></td>
			<td v-html="player.land"></td>
		</tr>
	</tbody></table>
	</div>
	<table cellspacing="0" cellpadding="0" border="0" v-if="start" v-bind:style="{'--size':size+'px','font-size':Math.min(18,Math.floor((now+32)/5))+'px'}">
		 <tbody class="map" id="map" @mousedown="moused" @mouseup="mouseu" @mousewheel="mousew">
		 	<tr v-for="i in n">
				<td v-for="j in m" v-bind:style="{background:bgcolor(i-1,j-1)}" v-bind:class="{cell:true,nowpos:nowx==i-1&&nowy==j-1}" @click="setnow(i-1,j-1)">
					<span v-bind:class="{
						num:true,
						unknow:map[i-1][j-1][0]==-3,
						visible:map[i-1][j-1][0]!=-2&&map[i-1][j-1][0]!=-3,
						mountain:map[i-1][j-1][0]==-1,
						toxins:map[i-1][j-1][0]==5,
						empty:map[i-1][j-1][0]==0,
						town:map[i-1][j-1][0]==1,
						crown:map[i-1][j-1][0]==2,
						umbrella:map[i-1][j-1][0]==3,
						water:map[i-1][j-1][0]==4
					}">{{nowx==i-1&&nowy==j-1&&op==1?"50%":(map[i-1][j-1][2]?map[i-1][j-1][2]:"")}}</span>
					<span class='up' v-if="vis[i-1][j-1][0]"></span>
					<span class='down' v-if="vis[i-1][j-1][1]"></span>
					<span class='left' v-if="vis[i-1][j-1][2]"></span>
					<span class='right' v-if="vis[i-1][j-1][3]"></span>
				</td>
			</tr>
		 </tbody>
	</table>
</template>

