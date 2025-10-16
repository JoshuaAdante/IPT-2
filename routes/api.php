<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All backend endpoints for your React frontend.
| Includes CRUD, Archive, Restore, and Dashboard Count logic.
|--------------------------------------------------------------------------
*/

// ✅ Profiles (optional)
Route::apiResource('profiles', ProfileController::class);

// ✅ Faculties CRUD
Route::apiResource('faculties', FacultyController::class);
Route::patch('faculties/{faculty}/status', [FacultyController::class, 'updateStatus']);
Route::patch('faculties/{faculty}/archive', [FacultyController::class, 'archive']);
Route::patch('faculties/{faculty}/restore', [FacultyController::class, 'restore']);

// ✅ Students CRUD
Route::apiResource('students', StudentController::class);
Route::patch('students/{student}/status', [StudentController::class, 'updateStatus']);
Route::patch('students/{student}/archive', [StudentController::class, 'archive']);
Route::patch('students/{student}/restore', [StudentController::class, 'restore']);

// ✅ Dashboard Counters
Route::get('/dashboard-counts', function () {
    $facultyCount = \App\Models\Faculty::where('status', 'Active')->count();
    $studentCount = \App\Models\Student::where('status', 'Active')->count();

    $departmentCount = DB::table('faculties')
        ->where('status', 'Active')
        ->distinct('department')
        ->count('department');

    $courseCount = DB::table('students')
        ->where('status', 'Active')
        ->distinct('course')
        ->count('course');

    return response()->json([
        'faculties' => $facultyCount,
        'students' => $studentCount,
        'departments' => $departmentCount,
        'courses' => $courseCount,
    ]);
});

// ✅ Optional: Quick refresh route (used by React Context)
Route::get('/refresh-counts', function () {
    $facultyCount = \App\Models\Faculty::where('status', 'Active')->count();
    $studentCount = \App\Models\Student::where('status', 'Active')->count();

    $departmentCount = DB::table('faculties')
        ->where('status', 'Active')
        ->distinct('department')
        ->count('department');

    $courseCount = DB::table('students')
        ->where('status', 'Active')
        ->distinct('course')
        ->count('course');

    return response()->json([
        'faculties' => $facultyCount,
        'students' => $studentCount,
        'departments' => $departmentCount,
        'courses' => $courseCount,
    ]);
});