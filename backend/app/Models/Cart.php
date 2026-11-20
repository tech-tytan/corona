<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Cart extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'user_id'];

    protected $selection = ['uuid as index'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_cart(int $uid): array|string
    {
        $query = self::select($this->selection)->where(['user_id' => $uid])->first();
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_cart_all(int $uid): array|string
    {
        $query = self::where(['user_id' => $uid])->first();
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_cart_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function add_cart(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function delete_cart(int $id): int|string
    {
        return self::where(['id' => $id])->delete();
    }
}
