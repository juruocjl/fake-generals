var express = require('express')
var app = express();
const io = require('nodejs-websocket')
const uuid = require('node-uuid');
app.use('/pages',express.static('pages'))
app.get('/', function (req,res) {
   res.sendFile(__dirname+"/pages/"+"index.html" );
})
class Deque {
	constructor() {this.items = [];this.count = 0;this.lowestCount = 0;}
	addBack(element) {this.items[this.count] = element;this.count++;};
	to_array(){var a=[];for(var i=this.lowestCount;i<this.count;i++)a[i-this.lowestCount]=this.items[i];return a;}
	from_array(a){this.items=a;this.lowestCount=0;this.count=a.length;}
	popFront(){return this.items[this.lowestCount++];};
	popBack() {return this.items[--this.count];};
	size(){return this.count-this.lowestCount;}
};
var start=false;
var canjoin=true;
var players=[];
var map=[];
const n=10,m=10;
const k=25;
var turn=0;
var ws=io.createServer(connection=>{
	console.log('new connection...')
	connection.on("text",(data)=>{
		data=JSON.parse(data);
		console.log(data);
		if(data.typ=='startgame'){
			if(!start){
				start=true;
				ws.connections.forEach((connection)=>{
					try{
						connection.send(JSON.stringify({'typ':'start'}));
					}catch(err){
						console.log(err);
					}
				});
				setTimeout(()=>{
					canjoin=false;
					for(var i=0;i<n;i++){
						var line=[];
						for(var j=0;j<m;j++){
							var x=Math.random();
							if(x<0.05)line[j]=[-1,0,0];
							else if(x<0.1)line[j]=[1,-1,Math.floor(Math.random()*10)+40];
							else line[j]=[0,-1,0];
						}
						map[i]=line;
					}
					for(var i=0;i<players.length;i++){
						var rest=[];
						for(var x=0;x<n;x++)for(var y=0;y<m;y++)
							if(map[x][y][0]==0)
								rest[rest.length]=[x,y];
						home=rest[Math.floor(rest.length*Math.random())];
						map[home[0]][home[1]]=[2,i,0];
					}
					console.log(map);
					var firstmap=[];
					for(var i=0;i<n;i++){
						var line=[];
						for(var j=0;j<m;j++)
							line[j]=(map[i][j][0]==-1||map[i][j][0]==1)?1:0;
						firstmap[i]=line;
					}
					var users=[];
					players.forEach((x)=>{users[users.length]=x.name});
					ws.connections.forEach((connection)=>{
						try{
							connection.send(JSON.stringify({'typ':'first map','data':firstmap,'users':users}));
						}catch(err){
							console.log(err);
						}
					});
					var timer=setInterval(
						()=>{
							++turn;
							for(var i=0;i<n;i++)
								for(var j=0;j<m;j++)
									if(map[i][j][0]==1&&map[i][j][1]>=0)
										map[i][j][2]++;
									else if(map[i][j][0]==2)
										map[i][j][2]++;
							if(turn%k==0)
								for(var i=0;i<n;i++)
									for(var j=0;j<m;j++)
										if(map[i][j][0]==0&&map[i][j][1]>=0)
											map[i][j][2]++;
							const ddx=[-1,1,0,0];
							const ddy=[0,0,-1,1];
							for(var i=0;i<players.length;i++){
								while(players[i].queue.size()){
									var now=players[i].queue.popFront();
									var xx=now[0]+ddx[now[2]%4];
									var yy=now[1]+ddy[now[2]%4];
									if(map[now[0]][now[1]][1]==i)
										if(map[now[0]][now[1]][2]>1)
											if(0<=xx&&xx<n&&0<=yy&&yy<m)
												if(map[xx][yy][0]!=-1){
													var val;
													if(now[2]<4)val=map[now[0]][now[1]][2]-1;
													else val=Math.floor(map[now[0]][now[1]][2]/2);
													console.log(map[xx][yy],val);
													map[now[0]][now[1]][2]-=val;
													if(map[xx][yy][1]==i)map[xx][yy][2]+=val;
													else{
														if(val>map[xx][yy][2]){
															map[xx][yy][2]=val-map[xx][yy][2];
															map[xx][yy][1]=i;
														}
														else
															map[xx][yy][2]-=val;
													}
													break;
												}
								}
							}
							ws.connections.forEach((connection)=>{
								try{
									connection.send(JSON.stringify({'typ':'new turn','turn':turn}));
								}catch(err){
									console.log(err);
								}
							});
						},1000);
				},1000)
			}
		}
		if(data.typ=='get uid'){
			if(canjoin){
				var id=uuid.v1();
				players[players.length]={"name":data.name,"uid":id,'queue':new Deque()};
				connection.send(JSON.stringify({'typ':'uid','uid':id}));
			}
		}
		if(data.typ=='get map'){
			//console.log(players,data);
			for(var id=0;id<players.length;id++)if(players[id].uid==data.uid){
				var tmp=[];
				for(var i=0;i<n;i++){
					var line=[];
					for(var j=0;j<m;j++){
						var flag=false;
						for(var dx=-1;dx<=1;dx++)for(var dy=-1;dy<=1;dy++)
							if(0<=i+dx&&i+dx<n&&0<=j+dy&&j+dy<m&&map[i+dx][j+dy][0]>=0&&map[i+dx][j+dy][1]==id)
								flag=true;
						if(!flag)line[j]=[-2,0,0];
						else line[j]=map[i][j];
					}
					tmp[i]=line;
				}
				console.log(tmp);
				connection.send(JSON.stringify({'typ':'map','map':tmp,'queue':players[id].queue.to_array()}))
			}
		}
		if(data.typ=='add queue'){
			for(var id=0;id<players.length;id++)if(players[id].uid==data.uid){
				players[id].queue.addBack(data.data);
			}
		}
	})
	connection.on("close", function (code, reason) {
        console.log("Connection closed")
    })
	connection.on("error",() => {
		console.log('服务异常关闭...')
	})
	if(start)connection.send(JSON.stringify({'typ':'already start'}))
});
ws.listen(3000)
var server = app.listen(8081)
