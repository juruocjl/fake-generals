const B=6;
function checkMap(map){
	var n=map.length;
	var m=map[0].length;
	var players=[],vis=[];
	for(var i=0;i<n;i++)for(var j=0;j<m;j++)
		if(map[i][j][0]==2)players[players.length]=[i,j];
	for(var i=0;i<players.length;i++)
		for(var j=i+1;j<players.length;j++)
			if(Math.abs(players[i][0]-players[j][0])+Math.abs(players[i][1]-players[j][1])<B)
				return false;
	return true;
}
function genMap(cnt){
	var C=Math.ceil(Math.sqrt(cnt));
	var n=C*B,m=C*B;
	var map=[];
	for(var i=0;i<n;i++){
		var line=[];
		for(var j=0;j<m;j++){
			var x=Math.random();
			if(x<0.1)line[j]=[1,-1,Math.floor(Math.random()*10)+40];
			else line[j]=[0,-1,0];
		}
		map[i]=line;
	}
	var rangelist=[];
	for(var i=0;i<C;i++)for(var j=0;j<C;j++)
		rangelist[rangelist.length]=[i*B,i*B+B,j*B,j*B+B];
	rangelist.sort(()=>{return Math.random()-0.5});
	for(var i=0;i<cnt;i++){
		var arr=[],pos,rest=[];
		for(var j=rangelist[i][0];j<rangelist[i][1];j++)
			for(var k=rangelist[i][2];k<rangelist[i][3];k++)
				if(map[j][k][0]==0)
					arr[arr.length]=[j,k];
		if(!arr.length)return genMap(cnt);
		pos=arr[Math.floor(Math.random()*arr.length)];
		map[pos[0]][pos[1]]=[2,i,0];
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
