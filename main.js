var express = require('express')
var session = require("express-session");
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
const gen = require('./gen.js');
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
var infos=md.render('# 操作说明\n'+fs.readFileSync(path.join(__dirname,'rules.md'))+'\n# 更新日志\n'+fs.readFileSync(path.join(__dirname,'changelog.md')));
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
				res.sendFile(path.join(__dirname,"index.html"));
			}
		});
	}else{
		res.sendFile(path.join(__dirname,"login.html"));
	}
})
app.get('/replay', function (req,res) {
   res.sendFile(path.join(__dirname,"replay.html"));
})
app.get('/forkme_right_darkblue_121621.png', function (req,res) {
   res.sendFile(path.join(__dirname,"/forkme_right_darkblue_121621.png"));
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
				var everyadd=JSON.parse(result[0].everyadd);
				var users=JSON.parse(result[0].users);
				var his=JSON.parse(fs.readFileSync(path.join(__dirname,'replay',req.query.name+'.json')));
				res.send(JSON.stringify({'everyadd':everyadd,'users':users,'his':his}));
			}else res.send('Not Found');
		}
	});
})
app.get('/askfgaksgfkhsgkf', function (req,res) {
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
			res.send(fail('查询失败',err.message));
			return;
		}else{
			//console.log(result);
			var html='<!DOCUTYPE HTML><html><head><meta charset="utf-8"></head><link rel="stylesheet" type="text/css" href="main.css"><body><h1>donation榜</h1><table border="1" style="width:100%"><tbody><tr><th>排名</th><th>用户名</th></tr>';
			for(var i=0;i<result.length;i++)
				html+='<tr><td>'+(i+1)+'</td><td>'+showname(result[i].name,result[i].rating)+' <i class="vip'+calcvip(result[i].donation)+'"></i></td></tr>';
			html+='</tbody></table></body></html>';
			res.send(html);
		}
	});
});
app.get('/ratingrk', function (req,res){
	var sql='SELECT * from users ORDER BY rating DESC LIMIT 20';
	db.query(sql,(err,result)=>{
		if(err){
			res.send(fail('查询失败',err.message));
			return;
		}else{
			//console.log(result);
			var html='<!DOCUTYPE HTML><html><head><meta charset="utf-8"></head><link rel="stylesheet" type="text/css" href="main.css"><body><h1>rating榜</h1><table border="1" style="width:100%"><tbody><tr><th>排名</th><th>用户名</th><th>分数</th></tr>';
			for(var i=0;i<result.length;i++)
				html+='<tr><td>'+(i+1)+'</td><td>'+showname(result[i].name,result[i].rating)+' <i class="vip'+calcvip(result[i].donation)+'"></i></td><td>'+result[i].rating+'</td></tr>';
			html+='</tbody></table></body></html>';
			res.send(html);
		}
	});
});
app.get('/infos',function(req,res){
	res.send(infos);
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
		if(!req.body.name.match(/^[a-z0-9]+$/gi)){
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
		var html='<!DOCUTYPE HTML><html><head><meta charset="utf-8"></head><link rel="stylesheet" type="text/css" href="main.css"><body><h1>rating变化查询</h1><input id="name" value="'+req.query.name+'"></input><button onclick="location.href=\'qry?name=\'+document.getElementById(\'name\').value;">go</button> <a href="replay?name='+req.query.name+'">回放</a><br>';
		if(err)html+="查询失败 "+err;
		else if(result.length){
			html+='<table border="1" style="width:100%"><tbody><tr><th>排名</th><th>用户名</th><th>△</th><th>变化</th></tr>';
			var users=JSON.parse(result[0].users);
			users.sort((A,B)=>{return A.rk-B.rk;});
			//console.log(users);
			for(var i=0;i<users.length;i++){
				var O=parseInt(users[i].rating),N=O+parseInt(users[i].delta);
				html+='<tr><td>'+(i+1)+'</td><td>'+users[i].name+' <i class="vip'+users[i].vip+'"></i></td><td>'+users[i].delta+'</td><td>'
				+showname(O,O)+' → '+showname(N,N)+'</td></tr>';
			}
			html+='</tbody></table>';
		}else html+='未找到';
		html+='</body></html>';
		res.send(html);
	});
});
const wyh="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
function randstr(len){
	var str="";
	for(var i=0;i<len;i++)
		str+=wyh[Math.floor(Math.random()*wyh.length)];
	return str;
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
var start=false;
var canjoin=true;
var players=[];
var map=[];
var users=[];
var n,m;
const everyadd=config.everyadd;
const eachturn=config.eachturn;
const guanji=config.guaji;
var turn=0;
var rank=[];
var lst=-1;
var his=[];
var dieturn=[];
function pred(Map,val){
	Map=JSON.parse(JSON.stringify(Map));
	for(var i=0;i<n;i++)
		for(var j=0;j<m;j++){
			if(Map[i][j][0]>=0&&Map[i][j][1]>=0){
				if(Map[i][j][0]==0)Map[i][j][2]+=val;
				else Map[i][j][2]++;
			}
		}
	return Map;
}
function getCookie(cookie,cname) {
	var name = cname + "=";
	var ca = cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}
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
			return;
		}else if(result.length==0||result[0].pswd!=pswd||result[0].name!=username||result[0].rating!=rating){
			console.log('pswd or username or rating err');
			connection.close();
		}else{
			vip=calcvip(result[0].donation)
			console.log(username,vip);
		}
	});
	connection.on("text",(data)=>{
		data=JSON.parse(data);
		//console.log(data);
		if(data.typ=='startgame'){
			if(!start){
				start=true;
				ws.connections.forEach((connection)=>{
					connection.send(JSON.stringify({'typ':'start'}));
				});
				setTimeout(()=>{
					//console.log(players);
					canjoin=false;
					var res=gen.genMap(players.length);
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
								if(map[j][k][0]!=1&&map[j][k][0]!=-1&&map[j][k][0]!=3)players[i].lstmap[j][k]=[-2];
								else players[i].lstmap[j][k]=[-3];
						}
					for(var i=0;i<n;i++)for(var j=0;j<m;j++)
						if(map[i][j][0]!=1&&map[i][j][0]!=-1&&map[i][j][0]!=3)firstmap+="0";
						else firstmap+="1";
					ws.connections.forEach((connection)=>{
						connection.send(JSON.stringify({'typ':'init game','n':n,'m':m,'firstmap':firstmap,'users':users}));
					});
					his[0]=JSON.parse(JSON.stringify(map));
					var timer=setInterval(
						()=>{
							++turn;
							console.log('turn',turn);
							var predMap=pred(map,turn%everyadd==0);
							for(var i=0;i<n;i++)
								for(var j=0;j<m;j++)
									if((map[i][j][0]==1||map[i][j][0]==3)&&map[i][j][1]>=0)
										map[i][j][2]++;
									else if(map[i][j][0]==2)
										map[i][j][2]++;
							if(turn%everyadd==0)
								for(var i=0;i<n;i++)
									for(var j=0;j<m;j++)
										if(map[i][j][0]==0&&map[i][j][1]>=0)
											map[i][j][2]++;
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
													if(map[xx][yy][0]!=-1){
														var val;
														if((now.length==3&&now[2]<4)||(now.length==5&&now[4]==0))
															val=map[now[0]][now[1]][2]-1;
														else val=Math.floor(map[now[0]][now[1]][2]/2);
														console.log(map[xx][yy],val);
														map[now[0]][now[1]][2]-=val;
														if(map[xx][yy][1]==i){
															if(map[xx][yy][0]!=3)map[xx][yy][2]+=val;
															else map[now[0]][now[1]][2]+=val;
														}else{
															if(val>map[xx][yy][2]){
																if(map[xx][yy][0]==2){
																	map[xx][yy][2]=val-map[xx][yy][2];
																	var dead=map[xx][yy][1];
																	players[dead].alive=false;
																	dieturn[dieturn.length]=dead;
																	for(var x=0;x<n;x++)for(var y=0;y<m;y++)if(map[x][y][1]==dead)
																		map[x][y][1]=i;
																	map[xx][yy][0]=1;
																	players[i].Delta+=100*(players[dead].rating/players[i].rating)*Math.log2(1+rank[dead][0]/rank[i][0]);
																	players[i].Delta-=50*(players[dead].rating/players[i].rating)*Math.log2(1+rank[dead][0]/rank[i][0]);
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
							his[turn]=[];
							for(var i=0;i<n;i++)for(var j=0;j<m;j++)if(map[i][j].toString()!=predMap[i][j].toString())
								his[turn][his[turn].length]=[i,j,JSON.parse(JSON.stringify(map[i][j]))];
							//console.log(his[turn]);
							for(var i=0;i<players.length;i++)if(players[i].alive&&turn-players[i].lstvis>=guanji){
								players[i].alive=false,
								players[i].guaji=true,
								players[i].Delta-=200;
								dieturn[dieturn.length]=i;
							}
							var nowalive=0;
							for(var i=0;i<players.length;i++)
								rank[i]=[0,0],nowalive+=players[i].alive;
							for(var i=0;i<n;i++)for(var j=0;j<m;j++)if(map[i][j][0]>=0&&map[i][j][1]>=0){
								rank[map[i][j][1]][1]++;
								rank[map[i][j][1]][0]+=map[i][j][2];
							}
							if(nowalive<=1){
								var winner=-1;
								var kk=Math.min(1,(players.length-1)/4);
								if(nowalive){
									for(winner=0;winner<players.length;winner++)if(players[winner].alive){
										dieturn[dieturn.length]=winner;break;
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
										'guaji':players[i].guaji
									}
								var sql = 'INSERT INTO `games` (`everyadd`,  `users`) VALUES (?, ?)';
								db.query(sql,[everyadd,JSON.stringify(users)],(err,result)=>{
									if(err){
										console.error(err);
									}else{
										ws.connections.forEach((connection)=>{
											connection.send(JSON.stringify({'typ':'end','lstmap':map,'lstrank':rank,'winner':winner,'name':result.insertId}));
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
				},1000)
			}
		}
		if(data.typ=='join game'){
			if(canjoin){
				//console.log(username,userid,vip,rating);
				for(var i=0;i<players.length;i++)if(players[i].uid==userid)
					{connection.close();return;}
				players[players.length]={"name":username,"uid":userid,'vip':vip,'rating':parseInt(rating),'Delta':0,'guaji':false,'queue':new Deque(),'alive':true,'lstmap':[],'lstvis':0};
			}
		}
		if(data.typ=='get map'){
			//console.log(players,data);
			for(var id=0;id<players.length;id++)if(players[id].uid==userid){
				players[id].lstmap=pred(players[id].lstmap,turn%everyadd==0);
				var diff=[];
				for(var i=0;i<n;i++){
					for(var j=0;j<m;j++){
						var flag=false,now;
						for(var dx=-1;dx<=1;dx++)for(var dy=-1;dy<=1;dy++)
							if(0<=i+dx&&i+dx<n&&0<=j+dy&&j+dy<m&&map[i+dx][j+dy][0]>=0&&map[i+dx][j+dy][1]==id)
								flag=true;
						if(!flag){
							if(map[i][j][0]!=1&&map[i][j][0]!=-1&&map[i][j][0]!=3)now=[-2];
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
					connection.send(JSON.stringify({'typ':'map','val':turn%everyadd==0,'full':true,'map':players[id].lstmap,'queue':players[id].queue.to_string()}))
				else
					connection.send(JSON.stringify({'typ':'map','val':turn%everyadd==0,'full':false,'diff':diff,'queue':players[id].queue.to_string()}));
				return;
			}
			connection.send(JSON.stringify({'typ':'map','val':false,'full':false,'diff':[],'queue':""}));
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
	})
	connection.on("close", function (code, reason) {
		console.log("Connection closed");
		if(lst!=ws.connections.length&&!start)lst=ws.connections.length,ws.connections.forEach((connection)=>{connection.send(JSON.stringify({'typ':'new connection','cnt':lst}))});
	})
	connection.on("error",() => {
		console.log('服务异常关闭...');
		if(lst!=ws.connections.length&&!start)lst=ws.connections.length,ws.connections.forEach((connection)=>{connection.send(JSON.stringify({'typ':'new connection','cnt':lst}))});
	})
	if(start)connection.send(JSON.stringify({'typ':'already start','n':n,'m':m,'users':users}));
	else lst=ws.connections.length,ws.connections.forEach((connection)=>{connection.send(JSON.stringify({'typ':'new connection','cnt':lst}))});
});
ws.listen(3000)
var server = app.listen(config.port)
