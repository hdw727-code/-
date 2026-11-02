(() => {
  'use strict';
  // Public-ready build: fixed practice labels, never import a personal roster.
  // Legacy teacher data remains untouched in its original browser storage.
  window.WINGS_ROSTER=Array.from({length:18},(_,i)=>({id:'p'+(i+1),name:'선수'+String(i+1).padStart(2,'0'),number:i+1,pending:false}));
  if(new URLSearchParams(location.hash.slice(1)).has('team')){
    history.replaceState(null,'',location.pathname+location.search);
  }
})();
