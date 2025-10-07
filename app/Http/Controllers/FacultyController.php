<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index()
    {
        return response()->json(Faculty::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'faculty_id' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:faculties,email',
            'department' => 'required|string|max:100',
            'position' => 'required|string|max:100',
            'status' => 'required|string|max:20',
        ]);

        $faculty = Faculty::create($data);
        return response()->json($faculty, 201);
    }

    public function update(Request $request, Faculty $faculty)
    {
        $data = $request->validate([
            'faculty_id' => 'required|string|max:50',
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:faculties,email,' . $faculty->id,
            'department' => 'required|string|max:100',
            'position' => 'required|string|max:100',
            'status' => 'required|string|max:20',
        ]);

        $faculty->update($data);
        return response()->json($faculty);
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->delete();
        return response()->json(['message' => 'Faculty deleted successfully']);
    }

    public function updateStatus(Request $request, Faculty $faculty)
    {
        $data = $request->validate([
            'status' => 'required|in:Active,Inactive,Archived',
        ]);

        $faculty->update(['status' => $data['status']]);
        return response()->json(['message' => 'Faculty status updated', 'faculty' => $faculty]);
    }
}
