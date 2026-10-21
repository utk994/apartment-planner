export const kitchenBounds={x0:1.7272,x1:5.7404,z0:6.1976,z1:8.89};
export const utilityBounds={x0:1.7272,x1:4.2926,z0:9.0932,z1:10.922};
export const kitchenTypes=['kitchenbase','kitchenupper','kitchentall','appliancebay','kitchenisland','kitchenstool','dryingrack','kitchenshelf','wallreserve'];
export const raisedKitchen=['kitchenupper','dryingrack','kitchenshelf','wallreserve'];
export const kitchenSources=[
 ['IKEA India · kitchen planning guide','https://www.ikea.com/in/en/files/pdf/8f/26/8f26a063/hw-to-plan-kitchen_planning-final.pdf'],
 ['Hettich India · drawers & internal organisation','https://www.hettich.com/fileadmin/Media_Center/Catalogue/InnoTech_Atira_Catalogue_OCT_24_Issue.pdf'],
 ['IKEA India · what to measure','https://www.ikea.com/in/en/customer-service/knowledge/articles/737fg460-0c4b-45gb-ge4g-e1g967g25g36.html']
];
export const kitchenIdeas={
 utility:{label:'Utility-facing cooking',subtitle:'Full appliance list · revised L-layout',front:'#a9b4a0',top:'#d6d0be',swatches:['#a9b4a0','#d6d0be','#c9ac82'],description:'An L-shaped working run with cooking on the utility-facing wall continuation and a fridge / oven / microwave bank opposite. Countertop space is reserved for mixer, juicer and coffee maker.',tradeoff:'Fits the requested appliance allowances while keeping a 90 cm main prep run clear. Cooktop backing, doorway and outside exhaust route need confirmation; the cooktop is not wholly against the short partition directly shared with utility.',reference:'https://www.ikea.com/in/en/rooms/kitchen/gallery/a-sage-green-kitchen-made-for-small-space-living-pub0ff38410/',referenceTitle:'Calm sage cabinetry and organised kitchen storage'},
 parallel:{label:'Open parallel',subtitle:'Everyday cooking · open centre',front:'#a9b4a0',top:'#d6d0be',swatches:['#a9b4a0','#d6d0be','#c9ac82'],description:'Two working runs, with a generous open centre and no breakfast bar. Drawers for daily cooking, a sink-side waste cabinet and separate laundry / wash storage in the utility. My starting recommendation.',tradeoff:'Most open circulation; less full-height pantry storage than option 2.',reference:'https://www.ikea.com/in/en/rooms/kitchen/gallery/a-sage-green-kitchen-made-for-small-space-living-pub0ff38410/',referenceTitle:'Sage green, warm timber and practical everyday storage'},
 pantry:{label:'L-worktop + pantry',subtitle:'More closed storage · proposed return',front:'#e1d9c8',top:'#9b9b88',swatches:['#e1d9c8','#9b9b88','#8b947e'],description:'A tall storage bank on the left, an L-shaped worktop on the right and a new short return toward dining. The return is prep space, with no seating. Utility storage is mostly closed.',tradeoff:'Best pantry capacity; one working wall and a new return mean more countertop changes.',reference:'https://www.ikea.com/in/en/rooms/kitchen/gallery/a-modern-compact-kitchen-generous-in-style-and-storage-pub94a75e80/',referenceTitle:'Compact kitchen with coordinated tall and wall storage'},
 island:{label:'Prep island',subtitle:'Single working wall · movable-layout study',front:'#d8ddcf',top:'#c5aa83',swatches:['#d8ddcf','#c5aa83','#eee9db'],description:'One working wall and a new 120 × 65 cm prep island, with approximately 127 cm between them. A lighter utility adds folding and ceiling drying space. Breakfast seating can be explored separately.',tradeoff:'Extra sociable prep surface; less base storage and only about 99 cm around the island’s utility end.',reference:'https://www.ikea.com/in/en/ideas/home-furnishings/one-wall-to-store-it-all-storage-in-an-open-plan-kitchen-pubd01f63c0/',referenceTitle:'Open-plan kitchen storage as part of the living space'}
};
function moduleItem(s,zone,type,name,w,d,h,x,z,rotation=0,role='doors',elevation=0){return {id:crypto.randomUUID(),name,type,room:'kitchen',zone,role,w,d,h,x,z,rotation,elevation,referenceId:zone+'-'+s,productId:null,locked:false,verified:false,price:null,category:'furniture',color:kitchenIdeas[s].front,detail:role==='fridge'||role==='laundry'?'Reserved space only. Eventual appliance dimensions, ventilation and service clearances determine the final cabinet opening.':'Custom modular concept. Outer dimensions include the shown top / front; carcass, fillers, hardware and service positions need a measured fabrication drawing.'};}
function utility(s){const a=[],add=(...args)=>a.push(moduleItem(s,'utility',...args));
 add('appliancebay','Laundry appliance space · model later',.70,.75,.90,2.1122,10.552,90,'laundry');
 add('kitchenbase','Utility folding / cleaning cabinet',.60,.60,.90,3.9926,9.95,-90,'drawers');
 add('kitchenbase','Utility wash sink · location study',.60,.60,.90,3.9926,10.55,-90,'sink');
 add('kitchenupper','Utility cleaning supplies',1.20,.35,.60,4.1176,10.25,-90,'doors',1.55);
 if(s!=='island')add('kitchentall','Broom & mop cupboard',.55,.40,2.20,1.9372,9.55,90,'broom');
 if(s==='pantry')add('kitchenupper','Laundry wall cupboard',.70,.35,.60,2.0872,10.747,180,'doors',1.55);
 if(s==='island'){add('kitchenshelf','Fold-down sorting shelf · proposed',.75,.30,.035,1.8872,9.70,90,'shelf',.90);add('dryingrack','Ceiling drying rack · proposed',1.20,.60,.10,3.05,10.12,0,'rack',2.22);}
 return a;
}
function kitchen(s){const a=[],add=(...args)=>a.push(moduleItem(s,'kitchen',...args));
 const west=(type,name,w,start,role='doors',h=.90,d=.60)=>add(type,name,w,d,h,1.7272+d/2,start+w/2,90,role);
 const east=(type,name,w,start,role='doors',h=.90,d=.60)=>add(type,name,w,d,h,5.7404-d/2,start+w/2,-90,role);
 const upper=(name,w,start,side='east',role='doors',h=.72,elevation=1.50)=>add('kitchenupper',name,w,.35,h,side==='east'?5.5654:1.9022,start+w/2,side==='east'?-90:90,role,elevation);
 if(s==='parallel'){
  west('appliancebay','Fridge space · model later',.80,6.22,'fridge',2.10,.75);
  west('kitchenbase','Left prep drawers · 60',.60,7.02,'drawers');west('kitchenbase','Kitchen sink · location study',.60,7.62,'sink');west('kitchenbase','Waste & sink-side storage · 60',.60,8.22,'waste');
  east('kitchenbase','Daily utensils · 60',.60,6.22,'drawers');east('kitchenbase','Cooking zone · hob later',.60,6.82,'hob');east('kitchenbase','Main prep drawers · 90',.90,7.42,'drawers');east('kitchenbase','Spice & bottle pull-out · 45',.45,8.32,'pullout');
  upper('Left wall storage · 120',1.20,7.02,'west');upper('Left wall storage · 60',.60,8.22,'west');upper('Right wall storage · 60',.60,6.22);upper('Right wall storage · 135',1.35,7.42);
  add('kitchenupper','Fridge loft · ventilation to resolve',.80,.60,.40,2.0272,6.62,90,'doors',2.25);
 }else if(s==='pantry'){
  west('appliancebay','Fridge space · model later',.80,6.22,'fridge',2.10,.75);west('kitchentall','Food pantry · 60',.60,7.02,'pantry',2.20);west('kitchentall','Appliance-ready tall storage · 60',.60,7.62,'pantry',2.20);west('kitchentall','Grocery & cleaning storage · 45',.45,8.22,'doors',2.20);
  add('kitchenbase','NEW return · corner-access storage · 90',.90,.60,.90,4.6904,6.4976,0,'corner');add('kitchenbase','Blind corner · accessed from return',.60,.60,.90,5.4404,6.4976,0,'blindcorner');
  east('kitchenbase','Cooking zone · hob later',.60,6.8176,'hob');east('kitchenbase','Prep drawers · 60',.60,7.4176,'drawers');east('kitchenbase','Kitchen sink · location study',.60,8.0176,'sink');east('kitchenbase','Slim tray storage · 20',.20,8.6176,'pullout');
  upper('Right wall storage · 120',1.20,7.4176);upper('Tall-bank loft · 180',1.80,7.02,'west','doors',.40,2.25);
 }else{
  east('kitchenbase','Cooking zone · hob later',.60,6.22,'hob');east('kitchenbase','Working-wall prep · 60',.60,6.82,'drawers');east('kitchenbase','Kitchen sink · location study',.60,7.42,'sink');east('appliancebay','Fridge space · model later',.80,8.02,'fridge',2.10,.75);
  upper('Working-wall storage · 120',1.20,6.82);add('kitchenisland','NEW prep island · no seating',1.20,.65,.90,3.55,7.30,90,'island');
 }
 return a.concat(utility(s));
}
export const kitchenTemplates=[
 {id:'custom-base60',name:'Base drawers · 60 cm',type:'kitchenbase',role:'drawers',w:.60,d:.60,h:.90},
 {id:'custom-tall60',name:'Tall pantry · 60 cm',type:'kitchentall',role:'pantry',w:.60,d:.60,h:2.20},
 {id:'custom-wall60',name:'Wall cupboard · 60 cm',type:'kitchenupper',role:'doors',w:.60,d:.35,h:.72,elevation:1.50},
 {id:'custom-bay',name:'Unspecified appliance bay',type:'appliancebay',role:'appliance',w:.60,d:.65,h:.90}
].map(p=>({...p,room:'kitchen',zone:'kitchen',color:'#a9b4a0',verified:false,price:null,detail:'Adjustable custom module. Check against the site and appliance schedule.'}));
export function seedKitchen(state){
 if(state.layouts.some(l=>l.room==='kitchen'))return;
 state.rooms??={};state.rooms.kitchen={note:'Countertops can change. Explore modular kitchen + utility. Breakfast bar is a proposal only. Appliance models, service points and finished wall measurements to confirm.',finalised:false,lastLayout:'kitchen-parallel'};
 state.customFurniture??=[];
 Object.entries(kitchenIdeas).filter(([s])=>s!=='utility').forEach(([s,p],index)=>{
  state.layouts.push({id:'kitchen-'+s,room:'kitchen',kitchenScheme:s,name:`0${index+1} · ${p.label}`,subtitle:p.subtitle,project:'poetry',description:p.description,items:kitchen(s)});
  for(const zone of ['kitchen','utility']){
   const b=zone==='kitchen'?kitchenBounds:utilityBounds;
   state.customFurniture.push({id:zone+'-'+s,name:(zone==='kitchen'?'Modular kitchen':'Utility cabinetry')+' · '+p.label,referenceId:zone+'-'+s,room:zone==='kitchen'?'Kitchen':'Utility',w:b.x1-b.x0,d:b.z1-b.z0,h:2.65,status:'Concept',material:'Proposed: plywood carcasses with sealed edges; wet-zone substrate, shutter material and hardware to be quoted by the fabricator.',finish:zone==='kitchen'?`Colour study: ${p.swatches.join(' / ')}. Matte easy-clean fronts; countertop material and thickness to select.`:'Light washable fronts; moisture-resistant details and accessible plumbing. Worktop and drying hardware to choose.',design:zone==='kitchen'?p.description:'Laundry reserve on the left, sink / folding run on the right. '+(s==='island'?'New ceiling drying rack and fold-down shelf.':'Tall broom storage and raised cleaning-supply cupboard.'),fixing:'Site measure, wall fixing and service access to be designed by the installer. Countertop alterations are allowed. Preserve utility doorway; check window opening and drying clearance.',supplier:'',quote:null,notes:'Package envelope shown, not a single cabinet. The Layout & cabinet brief contains the live module schedule. Cabinet faces, sink and hob are illustrative; appliances have not been selected. Fillers, corner fittings, shutters, drawer operation, gas / electric / water / drain / ventilation positions and exact openings remain to resolve. Quote this alternative separately; do not add all alternatives together.'});
  }
 });
}
export function breakfastKitchen(state){const base=state.layouts.find(l=>l.id===state.active);if(base.kitchenScheme!=='island')return null;const existing=state.layouts.find(l=>l.sourceLayout===base.id&&l.breakfastMode);if(existing)return existing;const l=structuredClone(base);l.id=crypto.randomUUID();l.sourceLayout=base.id;l.breakfastMode=true;l.name='Prep island · breakfast proposal';l.description='NEW proposal: a 25 cm breakfast overhang and two stools. The west side is seating space, not a through-route. East and utility-end routes remain available; actual occupied seat / knee space must be checked.';const island=l.items.find(i=>i.type==='kitchenisland');if(!island)return null;island.d=.90;island.x=3.425;island.name='NEW breakfast island · 25 cm overhang';island.role='breakfast';for(const z of [7.0,7.6])l.items.push(moduleItem('island','kitchen','kitchenstool','Breakfast stool · size study',.40,.40,.65,2.72,z,90,'stool'));state.layouts.push(l);return l;}
export function kitchenThumbnail(l){const p=kitchenIdeas[l.kitchenScheme],rects=l.items.filter(i=>!raisedKitchen.includes(i.type)).map(i=>{const a=i.rotation*Math.PI/180,c=Math.abs(Math.cos(a)),s=Math.abs(Math.sin(a)),w=i.w*c+i.d*s,d=i.w*s+i.d*c;return `<rect x="${(i.x-w/2-1.5)*50}" y="${(i.z-d/2-6)*42}" width="${w*50}" height="${d*42}" rx="1.5" fill="${i.type==='appliancebay'?'#e6e0d2':i.color||p.front}" stroke="#6f7968" stroke-width=".7"/>`;}).join('');return `<svg class="kitchen-thumbnail" viewBox="0 0 230 218" aria-label="Kitchen and utility layout preview"><rect width="230" height="218" fill="#eeeade"/><path d="M11 8H212V121H140V207H11Z" fill="#faf8f0" stroke="#bcb9aa" stroke-width="2"/>${rects}<text x="112" y="60" text-anchor="middle">KITCHEN</text><text x="75" y="175" text-anchor="middle">UTILITY</text><path d="M57 126h53" stroke="#b39166" stroke-dasharray="3 3"/><text x="112" y="17" text-anchor="middle" class="thumb-dim">4.01 m</text></svg>`;}
