'use strict';

(() => {
    const pages = {
        dashboard: { title: 'Dashboard' },
        invoice: { title: 'Invoice', columns: ['Nomor invoice', 'Tanggal', 'Penerima', 'Valuta', 'Nilai', 'Detail'] },
        packing: { title: 'Packing List', columns: ['Nomor packing list', 'Invoice', 'Kemasan', 'Bruto', 'Netto', 'Detail'] },
        shipping: { title: 'Shipping Instruction Data', columns: ['Nomor SI', 'Invoice', 'Sarana angkut', 'Tujuan', 'Tanggal', 'Detail'] },
        peb: { title: 'PEB', columns: ['Nomor aju', 'Invoice', 'Penerima', 'Tanggal', 'Status', 'Detail'] },
        history: { title: 'Log History', columns: ['Waktu', 'Dokumen', 'Pengguna', 'Aktivitas', 'Hasil'] },
        master: { title: 'Master Data PEB', columns: ['Jenis', 'Kode', 'Nama', 'Status', 'Detail'] }
    };
    const sourcePages = ['invoice', 'packing', 'shipping'];
    const content = document.querySelector('#content');
    const sidebar = document.querySelector('#sidebar');
    const menuToggle = document.querySelector('#menu-toggle');
    const dialog = document.querySelector('#detail-dialog');
    const dateLabel = document.querySelector('#today');
    let sourceExpanded = false;
    let page = 'dashboard';
    let invoiceNumber = '';
    const paths = {
        dashboard: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>',
        source: '<path d="M3 7V4h6l3 3h9v13H3zM3 11h18"/>',
        peb: '<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h5"/>',
        history: '<path d="M3 11a9 9 0 1 1 2 7M3 5v6h6M12 7v5l3 2"/>',
        master: '<path d="M4 4h16v16H4zM4 10h16M10 4v16"/>'
    };
    const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${paths[name]}</svg>`;
    function navigation() {
        const link = key => `<a href="#${key}" ${page === key ? 'aria-current="page"' : ''}>${icon(key)}<span>${pages[key].title}</span></a>`;
        document.querySelector('#navigation').innerHTML = `${link('dashboard')}<button id="source-toggle" aria-controls="source-submenu" aria-expanded="${sourceExpanded}">${icon('source')}<span>Source Data ERP</span><svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></button><div id="source-submenu" class="${sourceExpanded ? 'expanded' : ''}" ${sourceExpanded ? '' : 'inert'}><div class="submenu-clip"><div class="submenu-links">${sourcePages.map(key => `<a href="#${key}" ${page === key ? 'aria-current="page"' : ''}>${pages[key].title}</a>`).join('')}</div></div></div>${link('peb')}${link('history')}<div class="nav-divider"></div>${link('master')}`;
    }
    function empty(title, hint) {
        return `<div class="empty-state"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M13 6h15l8 8v27H13zM28 6v9h8M19 23h11M19 29h8"/></svg><h3>${title}</h3><p>${hint}</p></div>`;
    }
    function table(columns, title, hint) {
        return `<div class="table-wrap" tabindex="0" aria-label="Tabel ${page === 'dashboard' ? 'dokumen terbaru' : pages[page].title}"><table><thead><tr>${columns.map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody></tbody></table></div>${empty(title, hint)}`;
    }
    function render() {
        const hash = location.hash.slice(1).split('/')[0];
        const requested = ['pdke', 'loading'].includes(hash) ? 'shipping' : hash;
        if (requested !== hash) history.replaceState(null, '', '#shipping');
        page = Object.hasOwn(pages, requested) ? requested : 'dashboard';
        document.title = `${pages[page].title} · Fast-PEB`;
        if (dialog.open) dialog.close();
        navigation();
        sidebar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (page === 'master') {
            content.replaceChildren();
            const host = document.createElement('div');
            content.append(host);
            window.PebAdmin.mount(host, 'master');
            placeDate();
            return;
        }
        content.innerHTML = `<div class="page-heading"><h1>${pages[page].title}</h1>${page === 'peb' ? '<button class="button primary" id="create-peb">Buat PEB</button>' : ''}</div>`;
        placeDate();
        if (page === 'dashboard') {
            content.insertAdjacentHTML('beforeend', `<section class="overview" aria-label="Ringkasan dokumen"><div><span>Total dokumen</span><strong>0</strong></div><div><span>Draft</span><strong>0</strong></div><div><span>Terkirim</span><strong>0</strong></div><div><span>Respons tersedia</span><strong>0</strong></div></section><section class="panel"><div class="panel-heading"><h2>Dokumen terbaru</h2><a class="text-link" href="#peb">Lihat semua dokumen</a></div>${table(pages.peb.columns, 'Belum ada dokumen PEB', 'Dokumen akan tampil di sini setelah tersedia.')}</section><section class="activity"><div><h2>Aktivitas terakhir</h2><p>Belum ada aktivitas tercatat.</p></div><a class="text-link" href="#history">Lihat riwayat</a></section>`);
        } else {
            const isHistory = page === 'history';
            content.insertAdjacentHTML('beforeend', `<section class="panel"><div class="panel-heading"><h2>${isHistory ? 'Riwayat aktivitas' : 'Daftar ' + pages[page].title}</h2><span class="record-count">0 ${isHistory ? 'aktivitas' : 'data'}</span></div><form class="table-tools" role="search"><label>Cari ${isHistory ? 'aktivitas' : 'data'}<input type="search" id="list-search" placeholder="${page === 'peb' ? 'Nomor aju atau invoice' : 'Ketik kata pencarian'}"></label>${['peb', 'master'].includes(page) ? `<label>Status<select id="list-status"><option value="">Semua status</option>${(page === 'peb' ? ['Draft', 'Direview', 'Terkirim', 'Respons tersedia'] : ['Aktif', 'Nonaktif']).map(value => `<option>${value}</option>`).join('')}</select></label>` : ''}${page !== 'master' ? '<label>Tanggal<input type="date" id="list-date"></label>' : ''}<button type="reset" class="button subtle">Reset filter</button></form>${table(pages[page].columns, isHistory ? 'Belum ada aktivitas' : 'Belum ada data', page === 'master' ? 'Referensi master data belum tersedia.' : 'Data akan tampil di sini setelah tersedia.')}<div class="table-footer" role="status">Menampilkan 0 data</div></section>`);
            const filters = content.querySelector('.table-tools');
            const update = () => {
                const filtered = [...filters.querySelectorAll('input, select')].some(node => node.value);
                content.querySelector('.empty-state h3').textContent = filtered ? 'Tidak ada hasil' : isHistory ? 'Belum ada aktivitas' : 'Belum ada data';
                content.querySelector('.empty-state p').textContent = filtered ? 'Coba kata pencarian atau filter lain.' : page === 'master' ? 'Referensi master data belum tersedia.' : 'Data akan tampil di sini setelah tersedia.';
            };
            filters.addEventListener('submit', event => event.preventDefault());
            filters.addEventListener('input', update);
            filters.addEventListener('change', update);
            filters.addEventListener('reset', () => setTimeout(update, 0));
        }
        sidebar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (page === 'peb' && location.hash.split('/')[1] === 'new') {
            history.replaceState(null, '', '#peb');
            openInvoiceDialog();
        }
    }
    function placeDate() {
        const heading = content.querySelector('.page-heading');
        const actions = document.createElement('div');
        actions.className = 'heading-actions';
        actions.append(dateLabel);
        const createButton = heading.querySelector('#create-peb');
        if (createButton) actions.append(createButton);
        heading.append(actions);
    }
    function mountInvoiceStep(host) {
        host.innerHTML = `<form id="invoice-lookup"><label for="peb-invoice-number">Nomor invoice</label><input id="peb-invoice-number" name="invoiceNumber" type="text" required maxlength="100" aria-describedby="invoice-help" autocomplete="off"><p class="form-notice" id="invoice-help">Masukkan nomor invoice untuk mengambil Invoice, Packing List, dan Shipping Instruction terkait.</p><div class="form-actions"><button class="button primary" type="submit">Cari invoice</button><button class="button" type="button" id="cancel-invoice">Batal</button></div><p class="form-feedback" role="status" id="invoice-feedback"></p></form>`;
        host.querySelector('#cancel-invoice').addEventListener('click', () => dialog.close());
        const input = host.querySelector('#peb-invoice-number');
        const feedback = host.querySelector('#invoice-feedback');
        input.value = invoiceNumber;
        input.addEventListener('input', () => {
            invoiceNumber = input.value;
            input.setCustomValidity('');
            feedback.textContent = '';
        });
        host.querySelector('form').addEventListener('submit', event => {
            event.preventDefault();
            invoiceNumber = input.value.trim();
            input.value = invoiceNumber;
            if (!invoiceNumber) {
                input.setCustomValidity('Masukkan nomor invoice.');
                input.reportValidity();
                return;
            }
            feedback.textContent = 'Pencarian invoice belum tersedia karena layanan data belum terhubung. Nomor invoice belum diverifikasi dan dokumen PEB belum dibuat.';
        });
    }
    function openInvoiceDialog() {
        document.querySelector('#detail-title').textContent = 'Buat PEB';
        mountInvoiceStep(document.querySelector('#detail-body'));
        dialog.showModal();
        dialog.querySelector('#peb-invoice-number').focus();
    }
    document.addEventListener('click', event => {
        if (event.target.closest('.skip')) { event.preventDefault(); content.focus(); return; }
        if (event.target.closest('#source-toggle')) {
            sourceExpanded = !sourceExpanded;
            document.querySelector('#source-toggle').setAttribute('aria-expanded', String(sourceExpanded));
            const submenu = document.querySelector('#source-submenu');
            submenu.classList.toggle('expanded', sourceExpanded);
            submenu.inert = !sourceExpanded;
        }
        if (event.target.closest('#create-peb')) {
            openInvoiceDialog();
        }
    });
    menuToggle.addEventListener('click', () => menuToggle.setAttribute('aria-expanded', String(sidebar.classList.toggle('open'))));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && sidebar.classList.contains('open')) { sidebar.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.focus(); } });
    const today = new Date();
    document.querySelector('#today').dateTime = today.toLocaleDateString('sv-SE');
    document.querySelector('#today').textContent = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    window.addEventListener('hashchange', render);
    render();
})();
