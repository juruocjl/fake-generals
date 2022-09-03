var express = require('express')
var session = require("cookie-session");
const bp = require('body-parser');
const cookieParser=require('cookie-parser')
var app = express();
const io = require('nodejs-websocket');
const fs=require('fs');
const path=require('path');
const md=require('markdown-it')();
var md5 = require('md5-node');
function hasFile(name){console.log(name);try{fs.accessSync(name,fs.constants.F_OK);return true;}catch(err){return false;}}
try{fs.mkdirSync(path.join(__dirname,'replay'))}catch(err){}
const genffa = require('./maps/gen-ffa.js');
const gensb = require('./maps/gen-sb.js');
const gendark = require('./maps/gen-dark.js');
const genteam = require('./maps/gen-team.js');
const gentoxins = require('./maps/gen-toxins.js');
const genyinjian = require('./maps/gen-yinjian.js');
if(!hasFile(path.join(__dirname,'config.js')))fs.writeFileSync(path.join(__dirname,'config.js'),"module.exports={\n\tport:80,\n\teveryadd:25,\n\teachturn:600,\n\tguaji:50,\n\tdbhost:'localhost',\n\tdbport:'3306',\n\tdbuser:'root',\n\tdbpswd:'123456',\n\tdbname:'generals'\n};")
const config = require('./config.js');

app.use(cookieParser())
app.use(bp.urlencoded({extended:false}));
app.use(session({
    secret: config.dbpswd,
    resave: false,
    saveUninitialized: true
}))
const mysql = require('mysql');
var db = mysql.createConnection({
	host:config.dbhost,port:config.dbport,user:config.dbuser,
	password:config.dbpswd,database:config.dbname});
