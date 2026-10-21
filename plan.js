// Metres throughout. X goes right; Z goes down the supplied plan; Y is height.
// Room dimensions are clear internal dimensions. Every wall is eight inches.
export const FT = .3048;
export const IN = .0254;
export const WALL = 8 * IN;
export const HEIGHT = 9 * FT;
export const DOOR = 32 * IN;
export const EYE = 1.60;
export const rooms = [
  {id:'living',name:'LIVING',size:'11′0″ × 14′3″',x:0,z:1.7272,w:3.3528,d:4.3434,label:[1.55,2.05]},
  {id:'foyer',name:'FOYER',size:'5′0″ × 9′0″',x:0,z:6.0706,w:1.524,d:2.7432,label:[.76,7.02]},
  {id:'dining',name:'DINING',size:'13′4″ × 8′8″',x:3.556,z:3.556,w:4.064,d:2.6416,label:[5.50,5.68]},
  {id:'kitchen',name:'KITCHEN',size:'13′2″ × 8′10″',x:1.7272,z:6.1976,w:4.0132,d:2.6924,label:[3.63,7.78]},
  {id:'utility',name:'UTILITY',size:'8′5″ × 6′0″',x:1.7272,z:9.0932,w:2.5654,d:1.8288,label:[2.9,9.5]},
  {id:'bed3',name:'BEDROOM 3',size:'12′9″ × 11′0″',x:3.556,z:0,w:3.8862,d:3.3528,label:[4.45,1.45]},
  {id:'master',name:'MAIN BEDROOM',size:'14′3″ × 11′0″',x:7.6454,z:0,w:4.3434,d:3.3528,label:[8.8,1.5]},
  {id:'children',name:'CHILDREN’S ROOM',size:'11′0″ × 12′0″',x:9.398,z:5.2832,w:3.3528,d:3.6576,label:[10.75,7.22]},
  {id:'bath1',name:'BATH',size:'8′6″ × 5′0″',x:9.398,z:3.556,w:2.5908,d:1.524,label:[11.12,4.45]},
  {id:'bath2',name:'BATH',size:'5′0″ × 8′6″',x:5.9436,z:6.1976,w:1.524,d:2.5908,label:[6.7,7.62]},
  {id:'bath3',name:'BATH',size:'5′0″ × 8′6″',x:7.6708,z:6.1976,w:1.524,d:2.5908,label:[8.43,7.62]},
  {id:'balcony1',name:'BALCONY 01',size:'11′0″ × 5′0″',x:0,z:0,w:3.3528,d:1.524,label:[1.67,.78]},
  {id:'balcony2',name:'BALCONY 02',size:'10′0″ × 5′0″',x:7.6454,z:-1.7272,w:3.048,d:1.524,label:[9.14,-.97]}
];
export const room = id => rooms.find(r=>r.id===id);
// Walk only through the front door and the open foyer; no bedroom visit yet.
export const walkPoints = [
  [-1.20,EYE,8.3138], [.42,EYE,8.3138], [.66,EYE,7.72],
  [.66,EYE,6.55], [.51,EYE,5.68], [.49,EYE,4.61]
];
export const diningWalk = [
  [.49,EYE,4.61],[.49,EYE,5.24],[.62,EYE,5.72],
  [1.82,EYE,5.72],[3.22,EYE,5.72],[3.72,EYE,5.93]
];
export const diningWalkPortrait = [
  [.49,EYE,5.76],[.98,EYE,5.72],[1.82,EYE,5.72],
  [3.0,EYE,5.74],[3.62,EYE,5.92]
];
// The original checkpoint occupies the first 62% of the extended sequence.
export const LIVING_STOP = .62;
