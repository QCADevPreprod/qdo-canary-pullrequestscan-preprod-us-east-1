<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;

class Flight extends Model
{
    protected $primaryKey = 'flight_id';

    // ruleid: php-laravel-dangerous-model-construction
    protected $guarded = [];

	 // ok: php-laravel-dangerous-model-construction
	 public $table = 'user';

	// ok: php-laravel-dangerous-model-construction
	 protected $guarded = ['name', 'email'];
}
