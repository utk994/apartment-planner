import {products} from './data.js';
export const diningBounds={x0:3.556,x1:7.62,z0:3.556,z1:6.1976};
export const roomInfo={kitchen:{name:'Kitchen + utility',size:'13′2″ × 8′10″ + 8′5″ × 6′0″',index:'03',x0:1.7272,z0:6.1976},living:{name:'Living room',size:'11′ × 14′3″',index:'01',x0:0,z0:1.7272},dining:{name:'Dining area',size:'13′4″ × 8′8″',index:'02',x0:3.556,z0:3.556}};
export const roomOf=l=>['dining','kitchen'].includes(l?.room)?l.room:'living';
export function pulledChair(i){const a=i.rotation*Math.PI/180;return {...i,x:i.x-.35*Math.sin(a),z:i.z-.35*Math.cos(a)};}
export function seedDining(state){
 if(state.layouts.some(l=>l.room==='dining'))return;
 const piece=(id,x,z,rotation=0)=>{const p=products.find(p=>p.id===id);return {...structuredClone(p),id:crypto.randomUUID(),productId:id,referenceId:id,locked:true,category:'furniture',x,z,rotation};};
 const daily=(id)=>{
  const p=products.find(p=>p.id===id),x=5.25,z=4.43,offset=p.d/2+.51/2+.025;
  return [piece(id,x,z,90),...[-1,1].flatMap(side=>[-.31,.31].map(dz=>piece('lisabo-dining',x+side*offset,z+dz,side===-1?90:-90)))];
 };
 const dailyDescription='Four chairs along the long sides preserve the southern route. Dashed outlines test 35 cm of chair pull-back.';
 const choices=[
  {id:'dining-flex',name:'01 · Four now, six later',subtitle:'VIHALS 120 × 74 cm · four seats',heroImage:'vihals-table.jpg',description:'An extendable white table with ash upholstered chairs, following the lounge palette. '+dailyDescription,items:daily('vihals-table')},
  {id:'dining-timber',name:'02 · Warm timber four',subtitle:'PINNTORP 125 × 75 cm · fixed size',heroImage:'pinntorp-table.jpg',description:'A pine top and pale frame with ash upholstered chairs. Fixed size for four; it does not expand to six. '+dailyDescription,items:daily('pinntorp-table')},
  {id:'dining-guests',name:'03 · Six for an evening',subtitle:'Same VIHALS at 180 cm · guest mode',heroImage:'vihals-table.jpg',description:'The same table extended lengthways, with three chairs on each long side. The southern passage is about 82 cm, short of our 90 cm guide. The north end is only 2 cm off the wall; confirm site fit and leg / knee space. Extra-chair storage is still undecided. A tight guest study, not a final six-seat arrangement.',items:[piece('vihals-extended',5.25,4.476,90),...[-1,1].flatMap(side=>[-.58,0,.58].map(dz=>piece('lisabo-dining',5.25+side*(.37+.255+.025),4.476+dz,side===-1?90:-90)))]}
 ];
 for(const l of choices)state.layouts.push({...l,room:'dining',project:'md'});
 for(const id of ['vihals-table','pinntorp-table','lisabo-dining'])if(!state.shortlist.some(s=>s.id===id))state.shortlist.push({id,status:'Considering',note:id==='lisabo-dining'?'Four daily; two extra chairs only in the guest study. Extra-chair storage to decide.':''});
}
