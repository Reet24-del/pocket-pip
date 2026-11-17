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
const cabinet=new T.Group();cabinet.position.set(1.65,.42,-2.1);scene.add(cabinet);box(.65,.8,.48,wm,0,0,0,cabinet);for(let y=-.25;y<.35;y+=.25){box(.57,.2,.03,0x66503a,0,y,.26,cabinet);box(.13,.025,.035,0xbca268,0,y,.29,cabinet)}
const key=new T.Group();key.position.set(1.65,.87,-2.05);key.rotation.x=Math.PI/2;scene.add(key);mesh(new T.TorusGeometry(.06,.016,8,20),mat(0xd1ad59),0,0,0,key);box(.16,.025,.025,0xd1ad59,.1,0,0,key);box(.025,.05,.025,0xd1ad59,.16,-.025,0,key);key.visible=false;
const door=new T.Group();door.position.set(2.6,1.35,-2.84);scene.add(door);box(1.15,2.65,.09,0x22352c,0,0,0,door);for(let y of [-.6,.55])box(.82,.8,.04,0x18291f,0,y,.07,door);mesh(new T.SphereGeometry(.045),mat(0xbfa069),.4,-.1,.15,door);
for(let x of [1.95,3.25])box(.13,2.85,.17,0x7b6a4d,x,1.4,-2.8);box(1.42,.13,.17,0x7b6a4d,2.6,2.8,-2.8);
const win=new T.Group();win.position.set(-2.55,2,-2.8);scene.add(win);box(1.4,1.65,.07,0x132b35,0,0,0,win);for(let x of [-.75,0,.75])box(.06,1.8,.1,0x7d725c,x,0,.04,win);box(1.55,.06,.1,0x7d725c,0,0,.04,win);
for(let y of [-.88,.88])box(1.55,.06,.1,0x7d725c,0,y,.04,win);
const moon=new T.PointLight(0x7596b6,2,5);moon.position.set(-2.4,2,-2);scene.add(moon);
for(let x of [-3.4,-1.7])box(.28,2.2,.13,0x333f38,x,1.8,-2.6);
const candle=new T.Group();candle.position.set(-.4,1.05,-1.3);scene.add(candle);mesh(new T.CylinderGeometry(.06,.07,.22,12),mat(0xc7b594),0,.11,0,candle);
const flame=mesh(new T.SphereGeometry(.035,10,10),new T.MeshBasicMaterial({color:0xffd080}),0,.25,0,candle);flame.scale.y=1.7;
const glow=new T.PointLight(0xffa65a,1.8,3);glow.position.set(-.4,1.4,-1.3);scene.add(glow);
const silhouette=new T.Group();scene.add(silhouette);silhouette.position.set(-2.6,1.1,-2.65);mesh(new T.SphereGeometry(.13),mat(0x101819),0,.7,0,silhouette);mesh(new T.ConeGeometry(.28,1.05,12),mat(0x101819),0,.1,0,silhouette);silhouette.visible=false;

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
for(const y of [-.6,.55])for(const x of [-.44,.44])box(.025,.86,.05,0x65533a,x,y,.1,door);
for(const y of [-1.04,-.16,.11,.99])box(.9,.025,.05,0x65533a,0,y,.1,door);
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
function show(title,text,actions=[]){document.querySelector('#itemTitle').textContent=title;document.querySelector('#itemText').textContent=text;document.querySelector('#portrait').style.display=title==='A space beside you'?'block':'none';const a=document.querySelector('#actions');a.replaceChildren();for(const [label,fn] of actions){const b=document.createElement('button');b.textContent=label;b.onclick=fn;a.append(b)}document.querySelector('#inspect').classList.remove('hidden')}
function close(){document.querySelector('#inspect').classList.add('hidden');inspecting=false;zoomTarget=home.position.clone();lookTarget=null;yaw=home.yaw;pitch=home.pitch;}
document.querySelector('#close').onclick=close;
let room=0,remaining=480,mistakes=0,solved=false,parcelCount=0;
const gallery=new T.Group();scene.add(gallery);gallery.visible=false;for(let i=0;i<3;i++){box(.65,.9,.07,0x97764a,-2+i,2.5,-2.75,gallery);}const nursery=new T.Group();scene.add(nursery);nursery.visible=false;box(1.5,.12,.8,wm,-2,.6,-1.5,nursery);for(let i=0;i<9;i++)box(.04,.65,.04,0x9e8c70,-2.7+i*.17,.9,-1.1,nursery);
const rooms=['The study','The portrait gallery','Ada’s nursery'];
const home={position:camera.position.clone(),yaw:0,pitch:0}; let inspecting=false,zoomTarget=null,lookTarget=null,lastTime=performance.now();
function advance(){close();room++;remaining+=0;solved=false;camera.position.copy(home.position);yaw=pitch=0;document.querySelector('#roomName').textContent=rooms[room];found=clockSet=houseSet=hasKey=false;key.visible=false;silhouette.visible=false;gallery.visible=room===1;nursery.visible=room===2;if(room===1){say('The door opens into a gallery. Ada left you a sequence, not an hour.');house.visible=true;scene.background=new T.Color(0x14101a);}else{say('Ada’s nursery. The music box remembers her way home.');house.visible=true;scene.background=new T.Color(0x111924);}update();}
function finish(){ending=true;close();document.querySelector('#story').style.display='flex';document.querySelector('#storyTitle').textContent='You found Ada.';document.querySelector('#storyText').textContent='Beyond the last door, Ada opens her eyes. You take her hand. Three rooms, '+mistakes+' wrong answers, '+Math.ceil(remaining)+' seconds left. Outside, the courier drops his last parcel and disappears.';document.querySelector('#next').textContent='Play again';}
function fail(){if(ending)return;mistakes++;remaining=Math.max(0,remaining-30);sound();silhouette.visible=true;parcelCount++;const parcel=box(.25,.12,.19,0x9a7851,-.7+Math.min(parcelCount,6)*.24,1.1,-1.05);register(parcel,'Parcel from the courier',()=>show('He knows you are here','A photograph of Ada behind glass. On its back: “'+Math.max(0,Math.ceil(remaining))+' seconds. Stop guessing.”'));show('A parcel arrives','Footsteps stop outside. Inside the parcel is a photograph of Ada, trapped behind glass. A wrong answer costs 30 seconds. He is closer now.');document.querySelector('#portrait').style.display='block';update();}
register(photo,'Inspect photograph',()=>{found=true;show(room===0?'A space beside you':'Ada’s next clue',room===0?'The family photograph has an empty outline. Scratched into its frame: “She waited until 3:15.”':room===1?'Three portraits hang in order: a moon, a door, a candle. Their frame numbers are 2, 4, 1. The letter says: “Read left to right.”':'Ada’s lullaby: “Rain, candle, moon. Then home.”');update()});
register(clock,'Solve room puzzle',()=>{if(!found){show('Find the clue first','Inspect the photograph or read Ada’s letter in the drawer. Use Hint if you are stuck.');return}show(room===0?'Set the clock':room===1?'The gallery lock':'The music box',room===0?'Choose the hour scratched into the photograph.':room===1?'Choose the frame numbers, left to right.':'Choose the order in Ada’s lullaby.',(room===0?['12:00','3:15','6:30']:room===1?['124','241','412']:['Moon, rain, candle','Rain, candle, moon','Candle, moon, rain']).map((label,i)=>[label,()=>{if(i!==1){fail();return}solved=true;close();say('The lock clicks. Search the drawer for the room key.');update()}]));});
register(house,'Inspect dollhouse / music box',()=>{if(!solved){show(room===2?'Music box':'The little house',room===2?'A lullaby is scratched underneath: rain, candle, moon. The clock is the combination lock.':'The miniature door has a brass lock. Restore the room puzzle first.');return}hasKey=true;key.visible=false;show('The room key','A key drops into your hand. The door leads onward.');update()});
register(door,'Open next door',()=>{if(!hasKey){show('The locked door','The courier is outside. Solve the room and take its key.');return}if(room<2)advance();else finish()});
register(cabinet,'Search drawer',()=>{found=true;if(solved){hasKey=true;show('The room key','You find the key beneath Ada’s letter. Open the door.');update()}else show('Ada’s letter',room===0?'“The photograph remembers the hour.”':room===1?'“241. Three frames, left to right.”':'“Rain, candle, moon. Sing it, then turn the lock.”')});
register(win,'Inspect window',()=>show('Beyond the glass',room===2?'A small handprint appears in the mist. Ada is still alive.':'Fresh footprints stop beneath the window. A courier has been watching the house.'));
register(candle,'Inspect candle',()=>show('Warm wax','Someone was here moments ago. The wax is still warm.'));
register(key,'Take key',()=>{hasKey=true;key.visible=false});
// Every visible furnishing can be inspected; searching is safe.
const labeled=new Set(interact);for(const obj of [...scene.children]){if(obj.isMesh&&!labeled.has(obj))register(obj,'Search '+(room===0?'room':'corner'),()=>show('A quiet corner','Dust, scratches, and signs of someone passing. The photograph, clock, drawer, and door carry the strongest clues.'));}
function penalty(){mistakes++;remaining=Math.max(0,remaining-30);sound();const parcel=box(.28,.16,.22,0x907659,-.9+mistakes*.22,1.14,-1.1);parcelCount++;silhouette.visible=true;show('A parcel from the courier','A photograph of Ada is inside. On the back: “'+mistakes+' wrong turn'+(mistakes>1?'s':'')+'. I am closer.” You lose 30 seconds.');const img=document.querySelector('#portrait');img.style.display='block';say('The courier has reached '+(mistakes>2?'the landing.':'the stairs.'));update();}
function update(){document.querySelector('#objective').textContent=!found?'Find a clue: inspect the photograph or drawer.':!solved?'Use the clue to solve the room lock.':!hasKey?'The lock is open. Search the drawer for a key.':'You have the key. Open the door.';document.querySelector('#progress').textContent='Room '+(room+1)+' / 3 · '+mistakes+' mistakes';}
function sound(){if(!context)return;for(let i=0;i<3;i++){const o=context.createOscillator(),g=context.createGain();o.frequency.value=75;g.gain.setValueAtTime(.001,context.currentTime+i*.4);g.gain.exponentialRampToValueAtTime(.2,context.currentTime+i*.4+.01);g.gain.exponentialRampToValueAtTime(.001,context.currentTime+i*.4+.2);o.connect(g);g.connect(context.destination);o.start(context.currentTime+i*.4);o.stop(context.currentTime+i*.4+.21)}}
document.querySelector('#next').onclick=()=>{if(ending){location.reload();return}if(storyStep++===0){document.querySelector('#storyTitle').textContent='Tonight, she wrote to you.';document.querySelector('#storyText').textContent='An envelope arrived without a stamp. Inside was Ada’s handwriting: “I did not climb out. You turned the house. Come back before the clock remembers.” You unlock Briar House. Three knocks come from inside.';document.querySelector('#next').textContent='Take the lantern';}else{started=true;document.querySelector('#story').style.display='none';context=new AudioContext();sound();say('The photograph on the desk. Wasn’t someone standing beside you?');}};
document.querySelector('#light').onclick=()=>{on=!on;document.querySelector('#light').textContent='Lantern '+(on?'on':'off')};addEventListener('keydown',e=>{if(e.code==='KeyL')document.querySelector('#light').click();if(e.code==='KeyR')location.reload()});
let hintLevel=0;
document.querySelector('#hint').onclick=()=>{hintLevel++;const level=Math.min(hintLevel,3);const answer=room===0?'3:15':room===1?'241':'Rain, candle, moon';show('Hint '+level+' / 3',!found?(level===1?'Ada left a clue on the desk.':level===2?'Inspect the photograph, or search the drawer.':'Click Photograph below, then Room lock.') : !solved?(level===1?'Read the clue carefully; its order matters.':level===2?'The answer is written in the photograph or letter.':'Choose '+answer+' at the room lock.') : !hasKey?'Search the drawer. The key is available now.':'Open the door to continue. Hints cost no time.');};
function inspectObject(o){if(!started||ending)return;keys.clear();home.position.copy(camera.position);home.yaw=yaw;home.pitch=pitch;zoomTarget=o.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,.12,1.15));lookTarget=o.getWorldPosition(new T.Vector3());inspecting=true;o.userData.action();}
for(const [label,obj] of [['Photograph',photo],['Room lock',clock],['Dollhouse',house],['Drawer',cabinet],['Door',door]]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>inspectObject(obj);document.querySelector('#objects').append(b);}
const pointer=new T.Vector2();const ray=new T.Raycaster();let down=false,startX=0,last=0,pitch=0; const keys=new Set(); addEventListener('keydown',e=>keys.add(e.code)); addEventListener('keyup',e=>keys.delete(e.code)); addEventListener('blur',()=>keys.clear());
renderer.domElement.onpointerdown=e=>{down=true;startX=last=e.clientX};
renderer.domElement.onpointermove=e=>{pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);if(down){yaw-=(e.clientX-last)*.003; pitch=Math.max(-1.1,Math.min(1.1,pitch-e.movementY*.003));last=e.clientX}};
renderer.domElement.onpointerup=e=>{down=false;if(started&&Math.abs(e.clientX-startX)<5){const hit=ray.intersectObjects(interact,true)[0];if(hit){let o=hit.object;while(!o.userData.action)o=o.parent;zoomTarget=o.getWorldPosition(new T.Vector3()).add(new T.Vector3(0,.12,1.15));lookTarget=o.getWorldPosition(new T.Vector3());inspecting=true;o.userData.action()}}};
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}resize();addEventListener('resize',resize);
function tick(){const now=performance.now();if(started&&!ending){remaining=Math.max(0,remaining-(now-lastTime)/1000);document.querySelector('#timer').textContent=Math.floor(remaining/60)+':'+String(Math.floor(remaining%60)).padStart(2,'0');if(remaining===0){ending=true;close();document.querySelector('#story').style.display='flex';document.querySelector('#storyTitle').textContent='The courier found you.';document.querySelector('#storyText').textContent='The last parcel is addressed to you. Ada is still inside. Try again—the clues are waiting.';document.querySelector('#next').textContent='Try again';}}lastTime=now; if(zoomTarget){camera.position.lerp(zoomTarget,.09);if(camera.position.distanceTo(zoomTarget)<.01)zoomTarget=null;}camera.rotation.set(pitch,yaw,0,'YXZ'); if(started&&!inspecting&&!ending){ const step=.018, dx=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0), dz=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0); const nx=camera.position.x+(dx*Math.cos(yaw)+dz*Math.sin(yaw))*step, nz=camera.position.z+(-dx*Math.sin(yaw)+dz*Math.cos(yaw))*step; if(!(Math.abs(nx)<1.9&&nz<-.4&&nz>-2.05)&&Math.abs(nx)<3.65&&nz>-2.55&&nz<4.1){camera.position.x=nx;camera.position.z=nz;} }if(inspecting&&lookTarget)camera.lookAt(lookTarget);lamp.position.copy(camera.position);ray.setFromCamera(pointer,camera);lamp.target.position.copy(camera.position).add(ray.ray.direction.clone().multiplyScalar(6));lamp.intensity=on?25:0;const hit=started?ray.intersectObjects(interact.filter(o=>o.visible),true)[0]:null;let label='';if(hit){let o=hit.object;while(o&&!o.userData.name)o=o.parent;label=o?o.userData.name:''}document.querySelector('#hover').textContent=label;glow.intensity=1.7+Math.sin(performance.now()*.004)*.15;renderer.render(scene,camera);requestAnimationFrame(tick)}tick();

