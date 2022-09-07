import{$ as K,a1 as W,H as ae,C,aa as Z,p as g,e as _,ag as j,h as q,w as R,a5 as oe,a6 as le,i as t,l as v,n as N,t as A,a8 as re,a9 as ue,ai as Se,Q as O,aC as Ne,K as ce,bj as xe,aX as ze,b9 as Be,z as ie,bk as Fe,r as T,bg as ee,S as Ee,a3 as Me,ac as $e,f as P,k as E,aR as ne,g as Le,F as V,a$ as Ie,a7 as Y,bf as Oe,aZ as He,Y as De,aq as se,bh as de,R as pe,as as Pe,bi as te,an as Ve,bl as Re,c as Ae,u as qe,a as Ue,E as Ye,b as Ge,j as Qe,aQ as X,m as fe,o as Xe,q as Ze,_ as Je,s as Ke}from"./style.c8d9b279.js";const We=K({value:{type:[String,Number],default:""},max:{type:Number,default:99},isDot:Boolean,hidden:Boolean,type:{type:String,values:["primary","success","warning","info","danger"],default:"danger"}}),je=["textContent"],en={name:"ElBadge"},nn=W({...en,props:We,setup(o,{expose:c}){const a=o,i=ae("badge"),l=C(()=>a.isDot?"":Z(a.value)&&Z(a.max)?a.max<a.value?`${a.max}+`:`${a.value}`:`${a.value}`);return c({content:l}),(y,m)=>(g(),_("div",{class:N(t(i).b())},[j(y.$slots,"default"),q(re,{name:`${t(i).namespace.value}-zoom-in-center`,persisted:""},{default:R(()=>[oe(v("sup",{class:N([t(i).e("content"),t(i).em("content",y.type),t(i).is("fixed",!!y.$slots.default),t(i).is("dot",y.isDot)]),textContent:A(t(l))},null,10,je),[[le,!y.hidden&&(t(l)||y.isDot)]])]),_:1},8,["name"])],2))}});var sn=ue(nn,[["__file","/home/runner/work/element-plus/element-plus/packages/components/badge/src/badge.vue"]]);const tn=Se(sn),J={},an=K({a11y:{type:Boolean,default:!0},locale:{type:O(Object)},size:Ne,button:{type:O(Object)},experimentalFeatures:{type:O(Object)},keyboardNavigation:{type:Boolean,default:!0},message:{type:O(Object)},zIndex:Number,namespace:{type:String,default:"el"}});W({name:"ElConfigProvider",props:an,setup(o,{slots:c}){ce(()=>o.message,i=>{Object.assign(J,i!=null?i:{})},{immediate:!0,deep:!0});const a=xe(o);return()=>j(c,"default",{config:a==null?void 0:a.value})}});const me=["success","info","warning","error"],w=Be({customClass:"",center:!1,dangerouslyUseHTMLString:!1,duration:3e3,icon:"",id:"",message:"",onClose:void 0,showClose:!1,type:"info",offset:16,zIndex:0,grouping:!1,repeatNum:1,appendTo:ie?document.body:void 0}),on=K({customClass:{type:String,default:w.customClass},center:{type:Boolean,default:w.center},dangerouslyUseHTMLString:{type:Boolean,default:w.dangerouslyUseHTMLString},duration:{type:Number,default:w.duration},icon:{type:ze,default:w.icon},id:{type:String,default:w.id},message:{type:O([String,Object,Function]),default:w.message},onClose:{type:O(Function),required:!1},showClose:{type:Boolean,default:w.showClose},type:{type:String,values:me,default:w.type},offset:{type:Number,default:w.offset},zIndex:{type:Number,default:w.zIndex},grouping:{type:Boolean,default:w.grouping},repeatNum:{type:Number,default:w.repeatNum}}),ln={destroy:()=>!0},x=Fe([]),rn=o=>{const c=x.findIndex(l=>l.id===o),a=x[c];let i;return c>0&&(i=x[c-1]),{current:a,prev:i}},un=o=>{const{prev:c}=rn(o);return c?c.vm.exposeProxy.bottom:0},cn=["id"],dn=["innerHTML"],pn={name:"ElMessage"},fn=W({...pn,props:on,emits:ln,setup(o,{expose:c}){const a=o,{Close:i}=Oe,l=ae("message"),y=T(),m=T(!1),k=T(0);let h;const S=C(()=>a.type?a.type==="error"?"danger":a.type:"info"),z=C(()=>{const p=a.type;return{[l.bm("icon",p)]:p&&ee[p]}}),B=C(()=>a.icon||ee[a.type]||""),G=C(()=>un(a.id)),U=C(()=>a.offset+G.value),M=C(()=>k.value+U.value),L=C(()=>({top:`${U.value}px`,zIndex:a.zIndex}));function F(){a.duration!==0&&({stop:h}=He(()=>{b()},a.duration))}function D(){h==null||h()}function b(){m.value=!1}function Q({code:p}){p===De.esc&&b()}return Ee(()=>{F(),m.value=!0}),ce(()=>a.repeatNum,()=>{D(),F()}),Me(document,"keydown",Q),$e(y,()=>{k.value=y.value.getBoundingClientRect().height}),c({visible:m,bottom:M,close:b}),(p,r)=>(g(),P(re,{name:t(l).b("fade"),onBeforeLeave:p.onClose,onAfterLeave:r[0]||(r[0]=I=>p.$emit("destroy")),persisted:""},{default:R(()=>[oe(v("div",{id:p.id,ref_key:"messageRef",ref:y,class:N([t(l).b(),{[t(l).m(p.type)]:p.type&&!p.icon},t(l).is("center",p.center),t(l).is("closable",p.showClose),p.customClass]),style:Y(t(L)),role:"alert",onMouseenter:D,onMouseleave:F},[p.repeatNum>1?(g(),P(t(tn),{key:0,value:p.repeatNum,type:t(S),class:N(t(l).e("badge"))},null,8,["value","type","class"])):E("v-if",!0),t(B)?(g(),P(t(ne),{key:1,class:N([t(l).e("icon"),t(z)])},{default:R(()=>[(g(),P(Le(t(B))))]),_:1},8,["class"])):E("v-if",!0),j(p.$slots,"default",{},()=>[p.dangerouslyUseHTMLString?(g(),_(V,{key:1},[E(" Caution here, message could've been compromised, never use user's input as message "),v("p",{class:N(t(l).e("content")),innerHTML:p.message},null,10,dn)],2112)):(g(),_("p",{key:0,class:N(t(l).e("content"))},A(p.message),3))]),p.showClose?(g(),P(t(ne),{key:2,class:N(t(l).e("closeBtn")),onClick:Ie(b,["stop"])},{default:R(()=>[q(t(i))]),_:1},8,["class","onClick"])):E("v-if",!0)],46,cn),[[le,m.value]])]),_:3},8,["name","onBeforeLeave"]))}});var mn=ue(fn,[["__file","/home/runner/work/element-plus/element-plus/packages/components/message/src/message.vue"]]);let vn=1;const ve=o=>{const c=!o||se(o)||de(o)||pe(o)?{message:o}:o,a={...w,...c};if(!a.appendTo)a.appendTo=document.body;else if(se(a.appendTo)){let i=document.querySelector(a.appendTo);Ve(i)||(i=document.body),a.appendTo=i}return a},gn=o=>{const c=x.indexOf(o);if(c===-1)return;x.splice(c,1);const{handler:a}=o;a.close()},yn=({appendTo:o,...c},a)=>{const{nextZIndex:i}=Pe(),l=`message_${vn++}`,y=c.onClose,m=document.createElement("div"),k={...c,zIndex:i()+c.zIndex,id:l,onClose:()=>{y==null||y(),gn(B)},onDestroy:()=>{te(null,m)}},h=q(mn,k,pe(k.message)||de(k.message)?{default:k.message}:null);h.appContext=a||H._context,te(h,m),o.appendChild(m.firstElementChild);const S=h.component,B={id:l,vnode:h,vm:S,handler:{close:()=>{S.exposeProxy.visible=!1}},props:h.component.props};return B},H=(o={},c)=>{if(!ie)return{close:()=>{}};if(Z(J.max)&&x.length>=J.max)return{close:()=>{}};const a=ve(o);if(a.grouping&&x.length){const l=x.find(({vnode:y})=>{var m;return((m=y.props)==null?void 0:m.message)===a.message});if(l)return l.props.repeatNum+=1,l.props.type=a.type,l.handler}const i=yn(a,c);return x.push(i),i.handler};me.forEach(o=>{H[o]=(c={},a)=>{const i=ve(c);return H({...i,type:o},a)}});function hn(o){for(const c of x)(!o||o===c.props.type)&&c.handler.close()}H.closeAll=hn;H._context=null;const bn=Re(H,"$message");const wn={key:0,href:"https://github.com/juruocjl/fake-generals",target:"_blank",class:"ribbons"},_n=v("img",{loading:"lazy",width:"149",height:"149",src:Je,class:"attachment-full size-full",alt:"Fork me on GitHub","data-recalc-dims":"1"},null,-1),Cn=[_n],kn={key:1,class:"index"},Tn={class:"contain"},Sn=fe("Start!"),Nn={class:"turn"},xn=fe("turn "),zn={id:"turn"},Bn={class:"rank"},Fn={id:"rank"},En=v("tr",null,[v("th",null,"rank"),v("th",null,"name"),v("th",null,"army"),v("th",null,"land")],-1),Mn=["innerHTML"],$n=["innerHTML"],Ln=["innerHTML"],In={key:0,class:"lightning"},On={__name:"Replay",setup(o){const a=Ae(()=>Xe("fg-user-config",{bgimg:"",color:["#FF0000","#0000FF","#008000","#800080","#A52A2A","#FFA500","#FFC0CB","#FFFF00"]}))(),i=qe();Ue(i);let l=T(!1);function y(n,e){return e=parseInt(e),e<1200?'<span class="newbiw">'+n+"</span>":e<1400?'<span class="pupil">'+n+"</span>":e<1600?'<span class="specialist">'+n+"</span>":e<1900?'<span class="expert">'+n+"</span>":e<2100?'<span class="candidate-master">'+n+"</span>":e<2400?'<span class="master">'+n+"</span>":e<3e3?'<span class="grandmaster">'+n+"</span>":'<span class="legendary-grandmaster">'+n+"</span>"}let m=T([]),k=T(0),h=T(0),S=T(30),z=T("");function B(n){for(var e=window.location.search.substring(1),f=e.split("&"),d=0;d<f.length;d++){var s=f[d].split("=");if(s[0]==n)return s[1]}return!1}B("name")&&(z.value=B("name"));function G(n,e,f){if(n=JSON.parse(JSON.stringify(n)),!f)return n;for(var d=0;d<k.value;d++)for(var s=0;s<h.value;s++)n[d][s][0]>=0&&n[d][s][1]>=0&&(n[d][s][0]==0?n[d][s][2]+=e:n[d][s][0]!=4?n[d][s][2]++:(n[d][s][2]--,n[d][s][2]==0&&(n[d][s][1]=-1)));return n}function U(n,e){return r.value[n][e][0]==-2||r.value[n][e][0]==-3?"#565656":r.value[n][e][0]==-1||r.value[n][e][0]==5?"#a3a3a3":r.value[n][e][0]==0?r.value[n][e][1]>=0?a.value.color[r.value[n][e][1]]:r.value[n][e][2]!=0?"#aaa":"#d7d7d7":r.value[n][e][1]>=0?a.value.color[r.value[n][e][1]]:"#757575"}var M=[],L=[],F=[];let D=T(0),b=T(0),Q=C(()=>L[b.value]),p=C(()=>F[b.value]),r=C(()=>M[b.value]),I=C(()=>{for(var n=[],e=0;e<m.value.length;e++)n[e]=[0,0];for(var e=0;e<k.value;e++)for(var f=0;f<h.value;f++)r.value[e][f][0]>=0&&r.value[e][f][1]>=0&&(n[r.value[e][f][1]][1]++,n[r.value[e][f][1]][0]+=r.value[e][f][2]);return n}),ge=C(()=>{for(var n=[],e=0;e<I.value.length;e++)m.value[e].vip==0?n[e]={name:y(m.value[e].name,m.value[e].rating),color:a.value.color[e],army:I.value[e][0],land:I.value[e][1]}:n[e]={name:y(m.value[e].name,m.value[e].rating)+'<i class="vip'+m.value[e].vip+'"></i>',color:a.value.color[e],army:I.value[e][0],land:I.value[e][1]};return n.sort((f,d)=>f.army!=d.army?d.army-f.army:f.land!=d.land?d.land-f.land:f.color<d.color?1:-1),n});document.onkeydown=function(n){var e=n||window.event||arguments.callee.caller.arguments[0];e&&e.keyCode==32&&(nowx.value=nowy.value=-1,show())};function ye(n){var e=document.getElementById("map"),f=n.clientX,d=n.clientY,s=e.offsetLeft,u=e.offsetTop;window.onmousemove=function($){var _e=$.clientX,Ce=$.clientY,ke=s+(_e-f),Te=u+(Ce-d);e.style.left=ke+"px",e.style.top=Te+"px"}}function he(){window.onmousemove=null}function be(n){n.deltaY<0?S.value=Math.min(50,S.value+3):n.deltaY>0&&(S.value=Math.max(25,S.value-3))}document.body.onselectstart=document.body.oncontextmenu=function(){return!1};function we(){Ze.get("getfile?name="+z.value).then(n=>{if(n.data=="Not Found")bn.error("Not Found.");else{l.value=!0;var e=n.data;k.value=e.his[0].length,h.value=e.his[0][0].length,m.value=e.users;var f=e.his.length;M[0]=e.his[0],L[0]=F[0]=-1;for(var d=e.everyadd,s=1;s<e.his.length;s++)L[s]=F[s]=-1,M[s]=G(M[s-1],(s+1)%d==0,e.ver>=2?s%2==1:!0),e.his[s].forEach(u=>{u[0]=="lt"||u[0]=="lightning"?(L[s]=u[1],F[s]=u[2]):M[s][u[0]][u[1]]=u[2]});D.value=e.ver,document.onkeydown=function(u){var $=u||window.event||arguments.callee.caller.arguments[0];$&&$.keyCode==65&&(b.value=Math.max(0,b.value-1)),$&&$.keyCode==68&&(b.value=Math.min(f-1,b.value+1))}}}).catch(n=>{console.log(n)})}return(n,e)=>{const f=Ye,d=Ge;return g(),_(V,null,[t(l)?E("",!0):(g(),_("a",wn,Cn)),t(l)?E("",!0):(g(),_("div",kn,[v("div",Tn,[q(f,{modelValue:t(z),"onUpdate:modelValue":e[0]||(e[0]=s=>Qe(z)?z.value=s:z=s),class:"w-50 m-2",placeholder:"\u56DE\u653Eid"},null,8,["modelValue"]),q(d,{style:{margin:"10px"},type:"success",plain:"",onClick:e[1]||(e[1]=s=>{we()})},{default:R(()=>[Sn]),_:1})])])),v("div",Nn,[xn,v("span",zn,A(t(D)>=2?Math.ceil(t(b)/2):t(b)),1)]),v("div",Bn,[v("table",null,[v("tbody",Fn,[En,(g(!0),_(V,null,X(t(ge),(s,u)=>(g(),_("tr",null,[v("td",{style:Y({color:"white",background:s.color,"font-weight":800})},A(u+1),5),v("td",{innerHTML:s.name},null,8,Mn),v("td",{innerHTML:s.army},null,8,$n),v("td",{innerHTML:s.land},null,8,Ln)]))),256))])])]),t(l)?(g(),_("table",{key:2,cellspacing:"0",cellpadding:"0",border:"0",style:Y({"--size":t(S)+"px","font-size":Math.min(10,Math.floor((n.now+32)/7))+"px"})},[v("tbody",{class:"map",id:"map",onMousedown:ye,onMouseup:he,onMousewheel:be},[(g(!0),_(V,null,X(t(k),s=>(g(),_("tr",null,[(g(!0),_(V,null,X(t(h),u=>(g(),_("td",{style:Y({background:U(s-1,u-1)}),class:N({cell:!0,nowpos:n.nowx==s-1&&n.nowy==u-1})},[v("span",{class:N({num:!0,unknow:t(r)[s-1][u-1][0]==-3,visible:t(r)[s-1][u-1][0]!=-2&&t(r)[s-1][u-1][0]!=-3,mountain:t(r)[s-1][u-1][0]==-1,toxins:t(r)[s-1][u-1][0]==5,empty:t(r)[s-1][u-1][0]==0,town:t(r)[s-1][u-1][0]==1,crown:t(r)[s-1][u-1][0]==2,umbrella:t(r)[s-1][u-1][0]==3,water:t(r)[s-1][u-1][0]==4})},A(n.nowx==s-1&&n.nowy==u-1&&n.op==1?"50%":t(r)[s-1][u-1][2]?t(r)[s-1][u-1][2]:""),3),t(Q)==s-1&&t(p)==u-1?(g(),_("span",In)):E("",!0)],6))),256))]))),256))],32)],4)):E("",!0)],64)}}},Hn=Ke(On);Hn.mount("#app");