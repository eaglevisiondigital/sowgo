(() => {
  'use strict';
  const menuButton=document.querySelector('.menu-toggle');
  const navigation=document.getElementById('primary-navigation');
  function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');navigation.classList.remove('is-open');}
  menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));menuButton.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');navigation.classList.toggle('is-open',!expanded);});
  navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('is-open')){closeMenu();menuButton.focus();}});
  window.matchMedia('(min-width: 1024px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  document.getElementById('year').textContent=new Date().getFullYear();
  // The event reference is display-only. Never change the hosted payment URL,
  // select a fund, or pass donor details based on query-string values.
  const reference=new URLSearchParams(location.search).get('outreach');
  const event=window.SOWGO_CONFIG?.events?.find(item=>item.id===reference);
  if(event){document.getElementById('outreach-context-title').textContent='Outreach reference: '+event.title;document.getElementById('outreach-context').hidden=false;}
})();
