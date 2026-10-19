import * as THREE from 'three';
const scene=new THREE.Scene();scene.background=new THREE.Color('#a5d9f0');scene.fog=new THREE.Fog('#a5d9f0',45,105);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,160);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;
document.body.append(renderer.domElement);renderer.domElement.style.cssText='position:fixed;inset:0;z-index:0;touch-action:none';
scene.add(new THREE.HemisphereLight(0xe5f5ff,0x9eae69,2.1));
const sun=new THREE.DirectionalLight(0xffe5b4,3.1);sun.position.set(-17,29,13);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-38;sun.shadow.camera.right=38;sun.shadow.camera.top=38;sun.shadow.camera.bottom=-38;sun.shadow.normalBias=.04;scene.add(sun);
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.9});
const grass=mat('#7db86c'),road=mat('#e3c69a'),wood=mat('#a66c42'),wall=mat('#f4d6a2'),roof=mat('#b85e49'),leaves=[mat('#438d50'),mat('#5ca963'),mat('#7ab55d')],soil=mat('#805438');
function mesh(g,m,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(w,h,d,m,x,y,z,parent){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent)}
function ball(r,m,x,y,z,parent){return mesh(new THREE.IcosahedronGeometry(r,1),m,x,y,z,parent)}
box(80,.3,80,grass,0,-.25,0);
box(4,.06,70,road,0,.015,0);box(65,.06,3.2,road,0,.018,-7);
const stone=mat('#b5ad95');
for(let i=0;i<40;i++){const x=(i*17%73)-36,z=(i*31%71)-35;if(Math.abs(x)<3||Math.abs(z+7)<3)continue;const o=box(.4,.08,.32,stone,x,.015,z);o.rotation.y=i*1.7}
function house(x,z,tint){const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);
const plaster=mat(tint);box(5,3.2,4.6,plaster,0,1.6,0,group);
const left=box(3.75,.35,5.25,roof,-1.35,3.85,0,group);left.rotation.z=Math.PI/5.5;
const right=box(3.75,.35,5.25,roof,1.35,3.85,0,group);right.rotation.z=-Math.PI/5.5;
box(.95,2,.12,wood,0,1.02,2.36,group);box(.85,.8,.12,mat('#8bd5e6'),-1.55,1.95,2.36,group);box(.85,.8,.12,mat('#8bd5e6'),1.55,1.95,2.36,group);
box(.12,.85,.17,wood,-1.55,1.95,2.47,group);box(.12,.85,.17,wood,1.55,1.95,2.47,group);
box(1.2,.13,.45,wood,0,2.6,2.6,group);
box(.8,1.3,.8,mat('#b98a67'),1.55,4.15,-1,group)}
house(-12,-16,'#f5d6a1');house(12,-16,'#d4e0ba');house(-13,11,'#f0c3a5');
function tree(x,z,s=1){const group=new THREE.Group();group.position.set(x,0,z);group.scale.setScalar(s);scene.add(group);
mesh(new THREE.CylinderGeometry(.25,.36,2.6,7),wood,0,1.3,0,group);
ball(1.35,leaves[0],0,3.2,0,group);ball(1.1,leaves[1],-.8,2.9,.25,group);ball(1.08,leaves[2],.6,3.55,-.3,group)}
for(const [x,z,s] of [[-20,-22,1.2],[-22,14,1],[20,14,1.2],[19,-22,1],[-23,-1,1],[23,0,1.3],[8,21,1],[-5,24,1],[5,-23,1],[-19,24,1]])tree(x,z,s);
function fence(x,z,alongX=true){box(alongX?2.1:.16,.8,alongX?.16:2.1,wood,x,.55,z);box(.18,1.1,.18,wood,x+(alongX?1:0),.55,z+(alongX?0:1))}
for(let i=0;i<9;i++){fence(3+i*2,3,true);fence(3+i*2,20,true)}
for(let i=0;i<8;i++){fence(3,4+i*2,false);fence(21,4+i*2,false)}
const plots=[];for(let x=6;x<19;x+=2.5)for(let z=6;z<18;z+=2.5){box(2,.11,2,soil,x,.06,z);plots.push({x,z,grown:false})}
const flowers=[mat('#ffd878'),mat('#ff9eaf'),mat('#e9d3ff')];for(let i=0;i<85;i++){let x=Math.sin(i*11.8)*31,z=Math.cos(i*8.3)*30;if(Math.abs(x)<3||Math.abs(z+7)<3||(x>3&&x<23&&z>3&&z<22))continue;mesh(new THREE.CylinderGeometry(.025,.025,.22,4),leaves[1],x,.12,z);ball(.10,flowers[i%3],x,.27,z)}
const player=new THREE.Group();scene.add(player);const blue=mat('#548bc4'),skin=mat('#efc293'),pants=mat('#40577f'),hat=mat('#5674a2');
box(.85,1,.55,blue,0,1.35,0,player);box(.66,.65,.64,skin,0,2.2,0,player);
const legs=[box(.28,.75,.36,pants,-.23,.48,0,player),box(.28,.75,.36,pants,.23,.48,0,player)];
const arms=[box(.27,.9,.38,skin,-.59,1.35,0,player),box(.27,.9,.38,skin,.59,1.35,0,player)];
box(1,.2,.88,hat,0,2.6,0,player);box(1.03,.09,.4,hat,0,2.53,.43,player);
const hud=document.createElement('div');hud.style.cssText='position:fixed;z-index:5;top:12px;left:12px;padding:11px 15px;background:#173e38e8;color:#fff;border-radius:15px;font:600 14px system-ui;box-shadow:0 5px 15px #0003';hud.innerHTML='🌾 FARM VILLAGE 3D <small style="display:block;font-weight:400">TASK 02 · ฟาร์มตัวอย่าง · เล่นคนเดียว</small>';document.body.append(hud);
const tip=document.createElement('div');tip.style.cssText='position:fixed;z-index:5;right:12px;top:13px;padding:10px;border-radius:12px;background:#173e38cc;color:#fff;font:12px system-ui';tip.textContent='ปลูกพืช 0 / '+plots.length;document.body.append(tip);
const pad=document.createElement('div');pad.style.cssText='position:fixed;z-index:6;bottom:20px;left:16px;display:grid;grid-template-columns:repeat(3,57px);grid-template-rows:repeat(2,57px);gap:5px';document.body.append(pad);
const keys=new Set();for(const [key,label,col,row] of [['up','▲',2,1],['left','◀',1,2],['down','▼',2,2],['right','▶',3,2]]){const b=document.createElement('button');b.textContent=label;b.style.cssText='grid-column:'+col+';grid-row:'+row+';border:2px solid #fff8;background:#ffe4a9e8;border-radius:15px;color:#322919;font-size:24px;touch-action:none;box-shadow:0 4px 0 #735b35';b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(key)};b.onpointerup=b.onpointercancel=()=>keys.delete(key);pad.append(b)}
const plant=document.createElement('button');plant.textContent='🌱 ปลูก';plant.style.cssText='position:fixed;z-index:6;right:20px;bottom:32px;border:2px solid #fff8;background:#ffe4a9;border-radius:16px;padding:15px 19px;color:#312a1e;font:700 17px system-ui';document.body.append(plant);
let count=0;plant.onclick=()=>{let nearest=null,d=3.1;for(const p of plots){const n=Math.hypot(p.x-player.position.x,p.z-player.position.z);if(!p.grown&&n<d){d=n;nearest=p}}if(!nearest){tip.textContent='เดินเข้าใกล้แปลงผักก่อน';return}nearest.grown=true;const stem=mat('#3e9348');mesh(new THREE.CylinderGeometry(.06,.08,.6,5),stem,nearest.x,.38,nearest.z);for(let i=0;i<3;i++){const leaf=ball(.24,leaves[i%3],nearest.x+Math.sin(i*2.1)*.25,.53,nearest.z+Math.cos(i*2.1)*.25);leaf.scale.y=.55}tip.textContent='ปลูกพืช '+(++count)+' / '+plots.length};
const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',a:'left',s:'down',d:'right'};addEventListener('keydown',e=>{if(map[e.key]){keys.add(map[e.key]);e.preventDefault()}});addEventListener('keyup',e=>{if(map[e.key])keys.delete(map[e.key])});addEventListener('blur',()=>keys.clear());

