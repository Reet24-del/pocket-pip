import * as T from 'three';
import {setupImmersive} from './immersive.js';
const scene=new T.Scene();scene.background=new T.Color(0x080f13);scene.fog=new T.Fog(0x080f13,7,15);
const renderer=new T.WebGLRenderer({canvas:document.querySelector('#game'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const camera=new T.PerspectiveCamera(52,1,.05,25);camera.position.set(0,1.65,4.3);
const playerRig=new T.Group();
playerRig.add(camera);
scene.add(playerRig);
scene.add(new T.HemisphereLight(0x718b99,0x2d231b,.7));
const lamp=new T.SpotLight(0xffd59a,25,15,.54,.7,1.2);scene.add(lamp);scene.add(lamp.target);lamp.castShadow=true;
let on=true,started=false,hasKey=false,ending=false,yaw=0,storyStep=0,context;
const cap=document.querySelector('#caption');
let captionTimeout;
function say(text){
  cap.textContent=text;
  cap.classList.add('visible');
  clearTimeout(captionTimeout);
  captionTimeout=setTimeout(()=>cap.classList.remove('visible'),5500);
}
const mat=(c)=>new T.MeshStandardMaterial({color:c,roughness:.7});
function mesh(g,m,x,y,z,parent=scene){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);o.castShadow=true;o.receiveShadow=true;return o}
function box(w,h,d,c,x,y,z,p=scene){return mesh(new T.BoxGeometry(w,h,d),typeof c==='number'?mat(c):c,x,y,z,p)}
function texture(draw){const c=document.createElement('canvas');c.width=c.height=512;draw(c.getContext('2d'));return new T.CanvasTexture(c)}
const wood=texture(c=>{c.fillStyle='#493529';c.fillRect(0,0,512,512);for(let i=0;i<100;i++){c.strokeStyle='rgba(10,4,1,.12)';c.beginPath();c.moveTo(0,i*5);c.lineTo(512,i*5+Math.sin(i)*18);c.stroke()}});
const wm=new T.MeshStandardMaterial({map:wood,roughness:.82});
const floor=box(8,.12,9,wm,0,-.1,0);const backWall=box(8,4,.15,0x34433a,0,2,-3);for(const x of [-4,4])box(.15,4,9,0x25352f,x,2,0);box(8,.1,9,0x18231f,0,4,0);
for(let x=-4;x<=4;x+=.45)box(.012,.012,9,0x1d1d17,x,-.03,0);
for(let x=-3.9;x<4;x+=.4)box(.025,1,.03,0x1e2922,x,.5,-2.88);
box(8,.07,.11,0x645440,0,1,-2.87);box(8,.11,.14,0x665642,0,.08,-2.85);
const study=new T.Group();scene.add(study);
box(3.5,.14,1.2,wm,0,.97,-1.5,study);for(const x of [-1.5,1.5])for(const z of [-1.95,-1.05])box(.1,.95,.1,wm,x,.45,z,study);
const interact=[];
function register(group,name,action){group.userData.name=name;group.userData.action=action;interact.push(group)}
const photo=new T.Group();photo.position.set(-1.12,1.43,-1.5);photo.rotation.x=-.1;study.add(photo);
box(.85,.68,.07,0x30271d,0,0,0,photo);
for(const x of [-.42,.42])box(.055,.72,.08,0xa58b5c,x,0,.04,photo);for(const y of [-.34,.34])box(.9,.055,.08,0xa58b5c,0,y,.04,photo);
const picture=texture(c=>{c.fillStyle='#9b927a';c.fillRect(0,0,512,512);c.fillStyle='#626758';for(let i=0;i<7;i++)c.fillRect(i*90,0,8,512);c.fillStyle='#363d35';c.fillRect(0,370,512,142);c.fillStyle='#3b3b32';c.beginPath();c.ellipse(178,330,62,140,0,0,7);c.fill();c.fillStyle='#d1b68e';c.beginPath();c.arc(178,177,44,0,7);c.fill();c.fillStyle='#574d3b';c.beginPath();c.arc(178,158,46,Math.PI,Math.PI*2);c.fill();c.strokeStyle='#ddd0b3';c.lineWidth=3;c.strokeRect(296,195,100,210)});
const familyTexture=new T.TextureLoader().load('./briar-family.jpg'); familyTexture.colorSpace=T.SRGBColorSpace;
mesh(new T.PlaneGeometry(.74,.57),new T.MeshBasicMaterial({map:familyTexture}),0,0,.05,photo);
const clock=new T.Group();clock.position.set(0,2.28,-2.83);study.add(clock);
mesh(new T.CylinderGeometry(.39,.39,.1,48),mat(0x705537),0,0,0,clock).rotation.x=Math.PI/2;
const face=texture(c=>{c.fillStyle='#d2c5a4';c.fillRect(0,0,512,512);c.fillStyle='#302d25';c.font='32px Georgia';c.textAlign='center';for(let i=1;i<=12;i++){let a=i*Math.PI/6;c.fillText(i,256+180*Math.sin(a),267-180*Math.cos(a))}});
mesh(new T.CircleGeometry(.345,64),new T.MeshBasicMaterial({map:face,transparent:false}),0,0,.06,clock);
const needle=box(.018,.19,.015,0x292c24,0,.08,.08,clock);
const minutes=box(.25,.013,.015,0x292c24,.1,0,.09,clock);
const house=new T.Group();house.position.set(.65,1.05,-1.4);study.add(house);
box(.7,.08,.62,wm,0,0,0,house);box(.62,.48,.5,0x92927c,0,.27,0,house);
const roof=mesh(new T.ConeGeometry(.5,.35,4),mat(0x3c4843),0,.67,0,house);roof.rotation.y=Math.PI/4;
box(.12,.2,.03,0x493d2b,0,.16,.27,house);
for(const x of [-.2,.2]){box(.11,.13,.02,0x142d33,x,.35,.26,house);box(.01,.13,.03,0x877753,x,.35,.28,house); }
const cabinet=new T.Group();
cabinet.position.set(-3.56,.44,1.15);
cabinet.rotation.y=Math.PI/2;
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
const keyBrass=new T.MeshStandardMaterial({
  color:0xe7bc66,roughness:.34,metalness:.32,emissive:0x684213,emissiveIntensity:.38,
});
key.scale.setScalar(1.16);
mesh(new T.TorusGeometry(.032,.009,12,24),keyBrass,0,0,0,key);
box(.102,.014,.016,keyBrass,.08,0,0,key);
for(const x of [.099,.124])box(.013,.029,.014,keyBrass,x,-.013,0,key);
key.visible=false;
// A transparent hit surface makes the key's bow and shaft one clickable target.
const keyHit=mesh(new T.PlaneGeometry(.21,.13),new T.MeshBasicMaterial({
  transparent:true,opacity:0,depthWrite:false,
}),.052,-.008,.012,key);
keyHit.castShadow=false;
keyHit.receiveShadow=false;
const crank=new T.Group();
crank.position.set(.11,-.062,.035);
drawers[2].tray.add(crank);
box(.17,.022,.025,0x9f8349,0,0,0,crank);
box(.028,.025,.078,0x9f8349,.07,0,-.03,crank);
box(.032,.024,.054,0x45362f,-.062,.014,.024,crank);
crank.visible=false;
const inventory=new Set();
let selectedItem=null;
let musicWound=false;
const itemNames={
  key:'Brass key',
  crank:'Winding crank',
  familyPhoto:'Family photograph',
  adaPhoto:'Ada’s photograph',
};
const inventoryPhotos={
  familyPhoto:{title:'Family photograph',text:'A space in the family portrait marks where Ada stood. On the frame she scratched “I counted a quarter of the clock.”'},
  adaPhoto:{title:'Ada’s photograph',text:'Ada is behind glass. The courier wrote “I know which room you’re in” on the back.'},
};

function viewPhoto(item){
  const {title,text}=inventoryPhotos[item];
  show(title,text);
  document.querySelector('#close').focus();
}

function takePhoto(item){
  inventory.add(item);
  update();
  viewPhoto(item);
}

function photoActions(item){
  const label=item==='adaPhoto'?'Take Ada’s photograph':'Take family photograph';
  return inventory.has(item)?[]:[[label,()=>takePhoto(item)]];
}

function toggleItem(item){
  selectedItem=selectedItem===item?null:item;
  update();
  document.querySelector('#inventory button[aria-pressed="true"]')?.focus();
}

function useItem(item){
  if(!inventory.has(item)||selectedItem!==item)return false;
  inventory.delete(item);
  selectedItem=null;
  update();
  return true;
}
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
const doorKnob=mesh(new T.SphereGeometry(.045),mat(0xbfa069),.4,-.1,.15,doorLeaf);
let lockedKnobUntil=0;
let doorUnlocked=false;
let doorState='closed';
for(let x of [1.95,3.25])box(.13,2.85,.17,0x7b6a4d,x,1.4,-2.8);box(1.42,.13,.17,0x7b6a4d,2.6,2.8,-2.8);
const win=new T.Group();win.position.set(-2.55,2,-2.8);study.add(win);box(1.4,1.65,.07,0x132b35,0,0,0,win);for(let x of [-.75,0,.75])box(.06,1.8,.1,0x7d725c,x,0,.04,win);box(1.55,.06,.1,0x7d725c,0,0,.04,win);
for(let y of [-.88,.88])box(1.55,.06,.1,0x7d725c,0,y,.04,win);
const moon=new T.PointLight(0x7596b6,2,5);moon.position.set(-2.4,2,-2);scene.add(moon);
for(let x of [-3.4,-1.7])box(.28,2.2,.13,0x333f38,x,1.8,-2.6,study);
const candle=new T.Group();candle.position.set(-.4,1.05,-1.3);study.add(candle);mesh(new T.CylinderGeometry(.06,.07,.22,12),mat(0xc7b594),0,.11,0,candle);
const flame=mesh(new T.SphereGeometry(.035,10,10),new T.MeshBasicMaterial({color:0xffd080}),0,.25,0,candle);flame.scale.y=1.7;
const glow=new T.PointLight(0xffa65a,1.8,3);glow.position.set(-.4,1.4,-1.3);study.add(glow);
const silhouette=new T.Group();
const coat=mat(0x18191d);
scene.add(silhouette);
const courierBacklight=new T.PointLight(0x819abc,0,2.5);
courierBacklight.position.set(-.4,1.6,-.3);
silhouette.add(courierBacklight);
mesh(new T.CylinderGeometry(.065,.09,.17,14),coat,0,1.52,0,silhouette);
mesh(new T.SphereGeometry(.13,18,12),coat,0,1.69,0,silhouette).scale.set(.83,1.22,.9);
mesh(new T.CylinderGeometry(.19,.19,.034,24),coat,0,1.795,0,silhouette);
mesh(new T.CylinderGeometry(.102,.12,.12,24),coat,0,1.859,0,silhouette);
mesh(new T.CylinderGeometry(.23,.31,.85,24),coat,0,1.06,0,silhouette).scale.z=.66;
const courierLegs=[];
const courierArms=[];
for(const x of [-.15,.15]){
  const leg=new T.Group();
  leg.position.set(x,.66,0);
  silhouette.add(leg);
  courierLegs.push(leg);
  const arm=new T.Group();
  arm.position.set(x*1.88,1.4,0);
  silhouette.add(arm);
  courierArms.push(arm);
  box(.123,.66,.125,coat,0,-.33,0,leg);
  box(.135,.09,.23,coat,0,-.60,.046,leg);
  box(.11,.58,.12,coat,0,-.26,0,arm).rotation.z=x*.8;
}
for(const x of [-.05,.05]){
  mesh(new T.SphereGeometry(.014,8,8),new T.MeshBasicMaterial({color:0xc3b59b}),x,1.705,.11,silhouette);
}
silhouette.visible=false;
const heldParcel=new T.Group();
heldParcel.position.set(-.075,-.52,.04);
courierArms[1].add(heldParcel);
box(.30,.21,.15,0xa67c52,0,0,0,heldParcel);
box(.025,.215,.153,0x4e2c1f,.075,0,0,heldParcel);
box(.302,.024,.153,0x4e2c1f,0,0,0,heldParcel);
box(.12,.07,.004,0xe2cb9e,-.055,.044,.078,heldParcel);
heldParcel.visible=false;
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
function turnedLeg(x,z){const pts=[];for(let i=0;i<35;i++){let y=i/34*.9;let r=.065+.025*Math.sin(i*.65)+.02*Math.exp(-Math.pow(y-.2,2)/.007);pts.push(new T.Vector2(r,y))}mesh(new T.LatheGeometry(pts,20),wm,x,0,z,study)}
for(const x of [-1.5,1.5])for(const z of [-1.95,-1.05])turnedLeg(x,z);
box(3.6,.035,1.3,wm,0,1.06,-1.5,study);box(3.45,.035,1.22,0x9b7850,0,.88,-1.5,study);
for(const x of [-1.12,0,1.12]){box(1.02,.19,.12,wm,x,.79,-.87,study);mesh(new T.TorusGeometry(.065,.009,8,16),brass,x,.79,-.79,study)}
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
const rain=new T.Group();scene.add(rain);for(let i=0;i<55;i++){box(.003,.04+((i%5)*.015),.004,0x69838b,-3.22+(i%11)*.13,1.35+(i%13)*.11,-2.73,study)}
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
  const viewingPhoto=Object.values(inventoryPhotos).some(photo=>photo.title===title);
  inspection.classList.toggle('viewing-photo',viewingPhoto);
  document.querySelector('#portrait').hidden=!['A space beside you',inventoryPhotos.familyPhoto.title].includes(title);
  document.querySelector('#parcelPhoto').hidden=!['A parcel arrives','A parcel from the courier',inventoryPhotos.adaPhoto.title].includes(title);
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
  document.querySelector('#guide').hidden=true;
  document.querySelector('#journal').setAttribute('aria-expanded','false');
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
let room=0,remaining=720,mistakes=0,solved=false,parcelCount=0;
const gallery=new T.Group();
const nursery=new T.Group();
scene.add(gallery,nursery);
gallery.visible=nursery.visible=false;

function plaque(parent,width,height,x,y,z,lines,background='#332521', foreground='#f1dbac'){
  const map=texture(context=>{
    context.fillStyle=background;
    context.fillRect(0,0,512,512);
    context.strokeStyle='#a58a65';
    context.lineWidth=8;
    context.strokeRect(19,19,474,474);
    context.textAlign='center';
    context.textBaseline='middle';
    context.fillStyle=foreground;
    for(const [index,line] of lines.entries()){
      context.font='bold '+(line.length>13?40:67)+'px Georgia';
      context.fillText(line,256,256+(index-(lines.length-1)/2)*125,448);
    }
  });
  map.colorSpace=T.SRGBColorSpace;
  const face=mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map}),x,y,z,parent);
  face.castShadow=false;
  return face;
}
function prop(parent,x,y,z){
  const object=new T.Group();
  object.position.set(x,y,z);
  parent.add(object);
  return object;
}
const galleryPortraits=[
  {name:'Candle',year:1907,digit:'6',symbol:'♨'},
  {name:'Moon',year:1884,digit:'2',symbol:'☾'},
  {name:'Moth',year:1919,digit:'9',symbol:'✦'},
  {name:'Gate',year:1896,digit:'4',symbol:'▥'},
];
const portraits=galleryPortraits.map(({name,year,digit,symbol},index)=>{
  const frame=prop(gallery,-2.95+index*1.34,2.15,-2.77);
  box(.98,1.35,.13,brass,0,0,0,frame);
  const print=familyTexture.clone();
  print.repeat.set(.22,.44);
  print.offset.set([.07,.26,.42,.7][index],[.28,.52,.43,.39][index]);
  const portrait=mesh(new T.PlaneGeometry(.79,.8),new T.MeshBasicMaterial({map:print,color:0xcbb6a1}),0,.14,.071,frame);
  portrait.castShadow=false;
  plaque(frame,.79,.28,0,-.43,.072,[symbol+' '+name,String(year)],'#28151e');
  register(frame,name+' portrait',()=>{
    remember(name+' portrait',year+' · seal '+digit);
    show(name+' portrait','The plate reads '+year+'. The seal on the back is stamped '+digit+'.');
    if(index===2&&!mothMoved){
      mothMoved=true;
      frame.rotation.z=-.075;
      thud(.14,.35,108,-.6);
    }
  });
  return frame;
});
let mothMoved=false;
const galleryLock=prop(gallery,-.52,.91,-1.32);
box(1.15,.22,.64,0x7d736d,0,-.05,0,galleryLock);
box(.92,.72,.51,0x3c3638,0,-.53,0,galleryLock);
plaque(galleryLock,.87,.19,0,.02,.33,['ARCHIVE']);
register(galleryLock,'Archive lock',()=>showLock());
const ledger=prop(gallery,-2.45,1.05,-1.55);
box(.85,.12,.53,0xa68a65,0,0,0,ledger);
box(.91,.035,.59,0x642a32,0,-.08,0,ledger);
plaque(ledger,.64,.41,0,.069,0,['Briar House','Register']).rotation.x=-Math.PI/2;
box(.92,1.01,.62,0x58333b,ledger.position.x,.49,ledger.position.z,gallery);
register(ledger,'Family register',()=>reveal('Family register','The archive takes four seals. Enter them in order of each portrait’s year, oldest first.'));
for(const x of [-3.76,1.94,3.34]){
  box(.17,3.9,.26,0x988578,x,1.95,-2.72,gallery);
}
const galleryLight=new T.PointLight(0xbc654a,8,9);
galleryLight.position.set(0,2.85,-.6);
gallery.add(galleryLight);
for(const x of [-3.45,1.7]){
  box(.13,.39,.18,brass,x,2.86,-2.65,gallery);
  box(.16,.19,.17,new T.MeshBasicMaterial({color:0xd69254}),x,3.02,-2.52,gallery);
}

