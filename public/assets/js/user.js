$(document).ready(function () {

    /*
    |--------------------------------------------------------------------------
    | Global
    |--------------------------------------------------------------------------
    */

    let tableUser = null;
    let modalUser = null;
    let roleSelect = null;


    /*
    |--------------------------------------------------------------------------
    | Init Modal
    |--------------------------------------------------------------------------
    */

    const modalElement = document.getElementById('modalUser');

    if (modalElement) {

        modalUser = new bootstrap.Modal(modalElement);

    }


    /*
    |--------------------------------------------------------------------------
    | Init Tom Select
    |--------------------------------------------------------------------------
    */

    function initRoleSelect() {

        const roleElement =
            document.getElementById('role_id');


        /*
        |--------------------------------------------------------------------------
        | Element Tidak Ditemukan
        |--------------------------------------------------------------------------
        */

        if (!roleElement) {

            console.error(
                'Element #role_id tidak ditemukan.'
            );

            return false;

        }


        /*
        |--------------------------------------------------------------------------
        | Sudah Diinisialisasi
        |--------------------------------------------------------------------------
        */

        if (roleElement.tomselect) {

            roleSelect =
                roleElement.tomselect;

            return true;

        }


        /*
        |--------------------------------------------------------------------------
        | Create Tom Select
        |--------------------------------------------------------------------------
        */

        roleSelect = new TomSelect(
            roleElement,
            {

                plugins: {

                    remove_button: {
                        title: 'Hapus Role'
                    }

                },

                create: false,

                maxItems: null,

                closeAfterSelect: false,

                placeholder: 'Pilih Role...'

            }
        );


        return true;

    }


    /*
    |--------------------------------------------------------------------------
    | DataTable
    |--------------------------------------------------------------------------
    */

    tableUser = $('#tableUser').DataTable({

        processing: true,

        ajax: {

            url: baseUrl + 'user/data',

            type: 'GET'

        },

        columns: [

            /*
            |--------------------------------------------------------------------------
            | No
            |--------------------------------------------------------------------------
            */

            {

                data: null,

                className: 'text-center',

                render: function (
                    data,
                    type,
                    row,
                    meta
                ) {

                    return meta.row + 1;

                }

            },


            /*
            |--------------------------------------------------------------------------
            | Username
            |--------------------------------------------------------------------------
            */

            {

                data: 'username'

            },


            /*
            |--------------------------------------------------------------------------
            | Name
            |--------------------------------------------------------------------------
            */

            {

                data: 'name'

            },


            /*
            |--------------------------------------------------------------------------
            | Email
            |--------------------------------------------------------------------------
            */

            {

                data: 'email'

            },


            /*
            |--------------------------------------------------------------------------
            | Role
            |--------------------------------------------------------------------------
            */

            {

                data: 'role_name',

                render: function (data) {

                    if (!data) {

                        return '-';

                    }

                    return data;

                }

            },


            /*
            |--------------------------------------------------------------------------
            | Enable
            |--------------------------------------------------------------------------
            */

            {

                data: 'enable',

                className: 'text-center',

                render: function (
                    data,
                    type,
                    row
                ) {

                    if (
                        parseInt(data) === 1
                    ) {

                        return `

                            <button
                                type="button"
                                class="btn btn-sm btn-success btnToggleEnable"
                                data-id="${row.id}"
                                title="Disable User">

                                <i class="bi bi-check-circle"></i>
                                Enable

                            </button>

                        `;

                    }


                    return `

                        <button
                            type="button"
                            class="btn btn-sm btn-secondary btnToggleEnable"
                            data-id="${row.id}"
                            title="Enable User">

                            <i class="bi bi-x-circle"></i>
                            Disable

                        </button>

                    `;

                }

            },


            /*
            |--------------------------------------------------------------------------
            | Action
            |--------------------------------------------------------------------------
            */

            {

                data: null,

                className: 'text-center',

                orderable: false,

                render: function (
                    data,
                    type,
                    row
                ) {

                    return `

                        <div class="btn-group">

                            <button
                                type="button"
                                class="btn btn-sm btn-warning btnEditUser"
                                data-id="${row.id}"
                                title="Edit">

                                <i class="bi bi-pencil"></i>

                            </button>


                            <button
                                type="button"
                                class="btn btn-sm btn-danger btnDeleteUser"
                                data-id="${row.id}"
                                title="Delete">

                                <i class="bi bi-trash"></i>

                            </button>

                        </div>

                    `;

                }

            }

        ],

        responsive: true,

        autoWidth: false

    });


    /*
    |--------------------------------------------------------------------------
    | Load Roles
    |--------------------------------------------------------------------------
    |
    | Hanya mengambil daftar Role melalui AJAX.
    |
    | Tidak melakukan INSERT / UPDATE.
    |
    */

    function loadRoles(
        selectedRoleIds = []
    ) {


        /*
        |--------------------------------------------------------------------------
        | Pastikan Tom Select Sudah Ada
        |--------------------------------------------------------------------------
        */

        if (!roleSelect) {

            if (!initRoleSelect()) {

                console.error(
                    'Tom Select #role_id belum siap.'
                );

                return $.Deferred()
                    .reject()
                    .promise();

            }

        }


        /*
        |--------------------------------------------------------------------------
        | AJAX
        |--------------------------------------------------------------------------
        */

        return $.ajax({

            url: baseUrl + 'user/roles',

            type: 'GET',

            dataType: 'json'

        })


        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        .done(function (response) {


            /*
            |--------------------------------------------------------------------------
            | Clear Existing Data
            |--------------------------------------------------------------------------
            */

            roleSelect.clear();

            roleSelect.clearOptions();


            /*
            |--------------------------------------------------------------------------
            | Check Response
            |--------------------------------------------------------------------------
            */

            if (
                response.status !== true ||
                !Array.isArray(response.data)
            ) {

                console.error(
                    'Response role tidak valid:',
                    response
                );

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Convert Data
            |--------------------------------------------------------------------------
            */

            const options =
                response.data.map(
                    function (role) {

                        return {

                            value:
                                String(
                                    role.id
                                ),

                            text:
                                role.role_code + " - " + role.role_name

                        };

                    }
                );


            /*
            |--------------------------------------------------------------------------
            | Add Options
            |--------------------------------------------------------------------------
            */

            roleSelect.addOptions(
                options
            );


            /*
            |--------------------------------------------------------------------------
            | Set Selected Role
            |--------------------------------------------------------------------------
            */

            if (
                Array.isArray(
                    selectedRoleIds
                ) &&
                selectedRoleIds.length > 0
            ) {

                roleSelect.setValue(

                    selectedRoleIds.map(
                        function (id) {

                            return String(id);

                        }
                    )

                );

            }

        })


        /*
        |--------------------------------------------------------------------------
        | Error
        |--------------------------------------------------------------------------
        */

        .fail(function (xhr) {

            console.error(

                'Gagal mengambil data role:',

                xhr.responseText

            );


            Swal.fire({

                icon: 'error',

                title: 'Error',

                text:
                    'Gagal mengambil data role.'

            });

        });

    }


    /*
    |--------------------------------------------------------------------------
    | Reset Form
    |--------------------------------------------------------------------------
    */

    function resetForm() {


        /*
        |--------------------------------------------------------------------------
        | Reset HTML Form
        |--------------------------------------------------------------------------
        */

        const form =
            document.getElementById(
                'formUser'
            );


        if (form) {

            form.reset();

        }


        /*
        |--------------------------------------------------------------------------
        | User ID
        |--------------------------------------------------------------------------
        */

        $('#user_id').val('');


        /*
        |--------------------------------------------------------------------------
        | Username
        |--------------------------------------------------------------------------
        */

        $('#username')
            .prop(
                'disabled',
                false
            );


        /*
        |--------------------------------------------------------------------------
        | Password
        |--------------------------------------------------------------------------
        */

        $('#password').val('');


        /*
        |--------------------------------------------------------------------------
        | Reset Tom Select
        |--------------------------------------------------------------------------
        */

        if (roleSelect) {

            roleSelect.clear();

        }


        /*
        |--------------------------------------------------------------------------
        | Reset Validation
        |--------------------------------------------------------------------------
        */

        $('.form-control, .form-select')
            .removeClass(
                'is-invalid'
            );


        $('.invalid-feedback')
            .text('');


        /*
        |--------------------------------------------------------------------------
        | Password Help
        |--------------------------------------------------------------------------
        */

        $('#passwordHelp')
            .text(
                'Password minimal 6 karakter.'
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Add User
    |--------------------------------------------------------------------------
    */

    $('#btnAddUser').on(
        'click',
        function () {


            /*
            |--------------------------------------------------------------------------
            | Reset
            |--------------------------------------------------------------------------
            */

            resetForm();


            /*
            |--------------------------------------------------------------------------
            | Modal Title
            |--------------------------------------------------------------------------
            */

            $('#modalUserTitle')
                .text(
                    'Add User'
                );


            /*
            |--------------------------------------------------------------------------
            | Button
            |--------------------------------------------------------------------------
            */

            $('#btnSaveUser')
                .html(
                    '<i class="bi bi-save"></i> Save'
                );


            /*
            |--------------------------------------------------------------------------
            | Password Required
            |--------------------------------------------------------------------------
            */

            $('#password')
                .prop(
                    'required',
                    true
                );


            /*
            |--------------------------------------------------------------------------
            | Pastikan Tom Select Ada
            |--------------------------------------------------------------------------
            */

            if (!initRoleSelect()) {

                return;

            }


            /*
            |--------------------------------------------------------------------------
            | Load Roles
            |--------------------------------------------------------------------------
            */

            loadRoles([])

                .always(function () {

                    if (modalUser) {

                        modalUser.show();

                    }

                });

        }
    );


    /*
    |--------------------------------------------------------------------------
    | Edit User
    |--------------------------------------------------------------------------
    */

    $('#tableUser tbody').on(

        'click',

        '.btnEditUser',

        function () {


            const id =
                $(this).data('id');


            /*
            |--------------------------------------------------------------------------
            | Reset Form
            |--------------------------------------------------------------------------
            */

            resetForm();


            /*
            |--------------------------------------------------------------------------
            | Modal Title
            |--------------------------------------------------------------------------
            */

            $('#modalUserTitle')
                .text(
                    'Edit User'
                );


            /*
            |--------------------------------------------------------------------------
            | Button
            |--------------------------------------------------------------------------
            */

            $('#btnSaveUser')
                .html(
                    '<i class="bi bi-save"></i> Update'
                );


            /*
            |--------------------------------------------------------------------------
            | Password Optional
            |--------------------------------------------------------------------------
            */

            $('#password')
                .prop(
                    'required',
                    false
                );


            $('#passwordHelp')
                .text(
                    'Kosongkan jika password tidak ingin diubah.'
                );


            /*
            |--------------------------------------------------------------------------
            | Get User
            |--------------------------------------------------------------------------
            */

            $.ajax({

                url:
                    baseUrl +
                    'user/edit/' +
                    id,

                type: 'GET',

                dataType: 'json'

            })


            /*
            |--------------------------------------------------------------------------
            | User Success
            |--------------------------------------------------------------------------
            */

            .done(function (response) {


                if (!response.status) {

                    Swal.fire({

                        icon: 'error',

                        title: 'Error',

                        text:
                            response.message

                    });

                    return;

                }


                const user =
                    response.data;


                /*
                |--------------------------------------------------------------------------
                | Set User Data
                |--------------------------------------------------------------------------
                */

                $('#user_id')
                    .val(
                        user.id
                    );


                $('#username')
                    .val(
                        user.username
                    );


                $('#name')
                    .val(
                        user.name
                    );


                $('#email')
                    .val(
                        user.email
                    );


                /*
                |--------------------------------------------------------------------------
                | Get User Roles
                |--------------------------------------------------------------------------
                */

                $.ajax({

                    url:
                        baseUrl +
                        'user/user-roles/' +
                        id,

                    type: 'GET',

                    dataType: 'json'

                })


                /*
                |--------------------------------------------------------------------------
                | User Roles Success
                |--------------------------------------------------------------------------
                */

                .done(
                    function (roleResponse) {


                        let selectedRoleIds =
                            [];


                        /*
                        |--------------------------------------------------------------------------
                        | Get Selected Role IDs
                        |--------------------------------------------------------------------------
                        */

                        if (

                            roleResponse.status === true &&

                            Array.isArray(
                                roleResponse.data
                            )

                        ) {

                            selectedRoleIds =
                                roleResponse.data.map(
                                    function (item) {

                                        return String(
                                            item.role_id
                                        );

                                    }
                                );

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | Init Tom Select
                        |--------------------------------------------------------------------------
                        */

                        if (
                            !initRoleSelect()
                        ) {

                            return;

                        }


                        /*
                        |--------------------------------------------------------------------------
                        | Load All Roles
                        |--------------------------------------------------------------------------
                        */

                        loadRoles(
                            selectedRoleIds
                        )


                        .always(
                            function () {

                                if (modalUser) {

                                    modalUser.show();

                                }

                            }
                        );

                    }
                )


                /*
                |--------------------------------------------------------------------------
                | Failed Get User Roles
                |--------------------------------------------------------------------------
                */

                .fail(function (xhr) {


                    console.error(

                        'Gagal mengambil role user:',

                        xhr.responseText

                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Init Tom Select
                    |--------------------------------------------------------------------------
                    */

                    if (
                        !initRoleSelect()
                    ) {

                        return;

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Load Roles
                    |--------------------------------------------------------------------------
                    */

                    loadRoles([])

                        .always(
                            function () {

                                if (modalUser) {

                                    modalUser.show();

                                }

                            }
                        );

                });

            })


            /*
            |--------------------------------------------------------------------------
            | Failed Get User
            |--------------------------------------------------------------------------
            */

            .fail(function (xhr) {


                console.error(
                    xhr.responseText
                );


                Swal.fire({

                    icon: 'error',

                    title: 'Error',

                    text:
                        'Gagal mengambil data user.'

                });

            });

        }

    );


    /*
    |--------------------------------------------------------------------------
    | Save / Update User
    |--------------------------------------------------------------------------
    */

    $('#formUser').on(

        'submit',

        function (e) {

            e.preventDefault();


            /*
            |--------------------------------------------------------------------------
            | Reset Validation
            |--------------------------------------------------------------------------
            */

            $('.form-control, .form-select')
                .removeClass(
                    'is-invalid'
                );


            $('.invalid-feedback')
                .text('');


            /*
            |--------------------------------------------------------------------------
            | User ID
            |--------------------------------------------------------------------------
            */

            const id =
                $('#user_id').val();


            let url = '';


            /*
            |--------------------------------------------------------------------------
            | Add
            |--------------------------------------------------------------------------
            */

            if (id === '') {

                url =
                    baseUrl +
                    'user/store';

            }


            /*
            |--------------------------------------------------------------------------
            | Update
            |--------------------------------------------------------------------------
            */

            else {

                url =
                    baseUrl +
                    'user/update/' +
                    id;

            }


            /*
            |--------------------------------------------------------------------------
            | FormData
            |--------------------------------------------------------------------------
            |
            | role_id[] otomatis ikut
            | dikirim sebagai array.
            |
            */

            const formData =
                new FormData(
                    document.getElementById(
                        'formUser'
                    )
                );


            /*
            |--------------------------------------------------------------------------
            | Debug
            |--------------------------------------------------------------------------
            */

            console.log(
                'Form Data:'
            );


            for (
                const [key, value]
                of formData.entries()
            ) {

                console.log(
                    key,
                    value
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Button
            |--------------------------------------------------------------------------
            */

            const btnSave =
                $('#btnSaveUser');


            const originalButton =
                btnSave.html();


            btnSave

                .prop(
                    'disabled',
                    true
                )

                .html(
                    '<span class="spinner-border spinner-border-sm me-1"></span> Saving...'
                );


            /*
            |--------------------------------------------------------------------------
            | AJAX Save
            |--------------------------------------------------------------------------
            */

            $.ajax({

                url: url,

                type: 'POST',

                data: formData,

                processData: false,

                contentType: false,

                dataType: 'json'

            })


            /*
            |--------------------------------------------------------------------------
            | Success
            |--------------------------------------------------------------------------
            */

            .done(function (response) {


                if (
                    response.status === true
                ) {


                    /*
                    |--------------------------------------------------------------------------
                    | Hide Modal
                    |--------------------------------------------------------------------------
                    */

                    if (modalUser) {

                        modalUser.hide();

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Reload DataTable
                    |--------------------------------------------------------------------------
                    */

                    tableUser.ajax.reload(
                        null,
                        false
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Success Message
                    |--------------------------------------------------------------------------
                    */

                    Swal.fire({

                        icon: 'success',

                        title: 'Success',

                        text:
                            response.message,

                        timer: 1500,

                        showConfirmButton:
                            false

                    });


                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | Error Response
                |--------------------------------------------------------------------------
                */

                Swal.fire({

                    icon: 'error',

                    title: 'Error',

                    text:
                        response.message ||
                        'Gagal menyimpan user.'

                });

            })


            /*
            |--------------------------------------------------------------------------
            | AJAX Error
            |--------------------------------------------------------------------------
            */

            .fail(function (xhr) {


                /*
                |--------------------------------------------------------------------------
                | Validation Error
                |--------------------------------------------------------------------------
                */

                if (
                    xhr.status === 422
                ) {


                    const response =
                        xhr.responseJSON;


                    if (

                        response &&

                        response.errors

                    ) {


                        $.each(

                            response.errors,

                            function (
                                field,
                                message
                            ) {


                                /*
                                |--------------------------------------------------------------------------
                                | Role Validation
                                |--------------------------------------------------------------------------
                                */

                                if (
                                    field === 'role_id'
                                ) {


                                    $('#role_id')
                                        .closest('.mb-3')
                                        .find('.invalid-feedback')
                                        .text(
                                            message
                                        );


                                    return;

                                }


                                /*
                                |--------------------------------------------------------------------------
                                | Other Validation
                                |--------------------------------------------------------------------------
                                */

                                const input =
                                    $('#' + field);


                                input.addClass(
                                    'is-invalid'
                                );


                                $('#error_' + field)
                                    .text(
                                        message
                                    );

                            }

                        );

                    }


                    Swal.fire({

                        icon: 'warning',

                        title: 'Validasi',

                        text:
                            response?.message ||
                            'Periksa kembali data yang diinput.'

                    });


                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | Other Error
                |--------------------------------------------------------------------------
                */

                console.error(

                    'Save User Error:',

                    xhr.responseText

                );


                Swal.fire({

                    icon: 'error',

                    title: 'Error',

                    text:
                        'Terjadi kesalahan saat menyimpan user.'

                });

            })


            /*
            |--------------------------------------------------------------------------
            | Always
            |--------------------------------------------------------------------------
            */

            .always(function () {


                btnSave

                    .prop(
                        'disabled',
                        false
                    )

                    .html(
                        originalButton
                    );

            });

        }

    );


    /*
    |--------------------------------------------------------------------------
    | Enable / Disable
    |--------------------------------------------------------------------------
    */

    $('#tableUser tbody').on(

        'click',

        '.btnToggleEnable',

        function () {


            const id =
                $(this).data('id');


            Swal.fire({

                title:
                    'Ubah Enable User?',

                text:
                    'Status enable user akan diubah.',

                icon:
                    'question',

                showCancelButton:
                    true,

                confirmButtonText:
                    'Ya',

                cancelButtonText:
                    'Batal'

            })


            .then(function (result) {


                if (
                    !result.isConfirmed
                ) {

                    return;

                }


                $.ajax({

                    url:
                        baseUrl +
                        'user/toggle-enable/' +
                        id,

                    type:
                        'POST',

                    dataType:
                        'json'

                })


                .done(function (response) {


                    if (
                        response.status === true
                    ) {


                        tableUser.ajax.reload(
                            null,
                            false
                        );


                        Swal.fire({

                            icon:
                                'success',

                            title:
                                'Success',

                            text:
                                response.message,

                            timer:
                                1200,

                            showConfirmButton:
                                false

                        });


                    } else {


                        Swal.fire({

                            icon:
                                'error',

                            title:
                                'Error',

                            text:
                                response.message

                        });

                    }

                })


                .fail(function (xhr) {


                    console.error(
                        xhr.responseText
                    );


                    Swal.fire({

                        icon:
                            'error',

                        title:
                            'Error',

                        text:
                            'Gagal mengubah enable user.'

                    });

                });

            });

        }

    );


    /*
    |--------------------------------------------------------------------------
    | Delete User
    |--------------------------------------------------------------------------
    */

    $('#tableUser tbody').on(

        'click',

        '.btnDeleteUser',

        function () {


            const id =
                $(this).data('id');


            Swal.fire({

                title:
                    'Delete User?',

                text:
                    'Data user akan dihapus dari daftar aktif.',

                icon:
                    'warning',

                showCancelButton:
                    true,

                confirmButtonText:
                    'Delete',

                cancelButtonText:
                    'Batal',

                confirmButtonColor:
                    '#dc3545'

            })


            .then(function (result) {


                if (
                    !result.isConfirmed
                ) {

                    return;

                }


                $.ajax({

                    url:
                        baseUrl +
                        'user/delete/' +
                        id,

                    type:
                        'POST',

                    dataType:
                        'json'

                })


                .done(function (response) {


                    if (
                        response.status === true
                    ) {


                        tableUser.ajax.reload(
                            null,
                            false
                        );


                        Swal.fire({

                            icon:
                                'success',

                            title:
                                'Deleted',

                            text:
                                response.message,

                            timer:
                                1200,

                            showConfirmButton:
                                false

                        });


                    } else {


                        Swal.fire({

                            icon:
                                'error',

                            title:
                                'Error',

                            text:
                                response.message

                        });

                    }

                })


                .fail(function (xhr) {


                    console.error(
                        xhr.responseText
                    );


                    Swal.fire({

                        icon:
                            'error',

                        title:
                            'Error',

                        text:
                            'Gagal menghapus user.'

                    });

                });

            });

        }

    );


    /*
    |--------------------------------------------------------------------------
    | Clear Validation
    |--------------------------------------------------------------------------
    */

    $('#formUser').on(

        'input change',

        '.form-control, .form-select',

        function () {

            $(this)
                .removeClass(
                    'is-invalid'
                );

        }

    );

});