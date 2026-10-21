// These are visual approximations of linked real finish families, never colour-matched swatches.
const wool={name:'Greenlam 90107 Wool · Suede',url:'https://www.greenlam.co.in/wool-31366',kind:'1 mm Unicore laminate reference'};
export const kitchenFinishes={
 sand:{name:'Sand + ivory',tag:'My starting pick',base:'#b7a58d',upper:'#eee9df',top:'#e5e0d6',wood:false,worktop:'Warm off-white stone study',description:'Beige lower cabinets and tall bank, with ivory wall cupboards. Quiet and warm beside the lounge timber; the lighter uppers keep the room feeling open.',references:[{name:'IKEA HAVSTORP · beige',url:'https://www.ikea.com/in/en/p/havstorp-door-beige-20554315/',kind:'Painted fibreboard door · beige reference'},wool]},
 ash:{name:'Light ash + white',tag:'Lightest wood option',base:'#c4ab84',upper:'#f0eee7',top:'#66635d',wood:true,worktop:'Charcoal stone study',description:'Light ash-effect lowers and tall units, white wall cupboards and a charcoal worktop for definition. A brighter wood direction that connects with the dining furniture.',references:[{name:'IKEA ASKERSUND · light ash effect',url:'https://www.ikea.com/in/en/p/askersund-door-light-ash-effect-30331777/',kind:'Melamine wood-effect door · colour / grain reference'},{name:'IKEA VALLSTENA · white',url:'https://www.ikea.com/in/en/p/vallstena-door-white-00541748/',kind:'Foil-faced particleboard door · white reference'}]},
 walnut:{name:'Walnut + ivory',tag:'Richer timber contrast',base:'#77513b',upper:'#eee9df',top:'#e5e0d6',wood:true,worktop:'Warm off-white stone study',description:'Walnut-effect lower and tall cabinets, balanced with ivory wall cupboards and a pale worktop. More contrast and a richer timber presence; sample beside the dining furniture before choosing.',references:[{name:'Greenlam 608 American Walnut · Suede',url:'https://www.greenlam.co.in/india_kannada/american-walnut',kind:'HPL woodgrain laminate reference'},wool]}
};
export const finishBrief=id=>{const p=kitchenFinishes[id];return `Palette preview: ${p.name}. Lower / tall units: ${p.references[0].name}; upper units: ${p.references[1].name}. ${p.worktop}; worktop product not selected. Colour and grain are approximate. References guide custom joinery; samples, material build-up, edge finish and supplier quote remain to approve.`;};
export function applyKitchenFinish(state,l,id){
 if(!kitchenFinishes[id]||l.room!=='kitchen')return;
 const p=kitchenFinishes[id];l.kitchenFinish=id;
 for(const i of l.items){i.finishPalette=id;if(['kitchenbase','kitchentall','kitchenisland','kitchenupper','appliancebay','kitchenshelf'].includes(i.type))i.color=i.type==='kitchenupper'?p.upper:p.base;}
 const refs=new Set(l.items.map(i=>i.referenceId));
 for(const c of state.customFurniture||[])if(refs.has(c.referenceId)){c.finishStudy=id;if(/^(Colour study:|Light washable fronts;|Palette preview:)/.test(c.finish))c.finish=finishBrief(id);}
}
export function seedKitchenFinishes(state){for(const l of state.layouts.filter(l=>l.room==='kitchen'))if(!l.kitchenFinish)applyKitchenFinish(state,l,'sand');}