const cot=prop(nursery,-2.05,.55,-1.68);
box(1.6,.12,.88,wm,0,-.13,0,cot);
box(1.48,.18,.74,0x837570,0,0,0,cot);
box(.52,.09,.63,0xc0aaa1,-.44,.115,0,cot);
box(.84,.1,.71,0x637986,.23,.13,0,cot);
for(const x of [-.77,.77]){
  for(const z of [-.43,.43])box(.085,1.04,.085,wm,x,0,z,cot);
  box(.09,.07,.91,wm,x,.49,0,cot);
}
for(let x=-.68;x<.72;x+=.15)box(.034,.47,.045,wm,x,.17,-.41,cot);
register(cot,'Empty cot',()=>reveal('Empty cot','A warm hollow in the blanket. Under the pillow Ada drew an arrow pointing from the music box to the mirror.'));
const mobile=prop(nursery,-1.95,2.15,-1.70);
box(.012,1.9,.012,0x988777,0,.94,0,mobile);
const mobileArm=prop(mobile,0,0,0);
box(1.04,.036,.04,wm,0,0,0,mobileArm);
const tokens=['Bird','Bell','Moon','Star'];
for(const [index,name] of tokens.entries()){
  const x=(index-1.5)*.31;
  box(.008,.28,.008,0xc6b195,x,-.15,0,mobileArm);
  plaque(mobileArm,.2,.19,x,-.36,0,[name],'#394c59');
}
register(mobile,'Hanging mobile',()=>reveal('Hanging mobile','The chimes are numbered by pitch, lowest to highest. Bird is 1, Bell is 2, Moon is 3, and Star is 4.'));
const score=prop(nursery,.15,1.03,-1.55);
box(.84,.14,.63,wm,0,-.09,0,score);
box(.75,.96,.53,wm,score.position.x,.43,score.position.z,nursery);
plaque(score,.60,.45,0,-.011,0,['Ada’s tune','2   4   1   3'],'#bd9f71','#2a2632').rotation.x=-Math.PI/2;
register(score,'Sheet music',()=>reveal('Sheet music','Ada pencilled 2, 4, 1, 3 over the notes. A second line reads “When it plays, turn to the glass.”'));
const musicBox=prop(nursery,1.15,.83,-1.5);
box(.77,.23,.56,wm,0,0,0,musicBox);
box(.77,.06,.58,0x85705c,0,.145,0,musicBox);
plaque(musicBox,.66,.18,0,.025,.292,['MUSIC BOX'],'#4a3942');
box(.84,.72,.67,wm,musicBox.position.x,.34,musicBox.position.z,nursery);
register(musicBox,'Music box',()=>{
  if(!musicWound&&useItem('crank')){
    musicWound=true;
    thud(.09,0,144);
  }
  if(musicWound){
    showLock();
    return;
  }
  show('Music box','The winding spindle is bare. Find its crank and select it from your inventory.',inventory.has('crank')
    ?[['Use winding crank',()=>{selectedItem='crank';musicBox.userData.action();}]]
    :[]);
});
const mirror=prop(nursery,-.23,2.1,-2.79);
box(1.86,2.13,.12,brass,0,0,0,mirror);
plaque(mirror,1.69,1.96,0,0,.069,[''],'#344953','#9bbec4');
const mirrorMessage=prop(mirror,0,0,.005);
plaque(mirrorMessage,1.69,1.96,0,0,.069,['ADA','★  ☾  ♫'],'#30424c','#c9e9e9');
mirrorMessage.visible=false;
register(mirror,'Nursery mirror',()=>{
  if(!melodyPlayed){
    show('Nursery mirror','Cold glass. Someone has written “Play it first” in the dust.');
    return;
  }
  remember('Mirror marks','Star · Moon · Bell');
  show('Mirror marks','Three marks appear in Ada’s breath. A star, a moon, then a bell.',[['Set the mirror latches',()=>showLock()]]);
});
const rocker=prop(nursery,2.12,.2,.75);
for(const x of [-.27,.27]){
  const rail=mesh(new T.TorusGeometry(.51,.043,8,26,1.16),wm,x,.19,0,rocker);
  rail.rotation.set(Math.PI/2,Math.PI/2,0);
  for(const z of [-.24,.24])box(.055,.63,.06,wm,x,.28,z,rocker);
}
box(.61,.082,.63,wm,0,.55,0,rocker);
box(.66,.69,.085,wm,0,.87,-.26,rocker);
const nurseryLight=new T.PointLight(0x80abc6,14,9);
nurseryLight.position.set(-1,2.7,-.8);
nursery.add(nurseryLight);

