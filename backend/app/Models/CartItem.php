<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class CartItem extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'quantity', 'cart_id', 'product_id'];

    protected $selection = ['cart_items.uuid as index', 'cart_items.quantity as qty', 'products.uuid as product_index', 'products.name as product', 'products.price as amount'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_cart_items(int $cid, array $filter, string $count = "no"): array|string
    {
        $query = self::select($this->selection)->join("carts", "cart_id", "=", "carts.id")->join("products", "product_id", "=", "products.id")->where(['cart_id' => $cid]);
        if (!empty($filter)) {
            $query = $query->where($filter);
        }
        if ($count == "yes") {
            return $query->count();
        } else {
            return $query->orderBy("cart_items.id", "asc")->get()->toArray();
        }
    }

    public function get_cart_items_all(int $cid, array $filter, string $count = "no"): array|string
    {
        $query = self::select(['cart_items.id as id', 'cart_items.quantity as qty'])->join("carts", "cart_id", "=", "carts.id")->join("products", "product_id", "=", "products.id")->where(['cart_id' => $cid]);
        if (!empty($filter)) {
            $query = $query->where($filter);
        }
        if ($count == "yes") {
            return $query->count();
        } else {
            return $query->orderBy("cart_items.id", "asc")->get()->toArray();
        }
    }

    public function get_cart_item(int $cid, int $id): array|string
    {
        $query = self::select($this->selection)->join("carts", "cart_id", "=", "carts.id")->join("products", "product_id", "=", "products.id")->where(['cart_id' => $cid])->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_cart_item_all(int $cid, int $id): array|string
    {
        $query = self::select(['cart_items.quantity as qty', 'product_id', 'products.name as product', 'products.price as amount'])->join("carts", "cart_id", "=", "carts.id")->join("products", "product_id", "=", "products.id")->where(['cart_id' => $cid])->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_cart_item_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function add_cart_item(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function update_cart_item(int $cid, int $id, array $data): int|string
    {
        $current_data = self::find($id);
        $new_data = ($current_data != null) ? array_diff_assoc($data, $current_data->toArray()) : [];
        if (!empty($new_data)) {
            return self::where(['id' => $id, 'cart_id' => $cid])->update($new_data);
        }
        return "nnd";
    }

    public function delete_cart_item(int $cid, int $id): int|string
    {
        return self::where(['id' => $id, 'cart_id' => $cid])->delete();
    }

    public function delete_cart_items(int $cid): int|string
    {
        return self::where(['cart_id' => $cid])->delete();
    }
}
