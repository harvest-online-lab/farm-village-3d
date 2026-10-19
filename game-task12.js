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
box(.8,1.3,.8,mat('#b98a67'),1.55,4.15,-1,group);return group}
const originalHouses=[];originalHouses.push(house(-12,-16,'#f5d6a1'),house(12,-16,'#d4e0ba'),house(-13,11,'#f0c3a5'));
function tree(x,z,s=1){const group=new THREE.Group();group.position.set(x,0,z);group.scale.setScalar(s);scene.add(group);
mesh(new THREE.CylinderGeometry(.25,.36,2.6,7),wood,0,1.3,0,group);
ball(1.35,leaves[0],0,3.2,0,group);ball(1.1,leaves[1],-.8,2.9,.25,group);ball(1.08,leaves[2],.6,3.55,-.3,group)}
for(const [x,z,s] of [[-20,-22,1.2],[-22,14,1],[20,14,1.2],[19,-22,1],[-23,-1,1],[23,0,1.3],[8,21,1],[-5,24,1],[5,-23,1],[-19,24,1]])tree(x,z,s);
function fence(x,z,alongX=true){box(alongX?2.1:.16,.8,alongX?.16:2.1,wood,x,.55,z);box(.18,1.1,.18,wood,x+(alongX?1:0),.55,z+(alongX?0:1))}
const originalFenceMeshes=[];const fenceStart=scene.children.length;
for(let i=0;i<9;i++){fence(3+i*2,3,true);fence(3+i*2,20,true)}
for(let i=0;i<8;i++){fence(3,4+i*2,false);fence(21,4+i*2,false)}
originalFenceMeshes.push(...scene.children.slice(fenceStart));
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
let count=0;plant.onclick=()=>{let nearest=null,d=3.1;for(const p of plots){const n=Math.hypot(p.x-player.position.x,p.z-player.position.z);if(!p.grown&&n<d){d=n;nearest=p}}if(!nearest){tip.textContent='เดินเข้าใกล้แปลงผักก่อน';return}nearest.grown=true;if(nearest.seedlings)for(const sprout of nearest.seedlings)sprout.visible=true;const stem=mat('#3e9348');mesh(new THREE.CylinderGeometry(.06,.08,.6,5),stem,nearest.x,.38,nearest.z);for(let i=0;i<3;i++){const leaf=ball(.24,leaves[i%3],nearest.x+Math.sin(i*2.1)*.25,.53,nearest.z+Math.cos(i*2.1)*.25);leaf.scale.y=.55}tip.textContent='ปลูกพืช '+(++count)+' / '+plots.length};
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


