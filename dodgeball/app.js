(() => {
  'use strict';
  const BASE = window.WINGS_ROSTER;
  const KEY = 'wings-public-lineup-v1';
  const $ = id => document.getElementById(id);
  const fresh = () => ({slot:0, numbers:Object.fromEntries(BASE.map(p=>[p.id,{number:p.number,pending:p.pending}])), boards:[{},{},{}],formations:[{},{},{}],modes:['manual','manual','manual'],showPaths:true,speed:1800});
  // Only known player IDs and legal, normalized court coordinates are restored.
  function zone(x,y) {
    if(x>=.20&&x<=.80&&y>=.50&&y<=.8334) return 'inner';
    if(x>=.0625&&x<=.9375&&y>=.0667&&y<.50 && (y<=.1667||x<=.20||x>=.80)) return 'outer';
    return null;
  }
  function clean(raw) {
    const next=fresh();
    if(!raw||typeof raw!=='object')return next;
    if(Number.isInteger(raw.slot)&&raw.slot>=0&&raw.slot<3)next.slot=raw.slot;
    for(const p of BASE){const n=raw.numbers?.[p.id];if(n&&Number.isInteger(n.number)&&n.number>=1&&n.number<=99)next.numbers[p.id]={number:n.number,pending:!!n.pending};}
    for(let i=0;i<3;i++){let count=0;for(const p of BASE){const pos=raw.boards?.[i]?.[p.id];if(pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&zone(pos.x,pos.y)&&count<12){next.boards[i][p.id]={x:pos.x,y:pos.y};count++;}}}
    for(let i=0;i<3;i++)for(const mode of ['attack','defense']){const saved=raw.formations?.[i]?.[mode];if(!saved||typeof saved!=='object')continue;const valid={};for(const p of BASE){const pos=saved[p.id];if(pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.y)&&zone(pos.x,pos.y)&&Object.keys(valid).length<12)valid[p.id]={x:pos.x,y:pos.y};}if(Object.keys(valid).length)next.formations[i][mode]=valid;}
    for(let i=0;i<3;i++)if(['attack','defense','manual'].includes(raw.modes?.[i]))next.modes[i]=raw.modes[i];
    next.showPaths=raw.showPaths!==false;if([900,1800,3000].includes(raw.speed))next.speed=raw.speed;
    return next;
  }
  let state=fresh(),selected=null,history=[],drag=null,timer,motion=null,looping=false,loopTimer=null,lastRoutes={};
  let storageOK=true;
  try{const value=localStorage.getItem(KEY);if(value)state=clean(JSON.parse(value));}catch{storageOK=false;}
  const positions=()=>state.boards[state.slot];
  const roster=id=>BASE.find(p=>p.id===id);
  const label=id=>{const n=state.numbers[id];return `${n.number}${n.pending?'?':''}`;};
  function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('toast').classList.remove('show'),2600);}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}$('saveStatus').textContent=storageOK?'이 브라우저에 자동 저장':'자동 저장이 차단됐어요 · 창을 닫기 전 배치 이미지를 저장하세요';}
  function checkpoint(){stopLoop();stopMotion();history.push(JSON.stringify(state));if(history.length>40)history.shift();}
  function commit(){save();render();}
  function token(p,onField){
    const button=document.createElement('button');button.type='button';button.dataset.player=p.id;
    button.className='token'+(onField?' field-token '+zone(positions()[p.id].x,positions()[p.id].y):'')+(selected===p.id?' selected':'');
    button.setAttribute('aria-pressed',String(selected===p.id));button.setAttribute('aria-label',`${p.name} ${label(p.id)}번 ${onField?'주전':'후보'}`);
    const num=document.createElement('span');num.className='num'+(state.numbers[p.id].pending?' pending':'');num.textContent=label(p.id);
    const name=document.createElement('span');name.className='player-name';name.textContent=p.name;button.append(num,name);
    if(onField){button.style.left=positions()[p.id].x*100+'%';button.style.top=positions()[p.id].y*100+'%';}
    button.addEventListener('pointerdown',startDrag);
    button.addEventListener('click',e=>{e.stopPropagation();if(Date.now()<suppressClickUntil)return;if(selected&&selected!==p.id){swapOrSelect(selected,p.id);}else{selected=selected===p.id?null:p.id;render();}if(selected&&!onField&&matchMedia('(max-width:700px)').matches)$('board').scrollIntoView({block:'center',behavior:'auto'});});
    return button;
  }
  function render(){
    const pos=positions(),count=Object.keys(pos).length,inner=Object.values(pos).filter(p=>zone(p.x,p.y)==='inner').length;
    $('tokens').replaceChildren(...BASE.filter(p=>pos[p.id]).map(p=>token(p,true)));
    const bench=BASE.filter(p=>!pos[p.id]);$('bench').replaceChildren(...bench.map(p=>token(p,false)));
    if(!bench.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='코트 이름표를 이곳으로 옮겨 주세요.';$('bench').append(empty);}
    $('fieldCount').textContent=`${count} / 12명`;$('benchCount').textContent=`${bench.length}명`;$('innerCount').textContent=inner;$('outerCount').textContent=count-inner;
    $('ready').textContent=count===12?'12명 배치 완료':`${12-count}명을 더 골라 주세요`;$('ready').classList.toggle('complete',count===12);
    document.querySelectorAll('[data-slot]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.slot)===state.slot);b.setAttribute('aria-pressed',String(Number(b.dataset.slot)===state.slot));});
    $('undo').disabled=!history.length;
    const p=roster(selected);$('selectedName').textContent=p?p.name:'선수를 선택하세요';
    $('selectedInfo').textContent=p?`${label(p.id)}번 · ${pos[p.id]?(zone(pos[p.id].x,pos[p.id].y)==='inner'?'주전 / 내야':'주전 / 외야'):'후보'}${state.numbers[p.id].pending?' · 등번호 확인 필요':''} · 코트를 누르면 이동`:'이름표를 누르면 위치와 등번호를 확인할 수 있어요.';
    $('jersey').disabled=!p;$('numberSave').disabled=!p;$('deselect').disabled=!p;$('toBench').disabled=!p||!pos[p.id];$('jersey').value=p?state.numbers[p.id].number:'';
    $('instruction').textContent=p?`${p.name} 선택 중 · 코트를 눌러 배치하거나 다른 이름표를 눌러 교체하세요.`:'후보 이름표를 끌어 놓거나, 이름을 누른 뒤 코트의 원하는 곳을 누르세요.';
    $('board').classList.toggle('target',!!selected&&!pos[selected]);
    const mode=state.modes[state.slot];$('modeLabel').textContent=mode==='attack'?'공격':mode==='defense'?'수비':'직접 배치';
    $('attack').classList.toggle('mode-active',mode==='attack');$('defense').classList.toggle('mode-active',mode==='defense');
    $('showPaths').checked=state.showPaths;$('motionSpeed').value=state.speed;
    $('motionPaths').style.display=state.showPaths?'block':'none';
    const saved=state.formations[state.slot];$('formationSaved').textContent=`공격: ${saved.attack?'직접 저장한 대형':'기본 예시'} · 수비: ${saved.defense?'직접 저장한 대형':'기본 예시'}`;
    for(const id of ['attack','defense','playMotion','saveAttack','saveDefense'])$(id).disabled=!count;
    $('playMotion').textContent=looping?'■ 반복 정지':'▶ 공수 반복';$('playMotion').classList.toggle('playing',looping);
  }
  function manual(){state.modes[state.slot]='manual';lastRoutes={};$('routeLines').replaceChildren();$('motionStatus').textContent='직접 배치 중 · 원하는 위치를 공수 대형으로 저장할 수 있어요.';}
  function swapOrSelect(a,b){const pos=positions();if(!pos[a]&&!pos[b]){selected=b;render();return;}checkpoint();const pa=pos[a],pb=pos[b];if(pb)pos[a]={...pb};else delete pos[a];if(pa)pos[b]={...pa};else delete pos[b];for(const mode of ['attack','defense']){const saved=state.formations[state.slot][mode];if(!saved)continue;const sa=saved[a],sb=saved[b];delete saved[a];delete saved[b];if(sb)saved[a]=sb;if(sa)saved[b]=sa;}manual();selected=a;commit();toast(`${roster(a).name} ↔ ${roster(b).name} 교체`);}
  function place(id,x,y){
    if(!zone(x,y)){toast('우리 내야 또는 상대 내야를 둘러싼 우리 외야에 놓아 주세요.');return;}
    const pos=positions();if(!pos[id]&&Object.keys(pos).length>=12){toast('주전은 12명까지예요. 코트 선수 위에 놓으면 교체할 수 있어요.');return;}
    checkpoint();pos[id]={x,y};manual();selected=id;commit();
  }
  function toBench(id){if(!positions()[id])return;checkpoint();delete positions()[id];manual();selected=id;commit();toast(`${roster(id).name} 후보로 이동`);}
  function boardPoint(clientX,clientY){const rect=$('board').getBoundingClientRect();return {x:(clientX-rect.left)/rect.width,y:(clientY-rect.top)/rect.height};}
  $('board').addEventListener('click',e=>{if(Date.now()<suppressClickUntil||!selected||e.target.closest('[data-player]'))return;const p=boardPoint(e.clientX,e.clientY);place(selected,p.x,p.y);});
  $('bench').addEventListener('click',e=>{if(Date.now()<suppressClickUntil||e.target.closest('[data-player]'))return;if(selected)toBench(selected);});
  let suppressClickUntil=0;
  function startDrag(e){
    if(e.button!==0||drag)return;
    if(motion){toast('대형 이동이 끝나면 이름표를 끌어 주세요.');return;}stopLoop();
    drag={id:e.currentTarget.dataset.player,startX:e.clientX,startY:e.clientY,pointerId:e.pointerId,source:e.currentTarget,ghost:null};
    // Capture keeps touch dragging active even when a finger leaves the name tag.
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  window.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.pointerId)return;
    if(!drag.ghost&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<7)return;
    e.preventDefault();
    if(!drag.ghost){drag.ghost=drag.source.cloneNode(true);drag.ghost.removeAttribute('data-player');drag.ghost.removeAttribute('style');drag.ghost.className='token drag-ghost';document.body.append(drag.ghost);drag.source.classList.add('drag-source');drag.scrollFrame=requestAnimationFrame(dragScroll);}
    drag.clientY=e.clientY;
    drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
    const target=document.elementFromPoint(e.clientX,e.clientY);$('bench').classList.toggle('target',!!target?.closest('#bench'));
  },{passive:false});
  function dragScroll(){if(!drag?.ghost)return;const y=drag.clientY;if(y<70)scrollBy(0,-Math.ceil((70-y)/5));else if(y>innerHeight-70)scrollBy(0,Math.ceil((y-innerHeight+70)/5));drag.scrollFrame=requestAnimationFrame(dragScroll);}
  function endDrag(e,cancel=false){
    if(!drag||e.pointerId!==drag.pointerId)return;
    const current=drag;drag=null;cancelAnimationFrame(current.scrollFrame);current.source.classList.remove('drag-source');$('bench').classList.remove('target');
    if(!current.ghost)return;
    current.ghost.remove();suppressClickUntil=Date.now()+400;
    if(cancel)return;
    const target=document.elementFromPoint(e.clientX,e.clientY),other=target?.closest('[data-player]');
    if(other&&other.dataset.player!==current.id){swapOrSelect(current.id,other.dataset.player);return;}
    if(target?.closest('#bench')){toBench(current.id);return;}
    if(target?.closest('#board')){const point=boardPoint(e.clientX,e.clientY);place(current.id,point.x,point.y);}
  }
  window.addEventListener('pointerup',e=>endDrag(e));window.addEventListener('pointercancel',e=>endDrag(e,true));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){selected=null;render();}});
  $('deselect').onclick=()=>{selected=null;render();};$('toBench').onclick=()=>{if(selected)toBench(selected);};
  $('undo').onclick=()=>{if(!history.length)return;stopLoop();stopMotion();state=clean(JSON.parse(history.pop()));selected=null;lastRoutes={};$('routeLines').replaceChildren();commit();};
  $('numberSave').onclick=()=>{if(!selected)return;const number=Number($('jersey').value);if(!Number.isInteger(number)||number<1||number>99){toast('등번호는 1~99 사이 숫자로 입력하세요.');return;}const duplicate=BASE.find(p=>p.id!==selected&&state.numbers[p.id].number===number&&!state.numbers[p.id].pending);if(duplicate){toast(`${number}번은 ${duplicate.name}의 확정 번호입니다.`);return;}checkpoint();state.numbers[selected]={number,pending:false};commit();toast('등번호를 확정했습니다.');};
  $('clear').onclick=()=>{if(!Object.keys(positions()).length)return;checkpoint();state.boards[state.slot]={};manual();selected=null;commit();toast('전원을 후보로 옮겼어요. 되돌리기로 복구할 수 있어요.');};
  $('arrange').onclick=()=>{const ids=BASE.filter(p=>positions()[p.id]&&zone(positions()[p.id].x,positions()[p.id].y)==='inner').map(p=>p.id);if(!ids.length){toast('내야에 선수를 먼저 배치해 주세요.');return;}checkpoint();ids.forEach((id,i)=>{positions()[id]={x:[.30,.50,.70][i%3],y:.54+Math.floor(i/3)*.086};});manual();commit();};
  document.querySelectorAll('[data-slot]').forEach(button=>button.onclick=()=>{const slot=Number(button.dataset.slot);if(slot===state.slot)return;checkpoint();state.slot=slot;selected=null;lastRoutes={};$('routeLines').replaceChildren();$('motionStatus').textContent='공격·수비 버튼으로 현재 주전의 대형을 전환하세요.';commit();});

  function stopMotion(){if(motion){cancelAnimationFrame(motion.raf);motion=null;}$('board').classList.remove('moving');}
  function stopLoop(){looping=false;clearTimeout(loopTimer);loopTimer=null;$('playMotion').textContent='▶ 공수 반복';$('playMotion').classList.remove('playing');}
  const copyPositions=pos=>Object.fromEntries(Object.entries(pos).map(([id,p])=>[id,{...p}]));
  function defaultFormation(mode){
    const pos=positions(),result={},inner=BASE.filter(p=>pos[p.id]&&zone(pos[p.id].x,pos[p.id].y)==='inner');
    // Keep player identity stable across modes. The same selected team stays on court.
    const rows=Math.ceil(inner.length/3),start=mode==='attack'?.54:.79-Math.max(0,rows-1)*.08;
    for(let i=0;i<inner.length;i++){const row=Math.floor(i/3),count=Math.min(3,inner.length-row*3),column=i%3,spread=mode==='attack'?.17:.225;result[inner[i].id]={x:.5+(column-(count-1)/2)*spread,y:start+row*.08};}
    const groups={left:[],right:[],top:[]};for(const p of BASE){const at=pos[p.id];if(!at||zone(at.x,at.y)!=='outer')continue;groups[at.x<.2?'left':at.x>.8?'right':'top'].push(p);}
    for(const [side,players] of Object.entries(groups))players.forEach((p,i)=>{const t=(i+.5)/players.length;if(side==='top')result[p.id]={x:.16+t*.68,y:mode==='attack'?.13:.10};else result[p.id]={x:side==='left'?.13:.87,y:players.length===1?(mode==='attack'?.39:.25):.20+t*.24};});
    return result;
  }
  function route(from,to){
    const result=[{...from}],a=zone(from.x,from.y),b=zone(to.x,to.y);
    if(a==='inner'&&b==='inner'){result.push({...to});return result;}
    const side=p=>p.x<.2?'left':p.x>.8?'right':'top';
    if(a==='outer'&&b==='outer'){
      const sa=side(from),sb=side(to);
      if(sa!==sb){if(sa!=='top')result.push({x:sa==='left'?.13:.87,y:from.y});result.push({x:sa==='top'?from.x:sa==='left'?.13:.87,y:.115});result.push({x:sb==='top'?to.x:sb==='left'?.13:.87,y:.115});if(sb!=='top')result.push({x:sb==='left'?.13:.87,y:to.y});}
    }else{
      const outer=a==='outer'?from:to,inner=a==='inner'?from:to,s=side(outer),x=s==='left'?.13:s==='right'?.87:inner.x<.5?.13:.87;
      const corridor=[{x:outer.x,y:.115},{x,y:.115},{x,y:.50},{x:inner.x,y:.50}];result.push(...(a==='outer'?corridor:corridor.reverse()));
    }
    result.push({...to});return result.filter((p,i,list)=>!i||Math.hypot(p.x-list[i-1].x,p.y-list[i-1].y)>.0001);
  }
  function pathPoint(points,progress){
    const lengths=points.slice(1).map((p,i)=>Math.hypot((p.x-points[i].x)*800,(p.y-points[i].y)*900)),total=lengths.reduce((a,b)=>a+b,0);let distance=total*progress;
    for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const t=lengths[i]?distance/lengths[i]:1;return {x:points[i].x+(points[i+1].x-points[i].x)*t,y:points[i].y+(points[i+1].y-points[i].y)*t};}distance-=lengths[i];}return points[points.length-1];
  }
  function drawRoutes(routes){
    $('routeLines').replaceChildren();for(const points of Object.values(routes)){if(points.length<2)continue;const line=document.createElementNS('http://www.w3.org/2000/svg','path');line.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p.x*800} ${p.y*900}`).join(' '));line.setAttribute('fill','none');line.setAttribute('stroke','#ffcd87');line.setAttribute('stroke-width','3');line.setAttribute('stroke-dasharray','8 7');line.setAttribute('opacity','.8');line.setAttribute('marker-end','url(#moveArrow)');$('routeLines').append(line);}
  }
  function animateFormation(from,to,mode){
    lastRoutes={};for(const id of Object.keys(to)){const start=from[id]||to[id];if(Math.hypot(start.x-to[id].x,start.y-to[id].y)>.001)lastRoutes[id]=route(start,to[id]);}
    drawRoutes(lastRoutes);const start=performance.now(),duration=matchMedia('(prefers-reduced-motion:reduce)').matches?100:state.speed;
    motion={raf:null,current:copyPositions(from)};$('board').classList.add('moving');$('motionStatus').textContent=`${mode==='attack'?'공격':'수비'} 대형으로 이동 중…`;
    function frame(now){if(!motion)return;const progress=Math.min(1,(now-start)/duration),eased=progress*progress*(3-2*progress);
      for(const id of Object.keys(to)){const point=lastRoutes[id]?pathPoint(lastRoutes[id],eased):to[id],element=$('tokens').querySelector(`[data-player="${id}"]`);motion.current[id]=point;if(element){element.style.left=point.x*100+'%';element.style.top=point.y*100+'%';}}
      if(progress<1)motion.raf=requestAnimationFrame(frame);else{stopMotion();$('motionStatus').textContent=`${mode==='attack'?'공격':'수비'} 대형 도착 · 화살표는 방금 이동한 동선입니다.`;if(looping)loopTimer=setTimeout(()=>applyFormation(mode==='attack'?'defense':'attack',true),700);}
    }
    // Set the starting coordinates before the browser's next paint.
    frame(start);
  }
  function applyFormation(mode,repeat=false){
    if(!Object.keys(positions()).length){toast('먼저 주전 이름표를 코트에 올려 주세요.');return;}
    const origin=copyPositions(motion?.current||positions());
    if(!repeat)checkpoint();else stopMotion();
    const saved=state.formations[state.slot][mode],ids=Object.keys(positions()),matches=saved&&ids.length===Object.keys(saved).length&&ids.every(id=>saved[id]);
    const target=matches?copyPositions(saved):defaultFormation(mode);state.boards[state.slot]=target;state.modes[state.slot]=mode;selected=null;save();render();animateFormation(origin,target,mode);if(!repeat&&matchMedia('(max-width:700px)').matches)$('board').scrollIntoView({block:'center',behavior:'auto'});
    if(saved&&!matches&&!repeat)toast('주전 구성이 달라 현재 선수들의 기본 예시 대형으로 이동합니다.');
  }
  function saveFormation(mode){if(!Object.keys(positions()).length)return;checkpoint();state.formations[state.slot][mode]=copyPositions(positions());state.modes[state.slot]=mode;lastRoutes={};$('routeLines').replaceChildren();commit();toast(`현재 위치를 ${mode==='attack'?'공격':'수비'} 대형으로 저장했습니다.`);}
  $('attack').onclick=()=>applyFormation('attack');$('defense').onclick=()=>applyFormation('defense');
  $('saveAttack').onclick=()=>saveFormation('attack');$('saveDefense').onclick=()=>saveFormation('defense');
  $('showPaths').onchange=()=>{state.showPaths=$('showPaths').checked;save();$('motionPaths').style.display=state.showPaths?'block':'none';};
  $('motionSpeed').onchange=()=>{state.speed=Number($('motionSpeed').value);save();};
  $('playMotion').onclick=()=>{if(looping){stopLoop();stopMotion();render();$('motionStatus').textContent='반복 재생을 멈췄어요.';return;}checkpoint();looping=true;applyFormation(state.modes[state.slot]==='attack'?'defense':'attack',true);if(matchMedia('(max-width:700px)').matches)$('board').scrollIntoView({block:'center',behavior:'auto'});};
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopLoop();stopMotion();render();}});
  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  async function exportImage(){
    stopLoop();stopMotion();render();
    const button=$('export');button.disabled=true;
    try{
      await document.fonts.ready;
      const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1750;const ctx=canvas.getContext('2d');
      ctx.fillStyle='#f2f2eb';ctx.fillRect(0,0,1200,1750);ctx.fillStyle='#203a35';ctx.font='bold 42px Malgun Gothic, sans-serif';ctx.fillText(`은계윙스 · 배치 ${state.slot+1}`,70,80);
      const count=Object.keys(positions()).length;ctx.font='23px Malgun Gothic, sans-serif';ctx.fillText(`주전 ${count}/12명 · 후보 ${18-count}명 · ${state.modes[state.slot]==='attack'?'공격 대형':state.modes[state.slot]==='defense'?'수비 대형':'직접 배치'}`,70,125);
      const blob=new Blob([new XMLSerializer().serializeToString($('courtArt'))],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),img=new Image();
      try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});ctx.drawImage(img,120,160,960,1080);}finally{URL.revokeObjectURL(url);}
      if(state.showPaths){ctx.save();ctx.strokeStyle='#ffcd87';ctx.fillStyle='#ffcd87';ctx.lineWidth=4;ctx.setLineDash([10,8]);for(const points of Object.values(lastRoutes)){ctx.beginPath();points.forEach((p,i)=>{const x=120+p.x*960,y=160+p.y*1080;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.stroke();const end=points[points.length-1],prev=points[points.length-2];if(prev){const x=120+end.x*960,y=160+end.y*1080,angle=Math.atan2((end.y-prev.y)*1080,(end.x-prev.x)*960);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-15*Math.cos(angle-.5),y-15*Math.sin(angle-.5));ctx.lineTo(x-15*Math.cos(angle+.5),y-15*Math.sin(angle+.5));ctx.closePath();ctx.fill();}}ctx.restore();}
      ctx.textAlign='center';ctx.textBaseline='middle';
      for(const p of BASE){const pos=positions()[p.id];if(!pos)continue;const x=120+pos.x*960,y=160+pos.y*1080;ctx.fillStyle=zone(pos.x,pos.y)==='outer'?'#fff0d9':'#fffaf0';roundRect(ctx,x-65,y-27,130,54,9);ctx.fillStyle='#21473c';ctx.font='bold 20px Malgun Gothic, sans-serif';ctx.fillText(`${label(p.id)}  ${p.name}`,x,y);}
      ctx.textAlign='left';ctx.font='bold 28px Malgun Gothic, sans-serif';ctx.fillStyle='#203a35';ctx.fillText('후보 선수',70,1290);
      const bench=BASE.filter(p=>!positions()[p.id]);bench.forEach((p,i)=>{const x=70+(i%6)*178,y=1330+Math.floor(i/6)*75;ctx.fillStyle='#fffefa';roundRect(ctx,x,y,165,54,9);ctx.fillStyle='#24483a';ctx.font='bold 19px Malgun Gothic, sans-serif';ctx.fillText(`${label(p.id)}  ${p.name}`,x+12,y+28);});
      ctx.fillStyle='#7b806e';ctx.font='19px Malgun Gothic, sans-serif';ctx.fillText('? = 등번호 확인 필요 · 배치용 도식',70,1635);ctx.fillText('내야·외야를 합해 12명 · 최종 출전 명단은 현장에서 확인',70,1675);
      const output=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!output)throw new Error('PNG 생성 실패');const href=URL.createObjectURL(output),a=document.createElement('a');a.href=href;a.download=`은계윙스_배치${state.slot+1}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(href),30000);toast('배치 이미지를 저장했습니다.');
    }catch(error){console.error(error);toast('이미지 저장에 실패했어요. 다시 시도해 주세요.');}finally{button.disabled=false;}
  }
  $('export').onclick=exportImage;
  save();render();
})();

