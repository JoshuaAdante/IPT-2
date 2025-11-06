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
        'middle_name',
        'last_name',
        'email',
        'date_of_birth',
        'age',
        'sex',
        'phone',
        'address',
        'photo',
        'department',
        'course',
        'year_level',
        'date_hired',
        'status',
    ];
}
