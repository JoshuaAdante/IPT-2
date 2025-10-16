<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // 🧩 Show all students (active + archived)
    public function index()
    {
        return response()->json(Student::all());
    }

    // ➕ Add new student
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
        return response()->json([
            'message' => '✅ Student added successfully!',
            'student' => $student
        ], 201);
    }

    // ✏️ Update existing student
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
        return response()->json([
            'message' => '✅ Student updated successfully!',
            'student' => $student
        ]);
    }

    // ❌ Permanently delete (optional, not used in your UI)
    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(['message' => '🗑️ Student deleted successfully']);
    }

    // 🔁 Update student status (Active, Inactive, Archived)
    public function updateStatus(Request $request, Student $student)
    {
        $data = $request->validate([
            'status' => 'required|in:Active,Inactive,Archived',
        ]);

        $student->update(['status' => $data['status']]);
        return response()->json([
            'message' => 'Status updated successfully',
            'student' => $student
        ]);
    }

    // 📦 Archive student
    public function archive(Student $student)
    {
        $student->update(['status' => 'Archived']);
        return response()->json([
            'message' => '📦 Student archived successfully',
            'student' => $student
        ]);
    }

    // 🔄 Restore student
    public function restore(Student $student)
    {
        $student->update(['status' => 'Active']);
        return response()->json([
            'message' => '✅ Student restored successfully',
            'student' => $student
        ]);
    }
}