db.connect();
function fail(title,text){return '<!DOCTYPE HTML><html><head><title>'+title+'</title><meta charset="utf-8"></head><body style="display: flex;align-items: center;justify-content: center;height: calc(100vh);margin: 0;"><div style="text-align: center;"><h1>'+text+'</h1><a href="/">返回主页</a></div></body></html>';}
function calcvip(donate){if(donate>25)return 3;if(donate>10)return 2;if(donate>0)return 1;return 0;}
var infos=md.render('# 游戏说明\n'+fs.readFileSync(path.join(__dirname,'rules.md'))+'\n# 更新日志\n'+fs.readFileSync(path.join(__dirname,'changelog.md')));
app.get('/', function (req,res) {
	//console.log(req.session.userid,req.session.pswd)
	if(req.session.userid&&req.session.pswd){
		var sql = 'SELECT * FROM users WHERE id='+req.session.userid;
		db.query(sql,(err,result)=>{
			if(err){
				res.send(fail('查询失败',err.message));
				return;
			}else if(result.length==0||result[0].pswd!=req.session.pswd){
				req.session.userid=req.session.pswd=null;
				res.redirect('/');
			}else{
				res.cookie('userid',result[0].id,{maxAge:114514*24*60*60*1000});
				res.cookie('username',result[0].name,{maxAge:114514*24*60*60*1000});
				res.cookie('pswd',result[0].pswd,{maxAge:114514*24*60*60*1000})
				res.cookie('rating',result[0].rating,{maxAge:114514*24*60*60*1000})
				res.cookie('vip',calcvip(result[0].donation),{maxAge:114514*24*60*60*1000});
				res.sendFile(path.join(__dirname,"front","dist","index.html"));
			}
		});
	}else{
		res.sendFile(path.join(__dirname,"login.html"));
	}
})
app.get('/replay', function (req,res) {
   res.sendFile(path.join(__dirname,"front","dist","replay.html"));
})
app.get('/main.css', function (req,res) {
   res.sendFile(path.join(__dirname,"main.css"));
})
app.get('/getfile', function (req,res) {
	var sql='SELECT * from games WHERE id='+req.query.name;
	db.query(sql,(err,result)=>{
		if(err){
			res.send(fail('查询失败',err.message));
			return;
		}else{
			if(result.length==1){
				var ver=parseInt(result[0].ver);
				//console.log(ver);
				var everyadd=parseInt(result[0].everyadd);
				var users=JSON.parse(result[0].users);
				var his=JSON.parse(fs.readFileSync(path.join(__dirname,'replay',req.query.name+'.json')));
				res.send(JSON.stringify({'ver':ver,'everyadd':everyadd,'users':users,'his':his}));
			}else res.send('Not Found');
		}
	});
})
app.get('/logout', function (req,res) {
	req.session.userid=req.session.pswd=null;
	res.redirect('/');
})
function showname(name,rating){
	if(rating<1200)return '<span class="newbiw">'+name+'</span>';
	if(rating<1400)return '<span class="pupil">'+name+'</span>';
	if(rating<1600)return '<span class="specialist">'+name+'</span>';
	if(rating<1900)return '<span class="expert">'+name+'</span>';
	if(rating<2100)return '<span class="candidate-master">'+name+'</span>';
	if(rating<2400)return '<span class="master">'+name+'</span>';
	if(rating<3000)return '<span class="grandmaster">'+name+'</span>';
	return '<span class="legendary-grandmaster">'+name+'</span>';
}
app.get('/donationrk', function (req,res){
	var sql='SELECT * from users WHERE donation>0 ORDER BY donation DESC LIMIT 20';
	db.query(sql,(err,result)=>{
		if(err){
			res.send({'status':'err'});
		}else{
			var arr=[];
			for(var i=0;i<result.length;i++)
				arr.push({
					name:showname(result[i].name,result[i].rating)+"<i class='vip"+calcvip(result[i].donation)+"'/>"
				});
			res.send(JSON.stringify({'status':'success','data':arr}));
		}
	});
});
app.get('/ratingrk', function (req,res){
	var sql='SELECT * from users ORDER BY rating DESC LIMIT 20';
	db.query(sql,(err,result)=>{
		if(err){
			res.send({'status':'err'});
		}else{
			//console.log(result);
			var arr=[];
			for(var i=0;i<result.length;i++)
				arr.push({
					name:showname(result[i].name,result[i].rating)+"<i class='vip"+calcvip(result[i].donation)+"'/>",
					rating:showname(result[i].rating,result[i].rating)
				});
			res.send(JSON.stringify({'status':'success','data':arr}));
		}
	});
});
app.get('/infos',function(req,res){
	res.send(JSON.stringify({'status':"success","data":infos}));
})
app.post('/submit',function(req,res){
    //console.log(req.body);
    if(req.body.type=="login"){
		var sql = 'SELECT * FROM users WHERE name="'+req.body.name+'"';
		db.query(sql,(err,result)=>{
			if(err){
				res.send(fail('查询失败',err.message));
				return;
			}else{
				//console.log(result);
				if(result.length==0){
					res.send(fail('用户未找到','用户未找到'));
				}else if(md5(req.body.pswd)!=result[0].pswd){
					res.send(fail('密码错误','密码错误'));
				}else{
					req.session.userid=result[0].id;
					req.session.pswd=result[0].pswd;
					res.redirect('/')
				}
			}
		});
	}else{
		if(!req.body.name.match(/^[a-z0-9]+$/g)){
			res.send(fail('注册失败','只能使用小写字母和数字'));
		}else if(req.body.name.length>20){
			res.send(fail('注册失败','名字最多为20个字符'));
		}else if(req.body.pswd.length>25){
			res.send(fail('注册失败','密码最多为25个字符'));
		}else if(req.body.name.length<6){
			res.send(fail('注册失败','名字至少为6个字符'));
		}else if(req.body.pswd.length<8){
			res.send(fail('注册失败','密码至少为8个字符'));
		}else{
			var sql = 'SELECT * FROM users WHERE name="'+req.body.name+'"';
			db.query(sql,(err,result)=>{
				if(err){
					res.send(fail('查询失败',err.message));
					return;
				}else{
					//console.log(result);
					if(result.length==0){
						var sql = 'INSERT INTO `users`(`name`, `pswd`) VALUES (?,?)';
						db.query(sql,[req.body.name,md5(req.body.pswd)],(err,result)=>{
							if(err){
								res.send(fail('注册失败',err.message));
								return;
							}else{
								console.log(result);
								req.session.userid=result.insertId;
								req.session.pswd=md5(req.body.pswd);
								res.redirect('/')
							}
						});
					}else{
						res.send(fail('注册失败','用户名已被注册'));
					}
				}
			});
		}
	}
})
app.get('/qry',function(req,res){
	var sql='SELECT users from games WHERE id='+req.query.name;
	db.query(sql,(err,result)=>{
		if(err)res.send(JSON.stringify({'status':'err','data':'err'}));
		else if(result.length){
			var arr=[];
			var users=JSON.parse(result[0].users);
			users.sort((A,B)=>{return A.rk-B.rk;});
			//console.log(users);
			for(var i=0;i<users.length;i++){
				var O=parseInt(users[i].rating),N=O+parseInt(users[i].delta);
				arr.push({
					name:users[i].name+' <i class="vip'+users[i].vip+'"/>',
					delta:users[i].delta,
					change:showname(O,O)+' → '+showname(N,N)
				})
			}
			res.send(JSON.stringify({'status':'success','data':arr}));
		}else res.send(JSON.stringify({'status':'err','data':'Not Found'}));
	});
});
app.use(express.static(path.join(__dirname,'front','dist')));
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
const typename=["ffa","sb","dark","toxins","yinjian","team"];
const weathername=["lightning","earthquake","wind"]
var start=false;
var players=[];
var map=[];
var users=[];
var n,m;
const everyadd=config.everyadd;
const eachturn=config.eachturn;
const guanji=config.guaji;
var turn=0;
var rank=[];
var his=[];
var dieturn=[];
var member=[];
var count=[0,0,0,0,0,0];
var wcount=[0,0,0]
var type;
var weather;
var ltx=undefined,lty=undefined;
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
function getCookie(cookie,cname) {
	if(!cookie)return "";
	var name = cname + "=";
	var ca = cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}
