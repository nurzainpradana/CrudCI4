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
