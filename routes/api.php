<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Registers all API routes used by your frontend (React app).
| Each resource has full CRUD + a status update route.
|--------------------------------------------------------------------------
*/

// ✅ Profile API (optional)
Route::apiResource('profiles', ProfileController::class);

// ✅ Faculty API
Route::apiResource('faculties', FacultyController::class);
Route::patch('faculties/{faculty}/status', [FacultyController::class, 'updateStatus']);

// ✅ Student API
Route::apiResource('students', StudentController::class);
Route::patch('students/{student}/status', [StudentController::class, 'updateStatus']);

// ✅ Course API
Route::apiResource('courses', CourseController::class);
Route::patch('courses/{course}/status', [CourseController::class, 'updateStatus']);

// ✅ Department API
Route::apiResource('departments', DepartmentController::class);
Route::patch('departments/{department}/status', [DepartmentController::class, 'updateStatus']);

// ✅ Dashboard Counter — fetches live totals
Route::get('/dashboard-counts', function () {
    return response()->json([
        'faculties' => \App\Models\Faculty::count(),
        'students' => \App\Models\Student::count(),
        'courses' => \App\Models\Course::count(),
        'departments' => \App\Models\Department::count(),
    ]);
});

// ✅ Optional: Refresh counts endpoint after add/delete (used by React Context)
Route::get('/refresh-counts', function () {
    return response()->json([
        'faculties' => \App\Models\Faculty::count(),
        'students' => \App\Models\Student::count(),
        'courses' => \App\Models\Course::count(),
        'departments' => \App\Models\Department::count(),
    ]);
});
