<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    // Table name (optional if Laravel pluralizes correctly)
    protected $table = 'faculties';

    // Allow mass assignment for these fields
    protected $fillable = [
        'faculty_id',
        'employee_id',
        'name',
        'first_name',
        'last_name',
        'email',
        'personal_email',
        'department',
        'position',
        'title',
        'age',
        'phone',
        'faculty_rank',
        'office_location',
        'username',
        'password',
        'photo',
        'employment_type',
        'date_of_joining',
        'date_hired',
        'status',
        // Contact Details
        'office_address',
        'office_phone',
        'mobile_phone',
        // Academic Qualifications
        'highest_degree',
        'field_of_study',
        'awarding_institution',
        'year_awarded',
        // Professional Information
        'teaching_subjects',
        'research_interests',
        'publications',
        'professional_experience',
        'achievements_awards',
    ];

    // Hide password from JSON responses
    protected $hidden = [
        'password',
    ];
}
