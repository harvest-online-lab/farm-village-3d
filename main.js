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
let previous=performance.now(),elapsed=0;function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-previous)/1000);previous=now;const dx=Number(keys.has('right'))-Number(keys.has('left')),dz=Number(keys.has('down'))-Number(keys.has('up'));const len=Math.hypot(dx,dz);if(len){player.position.x=THREE.MathUtils.clamp(player.position.x+dx/len*5*dt,-36,36);player.position.z=THREE.MathUtils.clamp(player.position.z+dz/len*5*dt,-36,36);player.rotation.y=Math.atan2(dx,dz);elapsed+=dt*11;legs[0].rotation.x=Math.sin(elapsed)*.48;legs[1].rotation.x=-Math.sin(elapsed)*.48;arms[0].rotation.x=-Math.sin(elapsed)*.32;arms[1].rotation.x=Math.sin(elapsed)*.32}else{for(const limb of [...legs,...arms])limb.rotation.x*=.78}
camera.position.lerp(new THREE.Vector3(player.position.x+12,15,player.position.z+18),Math.min(1,dt*4));camera.lookAt(player.position.x,1,player.position.z);renderer.render(scene,camera)}requestAnimationFrame(frame);addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
