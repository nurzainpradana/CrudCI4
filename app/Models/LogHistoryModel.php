<?php

namespace App\Models;

use CodeIgniter\Model;

class LogHistoryModel extends Model
{
    protected $table      = 'td_log_history';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'guid',
        'logtime',
        'username',
        'module',
        'description',
        'status',
        'message',
        'created_by',
        'created_date',
        'updated_by',
        'updated_date',
        'deleted_by',
        'deleted_date'
    ];

    protected $useTimestamps = false;
}