const ada=prop(door,0,-1.24,.12);
const dress=mat(0x5b6075);
const hair=mat(0x392a2a);
const skin=mat(0xb69b8a);
mesh(new T.CylinderGeometry(.11,.27,.85,26),dress,0,.55,0,ada);
mesh(new T.SphereGeometry(.128,24,16),hair,0,1.12,.005,ada).scale.y=1.19;
mesh(new T.SphereGeometry(.107,24,16),skin,0,1.108,.078,ada).scale.y=1.1;
for(const x of [-.15,.15]){
  box(.064,.43,.07,dress,x,.74,.035,ada).rotation.z=x;
  box(.072,.09,.126,0x2f2624,x*.62,.09,.04,ada);
}
const adaLight=new T.PointLight(0xbacde6,2,1.8);
adaLight.position.set(.3,1.48,.42);
ada.add(adaLight);
ada.visible=false;

const finishes=[
  {wall:backWall.material,floor:wm,sky:0x080f13},
  {wall:mat(0x502531),floor:mat(0x63514b),sky:0x170b14},
  {wall:mat(0x3c5267),floor:mat(0x3c3f55),sky:0x0a1527},
];
const clueBook=document.querySelector('#clues');
function remember(title,text){
  const entry=[...clueBook.children].find(item=>item.dataset.title===title);
  if(!entry){
    const note=document.createElement('li');
    note.dataset.title=title;
    note.textContent=title+' · '+text;
    clueBook.append(note);
  }
  update();
}
function reveal(title,text){
  remember(title,text);
  show(title,text);
}
let melodyPlayed=false;
let roomEntered=0;
const rooms=['The study','The portrait gallery','Ada’s nursery'];
const home={position:camera.position.clone(),yaw:0,pitch:0}; let inspecting=false,zoomTarget=null,lookTarget=null,lastTime=performance.now();
function advance(){
  close();
  room++;
  hintLevel=0;
  roomEntered=performance.now();
  solved=hasKey=melodyPlayed=musicWound=false;
  doorUnlocked=false;
  inventory.delete('key');
  inventory.delete('crank');
  selectedItem=null;
  key.visible=false;
  clueBook.replaceChildren();
  for(const drawer of drawers)drawer.tray.position.z=0;
  hinge.rotation.y=0;
  drawers[puzzles[room].letterDrawer].tray.add(letter);
  drawers[puzzles[room].keyDrawer].tray.add(key);
  study.visible=room===0;
  gallery.visible=room===1;
  nursery.visible=room===2;
  cabinet.position.z=room===1?2.05:1.15;
  const finish=finishes[room];
  backWall.material=finish.wall;
  floor.material=finish.floor;
  scene.background.setHex(finish.sky);
  scene.fog.color.copy(scene.background);
  const entrance=new T.Vector3(room===1?1.2:0,1.65,4.05);
  camera.position.copy(entrance);
  home.position.copy(entrance);
  home.pitch=home.yaw=pitch=yaw=0;
  zoomTarget=null;
  document.querySelector('#roomName').textContent=rooms[room];
  refreshNavigation();
  immersive.resetPosition();
  say(room===1?'The frames creak in their hooks. A name has been scratched off the register.':'A small chair is rocking. Ada’s bed is still warm.');
  thud(.16,.6,room===1?96:58,.55);
  update();
}
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
    const position=room===0?[-.81+parcelCount*.25,1.105,-1.1]:[.7+parcelCount*.33,.025,.7];
    parcelCount++;
    parcel.position.set(...position);
    [study,gallery,nursery][room].add(parcel);
    box(.22,.085,.16,0x967952,0,0,0,parcel);
    box(.014,.089,.164,0x584535,0,0,0,parcel);
    box(.223,.089,.014,0x584535,0,0,0,parcel);
    register(parcel,'Parcel from the courier',()=>show(
      'A parcel from the courier',
      inventoryPhotos.adaPhoto.text,
      photoActions('adaPhoto'),
    ));
  }
  const warning=threatLines[threat-1];
  show('A parcel arrives','Wrong combination. The lock is still closed and the key hasn’t dropped. You lost 30 seconds. '+warning,[
    ...photoActions('adaPhoto'),
    ['Try again',()=>showLock()],
  ]);
  say(warning);
  nextStep=performance.now()+450;
  update();
}
register(photo,'Inspect photograph',()=>{
  const {text}=inventoryPhotos.familyPhoto;
  remember('A space beside you',text);
  show('A space beside you',text,photoActions('familyPhoto'));
});
const puzzles=[
  {
    title:'Set the clock',slots:['Hour','Minute'],
    choices:[['12','3','6','9'],['00','15','30','45']],answer:['3','15'],
    letterDrawer:0,keyDrawer:0,
    letter:'“The third hour struck. I waited where we had taken the photograph.”',
    hints:['The photograph and the top drawer carry different parts of the time.','The letter gives the hour. A quarter of an hour is 15 minutes.','Set Hour to 3 and Minute to 15.'],
  },
  {
    title:'Archive lock',slots:['First','Second','Third','Fourth'],
    choices:['2','4','6','9'],answer:['2','4','6','9'],
    letterDrawer:1,keyDrawer:2,
    letter:'“The numbers on the backs of the frames are the seals. Mother’s register tells you which comes first.”',
    hints:['Read the family register and inspect each portrait to learn its year and seal.','Sort the portraits from oldest to newest. The moon predates the gate.','Enter 2, 4, 6, 9.'],
  },
  {
    title:'Music box',slots:['First','Second','Third','Fourth'],
    choices:tokens,answer:['Bell','Star','Bird','Moon'],
    letterDrawer:2,keyDrawer:1,
    letter:'“Match my sheet music to the chimes on the mobile. When the box plays, the mirror will remember me.”',
    hints:['Read the sheet music and inspect the hanging mobile.','Translate each number on the sheet into its matching chime.','Play Bell, Star, Bird, Moon and examine the mirror.'],
  },
];
const mirrorPuzzle={
  title:'Mirror latches',slots:['First','Second','Third'],
  choices:['Bird','Bell','Moon','Star'],answer:['Star','Moon','Bell'],
  hints:['The tune wakes the mirror. Examine it to see the marks.','The marks are read from left to right.','Set Star, Moon, Bell.'],
};
const chimePitch={Bird:262,Bell:330,Moon:392,Star:523};

