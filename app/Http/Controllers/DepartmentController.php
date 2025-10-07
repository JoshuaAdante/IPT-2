<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department_code' => 'required|string|max:50|unique:departments,department_code',
            'department_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'status' => 'required|string|in:Active,Inactive,Archived',
        ]);

        $department = Department::create($data);
        return response()->json($department, 201);
    }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'department_code' => 'required|string|max:50|unique:departments,department_code,' . $department->id,
            'department_name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'status' => 'required|string|in:Active,Inactive,Archived',
        ]);

        $department->update($data);
        return response()->json($department);
    }

    public function destroy(Department $department)
    {
        $department->delete();
        return response()->json(['message' => 'Department deleted successfully']);
    }

    public function updateStatus(Request $request, Department $department)
    {
        $data = $request->validate([
            'status' => 'required|in:Active,Inactive,Archived',
        ]);

        $department->update(['status' => $data['status']]);
        return response()->json($department);
    }
}
