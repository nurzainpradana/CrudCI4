'use strict';

(() => {
    // The FE preview only uses local fixtures; it never calls ERP or CEISA.
    const invoices = [
        { id: 'DEMO-INV-001', date: '21 Sep 2026', buyer: 'Penerima Contoh A', destination: 'Singapura', items: 12, packages: 24, weight: '1.240 kg', amount: 'USD 18.500', pl: 'DEMO-PL-001', shipping: 'DEMO-SI-001', complete: true },
        { id: 'DEMO-INV-002', date: '21 Sep 2026', buyer: 'Penerima Contoh B', destination: 'Malaysia', items: 8, packages: 16, weight: '860 kg', amount: 'USD 12.800', pl: 'DEMO-PL-002', shipping: 'DEMO-SI-002', complete: false },
        { id: 'DEMO-INV-003', date: '20 Sep 2026', buyer: 'Penerima Contoh C', destination: 'Jepang', items: 6, packages: 10, weight: '520 kg', amount: 'USD 9.600', pl: 'DEMO-PL-003', shipping: 'DEMO-SI-003', complete: true }
    ];
    const storageKey = 'fast-peb-demo-v2';
    let restored = {};
    try { restored = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); } catch { restored = {}; }
    const documents = Array.isArray(restored?.documents) ? restored.documents.filter(doc => doc && invoices.some(i => i.id === doc.invoice) && doc.values && typeof doc.values === 'object' && Array.isArray(doc.goods) && Array.isArray(doc.attachments) && Array.isArray(doc.containers)) : [];
    const logs = Array.isArray(restored?.logs) ? restored.logs : [];
    const workflow = window.PebWorkflow;
    documents.forEach(workflow.normalize);
    const master = Array.isArray(restored.master) ? restored.master : [];
    const accounts = Array.isArray(restored.accounts) ? restored.accounts : [
        { id: 'demo-admin', name: 'Admin Contoh', username: 'admin.demo', role: 'admin', active: true },
        { id: 'demo-exim', name: 'Exim Contoh', username: 'exim.demo', role: 'user', active: true }
    ];
    const menus = [
        ['invoice', 'Invoice'], ['packing', 'Packing List'],
        ['shipping', 'Shipping Instruction Data'], ['pdke', 'Data PDKE'], ['dashboard', 'Dashboard'], ['peb', 'PEB'], ['history', 'Log History'], ['master', 'Master Data'], ['accounts', 'Akun & Hak Akses']
    ];
    let role = 'user';
    let account = accounts.find(item => item.id === restored.accountId && item.active) || null;
    if (account) role = account.role;
    let sourceExpanded = false;
    const sourcePages = ['invoice', 'packing', 'shipping'];
    let page = 'peb';
    let busy = false;
    let activeDocument = null;
    let showCreate = false;
    const content = document.querySelector('#content');
    const dialog = document.querySelector('#detail-dialog');
    const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const badge = (label, kind = '') => `<span class="status ${kind}">${escape(label)}</span>`;
    const fields = entries => `<dl class="detail-grid">${entries.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`;
    const invoiceById = id => invoices.find(item => item.id === id);

    function addLog(invoice, activity, result) {
        logs.unshift({ time: new Date().toLocaleString('id-ID'), invoice, activity, result, actor: role === 'admin' ? 'Admin' : 'User / Exim Staff' });
    }

    function persist() {
        try { sessionStorage.setItem(storageKey, JSON.stringify({ documents, logs, master, accounts, accountId: account?.id || null })); return true; }
        catch { return false; }
    }

    function openDocument(doc) {
        location.hash = `peb/${doc.id}`;
    }

    function navigate() {
        if (!account?.active) { account = null; renderLogin(); return; }
        role = account.role;
        document.querySelector('#session-user').textContent = `${account.name} · ${role === 'admin' ? 'Admin' : 'User / Exim Staff'}`;
        document.querySelector('#logout-demo').hidden = false;
        const [hash = 'peb', documentId] = (location.hash.slice(1) || 'peb').split('/');
        const requested = hash === 'loading' ? 'shipping' : hash;
        page = requested === 'source' ? 'invoice' : menus.some(([key]) => key === requested) ? requested : 'peb';
        if (role === 'admin' && !['master', 'accounts'].includes(page)) page = 'master';
        if (role === 'user' && page === 'accounts') page = 'peb';
        activeDocument = page === 'peb' && hash === 'peb' ? documents.find(doc => doc.id === documentId) || null : null;
        if (sourcePages.includes(page)) sourceExpanded = true;
        const target = `#${page}${activeDocument ? '/' + activeDocument.id : ''}`;
        if (location.hash !== target) history.replaceState(null, '', target);
        render();
        document.querySelector('#sidebar').classList.remove('open');
        document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false');
    }

    function render() {
        window.PebForm.unmount();
        const title = menus.find(([key]) => key === page)[1];
        document.title = `${title} · Fast-PEB`;
        document.querySelector('#breadcrumb').textContent = `${sourcePages.includes(page) ? 'Source Data ERP / ' : ''}${title}`;
        renderNavigation();
        if (activeDocument) {
            document.querySelector('#breadcrumb').textContent = `PEB / ${activeDocument.id}`;
            window.PebForm.mount(content, activeDocument, role, {
                onBack: () => { location.hash = 'peb'; },
                onSave: doc => { addLog(doc.invoice, 'Simpan draft', 'Draft disimpan lokal'); return persist(); },
                onReview: doc => {
                    if (role !== 'user') return;
                    workflow.review(doc, 'User / Exim Staff');
                    addLog(doc.invoice, 'Review PEB', `Revisi ${doc.revision} disetujui (simulasi)`);
                    const saved = persist(); render();
                    workflowMessage(saved ? 'Review tersimpan. Lanjutkan dengan Konfirmasi pengiriman.' : 'Review belum tersimpan di browser. Simpan draft sebelum melanjutkan.', !saved);
                }
            });
            workflow.mount(content, activeDocument, { confirmSend, monitor: monitorStatus, download: downloadResponse });
            return;
        }
        content.innerHTML = `<div class="page-heading"><div><div class="eyebrow">${['master', 'accounts'].includes(page) ? 'ADMINISTRASI' : 'DOKUMEN EKSPOR'}</div><h1>${title}</h1></div><span class="status">${role === 'admin' ? 'Admin' : 'User / Exim Staff'} · pratinjau</span></div>`;
        if (page === 'peb') renderPeb();
        else if (page === 'master' || page === 'accounts') window.PebAdmin.mount(content, { page, role, master, accounts, save: (activity, result) => {
            addLog('-', activity, result);
            const saved = persist();
            if (!account?.active || account.role !== role) setTimeout(navigate, 0);
            return saved;
        } });
        else if (page === 'dashboard') renderDashboard();
        else if (page === 'pdke') renderPdke();
        else if (page === 'history') renderHistory();
        else renderSource();
    }

    function renderNavigation() {
        const icon = name => {
            const paths = {
                source: '<path d="M3 7V5h6l2 2h10v13H3Z"/><path d="M3 10h18"/>',
                peb: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h4M9 12h6M9 16h6"/>',
                history: '<path d="M3 11a9 9 0 1 1 2 7M3 5v6h6M12 7v5l3 2"/>',
                master: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
            };
            return `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.master}</svg>`;
        };
        const link = (key, label) => `<a href="#${key}" ${key === page ? 'aria-current="page"' : ''}>${icon(key)}<span>${label}</span></a>`;
        const sourceMenu = `<button type="button" class="nav-disclosure ${sourcePages.includes(page) ? 'is-active' : ''}" id="source-toggle" aria-expanded="${sourceExpanded}" aria-controls="source-submenu">${icon('source')}<span>Source Data ERP</span><svg class="chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button><div id="source-submenu" class="submenu" ${sourceExpanded ? '' : 'hidden'}>${menus.filter(([key]) => sourcePages.includes(key)).map(([key, label]) => `<a href="#${key}" ${key === page ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</div>`;
        document.querySelector('#navigation').innerHTML = role === 'admin'
            ? `${link('accounts', 'Akun & Hak Akses')}${link('master', 'Master Data')}`
            : `${link('dashboard', 'Dashboard')}${sourceMenu}${link('pdke', 'Data PDKE')}${link('peb', 'PEB')}${link('history', 'Log History')}<div class="nav-divider"></div>${link('master', 'Master Data')}`;
    }

    function renderPeb() {
        if (role === 'user') content.querySelector('.page-heading').insertAdjacentHTML('beforeend', '<button type="button" class="button primary" id="create-peb">Buat PEB</button>');
        if (role === 'user' && showCreate) content.insertAdjacentHTML('beforeend', `<section class="panel"><div class="panel-heading"><h2>Ambil data ERP dan PDKE</h2></div><div class="panel-body"><form id="invoice-form"><label class="field-label" for="invoice-number">Nomor invoice</label><div class="form-row"><input id="invoice-number" name="invoice" placeholder="Contoh: DEMO-INV-001" required maxlength="60" autocomplete="off"><button class="button primary" id="process-button" ${busy ? 'disabled' : ''}>${busy ? 'Memeriksa…' : 'Proses invoice'}</button></div><p class="help">Coba <button class="example" type="button" data-example="DEMO-INV-001">DEMO-INV-001</button> atau <button class="example" type="button" data-example="DEMO-INV-002">DEMO-INV-002</button> (peti kemas belum lengkap).</p><label>Skenario sumber<select name="sourceScenario"><option value="success">Data tersedia</option><option value="erp_failed">ERP gagal diambil</option><option value="pdke_failed">PDKE gagal diambil</option></select></label><div id="process-feedback" class="feedback" role="status" aria-live="polite"></div></form></div></section>`);
        content.insertAdjacentHTML('beforeend', `<section class="panel"><div class="panel-heading"><h2>Dokumen PEB</h2><small>Sesi browser ini</small></div><div class="table-tools"><label>Cari dokumen<input id="document-search" type="search" placeholder="Nomor aju atau invoice"></label><label>Status<select id="document-status"><option value="all">Semua status</option>${Object.entries(workflow.labels).map(([key,label]) => `<option value="${key}">${label}</option>`).join('')}</select></label><label>Tanggal<input id="document-date" type="date"></label></div><div class="table-wrap"><table><caption class="screen-reader">Daftar dokumen PEB simulasi</caption><thead><tr><th>DOKUMEN / INVOICE</th><th>PENERIMA</th><th>TANGGAL</th><th>STATUS</th><th>DETAIL</th></tr></thead><tbody id="document-rows"></tbody></table></div></section>`);
        renderDocuments();
    }

    function renderDocuments() {
        const term = document.querySelector('#document-search').value.trim().toLowerCase();
        const status = document.querySelector('#document-status').value;
        const date = document.querySelector('#document-date').value;
        const rows = documents.filter(d => `${d.id} ${d.invoice} ${d.values.aju}`.toLowerCase().includes(term) && (status === 'all' || status === d.status) && (!date || d.date === date));
        document.querySelector('#document-rows').innerHTML = rows.length ? rows.map(doc => {
            const invoice = invoiceById(doc.invoice);
            return `<tr><td><strong>${escape(doc.values.aju || doc.id)}</strong><small>${escape(doc.invoice)}</small></td><td>${invoice.buyer}</td><td>${escape(doc.date)}</td><td>${badge(workflow.labels[doc.status], doc.recorded ? 'success' : '')}</td><td><button class="text-button" data-document="${doc.id}">Lihat detail</button></td></tr>`;
        }).join('') : `<tr><td colspan="5" class="empty"><h3>${documents.length ? 'Tidak ada dokumen yang cocok' : 'Belum ada dokumen PEB'}</h3>${documents.length ? 'Ubah pencarian atau filter.' : 'Klik Buat PEB untuk memulai dari nomor invoice.'}</td></tr>`;
    }

    function renderSource() {
        const title = menus.find(([key]) => key === page)[1];
        content.insertAdjacentHTML('beforeend', `<section class="panel"><div class="panel-heading"><h2>Daftar ${title}</h2><small>3 data contoh</small></div><div class="table-tools"><label>Cari data<input id="source-search" type="search" placeholder="Nomor invoice atau penerima"></label></div><div class="table-wrap"><table><caption class="screen-reader">Data contoh ${title}</caption><thead><tr><th scope="col">REFERENSI</th><th scope="col">PENERIMA</th><th scope="col">${page === 'packing' ? 'KEMASAN' : page === 'invoice' ? 'NILAI INVOICE' : 'TUJUAN'}</th><th scope="col">KELENGKAPAN PEB</th><th scope="col">DETAIL</th></tr></thead><tbody id="source-rows"></tbody></table></div></section>`);
        renderSourceRows();
    }

    function renderSourceRows() {
        const query = document.querySelector('#source-search').value.trim().toLowerCase();
        const rows = invoices.filter(i => `${i.id} ${i.pl} ${i.shipping} ${i.buyer}`.toLowerCase().includes(query));
        document.querySelector('#source-rows').innerHTML = rows.map(i => `<tr><td><strong>${page === 'packing' ? i.pl : page === 'shipping' ? i.shipping : i.id}</strong><small>${page === 'packing' || page === 'shipping' ? i.id : i.date}</small></td><td>${i.buyer}</td><td>${page === 'packing' ? `${i.packages} karton` : page === 'invoice' ? i.amount : i.destination}</td><td>${badge(i.complete ? 'Lengkap (contoh)' : 'Shipping Instruction belum lengkap', i.complete ? 'success' : 'warning')}</td><td><button class="text-button" data-source="${i.id}">Lihat detail</button></td></tr>`).join('') || '<tr><td colspan="5" class="empty">Data tidak ditemukan. Coba nomor invoice lainnya.</td></tr>';
    }

    function renderHistory() {
        content.insertAdjacentHTML('beforeend', `<section class="panel"><div class="panel-heading"><h2>Aktivitas sesi ini</h2><small>Riwayat simulasi · sesi browser ini</small></div><div class="table-wrap"><table><caption class="screen-reader">Log simulasi</caption><thead><tr><th>WAKTU</th><th>INVOICE</th><th>PELAKU</th><th>AKTIVITAS</th><th>HASIL</th></tr></thead><tbody>${logs.length ? logs.map(log => `<tr><td>${escape(log.time)}</td><td>${escape(log.invoice)}</td><td>${escape(log.actor || 'Admin (versi sebelumnya)')}</td><td>${escape(log.activity)}</td><td>${escape(log.result)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">Belum ada aktivitas.</td></tr>'}</tbody></table></div></section>`);
    }

    async function processInvoice(form) {
        if (role !== 'user' || busy) return;
        const value = form.elements.invoice.value.trim().toUpperCase();
        if (!value) { form.elements.invoice.setCustomValidity('Masukkan nomor invoice.'); form.elements.invoice.reportValidity(); return; }
        const feedback = document.querySelector('#process-feedback');
        const button = document.querySelector('#process-button');
        busy = true;
        button.disabled = true;
        button.textContent = 'Memeriksa…';
        feedback.className = 'feedback';
        feedback.textContent = 'Mengambil data contoh ERP dan PDKE…';
        await new Promise(resolve => setTimeout(resolve, 500));
        busy = false;
        // Navigation can replace the form while the preview is checking a fixture.
        if (!form.isConnected || role !== 'user') { if (page === 'peb') render(); return; }
        button.disabled = false;
        button.textContent = 'Proses invoice';
        if (form.elements.sourceScenario.value !== 'success') {
            const system = form.elements.sourceScenario.value === 'erp_failed' ? 'ERP' : 'PDKE';
            feedback.className = 'feedback error';
            feedback.textContent = `Data ${system} gagal diambil (simulasi). Periksa sumber atau integrasi, lalu coba lagi. Menambah master data tidak memperbaiki kegagalan ini.`;
            addLog(value, `Ambil sumber ${system}`, 'Gagal; draft tidak dibuat'); persist(); return;
        }
        const invoice = invoiceById(value);
        if (!invoice) {
            feedback.className = 'feedback error';
            feedback.textContent = 'Invoice tidak ditemukan dalam data contoh. Gunakan DEMO-INV-001, DEMO-INV-002, atau DEMO-INV-003.';
            addLog(value, 'Periksa invoice', 'Tidak ditemukan');
            persist();
            return;
        }
        let doc = documents.find(d => d.invoice === value);
        if (!doc) {
            doc = workflow.normalize(window.PebSchema.createDocument(invoice, `DEMO-PEB-${String(documents.length + 1).padStart(3, '0')}`));
            doc.date = new Date().toLocaleDateString('sv-SE');
            documents.unshift(doc);
            addLog(value, 'Susun PEB', 'Draft contoh dibuat dari invoice');
            persist();
        }
        showCreate = false;
        openDocument(doc);
    }

    function showDetail(title, html) {
        document.querySelector('#detail-title').textContent = title;
        document.querySelector('#detail-body').innerHTML = html;
        dialog.classList.add('source-detail-dialog');
        dialog.showModal();
    }

    function workflowMessage(message, error = false) {
        const node = content.querySelector('#workflow-message');
        if (!node) return;
        node.className = `feedback ${error ? 'error' : ''}`;
        node.textContent = message;
    }

    function confirmSend(outcome) {
        if (role !== 'user' || !activeDocument || workflow.isSent(activeDocument)) return;
        const doc = activeDocument;
        showDetail('Konfirmasi pengiriman PEB', `<p>Invoice <strong>${escape(doc.invoice)}</strong>, revisi ${doc.revision}. Draft harus sudah direview pada revisi ini.</p><p>Simulasi akan membentuk payload dan memeriksa autentikasi sebelum pengiriman H2H. Tidak ada data yang dikirim ke CEISA.</p><button class="button primary" id="send-final">Kirim simulasi</button>`);
        document.querySelector('#send-final').addEventListener('click', async event => {
            event.target.disabled = true;
            event.target.textContent = 'Memeriksa autentikasi…';
            await new Promise(resolve => setTimeout(resolve, 400));
            if (role !== 'user' || activeDocument !== doc) return;
            dialog.close();
            try {
                if (!persist()) throw Error('Penyimpanan draft gagal. Pengiriman dibatalkan.');
                const attempt = workflow.send(doc, outcome);
                addLog(doc.invoice, attempt.stage, `${attempt.result} · ${attempt.request}`);
                const saved = persist(); render();
                workflowMessage(!saved ? 'Hasil ada di memori, tetapi gagal disimpan. Jangan muat ulang.' : outcome === 'success' ? 'PEB terkirim dalam simulasi. Gunakan Periksa status untuk mengambil respons.' : outcome === 'auth_failed' ? 'Autentikasi gagal. PEB belum dikirim; coba ulang setelah token diperbaiki.' : 'Pengiriman gagal. Periksa data atau layanan sebelum mencoba kembali.', !saved || outcome !== 'success');
            } catch (error) { workflowMessage(error.message, true); }
        }, { once: true });
    }

    function monitorStatus(outcome) {
        if (role !== 'user' || !activeDocument) return;
        try {
            const response = workflow.monitor(activeDocument, outcome);
            addLog(activeDocument.invoice, 'Ambil status', response.message);
            const saved = persist(); render();
            workflowMessage(saved ? response.message : 'Respons gagal disimpan di browser.', !saved);
        } catch (error) {
            addLog(activeDocument.invoice, 'Ambil status', error.message); persist();
            workflowMessage(error.message, true);
        }
    }

    function downloadResponse(outcome) {
        if (role !== 'user' || !activeDocument?.responses[0]?.pdf) return;
        if (outcome === 'failed') {
            const message = 'PDF gagal diambil (simulasi). Coba unduh kembali. PEB tidak dikirim ulang.';
            addLog(activeDocument.invoice, 'Unduh PDF', message); persist(); workflowMessage(message, true); return;
        }
        const url = URL.createObjectURL(new Blob([workflow.pdf(activeDocument)], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url; link.download = `SIMULASI-${activeDocument.id}.pdf`;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        addLog(activeDocument.invoice, 'Unduh PDF', 'Unduhan PDF contoh dimulai');
        const saved = persist();
        workflowMessage(saved ? 'Unduhan PDF contoh dimulai. Bukan dokumen resmi CEISA.' : 'Unduhan dimulai, tetapi riwayat gagal disimpan.', !saved);
    }

    function renderDashboard() {
        content.insertAdjacentHTML('beforeend', `<div class="summary"><div><strong>${documents.filter(d => !workflow.isSent(d)).length}</strong><span>Belum terkirim</span></div><div><strong>${documents.filter(workflow.isSent).length}</strong><span>Terkirim</span></div><div><strong>${documents.filter(d => d.responses[0]?.pdf).length}</strong><span>PDF respons tersedia</span></div></div><section class="panel"><div class="panel-heading"><h2>Monitoring PEB</h2><a href="#peb" class="button">Buka daftar PEB</a></div><div class="panel-body">${documents.length ? documents.map(doc => `<div class="monitor-row"><div><strong>${escape(doc.invoice)}</strong><p>${escape(workflow.labels[doc.status])} · ${escape(doc.responses[0]?.message || 'Belum ada respons')}</p></div><button class="text-button" data-document="${doc.id}">Lihat detail</button></div>`).join('') : '<p>Belum ada dokumen. Buat draft dari daftar PEB untuk memulai.</p>'}</div></section>`);
    }

    function renderPdke() {
        content.insertAdjacentHTML('beforeend', `<section class="panel"><div class="panel-heading"><h2>Persiapan Dokumen Kelengkapan Ekspor</h2><small>Sumber eksternal · data contoh</small></div><div class="table-wrap"><table><thead><tr><th>Invoice</th><th>Referensi PDKE</th><th>Lokasi pemeriksaan</th><th>Tanggal periksa</th></tr></thead><tbody>${invoices.map((invoice, i) => `<tr><td>${invoice.id}</td><td>DEMO-PDKE-00${i + 1}</td><td>Gudang eksportir</td><td>2026-09-24</td></tr>`).join('')}</tbody></table></div></section>`);
    }

    function clearInvoiceResult() {
        if (!busy) document.querySelector('#process-feedback').replaceChildren();
    }

    document.addEventListener('click', event => {
        if (event.target.closest('#create-peb') && role === 'user') {
            showCreate = !showCreate;
            render();
            document.querySelector('#invoice-number')?.focus();
            return;
        }
        if (event.target.closest('#source-toggle')) {
            sourceExpanded = !sourceExpanded;
            const toggle = document.querySelector('#source-toggle');
            toggle.setAttribute('aria-expanded', String(sourceExpanded));
            document.querySelector('#source-submenu').hidden = !sourceExpanded;
            return;
        }
        if (event.target.closest('.skip')) {
            event.preventDefault();
            content.focus();
            return;
        }
        const source = event.target.closest('[data-source]');
        const documentButton = event.target.closest('[data-document]');
        const example = event.target.closest('[data-example]');
        if (example) {
            const input = document.querySelector('#invoice-number');
            input.value = example.dataset.example;
            input.setCustomValidity('');
            clearInvoiceResult();
            input.focus();
        }
        if (source) {
            const item = invoiceById(source.dataset.source);
            const sourceDoc = window.PebSchema.createDocument(item, 'DEMO-SOURCE');
            const v = sourceDoc.values;
            const entries = page === 'invoice'
                ? [['Nomor invoice', item.id], ['Tanggal', item.date], ['Pembeli', v.buyerName], ['Penerima', v.receiverName], ['Negara', v.buyerCountry], ['Valuta', v.currency], ['Nilai FOB', item.amount], ['Cara penyerahan', v.delivery]]
                : page === 'packing'
                    ? [['Packing list', item.pl], ['Invoice terkait', item.id], ['Jumlah kemasan', v.packageCount], ['Jenis kemasan', v.packageType], ['Merek', v.packageMark], ['Bruto (kg)', v.gross], ['Netto (kg)', v.net], ['Volume (m³)', v.volume]]
                    : [['Shipping Instruction', item.shipping], ['Invoice terkait', item.id], ['Sarana angkut', v.vessel], ['Nomor sarana angkut', v.voyage], ['Pelabuhan muat', v.originPort], ['Pelabuhan bongkar', v.unloadPort], ['Pelabuhan tujuan', v.destinationPort], ['Negara tujuan', v.destinationCountry], ['Perkiraan ekspor', v.exportDate], ['Nomor peti kemas', sourceDoc.containers[0].number || 'Belum tersedia']];
            const rows = sourceDoc.goods.map(row => `<tr><td>${escape(row.code)}</td><td>${escape(row.description)}</td><td>${row.quantity}</td><td>${escape(row.unit)}</td><td>${row.packages}</td><td>${row.net}</td></tr>`).join('');
            showDetail(`${menus.find(([key]) => key === page)[1]} · ${item.id}`, fields(entries) + (page === 'shipping' ? `<p class="note">${item.complete ? 'Data Shipping Instruction contoh lengkap.' : 'Nomor peti kemas belum tersedia pada sumber. Lengkapi di draft PEB untuk mencoba validasi.'}</p>` : `<div class="source-detail-table table-wrap" tabindex="0" aria-label="Rincian barang sumber"><table><thead><tr><th>Item code</th><th>Uraian</th><th>Jumlah</th><th>Satuan</th><th>Kemasan</th><th>Netto (kg)</th></tr></thead><tbody>${rows}</tbody></table></div>`));
        }
        if (documentButton) {
            const doc = documents.find(d => d.id === documentButton.dataset.document);
            if (doc) openDocument(doc);
        }
    });
    document.addEventListener('submit', event => {
        if (event.target.id === 'invoice-form') { event.preventDefault(); processInvoice(event.target); }
    });
    document.addEventListener('input', event => {
        if (event.target.id === 'document-search') renderDocuments();
        if (event.target.id === 'source-search') renderSourceRows();
        if (event.target.id === 'invoice-number') {
            event.target.setCustomValidity('');
            clearInvoiceResult();
        }
    });
    document.querySelector('#logout-demo').addEventListener('click', () => {
        addLog('-', 'Keluar simulasi', account?.username || '-');
        account = null; activeDocument = null;
        if (dialog.open) dialog.close();
        persist(); renderLogin();
    });
    document.addEventListener('change', event => { if (['document-status', 'document-date'].includes(event.target.id)) renderDocuments(); });
    document.querySelector('#close-detail').addEventListener('click', () => dialog.close());
    document.querySelector('#menu-toggle').addEventListener('click', event => {
        const open = document.querySelector('#sidebar').classList.toggle('open');
        event.currentTarget.setAttribute('aria-expanded', String(open));
    });
    window.addEventListener('hashchange', navigate);
    function renderLogin() {
        window.PebForm.unmount();
        document.querySelector('#navigation').replaceChildren();
        document.querySelector('#logout-demo').hidden = true;
        document.querySelector('#session-user').textContent = 'Belum masuk';
        document.querySelector('#breadcrumb').textContent = 'Login simulasi';
        content.innerHTML = `<section class="panel demo-login"><div class="panel-heading"><h1>Masuk Fast-PEB</h1></div><div class="panel-body"><form id="demo-login"><label>Username<input name="username" required autocomplete="off" maxlength="100"></label><label>Password simulasi<input name="password" type="password" required autocomplete="off"></label><button class="button primary">Masuk simulasi</button><div class="feedback" role="status" id="login-feedback"></div></form><p class="note">Gunakan <strong>exim.demo</strong> atau <strong>admin.demo</strong> dengan password <strong>demo-peb</strong>. Akun contoh lokal, bukan autentikasi server. Jangan masukkan password pribadi.</p></div></section>`;
        content.querySelector('#demo-login').addEventListener('submit', event => {
            event.preventDefault();
            const form = event.target;
            const match = accounts.find(item => item.active && item.username.toLowerCase() === form.elements.username.value.trim().toLowerCase());
            if (!match || form.elements.password.value !== 'demo-peb') {
                content.querySelector('#login-feedback').textContent = 'Login simulasi gagal. Periksa username, password contoh, atau status akun.';
                return;
            }
            account = match; role = account.role;
            sourceExpanded = false;
            addLog('-', 'Login simulasi', account.username); persist();
            history.replaceState(null, '', role === 'admin' ? '#accounts' : '#dashboard');
            navigate();
        });
    }
    navigate();
})();