/* TASK 04 — orbit camera: drag empty 3D scene to rotate; pinch to zoom. */
let orbitYaw=.59,orbitPitch=.59,orbitDistance=23;
const touches=new Map();let lastPinch=0;
renderer.domElement.addEventListener('pointerdown',e=>{renderer.domElement.setPointerCapture(e.pointerId);touches.set(e.pointerId,{x:e.clientX,y:e.clientY});lastPinch=0});
renderer.domElement.addEventListener('pointermove',e=>{if(!touches.has(e.pointerId))return;const prev=touches.get(e.pointerId);const dx=e.clientX-prev.x,dy=e.clientY-prev.y;touches.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touches.size===1){orbitYaw-=dx*.008;orbitPitch=THREE.MathUtils.clamp(orbitPitch+dy*.006,.20,1.12)}else if(touches.size===2){const p=[...touches.values()],d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(lastPinch)orbitDistance=THREE.MathUtils.clamp(orbitDistance*lastPinch/d,10,38);lastPinch=d}});
for(const eventName of ['pointerup','pointercancel','lostpointercapture'])renderer.domElement.addEventListener(eventName,e=>{touches.delete(e.pointerId);lastPinch=0});
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();orbitDistance=THREE.MathUtils.clamp(orbitDistance+e.deltaY*.015,10,38)},{passive:false});
const cameraHint=document.createElement('div');cameraHint.textContent='👆 ลากฉากเพื่อหมุนกล้อง · 2 นิ้วซูม';cameraHint.style.cssText='position:fixed;z-index:4;top:318px;right:12px;background:#173e38cc;color:white;border-radius:10px;padding:7px 9px;font:11px system-ui;pointer-events:none';document.body.append(cameraHint);
// Soft varied terrain patches, wildflowers, decorative rocks and village details.
const moss=[mat('#8bc47b'),mat('#93c881'),mat('#70ad68')];
for(let i=0;i<85;i++){const x=Math.sin(i*17.23)*35,z=Math.cos(i*12.71)*35;if(Math.abs(x)<3||Math.abs(z+7)<3||(x>3&&x<23&&z>3&&z<22))continue;const r=.65+(i%7)*.23;const ground=mesh(new THREE.CircleGeometry(r,10),moss[i%3],x,-.077,z);ground.rotation.x=-Math.PI/2;ground.scale.y=.7}
const flowerPetals=[mat('#fff3e2'),mat('#f6b1c7'),mat('#e6c5fa')];
for(let i=0;i<65;i++){const x=Math.sin(i*8.14+2)*34,z=Math.cos(i*7.23+3)*34;if(Math.abs(x)<3||Math.abs(z+7)<3||(x>3&&x<23&&z>3&&z<22))continue;const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);mesh(new THREE.CylinderGeometry(.022,.03,.27,4),leaves[1],0,.16,0,group);for(let p=0;p<5;p++){const a=p*Math.PI*2/5;ball(.10,flowerPetals[i%3],Math.cos(a)*.13,.32,Math.sin(a)*.13,group)}ball(.07,mat('#f3c65e'),0,.33,0,group)}
// Small orchard near the north path
for(let i=0;i<6;i++){const x=5+i*2.6,z=-25+(i%2)*1.2;tree(x,z,.72);for(let j=0;j<3;j++)ball(.13,mat('#e87961'),x+Math.sin(i+j*3)*.6,2.1+j*.24,z+Math.cos(i+j*2)*.5)}
// Wooden carts, crates, hay bales
const hay=mat('#dfb65d');
for(let i=0;i<6;i++)box(1.1,.7,.85,hay,-17+(i%3)*1.3,.35,6+Math.floor(i/3)*1.2);
box(2,.23,1.4,wood,-10,.65,-9);for(const x of [-10.8,-9.2])for(const z of [-9.5,-8.5])mesh(new THREE.CylinderGeometry(.33,.33,.18,9),wood,x,.37,z).rotation.z=Math.PI/2;

