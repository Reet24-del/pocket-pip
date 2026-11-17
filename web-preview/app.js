import * as T from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
const scene=new T.Scene();scene.background=new T.Color(0x080f13);scene.fog=new T.Fog(0x080f13,7,15);
const renderer=new T.WebGLRenderer({canvas:document.querySelector('#game'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;
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
mesh(new T.PlaneGeometry(.69,.69),new T.MeshBasicMaterial({map:face,transparent:false}),0,0,.06,clock);
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
function show(title,text,actions=[]){document.querySelector('#itemTitle').textContent=title;document.querySelector('#itemText').textContent=text;document.querySelector('#portrait').style.display=title==='A space beside you'?'block':'none';const a=document.querySelector('#actions');a.replaceChildren();for(const [label,fn] of actions){const b=document.createElement('button');b.textContent=label;b.onclick=fn;a.append(b)}document.querySelector('#inspect').classList.remove('hidden')}
function close(){document.querySelector('#inspect').classList.add('hidden')}
document.querySelector('#close').onclick=close;
register(photo,'Inspect Ada’s photograph',()=>{if(!on){say('The photograph is too dark. Use the lantern.');return}found=true;show('A space beside you','You remember this picture. You were holding Ada’s hand. Now there is only an empty outline. Scratched into the frame: “She waited until 3:15.”');say('Find the hour Ada left behind.');update()});
register(clock,'Set the clock',()=>{if(!found){show('The stopped clock','Its hands are loose. You need a reason to choose an hour.');return}show('The night she disappeared','The photograph said 3:15.', [['Set to 3:15',()=>{clockSet=true;needle.rotation.z=-Math.PI/2;close();sound();say('The clock ticks once. Ada’s dollhouse turns in the corner of your eye.');update()}]])});
register(house,'Turn the dollhouse',()=>{if(!clockSet){show('Ada’s dollhouse','The tiny door is sealed. There is a clock above it, stopped at midnight.');return}houseSet=true;house.rotation.y+=Math.PI/2;key.visible=true;silhouette.visible=true;show('The room inside the room','You turn the house. Behind you, a chair drags across the floor. The drawer opens. Something brass catches the light.');update();sound()});
register(key,'Take the brass key',()=>{hasKey=true;key.visible=false;show('A key, still warm','A child’s name is stamped into the brass: ADA. From the door: “You remembered.”');say('The key fits the door.');});
register(door,'Open the door',()=>{if(!hasKey){say('Three knocks. A child whispers: “Put everything back.”');sound();return}ending=true;document.querySelector('#story').style.display='flex';document.querySelector('#storyTitle').textContent='This time, you stay.';document.querySelector('#storyText').textContent='You turn the key. Ada is waiting on the other side, twenty years younger than she should be. “You came back,” she says. Behind you, your photograph has changed. There are two children in it again.';document.querySelector('#next').textContent='Play again';});
function update(){document.querySelector('#progress').textContent=[found,clockSet,houseSet].filter(Boolean).length+' / 3 memories'}
function sound(){if(!context)return;for(let i=0;i<3;i++){const o=context.createOscillator(),g=context.createGain();o.frequency.value=75;g.gain.setValueAtTime(.001,context.currentTime+i*.4);g.gain.exponentialRampToValueAtTime(.2,context.currentTime+i*.4+.01);g.gain.exponentialRampToValueAtTime(.001,context.currentTime+i*.4+.2);o.connect(g);g.connect(context.destination);o.start(context.currentTime+i*.4);o.stop(context.currentTime+i*.4+.21)}}
document.querySelector('#next').onclick=()=>{if(ending){location.reload();return}if(storyStep++===0){document.querySelector('#storyTitle').textContent='Tonight, she wrote to you.';document.querySelector('#storyText').textContent='An envelope arrived without a stamp. Inside was Ada’s handwriting: “I did not climb out. You turned the house. Come back before the clock remembers.” You unlock Briar House. Three knocks come from inside.';document.querySelector('#next').textContent='Take the lantern';}else{started=true;document.querySelector('#story').style.display='none';context=new AudioContext();sound();say('The photograph on the desk. Wasn’t someone standing beside you?');}};
document.querySelector('#light').onclick=()=>{on=!on;document.querySelector('#light').textContent='Lantern '+(on?'on':'off')};addEventListener('keydown',e=>{if(e.code==='KeyL')document.querySelector('#light').click();if(e.code==='KeyR')location.reload()});
const pointer=new T.Vector2();const ray=new T.Raycaster();let down=false,startX=0,last=0;
renderer.domElement.onpointerdown=e=>{down=true;startX=last=e.clientX};
renderer.domElement.onpointermove=e=>{pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);if(down){yaw+=(e.clientX-last)*.003;last=e.clientX}};
renderer.domElement.onpointerup=e=>{down=false;if(started&&Math.abs(e.clientX-startX)<5){const hit=ray.intersectObjects(interact,true)[0];if(hit){let o=hit.object;while(!o.userData.action)o=o.parent;o.userData.action()}}};
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}resize();addEventListener('resize',resize);
function tick(){camera.rotation.y=yaw;lamp.position.copy(camera.position);ray.setFromCamera(pointer,camera);lamp.target.position.copy(camera.position).add(ray.ray.direction.clone().multiplyScalar(6));lamp.intensity=on?25:0;const hit=started?ray.intersectObjects(interact.filter(o=>o.visible),true)[0]:null;let label='';if(hit){let o=hit.object;while(o&&!o.userData.name)o=o.parent;label=o?o.userData.name:''}document.querySelector('#hover').textContent=label;glow.intensity=1.7+Math.sin(performance.now()*.004)*.15;renderer.render(scene,camera);requestAnimationFrame(tick)}tick();

