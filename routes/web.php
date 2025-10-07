<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // Laravel default page
});

Route::get('/dashboard', function () {
    return view('app'); // React app.blade.php
});
