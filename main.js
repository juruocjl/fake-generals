var express = require('express')
var session = require("express-session");
const bp = require('body-parser');
const cookieParser=require('cookie-parser')
var app = express();
const io = require('nodejs-websocket');
const uuid = require('uuid');
const fs=require('fs');
const path=require('path');
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
function fail(title,text){
	return '<!DOCTYPE HTML><html><head><title>'+title+'</title><meta charset="utf-8"></head><body style="display: flex;align-items: center;justify-content: center;height: calc(100vh);margin: 0;"><div style="text-align: center;"><h1>'+text+'</h1><a href="/">返回主页</a></div></body></html>';
}
app.get('/', function (req,res) {
	console.log(req.session.userid,req.session.pswd)
	if(req.session.userid&&req.session.pswd){
		var db = mysql.createConnection({
		  host:config.dbhost,port:config.dbport,user:config.dbuser,
		  password:config.dbpswd,database:config.dbname});
		db.connect();
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
				res.sendFile(path.join(__dirname,"index.html"));
			}
		});
		db.end();
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
app.get('/getfile', function (req,res) {
	if(hasFile(path.join(__dirname,'replay',req.query.name+'.json')))
		res.send(fs.readFileSync(path.join(__dirname,'replay',req.query.name+'.json')));
	else res.send('Not Found');
})
app.post('/submit',function(req,res){
    console.log(req.body);
    if(req.body.type=="login"){
		var db = mysql.createConnection({
		  host:config.dbhost,port:config.dbport,user:config.dbuser,
		  password:config.dbpswd,database:config.dbname});
		db.connect();
		var sql = 'SELECT * FROM users WHERE name="'+req.body.name+'"';
		db.query(sql,(err,result)=>{
			if(err){
				res.send(fail('查询失败',err.message));
				return;
			}else{
				console.log(result);
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
		db.end();
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
			var db = mysql.createConnection({
			  host:config.dbhost,port:config.dbport,user:config.dbuser,
			  password:config.dbpswd,database:config.dbname});
			db.connect();
			var sql = 'SELECT * FROM users WHERE name="'+req.body.name+'"';
			db.query(sql,(err,result)=>{
				if(err){
					res.send(fail('查询失败',err.message));
					return;
				}else{
					console.log(result);
					if(result.length==0){
						var db = mysql.createConnection({
						  host:config.dbhost,port:config.dbport,user:config.dbuser,
						  password:config.dbpswd,database:config.dbname});
						db.connect();
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
						db.end();
					}else{
						res.send(fail('注册失败','用户名已被注册'));
					}
				}
			});
			db.end();
		}
	}
})
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
	var db = mysql.createConnection({
		host:config.dbhost,port:config.dbport,user:config.dbuser,
	password:config.dbpswd,database:config.dbname});
	db.connect();
	var userid=getCookie(connection.headers.cookie,"userid");
	var username=getCookie(connection.headers.cookie,"username");
	var pswd=getCookie(connection.headers.cookie,"pswd");
	var sql = 'SELECT * FROM users WHERE id='+userid;
	db.query(sql,(err,result)=>{
		if(err){
			console.error(err);
			return;
		}else if(result.length==0||result[0].pswd!=pswd){
			console.log('pswd err');
			ws.close();
		}
	});
	db.end();
	connection.on("text",(data)=>{
		data=JSON.parse(data);
		console.log(data);
		if(data.typ=='startgame'){
			if(!start){
				start=true;
				ws.connections.forEach((connection)=>{
					connection.send(JSON.stringify({'typ':'start'}));
				});
				setTimeout(()=>{
					console.log(players);
					canjoin=false;
					var res=gen.genMap(players.length);
					n=res.n;
					m=res.m;
					map=res.map;
					players.forEach((x)=>{users[users.length]=x.name});
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
																	var dead=map[xx][yy][1];
																	players[dead].alive=false;
																	for(var x=0;x<n;x++)for(var y=0;y<m;y++)if(map[x][y][1]==dead)
																		map[x][y][1]=i;
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
							his[turn]=[];
							for(var i=0;i<n;i++)for(var j=0;j<m;j++)if(map[i][j].toString()!=predMap[i][j].toString())
								his[turn][his[turn].length]=[i,j,JSON.parse(JSON.stringify(map[i][j]))];
							//console.log(his[turn]);
							for(var i=0;i<players.length;i++)if(players[i].alive&&turn-players[i].lstvis>=guanji)
								players[i].alive=false;
							var nowalive=0;
							for(var i=0;i<players.length;i++)
								rank[i]=[0,0],nowalive+=players[i].alive;
							for(var i=0;i<n;i++)for(var j=0;j<m;j++)if(map[i][j][0]>=0&&map[i][j][1]>=0){
								rank[map[i][j][1]][1]++;
								rank[map[i][j][1]][0]+=map[i][j][2];
							}
							if(nowalive<=1){
								var name=randstr(6);
								while(hasFile(__dirname+'/replay/'+name+'.json'))name=randstr(6);
								fs.writeFileSync(path.join(__dirname,'replay',name+'.json'),JSON.stringify({'users':users,'everyadd':everyadd,'his':his}));
								if(nowalive){
									for(var winner=0;winner<players.length;winner++)if(players[winner].alive)
										ws.connections.forEach((connection)=>{
											connection.send(JSON.stringify({'typ':'end','lstmap':map,'lstrank':rank,'winner':winner,'name':name}));
										});
								}else{
									ws.connections.forEach((connection)=>{
										connection.send(JSON.stringify({'typ':'end','lstmap':map,'lstrank':rank,'winner':-1,'name':name}));
									});
								}
								start=false;
								canjoin=true;
								players=[];
								map=[];
								his=[];
								turn=0;
								rank=[];
								users=[];
								lst=-1;
								clearInterval(timer);
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
				players[players.length]={"name":data.name,"uid":userid,'queue':new Deque(),'alive':true,'lstmap':[],'lstvis':0};
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
			for(var id=0;id<players.length;id++)if(players[id].uid==userid){
				players[id].alive=false;
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
