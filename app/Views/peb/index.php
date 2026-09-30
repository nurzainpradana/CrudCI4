<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Fast-PEB</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= base_url('assets/css/peb-classic.css') ?>">
    <script defer src="<?= base_url('assets/js/peb-schema.js') ?>"></script>
    <script defer src="<?= base_url('assets/js/peb-form.js') ?>"></script>
    <script defer src="<?= base_url('assets/js/peb-admin.js') ?>"></script>
    <script defer src="<?= base_url('assets/js/' . (!empty($adminPage) ? 'peb-admin-app.js' : 'peb-app.js')) ?>"></script>
</head>
<body>
<a class="skip" href="#content">Lewati navigasi</a>
<aside class="sidebar" id="sidebar">
    <a class="brand" href="<?= !empty($adminPage) ? '#users' : '#peb' ?>">Fast<span>-PEB</span></a>
    <nav aria-label="Menu utama" id="navigation"></nav>
    <div class="sidebar-bottom"><?= !empty($adminPage) ? 'Administrasi sistem' : 'Administrasi ekspor' ?></div>
</aside>
<div class="app-shell">
    <header class="topbar">
        <button class="button mobile-menu" id="menu-toggle" aria-controls="sidebar" aria-expanded="false">Menu</button>
        <time id="today"></time>
    </header>
    <main id="content" tabindex="-1"></main>
    <footer><span>Version 1.0</span></footer>
</div>
<dialog id="detail-dialog" aria-labelledby="detail-title">
    <div class="dialog-header"><h2 id="detail-title">Detail dokumen</h2></div>
    <div id="detail-body"></div>
</dialog>
</body>
</html>
