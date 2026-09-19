
<?= $this->extend('layouts/main') ?>

<?= $this->section('content') ?>

<div class="container-fluid">

    <div class="d-flex justify-content-between align-items-center mb-3">

        <div>
            <h3 class="mb-0">Role Management</h3>
            <small class="text-muted">
                Manage system roles
            </small>
        </div>

        <button
            type="button"
            class="btn btn-primary"
            id="btnAddRole">

            <i class="bi bi-plus-lg"></i>
            Add Role

        </button>

    </div>


    <div class="card">

        <div class="card-body">

            <table
                id="roleTable"
                class="table table-bordered table-striped w-100">

                <thead>
                    <tr>
                        <th>No</th>
                        <th>Role Code</th>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th width="100">Action</th>
                    </tr>
                </thead>

            </table>

        </div>

    </div>

</div>


<!-- Modal -->
<div
    class="modal fade"
    id="roleModal"
    tabindex="-1"
    aria-hidden="true">

    <div class="modal-dialog">

        <div class="modal-content">

            <div class="modal-header">

                <h5
                    class="modal-title"
                    id="roleModalLabel">

                    Add Role

                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal">
                </button>

            </div>


            <form
                id="roleForm"
                data-parsley-validate>

                <div class="modal-body">

                    <input
                        type="hidden"
                        id="roleId"
                        name="id">


                    <!-- Role Code -->
                    <div class="mb-3">

                        <label
                            for="roleCode"
                            class="form-label">

                            Role Code
                            <span class="text-danger">*</span>

                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="roleCode"
                            name="role_code"
                            maxlength="50"
                            required
                            data-parsley-required-message="Role Code wajib diisi."
                            data-parsley-maxlength-message="Role Code maksimal 50 karakter.">

                    </div>


                    <!-- Role Name -->
                    <div class="mb-3">

                        <label
                            for="roleName"
                            class="form-label">

                            Role Name
                            <span class="text-danger">*</span>

                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="roleName"
                            name="role_name"
                            maxlength="100"
                            required
                            data-parsley-required-message="Role Name wajib diisi."
                            data-parsley-maxlength-message="Role Name maksimal 100 karakter.">

                    </div>


                    <!-- Description -->
                    <div class="mb-3">

                        <label
                            for="description"
                            class="form-label">

                            Description

                        </label>

                        <textarea
                            class="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            maxlength="255"
                            data-parsley-maxlength-message="Description maksimal 255 karakter."></textarea>

                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">

                        Close

                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary"
                        id="btnSaveRole">

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

<!-- Role JS -->
<script src="<?= base_url('assets/js/role.js') ?>"></script>

<?= $this->endSection() ?>