/* TASK 06 — visually richer handcrafted models and unobstructed mobile HUD */
const cream=mat('#fff0d3'),gold=mat('#dca750'),terracotta=mat('#bf6b4b'),leafBright=mat('#69b75c');
function cottageDetail(x,z){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  // porch steps, roof ridge, flower boxes, shutters, warm window glow
  box(1.6,.2,.85,stone,0,.11,3.02,g);box(1.2,.16,.6,stone,0,.25,2.72,g);
  box(5.5,.2,.24,terracotta,0,4.86,0,g);
  for(const wx of [-1.55,1.55]){box(.17,1,.16,wood,wx-.56,1.95,2.5,g);box(.17,1,.16,wood,wx+.56,1.95,2.5,g);box(1.3,.22,.6,wood,wx,1.46,2.7,g);
    for(let i=0;i<3;i++){ball(.18,leafBright,wx-.37+i*.36,1.67,2.73,g);ball(.095,i%2?flowers[1]:flowers[0],wx-.37+i*.36,1.86,2.76,g)}
  }
  box(.2,2.6,.2,wood,-2.32,1.32,2.38,g);box(.2,2.6,.2,wood,2.32,1.32,2.38,g);
  for(const px of [-1.8,1.8]){const lantern=box(.25,.45,.25,gold,px,2.4,2.62,g);lantern.material.emissive=new THREE.Color('#c2873d');lantern.material.emissiveIntensity=.2}
}
for(const [x,z] of [[-12,-16],[12,-16],[-13,11]])cottageDetail(x,z);
// Friendly proportions: rounded face, cheeks, hair tufts, collar and brim accent
const cheek=mat('#df9a8a');
for(const side of [-1,1]){const e=ball(.12,playerSkin,side*.35,2.16,.12,player);e.scale.set(.55,1,.7);const ch=ball(.07,cheek,side*.235,2.10,.39,player);ch.scale.z=.25}
box(.92,.09,.9,shirtTrim,0,2.52,0,player);
for(const x of [-.28,.28])ball(.13,hairMat,x,2.43,-.15,player);
box(.12,.32,.08,gold,.33,1.37,.31,player);
const strap=box(.12,.8,.1,bootMat,-.24,1.43,.34,player);strap.rotation.z=-.18;
// More substantial market dressing
for(let i=0;i<5;i++){const x=-10+i*.75;box(.54,.35,.54,wood,x,.33,6.5);ball(.25,i%2?gold:terracotta,x,.67,6.5)}
// Animate the windmill using a safe animation frame hook.
const previousFrame=frame;
function tickWindmill(){rotor.rotation.z+=.0025;requestAnimationFrame(tickWindmill)}
requestAnimationFrame(tickWindmill);
// UI: avoid overlap between controls and hotbar on narrow portrait displays
const ui6=document.createElement('style');ui6.textContent=`
@media(max-width:700px){
 .fv-pad{bottom:16px!important;left:10px!important;transform:scale(.76)!important;transform-origin:bottom left!important}
 .fv-hotbar{bottom:128px!important;left:50%!important;transform:translateX(-50%) scale(.84)!important;z-index:7!important}
 .fv-plant{bottom:24px!important;right:12px!important;min-width:94px!important}
 .fv-title{max-width:56vw!important;padding:9px 11px!important}
 .fv-count{padding:8px!important}
 .fv-camera{display:none!important}
 .fv-smallmap{top:72px!important;transform:scale(.62)!important}
 .fv-music{top:157px!important;padding:7px 10px!important}
}
@media(max-width:380px){.fv-hotbar{bottom:115px!important;transform:translateX(-50%) scale(.75)!important}.fv-pad{transform:scale(.69)!important}}
`;document.head.append(ui6);
hud.innerHTML='🌾 <b>FARM VILLAGE 3D</b><small style="display:block;font-weight:400;opacity:.85">TASK 07 · โมเดล 3D CC0</small>';
cameraHint.style.display='none';


/* TASK 07: genuine Kenney CC0 GLB assets (remote source; graceful fallback). */
async function importKenneyModels(){
  const status=document.createElement('div');status.style.cssText='position:fixed;bottom:175px;right:12px;z-index:5;background:#173e38d9;color:#fff;border-radius:10px;padding:6px 9px;font:11px system-ui;pointer-events:none';status.textContent='🌿 กำลังโหลดโมเดล TASK 07...';document.body.append(status);
  try{
    const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
    const loader=new GLTFLoader();
    const root='https://cdn.jsdelivr.net/gh/Hidencod/tge-assets@main/packs/';
    const load=(path)=>new Promise((resolve,reject)=>loader.load(root+path,resolve,undefined,reject));
    async function place(path,coords,height,replace=null){
      try{
        const gltf=await load(path);const object=gltf.scene;
        object.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3());
        if(size.y<.001)throw Error('empty model');
        object.scale.setScalar(height/size.y);object.updateMatrixWorld(true);
        const bottom=new THREE.Box3().setFromObject(object).min.y;
        object.position.set(coords[0],-bottom,coords[1]);
        object.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
        scene.add(object);if(replace)replace.visible=false;
        return object;
      }catch(e){console.warn('CC0 model unavailable:',path,e);return null}
    }
    // Replace the block farmer only after the actual GLB is successfully loaded.
    const farmer=await place('mini-characters/character-male-a.glb',[player.position.x,player.position.z],2.75);
    if(farmer){
      const model=farmer;player.add(model);model.position.set(0,0,0);
      model.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(model);
      model.position.y-=b.min.y;player.children.forEach(child=>{if(child!==model)child.visible=false});
      status.textContent='✓ ตัวละคร Kenney CC0';
    }
    const positions=[[-20,-22],[-22,14],[20,14],[19,-22],[-23,-1],[23,0],[8,21],[-5,24]];
    const models=['nature-kit/tree-default.glb','nature-kit/tree-oak.glb','nature-kit/tree-pinedefaulta.glb'];
    let loaded=0;
    for(let i=0;i<positions.length;i++){
      const m=await place(models[i%models.length],positions[i],4.2+(i%3)*.7);
      if(m)loaded++;
    }
    const npcSpots=[[-7,5],[-18,-4],[15,-2]];
    for(let i=0;i<npcSpots.length;i++)await place('mini-characters/character-female-'+['a','b','c'][i]+'.glb',npcSpots[i],2.5);
    status.textContent='🌿 โมเดล CC0 '+(loaded+(farmer?1:0))+' ชิ้น';
    setTimeout(()=>status.remove(),5500);
  }catch(e){console.warn('GLTFLoader unavailable; procedural scene preserved',e);status.textContent='โหลดโมเดลไม่สำเร็จ: '+String(e?.message||e).slice(0,95);setTimeout(()=>status.remove(),5500)}
}
importKenneyModels();


