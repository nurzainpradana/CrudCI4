<aside class="app-sidebar bg-dark shadow"
       data-bs-theme="dark">

    <!-- Brand -->
    <div class="sidebar-brand">

        <a href="<?= base_url('/') ?>"
           class="brand-link">

            <span class="brand-text fw-light">
                CRUD CI4
            </span>

        </a>

    </div>

    <!-- Sidebar Wrapper -->
    <div class="sidebar-wrapper">

        <nav class="mt-2">

            <ul class="nav sidebar-menu flex-column"
                data-lte-toggle="treeview"
                role="menu">

                <li class="nav-item">

                    <a href="<?= base_url('/') ?>"
                       class="nav-link">

                        <i class="nav-icon bi bi-speedometer"></i>

                        <p>
                            Dashboard
                        </p>

                    </a>

                </li>

                <li class="nav-item">

                    <a href="<?= base_url('post') ?>"
                       class="nav-link">

                        <i class="nav-icon bi bi-file-text"></i>

                        <p>
                            Post
                        </p>

                    </a>

                </li>

            </ul>

        </nav>

    </div>

</aside>