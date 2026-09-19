<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<div class="container-fluid">

    <!-- Page Header -->
    <div class="row mb-3">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="mb-0">User Management</h3>
                    <small class="text-muted">
                        Manage system users
                    </small>
                </div>

                <button
                    type="button"
                    class="btn btn-primary"
                    id="btnAddUser"
                >
                    <i class="bi bi-plus-lg"></i>
                    Add User
                </button>
            </div>
        </div>
    </div>


    <!-- DataTable Card -->
    <div class="card">

        <div class="card-header">
            <h3 class="card-title">
                Data User
            </h3>
        </div>

        <div class="card-body">

            <div class="table-responsive">

                <table
                    id="tableUser"
                    class="table table-bordered table-striped"
                    style="width:100%"
                >

                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th width="15%">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                    </tbody>

                </table>

            </div>

        </div>

    </div>

</div>


<!-- ====================================================== -->
<!-- Modal User -->
<!-- ====================================================== -->

<div
    class="modal fade"
    id="modalUser"
    tabindex="-1"
    aria-labelledby="modalUserLabel"
    aria-hidden="true"
>

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header">

                <h5
                    class="modal-title"
                    id="modalUserLabel"
                >
                    Add User
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>

            </div>


            <form id="formUser">

                <div class="modal-body">

                    <input
                        type="hidden"
                        id="user_id"
                        name="id"
                    >


                    <!-- Username -->
                    <div class="mb-3">

                        <label
                            for="username"
                            class="form-label"
                        >
                            Username
                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="username"
                            name="username"
                            autocomplete="off"
                            required
                        >

                        <div
                            class="invalid-feedback"
                            id="error_username"
                        ></div>

                    </div>


                    <!-- Name -->
                    <div class="mb-3">

                        <label
                            for="name"
                            class="form-label"
                        >
                            Name
                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="name"
                            name="name"
                            required
                        >

                        <div
                            class="invalid-feedback"
                            id="error_name"
                        ></div>

                    </div>


                    <!-- Email -->
                    <div class="mb-3">

                        <label
                            for="email"
                            class="form-label"
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            class="form-control"
                            id="email"
                            name="email"
                        >

                        <div
                            class="invalid-feedback"
                            id="error_email"
                        ></div>

                    </div>


                    <!-- Password -->
                    <div class="mb-3">

                        <label
                            for="password"
                            class="form-label"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            class="form-control"
                            id="password"
                            name="password"
                        >

                        <small
                            class="text-muted"
                            id="passwordHelp"
                        >
                            Minimal 6 karakter.
                        </small>

                        <div
                            class="invalid-feedback"
                            id="error_password"
                        ></div>

                    </div>


                    <!-- Role -->
                    
                    <div class="mb-3">
                        <label for="role_id" class="form-label">Role</label>

                        <select
                            class="form-select"
                            id="role_id"
                            name="role_id[]"
                            style="width: 100%;" multiple>


                        </select>
                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary"
                        id="btnSaveUser"
                    >
                        <i class="bi bi-save"></i>
                        Save
                    </button>

                </div>

            </form>

        </div>

    </div>

</div>


<?= $this->endSection() ?>


<?= $this->section('scripts') ?>

<script src="<?= base_url('assets/js/common.js') ?>"></script>
<script src="<?= base_url('assets/js/user.js') ?>"></script>

<?= $this->endSection() ?>