/* TASK 08: village buildings, cobblestone roads, garden fences — real GLB meshes */
async function loadVillage08(){
 const root='https://cdn.jsdelivr.net/gh/Hidencod/tge-assets@main/packs/';
 const note=document.createElement('div');note.style.cssText='position:fixed;bottom:174px;right:12px;z-index:8;background:#173e38e9;color:white;border-radius:9px;padding:6px 10px;font:11px system-ui;pointer-events:none';note.textContent='🏘️ กำลังโหลดหมู่บ้าน TASK 08';document.body.append(note);
 try{
  const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');const loader=new GLTFLoader();
  const cache=new Map();
  async function asset(path){if(!cache.has(path))cache.set(path,new Promise((resolve,reject)=>loader.load(root+path,g=>resolve(g.scene),undefined,reject)));return (await cache.get(path)).clone(true)}
  async function put(path,x,z,height,rot=0){try{const obj=await asset(path);const b=new THREE.Box3().setFromObject(obj);const sz=b.getSize(new THREE.Vector3());if(sz.y<.01)throw Error('empty');
   obj.scale.setScalar(height/sz.y);obj.rotation.y=rot;obj.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(obj);obj.position.set(x,-bb.min.y,z);
   obj.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});scene.add(obj);return obj;
  }catch(e){console.warn('Village GLB:',path,e);return null}}
  let built=0;
  // Village homes: replace old primitives only after each building loads.
  const homes=[[-12,-16,'a'],[12,-16,'d'],[-13,11,'g']];
  for(let i=0;i<homes.length;i++){const [x,z,type]=homes[i];const obj=await put('city-kit-suburban/building-type-'+type+'.glb',x,z,5.4,Math.PI);if(obj){originalHouses[i].visible=false;built++}}
  // Market building and market-side shop; keep working fruit stall as a fallback.
  const shop=await put('city-kit-suburban/building-type-j.glb',-15,4,5.1,Math.PI/2);if(shop)built++;
  // Real wooden fencing around the farm, with gaps for walking.
  const fencePath='nature-kit/fence-simple.glb';
  for(const [x,z,rot] of [[4,3,0],[8,3,0],[12,3,0],[16,3,0],[20,3,0],[4,20,0],[8,20,0],[12,20,0],[16,20,0],[20,20,0],[3,7,Math.PI/2],[3,11,Math.PI/2],[3,15,Math.PI/2],[21,7,Math.PI/2],[21,11,Math.PI/2],[21,15,Math.PI/2]]){if(await put(fencePath,x,z,1.15,rot)){built++;originalFenceMeshes.forEach(m=>m.visible=false)}}
  // Curved-looking village path: cobblestone stepping stones and borders along two existing roads.
  const stonePath='city-kit-suburban/path-stones-messy.glb';
  const points=[];for(let z=-29;z<=27;z+=3.4)points.push([Math.sin(z*.12)*.42,z,0]);
  for(let x=-28;x<=28;x+=3.4)points.push([x,-7+Math.sin(x*.11)*.3,Math.PI/2]);
  for(let i=0;i<points.length;i++){const [x,z,rot]=points[i];if(await put(stonePath,x,z,.16,rot))built++}
  // Village square decoration, bridges, trees and flowers near path.
  for(const [x,z] of [[-6,-4],[-10,-6],[6,-10],[14,-9]])if(await put('nature-kit/flower-yellowa.glb',x,z,.7))built++;
  if(await put('nature-kit/bridge-wood.glb',-1,13,1.1,Math.PI/2))built++;
  note.textContent='🏡 TASK 08 · โหลดโมเดล '+built+' จุด';
  setTimeout(()=>note.remove(),6000);
 }catch(e){console.warn('TASK08 loader error',e);note.textContent='TASK 08: '+String(e?.message||e).slice(0,90);setTimeout(()=>note.remove(),10000)}
}
loadVillage08();
hud.innerHTML='🌾 <b>FARM VILLAGE 3D</b><small style="display:block;font-weight:400;opacity:.85">TASK 08 · หมู่บ้านและถนนหิน</small>';


