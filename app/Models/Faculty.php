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
        'name',
        'email',
        'department',
        'position',
        'status',
    ];
}
