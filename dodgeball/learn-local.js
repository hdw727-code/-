(()=>{
const LearningModel=(()=>{
const lessons = {
  throw: {file:'media/throw-v13.mp4',poster:'media/throw-poster.jpg',title:'던지기',heading:'팔만 세게 휘두르기보다\n몸의 흐름을 살펴봐요.',limit:'경험자의 도약이 섞인 시범입니다. 초보자는 점프 없이 제자리에서 작게 시작해요. 힘이나 거리의 향상을 보장하는 영상이 아닙니다.',repeat:[6,13.5],duration:66.5,chapters:[['전체 동작',6],['느리게 관찰',7.5],['디딤·균형 살피기',20.5],['몸통과 팔 연결',27.5],['안전한 연습',43.5],['짝과 확인',55.5]],text:['목표를 먼저 확인하고, 던지는 팔과 반대발을 목표 쪽으로 내딛는 연습을 해요. 원본 화면의 발을 좌우 정답으로 외우지는 않아요.','몸통과 팔의 움직임은 서로 겹쳐요. 발→몸통→팔이라는 말은 각 단계마다 멈추라는 뜻이 아닙니다.','공을 놓은 뒤 팔과 몸이 이어 움직이며 균형을 회복해요. 손목을 세게 꺾거나 팔꿈치를 억지로 높이지 않아요.','부드러운 공으로 큰 빈 목표에 천천히 던져요. 한 명씩 던지고, 신호 뒤 공을 주워요. 균형과 정확도가 유지될 때 거리를 조금씩 바꿔요.']},
  catch: {file:'media/catch-v14.mp4',poster:'media/catch-poster.jpg',title:'잡기',heading:'오는 공을 보고,\n팔을 부드럽게 받아들여요.',limit:'후면 실제 포구와, 이미 잡은 공을 당기는 정면 시범은 다른 장면입니다. 손가락의 최초 접촉은 불명확해요. 무릎 포구는 따라 하지 않아요.',repeat:[6,11.5],duration:69.9,chapters:[['실제 들어오는 공',6],['느리게 관찰',7.1],['팔굽힘 구간',24.5],['보유공 시범 구분',30.5],['보유공·유지 시범',39.5],['안전한 짝 연습',50.9]],text:['서서 균형을 잡고 오는 공을 살펴요. 이 영상의 후면 장면에서는 시선과 손가락의 정확한 모양을 확인할 수 없습니다.','팔과 공이 몸 가까이 움직이는 변화를 관찰해요. 팔을 부드럽게 굽히는 것은 충격을 완화하는 일반 원리이며, 이 영상으로 힘이나 관절 각도를 측정한 것은 아닙니다.','정면 시범은 이미 잡은 공을 당기는 모습입니다. 들어오는 공과의 최초 접촉이나 모든 높이의 손 모양을 가르치는 장면이 아닙니다.','가까운 거리에서 부드러운 공을 몸통 높이로 가볍게 주고받아요. 받는 친구의 준비 신호를 확인해요. 눈·얼굴로 오는 공을 억지로 잡지 않아요.']}
};
const practiceLimits={throw:'시범에는 도약이 섞여 있어요. 초보 연습은 점프 없이 작게 시작해요.',catch:'무릎 포구를 따라 하지 않아요. 초보 연습은 서서, 부드러운 공을 몸통 높이로 받아요.'};
const watchCues = {
 throw:[
  [0,6,'몸의 움직임을 공으로 이어 보내는 기술을 관찰해요. 즉시 근력이 커진다는 뜻은 아닙니다.'],
  [6,7.5,'먼저 한 동작을 쭉 봐요. 숙련자의 도약은 초보 연습에서 따라 하지 않아요.'],
  [7.5,13.5,'이미 느려진 장면입니다. 발·몸통·팔이 이어 움직이는 흐름을 살펴봐요.'],
  [13.5,20.5,'목표와 던질 공간을 먼저 확인해요. 원본 프레임을 멈춰 보여주는 구간입니다.'],
  [20.5,27.5,'일반 지도 원리: 던지는 팔과 반대발을 작게 내딛어요. 화면의 좌우를 정답으로 외우지는 않아요.'],
  [27.5,33.5,'몸통과 팔의 움직임은 겹칩니다. 단계마다 멈추거나 팔만 세게 휘두르지 않아요.'],
  [33.5,40.5,'공을 놓은 뒤 팔과 몸이 이어 움직이는 마무리를 봐요. 손목을 억지로 꺾지 않아요.'],
  [40.5,43.5,'같은 동작의 흐름을 다시 봐요. 이 구간도 편집 과정에서 느려진 영상입니다.'],
  [43.5,49.5,'부드러운 공으로 큰 빈 목표에 한 명씩 작게 던져요. 초보자는 점프 없이 시작해요.'],
  [49.5,55.5,'균형과 정확도가 유지될 때 거리를 조금씩 바꿔요. 멀리 던지기를 보장하는 설명은 아닙니다.'],
  [55.5,62.5,'짝은 실제로 보인 한 가지를 말해요. 다음 시도에서는 그 한 가지만 바꿔 봐요.'],
  [62.5,66.5,'실제 원본을 활용한 수업 검토 영상입니다. 원본 미러 여부와 힘의 크기는 확인하지 못했어요.']
 ],
 catch:[
  [0,6,'오는 공과 팔의 변화를 관찰해요. 영상의 무릎 포구를 따라 하는 연습은 아닙니다.'],
  [6,7.1,'A: 실제 들어오는 공을 받는 장면입니다. 앞쪽에서 받는 사람을 살펴봐요.'],
  [7.1,11.5,'A: 이미 느려진 실제 포구입니다. 흐림 때문에 최초 손가락 접촉은 확정할 수 없어요.'],
  [11.5,18.5,'일반 지도 원리: 서서 균형을 잡고 오는 공을 살펴요. 정확한 시선은 후면 영상으로 확인할 수 없어요.'],
  [18.5,24.5,'A: 공이 손 근처에 온 프레임입니다. 최초 접촉 순간이나 손가락 모양의 정답으로 삼지 않아요.'],
  [24.5,30.5,'A: 팔과 공이 몸 가까이 움직이는 변화를 봐요. 힘이나 관절 각도를 측정한 설명은 아닙니다.'],
  [30.5,33.5,'장면이 B로 바뀝니다. 여기부터는 이미 공을 가진 시범이며 새로 오는 공을 받는 장면이 아니에요.'],
  [33.5,39.5,'B: 이미 가진 공으로 팔굽힘을 보여줘요. 실제 입사 공과의 첫 접촉을 설명하지 않아요.'],
  [39.5,46.5,'B: 보유공을 유지하는 시범입니다. 공을 얼굴로 당기지 않고 몸 앞에 두는 원리를 살펴봐요.'],
  [46.5,50.9,'다시 A: 실제 오는 공을 받는 흐름입니다. 앞의 보유공 시범과 구분해 봐요.'],
  [50.9,57.9,'학생 연습: 서서, 가까이서, 몸통 높이로 가볍게 보내요. 받는 친구의 준비 신호를 확인해요.'],
  [57.9,64.9,'짝이 본 사실 한 가지를 말해요. 눈·얼굴로 오는 공을 억지로 잡지 않아요.'],
  [64.9,69.9,'실제 포구 A와 보유공 시범 B를 구분했나요? 손가락 접촉이 안 보이는 부분은 단정하지 않아요.']
 ]
};
function watchCueFor(id,seconds){if(!Object.hasOwn(watchCues,id))return '';const list=watchCues[id],time=Number.isFinite(seconds)?Math.max(0,seconds):0;return (list.find(([start,end])=>time>=start&&time<end)||list[list.length-1])[2];}
const lessonChecks = {
 throw:[{id:'stepBalance',text:'점프 없이 작게 내딛을 때 균형이 유지됐는지 짝과 확인했어요.'},{id:'bodyFlow',text:'팔만 힘껏 휘두르기보다 몸통과 팔을 이어 움직이는지 살펴봤어요.'},{id:'safeFinish',text:'큰 빈 목표에 한 명씩 던지고, 마무리 균형과 공 회수 신호를 확인했어요.'}],
 catch:[{id:'ready',text:'서서 균형을 잡고 받는 친구의 준비 신호를 확인했어요.'},{id:'softArms',text:'몸통 높이의 약한 공을 보고 팔을 부드럽게 굽혀 받는지 짝과 살펴봤어요.'},{id:'secure',text:'공을 얼굴로 당기지 않고 몸 앞에서 확보하는지 확인했어요.'}]
};
const player=(id,x,y,role='inner')=>({id:String(id),x,y,role});
const missions = [
  {id:'space',title:'간격 벌리기',tab:'01 간격 벌리기',phase:'수비 · 이동 공간',target:'2',ball:'B',receiver:null,situation:'공이 상대에게 있어요. 1번과 2번이 가까이 모여 있어 서로의 움직임을 막을 수 있어요.',task:'2번만 옮겨 봐요. 친구·경계와 부딪히지 않고 이동할 공간을 남기려면 어디가 좋을까요?',hint:'멀어질수록 무조건 좋지는 않아요. 주변 선수, 코트 경계, 공을 볼 수 있는 위치를 함께 생각해요.',ideas:['옆으로 움직일 공간을 남기려고','친구와 부딪히지 않으려고'],example:{x:350,y:700},ours:[player(1,250,570),player(2,285,610),player(3,420,600),player(4,540,650),player(5,90,290,'outer')],opponents:[player('A',300,280),player('B',510,330),player('C',440,220)]},
  {id:'pass',title:'패스 길 만들기',tab:'02 패스 길',phase:'공격 · 연결',target:'3',ball:'1',receiver:'5',situation:'1번이 공을 갖고 있고 외야 5번이 받을 준비를 하려고 해요. 3번이 그림의 패스 선 가까이에 서 있어요.',task:'3번만 움직여 두 친구 사이의 길을 살펴봐요. 패스하기 전에는 무엇을 확인해야 할까요?',hint:'선만 비었다고 패스가 성공하는 것은 아니에요. 받는 친구의 신호와 상대 위치를 함께 확인하고, 가까운 거리에서 가볍게 연습해요.',ideas:['패스하는 길과 겹치지 않으려고','받는 친구의 준비 신호를 보려고'],example:{x:520,y:660},ours:[player(1,410,700),player(2,530,570),player(3,300,560),player(4,470,630),player(5,90,250,'outer')],opponents:[player('A',290,260),player('B',520,300),player('C',420,375)]},
  {id:'transition',title:'던진 뒤 수비로',tab:'03 수비 전환',phase:'공격 → 수비',target:'1',ball:'B',receiver:null,situation:'1번이 던진 뒤 앞쪽에 남았어요. 상대 B가 공을 갖고 있어요. 던지고 나서도 다음 공을 살펴야 해요.',task:'1번만 옮겨 수비할 공간을 만들어 봐요. 친구의 이동 경로를 가로지르지 않으면서 균형을 유지할 위치를 생각해요.',hint:'바닥·뒤 공간을 확인하고 몸의 균형을 유지해요. 공에서 시선을 떼고 뒤로 전력질주하라는 뜻이 아니에요. 처음에는 공 없이 걷는 속도로 연습해요.',ideas:['다음 공을 살필 공간을 만들려고','친구의 이동 경로와 겹치지 않으려고'],example:{x:370,y:680},ours:[player(1,370,490),player(2,245,650),player(3,510,620),player(4,560,710),player(5,700,270,'outer')],opponents:[player('A',300,260),player('B',500,340),player('C',430,220)]},
  {id:'signal',title:'내야·외야 신호',tab:'04 내야·외야 신호',phase:'공격 · 의사소통',target:'2',ball:'5',receiver:'2',situation:'외야 5번이 공을 갖고 있어요. 내야에서는 받을 사람이 정해지지 않았고 2번과 3번이 가까이 있어요.',task:'2번만 옮겨 받을 위치를 제안해요. 모두 공 쪽으로 몰리는 대신 ‘누가 받을지’와 ‘준비됐는지’를 먼저 맞춰 봐요.',hint:'2번은 우리 내야 안에 머물러요. 한 사람이 “내가 받을게”, 준비 뒤 “준비”처럼 짧게 말해요. 외야 이동과 패스는 선생님의 수업 규칙을 먼저 확인해요.',ideas:['받을 사람을 분명히 정하려고','받는 위치와 준비 신호를 맞추려고'],example:{x:560,y:680},ours:[player(1,250,620),player(2,405,620),player(3,425,650),player(4,540,550),player(5,710,270,'outer')],opponents:[player('A',300,270),player('B',520,340),player('C',430,220)]}
];
const storageKey='wings-student-learning-v1';
function legalPoint(point) {return point && Number.isFinite(point.x)&&Number.isFinite(point.y)&&point.x>=195&&point.x<=605&&point.y>=485&&point.y<=715;}
function clampPoint(x,y){return {x:Math.max(195,Math.min(605,x)),y:Math.max(485,Math.min(715,y))};}
function freshProgress(){return {version:2,lesson:'throw',mission:'space',observed:{throw:false,catch:false},checks:Object.fromEntries(Object.entries(lessonChecks).map(([id,list])=>[id,Object.fromEntries(list.map(item=>[item.id,false]))])),missions:Object.fromEntries(missions.map(m=>{const p=m.ours.find(p=>p.id===m.target);return [m.id,{point:{x:p.x,y:p.y},reason:'',ready:false,done:false,compared:false}];}))};}
function restoreProgress(raw){const next=freshProgress();if(!raw||typeof raw!=='object')return next;if(Object.hasOwn(lessons,raw.lesson))next.lesson=raw.lesson;if(missions.some(m=>m.id===raw.mission))next.mission=raw.mission;for(const id of ['throw','catch']){next.observed[id]=raw.observed?.[id]===true;for(const item of lessonChecks[id])next.checks[id][item.id]=raw.checks?.[id]?.[item.id]===true;}for(const m of missions){const saved=raw.missions?.[m.id];if(!saved||typeof saved!=='object')continue;const n=next.missions[m.id];if(legalPoint(saved.point))n.point={x:saved.point.x,y:saved.point.y};n.reason=typeof saved.reason==='string'?saved.reason.slice(0,180):'';n.ready=saved.ready===true;n.compared=saved.compared===true;n.done=saved.done===true&&n.compared&&hasMoved(m,n.point);}return next;}
function nearest(m,point){return Math.min(...m.ours.filter(p=>p.role==='inner'&&p.id!==m.target).map(p=>Math.hypot(p.x-point.x,p.y-point.y)));}
function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;if(!den)return Math.hypot(p.x-a.x,p.y-a.y);const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);}
function hasMoved(m,p){const initial=m.ours.find(p=>p.id===m.target);return Math.hypot(initial.x-p.x,initial.y-p.y)>8;}
function feedback(m,saved){
 const initial=m.ours.find(p=>p.id===m.target),point=saved.point;
 if(!hasMoved(m,point))return `${m.target}번의 위치가 처음과 같아요. 먼저 위치 하나를 바꿔 보고 차이를 비교해요.`;
 const gap=nearest(m,point)-nearest(m,initial);let text='';
 if(m.id==='space')text=gap>8?'그림에서 가장 가까운 친구와의 간격이 넓어졌어요. 어느 방향으로 움직일 공간이 생겼나요?':gap< -8?'그림에서 가까운 친구와의 간격이 더 좁아졌어요. 이동하다 부딪히지 않을지 다시 살펴봐요.':'위치는 바뀌었지만 가장 가까운 친구와의 간격은 비슷해요. 다른 친구와 경계도 함께 봐요.';
 if(m.id==='pass'){const a=m.ours.find(p=>p.id===m.ball),b=m.ours.find(p=>p.id===m.receiver);const delta=segmentDistance(point,a,b)-segmentDistance(initial,a,b);text=delta>12?'3번이 그림의 패스 선에서 더 떨어졌어요. 1번과 5번 사이의 길을 비교해요.':'3번과 패스 선이 아직 가까운지 살펴봐요. 선과 겹치지 않을 다른 위치도 시험할 수 있어요.';}
 if(m.id==='transition')text=point.y>initial.y+35?'그림에서 앞쪽에 있던 1번이 우리 내야 안쪽으로 이동했어요. 공을 계속 살피고 균형을 유지하는지는 실제 연습에서 짝이 관찰해요.':'위치는 바뀌었어요. 앞쪽에서 한발 물러설 공간과 옆 친구의 경로를 함께 살펴봐요.';
 if(m.id==='signal')text='2번이 받을 위치를 바꿨어요. 5번에게 위치를 알리고, 누구에게 보낼지 서로 같은 뜻으로 이해했는지 확인해요.';
 if(nearest(m,point)<70)text+='\n다른 친구와 매우 가까운 위치예요. 이동 공간을 조금 더 남겨 봐요.';
 if(m.receiver)text+=saved.ready?'\n받는 친구의 준비 신호를 확인했어요. 선이 비어도 실제 패스 성공을 보장하지는 않아요.':'\n아직 받는 친구의 준비 신호를 확인하지 않았어요. 공을 보내기 전 신호를 맞춰요.';
 return text+'\n도식의 변화만 비교한 결과입니다. 실전 성공 여부를 판정한 것은 아니에요.';
}

return {lessons,practiceLimits,watchCues,watchCueFor,lessonChecks,missions,storageKey,legalPoint,clampPoint,freshProgress,restoreProgress,nearest,segmentDistance,hasMoved,feedback};
})();
const VideoTools=(()=>{
const videoRates=[1,.5,.25];
function validAB(a,b,duration){return Number.isFinite(a)&&Number.isFinite(b)&&Number.isFinite(duration)&&a>=0&&b<=duration&&b-a>=0.1;}
function bindRates(video,root,onError=()=>{}){
 const buttons=root.querySelectorAll('[data-rate]'),label=root.querySelector('#rateStatus');
 function render(){const rate=video.playbackRate;buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.rate)===rate)));if(label)label.textContent=`${rate}배속`;}
 function set(rate){if(!videoRates.includes(rate))return;try{video.defaultPlaybackRate=rate;video.playbackRate=rate;render();}catch{onError('이 브라우저에서 배속을 바꾸지 못했어요. 일반 재생으로 확인해요.');}}
 buttons.forEach(b=>b.onclick=()=>set(Number(b.dataset.rate)));video.addEventListener('ratechange',render);render();return {set};
}
function bindAB(video,root,{status=()=>{},onEnable=()=>{}}={}){
 const aButton=root.querySelector('#markA'),bButton=root.querySelector('#markB'),toggle=root.querySelector('#repeatAB'),clear=root.querySelector('#clearAB'),label=root.querySelector('#abRange');
 let a=null,b=null,enabled=false;
 const time=n=>n===null?'—':`${Math.floor(n/60)}:${(n%60).toFixed(1).padStart(4,'0')}`;
 const ready=()=>Number.isFinite(video.duration)&&video.duration>0&&video.readyState>=2&&!video.seeking;
 function render(){aButton.disabled=bButton.disabled=!ready();toggle.disabled=!ready()||!validAB(a,b,video.duration);toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=`내 A–B 반복: ${enabled?'켜짐':'꺼짐'}`;label.textContent=`A ${time(a)} → B ${time(b)}`;}
 function stop(){enabled=false;render();}
 function reset(){enabled=false;a=b=null;render();}
 function play(){video.play().catch(error=>{if(error.name!=='AbortError')status('영상의 재생 버튼을 눌러 주세요.');});}
 aButton.onclick=()=>{if(!ready())return;stop();a=video.currentTime;if(b!==null&&b-a<.1)b=null;render();status('A 시작점을 표시했어요. 다른 시각으로 이동한 뒤 B를 표시해요.');};
 bButton.onclick=()=>{if(!ready())return;stop();if(a===null){status('A 시작점을 먼저 표시해요.');return;}if(video.currentTime-a<.1){b=null;render();status('B는 A보다 0.1초 이상 뒤로 표시해요.');return;}b=Math.min(video.currentTime,video.duration);render();status('A–B 구간을 정했어요. 내 A–B 반복 버튼으로 확인해요.');};
 toggle.onclick=()=>{if(!ready()||!validAB(a,b,video.duration))return;if(enabled){stop();status('내 A–B 반복을 껐어요.');return;}onEnable();enabled=true;render();video.currentTime=a;play();status('내 A–B 구간을 반복해요. 시간 기준이며 정확한 프레임 이동은 아닙니다.');};
 clear.onclick=()=>{reset();status('이 영상의 A–B 표시를 지웠어요.');};
 video.addEventListener('timeupdate',()=>{if(enabled&&(video.currentTime>=b||video.currentTime<a-.1))video.currentTime=a;});
 video.addEventListener('ended',()=>{if(enabled){video.currentTime=a;play();}});
 for(const event of ['loadeddata','canplay','seeking','seeked'])video.addEventListener(event,render);
 video.addEventListener('emptied',reset);render();return {stop,reset};
}

