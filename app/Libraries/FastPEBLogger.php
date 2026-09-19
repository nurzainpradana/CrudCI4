<?php

namespace App\Libraries;

use App\Models\LogHistoryModel;

class FastPEBLogger
{
    protected $logModel;

    public function __construct()
    {
        $this->logModel = new LogHistoryModel();
    }

    public function log(
        $module,
        $description,
        $status,
        $message,
        $username = null
    ) {
        return $this->logModel->insert([
            'username'    => $username,
            'module'      => $module,
            'description' => $description,
            'status'      => $status,
            'message'     => $message,
            'created_by'  => $username
        ]);
    }

    public function success(
        $module,
        $description,
        $message,
        $username = null
    ) {
        return $this->log(
            $module,
            $description,
            'SUCCESS',
            $message,
            $username
        );
    }

    public function error(
        $module,
        $description,
        $message,
        $username = null
    ) {
        return $this->log(
            $module,
            $description,
            'ERROR',
            $message,
            $username
        );
    }

    public function warning(
        $module,
        $description,
        $message,
        $username = null
    ) {
        return $this->log(
            $module,
            $description,
            'WARNING',
            $message,
            $username
        );
    }
}