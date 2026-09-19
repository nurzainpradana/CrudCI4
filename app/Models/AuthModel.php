<?php

namespace App\Models;

use CodeIgniter\Model;

class AuthModel extends Model
{
    protected $table      = 'tm_user';
    protected $primaryKey = 'username';

    protected $returnType = 'array';

    /**
     * Ambil user berdasarkan username
     */
    public function getUserByUsername(string $username): ?array
    {
        return $this->where('username', $username)
                    ->first();
    }
}