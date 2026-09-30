'use strict';
window.PebAdmin = (() => {
    function mount(root, initialSection) {
        root.innerHTML = `<div class="page-heading"><h1>Master Data</h1></div><div class="document-tabs" role="tablist" aria-label="Pengelolaan"><button role="tab" aria-selected="true" id="admin-tab-master" aria-controls="admin-panel" data-section="master">Referensi PEB</button><button role="tab" aria-selected="false" tabindex="-1" id="admin-tab-users" aria-controls="admin-panel" data-section="users">Pengguna</button><button role="tab" aria-selected="false" tabindex="-1" id="admin-tab-roles" aria-controls="admin-panel" data-section="roles">Hak akses</button></div><section class="panel" id="admin-panel" role="tabpanel"></section>`;
        let selected = initialSection || 'master';
        if (initialSection) {
            root.querySelector('h1').textContent = selected === 'users' ? 'Pengguna' : 'Master Data PEB';
            root.querySelector('[role=tablist]').remove();
        }
        const panel = root.querySelector('#admin-panel');
        const settings = {
            master: { title: 'Referensi PEB', columns: ['Jenis', 'Kode', 'Nama', 'Status'], fields: ['Jenis master', 'Kode', 'Nama'] },
            users: { title: 'Pengguna', columns: ['Nama', 'Username', 'Peran', 'Status'], fields: ['Nama', 'Username'] }
        };
        function paint() {
            root.querySelectorAll('[role=tab]').forEach(tab => { const active = tab.dataset.section === selected; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
            if (initialSection) {
                panel.removeAttribute('role');
                panel.setAttribute('aria-label', selected === 'users' ? 'Daftar pengguna' : 'Referensi PEB');
            } else panel.setAttribute('aria-labelledby', `admin-tab-${selected}`);
            if (selected === 'roles') {
                panel.innerHTML = '<div class="panel-heading"><h2>Hak akses Admin dan User</h2></div><div class="entry-fields"><p class="form-notice">Hak akses belum diterapkan pada halaman ini. Identitas dan izin harus berasal dari autentikasi backend.</p><div class="table-wrap"><table><thead><tr><th>Fitur</th><th>Admin</th><th>User / Exim</th></tr></thead><tbody><tr><td>Akun dan hak akses</td><td>Kelola</td><td>Tidak tersedia</td></tr><tr><td>Master data PEB</td><td>Kelola</td><td>Kelola</td></tr><tr><td>Draft, review, pengiriman PEB</td><td>Tidak tersedia</td><td>Kelola</td></tr><tr><td>Monitoring, respons, riwayat</td><td>Tidak tersedia</td><td>Lihat dan unduh</td></tr></tbody></table></div></div>';
                return;
            }
            const config = settings[selected];
            panel.innerHTML = `<div class="panel-heading"><h2>${config.title}</h2><button class="button" data-add>Tambah ${selected === 'master' ? 'referensi' : 'pengguna'}</button></div><div id="management-form"></div><div class="table-wrap"><table><thead><tr>${config.columns.map(label => `<th>${label}</th>`).join('')}</tr></thead><tbody></tbody></table></div><div class="empty-state"><h3>Belum ada data</h3><p>${selected === 'master' ? 'Jenis referensi akan mengikuti master data yang ditetapkan.' : 'Daftar pengguna belum terhubung ke layanan akun.'}</p></div>`;
        }
        root.addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!button) return;
            if (button.dataset.section) { selected = button.dataset.section; paint(); }
            if (button.hasAttribute('data-add')) {
                const config = settings[selected];
                panel.querySelector('#management-form').innerHTML = `<form class="entry-fields"><div class="entry-grid">${config.fields.map(label => `<label>${label}<input required maxlength="100" name="${label}"></label>`).join('')}${selected === 'users' ? '<label>Peran<select required><option value="">Pilih peran</option><option value="admin">Admin</option><option value="user">User / Exim</option></select></label>' : ''}</div><p class="form-notice">Penyimpanan belum terhubung. Data tidak akan ditambahkan ke daftar.</p><div class="form-actions"><button class="button primary">Periksa isian</button><button type="button" class="button" data-cancel>Batal</button></div><p role="status" class="form-feedback"></p></form>`;
                panel.querySelector('input').focus();
                panel.querySelector('form').addEventListener('submit', event => { event.preventDefault(); panel.querySelector('.form-feedback').textContent = 'Isian telah diperiksa di browser. Belum disimpan ke server.'; });
            }
            if (button.hasAttribute('data-cancel')) paint();
        });
        root.addEventListener('keydown', event => {
            if (!event.target.matches('[role=tab]') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const keys = ['master', 'users', 'roles'];
            selected = keys[event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (keys.indexOf(selected) + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3];
            paint(); root.querySelector(`[data-section="${selected}"]`).focus();
        });
        paint();
    }
    return { mount };
})();
