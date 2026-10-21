import {kitchenFinishes} from './kitchen-finishes.js';
import {kitchenTypes,kitchenIdeas} from './kitchen.js';
export function buildKitchen(item,g,{box,cyl,mat,woodMat,metalMat:originalMetal}){
 if(!kitchenTypes.includes(item.type))return false;
 const {w,d,h,type,role}=item,p=kitchenIdeas[String(item.referenceId).split('-').at(-1)]||kitchenIdeas.parallel;
 const finish=kitchenFinishes[item.finishPalette],metalMat=finish?mat('#554e45',{roughness:.6,metalness:.4}):originalMetal,grain=finish?.wood&&['kitchenbase','kitchentall','kitchenisland','kitchenshelf'].includes(type);
 const face=mat(item.color||p.front,{map:grain?woodMat.map:null,roughness:.8}),top=mat(finish?.top||p.top,{roughness:.65}),carcass=mat('#e4dfd1'),dark=mat(finish?'#615b53':'#74766a');
 const b=(w,h,d,x,y,z,m=face)=>box(w,h,d,x,y,z,m,g,.002);
 const pull=(x,y,width=.13)=>b(Math.min(width,w*.5),.009,.025,x,y,d/2+.012,metalMat);
 if(type==='appliancebay'&&role==='laundrystack'){
  const shell=mat('#e3e3de',{roughness:.45}),panel=mat('#bfc3bd'),glass=mat('#4e5b59',{roughness:.25});
  for(const bottom of [0,.88]){b(.60,.84,.70,0,bottom+.42,.01,shell);b(.56,.065,.012,0,bottom+.755,.366,panel);b(.13,.035,.008,.15,bottom+.755,.376,dark);
   const rim=cyl(.205,.025,0,bottom+.41,.373,metalMat,g);rim.rotation.x=Math.PI/2;
   const door=cyl(.167,.026,0,bottom+.41,.386,glass,g);door.rotation.x=Math.PI/2;
   const knob=cyl(.023,.015,-.18,bottom+.755,.38,metalMat,g);knob.rotation.x=Math.PI/2;
  }
  b(.62,.035,.71,0,.8575,.01,metalMat);
 }else if(type==='appliancebay'&&role==='dishwasher'){
  const shell=mat('#d5d8d1',{roughness:.5});b(.60,.845,.60,0,.4225,.015,shell);b(.58,.055,.014,0,.78,.316,dark);b(.34,.012,.027,0,.72,.308,metalMat);b(w,.025,d,0,h-.0125,0,top);
 }else if(type==='wallreserve'&&role==='moprack'){
  b(w,.065,.035,0,1.52,-d/2+.02,metalMat);
  for(const x of [-.18,.02,.20])b(.025,.04,.08,x,1.46,-.025,metalMat);
  b(.016,1.24,.016,-.18,.86,.025,woodMat);b(.20,.065,.09,-.18,.21,.025,mat('#b49d7f'));
  b(.014,1.22,.014,.02,.87,.03,metalMat);cyl(.075,.025,.02,.235,.03,mat('#b9c2b8'),g);
  b(.17,.035,.15,.20,.60,.015,mat('#8b9491'));b(.015,.37,.015,.20,.79,-.02,metalMat);
  b(w,.025,d,0,.08,0,mat('#b6bab1'));
 }else if(type==='appliancebay'){
  // Open, tinted reserve volume rather than an invented appliance model.
  b(.018,h,d,-w/2+.009,h/2,0,carcass);b(.018,h,d,w/2-.009,h/2,0,carcass);b(w,.025,d,0,h-.0125,0,carcass);b(w,.025,d,0,.0125,0,carcass);
  b(w-.036,h-.05,.008,0,h/2,-d/2+.004,mat(finish?'#ddd7ca':'#bfc6b6'));
  b(w-.05,.025,.025,0,h*.54,d/2-.013,dark);
  for(const x of [-w/2+.025,w/2-.025])b(.012,h-.05,.012,x,h/2,d/2-.01,dark);
 }else if(type==='dryingrack'){
  for(const z of [-d/2,d/2])b(w,.018,.018,0,h/2,z,metalMat);
  for(let x=-w/2;x<=w/2+.001;x+=w/7)b(.012,.012,d,x,h/2,0,metalMat);
  for(const x of [-w*.4,w*.4])for(const z of [-d*.4,d*.4])b(.004,Math.max(.02,2.7432-(item.elevation||0)-h),.004,x,h+(2.7432-(item.elevation||0)-h)/2,z,metalMat);
 }else if(type==='kitchenshelf'){
  b(w,h,d,0,h/2,0,woodMat);for(const x of [-w*.3,w*.3]){b(.02,.28,.03,x,-.14,-d/2+.015,metalMat);b(.02,.02,d*.8,x,-.04,-d*.1,metalMat);}
 }else if(type==='kitchenstool'){
  b(w,.04,d,0,h-.02,0,woodMat);for(const x of [-w*.35,w*.35])for(const z of [-d*.35,d*.35])b(.025,h-.04,.025,x,(h-.04)/2,z,woodMat);b(w*.7,.02,.02,0,.23,d*.35,woodMat);
 }else if(type==='wallreserve'){
  b(w,h,d,0,h/2,0,dark);
 }else{
  const upper=type==='kitchenupper',tall=type==='kitchentall',island=type==='kitchenisland',plinth=upper?0:.10,topH=!upper&&!tall?.025:.018;
  const baseD=role==='breakfast'?Math.max(.15,d-.25):d,baseZ=role==='breakfast'?.125:0;
  b(w-.025,Math.max(.02,h-plinth-topH),baseD-.025,0,plinth+(h-plinth-topH)/2,baseZ,carcass);
  if(plinth)b(w-.07,plinth,Math.max(.08,baseD-.08),0,plinth/2,baseZ,dark);
  b(w,topH,d,0,h-topH/2,0,upper||tall?face:top);
  const frontZ=baseZ+baseD/2;
  const drawer=(y,hh)=>{b(w-.012,hh-.008,.020,0,y,frontZ-.010,face);pull(0,y+hh*.30);};
  if(role==='drawers'||island){const dh=(h-plinth-topH)/3;for(let k=0;k<3;k++)drawer(plinth+dh*(k+.5),dh);}
  else if(role==='oventower'){
   b(w-.012,.39,.020,0,.295,frontZ-.01,face);pull(0,.41);
   for(const [y,hh] of [[.90,.60],[1.47,.44]]){b(w-.045,hh,.022,0,y,frontZ-.01,mat('#414a44',{roughness:.4}));b(w-.13,hh*.60,.004,0,y-.025,frontZ+.004,mat('#707b70',{roughness:.25}));b(w-.13,.014,.035,0,y+hh*.30,frontZ+.02,metalMat);}
   b(w-.012,.47,.020,0,1.945,frontZ-.01,face);pull(0,1.80);
  }
  else {const columns=w>.75?2:1,ww=w/columns;for(let k=0;k<columns;k++){const x=-w/2+ww*(k+.5);b(ww-.010,h-plinth-topH-.008,.020,x,plinth+(h-plinth-topH)/2,frontZ-.010,face);pull(x,upper?h*.28:tall?h*.52:h*.75);}}
  if(upper){b(w-.04,.008,.012,0,.006,d/2-.025,mat('#fff1c5',{emissive:'#ffde96',emissiveIntensity:.5}));}
  if(role==='sink'||role==='utilitysinkbin'){
   // Generic zone marker: actual bowl / tap not selected.
   b(w*.72,.003,d*.58,0,h+.002,0,mat('#858e83',{roughness:.5}));b(w*.62,.003,d*.46,0,h+.004,0,mat('#acb5a9'));
   cyl(.009,.12,w*.22,h+.06,-d*.34,metalMat,g);b(.09,.012,.014,w*.22-.036,h+.12,-d*.34,metalMat);
  }
  if(role==='hob'){b(item.applianceIds?.includes('need-stove')?.75:w*.78,.005,item.applianceIds?.includes('need-stove')?.50:d*.66,0,h+.003,0,mat('#555d53'));for(const x of [-w*.18,w*.18])for(const z of [-d*.17,d*.17])cyl(.055,.003,x,h+.007,z,mat('#929889'),g);}
  if(role==='appliancestation'){
   // Generic parking volumes; no purchased appliance or operating-clearance claim.
   const body=mat('#66726b',{roughness:.55}),glass=mat('#aab6ac',{roughness:.35});
   for(const [x,ww,dd,r] of [[-.36,.30,.35,'mixer'],[-.035,.25,.35,'juicer'],[.315,.35,.45,'coffee']]){
    if(r==='coffee'){b(ww,.35,dd,x,h+.175,-.08,body);b(ww*.55,.15,.006,x,h+.16,-.08+dd/2+.004,dark);b(ww*.65,.015,.10,x,h+.025,-.08+dd/2+.04,metalMat);}
    else {cyl(ww*.38,.14,x,h+.07,-.10,body,g);cyl(ww*.30,.27,x,h+.275,-.10,glass,g);cyl(ww*.33,.018,x,h+.419,-.10,dark,g);}
   }
  }
  if(role==='corner')b(w-.04,.004,d-.04,0,h+.003,0,top);
 }
 return true;
}