function showLock(sequence=[]){
  if(solved){
    const name=drawerNames[puzzles[room].keyDrawer].toLowerCase();
    show('The lock is open',hasKey?'You’ve already collected the brass key.':'The brass key dropped into the '+name+'. Pull it fully open to pick it up.');
    return;
  }
  if(room===2&&melodyPlayed&&inspectedObject!==mirror){
    show('Music box','The tune has finished. Look at the mirror.');
    return;
  }
  const puzzle=room===2&&melodyPlayed?mirrorPuzzle:puzzles[room];
  const slot=sequence.length;
  const complete=slot===puzzle.slots.length;
  const options=Array.isArray(puzzle.choices[0])?puzzle.choices[slot]:puzzle.choices;
  const actions=complete
    ?[['Try combination',()=>{
      if(sequence.length!==puzzle.answer.length||!puzzle.answer.every((value,index)=>value===sequence[index])){fail();return;}
      if(room===2&&!melodyPlayed){
        melodyPlayed=true;
        hintLevel=0;
        mirrorMessage.visible=true;
        sequence.forEach((note,index)=>thud(.12,index*.23,chimePitch[note]));
        close();
        say('The music stops. In the mirror, someone breathes against the glass.');
        update();
        return;
      }
      solved=true;
      close();
      const name=drawerNames[puzzles[room].keyDrawer].toLowerCase();
      say('Lock solved. The brass key dropped into the '+name+'.');
      show('Lock solved','The brass key has dropped into the '+name+'. Pull it fully open to pick up the key.');
      thud(.14,.08,125);
      update();
    }]]
    :options.map(value=>[value,()=>{
      if(room===2&&!melodyPlayed)thud(.08,0,chimePitch[value]);
      showLock([...sequence,value]);
    }]);
  if(slot>0)actions.push(['Clear',()=>showLock()]);
  show(puzzle.title,puzzle.slots.map((label,index)=>label+' · '+(sequence[index]??'—')).join('   /   ')+'\n'+(complete?'Submit this combination.':'Choose '+puzzle.slots[slot].toLowerCase()+'.'),actions);
}
register(clock,'Solve room puzzle',()=>showLock());
register(house,'Inspect dollhouse',()=>show('The little house','The clockwork under its floor runs all the way to the chest.'));

