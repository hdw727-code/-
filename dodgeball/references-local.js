(()=>{
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
const {bindRates,bindAB}=VideoTools;
const sources=[
 {title:'원본 1 · 던지기와 포구',file:'reference-01.mp4',note:'현재 던지기 v13·잡기 v14 설명 영상의 출처입니다. 실제 포구와 이미 공을 든 팔굽힘 시범을 구분해 봅니다.',limit:'3.1초 부근 실제 포구는 뒤쪽 시점과 흐림 때문에 최초 손가락 접촉을 확인하기 어렵습니다. 무릎을 낮추거나 뛰는 자세를 초보 기본으로 따라 하지 않습니다.',anchors:[[3.1,'실제 포구 부근'],[17.2,'이미 공을 든 팔굽힘 시범'],[43.8,'던지기 시범 부근']]},
 {title:'원본 2 · 회피와 경기 참고',file:'reference-02.mp4',note:'회피·점프·다이빙과 경기 장면이 섞인 교사용 참고 영상입니다. 기본 던지기·서서 받기의 정답 시범으로 편성하지 않았습니다.',limit:'모든 장면의 세부 기술을 분석한 자료가 아닙니다. 위험한 동작을 학생의 따라 하기 과제로 사용하지 않습니다.',anchors:[]},
 {title:'원본 3 · 던지기 설명과 오류 예시',file:'reference-03.mp4',note:'정상 설명과 오류 예시가 섞여 있습니다. 전신 시범과 공을 일찍 놓는 오류 설명을 맥락과 함께 봅니다.',limit:'높은 다리 들기는 초보 기본 자세가 아닙니다. 흐린 릴리스 순간의 손가락·관절각, 미러 여부는 확정하지 않습니다. 불안정한 그립 예시를 정답으로 사용하지 않습니다.',anchors:[[32.8,'전신 시범 앞부분'],[40,'일찍 놓는 오류 설명 부근']]},
 {title:'원본 4 · 다이빙 포구 참고',file:'reference-04.mp4',note:'다이빙·낮은 포구 시범과 경기 장면을 담은 교사용 참고 영상입니다. 서서 받기 기본 학습과 구분합니다.',limit:'초보자가 바닥에 뛰어들거나 얼굴로 공을 당기는 연습을 권하지 않습니다. 각 장면 전체의 세부 분석은 완료되지 않았습니다.',anchors:[]}
];
const video=document.querySelector('#referenceVideo'),heading=document.querySelector('#referenceHeading'),note=document.querySelector('#referenceNote'),limit=document.querySelector('#referenceLimit'),statusNode=document.querySelector('#referenceStatus'),anchors=document.querySelector('#referenceAnchors');
const status=t=>statusNode.textContent=t, rates=bindRates(video,document,status),ab=bindAB(video,document,{status});
let selected=0;
function seek(t){if(!Number.isFinite(video.duration))return;video.pause();video.currentTime=Math.max(0,Math.min(t,video.duration));status('시간을 이동했습니다. 재생 버튼으로 확인하세요. 정확한 프레임 이동은 아닙니다.');}
function select(index){video.pause();ab.reset();selected=index;const item=sources[index];heading.textContent=item.title;note.textContent=item.note;limit.textContent=item.limit;document.querySelectorAll('[data-source]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.source)===index)));anchors.replaceChildren();item.anchors.forEach(([time,label])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>seek(time);anchors.append(b);});video.src='reference-media/'+item.file;document.querySelector('#referenceDirect').href=video.src;video.load();rates.set(1);status('영상을 준비하고 있습니다.');}
document.querySelectorAll('[data-source]').forEach(b=>b.onclick=()=>select(Number(b.dataset.source)));
document.querySelectorAll('[data-seek]').forEach(b=>b.onclick=()=>seek(video.currentTime+Number(b.dataset.seek)));
document.querySelector('#startVideo').onclick=()=>seek(0);
document.querySelector('#retryVideo').onclick=()=>select(selected);
video.addEventListener('loadeddata',()=>status('준비됐습니다. 원본 음성은 기본 음소거이며 필요할 때 켤 수 있습니다.'));
video.addEventListener('error',()=>status('영상을 열지 못했습니다. 인터넷 연결을 확인한 뒤 다시 불러오기를 누르거나 아래 영상 파일로 열기를 이용하세요.'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
window.addEventListener('pagehide',()=>video.pause());
select(0);

})();