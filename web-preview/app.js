import * as T from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
const scene=new T.Scene();scene.background=new T.Color(0x080f13);scene.fog=new T.Fog(0x080f13,7,15);
const renderer=new T.WebGLRenderer({canvas:document.querySelector('#game'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const camera=new T.PerspectiveCamera(52,1,.05,25);camera.position.set(0,1.65,4.3);
scene.add(new T.HemisphereLight(0x718b99,0x2d231b,.7));
const lamp=new T.SpotLight(0xffd59a,25,15,.54,.7,1.2);scene.add(lamp);scene.add(lamp.target);lamp.castShadow=true;
let on=true,started=false,found=false,clockSet=false,houseSet=false,hasKey=false,ending=false,yaw=0,storyStep=0,context;
const cap=document.querySelector('#caption');function say(s){cap.textContent=s}
const mat=(c)=>new T.MeshStandardMaterial({color:c,roughness:.7});
function mesh(g,m,x,y,z,parent=scene){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);o.castShadow=true;o.receiveShadow=true;return o}
function box(w,h,d,c,x,y,z,p=scene){return mesh(new T.BoxGeometry(w,h,d),typeof c==='number'?mat(c):c,x,y,z,p)}
function texture(draw){const c=document.createElement('canvas');c.width=c.height=512;draw(c.getContext('2d'));return new T.CanvasTexture(c)}
const wood=texture(c=>{c.fillStyle='#493529';c.fillRect(0,0,512,512);for(let i=0;i<100;i++){c.strokeStyle='rgba(10,4,1,.12)';c.beginPath();c.moveTo(0,i*5);c.lineTo(512,i*5+Math.sin(i)*18);c.stroke()}});
const wm=new T.MeshStandardMaterial({map:wood,roughness:.82});
box(8,.12,9,wm,0,-.1,0);box(8,4,.15,0x34433a,0,2,-3);for(const x of [-4,4])box(.15,4,9,0x25352f,x,2,0);box(8,.1,9,0x18231f,0,4,0);
for(let x=-4;x<=4;x+=.45)box(.012,.012,9,0x1d1d17,x,-.03,0);
for(let x=-3.9;x<4;x+=.4)box(.025,1,.03,0x1e2922,x,.5,-2.88);
box(8,.07,.11,0x645440,0,1,-2.87);box(8,.11,.14,0x665642,0,.08,-2.85);
box(3.5,.14,1.2,wm,0,.97,-1.5);for(const x of [-1.5,1.5])for(const z of [-1.95,-1.05])box(.1,.95,.1,wm,x,.45,z);
const interact=[];
function register(group,name,action){group.userData.name=name;group.userData.action=action;interact.push(group)}
const photo=new T.Group();photo.position.set(-1.12,1.43,-1.5);photo.rotation.x=-.1;scene.add(photo);
box(.85,.68,.07,0x30271d,0,0,0,photo);
for(const x of [-.42,.42])box(.055,.72,.08,0xa58b5c,x,0,.04,photo);for(const y of [-.34,.34])box(.9,.055,.08,0xa58b5c,0,y,.04,photo);
const picture=texture(c=>{c.fillStyle='#9b927a';c.fillRect(0,0,512,512);c.fillStyle='#626758';for(let i=0;i<7;i++)c.fillRect(i*90,0,8,512);c.fillStyle='#363d35';c.fillRect(0,370,512,142);c.fillStyle='#3b3b32';c.beginPath();c.ellipse(178,330,62,140,0,0,7);c.fill();c.fillStyle='#d1b68e';c.beginPath();c.arc(178,177,44,0,7);c.fill();c.fillStyle='#574d3b';c.beginPath();c.arc(178,158,46,Math.PI,Math.PI*2);c.fill();c.strokeStyle='#ddd0b3';c.lineWidth=3;c.strokeRect(296,195,100,210)});
const familyTexture=new T.TextureLoader().load('https://raw.githubusercontent.com/Reet24-del/pocket-pip/main/web-preview/family.jpg'); familyTexture.colorSpace=T.SRGBColorSpace;
mesh(new T.PlaneGeometry(.74,.57),new T.MeshBasicMaterial({map:familyTexture}),0,0,.05,photo);
const clock=new T.Group();clock.position.set(0,2.28,-2.83);scene.add(clock);
mesh(new T.CylinderGeometry(.39,.39,.1,48),mat(0x705537),0,0,0,clock).rotation.x=Math.PI/2;
const face=texture(c=>{c.fillStyle='#d2c5a4';c.fillRect(0,0,512,512);c.fillStyle='#302d25';c.font='32px Georgia';c.textAlign='center';for(let i=1;i<=12;i++){let a=i*Math.PI/6;c.fillText(i,256+180*Math.sin(a),267-180*Math.cos(a))}});
mesh(new T.CircleGeometry(.345,64),new T.MeshBasicMaterial({map:face,transparent:false}),0,0,.06,clock);
const needle=box(.018,.19,.015,0x292c24,0,.08,.08,clock);
const minutes=box(.25,.013,.015,0x292c24,.1,0,.09,clock);
const house=new T.Group();house.position.set(.65,1.05,-1.4);scene.add(house);
box(.7,.08,.62,wm,0,0,0,house);box(.62,.48,.5,0x92927c,0,.27,0,house);
const roof=mesh(new T.ConeGeometry(.5,.35,4),mat(0x3c4843),0,.67,0,house);roof.rotation.y=Math.PI/4;
box(.12,.2,.03,0x493d2b,0,.16,.27,house);
for(const x of [-.2,.2]){box(.11,.13,.02,0x142d33,x,.35,.26,house);box(.01,.13,.03,0x877753,x,.35,.28,house); }
const cabinet=new T.Group();
cabinet.position.set(2.17,.44,-1.65);
scene.add(cabinet);
for(const x of [-.3,.3])box(.055,.8,.49,wm,x,0,0,cabinet);
for(const y of [-.38,.39])box(.69,.055,.54,wm,0,y,0,cabinet);
box(.59,.8,.04,wm,0,0,-.23,cabinet);
const drawerNames=['Top drawer','Middle drawer','Bottom drawer'];
const drawerTravel={closed:0,nudged:.12,open:.57};
const drawers=[.25,-.01,-.27].map((height,index)=>{
  const tray=new T.Group();
  const front=new T.Group();
  tray.position.y=height;
  tray.add(front);
  cabinet.add(tray);
  box(.57,.205,.055,wm,0,0,.254,front);
  box(.48,.13,.018,0x715137,0,0,.288,front);
  const handle=mesh(new T.TorusGeometry(.054,.012,10,24),mat(0xbc9656),0,0,.32,front);
  handle.scale.y=.54;
  box(.53,.028,.44,wm,0,-.083,.012,tray);
  for(const x of [-.253,.253])box(.032,.12,.44,wm,x,-.022,.012,tray);
  box(.53,.12,.027,wm,0,-.022,-.204,tray);

  const light=new T.PointLight(0xffdcaa,1.05,1.65);
  light.position.set(.12,.55,.7);
  light.visible=false;
  tray.add(light);
  return {tray,front,light,name:drawerNames[index],state:'closed'};
});

const letter=new T.Group();
letter.position.set(-.09,-.064,.04);
letter.rotation.y=.17;
drawers[0].tray.add(letter);
box(.19,.009,.24,0xd1b68a,0,0,0,letter);
const handwriting=texture(c=>{
  c.fillStyle='#cab087';
  c.fillRect(0,0,512,512);
  c.fillStyle='#46342b';
  c.font='italic 58px Georgia';
  c.fillText('Come back',60,136);
  c.fillText('for me.',62,208);
  c.fillText('— Ada',210,362);
  c.strokeStyle='#8f7659';
  c.strokeRect(24,24,464,464);
});
handwriting.colorSpace=T.SRGBColorSpace;
mesh(new T.PlaneGeometry(.18,.23),new T.MeshBasicMaterial({map:handwriting}),0,.005,0,letter).rotation.x=-Math.PI/2;

const key=new T.Group();
key.position.set(.065,-.051,-.032);
key.rotation.set(-Math.PI/2,0,.15);
drawers[0].tray.add(key);
mesh(new T.TorusGeometry(.032,.009,12,24),mat(0xd1ad59),0,0,0,key);
box(.102,.014,.016,0xd1ad59,.08,0,0,key);
for(const x of [.099,.124])box(.013,.029,.014,0xd1ad59,x,-.013,0,key);
key.visible=false;
// A transparent hit surface makes the key's bow and shaft one clickable target.
const keyHit=mesh(new T.PlaneGeometry(.21,.13),new T.MeshBasicMaterial({
  transparent:true,opacity:0,depthWrite:false,
}),.052,-.008,.012,key);
keyHit.castShadow=false;
keyHit.receiveShadow=false;
let inspectedObject=null;

const door=new T.Group();
door.position.set(2.6,1.35,-2.84);
scene.add(door);
const doorway=box(1.12,2.63,.02,0x080e16,0,0,-.064,door);
const hinge=new T.Group();
hinge.position.x=-.575;
door.add(hinge);
const doorLeaf=new T.Group();
doorLeaf.position.x=.575;
hinge.add(doorLeaf);
box(1.15,2.65,.09,0x22352c,0,0,0,doorLeaf);
for(const y of [-.6,.55])box(.82,.8,.04,0x18291f,0,y,.07,doorLeaf);
mesh(new T.SphereGeometry(.045),mat(0xbfa069),.4,-.1,.15,doorLeaf);
let doorState='closed';
for(let x of [1.95,3.25])box(.13,2.85,.17,0x7b6a4d,x,1.4,-2.8);box(1.42,.13,.17,0x7b6a4d,2.6,2.8,-2.8);
const win=new T.Group();win.position.set(-2.55,2,-2.8);scene.add(win);box(1.4,1.65,.07,0x132b35,0,0,0,win);for(let x of [-.75,0,.75])box(.06,1.8,.1,0x7d725c,x,0,.04,win);box(1.55,.06,.1,0x7d725c,0,0,.04,win);
for(let y of [-.88,.88])box(1.55,.06,.1,0x7d725c,0,y,.04,win);
const moon=new T.PointLight(0x7596b6,2,5);moon.position.set(-2.4,2,-2);scene.add(moon);
for(let x of [-3.4,-1.7])box(.28,2.2,.13,0x333f38,x,1.8,-2.6);
const candle=new T.Group();candle.position.set(-.4,1.05,-1.3);scene.add(candle);mesh(new T.CylinderGeometry(.06,.07,.22,12),mat(0xc7b594),0,.11,0,candle);
const flame=mesh(new T.SphereGeometry(.035,10,10),new T.MeshBasicMaterial({color:0xffd080}),0,.25,0,candle);flame.scale.y=1.7;
const glow=new T.PointLight(0xffa65a,1.8,3);glow.position.set(-.4,1.4,-1.3);scene.add(glow);
const silhouette=new T.Group();
const coat=mat(0x18191d);
scene.add(silhouette);
const courierBacklight=new T.PointLight(0x819abc,0,2.5);
courierBacklight.position.set(-.4,1.6,-.3);
silhouette.add(courierBacklight);
mesh(new T.SphereGeometry(.13,18,12),coat,0,1.69,0,silhouette).scale.set(.83,1.22,.9);
mesh(new T.CylinderGeometry(.19,.19,.034,24),coat,0,1.795,0,silhouette);
mesh(new T.CylinderGeometry(.102,.12,.12,24),coat,0,1.859,0,silhouette);
mesh(new T.CylinderGeometry(.23,.31,.85,24),coat,0,1.06,0,silhouette).scale.z=.66;
for(const x of [-.15,.15]){
  box(.123,.66,.125,coat,x,.33,0,silhouette);
  box(.135,.09,.23,coat,x,.06,.046,silhouette);
  box(.11,.58,.12,coat,x*1.88,1.14,0,silhouette).rotation.z=x*.8;
}
for(const x of [-.05,.05]){
  mesh(new T.SphereGeometry(.014,8,8),new T.MeshBasicMaterial({color:0xc3b59b}),x,1.705,.11,silhouette);
}
silhouette.visible=false;
const courierRoute=[[-3.25,-2.55],[-3.14,-.85],[-2.95,.35],[-2.7,1.55]];
const threatLabels=['Footsteps outside','At the window','Inside the house','In the hall','Just behind the door'];
const threatLines=[
  'The courier has reached the window.',
  'He is inside the house. You hear his boots on the floorboards.',
  'He is in the hall. His shadow crosses the doorway.',
  'He is close enough to hear you breathe.',
];
let threat=0, nextStep=0;
// Detailed study props, with real mesh depth and procedural surface maps.
const brass=new T.MeshStandardMaterial({color:0xb08b47,metalness:.78,roughness:.34});
const grain=texture(c=>{c.fillStyle='#604029';c.fillRect(0,0,512,512);let seed=21;for(let i=0;i<1500;i++){seed=(seed*16807)%2147483647;c.strokeStyle='rgba(18,8,2,'+(seed%18/100)+')';c.beginPath();c.moveTo(seed%512,0);c.bezierCurveTo(seed%512+40,150,seed%512-30,350,seed%512,512);c.stroke()}});grain.colorSpace=T.SRGBColorSpace;
wm.map=grain;wm.roughness=.5;wm.needsUpdate=true;
const paper=texture(c=>{c.fillStyle='#4c5140';c.fillRect(0,0,512,512);for(let x=0;x<512;x+=64)for(let y=0;y<512;y+=96){c.strokeStyle='#80724d';c.lineWidth=2;c.beginPath();c.moveTo(x+32,y);c.bezierCurveTo(x-10,y+30,x+74,y+60,x+32,y+96);c.bezierCurveTo(x-10,y+60,x+74,y+30,x+32,y);c.stroke()} });paper.wrapS=paper.wrapT=T.RepeatWrapping;paper.repeat.set(5,2.5);paper.colorSpace=T.SRGBColorSpace;
// Replace wall surface only; props remain separate geometry.
scene.children.filter(o=>o.isMesh&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.width===8&&o.geometry.parameters.height===4).forEach(o=>o.material=new T.MeshStandardMaterial({map:paper,roughness:.93}));
function turnedLeg(x,z){const pts=[];for(let i=0;i<35;i++){let y=i/34*.9;let r=.065+.025*Math.sin(i*.65)+.02*Math.exp(-Math.pow(y-.2,2)/.007);pts.push(new T.Vector2(r,y))}mesh(new T.LatheGeometry(pts,20),wm,x,0,z)}
for(const x of [-1.5,1.5])for(const z of [-1.95,-1.05])turnedLeg(x,z);
box(3.6,.035,1.3,wm,0,1.06,-1.5);box(3.45,.035,1.22,0x9b7850,0,.88,-1.5);
for(const x of [-1.12,0,1.12]){box(1.02,.19,.12,wm,x,.79,-.87);mesh(new T.TorusGeometry(.065,.009,8,16),brass,x,.79,-.79)}
// Brass frame molding and clock rim.
mesh(new T.TorusGeometry(.373,.018,10,64),brass,0,0,.07,clock);
for(const x of [-.4,.4])for(const y of [-.32,.32]){mesh(new T.TorusGeometry(.045,.009,8,16),brass,x,y,.09,photo)}
// Door molding gives the panels an inset rather than a flat painted rectangle.
for(const y of [-.6,.55])for(const x of [-.44,.44])box(.025,.86,.05,0x65533a,x,y,.1,doorLeaf);
for(const y of [-1.04,-.16,.11,.99])box(.9,.025,.05,0x65533a,0,y,.1,doorLeaf);
// Dollhouse: boards, four windows, veranda, columns, steps and chimneys.
for(let y=.08;y<.5;y+=.045)box(.635,.008,.515,0x626352,0,y,0,house);
for(const x of [-.2,.2]){box(.12,.13,.03,0x1a292b,x,.16,.27,house);box(.012,.13,.035,0xb2a888,x,.16,.29,house)}
box(.7,.035,.2,wm,0,.04,.34,house);for(const x of [-.29,.29])box(.022,.3,.022,0xbbaf8e,x,.2,.39,house);
box(.7,.025,.2,0x3c4843,0,.37,.34,house);box(.2,.035,.12,wm,0,.015,.46,house);box(.08,.22,.08,0x6f5541,-.22,.69,0,house);
// Ceiling cornice and wainscot rails.
box(8,.12,.14,0x756a53,0,3.85,-2.84);
for(const x of [-3.88,3.88])box(.14,.12,8,0x756a53,x,3.85,0);
// A faded patterned rug.
const rugtex=texture(c=>{c.fillStyle='#482c25';c.fillRect(0,0,512,512);c.strokeStyle='#958367';c.lineWidth=8;c.strokeRect(18,18,476,476);c.lineWidth=3;c.strokeRect(36,36,440,440);for(let x=60;x<460;x+=55)for(let y=60;y<460;y+=55){c.beginPath();c.moveTo(x,y-19);c.lineTo(x+16,y);c.lineTo(x,y+19);c.lineTo(x-16,y);c.closePath();c.stroke()}});
mesh(new T.PlaneGeometry(3.4,3.6),new T.MeshStandardMaterial({map:rugtex,roughness:1}),0,-.025,1).rotation.x=-Math.PI/2;
// Wall shelf and old book spines, each a separate object.
box(.65,.06,2,wm,-3.55,1.15,-.7);for(let i=0;i<9;i++)box(.23,.28+.07*Math.sin(i),.09,0x453324+i*250,-3.55,1.32,-1.45+i*.17);
// Rain lines on glass; no motion sickness or flashing effects.
const rain=new T.Group();scene.add(rain);for(let i=0;i<55;i++){box(.003,.04+((i%5)*.015),.004,0x69838b,-3.22+(i%11)*.13,1.35+(i%13)*.11,-2.73)}
const inspection=document.querySelector('#inspect');
const details=document.querySelector('#details');
const detailsButton=document.querySelector('#toggleDetails');
function setDetailsVisible(visible){
  details.hidden=!visible;
  detailsButton.setAttribute('aria-expanded',String(visible));
  detailsButton.textContent=visible?'Hide description':'Show description';
}
detailsButton.onclick=()=>setDetailsVisible(details.hidden);

function show(title,text,actions=[]){
  document.querySelector('#itemTitle').textContent=title;
  document.querySelector('#itemText').textContent=text;
  document.querySelector('#portrait').hidden=title!=='A space beside you';
  document.querySelector('#parcelPhoto').hidden=!['A parcel arrives','A parcel from the courier'].includes(title);
  const buttons=document.querySelector('#actions');
  buttons.replaceChildren();
  for(const [label,fn] of actions){
    const button=document.createElement('button');
    button.textContent=label;
    button.onclick=fn;
    buttons.append(button);
  }
  setDetailsVisible(true);
  inspection.classList.remove('hidden');
  document.body.classList.add('inspecting');
}
function shutProps(){
  for(const drawer of drawers)drawer.state='closed';
  doorState='closed';
  renderer.domElement.style.cursor='';
  document.querySelector('#hover').textContent='';
}
function close(){
  inspection.classList.add('hidden');
  document.body.classList.remove('inspecting');
  shutProps();
  if(!inspecting)return;
  inspecting=false;
  inspectedObject=null;
  zoomTarget=home.position.clone();
  lookTarget=null;
  yaw=home.yaw;
  pitch=home.pitch;
}
document.querySelector('#close').onclick=close;
let room=0,remaining=480,mistakes=0,solved=false,parcelCount=0;
const gallery=new T.Group();scene.add(gallery);gallery.visible=false;for(let i=0;i<3;i++){box(.65,.9,.07,0x97764a,-2+i,2.5,-2.75,gallery);}const nursery=new T.Group();scene.add(nursery);nursery.visible=false;box(1.5,.12,.8,wm,-2,.6,-1.5,nursery);for(let i=0;i<9;i++)box(.04,.65,.04,0x9e8c70,-2.7+i*.17,.9,-1.1,nursery);
const rooms=['The study','The portrait gallery','Ada’s nursery'];
const home={position:camera.position.clone(),yaw:0,pitch:0}; let inspecting=false,zoomTarget=null,lookTarget=null,lastTime=performance.now();
function advance(){close();room++;hintLevel=0;
  for(const drawer of drawers)drawer.tray.position.z=0;
  hinge.rotation.y=0;
  drawers[puzzles[room].letterDrawer].tray.add(letter);
  drawers[puzzles[room].keyDrawer].tray.add(key);
  solved=false;camera.position.copy(home.position);yaw=pitch=0;document.querySelector('#roomName').textContent=rooms[room];found=clockSet=houseSet=hasKey=false;key.visible=false;gallery.visible=room===1;nursery.visible=room===2;if(room===1){say('The door opens into a gallery. Ada left you a sequence, not an hour.');house.visible=true;scene.background=new T.Color(0x14101a);}else{say('Ada’s nursery. The music box remembers her way home.');house.visible=true;scene.background=new T.Color(0x111924);}update();}
function finish(){ending=true;close();document.querySelector('#story').style.display='flex';document.querySelector('#storyTitle').textContent='You found Ada.';document.querySelector('#storyText').textContent='Beyond the last door, Ada opens her eyes. You take her hand. Three rooms, '+mistakes+' wrong answers, '+Math.ceil(remaining)+' seconds left. Outside, the courier drops his last parcel and disappears.';document.querySelector('#next').textContent='Play again';}
function fail(){
  if(ending)return;
  mistakes++;
  remaining=Math.max(0,remaining-30);
  renderTimer();
  threat=Math.min(threatLines.length,threat+1);
  playKnock(.22);
  if(!silhouette.visible){
    silhouette.visible=true;
    silhouette.position.set(courierRoute[0][0],0,courierRoute[0][1]-.18);
  }
  if(parcelCount<6){
    const parcel=new T.Group();
    parcel.position.set(-.81+parcelCount++*.25,1.105,-1.1);
    scene.add(parcel);
    box(.22,.085,.16,0x967952,0,0,0,parcel);
    box(.014,.089,.164,0x584535,0,0,0,parcel);
    box(.223,.089,.014,0x584535,0,0,0,parcel);
    register(parcel,'Parcel from the courier',()=>show('A parcel from the courier','Inside is a photograph of Ada behind glass. On the back: “I know which room you’re in.”'));
  }
  const warning=threatLines[threat-1];
  show('A parcel arrives',warning+' The parcel holds a photograph of Ada behind glass. You lost 30 seconds.');
  say(warning);
  nextStep=performance.now()+450;
  update();
}
register(photo,'Inspect photograph',()=>{found=true;show(room===0?'A space beside you':'Ada’s next clue',room===0?'The family photograph has an empty outline. Scratched into its frame: “She waited until 3:15.”':room===1?'Three portraits hang in order: a moon, a door, a candle. Their frame numbers are 2, 4, 1. The letter says: “Read left to right.”':'Ada’s lullaby: “Rain, candle, moon. Then home.”');update()});
const puzzles=[
  {
    title:'Set the clock', slots:['Hour','Minute'],
    choices:[['12','3','6','9'],['00','15','30','45']], answer:['3','15'],
    letterDrawer:0,keyDrawer:0,
    letter:'“The third hour had struck. I counted a quarter of the clock before he came.”',
    hints:['Ada’s photograph and the letter in the top drawer remember the time.','A quarter of an hour is 15 minutes.','Set Hour to 3 and Minute to 15.'],
  },
  {
    title:'The gallery lock', slots:['First','Second','Third'],
    choices:['1','2','4'], answer:['2','4','1'],
    letterDrawer:1,keyDrawer:2,
    letter:'“The moon comes first, then the door, then the candle. Read the numbers on their frames.”',
    hints:['The letter in the middle drawer gives you the order of the portraits.','Inspect the photograph for the frame numbers. The moon is 2.','Try 2, then 4, then 1.'],
  },
  {
    title:'The music box', slots:['First','Second','Third'],
    choices:['Moon','Rain','Candle'], answer:['Rain','Candle','Moon'],
    letterDrawer:2,keyDrawer:1,
    letter:'“Rain on the windows. A candle in the dark. The moon brought me home.”',
    hints:['Look for Ada’s lullaby in the bottom drawer or inspect the dollhouse.','Start with what you hear at the window.','Choose Rain, Candle, then Moon.'],
  },
];

function showLock(sequence=[]){
  const puzzle=puzzles[room];
  if(solved){
    show('The lock is open','You heard metal fall into one of the drawers. Nudge them to find it.');
    return;
  }
  const slot=sequence.length;
  const complete=slot===puzzle.slots.length;
  const options=Array.isArray(puzzle.choices[0])?puzzle.choices[slot]:puzzle.choices;
  const actions=complete
    ?[['Try combination',()=>{
      if(!sequence.every((value,index)=>value===puzzle.answer[index])){fail();return;}
      solved=true;
      close();
      say('The lock clicks. You hear brass drop into one of the drawers.');
      update();
    }]]
    :options.map(value=>[value,()=>showLock([...sequence,value])]);
  if(slot>0)actions.push(['Clear',()=>showLock()]);
  const slots=puzzle.slots.map((label,index)=>`${label} · ${sequence[index]??'—'}`).join('   /   ');
  show(puzzle.title,slots+'\n'+(complete?'Submit this combination.':'Choose '+puzzle.slots[slot].toLowerCase()+'.'),actions);
}
register(clock,'Solve room puzzle',()=>showLock());
register(house,'Inspect dollhouse / music box',()=>show(
  room===2?'Music box':'The little house',
  room===2?'Three notes are scratched underneath: rain, candle, moon. Enter them at the room lock.':
    'There’s a tiny brass latch on the model. Its mechanism runs into the cabinet.'
));

const doorAngles={closed:0,nudged:-.14,open:-1.32};
function stepThrough(){
  if(room<2)advance();
  else finish();
}
function operateDoor(){
  if(doorState==='open'){
    show('The door is open','Something moves in the dark beyond.',[
      ['Step through',stepThrough],
      ['Shut door',close],
    ]);
  }else if(hasKey){
    doorState='nudged';
    show('The door gives','The brass key turns. You can push the door the rest of the way.',[
      ['Open door',()=>{doorState='open';operateDoor();}],
      ['Shut door',close],
    ]);
  }else{
    doorState='nudged';
    show('The chain catches','The door moves a little, then catches. The room lock releases a brass key.',[
      ['Shut door',close],
    ]);
  }
}
register(door,'Nudge door',operateDoor);

function showLetter(){
  found=true;
  show('Ada’s letter',puzzles[room].letter,[['Shut drawer',close]]);
  update();
}
function takeKey(drawer){
  if(drawer.state!=='open'||drawer.tray!==key.parent||!solved||hasKey)return;
  hasKey=true;
  key.visible=false;
  show('The room key','You lift the brass key from the drawer. It fits the door.',[['Shut drawer',close]]);
  say('You have the key. Get to the door.');
  update();
}
function frameDrawer(drawer){
  const target=cabinet.position.clone().add(new T.Vector3(0,drawer.tray.position.y,0));
  const front=drawer.state==='open'?1.38:1.19;
  zoomTarget=target.clone().add(new T.Vector3(-.14,1.17,front));
  lookTarget=target.add(new T.Vector3(-.055,-.16,drawer.state==='open'?.62:.33));
}
function setDrawer(drawer,state){
  drawer.state=state;
  const hasVisibleKey=state==='open'&&drawer.tray===key.parent&&solved&&!hasKey;
  frameDrawer(drawer);
  const actions=[['Shut drawer',close]];
  if(state==='nudged'){
    actions.unshift(['Pull open',()=>setDrawer(drawer,'open')]);
    show(drawer.name,'The drawer moves a little. Pull again to see inside.',actions);
    return;
  }
  if(hasVisibleKey)actions.unshift(['Take brass key',()=>takeKey(drawer)]);
  if(drawer.tray===letter.parent)actions.unshift(['Read Ada’s letter',showLetter]);
  const contents=[
    drawer.tray===letter.parent?'Ada’s letter rests in the tray.':'',
    hasVisibleKey?'Click the brass key to pick it up.':'',
  ].filter(Boolean);
  show(drawer.name,contents.join(' ')||'The tray is empty.',actions);
}
for(const drawer of drawers){
  register(drawer.tray,'Nudge '+drawer.name.toLowerCase(),()=>setDrawer(drawer,'nudged'));
  drawer.tray.userData.drawer=drawer;
}

register(win,'Inspect window',()=>show('Beyond the glass',room===2?'A small handprint appears in the mist. Ada is still alive.':'Fresh footprints stop beneath the window. A courier has been watching the house.'));
register(candle,'Inspect candle',()=>show('Warm wax','Someone was here moments ago. The wax is still warm.'));
// Every visible furnishing can be inspected; searching is safe.
const labeled=new Set(interact);for(const obj of [...scene.children]){if(obj.isMesh&&!labeled.has(obj))register(obj,'Search '+(room===0?'room':'corner'),()=>show('A quiet corner','Dust, scratches, and signs of someone passing. The photograph, clock, drawer, and door carry the strongest clues.'));}
function update(){document.querySelector('#threat').textContent=threatLabels[threat];document.querySelector('#objective').textContent=!found?'Inspect the photograph or search the drawers for clues.':!solved?'Use the clue to solve the room lock.':!hasKey?'The lock is open. Search the drawers for the brass key.':'You have the key. Open the door.';document.querySelector('#progress').textContent='Room '+(room+1)+' / 3 · '+mistakes+' mistakes';}
function thud(volume,delay,frequency,pan=0){
  if(!context||document.querySelector('#sound').getAttribute('aria-pressed')==='false')return;
  const time=context.currentTime+delay;
  const tone=context.createOscillator();
  const gain=context.createGain();
  const stereo=context.createStereoPanner();
  tone.frequency.setValueAtTime(frequency,time);
  tone.frequency.exponentialRampToValueAtTime(frequency*.52,time+.18);
  gain.gain.setValueAtTime(.0001,time);
  gain.gain.exponentialRampToValueAtTime(volume,time+.013);
  gain.gain.exponentialRampToValueAtTime(.0001,time+.2);
  stereo.pan.value=pan;
  tone.connect(gain).connect(stereo).connect(context.destination);
  tone.start(time);
  tone.stop(time+.21);
}
function playKnock(volume){
  for(let i=0;i<3;i++)thud(volume,i*.27,85,-.5);
}
document.querySelector('#sound').onclick=e=>{
  const enabled=e.currentTarget.getAttribute('aria-pressed')==='false';
  e.currentTarget.setAttribute('aria-pressed',String(enabled));
  e.currentTarget.textContent=enabled?'Sound on':'Sound off';
  if(enabled)context?.resume();
};
document.querySelector('#next').onclick=()=>{if(ending){location.reload();return}if(storyStep++===0){document.querySelector('#storyTitle').textContent='Tonight, she wrote to you.';document.querySelector('#storyText').textContent='An envelope arrived without a stamp. Inside was Ada’s handwriting: “I did not climb out. You turned the house. Come back before the clock remembers.” You unlock Briar House. Three knocks come from inside.';document.querySelector('#next').textContent='Take the lantern';}else{started=true;document.querySelector('#story').style.display='none';if(window.AudioContext){context=new AudioContext();context.resume().catch(()=>{});}playKnock(.14);nextStep=performance.now()+6500;say('The photograph on the desk. Wasn’t someone standing beside you?');}};
document.querySelector('#light').onclick=()=>{on=!on;document.querySelector('#light').textContent='Lantern '+(on?'on':'off')};addEventListener('keydown',e=>{if(e.code==='Escape'&&!inspection.classList.contains('hidden'))close();if(e.code==='KeyL')document.querySelector('#light').click();if(e.code==='KeyR')location.reload()});
let hintLevel=0;
document.querySelector('#hint').onclick=()=>{
  if(!started||ending)return;
  const puzzle=puzzles[room];
  if(hasKey){
    show('Hint','Use the brass key at the door, then step through.');
  }else if(solved){
    show('Hint','Nudge the '+drawerNames[puzzle.keyDrawer].toLowerCase()+' and pull it open to find the brass key.');
  }else{
    hintLevel=Math.min(hintLevel+1,puzzle.hints.length);
    show('Hint '+hintLevel+' / '+puzzle.hints.length,puzzle.hints[hintLevel-1]);
  }
};
function inspectObject(object){
  if(!started||ending)return;
  keys.clear();
  if(!inspecting&&!zoomTarget){
    home.position.copy(camera.position);
    home.yaw=yaw;
    home.pitch=pitch;
  }
  if(inspectedObject===object&&object.userData.drawer){
    const drawer=object.userData.drawer;
    if(drawer.state==='nudged')setDrawer(drawer,'open');
    else if(drawer.state==='open')close();
    else setDrawer(drawer,'nudged');
    return;
  }
  if(inspectedObject!==object)shutProps();
  inspecting=true;
  inspectedObject=object;
  lookTarget=object.getWorldPosition(new T.Vector3());
  zoomTarget=lookTarget.clone().add(new T.Vector3(0,.12,1.15));
  if(object===door){
    lookTarget.y-=.17;
    zoomTarget=door.position.clone().add(new T.Vector3(-.12,.14,2.35));
  }
  object.userData.action();
}
for(const [label,object] of [
  ['Photograph',photo],['Room lock',clock],['Dollhouse',house],['Door',door],
  ...drawers.map(drawer=>[drawer.name,drawer.tray]),
]){
  const button=document.createElement('button');
  button.textContent=label;
  button.onclick=()=>inspectObject(object);
  document.querySelector('#objects').append(button);
}
const pointer=new T.Vector2();const ray=new T.Raycaster();let down=false,last=0,pitch=0; const keys=new Set(); addEventListener('keydown',e=>keys.add(e.code)); addEventListener('keyup',e=>keys.delete(e.code)); addEventListener('blur',()=>keys.clear());
function hitObject(event){
  const bounds=renderer.domElement.getBoundingClientRect();
  pointer.set((event.clientX-bounds.left)/bounds.width*2-1,1-(event.clientY-bounds.top)/bounds.height*2);
  ray.setFromCamera(pointer,camera);
  const hit=ray.intersectObjects(interact,true).find(({object})=>object.parent!==key||key.visible);
  let object=hit?.object;
  while(object&&!object.userData.action)object=object.parent;
  return {object,mesh:hit?.object};
}
let dragDistance=0;
renderer.domElement.onpointerdown=e=>{
  down=true;
  dragDistance=0;
  last=e.clientX;
  renderer.domElement.setPointerCapture(e.pointerId);
};
renderer.domElement.onpointermove=e=>{
  const {object,mesh:hit}=hitObject(e);
  const drawer=object?.userData.drawer;
  const label=drawer?.state==='open'&&hit?.parent===key?'Take brass key':
    drawer?.state==='open'&&hit?.parent===letter?'Read Ada’s letter':
    drawer?.state==='nudged'?'Pull open':
    drawer?.state==='open'&&hit?.parent===drawer.front?'Shut drawer':
    object===door&&doorState==='open'?(hit===doorway?'Step through':'Shut door'):
    object===door&&doorState==='nudged'&&hasKey?'Open door':
    object?.userData.name;
  document.querySelector('#hover').textContent=started&&!ending?(label||''):'';
  renderer.domElement.style.cursor=started&&!ending&&label?'pointer':'';
  if(down&&!inspecting){
    dragDistance+=Math.abs(e.clientX-last)+Math.abs(e.movementY);
    yaw-=(e.clientX-last)*.003;
    pitch=Math.max(-1.1,Math.min(1.1,pitch-e.movementY*.003));
    last=e.clientX;
  }
};
renderer.domElement.onpointercancel=()=>{down=false;};
renderer.domElement.onpointerup=e=>{
  down=false;
  if(!started||ending||dragDistance>=5)return;
  const {object,mesh:hit}=hitObject(e);
  const drawer=object?.userData.drawer;
  if(drawer&&object===inspectedObject){
    if(drawer.state==='open'&&hit.parent===key){takeKey(drawer);return;}
    if(drawer.state==='open'&&hit.parent===letter){showLetter();return;}
    if(drawer.state!=='open'||hit.parent===drawer.front)inspectObject(object);
    return;
  }
  if(object===door&&inspectedObject===door){
    if(doorState==='open'){
      if(hit===doorway)stepThrough();
      else close();
    }
    else if(hasKey){doorState='open';operateDoor();}
    return;
  }
  if(object&&(!inspecting||drawer||object===door))inspectObject(object);

};
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}resize();addEventListener('resize',resize);
const timer=document.querySelector('#timer');
const danger=document.querySelector('#danger');
const activeThreat=new T.Vector3();
function renderTimer(){
  const seconds=Math.ceil(remaining);
  timer.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}
function tick(){
  const now=performance.now();
  const elapsed=(now-lastTime)/1000;
  lastTime=now;
  const dt=Math.min(elapsed,.05);
  if(started&&!ending){
    remaining=Math.max(0,remaining-elapsed);
    renderTimer();
    if(remaining===0){
      ending=true;
      close();
      document.querySelector('#story').style.display='flex';
      document.querySelector('#storyTitle').textContent='The courier found you.';
      document.querySelector('#storyText').textContent='The last parcel is addressed to you. Ada is still inside. Try again. The clues are waiting.';
      document.querySelector('#next').textContent='Try again';
    }else if(now>=nextStep){
      const urgency=Math.max(threat,remaining<=60?3:0);
      const volume=.035+urgency*.027;
      thud(volume,0,63,-.65);
      thud(volume*.74,.32,58,-.54);
      nextStep=now+Math.max(1700,8200-urgency*1500);
    }
  }

  const ease=1-Math.exp(-dt*9);
  for(const drawer of drawers){
    drawer.tray.position.z=T.MathUtils.lerp(drawer.tray.position.z,drawerTravel[drawer.state],ease);
    drawer.light.visible=drawer.state!=='closed'||drawer.tray.position.z>.04;
  }
  key.visible=solved&&!hasKey&&key.parent.position.z>.23;
  hinge.rotation.y=T.MathUtils.lerp(hinge.rotation.y,doorAngles[doorState],ease);
  if(zoomTarget){
    camera.position.lerp(zoomTarget,ease);
    if(camera.position.distanceTo(zoomTarget)<.01)zoomTarget=null;
  }
  camera.rotation.set(pitch,yaw,0,'YXZ');
  if(started&&!inspecting&&!ending){
    const dx=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);
    const dz=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0);
    const nx=camera.position.x+(dx*Math.cos(yaw)+dz*Math.sin(yaw))*dt*1.1;
    const nz=camera.position.z+(-dx*Math.sin(yaw)+dz*Math.cos(yaw))*dt*1.1;
    if(!(Math.abs(nx)<1.9&&nz<-.4&&nz>-2.05)&&Math.abs(nx)<3.65&&nz>-2.55&&nz<4.1){
      camera.position.x=nx;
      camera.position.z=nz;
    }
  }
  if(inspecting&&lookTarget)camera.lookAt(lookTarget);

  if(silhouette.visible&&threat>0){
    const [x,z]=courierRoute[threat-1];
    activeThreat.set(x,0,z);
    silhouette.position.lerp(activeThreat,1-Math.exp(-dt*1.25));
    silhouette.lookAt(camera.position.x,0,camera.position.z);
    courierBacklight.intensity=.7+threat*.28;
  }
  danger.style.opacity=String(started&&!ending?Math.min(.72,threat*.12+(remaining<=60?.2:0)):0);
  lamp.position.copy(camera.position);
  lamp.target.position.copy(camera.position).add(camera.getWorldDirection(activeThreat).multiplyScalar(6));
  lamp.intensity=on?25:0;
  glow.intensity=1.7+Math.sin(now*.004)*.15;
  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}
tick();
