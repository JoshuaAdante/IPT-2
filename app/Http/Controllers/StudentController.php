<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:students,email',
            'course' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'status' => 'required|string|max:20',
        ]);

        $student = Student::create($data);
        return response()->json($student, 201);
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'student_id' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'course' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'status' => 'required|string|max:20',
        ]);

        $student->update($data);
        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(['message' => 'Student deleted successfully']);
    }

    public function updateStatus(Request $request, Student $student)
    {
        $data = $request->validate([
            'status' => 'required|in:Active,Inactive,Archived',
        ]);

        $student->update(['status' => $data['status']]);
        return response()->json(['message' => 'Student status updated', 'student' => $student]);
    }
}
