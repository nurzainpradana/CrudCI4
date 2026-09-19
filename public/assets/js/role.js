
$(document).ready(function () {

    // =========================================================
    // DataTable
    // =========================================================

    const table = $('#roleTable').DataTable({

        processing: true,
        serverSide: false,

        ajax: {
            url: baseUrl + 'role/data',
            type: 'GET',
            dataSrc: 'data'
        },

        columns: [

            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },

            {
                data: 'role_code'
            },

            {
                data: 'role_name'
            },

            {
                data: 'description',
                defaultContent: '-'
            },

            {
                data: 'status',
                render: function (data) {

                    if (data == 1) {
                        return `
                            <span class="badge bg-success">
                                Active
                            </span>
                        `;
                    }

                    return `
                        <span class="badge bg-secondary">
                            Deleted
                        </span>
                    `;
                }
            },

            {
                data: null,
                orderable: false,
                searchable: false,

                render: function (data, type, row) {

                    return `
                        <div class="btn-group">

                            <button
                                type="button"
                                class="btn btn-sm btn-warning btn-edit"
                                data-id="${row.id}"
                                title="Edit">

                                <i class="bi bi-pencil"></i>

                            </button>

                            <button
                                type="button"
                                class="btn btn-sm btn-danger btn-delete"
                                data-id="${row.id}"
                                title="Delete">

                                <i class="bi bi-trash"></i>

                            </button>

                        </div>
                    `;
                }
            }

        ]

    });


    // =========================================================
    // Add Role
    // =========================================================

    $('#btnAddRole').on('click', function () {

        resetForm();

        $('#roleModalLabel').text('Add Role');

        $('#roleModal').modal('show');

    });


    // =========================================================
    // Submit Form
    // =========================================================

    $('#roleForm').on('submit', function (e) {

        e.preventDefault();

        const form = $(this);

        // Parsley validation
        if (!form.parsley().isValid()) {
            form.parsley().validate();
            return;
        }

        const id = $('#roleId').val();

        let url = baseUrl + 'role/store';

        if (id) {
            url = baseUrl + 'role/update/' + id;
        }

        const formData = form.serialize();

        $('#btnSaveRole')
            .prop('disabled', true)
            .html(`
                <span class="spinner-border spinner-border-sm"></span>
                Saving...
            `);


        $.ajax({

            url: url,
            type: 'POST',
            data: formData,
            dataType: 'json',

            success: function (response) {

                if (response.status) {

                    $('#roleModal').modal('hide');

                    table.ajax.reload(null, false);

                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message || 'Role berhasil disimpan.',
                        timer: 1500,
                        showConfirmButton: false
                    });

                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: response.message || 'Role gagal disimpan.'
                    });

                }

            },

            error: function (xhr) {

                let message = 'Terjadi kesalahan pada server.';

                if (
                    xhr.responseJSON &&
                    xhr.responseJSON.message
                ) {
                    message = xhr.responseJSON.message;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: message
                });

            },

            complete: function () {

                $('#btnSaveRole')
                    .prop('disabled', false)
                    .html(`
                        <i class="bi bi-save"></i>
                        Save
                    `);

            }

        });

    });


    // =========================================================
    // Edit Role
    // =========================================================

    $('#roleTable').on('click', '.btn-edit', function () {

        const id = $(this).data('id');

        $.ajax({

            url: baseUrl + 'role/edit/' + id,
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                if (response.status) {

                    const role = response.data;

                    $('#roleId').val(role.id);
                    $('#roleCode').val(role.role_code);
                    $('#roleName').val(role.role_name);
                    $('#description').val(role.description);

                    $('#roleModalLabel').text('Edit Role');

                    $('#roleModal').modal('show');

                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: response.message || 'Data role tidak ditemukan.'
                    });

                }

            },

            error: function () {

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal mengambil data role.'
                });

            }

        });

    });


    // =========================================================
    // Delete Role
    // =========================================================

    $('#roleTable').on('click', '.btn-delete', function () {

        const id = $(this).data('id');

        Swal.fire({

            title: 'Delete Role?',
            text: 'Data role akan dihapus.',
            icon: 'warning',

            showCancelButton: true,

            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',

            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel'

        }).then((result) => {

            if (!result.isConfirmed) {
                return;
            }

            $.ajax({

                url: baseUrl + 'role/delete/' + id,

                type: 'POST',

                dataType: 'json',

                success: function (response) {

                    if (response.status) {

                        table.ajax.reload(null, false);

                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted',
                            text: response.message || 'Role berhasil dihapus.',
                            timer: 1500,
                            showConfirmButton: false
                        });

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: 'Failed',
                            text: response.message || 'Role gagal dihapus.'
                        });

                    }

                },

                error: function () {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Terjadi kesalahan saat menghapus role.'
                    });

                }

            });

        });

    });


    // =========================================================
    // Reset Form
    // =========================================================

    function resetForm() {

        $('#roleForm')[0].reset();

        $('#roleId').val('');

        // Reset Parsley
        $('#roleForm')
            .parsley()
            .reset();

        $('#roleModalLabel').text('Add Role');

    }


    // =========================================================
    // Reset ketika modal ditutup
    // =========================================================

    $('#roleModal').on('hidden.bs.modal', function () {

        resetForm();

    });

});