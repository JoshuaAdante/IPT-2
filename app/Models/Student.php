<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'student_id',
        'name',
        'first_name',
        'last_name',
        'email',
        'date_of_birth',
        'department',
        'course',
        'year_level',
        'status',
        // Home Address
        'street_address',
        'street_address_line2',
        'city',
        'state_province',
        'postal_code',
        // Emergency Contact
        'emergency_contact_first_name',
        'emergency_contact_last_name',
        'emergency_contact_relationship',
        'emergency_contact_email',
        'emergency_contact_phone',
        // Parent/Guardian
        'parent_guardian_first_name',
        'parent_guardian_last_name',
        'parent_guardian_relationship',
        'parent_guardian_phone',
        'parent_guardian_email',
        // Educational Background
        'previous_school',
        'grade_level',
        'previous_student_id',
        'special_needs',
    ];
}
