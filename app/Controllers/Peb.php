<?php

namespace App\Controllers;

class Peb extends BaseController
{
    public function index(): string
    {
        return view('peb/index');
    }
}
