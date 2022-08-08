<script setup>
import { ref ,computed, watch } from 'vue'
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
const color=["red","blue","green","purple","brown","orange","pink"];
let userlist=ref([]);
let n=ref(0),m=ref(0);
let nowx=ref(-1),nowy=ref(-1),op=ref(0);
let map=ref([]);
let turn=ref('?');
let type=ref();
let member=ref([[],[]]);
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
watch(type, (newtype) => {
	ws.send(JSON.stringify({'typ':'type change','type':newtype}));
})
function pred(Map,val,add){
	Map=JSON.parse(JSON.stringify(Map));
	if(!add)return Map;
	for(var i=0;i<n;i++)
		for(var j=0;j<m;j++){
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
function show(){
	for(var i=0;i<n;i++){
		var line = $('.map >tr[data='+i+']')
		for(var j=0;j<m;j++){
			var now=line.children('td')[j];
			var inner;
			if(map[i][j][0]==-2){
				now.style.background="#565656";
				inner="<span class='num'></span>";
			}else if(map[i][j][0]==-3){
				now.style.background="#565656";
				inner="<span class='unknow num'></span>";
			}else{
				if(map[i][j][0]==-1){
					now.style.background="#b3b3b3";
					inner="<span class='mountain num visible'></span>";
				}else if(map[i][j][0]==5){
					now.style.background="#b3b3b3";
					inner="<span class='toxins num visible'></span>";
				}else if(map[i][j][0]==0){
					if(map[i][j][1]>=0)now.style.background=color[map[i][j][1]];
					else now.style.background="#d7d7d7";
					if(map[i][j][2])inner="<span class='empty num visible'>"+map[i][j][2]+"</span>";
					else inner="<span class='empty num visible'></span>";;
				}else if(map[i][j][0]==1){
					if(map[i][j][1]>=0)now.style.background=color[map[i][j][1]];
					else now.style.background="#757575";
					if(map[i][j][2])inner="<span class='town num visible'>"+map[i][j][2]+"</span>";
					else inner="<span class='town num visible'></span>";;
				}else if(map[i][j][0]==2){
					now.style.background=color[map[i][j][1]];
					if(map[i][j][2])inner="<span class='crown num visible'>"+map[i][j][2]+"</span>";
					else inner="<span class='crown num visible'></span>";
				}else if(map[i][j][0]==3){
					if(map[i][j][1]>=0)now.style.background=color[map[i][j][1]];
					else now.style.background="#757575";
					if(map[i][j][2])inner="<span class='umbrella num visible'>"+map[i][j][2]+"</span>";
					else inner="<span class='umbrella num visible'></span>";
				}else if(map[i][j][0]==4){
					if(map[i][j][1]>=0)now.style.background=color[map[i][j][1]];
					else now.style.background="#757575";
					if(map[i][j][2])inner="<span class='water num visible'>"+map[i][j][2]+"</span>";
					else inner="<span class='water num visible'></span>";
				}
			}
			if(vis[i][j][0])inner+="<span class='up'></span>";
			if(vis[i][j][1])inner+="<span class='down'></span>";
			if(vis[i][j][2])inner+="<span class='left'></span>";
			if(vis[i][j][3])inner+="<span class='right'></span>";
			if(now.innerHTML!=inner)now.innerHTML=inner;
			if(i==nowx&&j==nowy){
				now.classList.add("nowpos");
				if(op)now.firstChild.innerHTML="50%";
			}
			else now.classList.remove("nowpos");
		}
	}
};
let rank = ref([]);
let players=computed(()=>{
	var arr=[];
	for(var i=0;i<userlist.value.length;i++)
		if(userlist.value[i].vip==0)
			arr[i]={'name':showname(userlist.value[i].name,userlist.value[i].rating),'color':color[i],'army':rank.value[i][0],'land':rank.value[i][1]};
		else
			arr[i]={'name':showname(userlist.value[i].name,userlist.value[i].rating)+'<i class="vip'+userlist.value[i].vip+'"></i>','color':color[i],'army':rank.value[i][0],'land':rank.value[i][1]};
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
		if(a==now.value-1)d=0;
		if(a==now.value+1)d=1;
		if(b==now.value-1)d=2;
		if(b==now.value+1)d=3;
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
      if(e && e.keyCode==32)nowx=nowy=-1,show();
      if(e && e.keyCode==87)if(nowx!=-1&&nowx>0)setnow(nowx-1,nowy);
      if(e && e.keyCode==83)if(nowx!=-1&&nowx+1<n)setnow(nowx+1,nowy);
      if(e && e.keyCode==65)if(nowy!=-1&&nowy>0)setnow(nowx,nowy-1);
      if(e && e.keyCode==68)if(nowy!=-1&&nowy+1<m)setnow(nowx,nowy+1);
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
		$('.gameend').css('display','block');
		$('.gameend').html('是否投降<br><br><button id="okok">确定</button> <button id="bxbx">取消</button>');
		$('#okok').click(()=>{$('.gameend').css('display','none');ws.send(JSON.stringify({'typ':'surrender'}))});
		$('#bxbx').click(()=>{$('.gameend').css('display','none');});
   }
};

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
	if(data.typ=="type change")
		type.value=data.type;
	if(data.typ=="team change")
		member.value=data.member;
	if(data.typ=='init game'){
		start.value=true;
		userlist.value = data.users;
		n.value=data.n;
		m.value=data.m;
		notinit=false;
		for(var i=0;i<n.value;i++){
			map.value[i]=[];
			for(var j=0;j<m.value;j++){
				map.value[i][j]=[-2];
				if(data.firstmap[i*m+j]=="1")
					map.value[i][j]=[-3];
			}
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
		$('.gameend').css('display','block');
		$('.gameend').html('<iframe src="qry?name='+data.name+'" style="height:400px;"></iframe><br><button id="okok">ok</button>');
		$('#okok').click(()=>{$('.gameend').css('display','none');});
	}
};
</script>

<template>
	<a href="https://github.com/juruocjl/fake-generals" target="_blank" class="ribbons" v-if="!start">
		<img loading="lazy" width="149" height="149" src="./forkme_right_darkblue_121621.png" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1">
	</a>
	<div class="index" v-if="!start">
		<div class="contain">
		<div class="name" v-html="showname(user,rating)"></div>
		<div>当前rating为<span v-html="showname(rating,rating)"></span></div><br>
		<button @click="ws.send(JSON.stringify({'typ': 'startgame'}));">Start!</button><br>
		<input type="radio" v-model="type" name="gametype" value="ffa">FFA(rated)<br>
		<input type="radio" v-model="type" name="gametype" value="sb">伞兵大战<br>
		<input type="radio" v-model="type" name="gametype" value="dark">浓雾模式<br>
		<input type="radio" v-model="type" name="gametype" value="toxins">掉坑模式<br>
		<input type="radio" v-model="type" name="gametype" value="yinjian">阴间模式<br>
		<input type="radio" v-model="type" name="gametype" value="team">团队模式<br>
		<div style="display: flex;">
			<span>
				<div class="teamchoose" @click="ws.send(JSON.stringify({'type':'join','team':0}));">team1</div>
				<div id="team1name" class="teamname">
				<div v-for="user in member[0]">{{user.name}}</div>
				</div>
			</span>
			<span>
				<div class="teamchoose" @click="ws.send(JSON.stringify({'type':'join','team':1}));">team2</div>
				<div id="team2name" class="teamname">
				<div v-for="user in member[1]">{{user.name}}</div>
				</div>
			</span>
			<span>
				<div id="cancel" class="teamchoose" @click="ws.send(JSON.stringify({'type':'cancel'}));">cancel</div>
			</span>
		</div>
		</div>
	</div>
	<div class="gameend" style="display:none">
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
			<td v-bind:class="{'color':'white','background':player.color,'font-weight':800}">{{index+1}}</td>
			<td v-html="player.name"></td>
			<td v-html="player.army"></td>
			<td v-html="player.land"></td>
		</tr>
	</tbody></table>
	</div>
	<div class="toolcontain" v-if="!start">
		<div class="outer" id="showsearch" @click="nowwin=nowwin=='none'?'qry?name=1':'none'">
			<div class="search"></div>
		</div><br>
		<div class="outer" id="showinfo" @click="nowwin=nowwin=='none'?'info':'none'">
			<div class="infos"></div>
		</div><br>
		<div class="outer" id="showdrank" @click="nowwin=nowwin=='none'?'donationrk':'none'">
			<div class="donationrk"></div>
		</div><br>
		<div class="outer" id="showrank" @click="nowwin=nowwin=='none'?'ratingrk':'none'">
			<div class="ranking"></div>
		</div>
	</div>
	<div class="notice" v-if="nowwin!='none'&&!start">
		<iframe v-bind:src="nowwin" style="height:100%;width:100%;"></iframe>
	</div>
	<table cellspacing="0" cellpadding="0" border="0" v-if="start">
		 <tbody class="map">
		 </tbody>
	</table>
</template>

