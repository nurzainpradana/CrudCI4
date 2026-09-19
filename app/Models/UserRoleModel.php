<?php

namespace App\Models;

use CodeIgniter\Model;

class UserRoleModel extends Model
{
    protected $table      = 'tm_user_role';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'guid',
        'user_id',
        'role_id',
        'status',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date',
        'deleted_by',
        'deleted_date'
    ];

    protected $useTimestamps = false;


    // ==============================
    // GET USER ROLE
    // ==============================

    public function getUserRoles($userId)
    {
        return $this
            ->select('role_id')
            ->where('user_id', $userId)
            ->where('status', 1)
            ->findAll();
    }


    // ==============================
    // GET USER ROLE DETAILS
    // ==============================

    public function getUserRoleDetails($userId)
    {
        return $this
            ->select('
                tm_user_role.id,
                tm_user_role.user_id,
                tm_user_role.role_id,
                tm_role.role_code,
                tm_role.role_name
            ')
            ->join(
                'tm_role',
                'tm_role.id = tm_user_role.role_id'
            )
            ->where('tm_user_role.user_id', $userId)
            ->where('tm_user_role.status', 1)
            ->where('tm_role.status', 1)
            ->orderBy('tm_role.role_name', 'ASC')
            ->findAll();
    }


    // ==============================
    // REPLACE USER ROLE
    // ==============================

    public function replaceUserRoles(
        $userId,
        array $roleIds,
        $username
    ) {
        $db = $this->db;

        $now = date('Y-m-d H:i:s');

        $db->transStart();

        /*
     * Pastikan role ID integer dan unik
     */
        $roleIds = array_values(
            array_unique(
                array_filter(
                    array_map('intval', $roleIds)
                )
            )
        );


        /*
     * 1. Nonaktifkan semua role aktif user
     */
        $db->table('tm_user_role')
            ->where('user_id', $userId)
            ->where('status', 1)
            ->update([
                'status'       => 0,
                'deleted_by'   => $username,
                'deleted_date' => $now
            ]);


        /*
     * 2. Proses role yang dipilih
     */
        foreach ($roleIds as $roleId) {

            /*
         * Cari apakah kombinasi user_id + role_id
         * sudah pernah ada
         */
            $existing = $db->table('tm_user_role')
                ->where('user_id', $userId)
                ->where('role_id', $roleId)
                ->get()
                ->getRowArray();


            if ($existing) {

                /*
             * Sudah pernah ada
             * → aktifkan kembali
             */
                $db->table('tm_user_role')
                    ->where('id', $existing['id'])
                    ->update([
                        'status'       => 1,
                        'updated_by'   => $username,
                        'updated_date' => $now,
                        'deleted_by'   => null,
                        'deleted_date' => null
                    ]);
            } else {

                /*
             * Belum pernah ada
             * → INSERT baru
             */
                $db->table('tm_user_role')
                    ->insert([
                        'user_id'      => $userId,
                        'role_id'      => $roleId,
                        'status'       => 1,
                        'created_by'   => $username,
                        'created_date' => $now
                    ]);
            }
        }


        $db->transComplete();

        return $db->transStatus();
    }
}
