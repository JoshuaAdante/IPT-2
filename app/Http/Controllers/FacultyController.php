<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    // ✅ List all faculties (active + archived)
    public function index()
    {
        return Faculty::orderBy('id', 'desc')->get();
    }

    // ✅ Store a new faculty
    public function store(Request $request)
    {
        $validated = $request->validate([
            'faculty_id' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:faculties,email',
            'department' => 'required|string|max:100',
            'position' => 'required|string|max:100',
            'status' => 'required|string|max:20',
        ]);

        $faculty = Faculty::create($validated);

        return response()->json([
            'message' => '✅ Faculty created successfully!',
            'faculty' => $faculty
        ], 201);
    }

    // ✅ Show specific faculty
    public function show(Faculty $faculty)
    {
        return response()->json($faculty);
    }

    // ✅ Update faculty
    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'faculty_id' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:faculties,email,' . $faculty->id,
            'department' => 'required|string|max:100',
            'position' => 'required|string|max:100',
            'status' => 'required|string|max:20',
        ]);

        $faculty->update($validated);

        return response()->json([
            'message' => '✅ Faculty updated successfully!',
            'faculty' => $faculty
        ]);
    }

    // ✅ Delete faculty (permanent)
    public function destroy(Faculty $faculty)
    {
        $faculty->delete();
        return response()->json(['message' => 'Faculty deleted permanently']);
    }

    // ✅ Update faculty status (Active/Inactive/Archived)
    public function updateStatus(Request $request, Faculty $faculty)
    {
        $data = $request->validate([
            'status' => 'required|in:Active,Inactive,Archived',
        ]);

        $faculty->update(['status' => $data['status']]);
        return response()->json(['message' => 'Faculty status updated', 'faculty' => $faculty]);
    }

    // 🆕 Archive a faculty (soft delete)
    public function archive(Faculty $faculty)
    {
        $faculty->update(['status' => 'Archived']);
        return response()->json(['message' => 'Faculty archived successfully', 'faculty' => $faculty]);
    }

    // 🆕 Restore a faculty
    public function restore(Faculty $faculty)
    {
        $faculty->update(['status' => 'Active']);
        return response()->json(['message' => 'Faculty restored successfully', 'faculty' => $faculty]);
    }
}
