import {products} from './data.js';

export const schemePalettes={
 sunlit:{wall:'#e9dfcf',runner:'#c2a27c',accent:'#a26f4f',label:'Pine · bamboo · botanicals',swatches:['#bd9769','#e8dfcf','#9b9d78']},
 quiet:{wall:'#ecece3',runner:'#b7b5a2',accent:'#858f76',label:'Ivory · ash · soft florals',swatches:['#e6e3d8','#c7b28e','#9b9f8b']},
 evening:{wall:'#d9dece',runner:'#b7a181',accent:'#7c573b',label:'Brown wood · sage · black',swatches:['#694c37','#d6dccb','#343731']}
};
const piece=(id,x,z,rotation=0,elevation=0)=>{const p=products.find(p=>p.id===id);return {...structuredClone(p),id:crypto.randomUUID(),productId:id,referenceId:id,locked:true,category:'furniture',x,z,rotation,elevation};};
const plant=(x,z,elevation)=>({id:crypto.randomUUID(),name:'Herbs & ceramic pot · styling study',brand:'Size study',room:'dining',type:'decor',w:.18,d:.18,h:.34,x,z,elevation,rotation:0,color:'#9aab83',price:null,url:'',verified:false,locked:false,detail:'Small potted herb / plant on the cupboard. Pot and plant are visual studies, not a sourced purchase. Crockery, runner, vase, bulbs, electrical work and paint remain outside the product subtotal.'});
export function seedSchemes(state){
 if(state.layouts.some(l=>l.scheme))return;
 const choices=[
  {id:'dining-sunlit',scheme:'sunlit',name:'01 · Sunlit timber',subtitle:'Warm pine, bamboo & botanicals',project:'md',heroImage:'project-md.jpg',description:'The closest continuation of your laid-back lounge: a pine table, compact timber chairs, a shallow closed crockery cupboard, bamboo pendant and botanical pair. Warm clay-white wall colour is a paint study. The table seats four; it does not extend.',table:'pinntorp-table',chair:'pinntorp-chair40',cabinet:'billy-white',pendant:'misterhult',art:'knoppang-garden',tableX:5.70,chairZ:[4.38,4.98]},
  {id:'dining-quiet',scheme:'quiet',name:'02 · Quiet modern',subtitle:'Light ash, ivory & sliding glass',project:'poetry',heroImage:'project-poetry.jpg',description:'A lighter room with an extendable white table, ash upholstered chairs and an off-white sliding-glass crockery cabinet. A rounded beige pendant, floral art and a small lamp soften the practical pieces. Six is an occasional space study, with tighter circulation.',table:'vihals-table',chair:'lisabo-dining',cabinet:'tonstad-white',pendant:'blasverk-pendant',art:'blodflader',tableX:5.70,chairZ:[4.40,5.00]},
  {id:'dining-evening',scheme:'evening',name:'03 · Collected evenings',subtitle:'Brown wood, sage & a gallery feel',project:'bodhi',heroImage:'project-bodhi.jpg',description:'A richer brown-wood table and upholstered chairs, an oak sliding-glass crockery cabinet, black pendant and an atmospheric picture. Sage behind the furniture is a paint study. The table extends, but the six-seat arrangement needs a circulation review.',table:'nasinge-table',chair:'nasinge-chair',cabinet:'tonstad-oak',pendant:'skurup-pendant',art:'moonlight',tableX:5.77,chairZ:[4.38,4.98]}
 ];
 for(const c of choices){
  const t=products.find(p=>p.id===c.table),chair=products.find(p=>p.id===c.chair),cab=products.find(p=>p.id===c.cabinet);
  const tableZ=5.2876-t.w/2,offset=t.d/2+chair.d/2+.025,cabX=3.58+cab.w/2,cabZ=3.566+cab.d/2;
  const items=[piece(c.table,c.tableX,tableZ,90),...[-1,1].flatMap(side=>c.chairZ.map(z=>piece(c.chair,c.tableX+side*offset,z,side===-1?90:-90))),piece(c.cabinet,cabX,cabZ),piece(c.pendant,c.tableX,tableZ,0,1.60),piece(c.art,c.scheme==='evening'?5.11:4.03,3.582,0,c.scheme==='sunlit'?1.58:c.scheme==='quiet'?1.65:1.43),piece('blasverk-table',cabX-.21,cabZ+.01,0,cab.h),plant(cabX+.21,cabZ+.01,cab.h)];
  const {table,chair:chairId,cabinet,pendant,art,tableX,chairZ,...meta}=c;
  state.layouts.push({...meta,room:'dining',items});
  for(const id of [table,chairId,cabinet,pendant,art,'blasverk-table'])if(!state.shortlist.some(s=>s.id===id))state.shortlist.push({id,status:'Considering',note:''});
 }
}
export function guestScheme(state){
 const source=state.layouts.find(l=>l.id===state.active);if(!source?.scheme||source.scheme==='sunlit')return null;
 const existing=state.layouts.find(l=>l.sourceLayout===source.id&&l.guestMode);if(existing)return existing;
 const l=structuredClone(source),table=l.items.find(i=>i.type==='diningtable'),chair=l.items.find(i=>i.type==='diningchair');
 l.id=crypto.randomUUID();l.sourceLayout=source.id;l.guestMode=true;l.name=source.name.replace(/^\d+ · /,'')+' · six-seat check';
 table.w=source.scheme==='quiet'?1.80:1.90;table.z=3.576+table.w/2;table.name=table.name.replace(/ · 120 cm/,'')+' · '+Math.round(table.w*100)+' cm';table.detail+=' Extended configuration at its published maximum length.';
 l.items=l.items.filter(i=>i.type!=='diningchair');
 for(const side of [-1,1])for(const dz of [-table.w/3,0,table.w/3])l.items.push({...structuredClone(chair),id:crypto.randomUUID(),x:table.x+side*(table.d/2+chair.d/2+.025),z:table.z+dz,rotation:side===-1?90:-90});
 const light=l.items.find(i=>i.type==='pendant');if(light){light.x=table.x;light.z=table.z;}
 l.description='The same room with the table extended and three chairs on each long side. The south passage is narrower than the 90 cm guide and the bedroom approach may be affected. Confirm knee / leg space and find storage for the extra chairs. This is a temporary guest comparison.';
 state.layouts.push(l);return l;
}
