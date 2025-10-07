<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'course_code' => 'required|string|max:50|unique:courses,course_code',
            'course_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'status' => 'required|string|in:Active,Inactive,Archived',
        ]);

        $course = Course::create($data);
        return response()->json($course, 201);
    }

    public function update(Request $request, Course $course)
    {
        $data = $request->validate([
            'course_code' => 'required|string|max:50|unique:courses,course_code,' . $course->id,
            'course_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'status' => 'required|string|in:Active,Inactive,Archived',
        ]);

        $course->update($data);
        return response()->json($course);
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json(['message' => 'Course deleted successfully']);
    }

    public function updateStatus(Request $request, Course $course)
    {
        $data = $request->validate([
            'status' => 'required|in:Active,Inactive,Archived',
        ]);

        $course->update(['status' => $data['status']]);
        return response()->json($course);
    }
}
