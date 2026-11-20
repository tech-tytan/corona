<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Product extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'name', 'quantity', 'price', 'cost_price', 'status', 'category_id'];

    protected $selection = ['products.uuid as index', 'products.name as product', 'quantity as qty', 'price as amount', 'cost_price as amount_paid', 'products.status as state', 'products.created_at as timestamp', 'categories.uuid as category_index', 'categories.name as category'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_products(string $search = "", array $filter = [], array $sort = [], string $raw = "", array $values = [], string $count = "no", int $limit = 10): array|string
    {
        $query = self::select($this->selection)->join("categories", "category_id", "=", "categories.id");
        if (!empty($search)) {
            $searches = explode("+", $search);
            $query = $query->where(function ($query) use ($searches) {
                foreach ($searches as $srch) {
                    $query->orwhere("products.name", "like", "%$srch%");
                }
            });
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
        return $query->orderBy("products.id", "desc")->paginate($limit)->toArray();
    }

    public function get_products_user(string $search = "", array $filter = [], array $sort = [], string $raw = "", array $values = [], string $count = "no", int $limit = 10): array|string
    {
        $query = self::select(['products.uuid as index', 'products.name as product', 'price as amount', 'categories.name as category'])->join("categories", "category_id", "=", "categories.id");
        if (!empty($search)) {
            $searches = explode("+", $search);
            $query = $query->where(function ($query) use ($searches) {
                foreach ($searches as $srch) {
                    $query->orwhere("products.name", "like", "%$srch%");
                }
            });
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
        return $query->orderBy("products.id", "desc")->paginate($limit)->toArray();
    }

    public function get_cart_products(array $filter): array|string
    {
        return self::select(['uuid as index', 'name as product', 'price as amount'])->where(function ($query) use ($filter) {
            foreach ($filter as $f) {
                $query->orwhere(['uuid' => $f['index']]);
            }
        })->get()->toArray();
    }

    public function get_product(int $id): array|string
    {
        $query = self::select($this->selection)->join("categories", "category_id", "=", "categories.id")->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_product_all(int $id): array|string
    {
        $query = self::join("categories", "category_id", "=", "categories.id")->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_product_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function add_product(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function update_product_status(int $id, string $status): int|string
    {
        return self::where([['id', '=', $id], ['status', '!=', $status]])->update(['status' => $status]);
    }

    public function update_product(int $id, array $data): int|string
    {
        $current_data = self::find($id);
        $new_data = ($current_data != null) ? array_diff_assoc($data, $current_data->toArray()) : [];
        if (!empty($new_data)) {
            return self::where(['id' => $id])->update($new_data);
        }
        return "nnd";
    }
}