/* TASK 09 — continuous village cobblestone paths, market square, greenery */
(function village09(){
  const cobbles=[0xcbbba0,0xd7c7a9,0xb4aa96,0xe3d4b9,0xbdb39f].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));
  const border=mat('#b9ad91'),pebble=mat('#e5d6b7');
  // Slightly lift existing road slabs and overlay coherent cobblestone coverage.
  const roadParts=[];
  const seed=(n)=>{let t=Math.sin(n*127.1+41.2)*43758.5453;return t-Math.floor(t)};
  function stonesAlong(isNorthSouth){
    const count=isNorthSouth?58:57;
    const length=isNorthSouth?66:62;
    const width=isNorthSouth?3.55:2.9;
    const baseZ=isNorthSouth?0:-7;
    const rows=5;
    const geom=new THREE.BoxGeometry(.68,.075,.55);
    const meshes=cobbles.map(m=>{const inst=new THREE.InstancedMesh(geom,m,count*rows);inst.castShadow=false;inst.receiveShadow=true;scene.add(inst);roadParts.push(inst);return inst});
    const indices=[0,0,0,0,0],dummy=new THREE.Object3D();
    for(let i=0;i<count;i++)for(let j=0;j<rows;j++){
      const s=i*rows+j;const along=(i/(count-1)-.5)*length;
      const across=(j-(rows-1)/2)*width/rows+(i%2)*.18;
      const x=isNorthSouth?across:along;
      const z=isNorthSouth?along:baseZ+across;
      // Skip central junction overlap to reduce z fighting.
      if(!isNorthSouth&&Math.abs(x)<2.2)continue;
      dummy.position.set(x+(seed(s+31)-.5)*.1,.071,z+(seed(s+81)-.5)*.1);
      dummy.rotation.set(0,(seed(s+121)-.5)*.19,0);
      dummy.scale.set(.89+seed(s+9)*.17,1,.91+seed(s+18)*.14);dummy.updateMatrix();
      const idx=Math.floor(seed(s+23)*meshes.length);meshes[idx].setMatrixAt(indices[idx]++,dummy.matrix);
    }
    meshes.forEach((m,i)=>{m.count=indices[i];m.instanceMatrix.needsUpdate=true});
    // Narrow curb strips define pedestrian road edges.
    for(const side of [-1,1]){
      const b=isNorthSouth?box(.16,.13,66,border,side*2.02,.055,0):box(62,.13,.16,border,0,.055,-7+side*1.72);
      b.castShadow=false;
    }
  }
  stonesAlong(true);stonesAlong(false);
  // Market square: rounded gravel plaza adjacent to the existing stall.
  const plaza=mesh(new THREE.CylinderGeometry(6.1,6.1,.045,20),pebble,-9,.024,-4);
  plaza.scale.z=.67;plaza.castShadow=false;plaza.receiveShadow=true;
  // Seeded flowerbeds placed off the central road and away from planting plots.
  const leaf=mat('#4d9557'),petal=[mat('#fff3cc'),mat('#f8b7bd'),mat('#f6da69')];
  const gardens=[[-17,-5],[-16,-10],[-6,-12],[6,-12],[16,-10],[-19,5],[-8,9],[-6,17]];
  for(const [gx,gz] of gardens){
    const soilPatch=mesh(new THREE.CylinderGeometry(.75,.84,.12,9),soil,gx,.03,gz);
    for(let j=0;j<6;j++){
      const a=j*2.399,rad=.15+(j%3)*.21,x=gx+Math.cos(a)*rad,z=gz+Math.sin(a)*rad;
      mesh(new THREE.CylinderGeometry(.035,.045,.35,5),leaf,x,.25,z);
      const blossom=ball(.16,petal[(j+Math.abs(gx))%3],x,.46,z);blossom.scale.y=.65;
    }
  }
  // A stone plaza and flowers should not prevent walking or planting.
  hud.innerHTML='🌾 <b>FARM VILLAGE 3D</b><small style="display:block;font-weight:400;opacity:.85">TASK 09 · หมู่บ้านและทางเดินหิน</small>';
})();


