<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Traits\HasUuid;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // /** @use HasFactory<UserFactory> */
    // use HasFactory, Notifiable;

    // /**
    //  * The attributes that are mass assignable.
    //  *
    //  * @var list<string>
    //  */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    // ];

    // /**
    //  * The attributes that should be hidden for serialization.
    //  *
    //  * @var list<string>
    //  */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];

    // /**
    //  * Get the attributes that should be cast.
    //  *
    //  * @return array<string, string>
    //  */
    // protected function casts(): array
    // {
    //     return [
    //         'email_verified_at' => 'datetime',
    //         'password' => 'hashed',
    //     ];
    // }

    use HasUuid;

    protected $fillable = ['uuid', 'fname', 'lname', 'email', 'phone', 'password', 'status'];

    protected $selection = ['uuid as index', 'fname as first_name', 'lname as last_name', 'email as email_address', 'phone as phone_number', 'status as state', 'created_at as timestamp'];

    protected static function booted()
    {
        parent::booted();
    }

    public function get_users(string $search = "", array $filter = [], array $sort = [], string $raw = "", array $values = [], string $count = "no"): array|string
    {
        $query = self::select($this->selection);
        if (!empty($search)) {
            $query = $query->whereAny(['fname', 'lname', 'email', 'phone'], "like", "%$search%");
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

    public function get_user(int $id): array|string
    {
        $query = self::select($this->selection)->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_user_id(string $uuid): array|string
    {
        $query = self::select("id")->where(['uuid' => $uuid])->first();
        return ($query != null) ? $query->toArray()['id'] : 0;
    }

    public function get_user_email_phone(string $email_phone): array|string
    {
        $query = self::select($this->selection)->where(['email' => $email_phone])->orWhere(['phone' => $email_phone])->first();
        return ($query != null) ? $query->toArray() : [];
    }

    public function get_user_password(int $id): array|string
    {
        $query = self::select("password")->find($id);
        return ($query != null) ? $query->toArray() : [];
    }

    public function add_user(array $data): int|string
    {
        return self::create($data)->id;
    }

    public function update_user_status(int $id, string $status): int|string
    {
        return self::where([['id', '=', $id], ['status', '!=', $status]])->update(['status' => $status]);
    }

    public function update_user(int $id, array $data): int|string
    {
        $current_data = self::find($id);
        $new_data = ($current_data != null) ? array_diff_assoc($data, $current_data->toArray()) : [];
        if (!empty($new_data)) {
            return self::where(['id' => $id])->update($new_data);
        }
        return "nnd";
    }

    public function update_user_password(int $id, string $password): int|string
    {
        return self::where(['id' => $id])->update(['password' => password_hash($password, PASSWORD_DEFAULT)]);
    }
}
