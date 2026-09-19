<?php

namespace App\Models;

use CodeIgniter\Model;

class RoleModel extends Model
{
    protected $table            = 'tm_role';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useAutoIncrement = true;

    protected $allowedFields = [
        'role_code',
        'role_name',
        'description',
        'status',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date',
        'deleted_by',
        'deleted_date'
    ];

    protected $useTimestamps = true;

    protected $createdField = 'created_date';
    protected $updatedField = 'updated_date';

    /**
     * Ambil seluruh role aktif
     */
    public function getActiveRoles()
    {
        return $this->where('status', 1)
            ->orderBy('id', 'DESC')
            ->findAll();
    }

    /**
     * Ambil role aktif berdasarkan ID
     */
    public function getActiveRoleById($id)
    {
        return $this->where('id', $id)
            ->where('status', 1)
            ->first();
    }

    /**
     * Tambah role
     */
    public function createRole(array $data)
    {
        return $this->insert($data);
    }

    /**
     * Update role
     */
    public function updateRole($id, array $data)
    {
        return $this->update($id, $data);
    }

    /**
     * Soft delete role
     */
    public function deleteRole($id, array $data)
    {
        return $this->update($id, $data);
    }
}