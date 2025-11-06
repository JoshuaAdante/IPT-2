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
            'name' => 'nullable|string|max:100',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'employee_id' => 'nullable|string|max:50',
            'email' => 'required|email|unique:faculties,email',
            'personal_email' => 'nullable|email',
            'department' => 'required|string|max:100',
            'position' => 'nullable|string|max:100',
            // Enhanced Fields
            'title' => 'nullable|string|max:10', // Mr., Ms., Dr., Prof.
            'age' => 'nullable|integer|min:22|max:70',
            'phone' => 'nullable|string|max:20',
            'faculty_rank' => 'nullable|string|max:100', // Professor, Associate Professor, etc.
            'username' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:6',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'employment_type' => 'required|string|max:50',
            'date_of_joining' => 'nullable|date',
            'date_hired' => 'nullable|date',
            'status' => 'nullable|string|max:20',
            // Contact Details
            'office_address' => 'nullable|string|max:255',
            'office_phone' => 'nullable|string|max:20',
            'mobile_phone' => 'nullable|string|max:20',
            // Academic Qualifications
            'highest_degree' => 'nullable|string|max:100',
            'field_of_study' => 'nullable|string|max:255',
            'awarding_institution' => 'nullable|string|max:255',
            'year_awarded' => 'nullable|string|max:10',
            // Professional Information
            'teaching_subjects' => 'nullable|string',
            'research_interests' => 'nullable|string',
            'publications' => 'nullable|string',
            'professional_experience' => 'nullable|string',
            'achievements_awards' => 'nullable|string',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoName = time() . '_' . $photo->getClientOriginalName();
            $photo->storeAs('public/faculty_photos', $photoName);
            $validated['photo'] = 'storage/faculty_photos/' . $photoName;
        }

        // Hash password
        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        // Auto-generate Faculty ID
        $year = date('Y');
        $lastFaculty = Faculty::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();
        
        if ($lastFaculty && preg_match('/FAC-' . $year . '-(\d+)/', $lastFaculty->faculty_id, $matches)) {
            $lastNumber = intval($matches[1]);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }
        
        $validated['faculty_id'] = 'FAC-' . $year . '-' . $newNumber;
        
        // Combine first and last name for the name field
        $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);
        
        // Set default status if not provided
        if (!isset($validated['status'])) {
            $validated['status'] = 'Active';
        }

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
            'faculty_id' => 'nullable|string|max:50',
            'name' => 'nullable|string|max:100',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'employee_id' => 'nullable|string|max:50',
            'email' => 'required|email|unique:faculties,email,' . $faculty->id,
            'personal_email' => 'nullable|email',
            'department' => 'required|string|max:100',
            'position' => 'nullable|string|max:100',
            // Enhanced Fields
            'title' => 'nullable|string|max:10',
            'age' => 'nullable|integer|min:22|max:70',
            'phone' => 'nullable|string|max:20',
            'faculty_rank' => 'nullable|string|max:100',
            'username' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:6',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'employment_type' => 'required|string|max:50',
            'date_of_joining' => 'nullable|date',
            'date_hired' => 'nullable|date',
            'status' => 'nullable|string|max:20',
            // Contact Details
            'office_address' => 'nullable|string|max:255',
            'office_phone' => 'nullable|string|max:20',
            'mobile_phone' => 'nullable|string|max:20',
            // Academic Qualifications
            'highest_degree' => 'nullable|string|max:100',
            'field_of_study' => 'nullable|string|max:255',
            'awarding_institution' => 'nullable|string|max:255',
            'year_awarded' => 'nullable|string|max:10',
            // Professional Information
            'teaching_subjects' => 'nullable|string',
            'research_interests' => 'nullable|string',
            'publications' => 'nullable|string',
            'professional_experience' => 'nullable|string',
            'achievements_awards' => 'nullable|string',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoName = time() . '_' . $photo->getClientOriginalName();
            $photo->storeAs('public/faculty_photos', $photoName);
            $validated['photo'] = 'storage/faculty_photos/' . $photoName;
            
            // Delete old photo if exists
            if ($faculty->photo && file_exists(public_path($faculty->photo))) {
                unlink(public_path($faculty->photo));
            }
        }

        // Hash password only if provided
        if (isset($validated['password']) && !empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']); // Don't update password if not provided
        }

        // Update combined name field
        $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);

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
