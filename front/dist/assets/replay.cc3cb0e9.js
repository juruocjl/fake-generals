import{G as Q,I as W,l as oe,f as C,Z as J,M as g,W as w,a3 as j,X as U,P as A,Q as ae,R as le,g as t,S as v,T as S,ar as R,V as re,_ as ue,a7 as Ne,z as O,as as Se,p as ce,bi as ze,aT as Be,b1 as xe,b as ie,bj as Me,j as T,b7 as ee,o as Fe,K as Ee,$ as Le,O as P,a5 as E,aN as ne,a4 as $e,Y as V,aG as Ie,U as Y,b6 as Oe,aV as He,E as De,af as se,b8 as de,A as pe,ah as Pe,b9 as te,ac as Ve,bk as Ae,ba as Re,bb as Ue,bc as Ge,aM as Ye,aL as qe,h as Xe,aK as Z,aB as fe,be as Ze,bf as Je,bg as Ke,bh as Qe}from"./style.60666a56.js";const We=Q({value:{type:[String,Number],default:""},max:{type:Number,default:99},isDot:Boolean,hidden:Boolean,type:{type:String,values:["primary","success","warning","info","danger"],default:"danger"}}),je=["textContent"],en={name:"ElBadge"},nn=W({...en,props:We,setup(a,{expose:u}){const o=a,i=oe("badge"),r=C(()=>o.isDot?"":J(o.value)&&J(o.max)?o.max<o.value?`${o.max}+`:`${o.value}`:`${o.value}`);return u({content:r}),(y,m)=>(g(),w("div",{class:S(t(i).b())},[j(y.$slots,"default"),U(re,{name:`${t(i).namespace.value}-zoom-in-center`,persisted:""},{default:A(()=>[ae(v("sup",{class:S([t(i).e("content"),t(i).em("content",y.type),t(i).is("fixed",!!y.$slots.default),t(i).is("dot",y.isDot)]),textContent:R(t(r))},null,10,je),[[le,!y.hidden&&(t(r)||y.isDot)]])]),_:1},8,["name"])],2))}});var sn=ue(nn,[["__file","/home/runner/work/element-plus/element-plus/packages/components/badge/src/badge.vue"]]);const tn=Ne(sn),K={},on=Q({a11y:{type:Boolean,default:!0},locale:{type:O(Object)},size:Se,button:{type:O(Object)},experimentalFeatures:{type:O(Object)},keyboardNavigation:{type:Boolean,default:!0},message:{type:O(Object)},zIndex:Number,namespace:{type:String,default:"el"}});W({name:"ElConfigProvider",props:on,setup(a,{slots:u}){ce(()=>a.message,i=>{Object.assign(K,i!=null?i:{})},{immediate:!0,deep:!0});const o=ze(a);return()=>j(u,"default",{config:o==null?void 0:o.value})}});const me=["success","info","warning","error"],_=xe({customClass:"",center:!1,dangerouslyUseHTMLString:!1,duration:3e3,icon:"",id:"",message:"",onClose:void 0,showClose:!1,type:"info",offset:16,zIndex:0,grouping:!1,repeatNum:1,appendTo:ie?document.body:void 0}),an=Q({customClass:{type:String,default:_.customClass},center:{type:Boolean,default:_.center},dangerouslyUseHTMLString:{type:Boolean,default:_.dangerouslyUseHTMLString},duration:{type:Number,default:_.duration},icon:{type:Be,default:_.icon},id:{type:String,default:_.id},message:{type:O([String,Object,Function]),default:_.message},onClose:{type:O(Function),required:!1},showClose:{type:Boolean,default:_.showClose},type:{type:String,values:me,default:_.type},offset:{type:Number,default:_.offset},zIndex:{type:Number,default:_.zIndex},grouping:{type:Boolean,default:_.grouping},repeatNum:{type:Number,default:_.repeatNum}}),ln={destroy:()=>!0},z=Me([]),rn=a=>{const u=z.findIndex(r=>r.id===a),o=z[u];let i;return u>0&&(i=z[u-1]),{current:o,prev:i}},un=a=>{const{prev:u}=rn(a);return u?u.vm.exposeProxy.bottom:0},cn=["id"],dn=["innerHTML"],pn={name:"ElMessage"},fn=W({...pn,props:an,emits:ln,setup(a,{expose:u}){const o=a,{Close:i}=Oe,r=oe("message"),y=T(),m=T(!1),k=T(0);let h;const N=C(()=>o.type?o.type==="error"?"danger":o.type:"info"),B=C(()=>{const p=o.type;return{[r.bm("icon",p)]:p&&ee[p]}}),x=C(()=>o.icon||ee[o.type]||""),q=C(()=>un(o.id)),G=C(()=>o.offset+q.value),L=C(()=>k.value+G.value),$=C(()=>({top:`${G.value}px`,zIndex:o.zIndex}));function M(){o.duration!==0&&({stop:h}=He(()=>{b()},o.duration))}function D(){h==null||h()}function b(){m.value=!1}function X({code:p}){p===De.esc&&b()}return Fe(()=>{M(),m.value=!0}),ce(()=>o.repeatNum,()=>{D(),M()}),Ee(document,"keydown",X),Le(y,()=>{k.value=y.value.getBoundingClientRect().height}),u({visible:m,bottom:L,close:b}),(p,c)=>(g(),P(re,{name:t(r).b("fade"),onBeforeLeave:p.onClose,onAfterLeave:c[0]||(c[0]=I=>p.$emit("destroy")),persisted:""},{default:A(()=>[ae(v("div",{id:p.id,ref_key:"messageRef",ref:y,class:S([t(r).b(),{[t(r).m(p.type)]:p.type&&!p.icon},t(r).is("center",p.center),t(r).is("closable",p.showClose),p.customClass]),style:Y(t($)),role:"alert",onMouseenter:D,onMouseleave:M},[p.repeatNum>1?(g(),P(t(tn),{key:0,value:p.repeatNum,type:t(N),class:S(t(r).e("badge"))},null,8,["value","type","class"])):E("v-if",!0),t(x)?(g(),P(t(ne),{key:1,class:S([t(r).e("icon"),t(B)])},{default:A(()=>[(g(),P($e(t(x))))]),_:1},8,["class"])):E("v-if",!0),j(p.$slots,"default",{},()=>[p.dangerouslyUseHTMLString?(g(),w(V,{key:1},[E(" Caution here, message could've been compromised, never use user's input as message "),v("p",{class:S(t(r).e("content")),innerHTML:p.message},null,10,dn)],2112)):(g(),w("p",{key:0,class:S(t(r).e("content"))},R(p.message),3))]),p.showClose?(g(),P(t(ne),{key:2,class:S(t(r).e("closeBtn")),onClick:Ie(b,["stop"])},{default:A(()=>[U(t(i))]),_:1},8,["class","onClick"])):E("v-if",!0)],46,cn),[[le,m.value]])]),_:3},8,["name","onBeforeLeave"]))}});var mn=ue(fn,[["__file","/home/runner/work/element-plus/element-plus/packages/components/message/src/message.vue"]]);let vn=1;const ve=a=>{const u=!a||se(a)||de(a)||pe(a)?{message:a}:a,o={..._,...u};if(!o.appendTo)o.appendTo=document.body;else if(se(o.appendTo)){let i=document.querySelector(o.appendTo);Ve(i)||(i=document.body),o.appendTo=i}return o},gn=a=>{const u=z.indexOf(a);if(u===-1)return;z.splice(u,1);const{handler:o}=a;o.close()},yn=({appendTo:a,...u},o)=>{const{nextZIndex:i}=Pe(),r=`message_${vn++}`,y=u.onClose,m=document.createElement("div"),k={...u,zIndex:i()+u.zIndex,id:r,onClose:()=>{y==null||y(),gn(x)},onDestroy:()=>{te(null,m)}},h=U(mn,k,pe(k.message)||de(k.message)?{default:k.message}:null);h.appContext=o||H._context,te(h,m),a.appendChild(m.firstElementChild);const N=h.component,x={id:r,vnode:h,vm:N,handler:{close:()=>{N.exposeProxy.visible=!1}},props:h.component.props};return x},H=(a={},u)=>{if(!ie)return{close:()=>{}};if(J(K.max)&&z.length>=K.max)return{close:()=>{}};const o=ve(a);if(o.grouping&&z.length){const r=z.find(({vnode:y})=>{var m;return((m=y.props)==null?void 0:m.message)===o.message});if(r)return r.props.repeatNum+=1,r.props.type=o.type,r.handler}const i=yn(o,u);return z.push(i),i.handler};me.forEach(a=>{H[a]=(u={},o)=>{const i=ve(u);return H({...i,type:a},o)}});function hn(a){for(const u of z)(!a||a===u.props.type)&&u.handler.close()}H.closeAll=hn;H._context=null;const bn=Ae(H,"$message");const _n={key:0,href:"https://github.com/juruocjl/fake-generals",target:"_blank",class:"ribbons"},wn=v("img",{loading:"lazy",width:"149",height:"149",src:Ke,class:"attachment-full size-full",alt:"Fork me on GitHub","data-recalc-dims":"1"},null,-1),Cn=[wn],kn={key:1,class:"index"},Tn={class:"contain"},Nn=fe("Start!"),Sn={class:"turn"},zn=fe("turn "),Bn={id:"turn"},xn={class:"rank"},Mn={id:"rank"},Fn=v("tr",null,[v("th",null,"rank"),v("th",null,"name"),v("th",null,"army"),v("th",null,"land")],-1),En=["innerHTML"],Ln=["innerHTML"],$n=["innerHTML"],In=["onClick"],On={key:0,class:"lightning"},Hn={__name:"Replay",setup(a){const o=Re(()=>Ze("fg-user-config",{bgimg:"",color:["#FF0000","#0000FF","#008000","#800080","#A52A2A","#FFA500","#FFC0CB","#FFFF00"]}))(),i=Ue();Ge(i);let r=T(!1);function y(n,e){return e=parseInt(e),e<1200?'<span class="newbiw">'+n+"</span>":e<1400?'<span class="pupil">'+n+"</span>":e<1600?'<span class="specialist">'+n+"</span>":e<1900?'<span class="expert">'+n+"</span>":e<2100?'<span class="candidate-master">'+n+"</span>":e<2400?'<span class="master">'+n+"</span>":e<3e3?'<span class="grandmaster">'+n+"</span>":'<span class="legendary-grandmaster">'+n+"</span>"}let m=T([]),k=T(0),h=T(0),N=T(30),B=T("");function x(n){for(var e=window.location.search.substring(1),f=e.split("&"),d=0;d<f.length;d++){var s=f[d].split("=");if(s[0]==n)return s[1]}return!1}x("name")&&(B.value=x("name"));function q(n,e,f){if(n=JSON.parse(JSON.stringify(n)),!f)return n;for(var d=0;d<k.value;d++)for(var s=0;s<h.value;s++)n[d][s][0]>=0&&n[d][s][1]>=0&&(n[d][s][0]==0?n[d][s][2]+=e:n[d][s][0]!=4?n[d][s][2]++:(n[d][s][2]--,n[d][s][2]==0&&(n[d][s][1]=-1)));return n}function G(n,e){return c.value[n][e][0]==-2||c.value[n][e][0]==-3?"#565656":c.value[n][e][0]==-1||c.value[n][e][0]==5?"#b3b3b3":c.value[n][e][0]==0?c.value[n][e][1]>=0?o.value.color[c.value[n][e][1]]:"#d7d7d7":c.value[n][e][1]>=0?o.value.color[c.value[n][e][1]]:"#757575"}var L=[],$=[],M=[];let D=T(0),b=T(0),X=C(()=>$[b.value]),p=C(()=>M[b.value]),c=C(()=>L[b.value]),I=C(()=>{for(var n=[],e=0;e<m.value.length;e++)n[e]=[0,0];for(var e=0;e<k.value;e++)for(var f=0;f<h.value;f++)c.value[e][f][0]>=0&&c.value[e][f][1]>=0&&(n[c.value[e][f][1]][1]++,n[c.value[e][f][1]][0]+=c.value[e][f][2]);return n}),ge=C(()=>{for(var n=[],e=0;e<I.value.length;e++)m.value[e].vip==0?n[e]={name:y(m.value[e].name,m.value[e].rating),color:o.value.color[e],army:I.value[e][0],land:I.value[e][1]}:n[e]={name:y(m.value[e].name,m.value[e].rating)+'<i class="vip'+m.value[e].vip+'"></i>',color:o.value.color[e],army:I.value[e][0],land:I.value[e][1]};return n.sort((f,d)=>f.army!=d.army?d.army-f.army:f.land!=d.land?d.land-f.land:f.color<d.color?1:-1),n});document.onkeydown=function(n){var e=n||window.event||arguments.callee.caller.arguments[0];e&&e.keyCode==32&&(nowx.value=nowy.value=-1,show())};function ye(n){var e=document.getElementById("map"),f=n.clientX,d=n.clientY,s=e.offsetLeft,l=e.offsetTop;window.onmousemove=function(F){var we=F.clientX,Ce=F.clientY,ke=s+(we-f),Te=l+(Ce-d);e.style.left=ke+"px",e.style.top=Te+"px"}}function he(){window.onmousemove=null}function be(n){n.deltaY<0?N.value=Math.min(50,N.value+3):n.deltaY>0&&(N.value=Math.max(25,N.value-3))}document.body.onselectstart=document.body.oncontextmenu=function(){return!1};function _e(){Je.get("getfile?name="+B.value).then(n=>{if(n.data=="Not Found")bn.error("Not Found.");else{r.value=!0;var e=n.data;k.value=e.his[0].length,h.value=e.his[0][0].length,m.value=e.users;var f=e.his.length;L[0]=e.his[0],$[0]=M[0]=-1;for(var d=e.everyadd,s=1;s<e.his.length;s++)$[s]=M[s]=-1,L[s]=q(L[s-1],(s+1)%d==0,e.ver>=2?s%2==1:!0),e.his[s].forEach(l=>{l[0]=="lt"||l[0]=="lightning"?($[s]=l[1],M[s]=l[2]):L[s][l[0]][l[1]]=l[2]});D.value=e.ver,document.onkeydown=function(l){var F=l||window.event||arguments.callee.caller.arguments[0];F&&F.keyCode==65&&(b.value=Math.max(0,b.value-1)),F&&F.keyCode==68&&(b.value=Math.min(f-1,b.value+1))}}}).catch(n=>{console.log(n)})}return(n,e)=>{const f=Ye,d=qe;return g(),w(V,null,[t(r)?E("",!0):(g(),w("a",_n,Cn)),t(r)?E("",!0):(g(),w("div",kn,[v("div",Tn,[U(f,{modelValue:t(B),"onUpdate:modelValue":e[0]||(e[0]=s=>Xe(B)?B.value=s:B=s),class:"w-50 m-2",placeholder:"\u56DE\u653Eid"},null,8,["modelValue"]),U(d,{style:{margin:"10px"},type:"success",plain:"",onClick:e[1]||(e[1]=s=>{_e()})},{default:A(()=>[Nn]),_:1})])])),v("div",Sn,[zn,v("span",Bn,R(t(D)>=2?Math.ceil(t(b)/2):t(b)),1)]),v("div",xn,[v("table",null,[v("tbody",Mn,[Fn,(g(!0),w(V,null,Z(t(ge),(s,l)=>(g(),w("tr",null,[v("td",{style:Y({color:"white",background:s.color,"font-weight":800})},R(l+1),5),v("td",{innerHTML:s.name},null,8,En),v("td",{innerHTML:s.army},null,8,Ln),v("td",{innerHTML:s.land},null,8,$n)]))),256))])])]),t(r)?(g(),w("table",{key:2,cellspacing:"0",cellpadding:"0",border:"0",style:Y({"--size":t(N)+"px","font-size":Math.min(18,Math.floor((n.now+32)/5))+"px"})},[v("tbody",{class:"map",id:"map",onMousedown:ye,onMouseup:he,onMousewheel:be},[(g(!0),w(V,null,Z(t(k),s=>(g(),w("tr",null,[(g(!0),w(V,null,Z(t(h),l=>(g(),w("td",{style:Y({background:G(s-1,l-1)}),class:S({cell:!0,nowpos:n.nowx==s-1&&n.nowy==l-1}),onClick:F=>n.setnow(s-1,l-1)},[v("span",{class:S({num:!0,unknow:t(c)[s-1][l-1][0]==-3,visible:t(c)[s-1][l-1][0]!=-2&&t(c)[s-1][l-1][0]!=-3,mountain:t(c)[s-1][l-1][0]==-1,toxins:t(c)[s-1][l-1][0]==5,empty:t(c)[s-1][l-1][0]==0,town:t(c)[s-1][l-1][0]==1,crown:t(c)[s-1][l-1][0]==2,umbrella:t(c)[s-1][l-1][0]==3,water:t(c)[s-1][l-1][0]==4})},R(n.nowx==s-1&&n.nowy==l-1&&n.op==1?"50%":t(c)[s-1][l-1][2]?t(c)[s-1][l-1][2]:""),3),t(X)==s-1&&t(p)==l-1?(g(),w("span",On)):E("",!0)],14,In))),256))]))),256))],32)],4)):E("",!0)],64)}}},Dn=Qe(Hn);Dn.mount("#app");
