<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function search_filter_sort($request)
    {
        $search = "";
        $filter = [];
        $raw = "";
        $values = [];
        $date_format = "DATE_FORMAT(created_at,'%Y-%m-%d')";
        if (isset($request->search) && !empty($request->search)) {
            $search = $request->search;
        }
        if (isset($request->from) && !empty($request->from)) {
            $raw .= "$date_format>=?";
            array_push($values, $request->from);
        }
        if (isset($request->to) && !empty($request->to)) {
            $raw .= (!empty($raw)) ? " AND $date_format<=?" : "$date_format<=?";
            array_push($values, $request->to);
        }
        if (isset($request->status) && ($request->status == "activated" || $request->status == "deactivated")) {
            $filter['status'] = $request->status;
        }
        return [$search, $filter, $raw, $values];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sfs = $this->search_filter_sort($request);
        $user = new User;
        return response()->json([
            'users' => $user->get_users($sfs[0], $sfs[1], [], $sfs[2], $sfs[3]),
            'users_count' => $user->get_users($sfs[0], $sfs[1], [], $sfs[2], $sfs[3], "yes")
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = [];
        $sfs = $this->search_filter_sort($request);
        $user = new User;
        if (isset($request->activate)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $user->update_user_status($user->get_user_id($selected), "activated");
                }
            }
        }
        if (isset($request->deactivate)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $user->update_user_status($user->get_user_id($selected), "deactivated");
                }
            }
        }
        if (isset($request->add)) {
            $request->validate([
                'first_name' => 'required|max:255',
                'last_name' => 'required|max:255',
                'email' => 'required|email|unique:users,email|unique:administrators,email|max:255',
                'phone' => 'required|numeric|unique:users,phone|unique:administrators,phone|min_digits:11|max_digits:11',
                'password' => 'required|min:6'
            ]);
            $user->add_user([
                'fname' => $request->first_name,
                'lname' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => password_hash($request->password, PASSWORD_DEFAULT)
            ]);
        }
        $data['users'] = $user->get_users($sfs[0], $sfs[1], [], $sfs[2], $sfs[3]);
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = [];
        $user = new User;
        $id = $user->get_user_id($id);
        if (is_numeric($id)) {
            $data['user'] = $user->get_user($id);
        }
        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = [];
        $user = new User;
        $id = $user->get_user_id($id);
        if (isset($request->update)) {
            $request->validate([
                'first_name' => 'required|max:255',
                'last_name' => 'required|max:255',
                'email' => 'required|email|unique:users,email,' . $id . '|unique:administrators,email|max:255',
                'phone' => 'required|numeric|unique:users,phone,' . $id . '|unique:administrators,phone|min_digits:11|max_digits:11'
            ]);
            $user->update_user($id, [
                'fname' => $request->first_name,
                'lname' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone
            ]);
        }
        if (isset($request->change)) {
            $request->validate([
                'new_password' => 'required|min:6',
                'confirm_new_password' => 'required|same:new_password'
            ]);
            $user->update_user_password($id, $request->new_password);
        }
        return response()->json($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
