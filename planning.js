import {seedBreakfastReturn} from './breakfast-return.js';
import {seedUtilityPlan} from './utility-plan.js';
import {seedKitchenFinishes} from './kitchen-finishes.js';
import {seedAppliancePlan} from './appliance-plan.js';
import {seedKitchen} from './kitchen.js';
import {seedSchemes} from './schemes.js';
import {seedDining,roomOf} from './dining.js';
import {electronicsProducts,templates} from './data.js';
export const passageOptions=[
 {id:'clear',name:'Clear passage',label:'My recommendation',description:'Remove the ottoman and use the chaise as the footrest. The simplest option, with fewer things to move.'},
 {id:'pouf',name:'Compact movable pouf',label:'Extra occasional seat',description:'Try a 45 cm pouf beside the coffee-table zone. Park it out of the dining route; it can move when guests visit.'},
 {id:'ctable',name:'Slim C-table',label:'For a drink or laptop',description:'Replace the ottoman with a 35 × 45 cm side table beside the seat. The chaise remains the footrest.'}
];
export function passageLayout(state,mode){
 const existing=state.layouts.find(l=>l.id==='lounge-'+mode);if(existing)return existing;
 const base=state.layouts.find(l=>l.id==='lounge')||state.layouts.find(l=>l.id===state.active);
 const l=structuredClone(base),option=passageOptions.find(o=>o.id===mode);
 l.id='lounge-'+mode;l.name='Lounge · '+option.name.toLowerCase();l.sourceLayout=base.id;l.passageOption=mode;
 l.description=option.description+' A short open timber jali separates the sofa from dining and stops before the circulation zone.';
 l.items=l.items.filter(i=>!['ottoman','screen'].includes(i.type));
 // The saved original remains untouched; this variation brings the bench fully inside the wall line.
 const console=l.items.find(i=>i.type==='console');if(console&&console.x<.20)console.x=.22;
 const jali=templates.find(t=>t.id==='jali-study');
 l.items.push({...structuredClone(jali),id:crypto.randomUUID(),productId:null,referenceId:jali.id,locked:false,price:null,x:3.4544,z:4.281,rotation:90});
 if(mode==='pouf')l.items.push({id:crypto.randomUUID(),name:'45 cm movable pouf study',type:'ottoman',w:.45,d:.45,h:.40,color:'#a27d60',x:1.43,z:4.48,rotation:0,locked:false,price:null});
 if(mode==='ctable')l.items.push({id:crypto.randomUUID(),name:'Slim C-table study',type:'sidetable',w:.35,d:.45,h:.60,color:'#a88158',x:1.78,z:4.48,rotation:0,locked:false,price:null});
 state.layouts.push(l);return l;
}
export function upgradeWorkspace(state){
 if((state.revision||1)<3){
  state.electronics??=[{id:'lg-c5-65',status:'Size reference',note:'65-inch size reference requested. Wall mounting is a reversible study; purchase not finalised.'}];
  const tv=electronicsProducts[0];
  for(const l of state.layouts){
   const bench=l.items.find(i=>i.type==='console');
   if(bench&&!l.items.some(i=>i.type==='tv'))l.items.push({...structuredClone(tv),id:crypto.randomUUID(),productId:tv.id,referenceId:tv.id,locked:true,x:.10,z:bench.z,rotation:90});
  }
  const clear=passageLayout(state,'clear');state.active=clear.id;state.selected=null;state.finalised=false;state.revision=3;
 }
 if((state.revision||1)<4){
  const placed=state.layouts.find(l=>l.id===state.active)?.items.find(i=>i.type==='screen')||state.layouts.flatMap(l=>l.items).find(i=>i.type==='screen');
  state.customFurniture??=[{id:'living-jali',name:'Living–dining timber jali',referenceId:'jali-study',room:'Living / dining',w:placed?.w||1.45,d:placed?.d||.08,h:placed?.h||2.10,status:'Concept',material:'Timber frame and open vertical timber slats; timber species to confirm.',finish:'Warm timber finish study; stain and sheen to confirm.',design:'Short open screen behind the exposed sofa back, stopping before the foyer-to-dining passage. Slat width and spacing to be developed.',fixing:'Fitted to the adjoining wall and floor; final fixing details to be developed with the maker.',supplier:'',quote:null,notes:'Provisional planning dimensions. Confirm site measurements, material, slat spacing, finish and fixing details before making.'}];
  state.revision=4;
 }
 if((state.revision||1)<5){
  for(const l of state.layouts)l.room??='living';
  state.rooms??={};state.rooms.living??={note:state.roomNote,finalised:state.finalised,lastLayout:state.active};
  state.rooms.dining??={note:'Four people daily, six occasionally. Compare the extendable table at both sizes. Keep the living-to-bedroom and kitchen route usable. Door positions are estimates until site measurement.',finalised:false,lastLayout:'dining-flex'};
  seedDining(state);state.revision=5;
 }
 if((state.revision||1)<6){seedSchemes(state);if(['dining-flex','dining-timber','dining-guests'].includes(state.rooms?.dining?.lastLayout))state.rooms.dining.lastLayout='dining-quiet';if(['dining-flex','dining-timber','dining-guests'].includes(state.active)){state.active='dining-quiet';state.selected=null;}state.revision=6;}
 if((state.revision||1)<7){seedKitchen(state);state.revision=7;}
 if((state.revision||1)<8){seedAppliancePlan(state);state.revision=8;}
 if((state.revision||1)<9){seedKitchenFinishes(state);state.revision=9;}
 if((state.revision||1)<10){seedUtilityPlan(state);state.revision=10;}
 if((state.revision||1)<11){seedBreakfastReturn(state);state.revision=11;}
 return state;
}
