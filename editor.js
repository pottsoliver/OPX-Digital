(() => {
  'use strict';
  const CONFIG_KEY = 'ownStudioSiteContent';
  const $ = id => document.getElementById(id);
  let starter = null;
  let current = null;
  let toastTimer;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }
  function setStatus(message, error = false) {
    $('status').textContent = message;
    $('status').style.background = error ? '#f5dfd9' : '#dce8df';
    $('status').style.color = error ? '#8e3929' : '#315c43';
  }
  async function readConfig() {
    const response = await fetch('site-content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load site-content.json. Start the local server using start.bat.');
    return response.json();
  }
  function val(path, value) {
    const parts = path.split('.');
    let ref = current;
    for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
    ref[parts.at(-1)] = value;
  }
  function get(path) { return path.split('.').reduce((ref, key) => ref?.[key], current); }
  function populateQuick() {
    const fields = {
      'brand-name':'brand.name', 'brand-descriptor':'brand.descriptor', 'brand-email':'brand.email', 'brand-availability':'brand.availability',
      'home-headline':'home.headline', 'home-intro':'home.intro', 'about-headline':'about.headline', 'about-note':'about.note',
      'work-intro':'work.intro', 'contact-headline':'contact.headline', 'contact-intro':'contact.intro'
    };
    Object.entries(fields).forEach(([id,path]) => $(id).value = get(path) || '');
    $('about-paragraphs').value = (get('about.paragraphs') || []).join('\n\n');
    $('about-tags').value = (get('about.tags') || []).join(', ');
    $('projects-json').value = JSON.stringify(get('work.projects') || [], null, 2);
    $('socials-json').value = JSON.stringify(get('contact.socials') || [], null, 2);
    ['accent','home','about','work','contact'].forEach(key => $(`theme-${key}`).value = get(`theme.${key}`) || '#888888');
  }
  function syncQuick() {
    const fields = {
      'brand-name':'brand.name', 'brand-descriptor':'brand.descriptor', 'brand-email':'brand.email', 'brand-availability':'brand.availability',
      'home-headline':'home.headline', 'home-intro':'home.intro', 'about-headline':'about.headline', 'about-note':'about.note',
      'work-intro':'work.intro', 'contact-headline':'contact.headline', 'contact-intro':'contact.intro'
    };
    Object.entries(fields).forEach(([id,path]) => val(path, $(id).value));
    val('about.paragraphs', $('about-paragraphs').value.split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean));
    val('about.tags', $('about-tags').value.split(',').map(s => s.trim()).filter(Boolean));
    val('work.projects', JSON.parse($('projects-json').value));
    val('contact.socials', JSON.parse($('socials-json').value));
    ['accent','home','about','work','contact'].forEach(key => val(`theme.${key}`, $(`theme-${key}`).value));
  }
  function updateJson() { $('full-json').value = JSON.stringify(current, null, 2); }
  function validateConfig(data) {
    if (!data || typeof data !== 'object' || !data.brand || !data.home || !data.about || !data.work || !data.contact || !data.theme) {
      throw new Error('The config is missing one or more required sections: brand, home, about, work, contact or theme.');
    }
    if (!Array.isArray(data.work.projects) || !Array.isArray(data.contact.socials)) throw new Error('Projects and social links must be JSON arrays.');
    return data;
  }
  function applyJson() {
    try {
      current = validateConfig(JSON.parse($('full-json').value));
      populateQuick();
      setStatus('CONFIG VALID');
      showToast('Configuration applied. Save a preview or download the config file.');
      return true;
    } catch (error) {
      setStatus('CHECK JSON', true);
      showToast(error.message);
      return false;
    }
  }
  function downloadConfig() {
    try {
      const json = JSON.stringify(current, null, 2) + '\n';
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'site-content.json';
      document.body.append(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Downloaded site-content.json. Replace the existing file in your website folder.');
    } catch (error) {
      showToast(`Could not download config: ${error.message}`);
    }
  }
  function switchTab(which) {
    const quick = which === 'quick';
    $('quick-panel').hidden = !quick;
    $('json-panel').hidden = quick;
    $('quick-tab').classList.toggle('is-selected', quick);
    $('json-tab').classList.toggle('is-selected', !quick);
    $('quick-tab').setAttribute('aria-selected', String(quick));
    $('json-tab').setAttribute('aria-selected', String(!quick));
  }

  async function init() {
    try {
      starter = await readConfig();
      current = clone(starter);
      try {
        const saved = localStorage.getItem(CONFIG_KEY);
        if (saved) current = validateConfig(JSON.parse(saved));
      } catch { /* Ignore an old or invalid browser draft. */ }
      populateQuick();
      updateJson();
      setStatus('READY');
    } catch (error) {
      setStatus('LOAD ERROR', true);
      showToast(error.message);
      return;
    }

    $('quick-tab').addEventListener('click', () => switchTab('quick'));
    $('json-tab').addEventListener('click', () => switchTab('json'));
    $('apply-quick').addEventListener('click', () => {
      try {
        syncQuick(); updateJson(); setStatus('CHANGES APPLIED'); showToast('Quick changes applied. Save a preview or download the config.');
      } catch (error) {
        setStatus('CHECK YOUR FIELDS', true); showToast(`Please check the JSON fields: ${error.message}`);
      }
    });
    $('apply-json').addEventListener('click', applyJson);
    $('format-json').addEventListener('click', () => {
      try { $('full-json').value = JSON.stringify(JSON.parse($('full-json').value), null, 2); showToast('JSON formatted.'); }
      catch (error) { showToast(`JSON error: ${error.message}`); }
    });
    $('reload-quick').addEventListener('click', () => { populateQuick(); updateJson(); showToast('Quick editor reloaded from the current configuration.'); });
    $('download-config').addEventListener('click', () => { if (!$('json-panel').hidden) { if (!applyJson()) return; } else { try { syncQuick(); updateJson(); } catch (error) { showToast(`Please correct the JSON fields: ${error.message}`); return; } } downloadConfig(); });
    $('save-preview').addEventListener('click', () => {
      if (!$('json-panel').hidden) { if (!applyJson()) return; }
      else {
        try { syncQuick(); updateJson(); }
        catch (error) { showToast(`Please correct the JSON fields: ${error.message}`); return; }
      }
      try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(current));
        setStatus('PREVIEW SAVED');
        showToast('Preview saved in this browser. Open the website in another tab to see your changes.');
      } catch (error) { showToast(`Could not save preview: ${error.message}`); }
    });
    $('reset-config').addEventListener('click', () => {
      if (!window.confirm('Reset the editor to the original starter content? This also removes the saved browser preview.')) return;
      current = clone(starter);
      localStorage.removeItem(CONFIG_KEY);
      populateQuick(); updateJson(); setStatus('RESET'); showToast('Starter content restored.');
    });
    $('import-config').addEventListener('change', async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const parsed = validateConfig(JSON.parse(await file.text()));
        current = parsed; populateQuick(); updateJson(); setStatus('IMPORTED'); showToast(`Imported ${file.name}.`);
      } catch (error) { showToast(`Could not import file: ${error.message}`); }
      event.target.value = '';
    });
  }
  init();
})();
