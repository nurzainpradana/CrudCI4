<?php

namespace App\Controllers;

use App\Models\RoleModel;
use App\Libraries\FastPEBLogger;

class Role extends BaseController
{
    protected $roleModel;
    protected $fastLogger;

    public function __construct()
    {
        $this->roleModel = new RoleModel();
        $this->fastLogger    = new FastPEBLogger();
    }

    public function index()
    {
        return view('role/list', [
            'title' => 'Role Management'
        ]);
    }

    public function data()
    {
        $roles = $this->roleModel->getActiveRoles();

        return $this->response->setJSON([
            'data' => $roles
        ]);
    }

    public function edit($id)
    {
        $role = $this->roleModel->getActiveRoleById($id);

        if (!$role) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Data role tidak ditemukan.'
                ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $role
        ]);
    }

    public function store()
    {
        $rules = [
            'role_code' => [
                'rules' => 'required|min_length[2]|max_length[50]|is_unique[tm_role.role_code]',
                'errors' => [
                    'required'   => 'Role code wajib diisi.',
                    'min_length' => 'Role code minimal 2 karakter.',
                    'max_length' => 'Role code maksimal 50 karakter.',
                    'is_unique'  => 'Role code sudah digunakan.'
                ]
            ],
            'role_name' => [
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required'   => 'Nama role wajib diisi.',
                    'max_length' => 'Nama role maksimal 100 karakter.'
                ]
            ],
            'description' => [
                'rules' => 'permit_empty|max_length[255]',
                'errors' => [
                    'max_length' => 'Description maksimal 255 karakter.'
                ]
            ]
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(422)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Validasi gagal.',
                    'errors'  => $this->validator->getErrors()
                ]);
        }

        $roleCode = strtoupper(
            trim($this->request->getPost('role_code'))
        );

        $data = [
            'role_code'   => $roleCode,
            'role_name'   => trim($this->request->getPost('role_name')),
            'description' => trim($this->request->getPost('description')),
            'status'      => 1,
            'created_by'  => 'system'
        ];

        $this->roleModel->createRole($data);

        $this->fastLogger->success(
            'role',
            'CREATE ROLE',
            'Role ' . $roleCode . ' berhasil dibuat.',
            'system'
        );

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Role berhasil ditambahkan.'
        ]);
    }

    public function update($id)
    {
        $role = $this->roleModel->getActiveRoleById($id);

        if (!$role) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Data role tidak ditemukan.'
                ]);
        }

        $rules = [
            'role_code' => [
                'rules' => 'required|max_length[50]|is_unique[tm_role.role_code,id,' . $id . ']',
                'errors' => [
                    'required'   => 'Role code wajib diisi.',
                    'max_length' => 'Role code maksimal 50 karakter.',
                    'is_unique'  => 'Role code sudah digunakan.'
                ]
            ],
            'role_name' => [
                'rules' => 'required|max_length[100]',
                'errors' => [
                    'required'   => 'Nama role wajib diisi.',
                    'max_length' => 'Nama role maksimal 100 karakter.'
                ]
            ],
            'description' => [
                'rules' => 'permit_empty|max_length[255]',
                'errors' => [
                    'max_length' => 'Description maksimal 255 karakter.'
                ]
            ]
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(422)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Validasi gagal.',
                    'errors'  => $this->validator->getErrors()
                ]);
        }

        $roleCode = strtoupper(
            trim($this->request->getPost('role_code'))
        );

        $data = [
            'role_code'    => $roleCode,
            'role_name'    => trim($this->request->getPost('role_name')),
            'description'  => trim($this->request->getPost('description')),
            'updated_by'   => 'system',
            'updated_date' => date('Y-m-d H:i:s')
        ];

        $this->roleModel->updateRole($id, $data);

        $this->fastLogger->success(
            'role',
            'UPDATE ROLE',
            'Role ' . $roleCode . ' berhasil diubah.',
            'system'
        );

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Role berhasil diubah.'
        ]);
    }

    public function delete($id)
    {
        $role = $this->roleModel->getActiveRoleById($id);

        if (!$role) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Data role tidak ditemukan.'
                ]);
        }

        $data = [
            'status'       => 0,
            'deleted_by'   => 'system',
            'deleted_date' => date('Y-m-d H:i:s')
        ];

        $this->roleModel->deleteRole($id, $data);

        $this->fastLogger->success(
            'role',
            'DELETE ROLE',
            'Role ' . $role['role_code'] . ' berhasil dihapus.',
            'system'
        );

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Role berhasil dihapus.'
        ]);
    }
}
