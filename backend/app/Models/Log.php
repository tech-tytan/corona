<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Log extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'total', 'description', 'user_id'];

    protected $selection = ['logs.uuid as index', 'total as sum', 'description as desc', 'logs.created_at as date_time', 'fname as first_name', 'lname as last_name'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_logs(array $filter = [], array $sort = [], string $raw = "", array $values = [], string $count = "no"): array|string
    {
        $query = self::select($this->selection)->join("users", "user_id", "=", "users.id");
        if (!empty($filter)) {
            $query = $query->where($filter);
        }
        if (!empty($sort)) {
            $query = $query->where($sort);
        }
        if (!empty($raw)) {
            $query = $query->whereRaw($raw, $values);
        }
        if ($count == "yes") {
            return $query->count();
        }
        return $query->orderBy("logs.id", "desc")->paginate(10)->toArray();
    }

    public function add_log(array $data): int|string
    {
        return self::create($data)->id;
    }
}
