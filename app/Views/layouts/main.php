<!DOCTYPE html>
<html lang="en" data-lte-primary="sky">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title><?= $title ?? 'Dashboard' ?></title>

    <meta
        name="base-url"
        content="<?= base_url() ?>">

    <link
        rel="stylesheet"
        href="<?= base_url("assets/css/dataTables.bootstrap5.min.css"); ?>">
    <link
        rel="stylesheet"
        href="<?= base_url("assets/css/select2/select2.min.css"); ?>">
    <link
        rel="stylesheet"
        href="<?= base_url("assets/css/bootstrap-icons.min.css"); ?>">

    <!-- AdminLTE -->
    <link rel="stylesheet"
        href="<?= base_url('assets/css/adminlte/adminlte.min.css') ?>">


    <link rel="stylesheet"
        href="<?= base_url('assets/css/adminlte/adminlte-colors.css') ?>">
    <!-- <link
        rel="stylesheet"
        href="<?= base_url("assets/css/adminlte-select2.min.css"); ?>"> -->
    <link
        rel="stylesheet"
        href="<?= base_url("assets/css/tom-select.bootstrap5.min.css"); ?>">




    <script src="<?= base_url("assets/js/jquery-3.7.1.min.js") ?>"></script>
    <script src="<?= base_url("assets/js/dataTables.min.js") ?>"></script>
    <script src="<?= base_url("assets/js/dataTables.bootstrap5.min.js") ?>"></script>
    <script src="<?= base_url("assets/js/bootstrap.bundle.min.js") ?>"></script>
    <script src="<?= base_url("assets/js/parsley.min.js") ?>"></script>
    <script src="<?= base_url("assets/js/sweetalert2@11.js") ?>"></script>
    <script src="<?= base_url("assets/js/select2/select2.min.js") ?>"></script>
    <script src="<?= base_url("assets/js/tom-select.complete.min.js") ?>"></script>


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

    <script src="<?= base_url('assets/js/common.js') ?>"></script>

    <?= $this->renderSection('scripts') ?>
</body>

</html>