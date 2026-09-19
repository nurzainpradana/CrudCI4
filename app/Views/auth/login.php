<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Login - FastPEB</title>

    <!-- AdminLTE -->
    <link rel="stylesheet"
          href="<?= base_url('assets/css/adminlte.min.css') ?>">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet"
          href="<?= base_url('assets/plugins/bootstrap-icons/bootstrap-icons.min.css') ?>">

</head>

<body class="login-page bg-body-secondary">

<div class="login-box">

    <div class="card card-outline card-primary">

        <div class="card-header text-center">

            <a href="<?= base_url('/') ?>"
               class="h1">
                <b>Fast</b>PEB
            </a>

        </div>

        <div class="card-body login-card-body">

            <p class="login-box-msg">
                Sign in to start your session
            </p>


            <!-- Error -->

            <?php if (session()->getFlashdata('error')): ?>

                <div class="alert alert-danger alert-dismissible fade show"
                     role="alert">

                    <i class="bi bi-exclamation-triangle me-2"></i>

                    <?= esc(session()->getFlashdata('error')) ?>

                    <button type="button"
                            class="btn-close"
                            data-bs-dismiss="alert">
                    </button>

                </div>

            <?php endif; ?>


            <!-- Success -->

            <?php if (session()->getFlashdata('success')): ?>

                <div class="alert alert-success alert-dismissible fade show"
                     role="alert">

                    <i class="bi bi-check-circle me-2"></i>

                    <?= esc(session()->getFlashdata('success')) ?>

                    <button type="button"
                            class="btn-close"
                            data-bs-dismiss="alert">
                    </button>

                </div>

            <?php endif; ?>


            <!-- Login Form -->

            <form action="<?= site_url('login') ?>"
                  method="post">

                <?= csrf_field() ?>


                <!-- Username -->

                <div class="input-group mb-3">

                    <input type="text"
                           name="username"
                           class="form-control"
                           placeholder="Username"
                           value="<?= old('username') ?>"
                           autocomplete="username"
                           required>

                    <div class="input-group-text">
                        <i class="bi bi-person"></i>
                    </div>

                </div>


                <!-- Password -->

                <div class="input-group mb-3">

                    <input type="password"
                           name="password"
                           class="form-control"
                           placeholder="Password"
                           autocomplete="current-password"
                           required>

                    <div class="input-group-text">
                        <i class="bi bi-lock"></i>
                    </div>

                </div>


                <!-- Button -->

                <div class="row">

                    <div class="col-12">

                        <button type="submit"
                                class="btn btn-primary w-100">

                            <i class="bi bi-box-arrow-in-right me-1"></i>

                            Sign In

                        </button>

                    </div>

                </div>

            </form>

        </div>

    </div>

</div>


<!-- Bootstrap -->
<script src="<?= base_url('assets/plugins/bootstrap/js/bootstrap.bundle.min.js') ?>"></script>

<!-- AdminLTE -->
<script src="<?= base_url('assets/js/adminlte.min.js') ?>"></script>

</body>

</html>