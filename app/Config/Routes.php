<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');
$routes->get('post', 'Post::index');
$routes->get('post/create', 'Post::create');
$routes->get('/post/edit/(:num)', 'Post::edit/$1');
$routes->get('/post/edit/(:num)', 'Post::edit/$1');
$routes->post('/post/update/(:num)', 'Post::update/$1');
$routes->post('/post/store', 'Post::store');
$routes->get('/post/delete/(:num)', 'Post::delete/$1');


/** USER */
$routes->get('user', 'User::index');

$routes->get('user/data', 'User::data');

$routes->get('user/edit/(:num)', 'User::edit/$1');

$routes->post('user/store', 'User::store');

$routes->post('user/update/(:num)', 'User::update/$1');

$routes->post(
    'user/toggle-enable/(:num)',
    'User::toggleEnable/$1'
);

$routes->post(
    'user/delete/(:num)',
    'User::delete/$1'
);

$routes->get(
    'user/roles',
    'User::roles'
);

$routes->get(
    'user/user-roles/(:num)',
    'User::userRoles/$1'
);

$routes->post(
    'user/save-roles/(:num)',
    'User::saveRoles/$1'
);


/** ROLE */
$routes->get('/role', 'Role::index');
$routes->get('/role/data', 'Role::data');
$routes->get('/role/edit/(:num)', 'Role::edit/$1');
$routes->post('/role/store', 'Role::store');
$routes->post('/role/update/(:num)', 'Role::update/$1');
$routes->post('/role/delete/(:num)', 'Role::delete/$1');


/** AUTH */

$routes->get('/', 'Auth::index');

$routes->get('login', 'Auth::index');
$routes->post('login', 'Auth::login');

$routes->get('logout', 'Auth::logout');

$routes->get('dashboard', 'Home::index');