'use strict';
window.PebForm = (() => {
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    function mount(root, draft) {
        let selected = 0;
        const sections = window.PebSchema.sections;
        root.innerHTML = `<div class="page-heading"><div><a class="text-link" href="#peb">Kembali ke daftar PEB</a><h1 class="form-title">Form PEB</h1></div></div><p class="form-notice">Isian belum tersimpan. Pengambilan sumber dan penyimpanan menunggu koneksi layanan.</p><div role="tablist" aria-label="Bagian PEB" class="document-tabs"></div><form id="peb-entry"><section class="panel form-panel" role="tabpanel" id="form-section" tabindex="0"></section><div class="entry-actions"><button type="button" class="button" data-prev>Sebelumnya</button><span id="form-step"></span><button type="button" class="button primary" data-next>Selanjutnya</button><button class="button primary" data-check hidden>Periksa isian</button></div><p class="form-feedback" role="status" id="form-feedback"></p></form>`;
        const input = (field, value, row = '') => `<label>${escape(field.label)}<input type="${field.type}" data-field="${field.key}" ${row === '' ? '' : `data-row="${row}"`} value="${escape(value)}" ${field.type === 'number' ? 'min="0" step="any"' : 'maxlength="500"'}></label>`;
        function paint() {
            const section = sections[selected];
            root.querySelector('[role=tablist]').innerHTML = sections.map((item, i) => `<button type="button" role="tab" id="entry-tab-${i}" aria-controls="form-section" aria-selected="${i === selected}" tabindex="${i === selected ? 0 : -1}" data-tab="${i}">${item.title}</button>`).join('');
            const panel = root.querySelector('#form-section');
            panel.setAttribute('aria-labelledby', `entry-tab-${selected}`);
            panel.innerHTML = `<div class="panel-heading"><h2>${section.title}</h2>${section.columns ? '<button type="button" class="button" data-add>Tambah baris</button>' : ''}</div><div class="entry-fields">${section.fields ? `<div class="entry-grid">${section.fields.map(field => input(field, draft.values[field.key])).join('')}</div>` : draft[section.key].length ? draft[section.key].map((row, i) => `<section class="entry-row"><div class="row-heading"><h3>Baris ${i + 1}</h3><button type="button" class="button" data-remove="${i}">Hapus baris ${i + 1}</button></div><div class="entry-grid">${section.columns.map(field => input(field, row[field.key], i)).join('')}</div></section>`).join('') : '<div class="empty-state"><h3>Belum ada data</h3><p>Tambahkan baris untuk mengisi bagian ini.</p></div>'}</div>`;
            root.querySelector('[data-prev]').disabled = selected === 0;
            root.querySelector('[data-next]').hidden = selected === sections.length - 1;
            root.querySelector('[data-check]').hidden = selected !== sections.length - 1;
            root.querySelector('#form-step').textContent = `${selected + 1} / ${sections.length}`;
        }
        root.addEventListener('input', event => {
            const key = event.target.dataset.field;
            if (!key) return;
            if (event.target.dataset.row !== undefined) draft[sections[selected].key][Number(event.target.dataset.row)][key] = event.target.value;
            else draft.values[key] = event.target.value;
            root.querySelector('#form-feedback').textContent = '';
        });
        root.addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!button) return;
            if (button.dataset.tab !== undefined) { selected = Number(button.dataset.tab); paint(); root.querySelector(`[data-tab="${selected}"]`).focus(); }
            if (button.hasAttribute('data-prev') || button.hasAttribute('data-next')) { selected += button.hasAttribute('data-next') ? 1 : -1; paint(); root.querySelector('#form-section').focus(); }
            if (button.hasAttribute('data-add')) { draft[sections[selected].key].push({}); paint(); }
            if (button.dataset.remove !== undefined) { draft[sections[selected].key].splice(Number(button.dataset.remove), 1); paint(); }
        });
        root.addEventListener('keydown', event => {
            if (!event.target.matches('[role=tab]') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            selected = event.key === 'Home' ? 0 : event.key === 'End' ? sections.length - 1 : (selected + (event.key === 'ArrowRight' ? 1 : -1) + sections.length) % sections.length;
            paint(); root.querySelector(`[data-tab="${selected}"]`).focus();
        });
        root.querySelector('form').addEventListener('submit', event => {
            event.preventDefault();
            const filled = Object.values(draft.values).some(value => String(value).trim()) || ['documents', 'containers', 'goods'].some(key => draft[key].some(row => Object.values(row).some(value => String(value).trim())));
            const invalid = sections.some(section => (section.fields || section.columns).some(field => field.type === 'number' && (section.fields ? [draft.values] : draft[section.key]).some(row => row[field.key] !== undefined && row[field.key] !== '' && (!Number.isFinite(Number(row[field.key])) || Number(row[field.key]) < 0))));
            root.querySelector('#form-feedback').textContent = !filled ? 'Form masih kosong.' : invalid ? 'Periksa kolom angka. Gunakan angka nol atau lebih.' : 'Pemeriksaan format selesai. Isian belum disimpan; validasi kelengkapan dan penyimpanan memerlukan layanan backend.';
        });
        paint();
    }
    return { mount };
})();
