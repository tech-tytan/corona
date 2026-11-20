<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;
use Illuminate\Support\Facades\DB;

class Revenue extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'name', 'quantity', 'price', 'cost_price', 'product_id', 'category_id', 'user_id'];

    protected $selection = ['revenues.uuid as index', 'revenues.name as product', 'revenues.quantity as qty', 'revenues.price as amount', 'revenues.cost_price as amount_paid', 'revenues.created_at as date_time', 'revenues.status as state', 'products.uuid as product_index', 'categories.name as category', 'fname as first_name', 'lname as last_name'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_revenues(array $filter = [], array $sort = [], string $raw = "", array $values = [], string $count = "no", string $limit = "no"): array|string
    {
        $query = self::select($this->selection)->join("products", "product_id", "=", "products.id")->join("categories", "revenues.category_id", "=", "categories.id")->join("users", "revenues.user_id", "=", "users.id");
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
        $query = $query->orderBy("revenues.id", "desc");
        if ($limit == "yes") {
            return $query->limit(10)->get()->toArray();
        }
        return $query->paginate(10)->toArray();
    }

    public function get_revenues_expenditures_by_date(string $raw = "", array $values = []): array|string
    {
        $revenue = self::selectRaw("SUM(price) as total_price,SUM(cost_price) as total_cost_price,0 as total_amount,DATE_FORMAT(created_at,'%Y-%m') as date");
        $revenue = $revenue->where(['status' => 'completed']);
        if (!empty($raw)) {
            $revenue = $revenue->whereRaw($raw, $values);
        }
        $revenue = $revenue->groupBy("date");
        $expenditure = DB::table("expenditures")->selectRaw("0 as total_price,0 as total_cost_price,SUM(amount) as total_amount,DATE_FORMAT(created_at,'%Y-%m') as date");
        $expenditure = $expenditure->where(['is_deleted' => 'no']);
        if (!empty($raw)) {
            $expenditure = $expenditure->whereRaw($raw, $values);
        }
        $expenditure = $expenditure->groupBy("date");
        return DB::table(function ($query) use ($revenue, $expenditure) {
            $query->fromSub($revenue->unionAll($expenditure), "combined");
        })
            ->selectRaw("IFNULL(SUM(total_price),0) as total_price,IFNULL(SUM(total_cost_price),0) as total_cost_price,IFNULL(SUM(total_amount),0) as total_amount,date")
            ->groupBy("date")->orderBy("date", "desc")->paginate(10)->toArray();
    }

    public function get_revenue(int $id): array|string
    {
        $query = self::select($this->selection)->join("products", "product_id", "=", "products.id")->join("categories", "revenues.category_id", "=", "categories.id")->join("users", "revenues.user_id", "=", "users.id")->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_revenue_all(int $id): array|string
    {
        $query = self::select(['revenues.quantity as qty', 'revenues.price as amount', 'product_id', 'user_id'])->join("products", "product_id", "=", "products.id")->join("categories", "revenues.category_id", "=", "categories.id")->join("users", "revenues.user_id", "=", "users.id")->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_revenue_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function add_revenue(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function update_revenue_status(int $id, string $status): int|string
    {
        return self::where([['id', '=', $id], ['status', '!=', $status]])->update(['status' => $status]);
    }
}
