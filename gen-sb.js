const B=14;
function genMap(cnt){
	var C=Math.ceil(Math.sqrt(cnt));
	var n=C*B+1,m=C*B+1;
	var map=[];
	for(var i=0;i<n;i++){
		var line=[];
		for(var j=0;j<m;j++){
			var x=Math.random();
			if(x<0.1||(i%B==0)||(j%B)==0)line[j]=[-1,0,0];
			else if(x<0.13)line[j]=[3,-1,Math.floor(Math.random()*10)+40];
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
		for(var j=Math.max(0,pos[0]-3);j<Math.min(n,pos[0]+4);j++)
			for(var k=Math.max(0,pos[1]-3);k<Math.min(m,pos[1]+4);k++)
				if(map[j][k][0]==0)
					rest[rest.length]=[j,k];
		if(!rest.length)return genMap(cnt);
		pos=rest[Math.floor(Math.random()*rest.length)];
		map[pos[0]][pos[1]]=[3,-1,Math.floor(Math.random()*10)+40];
	}
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
exports.genMap=genMap;