var nowuser=[];
var ws=io.createServer(connection=>{
	console.log('new connection...');
	var userid=getCookie(connection.headers.cookie,"userid");
	var username=decodeURIComponent(getCookie(connection.headers.cookie,"username"));
	var pswd=getCookie(connection.headers.cookie,"pswd");
	var rating=getCookie(connection.headers.cookie,"rating");
	var vip=0;
	//console.log(userid,username,pswd);
	var sql = 'SELECT * FROM users WHERE id='+userid;
	db.query(sql,(err,result)=>{
		if(err){
			console.error(err);
			connection.close();
		}else if(result.length==0||result[0].pswd!=pswd||result[0].name!=username||result[0].rating!=rating){
			console.log('pswd or username or rating err');
			connection.close();
		}else{
			vip=calcvip(result[0].donation)
			console.log(username,vip);
		}
	});
	if(nowuser.indexOf(userid)!=-1){
		connection.close();
		return;
	}
	nowuser.push(userid);
	var updatecnt=()=>{
		count=[0,0,0,0,0,0];
		wcount=[0,0,0];
		member.forEach((x)=>{count[x.type]++;x.weather.forEach((y)=>{if(weathername.indexOf(y)>=0)wcount[weathername.indexOf(y)]++;})});
		ws.connections.forEach((connection)=>{
			connection.send(JSON.stringify({'typ':'count change','tot':member.length,'count':count,'wcount':wcount}));
		});
	}
	var quit=()=>{
		for(var i=0;i<member.length;i++)if(member[i].uid==userid)member.splice(i,1);
	}
	var join=(tp,wt)=>{
		member.push({'uid':userid,'name':username,'vip':vip,'rating':parseInt(rating),'type':tp,'weather':wt});
	}
	connection.on("text",(data)=>{
		data=JSON.parse(data);
		//console.log(data);
		if(data.typ=='startgame'){
			if(!start&&member.length>1){
				start=true;
				var mx=0;
				count.forEach((x)=>{mx=Math.max(mx,x)});
				for(var i=typename.length-1;i>=0;i--)if(count[i]==mx)type=typename[i];
				weather={};
				if(wcount[0]*2>=member.length)weather.lightning=true;
				if(wcount[1]*2>=member.length)weather.earthquake=true;
				if(wcount[2]*2>=member.length)weather.wind=true;
				console.log('start',type,weather);
				if(type!='team'){
					member.forEach((x)=>{
						players.push(
						{
							"name":x.name,
							"uid":x.uid,
							'vip':x.vip,
							'rating':x.rating,
							'Delta':0,'guaji':false,'queue':new Deque(),
							'alive':true,'lstmap':[],'lstvis':0,
							'team':players.length
						});
					});
				}else{
					member.sort(()=>{return Math.random()-0.5;});
					for(var i=0;i<member.length;i++)member[i].team=(i<member.length/2)?0:1;
					member.forEach((x)=>{
						players.push(
						{
							"name":x.name,
							"uid":x.uid,
							'vip':x.vip,
							'rating':x.rating,
							'Delta':0,'guaji':false,'queue':new Deque(),
							'alive':true,'lstmap':[],'lstvis':0,
							'team':x.team
						});
					});
				}
				var res;
				if(type=="ffa")res=genffa.genMap(players.length);
				if(type=="sb")res=gensb.genMap(players.length);
				if(type=="dark")res=gendark.genMap(players.length);
				if(type=="toxins")res=gentoxins.genMap(players.length);
				if(type=="yinjian")res=genyinjian.genMap(players.length);
				if(type=="team"){
					var teams=[[],[]];
					for(var i=0;i<players.length;i++)
						teams[players[i].team].push(i);
					res=genteam.genMap(teams[0],teams[1]);
				}
				n=res.n;
				m=res.m;
				map=res.map;
				players.forEach((x)=>{users[users.length]={'name':x.name,'vip':x.vip,'rating':x.rating}});
				console.log(users);
				var firstmap="";
				for(var i=0;i<players.length;i++)
					for(var j=0;j<n;j++){
						players[i].lstmap[j]=[];
						for(var k=0;k<m;k++)
							if((map[j][k][0]!=1&&map[j][k][0]!=-1&&map[j][k][0]!=3)||type=="dark"||type=="yinjian")
								players[i].lstmap[j][k]=[-2];
							else players[i].lstmap[j][k]=[-3];
					}
				for(var i=0;i<n;i++)for(var j=0;j<m;j++)
					if((map[i][j][0]!=1&&map[i][j][0]!=-1&&map[i][j][0]!=3)||type=="dark"||type=="yinjian")firstmap+="0";
					else firstmap+="1";
				ws.connections.forEach((connection)=>{
					connection.send(JSON.stringify({'typ':'init game','n':n,'m':m,'firstmap':firstmap,'users':users}));
				});
				his[0]=JSON.parse(JSON.stringify(map));
				var timer=setInterval(()=>{
					++turn;
					console.log('turn',turn);
					var predMap=pred(map,(turn+1)%everyadd==0,turn%2==1);
					const ddx=[-1,1,0,0];
					const ddy=[0,0,-1,1];
					for(var i=0;i<players.length;i++)if(players[i].alive){
						while(players[i].queue.size()){
							var now=players[i].queue.popFront();
								var xx,yy;
								if(now.length==3)xx=now[0]+ddx[now[2]%4],yy=now[1]+ddy[now[2]%4];
								else xx=now[2],yy=now[3];
								if(map[now[0]][now[1]][1]==i)
									if(map[now[0]][now[1]][2]>1)
										if(0<=xx&&xx<n&&0<=yy&&yy<m)
											if(map[xx][yy][0]!=-1&&
												!(map[xx][yy][0]==3&&map[xx][yy][1]>=0&&
												players[map[xx][yy][1]].team==players[i].team)){
												var val;
												if((now.length==3&&now[2]<4)||(now.length==5&&now[4]==0))
													val=map[now[0]][now[1]][2]-1;
												else val=Math.floor(map[now[0]][now[1]][2]/2);
												//console.log(map[xx][yy],val);
												map[now[0]][now[1]][2]-=val;
												if(now.length==5&&weather.wind)
													xx+=Math.floor(Math.random()*3)-1,
													yy+=Math.floor(Math.random()*3)-1;
												if(xx<0||xx>=n||yy<0||yy>=m||
													map[xx][yy][0]==-1||map[xx][yy][0]==5);
												else if(map[xx][yy][1]>=0&&players[map[xx][yy][1]].team==players[i].team){
													map[xx][yy][2]+=val;
													if(map[xx][yy][0]!=2)map[xx][yy][1]=i;
												}else{
													if(val>map[xx][yy][2]){
														if(map[xx][yy][0]==2){
															var dead=map[xx][yy][1];
															if(players[dead].alive){
																players[dead].alive=false;
																dieturn[dieturn.length]=dead;
																players[i].Delta+=100*(players[dead].rating/players[i].rating)*Math.log2(1+rank[dead][0]/rank[i][0]);
																players[dead].Delta-=50*(players[dead].rating/players[i].rating)*Math.log2(1+rank[dead][0]/rank[i][0]);
															}
															var ori=map[xx][yy][2];
															for(var x=0;x<n;x++)for(var y=0;y<m;y++)if(map[x][y][1]==dead)
																map[x][y][1]=i,map[x][y][2]=Math.ceil(map[x][y][2]/2);
															map[xx][yy][2]=val-ori;
															map[xx][yy][0]=1;
														}else if(map[xx][yy][0]!=3){
															map[xx][yy][2]=val-map[xx][yy][2];
															map[xx][yy][1]=i;
														}else{
															map[now[0]][now[1]][2]+=val-map[xx][yy][2];
															map[xx][yy][2]=0;
															map[xx][yy][1]=i;
														}
													}
													else
														map[xx][yy][2]-=val;
												}
												break;
											}
						}
					}
					ltx=lty=-1;
					if(turn%2==1){
						for(var i=0;i<n;i++)
							for(var j=0;j<m;j++)
								if((map[i][j][0]==1||map[i][j][0]==3)&&map[i][j][1]>=0)
									map[i][j][2]+=1+(type=="yinjian"?4:0);
								else if(map[i][j][0]==2)
									map[i][j][2]+=1+(type=="yinjian"?4:0);
								else if(map[i][j][0]==4){
									map[i][j][2]--;
									if(map[i][j][2]<=0)
										map[i][j][1]=-1,
										map[i][j][2]=0;
								}
						if(weather.lightning){
							map[ltx=Math.floor(Math.random()*n)][lty=Math.floor(Math.random()*m)][2]=0;
						}
						if(weather.earthquake&&(turn+1)%4==0){
							var mountains=[],emptys=[];
							for(var i=0;i<n;i++)for(var j=0;j<m;j++)
								if(map[i][j][0]==-1)mountains.push([i,j]);
								else if(map[i][j][0]==0)emptys.push([i,j]);
							mountains.sort(()=>{return Math.random()-0.5});
							emptys.sort(()=>{return Math.random()-0.5});
							while(mountains.length>1)mountains.pop();
							while(emptys.length>1)emptys.pop();
							mountains.forEach((x)=>{map[x[0]][x[1]]=[0,-1,0];});
							emptys.forEach((x)=>{map[x[0]][x[1]]=[-1,0,0];});
						}
						if((turn+1)%everyadd==0)
							for(var i=0;i<n;i++)
								for(var j=0;j<m;j++)
									if(map[i][j][0]==0&&map[i][j][1]>=0)
										map[i][j][2]++;
					}
					his[turn]=[['lt',ltx,lty]];
					for(var i=0;i<n;i++)for(var j=0;j<m;j++)if(map[i][j].toString()!=predMap[i][j].toString())
						his[turn].push([i,j,JSON.parse(JSON.stringify(map[i][j]))]);
					//console.log(his[turn]);
					for(var i=0;i<players.length;i++)if(players[i].alive&&turn-players[i].lstvis>=guanji){
						players[i].alive=false,
						players[i].guaji=true,
						players[i].Delta-=5;
						dieturn[dieturn.length]=i;
					}
					var nowalive=0;
					var teamalive=[];
					for(var i=0;i<players.length;i++)teamalive[players[i].team]=0;
					for(var i=0;i<players.length;i++){
						rank[i]=[0,0];
						if(players[i].alive)
							teamalive[players[i].team]=1;
					}
					for(var i=0;i<teamalive.length;i++)
						nowalive+=teamalive[i];
					for(var i=0;i<n;i++)for(var j=0;j<m;j++)if(map[i][j][0]>=0&&map[i][j][1]>=0){
						rank[map[i][j][1]][1]++;
						rank[map[i][j][1]][0]+=map[i][j][2];
					}
					console.log(nowalive);
					if(nowalive<=1){
						var kk=Math.min(1,(players.length-1)/4);
						if(type!='ffa')kk=0;
						if(nowalive){
							for(i=0;i<players.length;i++)if(players[i].alive){
								dieturn[dieturn.length]=i;
							}
						}
						for(var i=0;i<players.length;i++)
							players[dieturn[i]].rk=players.length-i;
						if(players.length>1)
							for(var i=0;i<players.length;i++)
								players[i].Delta+=200-300*(players[i].rk-1)/(players.length-1);
						console.log(players);
						for(var i=0;i<players.length;i++){
							players[i].Delta=Math.floor((players[i].Delta)*kk);
							var sql = 'UPDATE users SET rating = '+Math.max(1000,players[i].rating+players[i].Delta)+' WHERE id="'+players[i].uid+'"';
							db.query(sql,(err,result)=>{
								if(err){
									console.error(err);
								}
							});
						}
						users=[];
						for(var i=0;i<players.length;i++)
							users[i]={
								'uid':players[i].uid,
								'name':players[i].name,
								'vip':players[i].vip,
								'rk':players[i].rk,
								'rating':players[i].rating,
								'delta':players[i].Delta,
								'guaji':players[i].guaji,
								'team':players[i].team
							}
						var sql = 'INSERT INTO `games` (`type`, `weather`, `ver`,  `everyadd`,  `users`) VALUES (?, ?, ?, ?, ?)';
						db.query(sql,[type,JSON.stringify(weather),2,everyadd,JSON.stringify(users)],(err,result)=>{
							if(err){
								console.error(err);
							}else{
								ws.connections.forEach((connection)=>{
									connection.send(JSON.stringify({'typ':'end','lstmap':map,'lstrank':rank,'name':result.insertId}));
								});
								fs.writeFileSync(path.join(__dirname,'replay',result.insertId+'.json'),JSON.stringify(his))
								start=false;
								canjoin=true;
								players=[];
								map=[];
								his=[];
								turn=0;
								rank=[];
								users=[];
								dieturn=[];
								member=[];
								count=[0,0,0,0,0,0];
								wcount=[0,0,0];
								lst=-1;
								clearInterval(timer);
							}
						});
					}else{
						ws.connections.forEach((connection)=>{
							connection.send(JSON.stringify({'typ':'new turn','turn':turn,'rank':rank}));
						});
					}
				},eachturn);
			}
		}
		if(data.typ=='get map'){
			//console.log(players,data);
			for(var id=0;id<players.length;id++)if(players[id].uid==userid){
				players[id].lstmap=pred(players[id].lstmap,(turn+1)%everyadd==0,turn%2==1);
				var diff=[];
				for(var i=0;i<n;i++){
					for(var j=0;j<m;j++){
						var flag=false,now;
						var range=((type=="dark"||type=="yinjian")&&map[i][j][0]!=2?0:1);
						for(var dx=-range;dx<=range;dx++)for(var dy=-range;dy<=range;dy++)
							if(0<=i+dx&&i+dx<n&&0<=j+dy&&j+dy<m&&map[i+dx][j+dy][0]>=0
								&&map[i+dx][j+dy][1]>=0&&players[map[i+dx][j+dy][1]].team==players[id].team)
								flag=true;
						if(!flag){
							if((map[i][j][0]!=1&&map[i][j][0]!=-1&&map[i][j][0]!=3)||type=="dark"||type=="yinjian")now=[-2];
							else now=[-3];
						}else now=JSON.parse(JSON.stringify(map[i][j]));
						if(now.toString()!=players[id].lstmap[i][j].toString()){
							//console.log(id,i,j,now,map[i][j]);
							players[id].lstmap[i][j]=now;
							diff[diff.length]=[i,j,now];
						}
					}
				}
				if(data.full)
					connection.send(JSON.stringify({'typ':'map','ltx':ltx,'lty':lty,'val':(turn+1)%everyadd==0,'add':turn%2==1,'full':true,'map':players[id].lstmap,'queue':players[id].queue.to_string()}))
				else
					connection.send(JSON.stringify({'typ':'map','ltx':ltx,'lty':lty,'val':(turn+1)%everyadd==0,'add':turn%2==1,'full':false,'diff':diff,'queue':players[id].queue.to_string()}));
				return;
			}
			connection.send(JSON.stringify({'typ':'map','ltx':ltx,'lty':lty,'val':false,'full':false,'diff':[],'queue':""}));
		}
		if(data.typ=='add queue'){
			for(var id=0;id<players.length;id++)if(players[id].uid==userid){
				players[id].queue.addBack(data.data);
				players[id].lstvis=turn;
			}
		}
		if(data.typ=='pop queue'){
			for(var id=0;id<players.length;id++)if(players[id].uid==userid){
				if(players[id].queue.size())players[id].queue.popBack();
				players[id].lstvis=turn;
			}
		}
		if(data.typ=='clear queue'){
			for(var id=0;id<players.length;id++)if(players[id].uid==userid){
				if(players[id].queue.size())players[id].queue.clear();
				players[id].lstvis=turn;
			}
		}
		if(data.typ=="surrender"){
			for(var id=0;id<players.length;id++)if(players[id].alive&&players[id].uid==userid){
				players[id].alive=false;
				dieturn[dieturn.length]=id;
			}
		}
		if(data.typ=="type change"){
			if(!start){
				quit();
				if(typename.indexOf(data.type)>=0)
					join(typename.indexOf(data.type),data.weather);
				updatecnt();
			}
		}
		if(data.typ=="weather change"){
			if(!start){
				for(var i=0;i<member.length;i++)
					if(member[i].uid==userid)
						member[i].weather=data.type;
				updatecnt();
			}
		}
	})
	connection.on("close", function (code, reason) {
		console.log("Connection closed");
		quit();
		updatecnt();
		if(nowuser.indexOf(userid)!=-1)nowuser.splice(nowuser.indexOf(userid));
	})
	connection.on("error",() => {
		console.log('服务异常关闭...');
		quit();
		updatecnt();
		ws.connections.forEach((connection)=>{connection.send(JSON.stringify({'typ':'count change','count':count}));});
		if(nowuser.indexOf(userid)!=-1)nowuser.splice(nowuser.indexOf(userid));
	})
	if(start)connection.send(JSON.stringify({'typ':'already start','n':n,'m':m,'users':users}));
	connection.send(JSON.stringify({'typ':'count change','tot':member.length,'count':count,'wcount':wcount}));
});
ws.listen(3000)
var server = app.listen(config.port)