return {videoRates,validAB,bindRates,bindAB};
})();
const {lessons,lessonChecks,practiceLimits,watchCueFor,missions,storageKey,freshProgress,restoreProgress,legalPoint,clampPoint,feedback,hasMoved}=LearningModel;
const {bindRates,bindAB}=VideoTools;
const $=id=>document.getElementById(id);
let state=freshProgress(),storageOK=true;
try{state=restoreProgress(JSON.parse(localStorage.getItem(storageKey)));}catch{storageOK=false;}
let animation=null,repeat=false,seekAfterLoad=null,drag=null,suppressBoardClick=0,videoEpoch=0,mediaController=null,mediaObjectUrl=null;
const video=$('lessonVideo');
const currentMission=()=>missions.find(m=>m.id===state.mission);
const currentWork=()=>state.missions[state.mission];
const timeLabel=n=>{const fraction=!Number.isInteger(n),seconds=(n%60).toFixed(fraction?1:0);return `${Math.floor(n/60)}:${seconds.padStart(fraction?4:2,'0')}`;};
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}$('storageStatus').textContent=storageOK?'메모·배치는 이 브라우저에만 저장돼요. 기기 간 자동 동기화는 없어요.':'저장이 차단됐어요. 지금 연습은 할 수 있지만 창을 닫으면 기록이 남지 않을 수 있어요.';}
function status(text){$('videoStatus').textContent=text;}
function updateWatchCue(){const text=video.seeking?'선택한 구간을 불러오고 있어요. 영상이 준비되면 관찰 포인트가 나와요.':watchCueFor(state.lesson,video.currentTime);if($('watchCue').textContent!==text)$('watchCue').textContent=text;}
function showVideo(){if(matchMedia('(max-width:950px)').matches)video.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});}
const rateTools=bindRates(video,document,status),abTools=bindAB(video,document,{status,onEnable:()=>stopRepeat()});
function setRate(rate){rateTools.set(rate);}
function showMediaError(kind='network'){$('videoError').hidden=false;const local=document.documentElement.dataset.mode==='local-teacher'||location.protocol==='file:',text=local?'로컬 영상 파일을 읽지 못했어요. 압축을 전부 풀었는지, 영상 폴더가 같은 위치에 있는지 확인해요.':kind==='access'?'로그인 또는 영상 접근 권한을 확인해요. 수업실을 다시 연 뒤 재시도해요.':kind==='file'?'영상 파일을 읽지 못했어요. 다시 시도해도 같으면 선생님께 알려 주세요.':'영상을 불러오지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해요.';$('videoErrorText').textContent=text;status(text);}
function renderChecks(id){
 $('selfCheckList').replaceChildren();
 const count=()=>$('selfCheckCount').textContent=`${lessonChecks[id].filter(item=>state.checks[id][item.id]).length} / ${lessonChecks[id].length}개 확인 · 이 기기에만 저장`;
 for(const item of lessonChecks[id]){const label=document.createElement('label');label.className='check';const input=document.createElement('input');input.type='checkbox';input.checked=state.checks[id][item.id];const span=document.createElement('span');span.textContent=item.text;label.append(input,span);input.onchange=()=>{state.checks[id][item.id]=input.checked;count();save();};$('selfCheckList').append(label);}count();
}
function stopRepeat(){repeat=false;if(seekAfterLoad?.origin==='repeat')seekAfterLoad=null;$('repeatClip').textContent='동작 구간 반복: 꺼짐';$('repeatClip').setAttribute('aria-pressed','false');}
function seekVideo(second,play=false,origin='chapter'){
 const lesson=lessons[state.lesson];const target=Math.min(lesson.duration-.05,Math.max(0,second));
 if(video.readyState<2||video.seekable.length===0||video.seekable.end(video.seekable.length-1)<target){seekAfterLoad={second:target,play,origin};status('영상 정보를 불러온 뒤 선택한 구간으로 이동해요.');return;}
 try{video.currentTime=target;status(`${timeLabel(target)} 구간을 불러오고 있어요.`);if(play)startVideo();}catch{status('아직 구간 이동을 준비 중이에요. 잠시 뒤 다시 눌러 주세요.');}
}
async function startVideo(){const epoch=videoEpoch;try{await video.play();if(epoch===videoEpoch)status(repeat?'선택한 동작 구간을 반복 재생해요.':'재생 중 · 화면의 영상 제어로 멈출 수 있어요.');}catch(error){if(epoch!==videoEpoch||error.name==='AbortError')return;status('화면의 재생 버튼을 한 번 눌러 주세요.');}}
function selectLesson(id){
 videoEpoch++;video.pause();stopRepeat();abTools.reset();seekAfterLoad=null;mediaController?.abort();video.removeAttribute('src');video.load();if(mediaObjectUrl){URL.revokeObjectURL(mediaObjectUrl);mediaObjectUrl=null;}state.lesson=id;const lesson=lessons[id];setRate(1);
 video.poster=lesson.poster;video.setAttribute('aria-label',lesson.title+' 학습 영상');
 $('videoError').hidden=true;$('directVideo').href=lesson.file;$('videoTag').textContent=lesson.title+' · 관찰 포인트';$('videoHeading').textContent=lesson.heading;$('videoHeading').style.whiteSpace='pre-line';$('videoLimit').textContent=lesson.limit;$('practiceLimit').textContent=practiceLimits[id];
 for(const key of ['throw','catch']){const b=$(key+'Tab');b.classList.toggle('selected',key===id);b.setAttribute('aria-pressed',String(key===id));}
 $('observed').checked=state.observed[id];renderChecks(id);$('chapters').replaceChildren();
 lesson.chapters.forEach(([label,seconds])=>{const b=document.createElement('button');b.type='button';const t=document.createElement('span');t.className='chapter-time';t.textContent=timeLabel(seconds);b.append(t,document.createTextNode(label));b.onclick=()=>{stopRepeat();seekVideo(seconds,true);showVideo();};$('chapters').append(b);});
 const ul=document.createElement('ul');for(const text of lesson.text){const li=document.createElement('li');li.textContent=text;ul.append(li);}$('transcriptText').replaceChildren(ul);
 updateWatchCue();status('선택한 영상을 불러오고 있어요. 구간을 먼저 선택해도 됩니다.');save();loadLessonMedia(lesson,videoEpoch);
}
async function loadLessonMedia(lesson,epoch){
 if(location.protocol==='file:'){video.src=lesson.file;video.load();return;}
 const controller=new AbortController();mediaController=controller;
 try{
  // Same-origin, read-only static media. Blob playback avoids relying on host byte-range support.
  const response=await fetch(lesson.file,{method:'GET',signal:controller.signal,credentials:'same-origin',cache:'no-store'});
  if(response.status===401||response.status===403)throw Object.assign(new Error('media access denied'),{kind:'access'});
  if(!response.ok)throw new Error('media response unavailable');
  const blob=await response.blob();
  if(epoch!==videoEpoch||controller.signal.aborted)return;
  if(blob.type.includes('text/html'))throw Object.assign(new Error('sign-in page is not video'),{kind:'access'});
  if(!blob.size||blob.size>12000000)throw Object.assign(new Error('invalid media response'),{kind:'file'});
  mediaObjectUrl=URL.createObjectURL(new Blob([blob],{type:'video/mp4'}));video.src=mediaObjectUrl;video.load();
  if(!seekAfterLoad)status('영상이 준비됐어요. 재생 버튼이나 보고 싶은 구간을 눌러 주세요.');
 }catch(error){if(epoch!==videoEpoch||error.name==='AbortError')return;showMediaError(error.kind);}
}
function applyPendingSeek(){if(seekAfterLoad&&video.readyState>=2&&video.seekable.length>0&&video.seekable.end(video.seekable.length-1)>=seekAfterLoad.second){const pending=seekAfterLoad;seekAfterLoad=null;seekVideo(pending.second,pending.play,pending.origin);}}
for(const event of ['loadeddata','canplay','progress'])video.addEventListener(event,applyPendingSeek);
video.addEventListener('loadeddata',()=>{if(location.protocol==='file:'&&!seekAfterLoad)status('로컬 영상이 준비됐어요. 재생 버튼이나 구간을 선택해요.');});
for(const event of ['loadeddata','seeking','seeked'])video.addEventListener(event,updateWatchCue);
video.addEventListener('seeked',()=>{if(video.paused)status(`${timeLabel(video.currentTime)} 구간이 준비됐어요.`);});
video.addEventListener('timeupdate',()=>{const [start,end]=lessons[state.lesson].repeat;if(repeat&&(video.currentTime>=end||video.currentTime<start-.3)){video.currentTime=start;}updateWatchCue();});
video.addEventListener('ended',()=>{if(repeat){seekVideo(lessons[state.lesson].repeat[0],true,'repeat');}else status('영상이 끝났어요. 관찰한 한 가지를 떠올려 봐요.');});
video.addEventListener('error',()=>{if(video.error)showMediaError('file');});
$('throwTab').onclick=()=>selectLesson('throw');$('catchTab').onclick=()=>selectLesson('catch');
$('observed').onchange=()=>{state.observed[state.lesson]=$('observed').checked;save();};
$('repeatClip').onclick=()=>{repeat=!repeat;if(repeat)abTools.stop();$('repeatClip').setAttribute('aria-pressed',String(repeat));$('repeatClip').textContent=`동작 구간 반복: ${repeat?'켜짐':'꺼짐'}`;if(repeat){seekVideo(lessons[state.lesson].repeat[0],true,'repeat');showVideo();}else{if(seekAfterLoad?.origin==='repeat')seekAfterLoad=null;status('반복을 껐어요. 나머지 설명을 이어서 볼 수 있어요.');}};
$('reloadVideo').onclick=()=>selectLesson(state.lesson);
$('fullVideo').onclick=async()=>{try{if(video.requestFullscreen)await video.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else status('영상의 기본 전체화면 버튼을 사용하거나 가로 화면으로 봐 주세요.');}catch{status('영상의 기본 전체화면 버튼을 사용해 주세요.');}};

