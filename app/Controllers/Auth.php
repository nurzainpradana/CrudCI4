<?php

namespace App\Controllers;

use App\Models\AuthModel;

class Auth extends BaseController
{
    protected $authModel;

    public function __construct()
    {
        $this->authModel = new AuthModel();
    }

    /**
     * Halaman Login
     */
    public function index()
    {
        // Jika sudah login
        if (session()->get('fastpeb_sess_logged_in')) {
            return redirect()->to('/dashboard');
        }

        return view('auth/login');
    }

    /**
     * Proses Login
     */
    public function login()
    {
        $username = trim((string) $this->request->getPost('username'));
        $password = (string) $this->request->getPost('password');

        // Validasi input
        if ($username === '' || $password === '') {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Username dan password wajib diisi.');
        }

        // Cari user berdasarkan username
        $user = $this->authModel->getUserByUsername($username);

        // User tidak ditemukan
        if (!$user) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Username atau password salah.');
        }

        // User disabled
        if ((int) $user['enable'] !== 1) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'User tidak aktif.');
        }

        // User sudah di-delete
        if (isset($user['status']) && (int) $user['status'] !== 1) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'User tidak ditemukan.');
        }

        // Cek password
        if (!password_verify($password, $user['password'])) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Username atau password salah.');
        }

        // Regenerate session
        session()->regenerate(true);

        // Simpan session
        session()->set([
            'fastpeb_sess_logged_in' => true,
            'fastpeb_sess_username'   => $user['username'],
            'fastpeb_sess_name'       => $user['name'] ?? '',
            'fastpeb_sess_role_id'    => $user['role_id'] ?? null,
        ]);

        return redirect()->to('/dashboard');
    }

    /**
     * Logout
     */
    public function logout()
    {
        session()->destroy();

        return redirect()
            ->to('/login')
            ->with('success', 'Anda berhasil logout.');
    }
}