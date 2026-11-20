<?php

namespace App\Http\Controllers;

use App\Models\Administrator;
use App\Models\SuspendedCart;
use Illuminate\Http\Request;

class AdminHeaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $administrator = new Administrator;
        $suspended_cart = new SuspendedCart;
        $admin = $administrator->get_administrator(session("id"));
        return response()->json([
            'full_name' => $admin['first_name'] . " " . $admin['last_name'],
            'suspended_carts' => $suspended_cart->get_suspended_carts_administrator(['request_type' => 'remove'], [], "", [], "yes")
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
