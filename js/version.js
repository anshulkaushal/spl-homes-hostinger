// Set version badge text from version.json
(function(){
  function setVersion(text){
    var els = document.getElementsByClassName('version-badge');
    for (var i=0; i<els.length; i++) {
      els[i].textContent = text.startsWith('v') ? text : ('v' + text);
    }
  }

  try {
    fetch('version.json', { cache: 'no-cache' })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(data){ if (data && data.version) setVersion(data.version); })
      .catch(function(){ /* ignore */ });
  } catch(_) { /* ignore */ }
})();