/* TASK 10 — Living Village: landscaped zones and roaming farm animals */
(function livingVillage10(){
 const green=mat('#5d9c4d'),flowerWhite=mat('#fff2d8'),flowerPink=mat('#f7b8bd'),dark=mat('#3e352c'),animalWhite=mat('#f3e7cd'),animalBrown=mat('#b67e52'),animalPink=mat('#e9b8a8'),beak=mat('#e5a844');
 const hash=n=>{const t=Math.sin(n*91.17+17.4)*15327.83;return t-Math.floor(t)};
 const clear=(x,z)=>Math.abs(x)>3.3&&Math.abs(z+7)>3.3&&!(x>2&&x<23&&z>2&&z<22)&&!(x>-20&&x<-6&&z>-19&&z<-11)&&!(x>7&&x<19&&z>-20&&z<-11)&&!(x>-20&&x<-8&&z>6&&z<16);
 // Grass is deliberately arranged in planted belts, not scattered across walkways.
 const tufts=[];for(let i=0;i<120;i++){const x=-29+hash(i+3)*58,z=-27+hash(i+201)*54;if(clear(x,z))tufts.push([x,z,i])}
 const ggeo=new THREE.ConeGeometry(.21,.58,4);const grassMesh=new THREE.InstancedMesh(ggeo,green,tufts.length);grassMesh.castShadow=false;grassMesh.receiveShadow=false;scene.add(grassMesh);
 const dummy=new THREE.Object3D();tufts.forEach(([x,z,i],k)=>{dummy.position.set(x,.24,z);dummy.rotation.y=hash(i+47)*Math.PI;dummy.scale.set(.6+hash(i+79),.7+hash(i+109),.6+hash(i+117));dummy.updateMatrix();grassMesh.setMatrixAt(k,dummy.matrix)});grassMesh.instanceMatrix.needsUpdate=true;
 // Flower clusters along the outside of the village lanes.
 for(let i=0;i<36;i++){const x=-28+hash(i+300)*56,z=-26+hash(i+700)*52;if(!clear(x,z))continue;const stem=mesh(new THREE.CylinderGeometry(.025,.03,.32,5),green,x,.19,z);stem.castShadow=false;const blossom=ball(.11,i%3===0?flowerWhite:flowerPink,x,.39,z);blossom.castShadow=false}
 // Small fruit trees and bushes mark the outer perimeter of the village.
 for(const [x,z] of [[-27,-22],[-26,17],[27,-22],[26,22],[-23,24],[25,-1],[-24,-2]]){
   const trunk=mesh(new THREE.CylinderGeometry(.23,.32,1.6,7),wood,x,.8,z);
   const crown=ball(1.38,leaves[Math.abs(x+z)%leaves.length],x,2.5,z);crown.scale.set(1.1,.88,1.05);
 }
 const herd=[];
 function animal(kind,x,z){
   const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
   const chicken=kind==='chicken',pig=kind==='pig';
   const coat=chicken?animalWhite:pig?animalPink:animalBrown;
   const body=ball(chicken?.42:.64,coat,0,chicken?.54:.77,0,g);body.scale.set(chicken?.8:1.15,1,chicken?.95:.72);
   const head=ball(chicken?.31:.39,coat,0,chicken?.86:1.01,chicken?.32:.5,g);
   for(const side of [-1,1]){const eye=ball(.07,dark,side*(chicken?.15:.2),chicken? .93:1.13,chicken?.59:.81,g);eye.scale.z=.55}
   if(chicken){const b=mesh(new THREE.ConeGeometry(.13,.25,4),beak,0,.8,.67,g);b.rotation.x=Math.PI/2;ball(.11,mat('#d9685e'),0,1.19,.34,g)}
   else{const nose=ball(.2,pig?animalPink:dark,0,.96,.87,g);nose.scale.z=.42;for(const side of [-1,1]){const ear=ball(.18,coat,side*.28,1.34,.41,g);ear.scale.set(.7,1.1,.6)}}
   for(const side of [-1,1])for(const fore of [-1,1]){const foot=box(.17,.33,.17,coat,side*.28,.23,fore*.32,g);foot.castShadow=false}
   const start=new THREE.Vector3(x,0,z);herd.push({g,start,phase:herd.length*2.4,speed:chicken?.34:.22,range:chicken?1.5:2.1});
 }
 animal('chicken',-23,9);animal('chicken',-21,11);animal('pig',24,-25);animal('sheep',27,-25);animal('sheep',29,-22);
 function animateAnimals(t){const sec=t*.001;for(const a of herd){const theta=sec*a.speed+a.phase;a.g.position.set(a.start.x+Math.sin(theta)*a.range,Math.abs(Math.sin(theta*6))*.025,a.start.z+Math.cos(theta*.73)*a.range*.58);a.g.rotation.y=Math.atan2(Math.cos(theta),-Math.sin(theta*.73)*.73)}requestAnimationFrame(animateAnimals)}
 requestAnimationFrame(animateAnimals);
 hud.innerHTML='🌾 <b>FARM VILLAGE 3D</b><small style="display:block;font-weight:400;opacity:.85">TASK 10 · หมู่บ้านมีชีวิต</small>';
})();
// Lightweight CC0 grass and shrubs, limited to safe verge locations.
(async function livingVillageAssets(){
 try{
  const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
  const loader=new GLTFLoader(),root='https://cdn.jsdelivr.net/gh/Hidencod/tge-assets@main/packs/nature-kit/';
  const spots=[['grass-large.glb',-18,19,.6],['grass-large.glb',-24,-18,.55],['plant-bushdetailed.glb',-20,20,1.1],['plant-bushlarge.glb',23,23,1.3],['plant-bushdetailed.glb',-25,4,1.05],['grass-large.glb',19,24,.65]];
  for(const [name,x,z,height] of spots){await new Promise(resolve=>loader.load(root+name,g=>{const o=g.scene,b=new THREE.Box3().setFromObject(o),h=b.getSize(new THREE.Vector3()).y;if(h>.001){o.scale.setScalar(height/h);o.updateMatrixWorld(true);o.position.set(x,-new THREE.Box3().setFromObject(o).min.y,z);scene.add(o)}resolve()},undefined,()=>resolve()))}
 }catch(e){console.warn('TASK10 optional GLB landscape unavailable',e)}
})();