let previous=performance.now(),elapsed=0;function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-previous)/1000);previous=now;const dx=Number(keys.has('right'))-Number(keys.has('left')),dz=Number(keys.has('down'))-Number(keys.has('up'));const len=Math.hypot(dx,dz);if(len){player.position.x=THREE.MathUtils.clamp(player.position.x+dx/len*5*dt,-36,36);player.position.z=THREE.MathUtils.clamp(player.position.z+dz/len*5*dt,-36,36);player.rotation.y=Math.atan2(dx,dz);elapsed+=dt*11;legs[0].rotation.x=Math.sin(elapsed)*.48;legs[1].rotation.x=-Math.sin(elapsed)*.48;arms[0].rotation.x=-Math.sin(elapsed)*.32;arms[1].rotation.x=Math.sin(elapsed)*.32}else{for(const limb of [...legs,...arms])limb.rotation.x*=.78}
camera.position.lerp(new THREE.Vector3(player.position.x+Math.sin(orbitYaw)*orbitDistance,Math.sin(orbitPitch)*orbitDistance+1.4,player.position.z+Math.cos(orbitYaw)*Math.cos(orbitPitch)*orbitDistance),Math.min(1,dt*5));camera.lookAt(player.position.x,1.35,player.position.z);renderer.render(scene,camera)}requestAnimationFrame(frame);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

