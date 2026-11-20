<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\SuspendedCart;
use App\Models\Product;
use Illuminate\Http\Request;

class SuspendedCartController extends Controller
{
    public function search_filter_sort($request)
    {
        $filter = [];
        $raw = "";
        $values = [];
        $date_format = "DATE_FORMAT(suspended_carts.created_at,'%Y-%m-%d')";
        if (isset($request->from) && !empty($request->from)) {
            $raw .= "$date_format>=?";
            array_push($values, $request->from);
        }
        if (isset($request->to) && !empty($request->to)) {
            $raw .= (!empty($raw)) ? " AND $date_format<=?" : "$date_format<=?";
            array_push($values, $request->to);
        }
        if (isset($request->request_type) && ($request->request_type == "normal" || $request->request_type == "remove")) {
            $filter['request_type'] = $request->request_type;
        }
        return [$filter, $raw, $values];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = [];
        $sfs = $this->search_filter_sort($request);
        $suspended_cart = new SuspendedCart;
        $product = new Product;
        if (isset($request->cart) && !empty($request->cart)) {
            $sc = $suspended_cart->get_suspended_cart_administrator_all($suspended_cart->get_suspended_cart_id($request->cart));
            if (!empty($sc)) {
                $scd = json_decode($sc['data'], true);
                $data['items'] = $product->get_cart_products($scd);
                $data['cart_data'] = $scd;
            }
        }
        $data['suspended_carts'] = $suspended_cart->get_suspended_carts_administrator($sfs[0], [], $sfs[1], $sfs[2]);
        $data['suspended_carts_count'] = $suspended_cart->get_suspended_carts_administrator($sfs[0], [], $sfs[1], $sfs[2], "yes");
        return response()->json($data);
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
        $suspended_cart = new SuspendedCart;
        $product = new Product;
        $log = new Log;
        if (isset($request->clear)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $scid = $suspended_cart->get_suspended_cart_id($selected);
                    $sc = $suspended_cart->get_suspended_cart_administrator_all($scid);
                    if (!empty($sc)) {
                        $scd = json_decode($sc['data'], true);
                        $total = 0;
                        foreach ($scd as $s) {
                            $total += $product->get_product($product->get_product_id($s['index']))['amount'] * $s['quantity'];
                        }
                        $log->add_log([
                            'total' => $total,
                            'description' => ($sc['request_type'] == "normal") ? "Cart cleared" : "Cart removed",
                            'user_id' => $sc['user_id']
                        ]);
                        $suspended_cart->delete_suspended_cart($scid);
                    }
                }
            }
        }
        $data['suspended_carts'] = $suspended_cart->get_suspended_carts_administrator($sfs[0], [], $sfs[1], $sfs[2]);
        $data['suspended_carts_count'] = $suspended_cart->get_suspended_carts_administrator($sfs[0], [], $sfs[1], $sfs[2], "yes");
        return response()->json($data);
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
