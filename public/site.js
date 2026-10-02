(() => {
  'use strict';
  const config = window.SOWGO_CONFIG;
  if (!config || !Array.isArray(config.events)) return;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow = '<svg aria-hidden="true"><use href="assets/icons.svg#arrow"/></svg>';
  const today = new Intl.DateTimeFormat('en-CA', { timeZone:'America/Chicago', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
  const isPast = event => Boolean(event.end && event.end < today);
  const allowedSignup = value => {try {const u=new URL(value);return u.protocol==='https:' && u.hostname==='form.jotform.com';}catch{return false;}};
  function signupAction(event) {
    if (isPast(event) || event.status === 'closed') return '<span class="button signup-unavailable">Registration Closed</span>';
    if (event.status === 'open' && allowedSignup(event.signup)) return `<a class="button button-primary" href="${escapeHTML(event.signup)}" target="_blank" rel="noopener noreferrer">Team Sign Up ${arrow}</a>`;
    return '<span class="button signup-unavailable">Registration Details Soon</span>';
  }
  function renderCard(event) {
    return `<article class="event-card" data-event-id="${escapeHTML(event.id)}"><div class="event-image-wrap"><img class="event-image" src="assets/images/${escapeHTML(event.image)}.webp" alt="Illustrative design image; not a photograph documenting this event" loading="lazy" width="280" height="146"></div><div class="event-body"><span class="event-date">${escapeHTML(event.label)}</span><div class="event-heading"><h3>${escapeHTML(event.title)}</h3>${event.subtitle ? `<p class="event-subtitle">${escapeHTML(event.subtitle)}</p>`:''}</div><p class="event-location"><svg aria-hidden="true"><use href="assets/icons.svg#pin"/></svg>${escapeHTML(event.location)}</p><div class="event-funding"><div class="funding-track" role="img" aria-label="Zeroed design placeholder. Live funding totals are not connected."><span></span></div><p class="funding-label">0% · design preview<small>$0 shown · live totals pending</small></p></div><div class="event-actions">${signupAction(event)}<button type="button" class="button button-outline" data-sow-event="${escapeHTML(event.id)}">Sow to This Outreach</button></div><button class="event-detail-link" type="button" data-event-details="${escapeHTML(event.id)}">${isPast(event)?'Past outreach details':'Event details & location'}</button></div></article>`;
  }
  const track = document.getElementById('event-track');
  track.innerHTML = config.events.map(renderCard).join('');
  const previous = document.querySelector('.carousel-arrow.previous');
  const next = document.querySelector('.carousel-arrow.next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateArrows = () => { previous.disabled = track.scrollLeft < 3; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 3; };
  function move(direction){const first=track.querySelector('.event-card');const step=first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);track.scrollBy({left:direction*step,behavior:reducedMotion?'auto':'smooth'});}
  previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',updateArrows,{passive:true});window.addEventListener('resize',updateArrows);updateArrows();
  track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}});
  const menuButton=document.querySelector('.menu-toggle'),navigation=document.getElementById('primary-navigation');
  function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');navigation.classList.remove('is-open');}
  menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));menuButton.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');navigation.classList.toggle('is-open',!expanded);});
  navigation.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && navigation.classList.contains('is-open')){closeMenu();menuButton.focus();}});
  window.matchMedia('(min-width: 1024px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  const scheduleDialog=document.getElementById('schedule-dialog'),sowDialog=document.getElementById('sow-dialog');
  const search=document.getElementById('event-search'),filter=document.getElementById('event-filter'),results=document.getElementById('schedule-results');
  let focusedEvent = null;
  function openDialog(dialog){document.querySelectorAll('dialog[open]').forEach(d=>d.close());dialog.showModal();document.body.classList.add('modal-open');}
  function renderSchedule(){const query=search.value.trim().toLowerCase();const chosen=config.events.filter(event=>{const matches=`${event.title} ${event.location} ${event.label}`.toLowerCase().includes(query);return matches&&(filter.value==='all'||(filter.value==='past'&&isPast(event))||(filter.value==='upcoming'&&!isPast(event))||(filter.value==='international'&&event.category==='International'));});
    results.innerHTML=chosen.length?chosen.map(event=>`<article class="schedule-row ${focusedEvent===event.id?'event-focus':''}" id="schedule-${escapeHTML(event.id)}"><div><p class="date">${escapeHTML(event.label)}${isPast(event)?' · PAST OUTREACH':''}</p><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.location)}</p><p>Exact venue/address: check the current event form or contact the ministry.</p></div><div class="row-actions">${signupAction(event)}<button class="button button-outline" type="button" data-sow-event="${escapeHTML(event.id)}">Sow to This Outreach</button></div></article>`).join(''):'<p class="schedule-empty">No outreaches match your search. Try another city or country.</p>';
  }
  function openSchedule(id=null){focusedEvent=id;filter.value='all';search.value='';renderSchedule();openDialog(scheduleDialog);if(id){requestAnimationFrame(()=>document.getElementById('schedule-'+id)?.scrollIntoView({block:'center',behavior:'instant'}));}else{scheduleDialog.scrollTop=0;}}
  function openSow(id=null){const event=config.events.find(e=>e.id===id);document.getElementById('sow-title').textContent=event?'Sow into '+event.title:'Sow into the Mission';document.getElementById('sow-description').textContent=event?'Thank you for wanting to support the '+event.title+' outreach.':'Your generosity helps carry the Gospel of the Kingdom to communities near and far.';openDialog(sowDialog);}
  document.addEventListener('click',event=>{const target=event.target.closest('[data-open-schedule],[data-event-details],[data-sow],[data-sow-event],[data-close-dialog]');if(!target)return;event.preventDefault();if(target.hasAttribute('data-open-schedule'))openSchedule();else if(target.hasAttribute('data-event-details'))openSchedule(target.dataset.eventDetails);else if(target.hasAttribute('data-sow-event'))openSow(target.dataset.sowEvent);else if(target.hasAttribute('data-sow'))openSow();else target.closest('dialog').close();});
  search.addEventListener('input',()=>{focusedEvent=null;renderSchedule();});filter.addEventListener('change',()=>{focusedEvent=null;renderSchedule();});
  document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});});
  document.getElementById('year').textContent=new Date().getFullYear();
})();
