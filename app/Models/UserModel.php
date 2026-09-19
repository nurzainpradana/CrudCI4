<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'tm_user';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useAutoIncrement = true;

    protected $allowedFields = [
        'username',
        'name',
        'email',
        'password',
        'enable',
        'status',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date',
        'deleted_by',
        'deleted_date'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_date';
    protected $updatedField  = 'updated_date';


    /**
     * Get semua user yang belum soft delete
     */
    public function getActiveUsers()
    {
        return $this->db->table('tm_user u')
            ->select("
            u.id,
            u.username,
            u.name,
            u.email,
            u.enable,
            u.status,
            GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ', ') AS role_name
        ")
            ->join(
                'tm_user_role ur',
                'ur.user_id = u.id and ur.status = 1',
                'left'
            )
            ->join(
                'tm_role r',
                'r.id = ur.role_id',
                'left'
            )
            ->where('u.status', 1)
            ->groupBy([
                'u.id',
                'u.username',
                'u.name',
                'u.email',
                'u.enable',
                'u.status'
            ])
            ->orderBy('u.id', 'DESC')
            ->get()
            ->getResultArray();
    }


    /**
     * Get user berdasarkan ID
     * Hanya user yang belum soft delete
     */
    public function getActiveUser($id)
    {
        return $this->where('id', $id)
            ->where('status', 1)
            ->first();
    }


    /**
     * Cek username sudah digunakan atau belum
     */
    public function usernameExists($username, $excludeId = null)
    {
        $builder = $this->where('username', $username)
            ->where('status', 1);

        if ($excludeId !== null) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }


    /**
     * Create user
     */
    public function createUser(array $data)
    {
        return $this->insert($data);
    }


    /**
     * Update user
     */
    public function updateUser($id, array $data)
    {
        return $this->update($id, $data);
    }


    /**
     * Enable / Disable user
     */
    public function updateEnable($id, $enable, $username)
    {
        return $this->update($id, [
            'enable'       => $enable,
            'updated_by'   => $username,
            'updated_date' => date('Y-m-d H:i:s')
        ]);
    }


    /**
     * Soft Delete
     *
     * status = 0
     */
    public function softDelete($id, $username)
    {
        return $this->update($id, [
            'status'       => 0,
            'deleted_by'   => $username,
            'deleted_date' => date('Y-m-d H:i:s'),
            'updated_by'   => $username,
            'updated_date' => date('Y-m-d H:i:s')
        ]);
    }
}
