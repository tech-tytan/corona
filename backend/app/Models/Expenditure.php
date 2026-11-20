<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Expenditure extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'name', 'amount', 'is_deleted'];

    protected $selection = ['uuid as index', 'name as expenditure', 'amount as amount_spent', 'is_deleted as deleted', 'created_at as timestamp'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_expenditures(string $search = "", array $filter = [], array $sort = [], string $raw = "", array $values = [], string $count = "no"): array|string
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
        if (!empty($raw)) {
            $query = $query->whereRaw($raw, $values);
        }
        if ($count == "yes") {
            return $query->count();
        }
        return $query->orderBy("id", "desc")->paginate(10)->toArray();
    }

    public function get_expenditure(int $id): array|string
    {
        $query = self::select($this->selection)->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_expenditure_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function add_expenditure(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function update_expenditure_status(int $id, string $status): int|string
    {
        return self::where([['id', '=', $id], ['is_deleted', '!=', $status]])->update(['is_deleted' => $status]);
    }

    public function update_expenditure(int $id, array $data): int|string
    {
        $current_data = self::find($id);
        $new_data = ($current_data != null) ? array_diff_assoc($data, $current_data->toArray()) : [];
        if (!empty($new_data)) {
            return self::where(['id' => $id])->update($new_data);
        }
        return "nnd";
    }
}