const doorAngles={closed:0,nudged:-.14,open:-1.32};
function stepThrough(){
  if(!solved||!doorUnlocked||doorState!=='open'||ending)return;
  if(room<2)advance();
  else finish();
}
function operateDoor(){
  if(doorUnlocked&&doorState==='open'){
    show('The door is open',room===2?'Ada stands just beyond the threshold. She holds out her hand.':'Something moves in the dark beyond.',[
      [room===2?'Take Ada’s hand':'Step through',stepThrough],
      ['Shut door',close],
    ]);
  }else if(solved&&(doorUnlocked||useItem('key'))){
    doorUnlocked=true;
    update();
    doorState='nudged';
    show('The door gives','The brass key turns. You can push the door the rest of the way.',[
      ['Open door',openUnlockedDoor],
      ['Shut door',close],
    ]);
  }else{
    doorState='closed';
    lockedKnobUntil=performance.now()+420;
    thud(.06,0,115);
    const actions=[];
    if(inventory.has('key'))actions.unshift(['Use brass key',()=>{
      selectedItem='key';
      operateDoor();
    }]);
    show('Door locked',hasKey?'Use the brass key from your inventory.':solved?
      'Pull open the '+drawerNames[puzzles[room].keyDrawer].toLowerCase()+' to collect the brass key.':
      'Solve the room lock before you can collect the brass key.',actions);
  }
}
function openUnlockedDoor(){
  if(!doorUnlocked||!solved)return;
  doorState='open';
  operateDoor();
}
register(door,'Try door handle',operateDoor);

