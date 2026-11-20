<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Category extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'name', 'status'];

    protected $selection = ['uuid as index', 'name as category', 'status as state'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_categories(string $search = "", array $filter = [], array $sort = [], string $paginate = "yes", string $count = "no"): array|string
    {
        $query = self::select($this->selection);
        if (!empty($search)) {
            $query = $query->where("name", "like", "%$search%");
        }
        if (!empty($filter)) {
            $query = $query->where($filter);
        }
        if (!empty($sort)) {
            $query = $query->where($sort);
        }
        if ($count == "yes") {
            return $query->count();
        }
        $query = $query->orderBy("id", "desc");
        if ($paginate == "yes") {
            $query = $query->paginate(10);
        } else {
            $query = $query->get();
        }
        return $query->toArray();
    }

    public function get_category(int $id): array|string
    {
        $query = self::select($this->selection)->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_category_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function add_category(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function update_category_status(int $id, string $status): int|string
    {
        return self::where([['id', '=', $id], ['status', '!=', $status]])->update(['status' => $status]);
    }

    public function update_category(int $id, array $data): int|string
    {
        $current_data = self::find($id);
        $new_data = ($current_data != null) ? array_diff_assoc($data, $current_data->toArray()) : [];
        if (!empty($new_data)) {
            return self::where(['id' => $id])->update($new_data);
        }
        return "nnd";
    }
}
