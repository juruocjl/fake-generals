const n=42,m=42;
function checkMap(map){
	var players=[],vis=[];
	for(var i=0;i<n;i++)for(var j=0;j<m;j++)
		if(map[i][j][0]==2)players[players.length]=[i,j];
	for(var i=0;i<players.length;i++)
		for(var j=i+1;j<players.length;j++)
			if(Math.abs(players[i][0]-players[j][0])+Math.abs(players[i][1]-players[j][1])<10)
				return false;
	for(var i=0;i<n;i++){
		vis[i]=[];
		for(var j=0;j<m;j++)
			vis[i][j]=false;
	}
	function dfs(x,y){
		if(map[x][y][0]==-1)return;
		if(vis[x][y])return;
		vis[x][y]=1;
		if(x-1>=0)dfs(x-1,y);
		if(x+1<n)dfs(x+1,y);
		if(y-1>=0)dfs(x,y-1);
		if(y+1<m)dfs(x,y+1);
	};
	dfs(players[0][0],players[0][0]);
	for(var i=0;i<players.length;i++)
		if(!vis[players[i][0]][players[i][1]])
			return false;
	for(var i=0;i<n;i++)for(var j=0;j<m;j++)
		if(map[i][j][0]==3&&!vis[i][j])
			return false;
	return true;
}
function genMap(cnt){
	var map=[];
	for(var i=0;i<n;i++){
		var line=[];
		for(var j=0;j<m;j++){
			var x=Math.random();
			if(x<0.18)line[j]=[-1,0,0];
			else if(x<0.20)line[j]=[1,-1,Math.floor(Math.random()*10)+40];
			else line[j]=[0,-1,0];
		}
		map[i]=line;
	}
	var rangelist=[];
	for(var i=0;i<3;i++)for(var j=0;j<3;j++)if(i!=1||j!=1)
		rangelist[rangelist.length]=[i*14,i*14+14,j*14,j*14+14];
	rangelist.sort(()=>{return Math.random()-0.5});
	for(var i=0;i<cnt;i++){
		var arr=[],pos,rest=[];
		for(var j=rangelist[i%8][0];j<rangelist[i%8][1];j++)
			for(var k=rangelist[i%8][2];k<rangelist[i%8][3];k++)
				if(map[j][k][0]==0)
					arr[arr.length]=[j,k];
		pos=arr[Math.floor(Math.random()*arr.length)];
		map[pos[0]][pos[1]]=[2,i,0];
		for(var j=Math.max(0,pos[0]-3);j<Math.min(n,pos[0]+4);j++)
			for(var k=Math.max(0,pos[1]-3);k<Math.min(m,pos[1]+4);k++)
				if(map[j][k][0]==0)
					rest[rest.length]=[j,k];
		pos=rest[Math.floor(Math.random()*rest.length)];
		map[pos[0]][pos[1]]=[1,-1,Math.floor(Math.random()*10)+40];
		pos=rest[Math.floor(Math.random()*rest.length)];
		map[pos[0]][pos[1]]=[1,-1,Math.floor(Math.random()*10)+40];
	}
	for(var i=0;i<3;i++)for(var j=0;j<3;j++){
		var rest=[],pos;
		for(var x=i*14;x<i*14+14;x++)for(var y=j*14;y<j*14+14;y++)
			if(map[x][y][0]==0)rest[rest.length]=[x,y];
		pos=rest[Math.floor(Math.random()*rest.length)];
		map[pos[0]][pos[1]]=[3,-1,100];
	}
	if(checkMap(map)){
		for(var i=0;i<n;i++){
			var str="";
			for(var j=0;j<m;j++)
				if(map[i][j][0]==0)str+=' ';
				else if(map[i][j][0]==-1)str+='m';
				else if(map[i][j][0]==1)str+='t';
				else if(map[i][j][0]==2)str+=map[i][j][1];
				else if(map[i][j][0]==3)str+='s';
			console.log(str);
		}
		return {n:n,m:m,map:map};
	}
	console.log('err');
	return genMap(cnt);
}
exports.genMap=genMap;
