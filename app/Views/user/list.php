<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<div class="container-fluid">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">

        <h4 class="mb-0">
            User Management
        </h4>

        <button
            type="button"
            class="btn btn-primary"
            id="btnAddUser">
            <i class="bi bi-plus-lg"></i>
            Add User
        </button>

    </div>


    <!-- Table -->
    <div class="card">

        <div class="card-body">

            <div class="table-responsive">

                <table
                    id="tableUser"
                    class="table table-bordered table-striped table-hover w-100">

                    <thead>

                        <tr>

                            <th width="5%">
                                No
                            </th>

                            <th>
                                Username
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Role
                            </th>

                            <th width="10%">
                                Enable
                            </th>

                            <th width="12%">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody></tbody>

                </table>

            </div>

        </div>

    </div>

</div>


<!-- ========================================================= -->
<!-- Modal User -->
<!-- ========================================================= -->

<div
    class="modal fade"
    id="modalUser"
    tabindex="-1">

    <div class="modal-dialog modal-lg">

        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">

                <h5
                    class="modal-title"
                    id="modalUserTitle">
                    Add User
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"></button>

            </div>


            <!-- Form -->
            <form
                id="formUser"
                method="post">

                <div class="modal-body">

                    <!-- ID -->
                    <input
                        type="hidden"
                        name="id"
                        id="user_id">


                    <!-- Username & Name -->
                    <div class="row">

                        <!-- Username -->
                        <div class="col-md-6 mb-3">

                            <label
                                for="username"
                                class="form-label">
                                Username
                            </label>

                            <input
                                type="text"
                                class="form-control"
                                name="username"
                                id="username"
                                required>

                            <div
                                class="invalid-feedback"
                                id="error_username"></div>

                        </div>


                        <!-- Name -->
                        <div class="col-md-6 mb-3">

                            <label
                                for="name"
                                class="form-label">
                                Name
                            </label>

                            <input
                                type="text"
                                class="form-control"
                                name="name"
                                id="name"
                                required>

                            <div
                                class="invalid-feedback"
                                id="error_name"></div>

                        </div>

                    </div>


                    <!-- Email -->
                    <div class="mb-3">

                        <label
                            for="email"
                            class="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            class="form-control"
                            name="email"
                            id="email"
                            required>

                        <div
                            class="invalid-feedback"
                            id="error_email"></div>

                    </div>
                    <div class="mb-3">
                        <label for="role_id" class="form-label">Role</label>

                        <select
                            class="form-select"
                            id="role_id"
                            name="role_id[]"
                            style="width: 100%;" multiple>

                            <!-- <option value="">-- Pilih Role --</option> -->

                            <?php foreach ($roles as $role): ?>
                                <option value="<?= $role['role_id'] ?>">
                                    <?= esc($role['role_name']) ?>
                                </option>
                            <?php endforeach; ?>

                        </select>
                    </div>


                    <!-- Password -->
                    <div class="mb-3">

                        <label
                            for="password"
                            class="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            class="form-control"
                            name="password"
                            id="password">

                        <small
                            class="text-muted"
                            id="passwordHelp">
                            Password minimal 6 karakter.
                        </small>

                        <div
                            class="invalid-feedback"
                            id="error_password"></div>

                    </div>

                </div>


                <!-- Modal Footer -->
                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">
                        Batal
                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary"
                        id="btnSaveUser">
                        <i class="bi bi-save"></i>
                        Save
                    </button>

                </div>

            </form>

        </div>

    </div>

</div>


<!-- ========================================================= -->
<!-- Javascript -->
<!-- ========================================================= -->


<script src="<?= base_url('assets/js/user.js') ?>"></script>

<?= $this->endSection() ?>