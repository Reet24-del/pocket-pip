import * as T from 'three';

// The seated player stays stationary in their physical space. Only discrete viewpoint changes move the rig.
export function setupImmersive({renderer,scene,camera,rig,hitWorld,activate,canWalk}){
  const enter=document.querySelector('#enterVR');
  const status=document.querySelector('#vrStatus');
  let input;
  let inputReady=false;
  const sdkScene=new T.Scene();
  let lastInputTime=0;
  const xr=renderer.xr;
  xr.enabled=true;
  xr.setReferenceSpaceType('local-floor');
  const panelCanvas=document.createElement('canvas');
  panelCanvas.width=960;
  panelCanvas.height=640;
  const ink=panelCanvas.getContext('2d');
  const panelTexture=new T.CanvasTexture(panelCanvas);
  panelTexture.colorSpace=T.SRGBColorSpace;
  const panel=new T.Mesh(new T.PlaneGeometry(1.30,.866),new T.MeshBasicMaterial({
    map:panelTexture,transparent:true,depthTest:false,depthWrite:false,toneMapped:false,
  }));
  panel.renderOrder=20;
  panel.visible=false;
  panel.raycast=()=>{};
  scene.add(panel);
  const panelRaycast=T.Mesh.prototype.raycast.bind(panel);
  const indicator=new T.Mesh(new T.SphereGeometry(.012,12,8),new T.MeshBasicMaterial({color:0xffdb86,depthTest:false}));
  indicator.renderOrder=22;
  indicator.raycast=()=>{};
  indicator.visible=false;
  scene.add(indicator);

  const playerView=new T.Vector3();
  const viewRotation=new T.Quaternion();
  const forward=new T.Vector3();
  const aim=new T.Raycaster();
  const aimMatrix=new T.Matrix4();
  const panelOffset=new T.Vector3();
  const fingerMaterial=new T.MeshBasicMaterial({color:0xe7c8a0,transparent:true,opacity:.72});
  const joints=new T.InstancedMesh(new T.SphereGeometry(1,8,6),fingerMaterial,50);
  joints.count=0;
  joints.frustumCulled=false;
  joints.raycast=()=>{};
  scene.add(joints);
  const jointMatrix=new T.Matrix4();
  const jointPoint=new T.Vector3();
  const familyImage=document.querySelector('#portrait');
  let savedView;
  let page='room';
  let offset=0;
  let signature='';
  let buttons=[];
  let liveHit=null;
  let panelTop=0;

  function resetMenu(next='room'){
    page=next;
    offset=0;
    signature='';
  }
  function text(selector){return document.querySelector(selector).textContent.trim();}
  function commands(selector){
    return [...document.querySelectorAll(selector)].map(button=>({
      label:button.textContent.trim(),
      selected:button.getAttribute('aria-pressed')==='true',
      run:()=>button.click(),
    }));
  }
  function move(x,z){
    if(!canWalk(x,z))return;
    rig.position.set(x,0,z);
    resetMenu();
  }
  function content(){
    const hud=text('#roomName')+'   ·   '+text('#timer');
    if(!document.querySelector('#caughtScene').hidden){
      if(document.querySelector('#caughtResult').hidden)return {title:text('#caughtCaption')};
      return {title:'The last delivery',body:'Ada is still inside.',actions:commands('#retryCaught')};
    }
    if(document.querySelector('#story').style.display!=='none'){
      return {title:text('#storyTitle'),body:text('#storyText'),actions:commands('#next')};
    }
    if(!document.querySelector('#inspect').classList.contains('hidden')){
      return {title:text('#itemTitle'),body:text('#itemText'),
        photo:!document.querySelector('#parcelPhoto').hidden?'ada':!familyImage.hidden?'family':null,
        actions:[...commands('#actions button'),{label:'Back',run:()=>document.querySelector('#close').click()}]};
    }
    if(page==='journal'){
      const clues=[...document.querySelectorAll('#clues li')].map(note=>note.textContent);
      const cluePages=Math.max(1,Math.ceil(clues.length/2));
      return {title:'Journal',body:[text('#objective'),...clues.slice(offset*2,offset*2+2)].join('\n'),
        actions:[{label:'Ask for a hint',run:()=>document.querySelector('#hint').click()},
          ...(cluePages>1?[{label:'More clues',run:()=>{offset=(offset+1)%cluePages;}}]:[]),
          {label:'Back',run:()=>resetMenu()}]};
    }
    if(page==='objects'){
      const targets=commands('#objects button');
      return {title:'Examine',body:'Aim at objects in the room or choose one here.',
        actions:[...targets.slice(offset,offset+6),
          ...(targets.length>6?[{label:offset?'Previous':'More objects',run:()=>{offset=offset?0:6;}}]:[]),
          {label:'Back',run:()=>resetMenu()}]};
    }
    if(page==='inventory'){
      return {title:'Inventory',body:'Pinch to view a photograph or select an item. Aim at the matching object to use it.',
        actions:[...commands('#inventory button'),{label:'Back',run:()=>resetMenu()}]};
    }
    if(page==='move'){
      return {title:'Choose a viewpoint',body:'Stay seated and pinch a position to move.',
        actions:[{label:'Entrance',run:()=>move(0,3.94)},{label:'Left side',run:()=>move(-2.3,1.25)},
          {label:'Right side',run:()=>move(2.9,1.25)},{label:'Near desk',run:()=>move(0,.25)},
          {label:'Back',run:()=>resetMenu()}]};
    }
    const body=document.querySelector('#caption').classList.contains('visible')?text('#caption'):'';
    return {title:hud,body,compact:true,actions:[
      {label:'Examine',run:()=>resetMenu('objects')},{label:'Inventory',run:()=>resetMenu('inventory')},
      {label:'Journal',run:()=>resetMenu('journal')},{label:'Move',run:()=>resetMenu('move')},
      ...commands('#light, #sound'),
    ]};
  }
  function draw(data,hovered=-1){
    ink.clearRect(0,0,960,640);
    buttons=[];
    panelTop=640;
    panelTexture.needsUpdate=true;
    if(!data.title)return;
    const {title,body='',photo,compact,actions=[]}=data;
    const top=compact?342:10;
    panelTop=top;
    ink.fillStyle='rgba(18,14,11,.97)';
    ink.fillRect(10,top,940,630-top);
    ink.strokeStyle='#ae8b56';
    ink.lineWidth=3;
    ink.strokeRect(10,top,940,630-top);
    ink.fillStyle='#ffe9c1';
    ink.font='44px Georgia';
    ink.fillText(title,40,top+60,880);
    let y=top+109;
    let actionTop=top+111;
    const pictureWidth=photo?236:0;
    if(photo&&familyImage.complete&&familyImage.naturalWidth){
      if(photo==='ada'){
        ink.drawImage(familyImage,familyImage.naturalWidth*.36,familyImage.naturalHeight*.28,
          familyImage.naturalWidth*.31,familyImage.naturalHeight*.57,40,top+85,200,220);
      }else ink.drawImage(familyImage,40,top+85,220,172);
    }
    ink.font=compact?'26px system-ui':'30px system-ui';
    for(const paragraph of body.split('\n')){
      let line='';
      for(const word of paragraph.split(/\s+/)){
        const next=line?line+' '+word:word;
        if(ink.measureText(next).width>870-pictureWidth&&line){
          ink.fillText(line,40+pictureWidth,y);
          y+=38;
          line=word;
        }else line=next;
      }
      if(line){ink.fillText(line,40+pictureWidth,y);y+=38;}
    }
    actionTop=Math.max(actionTop,y-5,photo?top+314:0);
    const columns=compact?3:2;
    const width=880/columns-10;
    const step=compact?51:62;
    actionTop=Math.min(actionTop,613-Math.ceil(actions.length/columns)*step);
    for(const [index,action] of actions.entries()){
      const x=40+(index%columns)*(width+10);
      const y=actionTop+Math.floor(index/columns)*step;
      ink.fillStyle=index===hovered?'#ffe4aa':action.selected?'#c29b5f':'#3b2d20';
      ink.fillRect(x,y,width,step-7);
      ink.fillStyle=index===hovered||action.selected?'#1c140a':'#f4dfba';
      ink.font='29px system-ui';
      ink.fillText(action.label,x+13,y+33,width-26);
      buttons.push({x,y,width,height:step-7,run:action.run});
    }
    panelTexture.needsUpdate=true;
  }
  function trace(source,frame){
    const space=xr.getReferenceSpace();
    if(!space)return null;
    const pose=frame.getPose(source.targetRaySpace,space);
    if(!pose)return null;
    aimMatrix.fromArray(pose.transform.matrix).premultiply(rig.matrixWorld);
    aim.ray.origin.setFromMatrixPosition(aimMatrix);
    aim.ray.direction.set(0,0,-1).transformDirection(aimMatrix);
    const raw=[];
    panelRaycast(aim,raw);
    const ui=raw[0];
    if(ui){
      const x=ui.uv.x*960,y=(1-ui.uv.y)*640;
      const index=buttons.findIndex(button=>x>=button.x&&x<=button.x+button.width&&y>=button.y&&y<=button.y+button.height);
      if(index>=0)return {point:ui.point,index};
      if(y>=panelTop)return null;
    }
    const hit=hitWorld(aim);
    return hit.object?{...hit,point:hit.point,index:-1}:null;
  }
  function select(hit){
    if(!hit)return;
    if(hit.index>=0){
      buttons[hit.index]?.run();
      signature='';
    }else activate(hit);
  }
  function end(){
    panel.visible=false;
    indicator.visible=false;
    joints.count=0;
    rig.position.set(0,0,0);
    camera.position.copy(savedView);
    input?.update(xr,0,performance.now()/1000);
    renderer.shadowMap.enabled=true;
    document.body.classList.remove('in-vr');
    enter.hidden=false;
  }
  enter.onclick=async()=>{
    status.textContent='';
    if(!inputReady)return;
    try{
      const session=await navigator.xr.requestSession('immersive-vr',{requiredFeatures:['local-floor','hand-tracking']});
      savedView=camera.position.clone();
      rig.position.set(0,0,3.94);
      rig.updateMatrixWorld(true);
      camera.position.set(0,0,0);
      renderer.shadowMap.enabled=false;
      await xr.setSession(session);
      session.addEventListener('end',end,{once:true});

      document.body.classList.add('in-vr');
      enter.hidden=true;
      panel.visible=true;
      resetMenu();
    }catch(error){
      if(savedView)end();
      status.textContent='VR could not start. Enable hand tracking in your headset and try again.';
      console.warn(error);
    }
  };
  if(navigator.xr)navigator.xr.isSessionSupported('immersive-vr')
    .then(async supported=>{
      if(!supported)return;
      const {XRInputManager}=await import('./vendor/iwsdk-input.js');
      input=new XRInputManager({camera,scene:sdkScene,pointerSettings:{enabled:false}});
      inputReady=true;
      enter.hidden=false;
    })
    .catch(error=>{
      status.textContent='The VR input system could not load. Reload to retry.';
      console.warn(error);
    });
  return {
    resetPosition(){if(xr.isPresenting){rig.position.set(0,0,3.94);resetMenu();}},
    render(frame){
      if(!frame||!xr.isPresenting)return;
      const space=xr.getReferenceSpace();
      if(!space||!frame.getViewerPose(space))return;
      const now=performance.now()/1000;
      input.update(xr,Math.min(.05,now-lastInputTime),now);
      lastInputTime=now;
      rig.updateMatrixWorld(true);
      aimMatrix.copy(input.xrOrigin.head.matrix).premultiply(rig.matrixWorld);
      playerView.setFromMatrixPosition(aimMatrix);
      viewRotation.setFromRotationMatrix(aimMatrix);
      forward.set(0,0,-1).applyQuaternion(viewRotation);
      panel.position.copy(playerView).addScaledVector(forward,1.4);
      panelOffset.set(0,-.28,0).applyQuaternion(viewRotation);
      panel.position.add(panelOffset);
      panel.quaternion.copy(viewRotation);
      panel.updateMatrixWorld(true);

      const data=content();
      const nextSignature=JSON.stringify(data);
      const changed=nextSignature!==signature;
      if(changed){signature=nextSignature;draw(data);}
      let count=0;
      let hover=-1;
      let point=null;
      for(const side of ['left','right']){
        const source=input.getPrimaryInputSource(side);
        if(!source)continue;
        const hit=trace(source,frame);
        if(hit){hover=hit.index;point=hit.point.clone();}
        if(input.getSelectState(side).end)select(hit);
        if(!source.hand)continue;
        for(const joint of source.hand.values()){
          const pose=frame.getJointPose(joint,space);
          if(!pose)continue;
          const {x,y,z}=pose.transform.position;
          jointPoint.set(x,y,z).applyMatrix4(rig.matrixWorld);
          const radius=pose.radius||.008;
          jointMatrix.makeScale(radius,radius,radius).setPosition(jointPoint);
          joints.setMatrixAt(count++,jointMatrix);
        }

      }
      joints.count=count;
      joints.instanceMatrix.needsUpdate=true;
      if(changed||hover!==liveHit)draw(content(),hover);
      liveHit=hover;
      indicator.visible=Boolean(point);
      if(point)indicator.position.copy(point);
    },
  };
}
