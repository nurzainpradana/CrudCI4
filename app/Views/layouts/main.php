<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title><?= $title ?? 'Dashboard' ?></title>

    <!-- AdminLTE -->
    <link rel="stylesheet"
          href="<?= base_url('assets/css/adminlte.min.css') ?>">
</head>

<body class="layout-fixed sidebar-expand-lg bg-body-tertiary">

<div class="app-wrapper">

    <!-- Navbar -->
    <?= $this->include('layouts/navbar') ?>

    <!-- Sidebar -->
    <?= $this->include('layouts/sidebar') ?>

    <!-- Content -->
    <main class="app-main">

        <?= $this->renderSection('content') ?>

    </main>

</div>

<!-- AdminLTE -->
<script src="<?= base_url('assets/js/adminlte.min.js') ?>"></script>

</body>
</html>