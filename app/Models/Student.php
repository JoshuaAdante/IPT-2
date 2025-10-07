<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    // Table name (optional if Laravel pluralizes correctly)
    protected $table = 'students';

    // Allow mass assignment for these fields
    protected $fillable = [
        'student_id',
        'name',
        'email',
        'department',
        'course',
        'status',
    ];
}