function showLetter(){
  remember('Ada’s letter',puzzles[room].letter);
  show('Ada’s letter',puzzles[room].letter,[['Shut drawer',close]]);
  update();
}
function takeKey(drawer){
  if(drawer.state!=='open'||drawer.tray!==key.parent||!solved||hasKey)return;
  hasKey=true;
  inventory.add('key');
  key.visible=false;
  show('The room key','You lift the brass key from the drawer. It fits the door.',[['Shut drawer',close]]);
  say('You have the key. Get to the door.');
  update();
}
function takeCrank(drawer){
  if(room!==2||drawer.tray!==crank.parent||drawer.state!=='open'||musicWound||inventory.has('crank'))return;
  inventory.add('crank');
  crank.visible=false;
  show('Winding crank','The brass spindle on Ada’s music box would fit this.',[['Shut drawer',close]]);
  update();
}
function frameDrawer(drawer){
  cabinet.updateWorldMatrix(true,false);
  const height=drawer.tray.position.y;
  const front=drawer.state==='open'?1.38:1.19;
  zoomTarget=cabinet.localToWorld(new T.Vector3(-.14,height+1.17,front));
  lookTarget=cabinet.localToWorld(new T.Vector3(-.055,height-.16,drawer.state==='open'?.62:.33));
}
function setDrawer(drawer,state){
  drawer.state=state;
  const hasVisibleKey=state==='open'&&drawer.tray===key.parent&&solved&&!hasKey;
  frameDrawer(drawer);
  const actions=[['Shut drawer',close]];
  if(state==='nudged'){
    actions.unshift(['Pull open',()=>setDrawer(drawer,'open')]);
    show(drawer.name,'The drawer moves a little. Pull again to see inside.',actions);
    setDetailsVisible(false);
    return;
  }
  const hasCrank=room===2&&drawer.tray===crank.parent&&!musicWound&&!inventory.has('crank');
  if(hasCrank)actions.unshift(['Take winding crank',()=>takeCrank(drawer)]);
  if(hasVisibleKey)actions.unshift(['Take brass key',()=>takeKey(drawer)]);
  if(drawer.tray===letter.parent)actions.unshift(['Read Ada’s letter',showLetter]);
  const contents=[
    drawer.tray===letter.parent?'Ada’s letter rests in the tray.':'',
    hasVisibleKey?'Click the brass key to pick it up.':'',
    hasCrank?'A small winding crank lies beside the letter.':'',
  ].filter(Boolean);
  const emptyText=drawer.tray===key.parent&&!solved
    ?'The room lock has to be solved before it releases a key.'
    :'The tray is empty.';
  show(drawer.name,contents.join(' ')||emptyText,actions);
  if(!hasVisibleKey)setDetailsVisible(false);
}
for(const drawer of drawers){
  register(drawer.tray,'Nudge '+drawer.name.toLowerCase(),()=>setDrawer(drawer,'nudged'));
  drawer.tray.userData.drawer=drawer;
}

