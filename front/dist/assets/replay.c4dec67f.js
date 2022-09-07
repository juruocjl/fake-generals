import{$ as W,a1 as j,H as le,C as h,aa as J,p as g,e as w,ag as ee,h as Y,w as q,a5 as re,a6 as ue,i as t,l as v,n as N,t as U,a8 as ce,a9 as ie,ai as xe,Q as O,aC as Ee,K as de,bj as Me,aX as $e,b9 as Le,z as pe,bk as Ie,r as T,bg as ne,S as Oe,a3 as He,ac as De,f as R,k as F,aR as te,g as Pe,F as A,a$ as Ve,a7 as Q,bf as Re,aZ as Ae,Y as qe,aq as ae,bh as fe,R as me,as as Ue,bi as oe,an as Ye,bl as Ge,c as Qe,u as Xe,a as Ze,E as Je,b as Ke,j as We,aQ as Z,m as ve,o as je,q as es,_ as ss,s as ns}from"./style.c8d9b279.js";const ts=W({value:{type:[String,Number],default:""},max:{type:Number,default:99},isDot:Boolean,hidden:Boolean,type:{type:String,values:["primary","success","warning","info","danger"],default:"danger"}}),as=["textContent"],os={name:"ElBadge"},ls=j({...os,props:ts,setup(l,{expose:u}){const a=l,c=le("badge"),r=h(()=>a.isDot?"":J(a.value)&&J(a.max)?a.max<a.value?`${a.max}+`:`${a.value}`:`${a.value}`);return u({content:r}),(y,m)=>(g(),w("div",{class:N(t(c).b())},[ee(y.$slots,"default"),Y(ce,{name:`${t(c).namespace.value}-zoom-in-center`,persisted:""},{default:q(()=>[re(v("sup",{class:N([t(c).e("content"),t(c).em("content",y.type),t(c).is("fixed",!!y.$slots.default),t(c).is("dot",y.isDot)]),textContent:U(t(r))},null,10,as),[[ue,!y.hidden&&(t(r)||y.isDot)]])]),_:1},8,["name"])],2))}});var rs=ie(ls,[["__file","/home/runner/work/element-plus/element-plus/packages/components/badge/src/badge.vue"]]);const us=xe(rs),K={},cs=W({a11y:{type:Boolean,default:!0},locale:{type:O(Object)},size:Ee,button:{type:O(Object)},experimentalFeatures:{type:O(Object)},keyboardNavigation:{type:Boolean,default:!0},message:{type:O(Object)},zIndex:Number,namespace:{type:String,default:"el"}});j({name:"ElConfigProvider",props:cs,setup(l,{slots:u}){de(()=>l.message,c=>{Object.assign(K,c!=null?c:{})},{immediate:!0,deep:!0});const a=Me(l);return()=>ee(u,"default",{config:a==null?void 0:a.value})}});const ge=["success","info","warning","error"],C=Le({customClass:"",center:!1,dangerouslyUseHTMLString:!1,duration:3e3,icon:"",id:"",message:"",onClose:void 0,showClose:!1,type:"info",offset:16,zIndex:0,grouping:!1,repeatNum:1,appendTo:pe?document.body:void 0}),is=W({customClass:{type:String,default:C.customClass},center:{type:Boolean,default:C.center},dangerouslyUseHTMLString:{type:Boolean,default:C.dangerouslyUseHTMLString},duration:{type:Number,default:C.duration},icon:{type:$e,default:C.icon},id:{type:String,default:C.id},message:{type:O([String,Object,Function]),default:C.message},onClose:{type:O(Function),required:!1},showClose:{type:Boolean,default:C.showClose},type:{type:String,values:ge,default:C.type},offset:{type:Number,default:C.offset},zIndex:{type:Number,default:C.zIndex},grouping:{type:Boolean,default:C.grouping},repeatNum:{type:Number,default:C.repeatNum}}),ds={destroy:()=>!0},z=Ie([]),ps=l=>{const u=z.findIndex(r=>r.id===l),a=z[u];let c;return u>0&&(c=z[u-1]),{current:a,prev:c}},fs=l=>{const{prev:u}=ps(l);return u?u.vm.exposeProxy.bottom:0},ms=["id"],vs=["innerHTML"],gs={name:"ElMessage"},ys=j({...gs,props:is,emits:ds,setup(l,{expose:u}){const a=l,{Close:c}=Re,r=le("message"),y=T(),m=T(!1),k=T(0);let _;const S=h(()=>a.type?a.type==="error"?"danger":a.type:"info"),B=h(()=>{const p=a.type;return{[r.bm("icon",p)]:p&&ne[p]}}),x=h(()=>a.icon||ne[a.type]||""),X=h(()=>fs(a.id)),G=h(()=>a.offset+X.value),M=h(()=>k.value+G.value),D=h(()=>({top:`${G.value}px`,zIndex:a.zIndex}));function $(){a.duration!==0&&({stop:_}=Ae(()=>{E()},a.duration))}function I(){_==null||_()}function E(){m.value=!1}function P({code:p}){p===qe.esc&&E()}return Oe(()=>{$(),m.value=!0}),de(()=>a.repeatNum,()=>{I(),$()}),He(document,"keydown",P),De(y,()=>{k.value=y.value.getBoundingClientRect().height}),u({visible:m,bottom:M,close:E}),(p,b)=>(g(),R(ce,{name:t(r).b("fade"),onBeforeLeave:p.onClose,onAfterLeave:b[0]||(b[0]=se=>p.$emit("destroy")),persisted:""},{default:q(()=>[re(v("div",{id:p.id,ref_key:"messageRef",ref:y,class:N([t(r).b(),{[t(r).m(p.type)]:p.type&&!p.icon},t(r).is("center",p.center),t(r).is("closable",p.showClose),p.customClass]),style:Q(t(D)),role:"alert",onMouseenter:I,onMouseleave:$},[p.repeatNum>1?(g(),R(t(us),{key:0,value:p.repeatNum,type:t(S),class:N(t(r).e("badge"))},null,8,["value","type","class"])):F("v-if",!0),t(x)?(g(),R(t(te),{key:1,class:N([t(r).e("icon"),t(B)])},{default:q(()=>[(g(),R(Pe(t(x))))]),_:1},8,["class"])):F("v-if",!0),ee(p.$slots,"default",{},()=>[p.dangerouslyUseHTMLString?(g(),w(A,{key:1},[F(" Caution here, message could've been compromised, never use user's input as message "),v("p",{class:N(t(r).e("content")),innerHTML:p.message},null,10,vs)],2112)):(g(),w("p",{key:0,class:N(t(r).e("content"))},U(p.message),3))]),p.showClose?(g(),R(t(te),{key:2,class:N(t(r).e("closeBtn")),onClick:Ve(E,["stop"])},{default:q(()=>[Y(t(c))]),_:1},8,["class","onClick"])):F("v-if",!0)],46,ms),[[ue,m.value]])]),_:3},8,["name","onBeforeLeave"]))}});var hs=ie(ys,[["__file","/home/runner/work/element-plus/element-plus/packages/components/message/src/message.vue"]]);let bs=1;const ye=l=>{const u=!l||ae(l)||fe(l)||me(l)?{message:l}:l,a={...C,...u};if(!a.appendTo)a.appendTo=document.body;else if(ae(a.appendTo)){let c=document.querySelector(a.appendTo);Ye(c)||(c=document.body),a.appendTo=c}return a},ws=l=>{const u=z.indexOf(l);if(u===-1)return;z.splice(u,1);const{handler:a}=l;a.close()},_s=({appendTo:l,...u},a)=>{const{nextZIndex:c}=Ue(),r=`message_${bs++}`,y=u.onClose,m=document.createElement("div"),k={...u,zIndex:c()+u.zIndex,id:r,onClose:()=>{y==null||y(),ws(x)},onDestroy:()=>{oe(null,m)}},_=Y(hs,k,me(k.message)||fe(k.message)?{default:k.message}:null);_.appContext=a||H._context,oe(_,m),l.appendChild(m.firstElementChild);const S=_.component,x={id:r,vnode:_,vm:S,handler:{close:()=>{S.exposeProxy.visible=!1}},props:_.component.props};return x},H=(l={},u)=>{if(!pe)return{close:()=>{}};if(J(K.max)&&z.length>=K.max)return{close:()=>{}};const a=ye(l);if(a.grouping&&z.length){const r=z.find(({vnode:y})=>{var m;return((m=y.props)==null?void 0:m.message)===a.message});if(r)return r.props.repeatNum+=1,r.props.type=a.type,r.handler}const c=_s(a,u);return z.push(c),c.handler};ge.forEach(l=>{H[l]=(u={},a)=>{const c=ye(u);return H({...c,type:l},a)}});function Cs(l){for(const u of z)(!l||l===u.props.type)&&u.handler.close()}H.closeAll=Cs;H._context=null;const ks=Ge(H,"$message");const Ts={key:0,href:"https://github.com/juruocjl/fake-generals",target:"_blank",class:"ribbons"},Ss=v("img",{loading:"lazy",width:"149",height:"149",src:ss,class:"attachment-full size-full",alt:"Fork me on GitHub","data-recalc-dims":"1"},null,-1),Ns=[Ss],zs={key:1,class:"index"},Bs={class:"contain"},Fs=ve("Start!"),xs={class:"turn"},Es=ve("turn "),Ms={id:"turn"},$s={class:"rank"},Ls={id:"rank"},Is=v("tr",null,[v("th",null,"rank"),v("th",null,"name"),v("th",null,"army"),v("th",null,"land")],-1),Os=["innerHTML"],Hs=["innerHTML"],Ds=["innerHTML"],Ps={key:0,class:"lightning"},Vs={key:1,class:"wind"},Rs={__name:"Replay",setup(l){const a=Qe(()=>je("fg-user-config",{bgimg:"",color:["#FF0000","#0000FF","#008000","#800080","#A52A2A","#FFA500","#FFC0CB","#FFFF00"]}))(),c=Xe();Ze(c);let r=T(!1);function y(s,e){return e=parseInt(e),e<1200?'<span class="newbiw">'+s+"</span>":e<1400?'<span class="pupil">'+s+"</span>":e<1600?'<span class="specialist">'+s+"</span>":e<1900?'<span class="expert">'+s+"</span>":e<2100?'<span class="candidate-master">'+s+"</span>":e<2400?'<span class="master">'+s+"</span>":e<3e3?'<span class="grandmaster">'+s+"</span>":'<span class="legendary-grandmaster">'+s+"</span>"}let m=T([]),k=T(0),_=T(0),S=T(30),B=T("");function x(s){for(var e=window.location.search.substring(1),f=e.split("&"),d=0;d<f.length;d++){var n=f[d].split("=");if(n[0]==s)return n[1]}return!1}x("name")&&(B.value=x("name"));function X(s,e,f){if(s=JSON.parse(JSON.stringify(s)),!f)return s;for(var d=0;d<k.value;d++)for(var n=0;n<_.value;n++)s[d][n][0]>=0&&s[d][n][1]>=0&&(s[d][n][0]==0?s[d][n][2]+=e:s[d][n][0]!=4?s[d][n][2]++:(s[d][n][2]--,s[d][n][2]==0&&(s[d][n][1]=-1)));return s}function G(s,e){return i.value[s][e][0]==-2||i.value[s][e][0]==-3?"#565656":i.value[s][e][0]==-1||i.value[s][e][0]==5?"#a3a3a3":i.value[s][e][0]==0?i.value[s][e][1]>=0?a.value.color[i.value[s][e][1]]:i.value[s][e][2]!=0?"#aaa":"#d7d7d7":i.value[s][e][1]>=0?a.value.color[i.value[s][e][1]]:"#757575"}var M=[],D=[-1],$=[-1],I=[-1],E=[-1],P=[-1];let p=T(0),b=T(0),se=h(()=>D[b.value]),he=h(()=>$[b.value]),be=h(()=>I[b.value]),we=h(()=>E[b.value]);h(()=>P[b.value]);let i=h(()=>M[b.value]),V=h(()=>{for(var s=[],e=0;e<m.value.length;e++)s[e]=[0,0];for(var e=0;e<k.value;e++)for(var f=0;f<_.value;f++)i.value[e][f][0]>=0&&i.value[e][f][1]>=0&&(s[i.value[e][f][1]][1]++,s[i.value[e][f][1]][0]+=i.value[e][f][2]);return s}),_e=h(()=>{for(var s=[],e=0;e<V.value.length;e++)m.value[e].vip==0?s[e]={name:y(m.value[e].name,m.value[e].rating),color:a.value.color[e],army:V.value[e][0],land:V.value[e][1]}:s[e]={name:y(m.value[e].name,m.value[e].rating)+'<i class="vip'+m.value[e].vip+'"></i>',color:a.value.color[e],army:V.value[e][0],land:V.value[e][1]};return s.sort((f,d)=>f.army!=d.army?d.army-f.army:f.land!=d.land?d.land-f.land:f.color<d.color?1:-1),s});document.onkeydown=function(s){var e=s||window.event||arguments.callee.caller.arguments[0];e&&e.keyCode==32&&(nowx.value=nowy.value=-1,show())};function Ce(s){var e=document.getElementById("map"),f=s.clientX,d=s.clientY,n=e.offsetLeft,o=e.offsetTop;window.onmousemove=function(L){var Ne=L.clientX,ze=L.clientY,Be=n+(Ne-f),Fe=o+(ze-d);e.style.left=Be+"px",e.style.top=Fe+"px"}}function ke(){window.onmousemove=null}function Te(s){s.deltaY<0?S.value=Math.min(50,S.value+3):s.deltaY>0&&(S.value=Math.max(25,S.value-3))}document.body.onselectstart=document.body.oncontextmenu=function(){return!1};function Se(){es.get("getfile?name="+B.value).then(s=>{if(s.data=="Not Found")ks.error("Not Found.");else{r.value=!0;var e=s.data;k.value=e.his[0].length,_.value=e.his[0][0].length,m.value=e.users;var f=e.his.length;M[0]=e.his[0];for(var d=e.everyadd,n=1;n<e.his.length;n++)D[n]=$[n]=I[n]=E[n]=P[n]=-1,M[n]=X(M[n-1],(n+1)%d==0,e.ver>=2?n%2==1:!0),e.his[n].forEach(o=>{o[0]=="lt"||o[0]=="lightning"?(D[n]=o[1],$[n]=o[2]):o[0]=="wd"?(I[n]=o[1],E[n]=o[2],P[n]=o[3]):M[n][o[0]][o[1]]=o[2]});p.value=e.ver,document.onkeydown=function(o){var L=o||window.event||arguments.callee.caller.arguments[0];L&&L.keyCode==65&&(b.value=Math.max(0,b.value-1)),L&&L.keyCode==68&&(b.value=Math.min(f-1,b.value+1))}}}).catch(s=>{console.log(s)})}return(s,e)=>{const f=Je,d=Ke;return g(),w(A,null,[t(r)?F("",!0):(g(),w("a",Ts,Ns)),t(r)?F("",!0):(g(),w("div",zs,[v("div",Bs,[Y(f,{modelValue:t(B),"onUpdate:modelValue":e[0]||(e[0]=n=>We(B)?B.value=n:B=n),class:"w-50 m-2",placeholder:"\u56DE\u653Eid"},null,8,["modelValue"]),Y(d,{style:{margin:"10px"},type:"success",plain:"",onClick:e[1]||(e[1]=n=>{Se()})},{default:q(()=>[Fs]),_:1})])])),v("div",xs,[Es,v("span",Ms,U(t(p)>=2?Math.ceil(t(b)/2):t(b)),1)]),v("div",$s,[v("table",null,[v("tbody",Ls,[Is,(g(!0),w(A,null,Z(t(_e),(n,o)=>(g(),w("tr",null,[v("td",{style:Q({color:"white",background:n.color,"font-weight":800})},U(o+1),5),v("td",{innerHTML:n.name},null,8,Os),v("td",{innerHTML:n.army},null,8,Hs),v("td",{innerHTML:n.land},null,8,Ds)]))),256))])])]),t(r)?(g(),w("table",{key:2,cellspacing:"0",cellpadding:"0",border:"0",style:Q({"--size":t(S)+"px","font-size":Math.min(10,Math.floor((s.now+32)/7))+"px"})},[v("tbody",{class:"map",id:"map",onMousedown:Ce,onMouseup:ke,onMousewheel:Te},[(g(!0),w(A,null,Z(t(k),n=>(g(),w("tr",null,[(g(!0),w(A,null,Z(t(_),o=>(g(),w("td",{style:Q({background:G(n-1,o-1)}),class:N({cell:!0,nowpos:s.nowx==n-1&&s.nowy==o-1})},[v("span",{class:N({num:!0,unknow:t(i)[n-1][o-1][0]==-3,visible:t(i)[n-1][o-1][0]!=-2&&t(i)[n-1][o-1][0]!=-3,mountain:t(i)[n-1][o-1][0]==-1,toxins:t(i)[n-1][o-1][0]==5,empty:t(i)[n-1][o-1][0]==0,town:t(i)[n-1][o-1][0]==1,crown:t(i)[n-1][o-1][0]==2,umbrella:t(i)[n-1][o-1][0]==3,water:t(i)[n-1][o-1][0]==4})},U(s.nowx==n-1&&s.nowy==o-1&&s.op==1?"50%":t(i)[n-1][o-1][2]?t(i)[n-1][o-1][2]:""),3),t(se)==n-1&&t(he)==o-1?(g(),w("span",Ps)):F("",!0),t(be)==n-1||t(we)==o-1?(g(),w("span",Vs)):F("",!0)],6))),256))]))),256))],32)],4)):F("",!0)],64)}}},As=ns(Rs);As.mount("#app");
