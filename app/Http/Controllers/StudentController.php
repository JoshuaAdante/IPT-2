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
            'name' => 'nullable|string|max:100',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:students,email',
            'date_of_birth' => 'nullable|date',
            'course' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'year_level' => 'required|string|max:20',
            'status' => 'nullable|string|max:20',
            // Home Address
            'street_address' => 'nullable|string|max:255',
            'street_address_line2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state_province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            // Emergency Contact
            'emergency_contact_first_name' => 'nullable|string|max:100',
            'emergency_contact_last_name' => 'nullable|string|max:100',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'emergency_contact_email' => 'nullable|email',
            'emergency_contact_phone' => 'nullable|string|max:20',
            // Parent/Guardian
            'parent_guardian_first_name' => 'required|string|max:100',
            'parent_guardian_last_name' => 'required|string|max:100',
            'parent_guardian_relationship' => 'nullable|string|max:100',
            'parent_guardian_phone' => 'nullable|string|max:20',
            'parent_guardian_email' => 'nullable|email',
            // Educational Background
            'previous_school' => 'nullable|string|max:255',
            'grade_level' => 'nullable|string|max:50',
            'previous_student_id' => 'nullable|string|max:50',
            'special_needs' => 'nullable|string',
        ]);

        // Auto-generate Student ID
        $year = date('Y');
        $lastStudent = Student::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();
        
        if ($lastStudent && preg_match('/STU-' . $year . '-(\d+)/', $lastStudent->student_id, $matches)) {
            $lastNumber = intval($matches[1]);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }
        
        $data['student_id'] = 'STU-' . $year . '-' . $newNumber;
        
        // Combine first and last name for the name field
        $data['name'] = trim($data['first_name'] . ' ' . $data['last_name']);
        
        // Set default status if not provided
        if (!isset($data['status'])) {
            $data['status'] = 'Active';
        }

        $student = Student::create($data);

        return response()->json([
            'message' => '✅ Student added successfully!',
            'student' => $student
        ], 201);
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'student_id' => 'nullable|string|max:50',
            'name' => 'nullable|string|max:100',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'date_of_birth' => 'nullable|date',
            'course' => 'required|string|max:100',
            'department' => 'required|string|max:100',
            'year_level' => 'required|string|max:20',
            'status' => 'nullable|string|max:20',
            // Home Address
            'street_address' => 'nullable|string|max:255',
            'street_address_line2' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state_province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            // Emergency Contact
            'emergency_contact_first_name' => 'nullable|string|max:100',
            'emergency_contact_last_name' => 'nullable|string|max:100',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'emergency_contact_email' => 'nullable|email',
            'emergency_contact_phone' => 'nullable|string|max:20',
            // Parent/Guardian
            'parent_guardian_first_name' => 'required|string|max:100',
            'parent_guardian_last_name' => 'required|string|max:100',
            'parent_guardian_relationship' => 'nullable|string|max:100',
            'parent_guardian_phone' => 'nullable|string|max:20',
            'parent_guardian_email' => 'nullable|email',
            // Educational Background
            'previous_school' => 'nullable|string|max:255',
            'grade_level' => 'nullable|string|max:50',
            'previous_student_id' => 'nullable|string|max:50',
            'special_needs' => 'nullable|string',
        ]);

        // Update combined name field
        $data['name'] = trim($data['first_name'] . ' ' . $data['last_name']);

        $student->update($data);

        return response()->json([
            'message' => '✅ Student updated successfully!',
            'student' => $student
        ]);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(['message' => '🗑️ Student deleted successfully']);
    }

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

    public function archive(Student $student)
    {
        $student->update(['status' => 'Archived']);
        return response()->json([
            'message' => '📦 Student archived successfully',
            'student' => $student
        ]);
    }

    public function restore(Student $student)
    {
        $student->update(['status' => 'Active']);
        return response()->json([
            'message' => '✅ Student restored successfully',
            'student' => $student
        ]);
    }
}