/* TASK 11 — Village planning: coherent neighborhoods, pasture and orchard */
(function villageLayout11(){
 const stoneMat=mat('#d5c7a9'),edgeMat=mat('#a99c7e'),grassMat=mat('#77a65a'),plank=mat('#a66e44'),ink=mat('#61472f');
 // Existing roads and farming area stay intact; new neighborhood paths branch away.
 function path(x,z,w,d){const p=box(w,.055,d,stoneMat,x,.069,z);p.castShadow=false;p.receiveShadow=true;return p}
 function walkway(x,z,dx,dz,count){
  const g=new THREE.BoxGeometry(.62,.065,.47),o=new THREE.InstancedMesh(g,edgeMat,count);o.castShadow=false;o.receiveShadow=true;scene.add(o);const dummy=new THREE.Object3D();
  for(let i=0;i<count;i++){dummy.position.set(x+i*dx,.105,z+i*dz);dummy.rotation.y=dx?0:Math.PI/2;dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix)}o.instanceMatrix.needsUpdate=true;
 }
 // A quieter residential lane, south of the main intersection.
 path(-11,-22,2.1,10);walkway(-11,-26.4,0,.8,12);
 // Orchard lane west of the existing farm; keep the crop fence and main street clear.
 path(-25,11,1.9,17);walkway(-25,3.5,0,.8,19);
 // TASK 11.1: move pasture well away from the pond (26,13) and crop field (6..19,6..18).
 const grassPasture=mat('#86b96c'),plankFence=mat('#a66e44');
 const meadow=box(12,.035,10,grassPasture,26,.012,-24);meadow.castShadow=false;
 function fenceRail(x,z,w,d){const b=box(w,.15,d,plankFence,x,.77,z);b.castShadow=false}
 for(let i=0;i<=6;i++){const x=20+i*2;box(.18,1.35,.18,plankFence,x,.68,-29);box(.18,1.35,.18,plankFence,x,.68,-19)}
 for(let i=0;i<=5;i++){const z=-29+i*2;box(.18,1.35,.18,plankFence,20,.68,z);box(.18,1.35,.18,plankFence,32,.68,z)}
 for(const z of [-28.5,-27.75,-20.25,-19.5])fenceRail(26,z,12,.12);
 for(const x of [20.15,31.85])for(const z of [-27,-24,-21])if(!(x===20.15&&z===-24))fenceRail(x,z,.12,2.5);
 const barn=new THREE.Group();barn.position.set(28,0,-23);scene.add(barn);
 box(3,2.1,2.6,mat('#c97f5b'),0,1.05,0,barn);
 const roofLeft=box(2.15,.18,3.1,mat('#a95644'),-.85,2.55,0,barn);roofLeft.rotation.z=.45;
 const roofRight=box(2.15,.18,3.1,mat('#a95644'),.85,2.55,0,barn);roofRight.rotation.z=-.45;
 box(.9,1.35,.12,mat('#5b463b'),0,.68,1.36,barn);
 box(1.5,.35,.7,mat('#7e9fb1'),23,.25,-23);
 // Meadow access and short footpath from the village road, without blocking the intersection.
 const trail=box(1.8,.055,9,stoneMat,18.6,.06,-24);trail.castShadow=false;
 // Orchard: deliberately ordered rows rather than random trees.
 const treeTop=[mat('#4e9b58'),mat('#73b86c'),mat('#9acb75')];
 for(const x of [-31,-27])for(const z of [5,10,15,20]){
   const trunk=mesh(new THREE.CylinderGeometry(.18,.27,1.7,7),wood,x,.85,z);
   const canopy=ball(1.05,treeTop[(x+z+100)%3],x,2.25,z);canopy.scale.y=.85;
   for(let k=0;k<3;k++)ball(.13,mat('#e7a65a'),x+Math.cos(k*2.1)*.68,2.25+Math.sin(k*1.9)*.36,z+Math.sin(k*2.1)*.65);
 }
 // Clear, readable signs define the zones.
 function sign(x,z,label){
  box(.13,1.4,.13,plank,x,.72,z);
  box(2.65,.65,.15,mat('#ead6a5'),x,1.55,z);
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#624d35';ctx.font='bold 43px sans-serif';ctx.textAlign='center';ctx.fillText(label,256,81);
  const texture=new THREE.CanvasTexture(canvas);
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.58),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide}));
  plane.position.set(x,1.56,z+.084);scene.add(plane);
 }
 sign(-25,1,'ORCHARD');sign(22,-30,'ANIMAL FARM');sign(-11,-17,'HOMES');
 // Stone planters around market square, leaving walkways open.
 const flowerColors=[mat('#f3c4bf'),mat('#f6df88'),mat('#f5eee0')];
 for(const [x,z] of [[-13,-3],[-12,-8],[-5,-10],[6,-11],[9,-4]]){
   box(1.5,.3,.7,plank,x,.15,z);
   for(let j=0;j<4;j++){const px=x-.52+j*.34;mesh(new THREE.CylinderGeometry(.025,.03,.32,5),grassMat,px,.45,z);ball(.12,flowerColors[j%3],px,.68,z)}
 }
 hud.innerHTML='🌾 <b>FARM VILLAGE 3D</b><small style="display:block;font-weight:400;opacity:.85">TASK 11 · จัดผังหมู่บ้านและฟาร์มสัตว์</small>';
})();

