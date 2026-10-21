import * as THREE from 'three';
import {rooms,WALL as T,DOOR} from './plan.js';
// The original apartment shell, in the same metre coordinates as the room editor.
// Walls are sectioned at 1.2 m; unplanned rooms contain no invented furniture.
export function createOverallPlan(floorMaterial){
 const group=new THREE.Group(),ink=new THREE.MeshBasicMaterial({color:'#454b43'}),paper=new THREE.MeshBasicMaterial({color:'#e7e2d7'}),doorMat=new THREE.LineBasicMaterial({color:'#89917f'});
 function box(w,h,d,x,y,z,material=ink){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);group.add(m);return m;}
 for(const r of rooms)box(r.w,.08,r.d,r.x+r.w/2,-.04,r.z+r.d/2,r.id==='master'?paper:floorMaterial);
 for(const [x,z,w,d] of [[7.62,5.2832,1.80,.9144],[7.6454,3.3528,1.5494,1.7272],[1.524,5.82,2.032,.3776],[1.7272,6.07,4.0132,.1276],[3.3528,3.556,.2032,2.6416]])box(w,.08,d,x+w/2,-.04,z+d/2,floorMaterial);
 function wall(axis,c,a,b,{sill=0}={}){if(b-a<.001)return;const h=sill||1.2;return axis==='x'?box(T,h,b-a,c,h/2,(a+b)/2):box(b-a,h,T,(a+b)/2,h/2,c);}
 function opening(axis,c,a,b,start,width,sill=0){wall(axis,c,a,start);wall(axis,c,start+width,b);if(sill)wall(axis,c,start,start+width,{sill});}
 function door(axis,c,start,width,hingeEnd=false,angle=Math.PI/2){const hinge=start+(hingeEnd?width:0),sign=hingeEnd?-1:1;const pts=[];for(let i=0;i<=24;i++){const a=angle*i/24,u=hinge+sign*width*Math.cos(a),v=c+width*Math.sin(a);pts.push(new THREE.Vector3(axis==='z'?u:v,.025,axis==='z'?v:u));}const hingeP=new THREE.Vector3(axis==='z'?hinge:c,.025,axis==='z'?c:hinge);const geo=new THREE.BufferGeometry().setFromPoints([hingeP,pts.at(-1),...pts.slice().reverse()]);group.add(new THREE.Line(geo,doorMat));}
 opening('x',-T/2,-T/2,8.9154,7.8138,1);wall('z',8.9154,-T/2,1.6256);wall('x',1.6256,6.0706,8.9916);door('x',0,7.8138,1,true,-Math.PI/2);
 opening('z',1.6256,-T/2,3.4544,.38,2.23);box(2.23,.025,.055,1.495,.015,1.6256,paper);
 wall('x',3.4544,-T/2,3.4544);wall('x',-T/2,-T/2,1.6256);wall('z',-T/2,-T/2,3.4544);
 opening('z',-T/2,3.4544,7.5438,4.52,1.75,.85);
 opening('z',3.4544,3.4544,7.5438,7.4422-DOOR,DOOR);door('z',3.4544,7.4422-DOOR,DOOR,true);
 wall('x',7.5438,-T/2,5.1816);
 opening('z',-T/2,7.5438,12.0904,8.40,2.35);wall('x',7.5438,-1.8288,-T/2);wall('x',10.795,-1.8288,-T/2);wall('z',-1.8288,7.5438,10.795);wall('x',12.0904,-T/2,5.1816);
 opening('z',3.4544,9.2964,12.0904,10.35,DOOR);door('z',3.4544,10.35,DOOR,false,-Math.PI/2);wall('x',9.2964,3.4544,5.1816);
 opening('z',5.1816,7.5438,9.2964,9.1948-DOOR,DOOR);door('z',5.1816,9.1948-DOOR,DOOR,true);wall('z',5.1816,9.2964,12.0904);
 wall('x',5.842,6.096,8.9916);opening('z',6.096,5.842,7.5692,5.9436,DOOR);door('z',6.096,5.9436,DOOR,false,-Math.PI/2);wall('x',7.5692,6.096,8.89);wall('z',6.096,7.5692,9.2964);
 opening('x',9.2964,6.096,8.89,6.40,DOOR);door('x',9.2964,6.40,DOOR,false,-Math.PI/2);wall('z',8.89,5.842,9.2964);
 opening('z',8.9916,1.6256,5.842,2.60,1.05);wall('x',1.6256,8.9916,11.0236);wall('x',4.3942,8.9916,11.0236);opening('z',11.0236,1.6256,4.3942,2.15,1.55,.8);
 opening('z',5.1816,9.2964,12.8524,9.398,DOOR);door('z',5.1816,9.398,DOOR);wall('x',12.8524,5.1816,9.0424);wall('x',9.2964,8.89,9.0424);opening('z',9.0424,9.2964,12.8524,10.75,1.60,.8);
 return group;
}
export const overallLabels=rooms.map(r=>({text:r.name,size:r.size,x:r.x+r.w/2,z:r.z+r.d/2,id:r.id}));
