<script setup>
import { ref ,computed, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
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
let userlist=ref([]);
let n=ref(0),m=ref(0);
let size=ref(30);
let name=ref("");
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
if(getQueryVariable('name'))name.value=getQueryVariable('name');
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
var maps=[];
var ltxs=[],ltys=[];
let ver = ref(0);
let turn = ref(0);
let ltx=computed(()=>{return ltxs[turn.value];});
let lty=computed(()=>{return ltys[turn.value];});
let map=computed(()=>{return maps[turn.value];})
let rank = computed(()=>{
	var arr=[];
	for(var i=0;i<userlist.value.length;i++)arr[i]=[0,0];
	for(var i=0;i<n.value;i++)for(var j=0;j<m.value;j++)if(map.value[i][j][0]>=0&&map.value[i][j][1]>=0){
		arr[map.value[i][j][1]][1]++;
		arr[map.value[i][j][1]][0]+=map.value[i][j][2];
	}
	return arr;
});
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
document.onkeydown=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode==32)nowx.value=nowy.value=-1,show();
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

function Start(){
	axios.get('getfile?name='+name.value).then((response)=>{
		if(response.data=="Not Found"){
			ElMessage.error('Not Found.')
		}else{
			start.value=true;
			var data=response.data;
			n.value=data.his[0].length;
			m.value=data.his[0][0].length;
			userlist.value=data.users;
			var cnt=data.his.length;
			maps[0]=data.his[0];ltxs[0]=ltys[0]=-1;
			var everyadd=data.everyadd;
			for(var i=1;i<data.his.length;i++){
				ltxs[i]=ltys[i]=-1;
				maps[i]=pred(maps[i-1],(i+1)%everyadd==0,(data.ver>=2)?i%2==1:true);
				data.his[i].forEach((x)=>{
					if(x[0]=='lt'||x[0]=='lightning')ltxs[i]=x[1],ltys[i]=x[2];
					else maps[i][x[0]][x[1]]=x[2];
				});
			}
			ver.value=data.ver;
			document.onkeydown=function(event){
			   var e = event || window.event || arguments.callee.caller.arguments[0];
			   if(e && e.keyCode==65)turn.value=Math.max(0,turn.value-1);
			   if(e && e.keyCode==68)turn.value=Math.min(cnt-1,turn.value+1);
		   };
		}
	}).catch((error)=>{
		console.log(error);
	})
}
</script>

<template>
	<a href="https://github.com/juruocjl/fake-generals" target="_blank" class="ribbons" v-if="!start">
		<img loading="lazy" width="149" height="149" src="./forkme_right_darkblue_121621.png" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1">
	</a>
	<div class="index" v-if="!start">
		<div class="contain">
			<el-input
				v-model="name"
				class="w-50 m-2"
				placeholder="回放id"
			/>
			<el-button style="margin:10px;" type="success" plain @click="Start();">Start!</el-button>

		</div>
	</div>
	<div class="turn">turn <span id="turn">{{ver>=2?Math.ceil(turn/2):turn}}</span></div>
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
					<span class="lightning" v-if="ltx==i-1&&lty==j-1"></span>
				</td>
			</tr>
		 </tbody>
	</table>
</template>