/* TASK 11.1 — Cultivated beds and tidy village greenery */
(function polishVillage111(){
 const ridge=mat('#9a6440'),seed=mat('#b18a56'),leaf=mat('#568e42'),flower=mat('#f2d98b');
 // Existing interactive plots remain untouched: add raised furrows within each plot.
 for(const p of plots){
   p.seedlings=[];
   for(const dx of [-.55,0,.55]){
     const r=box(.23,.095,1.48,ridge,p.x+dx,.17,p.z);r.castShadow=false;
     for(const dz of [-.52,.12,.55]){
       const sprout=mesh(new THREE.ConeGeometry(.13,.31,5),leaf,p.x+dx,.38,p.z+dz);sprout.castShadow=false;sprout.visible=p.grown;p.seedlings.push(sprout);
     }
   }
 }
 // A few grouped flower beds, deliberately clear of the crop plot and stone roads.
 for(const [x,z] of [[-18,-17],[-16,-17],[-18,-15],[-16,-15],[13,-20],[15,-20]]){
   const bed=box(1.2,.12,.8,seed,x,.06,z);bed.castShadow=false;
   for(let i=0;i<3;i++){const xx=x-.35+i*.35;mesh(new THREE.CylinderGeometry(.025,.025,.3,5),leaf,xx,.31,z);ball(.12,flower,xx,.5,z)}
 }
 hud.innerHTML='🌾 <b>FARM VILLAGE 3D</b><small style="display:block;font-weight:400;opacity:.85">TASK 12 · แยกคอกสัตว์และแปลงปลูก</small>';
})();