register(win,'Inspect window',()=>show('Beyond the glass',room===2?'A small handprint appears in the mist. Ada is still alive.':'Fresh footprints stop beneath the window. A courier has been watching the house.'));
register(candle,'Inspect candle',()=>show('Warm wax','Someone was here moments ago. The wax is still warm.'));
function update(){
  document.querySelector('#threat').textContent=threatLabels[threat];
  const search=['Find the time Ada remembers.','Match the portrait seals to the family register.','Recover Ada’s tune from the sheet music and mobile.'];
  document.querySelector('#objective').textContent=hasKey?'You have the key. Open the door.':
    solved?'Collect the brass key from the '+drawerNames[puzzles[room].keyDrawer].toLowerCase()+'.':
    room===2&&melodyPlayed?'Read the marks in the nursery mirror.':search[room];
  document.querySelector('#progress').textContent=(room+1)+' / 3';
  const pockets=document.querySelector('#inventory');
  pockets.replaceChildren();
  document.querySelector('#inventoryLabel').textContent=inventory.size?'Inventory':'Inventory · empty';
  for(const item of inventory){
    const button=document.createElement('button');
    button.textContent=itemNames[item];
    if(item in inventoryPhotos){
      button.onclick=()=>viewPhoto(item);
    }else{
      button.setAttribute('aria-pressed',String(selectedItem===item));
      button.onclick=()=>toggleItem(item);
    }
    pockets.append(button);
  }
  document.body.classList.toggle('using-item',Boolean(selectedItem));
}
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
document.querySelector('#next').onclick=()=>{if(ending){location.reload();return}if(storyStep++===0){document.querySelector('#storyTitle').textContent='Tonight, she wrote to you.';document.querySelector('#storyText').textContent='An envelope arrived without a stamp. Inside was Ada’s handwriting: “I did not climb out. You turned the house. Come back before the clock remembers.” You unlock Briar House. Three knocks come from inside.';document.querySelector('#next').textContent='Take the lantern';}else{started=true;document.body.classList.add('playing');document.querySelector('#story').style.display='none';if(window.AudioContext){context=new AudioContext();context.resume().catch(()=>{});}playKnock(.14);nextStep=performance.now()+6500;update();say('The photograph on the desk. Wasn’t someone standing beside you?');}};
document.querySelector('#light').onclick=()=>{if(ending)return;on=!on;document.querySelector('#light').textContent='Lantern '+(on?'on':'off')};addEventListener('keydown',e=>{if(e.code==='Escape'){
  close();
  document.querySelector('#guide').hidden=true;
  document.querySelector('#journal').setAttribute('aria-expanded','false');
}if(e.code==='KeyL')document.querySelector('#light').click();if(e.code==='KeyR')location.reload()});
let hintLevel=0;
document.querySelector('#hint').onclick=()=>{
  if(!started||ending)return;
  document.querySelector('#guide').hidden=true;
  const puzzle=puzzles[room];
  const hints=room===2&&melodyPlayed?mirrorPuzzle.hints:puzzle.hints;
  if(hasKey){
    show('Hint',doorUnlocked?'Open the door and step through.':'Select the brass key in your inventory and use it at the door.');
  }else if(solved){
    show('Hint','Nudge the '+drawerNames[puzzle.keyDrawer].toLowerCase()+' and pull it open to find the brass key.');
  }else if(room===2&&!musicWound){
    show('Hint',inventory.has('crank')?'Select your winding crank and use it on the music box.':'Search the bottom drawer for the music box’s crank.');
  }else{
    hintLevel=Math.min(hintLevel+1,hints.length);
    show('Hint '+hintLevel+' / '+hints.length,hints[hintLevel-1]);
  }
};
function inspectObject(object){
  if(!started||ending)return;
  keys.clear();
  walking.set(0,0);
  if(!inspecting){
    if(zoomTarget)camera.position.copy(home.position);
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
function refreshNavigation(){
  const nav=document.querySelector('#objects');
  nav.replaceChildren();
  const targets=[
    [['Photograph',photo],['Room lock',clock],['Dollhouse',house]],
    [['Family register',ledger],['Archive lock',galleryLock],...portraits.map((frame,index)=>[galleryPortraits[index].name+' portrait',frame])],
    [['Empty cot',cot],['Hanging mobile',mobile],['Sheet music',score],['Music box',musicBox],['Nursery mirror',mirror]],
  ];
  for(const [label,object] of [...targets[room],['Door',door],...drawers.map(drawer=>[drawer.name,drawer.tray])]){
    const button=document.createElement('button');
    button.textContent=label;
    button.onclick=()=>inspectObject(object);
    nav.append(button);
  }
}
refreshNavigation();
const pointer=new T.Vector2();
const ray=new T.Raycaster();
let down=false,lastX=0,lastY=0,pitch=0;
const keys=new Set();
const walking=new T.Vector2();
const interactiveKeys=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
addEventListener('keydown',event=>{
  if(event.target.matches('input,textarea,select'))return;
  if(interactiveKeys.has(event.code))event.preventDefault();
  keys.add(event.code);
});
addEventListener('keyup',event=>keys.delete(event.code));
addEventListener('blur',()=>{keys.clear();walking.set(0,0);down=false;});
document.querySelector('#journal').onclick=()=>{
  if(ending)return;
  const journal=document.querySelector('#guide');
  journal.hidden=!journal.hidden;
  document.querySelector('#journal').setAttribute('aria-expanded',String(!journal.hidden));
  keys.clear();
  walking.set(0,0);
};
document.querySelector('#closeJournal').onclick=()=>{
  document.querySelector('#guide').hidden=true;
  document.querySelector('#journal').setAttribute('aria-expanded','false');
};
function hitObject(event){
  const bounds=renderer.domElement.getBoundingClientRect();
  pointer.set((event.clientX-bounds.left)/bounds.width*2-1,1-(event.clientY-bounds.top)/bounds.height*2);
  ray.setFromCamera(pointer,camera);
  return hitWorld(ray);
}
function hitWorld(ray){
  const hit=ray.intersectObjects(scene.children,true).find(({object})=>{
    if(!object.isMesh)return false;
    for(let parent=object;parent;parent=parent.parent){
      if(!parent.visible)return false;
    }
    return true;
  });
  let object=hit?.object;
  while(object&&!object.userData.action)object=object.parent;
  return {object,mesh:hit?.object,point:hit?.point};
}
let dragDistance=0;
renderer.domElement.onpointerdown=e=>{
  if(ending)return;
  down=true;
  dragDistance=0;
  lastX=e.clientX;
  lastY=e.clientY;
  renderer.domElement.setPointerCapture(e.pointerId);
};
renderer.domElement.onpointermove=e=>{
  document.querySelector('#hover').style.left=Math.min(innerWidth-130,Math.max(80,e.clientX))+'px';
  document.querySelector('#hover').style.top=Math.min(innerHeight-110,e.clientY+25)+'px';
  const {object,mesh:hit}=hitObject(e);
  const drawer=object?.userData.drawer;
  const label=drawer?.state==='open'&&hit?.parent===key?'Take brass key':
    drawer?.state==='open'&&hit?.parent===crank?'Take winding crank':
    drawer?.state==='open'&&hit?.parent===letter?'Read Ada’s letter':
    drawer?.state==='nudged'?'Pull open':
    drawer?.state==='open'&&hit?.parent===drawer.front?'Shut drawer':
    object===door&&doorState==='open'?(hit===doorway||hit?.parent===ada?(room===2?'Take Ada’s hand':'Step through'):'Shut door'):
    object===door&&selectedItem==='key'?'Use brass key':
    object===musicBox&&selectedItem==='crank'?'Use winding crank':
    object===door&&doorState==='nudged'&&doorUnlocked?'Open door':
    object?.userData.name;
  document.querySelector('#hover').textContent=started&&!ending&&!down?(label||''):'';
  renderer.domElement.style.cursor=started&&!ending&&label?'pointer':'';
  if(down&&!inspecting){
    const dx=e.clientX-lastX;
    const dy=e.clientY-lastY;
    dragDistance+=Math.abs(dx)+Math.abs(dy);
    yaw-=dx*.003;
    pitch=Math.max(-1.1,Math.min(1.1,pitch-dy*.003));
    lastX=e.clientX;
    lastY=e.clientY;
  }
};
renderer.domElement.onpointercancel=()=>{down=false;};
renderer.domElement.onpointerleave=()=>{document.querySelector('#hover').textContent='';};
renderer.domElement.onpointerup=e=>{
  down=false;
  if(!started||ending||dragDistance>=5)return;
  activateWorld(hitObject(e));
};
function activateWorld({object,mesh:hit}){
  if(!started||ending)return;
  const drawer=object?.userData.drawer;
  if(drawer&&object===inspectedObject){
    if(drawer.state==='open'&&hit.parent===key){takeKey(drawer);return;}
    if(drawer.state==='open'&&hit.parent===crank){takeCrank(drawer);return;}
    if(drawer.state==='open'&&hit.parent===letter){showLetter();return;}
    if(drawer.state!=='open'||hit.parent===drawer.front)inspectObject(object);
    return;
  }
  if(object===door&&inspectedObject===door){
    if(doorState==='open'){
      if(hit===doorway||hit.parent===ada)stepThrough();
      else close();
    }
    else if(doorUnlocked)openUnlockedDoor();
    else operateDoor();
    return;
  }
  if(object===musicBox&&selectedItem==='crank'){inspectObject(object);return;}
  if(object&&(!inspecting||drawer||object===door))inspectObject(object);
}
function resize(){
  renderer.setSize(innerWidth,innerHeight);
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  if(inspectedObject?.userData.drawer)frameDrawer(inspectedObject.userData.drawer);
}
resize();
addEventListener('resize',resize);
const viewTarget=new T.PerspectiveCamera();
function canWalk(x,z){
  if(Math.abs(x)>3.65||z< -2.55||z>4.1)return false;
  if(room===0&&Math.abs(x)<1.93&&z> -2.2&&z< -.67)return false;
  if(x< -2.68&&Math.abs(z-cabinet.position.z)<.54)return false;
  if(x< -3.03&&z> -1.9&&z<.5)return false;
  if(room===2&&x> -2.95&&x< -1.05&&z> -2.05&&z< -.8)return false;
  if(room===1&&z>-2.05&&z<-.73&&(Math.abs(x+.52)<.77||Math.abs(x+2.45)<.66))return false;
  if(room===2&&z>-2.04&&z<-.92&&x>-.44&&x<1.75)return false;
  if(room===2&&Math.abs(x-2.12)<.51&&Math.abs(z-.75)<.61)return false;
  return true;
}
const timer=document.querySelector('#timer');
const danger=document.querySelector('#danger');
const activeThreat=new T.Vector3();
function renderTimer(){
  const seconds=Math.ceil(remaining);
  timer.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}
const caughtScene=document.querySelector('#caughtScene');
const caughtCaption=document.querySelector('#caughtCaption');
const caughtResult=document.querySelector('#caughtResult');
const retryCaught=document.querySelector('#retryCaught');
retryCaught.onclick=()=>location.reload();
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const caughtCamera=new T.Vector3(0,1.53,3.94);
const caughtLook=new T.Vector3();
const caughtDarkness=document.querySelector('#caughtDarkness');
let caughtAt=null;

function beginCapture(now){
  ending=true;
  caughtAt=now;
  close();
  zoomTarget=null;
  keys.clear();
  down=false;
  document.querySelector('#guide').hidden=true;
  document.querySelector('#journal').setAttribute('aria-expanded','false');
  document.body.classList.add('caught');
  caughtScene.hidden=false;

  silhouette.position.set(0,0,.74);
  silhouette.rotation.set(0,0,0);
  silhouette.visible=true;
  heldParcel.visible=true;
  courierBacklight.intensity=4;
  courierBacklight.color.setHex(0xb87849);
  for(let step=0;step<4;step++){
    thud(.09+step*.037,.72+step*.40,68-step*4,step%2?.24:-.24);
  }
  thud(.22,3.5,44);
}

function animateCapture(now,dt){
  const seconds=(now-caughtAt)/1000;
  const approach=T.MathUtils.smoothstep(seconds,.48,2.55);
  const reach=T.MathUtils.smoothstep(seconds,2.55,3.28);
  const blackout=T.MathUtils.smoothstep(seconds,3.45,4.32);
  const motion=reducedMotion.matches?0:1;
  const stride=Math.sin(approach*Math.PI*8)*.24*motion;
  silhouette.position.set(0,Math.abs(stride)*.085,.74+approach*1.92);
  courierLegs[0].rotation.x=stride;
  courierLegs[1].rotation.x=-stride;
  courierArms[0].rotation.x=-stride*.72;
  courierArms[1].rotation.x=stride*.72-reach*1.35;
  heldParcel.rotation.x=reach*1.28;

  if(renderer.xr.isPresenting){
    playerRig.position.copy(caughtCamera);
    playerRig.position.y=0;
  }else if(motion){
    camera.position.lerp(caughtCamera,1-Math.exp(-dt*9));
  }else camera.position.copy(caughtCamera);
  caughtLook.set(.08,1.37-reach*.13,silhouette.position.z);
  viewTarget.position.copy(camera.position);
  viewTarget.lookAt(caughtLook);
  if(!renderer.xr.isPresenting)camera.quaternion.slerp(viewTarget.quaternion,motion?1-Math.exp(-dt*11):1);

  const initialDarkness=motion?.72*(1-T.MathUtils.smoothstep(seconds,.12,.72)):0;
  caughtDarkness.style.opacity=String(Math.max(initialDarkness,blackout*.92));
  lamp.intensity=16*(1-blackout);
  courierBacklight.intensity=3.6*(1-blackout);
  const line=seconds<1.05?'The clock stops. Footsteps cross the room.':
    seconds<2.58?'':'“One last delivery.”';
  if(caughtCaption.textContent!==line)caughtCaption.textContent=line;
  if(seconds>=4.42&&caughtResult.hidden){
    caughtCaption.hidden=true;
    caughtResult.hidden=false;
    retryCaught.focus();
  }
}

const immersive=setupImmersive({renderer,scene,camera,rig:playerRig,hitWorld,activate:activateWorld,canWalk});
function tick(_,frame){
  const now=performance.now();
  const elapsed=(now-lastTime)/1000;
  lastTime=now;
  const dt=Math.min(elapsed,.05);
  if(started&&!ending){
    remaining=Math.max(0,remaining-elapsed);
    renderTimer();
    if(remaining===0){
      beginCapture(now);
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
  crank.visible=room===2&&!musicWound&&!inventory.has('crank')&&crank.parent.position.z>.23;
  key.visible=solved&&!hasKey&&key.parent.position.z>.23;
  hinge.rotation.y=T.MathUtils.lerp(hinge.rotation.y,doorAngles[doorState],ease);
  const rattle=Math.max(0,lockedKnobUntil-now)/420;
  doorKnob.position.x=.4+Math.sin(rattle*26)*rattle*.018;
  ada.visible=room===2&&doorState==='open'&&hinge.rotation.y<-.8;
  if(zoomTarget&&!renderer.xr.isPresenting){
    camera.position.lerp(zoomTarget,ease);
    if(camera.position.distanceTo(zoomTarget)<.01)zoomTarget=null;
  }
  if(!renderer.xr.isPresenting&&started&&!inspecting&&!ending&&document.querySelector('#guide').hidden){
    const dx=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
    const dz=Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));
    const desired=new T.Vector2(dx,dz).clampLength(0,1).multiplyScalar(1.65);
    walking.lerp(desired,1-Math.exp(-dt*12));
    const nx=camera.position.x+(walking.x*Math.cos(yaw)+walking.y*Math.sin(yaw))*dt;
    const nz=camera.position.z+(-walking.x*Math.sin(yaw)+walking.y*Math.cos(yaw))*dt;
    if(canWalk(nx,camera.position.z))camera.position.x=nx;
    if(canWalk(camera.position.x,nz))camera.position.z=nz;
  }else walking.set(0,0);
  if(inspecting&&lookTarget){
    viewTarget.position.copy(camera.position);
    viewTarget.lookAt(lookTarget);
  }else viewTarget.rotation.set(pitch,yaw,0,'YXZ');
  if(caughtAt===null&&!renderer.xr.isPresenting)camera.quaternion.slerp(viewTarget.quaternion,1-Math.exp(-dt*14));


  if(caughtAt===null&&silhouette.visible&&threat>0){
    const [x,z]=courierRoute[threat-1];
    activeThreat.set(x,0,z);
    silhouette.position.lerp(activeThreat,1-Math.exp(-dt*1.25));
    silhouette.lookAt(camera.position.x,0,camera.position.z);
    courierBacklight.intensity=.7+threat*.28;
  }
  const sinceEntry=(now-roomEntered)/1000;
  if(room===1){
    const swing=Math.exp(-Math.pow((sinceEntry%24-8)/1.25,2));
    portraits[1].rotation.z=Math.sin(sinceEntry*4)*.085*swing;
  }
  if(room===2){
    rocker.rotation.x=Math.sin(sinceEntry*2.1)*.105;
    mobileArm.rotation.y=Math.sin(sinceEntry*.75)*.27;
  }
  danger.style.opacity=String(started&&!ending?Math.min(.72,threat*.12+(remaining<=60?.2:0)):0);
  lamp.intensity=on?25:0;
  if(caughtAt!==null)animateCapture(now,dt);
  immersive.render(frame);
  const lightView=renderer.xr.isPresenting?renderer.xr.getCamera():camera;
  lightView.getWorldPosition(lamp.position);
  lamp.target.position.copy(lamp.position).add(lightView.getWorldDirection(activeThreat).multiplyScalar(6));
  glow.intensity=1.7+Math.sin(now*.004)*.15;
  renderer.render(scene,camera);
}
renderer.setAnimationLoop(tick);
