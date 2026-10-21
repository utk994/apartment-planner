import {createOverallPlan,overallLabels} from './overall-plan.js';
import {kitchenBounds,utilityBounds,raisedKitchen} from './kitchen.js';
import {buildKitchen} from './kitchen-render.js';
import * as THREE from 'three';
import {RoundedBoxGeometry} from './assets/vendor/RoundedBoxGeometry.js';
import {flooring} from './data.js';
import {diningBounds,roomOf,pulledChair} from './dining.js';
import {schemePalettes} from './schemes.js';
const floorItems=items=>items.filter(i=>!['rug','tv','soundbar','pendant','art','artset','tablelamp','decor'].includes(i.type));
export function cabinetAccess(i){const a=i.rotation*Math.PI/180,o=i.d/2+.30;return {...i,w:i.w,d:.60,x:i.x+Math.sin(a)*o,z:i.z+Math.cos(a)*o};}
export const bounds={x0:0,x1:3.3528,z0:1.7272,z1:6.0706};
const T=.2032,H=2.7432;
export function footprint(item){
 const a=item.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
 return [[-item.w/2,-item.d/2],[item.w/2,-item.d/2],[item.w/2,item.d/2],[-item.w/2,item.d/2]].map(([x,z])=>[item.x+x*c+z*s,item.z-x*s+z*c]);
}
function overlapRect(a,b){
 const p=footprint(a),q=footprint(b);
 for(const poly of [p,q])for(let i=0;i<4;i++){
  const next=poly[(i+1)%4],edge=[next[0]-poly[i][0],next[1]-poly[i][1]],axis=[-edge[1],edge[0]];
  const P=p.map(v=>v[0]*axis[0]+v[1]*axis[1]),Q=q.map(v=>v[0]*axis[0]+v[1]*axis[1]);
  if(Math.max(...P)<=Math.min(...Q)+.001||Math.max(...Q)<=Math.min(...P)+.001)return false;
 }
 return true;
}
function parts(item){
 if(item.type!=='chaise')return [item];
 const mainD=Math.min(.95,item.d),extra=item.d-mainD;if(extra<.01)return [item];
 const a=item.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),cw=Math.min(.90,item.w*.34);
 const part=(w,d,x,z)=>({...item,type:'sofa',w,d,x:item.x+x*c+z*s,z:item.z-x*s+z*c});
 return [part(item.w,mainD,0,-item.d/2+mainD/2),part(cw,extra,-item.w/2+cw/2,item.d/2-extra/2)];
}
export function overlap(a,b){return parts(a).some(p=>parts(b).some(q=>overlapRect(p,q)));}
export function checks(items,room='living'){
 if(room==='dining')return diningChecks(items);
 if(room==='kitchen')return kitchenChecks(items);
 const solid=floorItems(items),issues=[];
 for(const item of solid){if(parts(item).flatMap(footprint).some(([x,z])=>x<-.01||x>(item.type==='screen'?3.556:bounds.x1)+.01||z<bounds.z0-.01||z>bounds.z1+.01))issues.push({kind:'outside',text:`${item.name} extends outside the living-room boundary.`,ids:[item.id]});}
 for(let i=0;i<solid.length;i++)for(let j=i+1;j<solid.length;j++)if(overlap(solid[i],solid[j]))issues.push({kind:'overlap',text:`${solid[i].name} and ${solid[j].name} have overlapping footprints.`,ids:[solid[i].id,solid[j].id]});
 const route={w:.60,d:4.04,x:.77,z:3.95,rotation:0};
 for(const item of solid)if(overlap(item,route))issues.push({kind:'route',text:`${item.name} reaches into the 60 cm balcony-access guide.`,ids:[item.id]});
 const dining={w:3.086,d:.90,x:2.013,z:5.6206,rotation:0};
 for(const item of solid)if(overlap(item,dining))issues.push({kind:'dining-route',text:`${item.name} reaches into the 90 cm foyer-to-dining guide.`,ids:[item.id]});
 return issues;
}
export function passageGap(items){
 const relevant=items.filter(i=>!['rug','tv','soundbar'].includes(i.type)).flatMap(parts).filter(i=>footprint(i).some(([x])=>x>1.07&&x<3.56));
 return Math.max(0,bounds.z1-Math.max(bounds.z0,...relevant.flatMap(i=>footprint(i).map(p=>p[1]))));
}
export function diningClearance(items){
 const solid=floorItems(items),pulled=solid.map(i=>i.type==='diningchair'?pulledChair(i):i);
 const bottom=list=>Math.max(diningBounds.z0,...list.flatMap(i=>footprint(i).map(p=>p[1])));
 return {seated:Math.max(0,diningBounds.z1-bottom(solid)),pulled:Math.max(0,diningBounds.z1-bottom(pulled))};
}
function diningChecks(items){
 const issues=[],solid=floorItems(items);
 const outside=i=>footprint(i).some(([x,z])=>x<diningBounds.x0-.005||x>diningBounds.x1+.005||z<diningBounds.z0-.005||z>diningBounds.z1+.005);
 for(const i of solid)if(outside(i))issues.push({kind:'outside',text:i.name+' extends outside the dining study boundary.',ids:[i.id]});
 for(let i=0;i<solid.length;i++)for(let j=i+1;j<solid.length;j++)if(overlap(solid[i],solid[j]))issues.push({kind:'overlap',text:solid[i].name+' and '+solid[j].name+' overlap at their shown positions.',ids:[solid[i].id,solid[j].id]});
 const pulled=solid.map(i=>i.type==='diningchair'?pulledChair(i):i);
 for(const i of pulled.filter(i=>i.type==='diningchair')){
  if(outside(i))issues.push({kind:'chair-space',text:'A chair crosses the dining boundary when pulled back 35 cm.',ids:[i.id]});
  for(const j of pulled)if(i.id!==j.id&&overlap(i,j)){issues.push({kind:'chair-space',text:'A pulled-back chair conflicts with another piece.',ids:[i.id,j.id]});break;}
 }
 for(const cab of solid.filter(i=>i.type==='cabinet')){const access=cabinetAccess(cab);if(pulled.some(i=>i.id!==cab.id&&overlap(i,access)))issues.push({kind:'storage-access',text:'The crockery cupboard’s 60 cm access allowance conflicts with furniture / a pulled-back chair.',ids:[cab.id]});}
 const gap=diningClearance(items);
 if(gap.pulled<.9-1e-6)issues.push({kind:'dining-route',text:`The south through-passage narrows to about ${Math.round(gap.seated*100)} cm at shown positions and ${Math.round(gap.pulled*100)} cm with chairs pulled back. The 90 cm guide is obstructed.`,ids:solid.filter(i=>footprint(i).some(p=>p[1]>5.2976)).map(i=>i.id)});
 const approaches=[{name:'Bedroom 3',w:.8128,d:.60,x:7.0358,z:3.856,rotation:0},{name:'Common bathroom',w:.8128,d:.60,x:6.35,z:5.8976,rotation:0}];
 for(const a of approaches)if(pulled.some(i=>overlap(i,a)))issues.push({kind:'door-approach',text:a.name+' approach is obstructed in the chair pull-back study; doorway position is estimated.',ids:[]});
 return issues;
}
export function kitchenClearance(items){
 const solid=items.filter(i=>!raisedKitchen.includes(i.type)||i.role==='moprack'),island=solid.find(i=>i.type==='kitchenisland');
 const edges=i=>{const f=footprint(i);return {left:Math.min(...f.map(p=>p[0])),right:Math.max(...f.map(p=>p[0])),top:Math.min(...f.map(p=>p[1])),bottom:Math.max(...f.map(p=>p[1]))};};
 const kitchen=solid.filter(i=>i.zone!=='utility'),utility=solid.filter(i=>i.zone==='utility');
 let working=null,end=null;
 if(island){const e=edges(island),east=kitchen.filter(i=>i!==island&&edges(i).left>e.right&&edges(i).bottom>e.top&&edges(i).top<e.bottom);working=(east.length?Math.min(...east.map(i=>edges(i).left)):kitchenBounds.x1)-e.right;end=kitchenBounds.z1-e.bottom;}
 else {const west=kitchen.filter(i=>i.rotation===90),east=kitchen.filter(i=>i.rotation===-90);if(west.length&&east.length)working=Math.min(...east.map(i=>edges(i).left))-Math.max(...west.map(i=>edges(i).right));}
 const uWest=utility.filter(i=>edges(i).right<3),uEast=utility.filter(i=>edges(i).left>3.3);
 const pairs=uWest.flatMap(w=>uEast.filter(e=>edges(w).bottom>edges(e).top+.001&&edges(e).bottom>edges(w).top+.001).map(e=>edges(e).left-edges(w).right));
 const utilityGap=pairs.length?Math.min(...pairs):null;
 return {working,end,utility:utilityGap,island:!!island};
}
export function utilityOpeningClearance(items){
 const solid=items.filter(i=>i.zone==='utility'&&(!raisedKitchen.includes(i.type)||i.role==='moprack'));
 const edge=i=>{const f=footprint(i);return {left:Math.min(...f.map(p=>p[0])),right:Math.max(...f.map(p=>p[0])),top:Math.min(...f.map(p=>p[1])),bottom:Math.max(...f.map(p=>p[1]))};};
 const remaining=role=>{const host=solid.find(i=>i.role===role);if(!host)return null;const h=edge(host),a=edge(cabinetAccess(host)),others=solid.filter(i=>i.id!==host.id&&edge(i).top<a.bottom-.001&&edge(i).bottom>a.top+.001);
  if(host.rotation===90)return Math.max(0,Math.min(utilityBounds.x1,...others.filter(i=>edge(i).left>=h.right-.005).map(i=>edge(i).left))-a.right);
  if(host.rotation===-90)return Math.max(0,a.left-Math.max(utilityBounds.x0,...others.filter(i=>edge(i).right<=h.left+.005).map(i=>edge(i).right)));
  return null;
 };
 return {dishwasher:remaining('dishwasher'),laundry:remaining('laundrystack'),allowance:.60};
}
function kitchenChecks(items){
 const issues=[],solid=items.filter(i=>!raisedKitchen.includes(i.type)||i.role==='moprack');
 for(const i of items){const b=i.zone==='utility'?utilityBounds:kitchenBounds;if(footprint(i).some(([x,z])=>x<b.x0-.01||x>b.x1+.01||z<b.z0-.01||z>b.z1+.01))issues.push({kind:'outside',text:i.name+' extends outside its room boundary.',ids:[i.id]});if((i.elevation||0)+i.h>2.7432+.005)issues.push({kind:'height',text:i.name+' exceeds the 9-foot wall height.',ids:[i.id]});}
 // Volume checks also catch a wall cupboard intersecting a tall unit, while permitting storage above a base.
 for(let a=0;a<items.length;a++)for(let b=a+1;b<items.length;b++){const i=items[a],j=items[b],iy=i.elevation||0,jy=j.elevation||0;if(iy+i.h>jy+.005&&jy+j.h>iy+.005&&overlap(i,j))issues.push({kind:'overlap',text:i.name+' overlaps '+j.name+'.',ids:[i.id,j.id]});}
 const island=solid.find(i=>i.type==='kitchenisland');
 const routes=[{name:'Utility doorway approach (scaled position)',w:1.05,d:1.40,x:3.125,z:8.99,rotation:0},{name:'Kitchen entry guide',w:.90,d:.60,x:island?4.45:3.25,z:6.50,rotation:0}];
 for(const r of routes)for(const i of solid)if(overlap(i,r))issues.push({kind:'route',text:i.name+' obstructs the '+r.name.toLowerCase()+'.',ids:[i.id]});
 const gap=kitchenClearance(items);
 if(gap.working!==null&&gap.working<(island?1.20:.90)-.005)issues.push({kind:'aisle',text:'Working aisle is approximately '+Math.round(gap.working*100)+' cm; review against the '+(island?'120':'90')+' cm planning guide.',ids:[]});
 if(gap.end!==null&&gap.end<.90-.005)issues.push({kind:'route',text:'The utility-end passage around the island falls below the 90 cm guide.',ids:island?[island.id]:[]});
 if(gap.utility!==null&&gap.utility<.90-.005)issues.push({kind:'aisle',text:'The utility working gap is below 90 cm.',ids:[]});
 for(const i of solid.filter(i=>['kitchenbase','kitchentall','appliancebay','kitchenisland'].includes(i.type))){if(i.role==='blindcorner')continue;const access=cabinetAccess(i);if(solid.some(j=>j.id!==i.id&&overlap(j,access)))issues.push({kind:'cabinet-access',text:i.name+' has another piece inside its 60 cm opening / working allowance.',ids:[i.id]});}
 return issues;
}
export function createScene(canvas,{select,move,commit}){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#ecece2');
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const camera=new THREE.PerspectiveCamera(40,1,.025,100);
 const planCamera=new THREE.OrthographicCamera(-3,3,3,-3,.01,60);planCamera.up.set(0,0,-1);
 const shell=new THREE.Group(),furn=new THREE.Group(),context=new THREE.Group(),guides=new THREE.Group(),diningGuides=new THREE.Group(),chairGuides=new THREE.Group();scene.add(shell,furn,context,guides,diningGuides,chairGuides);
 const walls=[];let room='living',kitchenFocus='both';let state,view='cutaway',selected=null,showDimensions=true,boxHelper=null,frame=0,dirty=true;
 let W=600,HH=500;const target=new THREE.Vector3(1.68,.35,3.9);let theta=-.72,phi=.72,radius=8.3,planZoom=1;
 const labels=document.querySelector('#scene-labels');
 const loader=new THREE.TextureLoader();let pending=0;
 function tex(name,repeat=1,color=false){pending++;const t=loader.load('./assets/textures/'+name,()=>{pending--;dirty=true;if(!pending)document.querySelector('#loading').hidden=true},undefined,()=>{pending--;document.querySelector('#loading').hidden=true});t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeat,repeat);t.anisotropy=4;if(color)t.colorSpace=THREE.SRGBColorSpace;return t;}
 const oak=tex('oak-color.jpg',1,true),weave=tex('fabric-weave.jpg',6),fabricNormal=tex('fabric-normal.jpg',6),plaster=tex('plaster-normal.jpg',2);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.9,...extra});
 const diningWallMat=mat('#eee9da',{normalMap:plaster,normalScale:new THREE.Vector2(.04,.04)});
 const wallMat=mat('#eee9da',{normalMap:plaster,normalScale:new THREE.Vector2(.04,.04)}),edgeMat=mat('#d0c6ad'),woodMat=mat('#cbb28b',{map:oak,roughness:.82}),metalMat=mat('#504f42',{roughness:.65,metalness:.3});
 function mesh(geometry,material,x,y,z,parent=shell){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,x,y,z,material,parent=shell,round=0){return mesh(round?new RoundedBoxGeometry(w,h,d,4,Math.min(round,w/2,h/2,d/2)):new THREE.BoxGeometry(w,h,d),material,x,y,z,parent);}
 function cyl(r,h,x,y,z,material,parent=shell){return mesh(new THREE.CylinderGeometry(r,r,h,32),material,x,y,z,parent);}
 function wall(w,d,x,z,cut=false){const g=new THREE.Group();g.position.set(x,0,z);shell.add(g);box(w,H,d,0,H/2,0,Math.abs(z-3.4544)<.001&&w>1?diningWallMat:wallMat,g);box(w+.004,.016,d+.004,0,H+.008,0,edgeMat,g);walls.push({g,cut});}
 // Procedural stone-effect tile study. Tile type is confirmed; size/colour are provisional.
 const tileCanvas=document.createElement('canvas');tileCanvas.width=tileCanvas.height=512;
 const tileCtx=tileCanvas.getContext('2d'),tilePixels=tileCtx.createImageData(512,512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  const i=(y*512+x)*4,grain=(Math.sin(x*12.9898+y*78.233)*43758.5453)%1;
  const cloud=Math.sin(x*.023+y*.009)*Math.cos(y*.019)*1.8;
  const grout=x<2||y<2||x>=510||y>=510;
  tilePixels.data[i]=(grout?191:226)+cloud+grain*1.3;
  tilePixels.data[i+1]=(grout?189:223)+cloud+grain*1.3;
  tilePixels.data[i+2]=(grout?180:212)+cloud+grain*1.3;
  tilePixels.data[i+3]=255;
 }
 tileCtx.putImageData(tilePixels,0,0);
 const tileTexture=new THREE.CanvasTexture(tileCanvas);tileTexture.colorSpace=THREE.SRGBColorSpace;
 tileTexture.wrapS=tileTexture.wrapT=THREE.RepeatWrapping;tileTexture.anisotropy=8;
 const floorMat=mat('#ffffff',{map:tileTexture,roughness:.62});
 const overall=createOverallPlan(floorMat);overall.visible=false;scene.add(overall);
 function tileFloor(w,d,x,z){
  const geo=new THREE.BoxGeometry(w,.10,d),uv=geo.attributes.uv,pos=geo.attributes.position;
  const tileMetres=flooring.tile.sizeCm/100;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+x)/tileMetres,(pos.getZ(i)+z-bounds.z0)/tileMetres);
  return mesh(geo,floorMat,x,-.05,z);
 }
 // The living, foyer and dining junctions use the same metre coordinates as the apartment model.
 tileFloor(3.3528,4.3434,1.6764,3.8989);
 tileFloor(1.524,2.7432,.762,7.4422);
 tileFloor(4.064,2.6416,5.588,4.8768);
 tileFloor(3.3528,1.524,1.6764,.762);
 tileFloor(.2032,2.6416,3.4544,4.8768);
 wall(T,7.1882,-T/2,5.2197,true);wall(T,1.8272,3.4544,2.6408);wall(3.175,T,5.0419,3.4544);wall(.1016,T,7.493,3.4544);box(.8128,H-2.13,T,7.0358,(H+2.13)/2,3.4544,wallMat);
 // Estimated bedroom threshold. Door swing is not a verified site measurement.
 box(.8128,.012,.18,7.0358,.006,3.4544,edgeMat);
 // Slider estimate: 38 cm wall return + 223 cm assembly + 74.3 cm return.
 const sliderX=.38,sliderW=2.23,z=1.6256;
 box(sliderX+T,.10, T,(sliderX-T)/2,.05,z,edgeMat);
 wall(sliderX+T,T,(sliderX-T)/2,z);wall(3.4544-sliderX-sliderW,T,(3.4544+sliderX+sliderW)/2,z);
 box(sliderW,H-2.35,T,sliderX+sliderW/2,(H+2.35)/2,z,wallMat);
 const glass=new THREE.MeshPhysicalMaterial({color:'#d7e4dc',transparent:true,opacity:.15,roughness:.1,metalness:.1,side:THREE.DoubleSide});
 box(sliderW,2.28,.012,sliderX+sliderW/2,1.16,z,glass);
 for(const x of [sliderX,sliderX+sliderW/2,sliderX+sliderW])box(.027,2.35,.055,x,1.175,z,metalMat);
 for(const y of [.025,2.325])box(sliderW,.035,.055,sliderX+sliderW/2,y,z,metalMat);
 for(const x of [0,3.3528])box(.028,.09,4.3434,x,.045,3.8989,wallMat);
 wall(1.7272,T,.762,8.9154,true);wall(T,2.92,1.6256,7.53,true);
 // Cabinetry is now selected-room furniture, so every return / island is an explicit proposal.
 tileFloor(4.0132,2.6924,3.7338,7.5438);
 tileFloor(2.5654,1.8288,3.0099,10.0076);
 tileFloor(1.05,.2032,3.125,8.9916);
 wall(T,2.6924,5.842,7.5438);
 wall(.8728,T,2.1636,8.9916,true);wall(2.192,T,4.746,8.9916,true);
 const utilityLintel=box(1.05,H-2.13,T,3.125,(H+2.13)/2,8.9916,wallMat);
 wall(T,1.9304,1.6256,10.0584,true);wall(T,1.9304,4.3942,10.0584);
 // Utility rear window and doorway positions are scaled estimates from the drawing.
 wall(.4228,T,1.9386,11.0236,true);wall(.5926,T,3.9963,11.0236,true);
 box(1.55,.80,T,2.925,.40,11.0236,wallMat);box(1.55,H-2.25,T,2.925,(H+2.25)/2,11.0236,wallMat);
 box(1.55,1.45,.012,2.925,1.525,11.0236,glass);
 for(const x of [2.15,2.925,3.70])box(.025,1.45,.04,x,1.525,11.0236,metalMat);
 for(const y of [.80,2.25])box(1.55,.025,.04,2.925,y,11.0236,metalMat);
 wall(.2032,T,5.842,6.096,true);wall(.8128,T,7.1628,6.096,true);box(.8128,.012,.18,6.35,.006,6.096,edgeMat);
 // Balcony parapet, outdoor greenery and a restrained curtain at either end.
 box(3.55,1.02,.12,1.6764,.51,-.07,wallMat);
 const curtainMat=mat('#f3efdf',{side:THREE.DoubleSide});
 for(const x of [.28,3.12])for(let i=0;i<7;i++)cyl(.035,2.32,x+(i-3)*.04,1.16,1.47,curtainMat);
 const leafMat=mat('#687e51');for(const x of [.45,2.85]){cyl(.16,.30,x,.15,.65,mat('#b29270'));for(let i=0;i<7;i++){const leaf=mesh(new THREE.SphereGeometry(1,12,8),leafMat,x+Math.sin(i*2.1)*.15,.5+i*.07,.65+Math.cos(i*2.1)*.15);leaf.scale.set(.1,.25,.04);leaf.rotation.z=Math.sin(i)*.6;}}
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),mat('#ecece2'));ground.rotation.x=-Math.PI/2;ground.position.y=-.13;ground.receiveShadow=true;scene.add(ground);
 const hemi=new THREE.HemisphereLight('#f6f5ef','#c5bdaa',2.4);scene.add(hemi);
 const sun=new THREE.DirectionalLight('#fff0d8',3);sun.position.set(-3,7,-1);sun.target.position.set(1.5,0,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:8,bottom:-6,near:.5,far:25});sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;scene.add(sun,sun.target);
 const fill=new THREE.PointLight('#fff0dc',12,10,2);fill.position.set(1.5,2.3,2);scene.add(fill);
 function line(points,color='#8f9c7f',dashed=false){const geo=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const material=dashed?new THREE.LineDashedMaterial({color,dashSize:.1,gapSize:.07,transparent:true,opacity:.6}):new THREE.LineBasicMaterial({color,transparent:true,opacity:.65});const l=new THREE.Line(geo,material);l.computeLineDistances();guides.add(l);return l;}
 function diningLine(points,color='#8a9c77',dashed=false){const l=line(points,color,dashed);diningGuides.add(l);return l;}
 for(const z of [5.2976,6.1976])diningLine([[3.556,.032,z],[7.62,.032,z]],'#8a9c77',true);
 diningLine([[3.556,.03,6.48],[7.62,.03,6.48]]);for(const x of [3.556,7.62])diningLine([[x,.03,6.39],[x,.03,6.57]]);
 diningLine([[7.88,.03,3.556],[7.88,.03,6.1976]]);for(const z of [3.556,6.1976])diningLine([[7.79,.03,z],[7.97,.03,z]]);
 // Approximate approaches; not door swing simulations.
 for(const [x,z] of [[7.0358,3.856],[6.35,5.8976]])diningLine([[x-.4064,.025,z-.3],[x+.4064,.025,z-.3],[x+.4064,.025,z+.3],[x-.4064,.025,z+.3],[x-.4064,.025,z-.3]],'#b3946e',true);
 line([[-.40,.02,1.7272],[-.40,.02,6.0706]]);for(const z of [1.7272,6.0706])line([[-.48,.02,z],[-.28,.02,z]]);
 line([[0,.02,6.35],[3.3528,.02,6.35]]);for(const x of [0,3.3528])line([[x,.02,6.25],[x,.02,6.45]]);
 for(const x of [.47,1.07])line([[x,.026,1.84],[x,.026,6.07]],'#8c9f7d',true);
 for(const z of [5.1706,6.0706])line([[1.07,.028,z],[3.556,.028,z]],'#8c9f7d',true);
 const labelDefs=[{text:'11′ / 335 cm',p:new THREE.Vector3(1.68,.03,6.35)},{text:'14′3″ / 434 cm',p:new THREE.Vector3(-.4,.03,3.90)},{text:'Sliding door ≈ 223 cm',p:new THREE.Vector3(1.5,.03,1.38)},{text:'To dining →',p:new THREE.Vector3(4.25,.03,5.55)},{text:'90 cm dining passage guide',p:new THREE.Vector3(2.24,.035,5.65)}];
 const kitchenLabels=[{text:'KITCHEN · 401 × 269 cm',p:new THREE.Vector3(3.7,.04,6.05)},{text:'UTILITY · 257 × 183 cm',p:new THREE.Vector3(3.01,.04,10.10)},{text:'≈ 105 cm utility opening · estimated',p:new THREE.Vector3(3.12,.04,9.00)}];
 function materialFor(item){return mat(item.color,{map:item.type==='woodsofa'?null:weave,normalMap:fabricNormal,normalScale:new THREE.Vector2(.12,.12),roughness:.97});}
 const diningLabels=[{text:'13′4″ / 406 cm',p:new THREE.Vector3(5.588,.03,6.48)},{text:'8′8″ / 264 cm',p:new THREE.Vector3(7.88,.03,4.87)},{text:'← Living & jali',p:new THREE.Vector3(3.3,.03,5.6)},{text:'90 cm through-passage guide',p:new THREE.Vector3(5.45,.03,5.98)},{text:'Bedroom 3 · estimated doorway',p:new THREE.Vector3(7.03,.03,3.38)}];
 function artMaterial(style,index=0){
  const c=document.createElement('canvas');c.width=384;c.height=512;const ctx=c.getContext('2d');
  ctx.fillStyle=style==='moonlight'?'#7f8b80':style==='blodflader'?'#e6d9c6':'#e7e3d5';ctx.fillRect(0,0,384,512);
  if(style==='moonlight'){
   const sky=ctx.createLinearGradient(0,0,0,512);sky.addColorStop(0,'#465c5d');sky.addColorStop(1,'#cad0b7');ctx.fillStyle=sky;ctx.fillRect(0,0,384,512);
   ctx.fillStyle='#e6ddbc';ctx.beginPath();ctx.arc(268,127,37,0,Math.PI*2);ctx.fill();
   for(let j=0;j<4;j++){ctx.fillStyle=['#a4ad94','#7e9686','#5a796f','#385b53'][j];ctx.beginPath();ctx.moveTo(0,310+j*48);for(let x=0;x<=384;x+=8)ctx.lineTo(x,280+j*48+Math.sin(x*.014+j)*38);ctx.lineTo(384,512);ctx.lineTo(0,512);ctx.fill();}
  }else{
   ctx.strokeStyle='#717a59';ctx.lineWidth=3;
   for(let stem=0;stem<3;stem++){const bx=120+stem*68;ctx.beginPath();ctx.moveTo(bx,445);ctx.bezierCurveTo(bx-30,330,bx+45,240,bx+index*25-10,95+stem*33);ctx.stroke();for(let n=0;n<5;n++){const x=bx+Math.sin(n+stem)*20,y=140+n*54;ctx.save();ctx.translate(x,y);ctx.rotate((n%2?1:-1)*.72);ctx.fillStyle=style==='blodflader'?(n%2?'#b1846c':'#c59879'):(n%2?'#8d9a75':'#6e805b');ctx.beginPath();ctx.ellipse((n%2?1:-1)*22,0,34,13,0,0,Math.PI*2);ctx.fill();ctx.restore();}}
  }
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;return mat('#ffffff',{map,roughness:1});
 }
 function buildItem(item,parent=furn){
  const g=new THREE.Group();g.userData.itemId=item.id;g.userData.type=item.type;g.userData.role=item.role;g.userData.zone=item.zone||'kitchen';g.position.set(item.x,item.elevation||0,item.z);g.rotation.y=item.rotation*Math.PI/180;parent.add(g);
  for(const p of parts({...item,x:0,z:0,rotation:0})){const pts=footprint(p);pts.push(pts[0]);const outline=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts.map(([x,z])=>new THREE.Vector3(x,item.h+.035,z))),new THREE.LineBasicMaterial({color:'#596052',depthTest:false,toneMapped:false,transparent:true,opacity:.85}));outline.userData.overallEdge=true;outline.visible=false;outline.renderOrder=4;g.add(outline);}
  const w=item.w,d=item.d,h=item.h,fabric=materialFor(item);
  if(buildKitchen(item,g,{box,cyl,mat,woodMat,metalMat}))return g;
  if(['sofa','woodsofa','chaise'].includes(item.type)){
   const timber=item.type==='woodsofa',base=timber?woodMat:fabric,arm=timber?.065:Math.min(.22,w*.09),seatH=Math.min(.44,h*.53),mainD=item.type==='chaise'?Math.min(.95,d):d,back=-d/2;
   box(w,.16,mainD,0,.23,back+mainD/2,base,g,.045);
   for(const x of [-w/2+.11,w/2-.11])for(const zz of [back+.10,back+mainD-.10])cyl(.028,.18,x,.09,zz,woodMat,g);
   const count=3,seatW=(w-arm*2-.04)/count;
   for(let i=0;i<count;i++){
    const x=-w/2+arm+.02+seatW*(i+.5);
    box(seatW-.014,.15,mainD-.20,x,seatH-.055,back+.12+(mainD-.20)/2,fabric,g,.055);
    const cushion=box(seatW-.02,h-seatH-.05,.17,x,seatH+(h-seatH)/2-.025,back+.12,fabric,g,.055);cushion.rotation.x=-.08;
   }
   for(const x of [-w/2+arm/2,w/2-arm/2])box(arm,h*.55,mainD,x,h*.4,back+mainD/2,base,g,timber?.018:.045);
   if(timber){for(const x of [-w/2+.04,w/2-.04])for(let z=back+.08;z<back+d-.04;z+=.065)box(.025,.25,.014,x,.57,z,woodMat,g,.005);}
   if(item.type==='chaise'){
    const cw=Math.min(.90,w*.34),cx=-w/2+cw/2;
    box(cw,.16,d-mainD+.12,cx,.23,back+mainD+(d-mainD)/2,base,g,.04);
    box(cw-arm-.02,.15,d-mainD+.12,cx+arm/2,seatH-.055,back+mainD+(d-mainD)/2,fabric,g,.05);
    for(const xx of [cx-cw/2+.1,cx+cw/2-.1])cyl(.028,.18,xx,.09,d/2-.1,woodMat,g);
   }
   const cushionMat=mat(item.type==='woodsofa'?'#7a8b67':'#b38c61',{normalMap:fabricNormal,normalScale:new THREE.Vector2(.15,.15)});
   const pillow=box(.34,.34,.13,w/2-arm-.21,seatH+.18,back+.29,cushionMat,g,.065);pillow.rotation.z=.15;
  }else if(item.type==='diningtable'){
   const pinntorp=(item.productId||item.referenceId)==='pinntorp-table',dark=(item.productId||item.referenceId)==='nasinge-table',frame=mat(pinntorp?'#e6e3d9':item.color,dark?{map:oak}:{}),topMat=pinntorp||dark?mat(item.color,{map:oak,roughness:.82}):frame;
   box(w,.028,d,0,h-.014,0,topMat,g,.012);
   for(const x of [-w/2+.075,w/2-.075])for(const z of [-d/2+.075,d/2-.075])box(.048,h-.028,.048,x,(h-.028)/2,z,frame,g,.007);
   for(const z of [-d/2+.06,d/2-.06])box(w-.12,.08,.025,0,h-.075,z,frame,g,.003);
   for(const x of [-w/2+.06,w/2-.06])box(.025,.08,d-.12,x,h-.075,0,frame,g,.003);
   if(w>1.7)for(const x of [-.30,.30])box(.002,.001,d-.02,x,h+.0005,0,mat('#c9c9bf'),g);
   const palette=schemePalettes[state?.scheme]||{runner:'#d2c8b0',accent:'#a88966'};
   box(w*.72,.004,d*.29,0,h+.003,0,mat(palette.runner,{map:weave}),g,.003);
   cyl(.045,.12,0,h+.065,0,mat(palette.accent),g);
   for(const x of [-w*.25,w*.25])for(const z of [-d*.31,d*.31]){
    cyl(.09,.007,x,h+.008,z,mat('#f0eadb'),g);cyl(.066,.006,x,h+.014,z,mat('#e5dfcf'),g);
    cyl(.025,.068,x+.12,h+.037,z,mat('#e4dcc9',{roughness:.35}),g);
    const handle=mesh(new THREE.TorusGeometry(.018,.004,5,14),mat('#e4dcc9'),x+.15,h+.042,z,g);handle.rotation.y=Math.PI/2;
   }
   const twig=mesh(new THREE.CylinderGeometry(.0015,.0015,.19,5),mat('#7f815d'),0,h+.20,0,g);twig.rotation.z=.2;
   for(let n=0;n<4;n++){const leaf=mesh(new THREE.SphereGeometry(1,10,6),mat('#7f8b68'),Math.sin(n*2)*.035,h+.17+n*.025,Math.cos(n*2)*.025,g);leaf.scale.set(.018,.035,.005);leaf.rotation.z=n*.9;}

  }else if(item.type==='diningchair'){
   const ref=item.productId||item.referenceId,plain=ref==='pinntorp-chair40',dark=ref==='nasinge-chair',seatH=plain?.45:.48,timber=mat(plain?'#bb9363':dark?'#60402e':'#cdb489',{map:oak,roughness:.8});
   box(w,.048,d*.86,0,seatH-.024,.01,plain?timber:mat('#c9c2b2',{normalMap:fabricNormal,normalScale:new THREE.Vector2(.08,.08)}),g,.035);
   for(const x of [-w*.36,w*.36])for(const z of [-d*.32,d*.32])box(.032,seatH-.048,.032,x,(seatH-.048)/2,z,timber,g,.007);
   for(const x of [-w*.36,w*.36])box(.025,h-seatH,.027,x,(h+seatH)/2,-d*.38,timber,g,.006);
   box(w,plain?.09:dark?.10:.17,.032,0,h-(plain?.045:dark?.05:.085),-d/2+.017,timber,g,.018);
   if(dark)for(let k=-2;k<=2;k++)box(.025,h-seatH-.13,.016,k*w*.135,seatH+(h-seatH-.13)/2,-d*.41,timber,g,.003);
  }else if(item.type==='cabinet'){
   const glazed=(item.productId||item.referenceId).startsWith('tonstad'),timber=mat(item.color,{map:item.productId==='tonstad-oak'?oak:null,roughness:.7}),rail=.035;
   box(w,.06,d,0,.03,0,timber,g,.003);box(w,.025,d,0,h-.0125,0,timber,g,.003);box(w,h,.012,0,h/2,-d/2+.006,timber,g);
   for(const x of [-w/2+.0125,w/2-.0125])box(.025,h,d,x,h/2,0,timber,g);
   for(const y of [h*.34,h*.66])box(w-.04,.018,d-.02,0,y,0,timber,g);
   if(glazed){
    const glass=mat('#b7ccc4',{transparent:true,opacity:.20,roughness:.18,metalness:.1,depthWrite:false});
    for(const x of [-w/4,w/4]){box(w/2-rail*2,h-.13,.006,x,h/2+.01,d/2-.018,glass,g);for(const xx of [x-w/4+rail/2,x+w/4-rail/2])box(rail,h-.09,.018,xx,h/2+.01,d/2-.005,timber,g);}
    for(const y of [.065,h-.03])box(w,rail,.025,0,y,d/2-.01,timber,g);
    for(const y of [.075,h*.34+.02,h*.66+.02]){for(let n=0;n<5;n++)cyl(.085,.007,-w*.20,y+n*.007,0,mat('#e7e0cf'),g);for(let k=0;k<3;k++)cyl(.027,.085,w*.10+k*.075,y+.043,0,mat('#cfddcf',{transparent:true,opacity:.7,roughness:.2}),g);}
   }else for(const side of [-1,1]){const x=side*w/4;box(w/2-.008,h-.07,.018,x,h/2,d/2-.009,timber,g,.003);box(w/2-.10,h-.17,.008,x,h/2,d/2+.003,mat('#ede9df'),g,.003);cyl(.01,.02,side*.035,h*.50,d/2+.012,timber,g);}
  }else if(item.type==='art'||item.type==='artset'){
   const pair=item.type==='artset',count=pair?2:1,pw=pair?(w-.03)/2:w,ref=item.productId||item.referenceId;
   for(let k=0;k<count;k++){const x=pair?(k===0?-1:1)*(pw/2+.015):0;
    box(pw,h,d,x,h/2,0,mat(ref==='moonlight'?'#5a604f':'#b9a184'),g,.003);
    box(pw-.022,h-.022,.003,x,h/2,d/2+.002,artMaterial(ref,k),g);
   }
  }else if(item.type==='tablelamp'){
   const m=mat(item.color,{roughness:.45}),r=w/2;
   cyl(w*.42,.012,0,.006,0,m,g);cyl(.010,h*.58,0,h*.29,0,m,g);
   const dome=mesh(new THREE.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI/2),m,0,h*.77,0,g);dome.scale.set(r,h*.23,r);
   cyl(r,h*.17,0,h*.685,0,mat('#f0eadb',{emissive:'#f3ce86',emissiveIntensity:.18}),g);
  }else if(item.type==='pendant'){
   const ref=item.productId||item.referenceId,cordTop=H-(item.elevation||0),cordMat=mat(ref==='skurup-pendant'?'#3b3a33':'#ddd5c2');
   cyl(.0025,Math.max(.01,cordTop-h),0,(cordTop+h)/2,0,cordMat,g);cyl(.045,.045,0,cordTop-.0225,0,cordMat,g);
   if(ref==='misterhult'){
    const bamboo=mat(item.color,{roughness:.9}),radius=y=>{const a=y/h;return w*(.44+.09*Math.sin(a*Math.PI)-.27*a*a);};
    for(const direction of [-1,1])for(let k=0;k<28;k++){const pts=[];for(let n=0;n<=20;n++){const y=n/20*h,a=k/28*Math.PI*2+direction*y*2.3;pts.push(new THREE.Vector3(Math.cos(a)*radius(y),y,Math.sin(a)*radius(y)));}mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.0018,4,false),bamboo,0,0,0,g);}
    for(let k=0;k<9;k++){const y=k/8*h,ring=mesh(new THREE.TorusGeometry(radius(y),.003,5,48),bamboo,0,y,0,g);ring.rotation.x=Math.PI/2;}
   }else if(ref==='skurup-pendant'){
    mesh(new THREE.LatheGeometry([[w/2,0],[w*.40,h*.15],[w*.25,h*.72],[w*.10,h]].map(v=>new THREE.Vector2(...v)),40),mat(item.color,{side:THREE.DoubleSide,roughness:.55}),0,0,0,g);
   }else{
    const dome=mesh(new THREE.SphereGeometry(1,40,16,0,Math.PI*2,0,Math.PI/2),mat(item.color,{roughness:.4}),0,h*.50,0,g);dome.scale.set(w/2,h*.50,w/2);
    cyl(w/2,h*.32,0,h*.34,0,mat('#efede4',{emissive:'#ffe2a4',emissiveIntensity:.1}),g);
   }
   const bulb=mesh(new THREE.SphereGeometry(.025,14,8),mat('#f6e6bf',{emissive:'#ffdda1',emissiveIntensity:.4}),0,h*.2,0,g);bulb.castShadow=false;
   const light=new THREE.PointLight('#ffe1a1',3,2.5,2);light.position.y=.02;g.add(light);
  }else if(item.type==='decor'){
   cyl(w*.34,h*.35,0,h*.175,0,mat('#b7906e'),g);cyl(w*.28,.01,0,h*.35,0,mat('#675c43'),g);
   for(let k=0;k<8;k++){const a=k*2.4,leaf=mesh(new THREE.SphereGeometry(1,10,7),mat(k%2?'#71855a':'#8b9b6c'),Math.sin(a)*w*.2,h*.5+k*h*.035,Math.cos(a)*d*.2,g);leaf.scale.set(.025,.08,.009);leaf.rotation.z=Math.sin(a)*.6;}
  }else if(item.type==='chair'){
   box(w*.78,.12,d*.62,0,.42,.06,fabric,g,.045);
   const b=box(w*.78,h-.43,.12,0,.43+(h-.43)/2,-d*.24,fabric,g,.05);b.rotation.x=-.15;
   for(const x of [-w*.44,w*.44]){
    box(.045,.06,d*.85,x,.60,0,woodMat,g,.018);
    const pts=[new THREE.Vector3(x,.05,d*.36),new THREE.Vector3(x,.07,-d*.34),new THREE.Vector3(x,.43,-d*.25),new THREE.Vector3(x,h*.9,-d*.37)];
    const curve=new THREE.CatmullRomCurve3(pts);mesh(new THREE.TubeGeometry(curve,20,.022,6,false),woodMat,0,0,0,g);
   }
  }else if(item.type==='table'){
   const top=cyl(.5,.035,0,h-.0175,0,woodMat,g);top.scale.set(w,1,d);
   for(let i=0;i<3;i++){const a=i/3*Math.PI*2;box(.035,h-.035,.035,Math.cos(a)*w*.32,(h-.035)/2,Math.sin(a)*d*.32,woodMat,g,.008);}
   cyl(.065,.045,-w*.15,h+.022,0,mat('#b18b6c'),g);box(.18,.018,.14,w*.1,h+.012,-d*.12,mat('#ded9bd'),g,.003);
  }else if(item.type==='rug'){
   box(w,h,d,0,h/2+.006,0,mat(item.color,{map:weave,normalMap:fabricNormal,normalScale:new THREE.Vector2(.25,.25)}),g,.008);
   for(const z of [-d/2+.04,d/2-.04])box(w-.05,.003,.025,0,h+.008,z,mat('#9e9479'),g);
  }else if(item.type==='console'){
   const m=mat(item.color);box(w,.025,d,0,h-.0125,0,m,g);box(w,.025,d,0,.0125,0,m,g);box(w,h,.02,0,h/2,-d/2+.01,m,g);
   for(const x of [-w/2+.0125,-w/6,w/6,w/2-.0125])box(.025,h,d,x,h/2,0,m,g);

  }else if(item.type==='tv'){
   const stand=item.mount==='stand',bodyH=stand?.826:h,bodyD=stand?.0451:d,footH=stand?h-bodyH:0,bodyZ=stand?-.065:0;
   const bezel=mat('#18201d',{roughness:.35,metalness:.4}),display=mat('#273f38',{roughness:.28,metalness:.2,emissive:'#14251e',emissiveIntensity:.12});
   box(w,bodyH,bodyD,0,footH+bodyH/2,bodyZ,bezel,g,.004);
   box(w-.012,bodyH-.012,.0015,0,footH+bodyH/2,bodyZ+bodyD/2-.001,display,g,.002);
   if(stand){box(.47,.018,.23,0,.009,0,metalMat,g,.005);box(.20,footH,.04,0,footH/2,-.065,metalMat,g);}
   else box(.25,.18,.035,0,bodyH*.40,-bodyD/2-.0175,metalMat,g);
  }else if(item.type==='screen'){
   const timber=mat(item.color,{map:oak,roughness:.8}),rail=.045;
   for(const x of [-w/2+rail/2,w/2-rail/2])box(rail,h,d,x,h/2,0,timber,g,.005);
   for(const y of [rail/2,h-rail/2])box(w,rail,d,0,y,0,timber,g,.005);
   const count=Math.max(4,Math.round((w-rail*2)/.075)),spacing=(w-rail*2)/(count+1);
   for(let i=1;i<=count;i++)box(.025,h-rail*2,d*.65,-w/2+rail+i*spacing,h/2,0,timber,g,.003);
  }else if(item.type==='sidetable'){
   box(w,.025,d,0,h-.0125,0,woodMat,g,.012);box(w,.018,d,0,.009,0,metalMat,g,.006);box(.025,h,d, -w/2+.015,h/2,0,metalMat,g,.006);
  }else if(item.type==='soundbar'){
   box(w,h,d,0,h/2,0,metalMat,g,.018);
  }else if(item.type==='ottoman'){
   box(w,h*.75,d,0,h*.57,0,fabric,g,.10);for(const x of [-w*.32,w*.32])for(const z of [-d*.32,d*.32])cyl(.025,h*.2,x,h*.1,z,woodMat,g);
  }else if(item.type==='lamp'){
   if((item.productId||item.referenceId)==='ringsta'){
    // Published shade and base sizes; simplified pole and shade supports.
    const nickel=mat('#bfc0ba',{roughness:.28,metalness:.85}),shadeH=h*(.31/1.53);
    cyl(w*(.29/.42)/2,.022,0,.011,0,nickel,g);
    cyl(.008,h-shadeH*.65,0,(h-shadeH*.65)/2,0,nickel,g);
    mesh(new THREE.CylinderGeometry(w/2,w/2,shadeH,48,1,true),mat(item.color,{side:THREE.DoubleSide,roughness:1}),0,h-shadeH/2,0,g);
    const ring=new THREE.TorusGeometry(w/2,.002,4,48);
    for(const y of [h-shadeH,h]){const edge=mesh(ring.clone(),mat(item.color),0,y,0,g);edge.rotation.x=Math.PI/2;}ring.dispose();
   }else{
    cyl(w*.27,.03,0,.015,0,metalMat,g);cyl(.012,h*.83,0,h*.42,0,metalMat,g);
    mesh(new THREE.CylinderGeometry(w*.30,w*.5,h*.23,32,1,true),mat(item.color,{side:THREE.DoubleSide}),0,h*.875,0,g);
   }
  }
  return g;
 }
 function dispose(group){group.traverse(o=>{o.userData.overallMaterial?.dispose();if(o.geometry)o.geometry.dispose();if(o.material){const mm=Array.isArray(o.material)?o.material:[o.material];for(const m of mm)if(![woodMat,metalMat].includes(m)){if(m.map&&m.map.isCanvasTexture)m.map.dispose();m.dispose();}}});}
 function rebuild(items,selection){for(const g of [...furn.children]){furn.remove(g);dispose(g);}if(boxHelper){scene.remove(boxHelper);boxHelper.geometry.dispose();boxHelper.material.dispose();boxHelper=null;}selected=selection;for(const item of items)buildItem(item);highlight();dirty=true;}
 function highlight(){if(boxHelper){scene.remove(boxHelper);boxHelper.geometry.dispose();boxHelper.material.dispose();boxHelper=null;}const g=furn.children.find(g=>g.userData.itemId===selected);if(g){boxHelper=new THREE.BoxHelper(g,0x708760);boxHelper.material.depthTest=false;boxHelper.material.transparent=true;boxHelper.material.opacity=.75;scene.add(boxHelper);}dirty=true;}
 function planStyle(enabled){
  for(const group of [...furn.children,...context.children])group.traverse(o=>{
   if(o.userData.overallEdge){o.visible=enabled;return;}if(!o.isMesh)return;
   if(enabled&&!o.userData.overallMaterial){
    const original=Array.isArray(o.material)?o.material[0]:o.material;
    o.userData.overallOriginalMaterial=o.material;
    const colour=(original.color||new THREE.Color('#d8d4c9')).clone().lerp(new THREE.Color('#ffffff'),.84);
    o.userData.overallMaterial=new THREE.MeshBasicMaterial({color:colour,toneMapped:false});
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,40),new THREE.LineBasicMaterial({color:'#73796c',toneMapped:false,transparent:true,opacity:.8}));
    edges.userData.overallEdge=true;o.add(edges);
   }
   if(o.userData.overallOriginalMaterial)o.material=enabled?o.userData.overallMaterial:o.userData.overallOriginalMaterial;
   for(const child of o.children)if(child.userData.overallEdge)child.visible=enabled;
  });
 }
 function activeCamera(){return ['plan','overall'].includes(view)?planCamera:camera;}
 function updateCamera(){
  if(view==='overall'){const aspect=W/HH,height=Math.max(14.3,14.5/aspect)/planZoom;planCamera.left=-height*aspect/2;planCamera.right=height*aspect/2;planCamera.top=height/2;planCamera.bottom=-height/2;planCamera.position.set(6.3754,25,4.5974);planCamera.lookAt(6.3754,0,4.5974);planCamera.updateProjectionMatrix();}
  else if(view==='plan'){const aspect=W/HH,baseHeight=room==='kitchen'?(kitchenFocus==='both'?5.8:kitchenFocus==='utility'?3.5:4.2):room==='dining'?7.6:6.8,minWidth=room==='kitchen'?(kitchenFocus==='utility'?3.4:4.8):room==='dining'?5.2:4.4,height=Math.max(baseHeight,minWidth/aspect)/planZoom;planCamera.left=-height*aspect/2;planCamera.right=height*aspect/2;planCamera.top=height/2;planCamera.bottom=-height/2;const px=room==='kitchen'?(kitchenFocus==='utility'?3.01:3.73):room==='dining'?5.1:1.65,pz=room==='kitchen'?(kitchenFocus==='utility'?10.01:kitchenFocus==='kitchen'?7.54:8.52):room==='dining'?4.95:3.85;planCamera.position.set(px,20,pz);planCamera.lookAt(px,0,pz);planCamera.updateProjectionMatrix();}
  else if(view==='eye'){camera.fov=65;const eyeX=room==='kitchen'?(kitchenFocus==='utility'?3.12:3.25):room==='dining'?3.78:.78,eyeZ=room==='kitchen'?(kitchenFocus==='utility'?9.30:6.40):room==='dining'?5.85:5.84;camera.position.set(eyeX,1.60,eyeZ);const look=new THREE.Vector3(eyeX+Math.sin(theta)*3,1.6+Math.cos(phi)*2,eyeZ-Math.cos(theta)*3);camera.lookAt(look);camera.updateProjectionMatrix();}
  else{camera.fov=40;camera.position.set(target.x+radius*Math.sin(phi)*Math.sin(theta),target.y+radius*Math.cos(phi),target.z+radius*Math.sin(phi)*Math.cos(theta));camera.lookAt(target);camera.updateProjectionMatrix();}
  const isOverall=view==='overall';planStyle(isOverall);ground.visible=!isOverall;scene.background.set(isOverall?'#fbfaf6':'#ecece2');overall.visible=isOverall;shell.visible=!isOverall;for(const g of [...furn.children,...context.children])g.visible=isOverall?!(['pendant',...raisedKitchen].includes(g.userData.type)&&g.userData.role!=='moprack'):!(view==='plan'&&(['pendant',...raisedKitchen].includes(g.userData.type)&&g.userData.role!=='moprack'))&&!(room==='kitchen'&&kitchenFocus==='utility'&&g.userData.zone!=='utility')&&!(room==='kitchen'&&kitchenFocus==='kitchen'&&g.userData.zone==='utility');context.visible=isOverall||room!=='kitchen'||kitchenFocus==='both';if(boxHelper)boxHelper.visible=!isOverall;camera.aspect=W/HH;camera.updateProjectionMatrix();sun.castShadow=!['plan','overall'].includes(view);renderer.shadowMap.enabled=sun.castShadow;utilityLintel.visible=room!=='kitchen'||view==='eye';for(const wall of walls){const cookingWall=room==='kitchen'&&state?.appliancePlan&&Math.abs(wall.g.position.x-5.842)<.001&&Math.abs(wall.g.position.z-7.5438)<.001;wall.g.scale.y=view==='eye'?1:(wall.cut||cookingWall)?.065:1;}document.querySelector('.compass').style.visibility=isOverall?'hidden':room==='kitchen'&&state?.appliancePlan&&view!=='plan'?'hidden':'visible';
  guides.visible=room==='living'&&showDimensions&&!['eye','overall'].includes(view);diningGuides.visible=room==='dining'&&showDimensions&&!['eye','overall'].includes(view);chairGuides.visible=(room==='dining'||room==='kitchen'&&state?.utilityPlan)&&showDimensions&&!['eye','overall'].includes(view);dirty=true;
 }
 function reset(){if(view==='overall'){planZoom=1;updateCamera();return;}if(room==='kitchen'){target.set(kitchenFocus==='utility'?3.01:3.73,.65,kitchenFocus==='utility'?10.01:kitchenFocus==='kitchen'?7.54:8.52);theta=view==='eye'?Math.PI:state?.utilityPlan&&kitchenFocus==='utility'?2.8:state?.appliancePlan?2.6:-.55;phi=view==='eye'?1.7:.65;radius=kitchenFocus==='both'?9.4:kitchenFocus==='utility'?5.5:7;planZoom=1;updateCamera();return;}target.set(room==='dining'?5.15:1.68,room==='dining'?.75:.35,room==='dining'?4.85:3.9);theta=view==='eye'?(room==='dining'?1.2:.24):(room==='dining'?.24:-.72);phi=view==='eye'?1.80:.72;radius=room==='dining'?7.0:8.3;planZoom=1;updateCamera();}
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
 function point(e){const r=canvas.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,activeCamera());return ray.ray.intersectPlane(plane,hit)?hit.clone():null;}
 function hitItem(e){if(view==='overall')return null;point(e);for(const hit of ray.intersectObjects(furn.children,true)){let o=hit.object;while(o&&!o.userData.itemId)o=o.parent;if(o&&o.visible)return o.userData.itemId;}return null;}
 let gesture=null;const pointers=new Map();
 canvas.addEventListener('pointerdown',e=>{if(e.button>0)return;canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const a=[...pointers.values()];gesture={type:'pinch',dist:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])};return;}const id=hitItem(e),p=point(e);if(id){select(id);const item=state.items.find(i=>i.id===id);if(view!=='eye'&&p)gesture={type:'move',id,startX:e.clientX,startY:e.clientY,offsetX:item.x-p.x,offsetZ:item.z-p.z,changed:false};}else{if(view!=='overall')select(null);gesture={type:'orbit',x:e.clientX,y:e.clientY};}});
 canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(gesture?.type==='pinch'&&pointers.size===2){const a=[...pointers.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);zoom((gesture.dist-d)*.007);gesture.dist=d;return;}if(!gesture)return;
  if(gesture.type==='move'){if(Math.hypot(e.clientX-gesture.startX,e.clientY-gesture.startY)<4&&!gesture.changed)return;const p=point(e);if(p){if(!gesture.changed)commit('before');gesture.changed=true;const x=Math.round((p.x+gesture.offsetX)*20)/20,z=Math.round((p.z+gesture.offsetZ)*20)/20;move(gesture.id,Math.max(room==='kitchen'?1:room==='dining'?2.5:-1,Math.min(room==='kitchen'?6.5:room==='dining'?8.5:4.5,x)),Math.max(room==='kitchen'?5.5:.5,Math.min(room==='kitchen'?11.8:8,z)),false);canvas.classList.add('moving');}}
  else if(gesture.type==='orbit'&&!['plan','overall'].includes(view)){theta+=(e.clientX-gesture.x)*.007;phi=THREE.MathUtils.clamp(phi+(e.clientY-gesture.y)*.006,view==='eye'?1.05:.22,view==='eye'?2.2:1.3);gesture.x=e.clientX;gesture.y=e.clientY;updateCamera();}
 });
 function end(e){pointers.delete(e.pointerId);if(gesture?.type==='move'&&gesture.changed)commit('after');if(pointers.size===0)gesture=null;canvas.classList.remove('moving');}
 canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 function zoom(amount){if(['plan','overall'].includes(view))planZoom=THREE.MathUtils.clamp(planZoom*Math.exp(-amount),.65,2.5);else if(view==='cutaway')radius=THREE.MathUtils.clamp(radius*Math.exp(amount),4,13);updateCamera();}
 canvas.addEventListener('wheel',e=>{if(view==='eye')return;e.preventDefault();zoom(e.deltaY*.001);},{passive:false});
 canvas.addEventListener('keydown',e=>{if(!selected||['eye','overall'].includes(view))return;const item=state.items.find(i=>i.id===selected);let dx=0,dz=0;if(e.key==='ArrowLeft')dx=-.05;if(e.key==='ArrowRight')dx=.05;if(e.key==='ArrowUp')dz=-.05;if(e.key==='ArrowDown')dz=.05;if(dx||dz){e.preventDefault();commit('before');move(selected,item.x+dx,item.z+dz,true);}});
 function labelRender(){labels.replaceChildren();if(!showDimensions||view==='eye')return;if(view==='overall'){const cam=activeCamera();for(const label of overallLabels){const p=new THREE.Vector3(label.x,.03,label.z).project(cam);if(Math.abs(p.x)>1||Math.abs(p.y)>1)continue;const el=document.createElement('span');el.className='scene-label overall-room-label';const title=document.createElement('strong'),size=document.createElement('small');title.textContent=label.text;size.textContent=label.size;el.append(title,size);el.style.left=(p.x*.5+.5)*W+'px';el.style.top=(-p.y*.5+.5)*HH+'px';labels.append(el);}return;}const defs=[...(room==='kitchen'?kitchenLabels.filter(l=>kitchenFocus==='kitchen'?!l.text.startsWith('UTILITY'):kitchenFocus==='utility'?!l.text.startsWith('KITCHEN'):true):room==='dining'?diningLabels:labelDefs)];if(room==='kitchen'&&state.appliancePlan&&view==='plan'&&kitchenFocus!=='utility'){for(const [role,text] of [['fridge','Fridge bay · 90 cm'],['oventower','Oven + separate microwave'],['appliancestation','Mixer · juicer · coffee'],['hob','Cooktop · utility-facing wall']]){const i=state.items.find(i=>i.role===role);if(i)defs.push({text,p:new THREE.Vector3(i.x,i.h+.06,i.z)});}const prep=state.items.find(i=>i.name.startsWith('Keep clear'));if(prep)defs.push({text:'90 cm clear prep',p:new THREE.Vector3(prep.x,prep.h+.06,prep.z)});}if(room==='kitchen'&&state.utilityPlan&&view==='plan'&&kitchenFocus!=='kitchen'){for(const [role,text] of [['laundrystack','Washer + dryer stack'],['dishwasher','Dishwasher'],['utilitysinkbin','Sink + pull-out bin'],['moprack','Mop · broom · dustpan']]){const i=state.items.find(i=>i.role===role);if(i)defs.push({text,p:new THREE.Vector3(i.x,(i.elevation||0)+i.h+.04,i.z)});}defs.push({text:'Dashed: 60 cm opening study',p:new THREE.Vector3(3.10,.04,10.98)});}if(selected){const item=state.items.find(i=>i.id===selected);if(item)defs.push({text:`${item.name} · ${Math.round(item.w*100)} × ${Math.round(item.d*100)} cm`,p:new THREE.Vector3(item.x,(item.elevation||0)+item.h+.15,item.z),object:true});}const cam=activeCamera();for(const label of defs){const p=label.p.clone().project(cam);if(p.z>1||p.z< -1||Math.abs(p.x)>1||Math.abs(p.y)>1)continue;const el=document.createElement('span');el.className='scene-label'+(label.object?' object':'');el.textContent=label.text;el.style.left=(p.x*.5+.5)*W+'px';el.style.top=(-p.y*.5+.5)*HH+'px';labels.append(el);}}
 function resize(){const rect=canvas.parentElement.getBoundingClientRect();W=Math.max(10,rect.width);HH=Math.max(10,rect.height);renderer.setSize(W,HH,false);updateCamera();}
 new ResizeObserver(resize).observe(canvas.parentElement);
 function render(){frame=requestAnimationFrame(render);if(!dirty)return;renderer.render(scene,activeCamera());labelRender();dirty=false;}
 render();resize();
 return {update(layout,selection,contextItems=[],contextScheme=null){planStyle(false);const changed=room!==roomOf(layout);room=roomOf(layout);state=layout;hemi.intensity=room==='kitchen'?1.8:2.4;sun.intensity=room==='kitchen'?2.3:3;renderer.toneMappingExposure=room==='kitchen'?1:1.1;diningWallMat.color.set(schemePalettes[layout.scheme||contextScheme]?.wall||'#eee9da');rebuild(layout.items,selection);for(const g of [...context.children]){context.remove(g);dispose(g);}for(const i of contextItems)buildItem(i,context);for(const g of [...chairGuides.children]){chairGuides.remove(g);g.geometry.dispose();g.material.dispose();}if(room==='dining')for(const i of layout.items.filter(i=>i.type==='diningchair')){const pts=footprint(pulledChair(i));pts.push(pts[0]);const l=line(pts.map(([x,z])=>[x,.035,z]),'#b29164',true);chairGuides.add(l);}if(room==='dining')for(const cab of layout.items.filter(i=>i.type==='cabinet')){const pts=footprint(cabinetAccess(cab));pts.push(pts[0]);const l=line(pts.map(([x,z])=>[x,.037,z]),'#aa9272',true);chairGuides.add(l);}if(room==='kitchen'&&layout.utilityPlan)for(const host of layout.items.filter(i=>['laundrystack','dishwasher'].includes(i.role))){const pts=footprint(cabinetAccess(host));pts.push(pts[0]);const outline=line(pts.map(([x,z])=>[x,.035,z]),'#9a7551',true);outline.material.opacity=.9;chairGuides.add(outline);}if(changed)reset();updateCamera();},focus(v){kitchenFocus=v;reset();},setView(v){view=v;reset();canvas.style.cursor=v==='eye'?'grab':'grab';document.querySelector('#scene-help').textContent=v==='overall'?'Whole apartment · Scroll to zoom · Open a room above to edit':v==='plan'?'Select furniture, then drag · Arrow keys nudge 5 cm':v==='eye'?'Standing at 1.60 m · Drag to look around':innerWidth<=760?'Drag furniture to move · Drag background to orbit · Pinch to zoom':'Drag furniture to move · Drag empty space to orbit · Scroll to zoom';},select(id){selected=id;highlight();},move(id,x,z){const g=furn.children.find(g=>g.userData.itemId===id);if(g){g.position.set(x,g.position.y,z);boxHelper?.update();dirty=true;}},dimensions(v){showDimensions=v;updateCamera();},reset,zoom,diagnostics(){return {view,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,objects:furn.children.length,flooring:{type:'tile',sizeCm:flooring.tile.sizeCm,colour:flooring.tile.colour,finishConfirmed:false},ready:pending===0}},screenshot(){dirty=true;renderer.render(scene,activeCamera());return renderer.domElement.toDataURL('image/png')}};
}