/* TASK 03 — richer handcrafted village scenery and optional procedural music.
   All geometry and audio are original, generated in-browser; no third-party model or song is embedded. */
const accent=mat('#f4eee0'),darkWood=mat('#79533b'),waterMat=new THREE.MeshStandardMaterial({color:'#42a9d0',roughness:.24,metalness:.12,transparent:true,opacity:.87}),sand=mat('#d8c28c'),red=mat('#e87961'),white=mat('#fff4e3');
function cylinder(rt,rb,h,m,x,y,z,parent=scene,n=8){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),m,x,y,z,parent)}
function patch(x,z,r,color){const o=mesh(new THREE.CylinderGeometry(r,r,.04,20),mat(color),x,.005,z);o.scale.z=.75;return o}
function bush(x,z,s=1){ball(.58*s,leaves[0],x,.5*s,z);ball(.45*s,leaves[1],x+.35*s,.45*s,z+.2*s);ball(.4*s,leaves[2],x-.3*s,.48*s,z-.25*s)}
for(let i=0;i<35;i++){let x=Math.sin(i*2.8)*28,z=Math.cos(i*4.3)*27;if(Math.abs(x)<4||Math.abs(z+7)<4||(x>2&&x<23&&z>2&&z<22))continue;bush(x,z,.65+(i%4)*.12)}
// Windmill on the western hill
const mill=new THREE.Group();mill.position.set(-26,0,-14);scene.add(mill);
cylinder(1.8,2.35,7,accent,0,3.5,0,mill,10);const millRoof=mesh(new THREE.ConeGeometry(2.55,2.4,10),roof,0,8.2,0,mill);
box(1.1,2,.12,darkWood,0,1.1,2.06,mill);
const rotor=new THREE.Group();rotor.position.set(0,6.5,2.15);mill.add(rotor);
for(let i=0;i<4;i++){const blade=box(.52,3.3,.16,white,0,1.9,0,rotor);blade.rotation.z=i*Math.PI/2;blade.position.set(-Math.sin(i*Math.PI/2)*1.9,Math.cos(i*Math.PI/2)*1.9,0)}
// A pond and wooden footbridge beyond the farm
patch(26,13,8,'#d2c79a');const pond=mesh(new THREE.CylinderGeometry(6.8,6.8,.055,40),waterMat,26,.07,13);pond.scale.z=.68;
for(let i=0;i<20;i++){const a=i*Math.PI/10;const x=26+Math.cos(a)*7.2,z=13+Math.sin(a)*4.8;ball(.45,stone,x,.18,z)}
for(let i=0;i<9;i++){box(.65,.22,4.2,wood,20.7+i*.65,.35,13);if(i%2===0){box(.15,.95,.15,darkWood,20.7+i*.65,.85,10.8);box(.15,.95,.15,darkWood,20.7+i*.65,.85,15.2)}}
// Village market stall
const stall=new THREE.Group();stall.position.set(-8,0,4);scene.add(stall);
box(4.6,.28,2.6,wood,0,1.1,0,stall);
for(const x of [-2.1,2.1])for(const z of [-1.1,1.1])box(.16,3,.16,darkWood,x,1.55,z,stall);
for(let i=0;i<8;i++)box(.62,.13,3.3,i%2?white:red,-2.15+i*.62,3.12,0,stall);
for(let i=0;i<10;i++)ball(.22,i%2?mat('#e5b354'):mat('#d66b4a'),-1.7+(i%5)*.75,1.43,-.55+Math.floor(i/5)*.8,stall);
// Village notice board and street lamps
function lamp(x,z){cylinder(.12,.18,3.5,darkWood,x,1.75,z);box(.8,.18,.8,wood,x,3.45,z);box(.56,.55,.56,mat('#ffdc86'),x,3.1,z);mesh(new THREE.ConeGeometry(.58,.55,4),roof,x,3.78,z)}
for(const [x,z] of [[-4,-3],[-14,-5],[6,-3],[16,-5],[-8,9]])lamp(x,z);
box(2.5,1.7,.15,wood,-4,1.8,5);box(2.15,1.4,.17,mat('#dfbd83'),-4,1.8,5.1);
for(let i=0;i<4;i++)box(.65,.2,.02,white,-4.65+(i%2)*1.2,2.1-Math.floor(i/2)*.65,5.21);
// NPC villagers with color variations
function npc(x,z,shirtColor){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);box(.7,.9,.45,mat(shirtColor),0,1.25,0,g);box(.58,.6,.55,skin,0,2.05,0,g);box(.24,.7,.28,pants,-.19,.44,0,g);box(.24,.7,.28,pants,.19,.44,0,g);box(.78,.18,.66,wood,0,2.42,0,g);return g}
npc(-7,5,'#d86b5b');npc(-18,-4,'#e5ad58');npc(15,-2,'#6c9d7d');
// Farm props, flower planters and stones
for(let i=0;i<12;i++){const x=-17+(i%6)*1.1,z=-11+Math.floor(i/6)*1.1;box(.8,.45,.8,wood,x,.22,z);bush(x,z,.38)}
for(let i=0;i<8;i++){const x=9+i*.85;box(.7,.75,.7,wood,x,.38,-12);ball(.33,leaves[i%3],x,.95,-12)}
// Player HUD overlay, mini-map and action bar
const overlay=document.createElement('div');overlay.style.cssText='position:fixed;z-index:4;top:75px;right:12px;width:116px;height:116px;border:3px solid #f7e9b9;border-radius:18px;background:#71b77b;box-shadow:0 5px 15px #0004;overflow:hidden;pointer-events:none';
overlay.innerHTML='<div style="position:absolute;inset:46px 0 0;background:#c7a879;transform:rotate(-30deg);height:17px"></div><div style="position:absolute;top:10px;left:13px">🏡</div><div style="position:absolute;bottom:14px;right:10px">🌳</div><div style="position:absolute;top:45px;left:51px;font-size:22px">➤</div>';document.body.append(overlay);
const inventory=document.createElement('div');inventory.style.cssText='position:fixed;z-index:4;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:4px;background:#16382fb8;padding:5px;border-radius:12px;pointer-events:none';
for(const emoji of ['🪣','🪓','⛏️','🌱']){const slot=document.createElement('span');slot.textContent=emoji;slot.style.cssText='width:33px;height:33px;display:grid;place-items:center;background:#344e48dd;border:1px solid #e7dcb5;border-radius:7px;font-size:18px';inventory.append(slot)}document.body.append(inventory);
const soundButton=document.createElement('button');soundButton.textContent='♫ เปิดเพลง';soundButton.style.cssText='position:fixed;z-index:8;right:12px;top:201px;background:#173e38e8;color:#fff;border:1px solid #fff8;border-radius:13px;padding:9px 12px;font:13px system-ui;touch-action:manipulation';document.body.append(soundButton);
// Mobile browsers require a tap to start WebAudio. Gentle original pentatonic tune.
let audioCtx=null,tuneTimer=null,noteIndex=0;const melody=[0,2,4,7,4,2,0,-3,0,2,4,9,7,4,2,-1];const baseFreq=261.63;
function playNote(){if(!audioCtx)return;const t=audioCtx.currentTime;const semitone=melody[noteIndex++%melody.length];const oscillator=audioCtx.createOscillator(),gain=audioCtx.createGain();oscillator.type='sine';oscillator.frequency.value=baseFreq*Math.pow(2,semitone/12);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.075,t+.035);gain.gain.exponentialRampToValueAtTime(.0001,t+.45);oscillator.connect(gain).connect(audioCtx.destination);oscillator.start(t);oscillator.stop(t+.48)}
soundButton.onclick=async()=>{if(audioCtx){clearInterval(tuneTimer);await audioCtx.close();audioCtx=null;soundButton.textContent='♫ เปิดเพลง';return}try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();await audioCtx.resume();playNote();tuneTimer=setInterval(playNote,520);soundButton.textContent='♫ ปิดเพลง'}catch(e){soundButton.textContent='เสียงไม่รองรับ'}};


