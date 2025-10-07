<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Student;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function counts()
    {
        return response()->json([
            'faculties'   => Faculty::count(),
            'students'    => Student::count(),
            'courses'     => Course::count(),
            'departments' => Department::count(),
        ]);
    }
}
