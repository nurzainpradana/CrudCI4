<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\RoleModel;
use App\Models\UserRoleModel;
use App\Libraries\FastPEBLogger;

class User extends BaseController
{
    protected $userModel;
    protected $roleModel;
    protected $userRoleModel;
    protected $fastpeb_logger;


    public function __construct()
    {
        $this->userModel     = new UserModel();
        $this->roleModel     = new RoleModel();
        $this->userRoleModel = new UserRoleModel();
        $this->fastpeb_logger        = new FastPEBLogger();
    }


    /**
     * Halaman User
     */
    public function index()
    {
        $roles = $this->roleModel->getActiveRoles();

        return view('user', [
            'title' => 'User Management',
            'roles' => $roles
        ]);
    }


    /**
     * DataTable
     */
    public function data()
    {
        $users = $this->userModel->getActiveUsers();

        return $this->response->setJSON([
            'data' => $users
        ]);
    }


    /**
     * Get User
     */
    public function edit($id)
    {
        $user = $this->userModel->getActiveUser($id);

        if (!$user) {

            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'User tidak ditemukan.'
                ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $user
        ]);
    }


    /**
     * Create User
     */
    public function store()
    {
        $rules = [
            'username' => [
                'rules' => 'required|min_length[3]|max_length[50]',
                'errors' => [
                    'required'   => 'Username wajib diisi.',
                    'min_length' => 'Username minimal 3 karakter.',
                    'max_length' => 'Username maksimal 50 karakter.'
                ]
            ],

            'name' => [
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required'   => 'Nama wajib diisi.',
                    'max_length' => 'Nama maksimal 100 karakter.'
                ]
            ],

            'email' => [
                'rules' => 'required|valid_email|max_length[100]',
                'errors' => [
                    'required'    => 'Email wajib diisi.',
                    'valid_email' => 'Format email tidak valid.',
                    'max_length'  => 'Email maksimal 100 karakter.'
                ]
            ],

            'password' => [
                'rules' => 'required|min_length[6]',
                'errors' => [
                    'required'   => 'Password wajib diisi.',
                    'min_length' => 'Password minimal 6 karakter.'
                ]
            ]
        ];


        /*
         * Validasi
         */
        if (!$this->validate($rules)) {

            $username = trim(
                (string) $this->request->getPost('username')
            );

            $currentUser = session()->get('username');

            $this->fastpeb_logger->warning(
                'USER',
                'Create User',
                'Validasi user gagal.',
                $currentUser
            );

            return $this->response
                ->setStatusCode(422)
                ->setJSON([
                    'status' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $this->validator->getErrors()
                ]);
        }


        $username = trim(
            $this->request->getPost('username')
        );

        $name = trim(
            $this->request->getPost('name')
        );

        $email = trim(
            $this->request->getPost('email')
        );

        $password = $this->request->getPost('password');


        /*
         * Role
         */
        $roleIds = $this->request->getPost('role_id');

        if (!is_array($roleIds)) {
            $roleIds = [];
        }

        $roleIds = array_values(
            array_unique(
                array_filter(
                    array_map('intval', $roleIds)
                )
            )
        );


        /*
         * Cek username
         */
        if ($this->userModel->usernameExists($username)) {

            $currentUser = session()->get('username');

            $this->fastpeb_logger->warning(
                'USER',
                'Create User',
                'Username sudah digunakan: ' . $username,
                $currentUser
            );

            return $this->response
                ->setStatusCode(422)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Username sudah digunakan.'
                ]);
        }


        $currentUser = session()->get('username');


        /*
         * Data User
         */
        $data = [
            'username'     => $username,
            'name'         => $name,
            'email'        => $email,
            'password'     => password_hash(
                $password,
                PASSWORD_DEFAULT
            ),
            'enable'       => 1,
            'status'       => 1,
            'created_by'   => $currentUser,
            'created_date' => date('Y-m-d H:i:s')
        ];


        /*
         * Simpan User
         */
        $userId = $this->userModel->createUser($data);


        if (!$userId) {

            $this->fastpeb_logger->error(
                'USER',
                'Create User',
                'Gagal menyimpan user: ' . $username,
                $currentUser
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Gagal menyimpan user.'
                ]);
        }


        /*
         * Simpan Role User
         */
        $roleResult = $this->userRoleModel->replaceUserRoles(
            $userId,
            $roleIds,
            $currentUser
        );


        if (!$roleResult) {

            $this->fastpeb_logger->error(
                'USER',
                'Create User Role',
                'User berhasil dibuat tetapi role gagal disimpan. User ID: ' . $userId,
                $currentUser
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status'  => false,
                    'message' => 'User berhasil dibuat, tetapi role gagal disimpan.'
                ]);
        }


        /*
         * Logging Success
         */
        $this->fastpeb_logger->success(
            'USER',
            'Create User',
            'User berhasil ditambahkan: ' . $username,
            $currentUser
        );


        return $this->response->setJSON([
            'status'  => true,
            'message' => 'User berhasil ditambahkan.'
        ]);
    }


    /**
     * Update User
     */
    public function update($id)
    {
        $user = $this->userModel->getActiveUser($id);

        if (!$user) {

            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'User tidak ditemukan.'
                ]);
        }


        $rules = [
            'name' => [
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required'   => 'Nama wajib diisi.',
                    'max_length' => 'Nama maksimal 100 karakter.'
                ]
            ],

            'email' => [
                'rules' => 'required|valid_email|max_length[100]',
                'errors' => [
                    'required'    => 'Email wajib diisi.',
                    'valid_email' => 'Format email tidak valid.',
                    'max_length'  => 'Email maksimal 100 karakter.'
                ]
            ]
        ];


        /*
         * Validasi
         */
        if (!$this->validate($rules)) {

            $currentUser = session()->get('username');

            $this->fastpeb_logger->warning(
                'USER',
                'Update User',
                'Validasi update user gagal. User ID: ' . $id,
                $currentUser
            );

            return $this->response
                ->setStatusCode(422)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Validasi gagal.',
                    'errors'  => $this->validator->getErrors()
                ]);
        }


        $name = trim(
            $this->request->getPost('name')
        );

        $email = trim(
            $this->request->getPost('email')
        );

        $password = $this->request->getPost('password');


        /*
         * Role
         */
        $roleIds = $this->request->getPost('role_id');

        if (!is_array($roleIds)) {
            $roleIds = [];
        }

        $roleIds = array_values(
            array_unique(
                array_filter(
                    array_map('intval', $roleIds)
                )
            )
        );


        $currentUser = session()->get('username');


        /*
         * Data Update
         */
        $data = [
            'name'         => $name,
            'email'        => $email,
            'updated_by'   => $currentUser,
            'updated_date' => date('Y-m-d H:i:s')
        ];


        /*
         * Password hanya jika diisi
         */
        if (!empty($password)) {

            $data['password'] = password_hash(
                $password,
                PASSWORD_DEFAULT
            );
        }


        /*
         * Update User
         */
        $result = $this->userModel->updateUser(
            $id,
            $data
        );


        if (!$result) {

            $this->fastpeb_logger->error(
                'USER',
                'Update User',
                'Gagal memperbarui user. User ID: ' . $id,
                $currentUser
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Gagal memperbarui user.'
                ]);
        }


        /*
         * Update Role User
         */
        $roleResult = $this->userRoleModel->replaceUserRoles(
            $id,
            $roleIds,
            $currentUser
        );


        if (!$roleResult) {

            $this->fastpeb_logger->error(
                'USER',
                'Update User Role',
                'User berhasil diperbarui tetapi role gagal disimpan. User ID: ' . $id,
                $currentUser
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status'  => false,
                    'message' => 'User berhasil diperbarui, tetapi role gagal disimpan.'
                ]);
        }


        /*
         * Logging Success
         */
        $this->fastpeb_logger->success(
            'USER',
            'Update User',
            'User berhasil diperbarui: ' . $user['username'],
            $currentUser
        );


        return $this->response->setJSON([
            'status'  => true,
            'message' => 'User berhasil diperbarui.'
        ]);
    }


    /**
     * Enable / Disable User
     */
    public function toggleEnable($id)
    {
        $user = $this->userModel->getActiveUser($id);

        if (!$user) {

            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'User tidak ditemukan.'
                ]);
        }


        $currentUser = session()->get('username');

        $newEnable = ((int) $user['enable'] === 1)
            ? 0
            : 1;


        $result = $this->userModel->updateEnable(
            $id,
            $newEnable,
            $currentUser
        );


        if (!$result) {

            $this->fastpeb_logger->error(
                'USER',
                'Toggle Enable User',
                'Gagal mengubah enable user. User ID: ' . $id,
                $currentUser
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Gagal mengubah enable user.'
                ]);
        }


        $message = $newEnable === 1
            ? 'User berhasil di-enable.'
            : 'User berhasil di-disable.';


        $this->fastpeb_logger->success(
            'USER',
            'Toggle Enable User',
            $message . ' Username: ' . $user['username'],
            $currentUser
        );


        return $this->response->setJSON([
            'status' => true,
            'message' => $message,
            'enable' => $newEnable
        ]);
    }


    /**
     * Delete User
     */
    public function delete($id)
    {
        $user = $this->userModel->getActiveUser($id);

        if (!$user) {

            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'User tidak ditemukan.'
                ]);
        }


        $currentUser = session()->get('username');


        $result = $this->userModel->deleteUser(
            $id,
            $currentUser
        );


        if (!$result) {

            $this->fastpeb_logger->error(
                'USER',
                'Delete User',
                'Gagal menghapus user: ' . $user['username'],
                $currentUser
            );

            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Gagal menghapus user.'
                ]);
        }


        $this->fastpeb_logger->success(
            'USER',
            'Delete User',
            'User berhasil dihapus: ' . $user['username'],
            $currentUser
        );


        return $this->response->setJSON([
            'status'  => true,
            'message' => 'User berhasil dihapus.'
        ]);
    }


    /**
     * Get Roles
     */
    public function roles()
    {
        $roles = $this->roleModel->getActiveRoles();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $roles
        ]);
    }


    /**
     * Get User Roles
     */
    public function userRoles($id)
    {
        $user = $this->userModel->getActiveUser($id);

        if (!$user) {

            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'User tidak ditemukan.'
                ]);
        }


        $roles = $this->userRoleModel->getUserRoles($id);

        return $this->response->setJSON([
            'status' => true,
            'data'   => $roles
        ]);
    }
}