function stopAnimation(){if(animation){cancelAnimationFrame(animation.raf);animation=null;}$('exampleMotion').textContent='예시 움직임 보기 ▶';}
function drawPath(points,dashed=true){const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' '));path.setAttribute('fill','none');path.setAttribute('stroke','#ffd08b');path.setAttribute('stroke-width','4');if(dashed)path.setAttribute('stroke-dasharray','10 8');path.setAttribute('marker-end','url(#lessonArrow)');$('lessonPaths').append(path);}
function put(el,p){el.style.left=(p.x/8)+'%';el.style.top=(p.y/9)+'%';}
function renderCourt(previewPoint=null,previewBall=null){
 const m=currentMission(),w=currentWork(),p=previewPoint||w.point,initial=m.ours.find(x=>x.id===m.target),tokens=$('practiceTokens');tokens.replaceChildren();$('lessonPaths').replaceChildren();
 if($('beforeToggle').checked&&hasMoved(m,p)){const ghost=document.createElement('span');ghost.className='practice-token before';ghost.textContent=m.target;ghost.setAttribute('aria-hidden','true');put(ghost,initial);tokens.append(ghost);drawPath([initial,p]);}
 if(m.receiver){const a=m.ours.find(x=>x.id===m.ball),b=m.receiver===m.target?p:m.ours.find(x=>x.id===m.receiver);drawPath([a,b]);}
 for(const person of [...m.ours,...m.opponents]){
  const movable=person.id===m.target,opponent=m.opponents.includes(person),el=document.createElement(movable?'button':'span');el.className='practice-token'+(opponent?' opponent':'')+(movable?' movable':'');el.textContent=person.id;put(el,movable?p:person);el.setAttribute('aria-label',`${opponent?'상대':'우리'} ${person.id}번${movable?' · 이동할 선수':''}`);
  if(movable){el.type='button';el.id='movingPlayer';el.setAttribute('aria-describedby','boardInstruction');el.addEventListener('pointerdown',beginDrag);el.addEventListener('keydown',e=>{const d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(d){e.preventDefault();moveDirection(d);$('movingPlayer')?.focus({preventScroll:true});}});}
  tokens.append(el);
 }
 const carrier=[...m.ours,...m.opponents].find(x=>x.id===m.ball),at=previewBall||(carrier.id===m.target?p:carrier),ball=document.createElement('span');ball.className='practice-ball';ball.textContent='공';ball.setAttribute('aria-label','공을 가진 선수 '+m.ball+'번');put(ball,{x:at.x+32,y:at.y-25});tokens.append(ball);
}
function invalidate(){const w=currentWork();w.done=false;w.compared=false;$('completeMission').setAttribute('aria-pressed','false');$('completeMission').textContent='이유를 검토했어요 ✓';renderMissionTabs();}
function setPoint(p){if(!legalPoint(p)){$('missionFeedback').textContent='선택한 선수는 우리 내야 안에서 옮겨요. 경계에 붙지 않도록 안쪽에 공간을 남겨 두었어요.';return false;}stopAnimation();currentWork().point={x:p.x,y:p.y};invalidate();renderCourt();save();$('missionFeedback').textContent='위치를 바꿨어요. 바꾸기 전후 비교를 눌러 차이를 살펴봐요.';return true;}
function boardPoint(e){const r=$('practiceBoard').getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*800,y:(e.clientY-r.top)/r.height*900};}
function beginDrag(e){if(e.button!==0)return;stopAnimation();drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,old:{...currentWork().point},moved:false};e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.addEventListener('pointermove',duringDrag);e.currentTarget.addEventListener('pointerup',finishDrag,{once:true});e.currentTarget.addEventListener('pointercancel',cancelDrag,{once:true});}
function duringDrag(e){if(!drag||e.pointerId!==drag.id)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5)drag.moved=true;if(!drag.moved)return;const at=boardPoint(e),p=clampPoint(at.x,at.y);put(e.currentTarget,p);}
function finishDrag(e){if(!drag||e.pointerId!==drag.id)return;const was=drag;drag=null;e.currentTarget.removeEventListener('pointermove',duringDrag);e.currentTarget.removeEventListener('pointercancel',cancelDrag);if(was.moved){suppressBoardClick=performance.now()+400;const p=boardPoint(e);setPoint(clampPoint(p.x,p.y));}}
function cancelDrag(e){if(!drag||e.pointerId!==drag.id)return;drag=null;e.currentTarget.removeEventListener('pointermove',duringDrag);e.currentTarget.removeEventListener('pointerup',finishDrag);renderCourt();}
$('practiceBoard').addEventListener('click',e=>{if(performance.now()<suppressBoardClick||e.target.closest('button'))return;setPoint(boardPoint(e));});
function moveDirection(d){const p=currentWork().point,delta={up:[0,-28],down:[0,28],left:[-28,0],right:[28,0]}[d];if(delta)setPoint(clampPoint(p.x+delta[0],p.y+delta[1]));}
document.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>moveDirection(b.dataset.move));
function renderMissionTabs(){const count=missions.filter(m=>state.missions[m.id].done).length;$('missionCount').textContent=`${count} / ${missions.length}개 검토`;$('missionTabs').replaceChildren();for(const m of missions){const b=document.createElement('button');b.type='button';b.textContent=m.tab;b.classList.toggle('selected',m.id===state.mission);b.classList.toggle('done',state.missions[m.id].done);b.setAttribute('aria-pressed',String(m.id===state.mission));b.onclick=()=>selectMission(m.id);$('missionTabs').append(b);}}
function selectMission(id){stopAnimation();drag=null;state.mission=id;const m=currentMission(),w=currentWork();renderMissionTabs();$('courtTitle').textContent=m.title;$('missionPhase').textContent=m.phase;$('missionTitle').textContent=m.title;$('missionSituation').textContent=m.situation;$('missionTask').textContent=m.task;$('missionHint').textContent=m.hint;$('selectedPlayer').textContent=m.target+'번 움직이기';$('boardInstruction').textContent=`노란 테두리의 ${m.target}번만 움직여요. 나머지는 이번 비교에서 고정합니다.`;$('reason').value=w.reason;$('readySignalWrap').hidden=!m.receiver;$('readySignal').checked=w.ready;$('beforeToggle').checked=false;$('completeMission').setAttribute('aria-pressed',String(w.done));$('completeMission').textContent=w.done?'검토 표시 완료 ✓':'이유를 검토했어요 ✓';$('missionFeedback').textContent=w.compared?feedback(m,w):'먼저 위치를 바꿔 보고, 바꾼 이유를 생각해 봐요.';$('reasonIdeas').replaceChildren();for(const idea of m.ideas){const b=document.createElement('button');b.type='button';b.textContent=idea;b.onclick=()=>{w.reason=idea;$('reason').value=idea;save();};$('reasonIdeas').append(b);}renderCourt();save();}
$('beforeToggle').onchange=()=>renderCourt();
$('reason').addEventListener('input',()=>{currentWork().reason=$('reason').value.slice(0,180);save();});
$('readySignal').onchange=()=>{const w=currentWork();w.ready=$('readySignal').checked;w.done=false;renderMissionTabs();$('completeMission').setAttribute('aria-pressed','false');$('completeMission').textContent='이유를 검토했어요 ✓';if(w.compared)$('missionFeedback').textContent=feedback(currentMission(),w);save();};
$('compare').onclick=()=>{stopAnimation();const m=currentMission(),w=currentWork();w.compared=hasMoved(m,w.point);$('beforeToggle').checked=true;renderCourt();$('missionFeedback').textContent=feedback(m,w);save();};
$('completeMission').onclick=()=>{const m=currentMission(),w=currentWork();if(!w.compared){$('missionFeedback').textContent='먼저 위치를 바꾸고 ‘바꾸기 전후 비교’를 눌러요. 이유는 글로 쓰거나 짝에게 말해도 좋아요.';return;}if(m.receiver&&!w.ready){$('missionFeedback').textContent='받는 친구의 준비 신호를 확인한 뒤 검토를 마쳐요.';return;}w.done=!w.done;$('completeMission').setAttribute('aria-pressed',String(w.done));$('completeMission').textContent=w.done?'검토 표시 완료 ✓':'이유를 검토했어요 ✓';renderMissionTabs();save();};
$('resetMission').onclick=()=>{state.missions[state.mission]=freshProgress().missions[state.mission];selectMission(state.mission);$('missionFeedback').textContent='이 미션의 배치·메모·검토 표시만 처음으로 되돌렸어요. 다른 미션과 자유 전술판은 유지됩니다.';};
$('exampleMotion').onclick=()=>{
 if(animation){stopAnimation();renderCourt();$('missionFeedback').textContent='예시 재생을 멈췄어요. 내가 만든 배치는 유지돼요.';return;}
 const m=currentMission(),w=currentWork();if(m.receiver&&!w.ready){$('missionFeedback').textContent='예시 패스 전에도 받는 친구의 준비 신호를 먼저 확인해요.';return;}
 const from=m.ours.find(p=>p.id===m.target),to=m.example,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,duration=reduce?1:1600,start=performance.now();
 animation={raf:null};$('exampleMotion').textContent='예시 움직임 멈춤 ■';$('missionFeedback').textContent='가능한 한 예시입니다. 정답 배치나 실전 성공을 뜻하지 않아요. 내 배치는 바꾸지 않고 위치 이동만 보여 줍니다.';
 function frame(now){if(!animation)return;const t=Math.min(1,(now-start)/duration),eased=t*t*(3-2*t),p={x:from.x+(to.x-from.x)*eased,y:from.y+(to.y-from.y)*eased};renderCourt(p);drawPath([from,p]);if(t<1)animation.raf=requestAnimationFrame(frame);else{animation=null;$('exampleMotion').textContent='예시 움직임 보기 ▶';$('missionFeedback').textContent='예시의 마지막 위치예요. 내 배치는 유지되어 있어요. 코트나 방향 버튼을 누르면 내 배치로 돌아와 연습을 계속합니다.';}}
 animation.raf=requestAnimationFrame(frame);
};
document.addEventListener('visibilitychange',()=>{if(document.hidden){video.pause();stopAnimation();drag=null;renderCourt();}});
selectLesson(state.lesson);selectMission(state.mission);

})();