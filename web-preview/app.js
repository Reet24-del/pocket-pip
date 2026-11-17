import * as T from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
const canvas=document.querySelector('#game'), status=document.querySelector('#status');
const scene=new T.Scene();scene.background=new T.Color('#101921');
const renderer=new T.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;
const camera=new T.PerspectiveCamera(40,1,.01,30);camera.position.set(0,.56,-.83);camera.lookAt(0,.015,0);
scene.add(new T.HemisphereLight(0xe9f5ff,0x665546,2.5));const light=new T.DirectionalLight(0xffecd2,3);light.position.set(-.4,1,-.5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);scene.add(light);
function box(x,y,z,w,h,d,color){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshStandardMaterial({color}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
box(-.16,-.01,0,.2,.02,.18,0xb29876);box(.16,-.01,0,.2,.02,.18,0xb29876);
box(0,.07,.095,.54,.18,.01,0xdfdacb);box(-.265,.07,0,.01,.18,.18,0xdfdacb);box(.265,.07,0,.01,.18,.18,0xdfdacb);
box(0,-.065,0,.12,.1,.18,0x111419);
const bridge=box(0,-.005,0,.19,.01,.09,0x68e5a0);bridge.visible=false;
const pip=new T.Group();scene.add(pip);const body=new T.Mesh(new T.CapsuleGeometry(.011,.02,5,10),new T.MeshStandardMaterial({color:0xf19c4d}));body.position.y=.023;pip.add(body);
for(const x of [-.005,.005]){const eye=new T.Mesh(new T.SphereGeometry(.0027,8,8),new T.MeshStandardMaterial({color:0x172b32}));eye.position.set(x,.033,-.01);body.add(eye);eye.position.y=.009;}
const goal=new T.Mesh(new T.CylinderGeometry(.025,.025,.003,32),new T.MeshStandardMaterial({color:0xf4d951,emissive:0x756000,emissiveIntensity:.3}));goal.position.set(.21,.002,0);scene.add(goal);
const marker=new T.Mesh(new T.RingGeometry(.009,.012,24),new T.MeshBasicMaterial({color:0x9de9f4,side:T.DoubleSide}));marker.rotation.x=-Math.PI/2;marker.visible=false;scene.add(marker);
let x=-.21,z=0,y=0,target=null,state='idle',safe={x:-.21,z:0},held=false,fallTime=0;
function reset(){x=-.21;z=0;y=0;target=null;state='idle';safe={x,z};held=false;bridge.visible=false;marker.visible=false;status.textContent='Click the gold goal to guide Pip.';}
function supported(px,pz){return Math.abs(pz)<=.09&&((px>=-.26&&px<=-.06)||(px>=.06&&px<=.26)||(held&&Math.abs(px)<=.095&&Math.abs(pz)<=.045));}
function setBridge(value){held=value;bridge.visible=value;}
document.querySelector('#reset').onclick=reset;
addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();setBridge(true);}if(e.code==='KeyR')reset();});addEventListener('keyup',e=>{if(e.code==='Space')setBridge(false);});addEventListener('blur',()=>setBridge(false));
const button=document.querySelector('#bridge');button.addEventListener('pointerdown',e=>{button.setPointerCapture(e.pointerId);setBridge(true);});button.addEventListener('pointerup',()=>setBridge(false));button.addEventListener('pointercancel',()=>setBridge(false));
const ray=new T.Raycaster(),plane=new T.Plane(new T.Vector3(0,1,0),0),hit=new T.Vector3();
canvas.addEventListener('pointerdown',e=>{if(state==='won'||state==='falling')return;ray.setFromCamera(new T.Vector2(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1),camera);if(ray.ray.intersectPlane(plane,hit)&&Math.abs(hit.x)<=.26&&Math.abs(hit.z)<=.09&&Math.abs(hit.x)>=.06){target={x:hit.x,z:hit.z};marker.position.set(hit.x,.002,hit.z);marker.visible=true;state='walking';}});
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
let last=performance.now(),elapsed=0;
function frame(now){const dt=Math.min((now-last)/1000,.04);last=now;elapsed+=dt;
if(state!=='falling'&&state!=='won'&&!supported(x,z)){state='falling';fallTime=0;}
if(state==='falling'){fallTime+=dt;y=-.15*fallTime*fallTime;if(fallTime>.65){x=safe.x;z=safe.z;y=0;state='idle';target=null;marker.visible=false;}}
else if(state!=='won'&&target){const dx=target.x-x,dz=target.z-z,d=Math.hypot(dx,dz);if(d<.006){target=null;state='idle';}else{const step=Math.min(dt*.06,d);if(supported(x+dx/d*(step+.012),z+dz/d*(step+.012))){x+=dx/d*step;z+=dz/d*step;state='walking';pip.rotation.y=Math.atan2(-dx,-dz);if(Math.abs(x)>=.06)safe={x,z};}else state='waiting';}}
if(state!=='falling'&&Math.hypot(x-.21,z)<.03){state='won';marker.visible=false;}
pip.position.set(x,y,z);body.position.y=.023+(state==='walking'?Math.abs(Math.sin(elapsed*18))*.004:state==='won'?Math.abs(Math.sin(elapsed*9))*.015:0);if(state==='won')pip.rotation.y+=dt*3;
status.textContent=state==='won'?'You did it. Pip made it home!':state==='waiting'?'A little help? Hold Space to make a bridge.':state==='falling'?'Oops! Back to the last safe spot.':held?'Keep holding while Pip crosses.':'Click the gold goal to guide Pip.';
renderer.render(scene,camera);requestAnimationFrame(frame);}requestAnimationFrame(frame);

