<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class SuspendedCart extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'data', 'request_type', 'user_id'];

    protected $selection = ['suspended_carts.uuid as index', 'request_type as type', 'suspended_carts.created_at as date_time', 'fname as first_name', 'lname as last_name'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_suspended_carts_administrator(array $filter = [], array $sort = [], string $raw = "", array $values = [], string $count = "no"): array|string
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
        return $query->orderBy("suspended_carts.id", "desc")->paginate(10)->toArray();
    }

    public function get_suspended_carts_user(int $uid): array|string
    {
        return self::select($this->selection)->join("users", "user_id", "=", "users.id")->where(['user_id' => $uid])->orderBy("suspended_carts.id", "asc")->get()->toArray();
    }

    public function get_suspended_cart_administrator(int $id): array|string
    {
        $query = self::select($this->selection)->join("users", "user_id", "=", "users.id")->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_suspended_cart_administrator_all(int $id): array|string
    {
        $query = self::select(['data', 'request_type', 'user_id'])->join("users", "user_id", "=", "users.id")->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_suspended_cart_user(int $uid, int $id): array|string
    {
        $query = self::select($this->selection)->join("users", "user_id", "=", "users.id")->where(['user_id' => $uid])->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_suspended_cart_user_all(int $uid, int $id): array|string
    {
        $query = self::join("users", "user_id", "=", "users.id")->where(['user_id' => $uid])->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_suspended_cart_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function add_suspended_cart(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function delete_suspended_cart(int $id): int|string
    {
        return self::where(['id' => $id])->delete();
    }
}
