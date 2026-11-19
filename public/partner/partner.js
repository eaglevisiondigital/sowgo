// Use the shared approved form; this fixed page always selects SowGo presentation.
(() => {
 'use strict';
 const root=document.getElementById('sowgo-partner-root');
 if(!root||!window.OutreachPartner)return;
 window.OutreachPartner.mount(root,'sowgo');
 root.querySelector('[role="dialog"]').removeAttribute('role');
 root.querySelector('[aria-modal]').removeAttribute('aria-modal');
})();