/* TASK 05: character art pass + mobile HUD redesign. All new geometry is original. */
const playerSkin=mat('#e8b98e'),hairMat=mat('#6e4935'),shirtTrim=mat('#e8d7aa'),bootMat=mat('#624d43');
function characterDetail(){
  // soften silhouette: face, hair, sleeves, belt, boots and backpack
  ball(.37,playerSkin,0,2.18,.08,player).scale.set(1,.95,.9);
  const hair=ball(.39,hairMat,0,2.43,-.06,player);hair.scale.set(1,.36,.9);
  for(const x of [-.15,.15])ball(.035,mat('#322d29'),x,2.24,.395,player);
  const nose=ball(.045,playerSkin,0,2.14,.45,player);nose.scale.z=.7;
  box(.82,.13,.57,shirtTrim,0,1.84,0,player);
  box(.87,.16,.6,bootMat,0,.9,0,player);
  for(const x of [-.23,.23])box(.31,.24,.48,bootMat,x,.13,.09,player);
  box(.86,.16,.58,bootMat,0,1.01,0,player);
  box(.44,.73,.21,mat('#ac7a4b'),0,1.35,-.39,player);
  box(.52,.12,.1,shirtTrim,0,1.62,-.52,player);
}
characterDetail();
const uiCSS=document.createElement('style');uiCSS.textContent=`
  .fv-hud{font-family:system-ui,-apple-system,sans-serif;color:#fff}
  .fv-glass{background:linear-gradient(145deg,#153e35ed,#12342cdb)!important;border:1px solid #e8e0bd70!important;box-shadow:0 8px 28px #132b2666!important;backdrop-filter:blur(7px)}
  .fv-action{background:linear-gradient(#fff0be,#edc982)!important;border:2px solid #fff5d0!important;box-shadow:0 4px 0 #9b7848,0 7px 17px #0002!important}
  @media(max-width:700px){.fv-smallmap{transform:scale(.68);transform-origin:top right;top:84px!important;right:10px!important}.fv-music{top:174px!important;right:12px!important}.fv-camera{top:219px!important;right:12px!important;font-size:10px!important}.fv-count{top:14px!important;right:12px!important;font-size:12px!important}.fv-hotbar{bottom:8px!important;left:50%!important;transform:translateX(-50%) scale(.84)!important}.fv-pad{bottom:22px!important;left:12px!important;transform:scale(.83);transform-origin:bottom left}.fv-plant{bottom:31px!important;right:14px!important;padding:12px 14px!important;font-size:15px!important}.fv-title{font-size:12px!important;top:12px!important;left:12px!important;max-width:57vw!important}}
`;document.head.append(uiCSS);
hud.classList.add('fv-hud','fv-glass','fv-title');hud.innerHTML='🌾 <b>FARM VILLAGE</b> <span style="color:#ffe8a7">3D</span><small style="display:block;font-weight:400;opacity:.88">หมู่บ้านแห่งความสุข · TASK 05</small>';
tip.classList.add('fv-hud','fv-glass','fv-count');overlay.classList.add('fv-smallmap');soundButton.classList.add('fv-glass','fv-music');cameraHint.classList.add('fv-glass','fv-camera');inventory.classList.add('fv-hotbar');pad.classList.add('fv-pad');plant.classList.add('fv-action','fv-plant');
for(const button of pad.querySelectorAll('button'))button.classList.add('fv-action');
const statusBar=document.createElement('div');statusBar.className='fv-glass fv-hud';statusBar.style.cssText='position:fixed;z-index:4;left:12px;top:84px;padding:6px 10px;border-radius:12px;font-size:11px;pointer-events:none';statusBar.textContent='☀️ เช้า 08:00   ♥ 100   ⚡ 100';document.body.append(statusBar);
const oldAudio=soundButton.textContent;soundButton.textContent='🎵 เพลง';
// Extra garden dressing: trellises, stacked pumpkins and a small well.
const pumpkinMat=mat('#df863e'),vineMat=mat('#4b9855');
for(let i=0;i<12;i++){const x=7+(i%6)*1.65,z=23+Math.floor(i/6)*1.45;const g=ball(.42,pumpkinMat,x,.37,z);g.scale.set(1,.75,1);box(.09,.23,.09,vineMat,x,.77,z)}
function well(x,z){const ring=new THREE.Group();ring.position.set(x,0,z);scene.add(ring);for(let i=0;i<12;i++){const a=i*Math.PI/6;box(.65,.8,.25,stone,Math.cos(a)*1.08,.48,Math.sin(a)*1.08,ring).rotation.y=-a}for(const side of [-1,1])box(.14,2.7,.14,wood,side*1.05,1.7,0,ring);box(2.7,.25,2.5,roof,0,3.13,0,ring);cylinder(.68,.68,.04,waterMat,0,.44,0,ring,18)}
well(-20,7);
// Rock-lined garden border and flowerpots
for(let i=0;i<22;i++){const x=-4+i*.9;ball(.18,stone,x,.12,16)}
for(let i=0;i<10;i++){const x=-14+(i%5)*.85,z=-21+Math.floor(i/5)*.9;cylinder(.25,.19,.38,mat('#bd8058'),x,.2,z);ball(.32,leaves[i%3],x,.58,z)}
