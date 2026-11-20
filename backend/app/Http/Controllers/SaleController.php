<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\Revenue;
use App\Models\SuspendedCart;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function search_filter_sort($request)
    {
        $search = "";
        $filter = ['products.status' => 'enabled', ['quantity', '>', 0]];
        $category = new Category;
        if (isset($request->search) && !empty($request->search)) {
            $search = $request->search;
        }
        if (isset($request->category) && !empty($request->category)) {
            $filter['category_id'] = $category->get_category_id($request->category);
        }
        return [$search, $filter];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = [];
        $sfs = $this->search_filter_sort($request);
        $category = new Category;
        $product = new Product;
        $cart = new Cart;
        $cart_item = new CartItem;
        $suspended_cart = new SuspendedCart;
        if (isset($request->get_cart) && !empty($request->get_cart)) {
            $sc = $suspended_cart->get_suspended_cart_administrator_all($suspended_cart->get_suspended_cart_id($request->get_cart));
            if (!empty($sc)) {
                $scd = json_decode($sc['data'], true);
                $data['items'] = $product->get_cart_products($scd);
                $data['cart_data'] = $scd;
            }
        }
        $ct = $cart->get_cart(session("uid"));
        $data['products'] = $product->get_products_user($sfs[0], $sfs[1], [], "", [], "no", 20);
        $data['products_count'] = $product->get_products_user($sfs[0], $sfs[1], [], "", [], "yes");
        $data['categories'] = $category->get_categories("", ['status' => 'enabled'], [], "no");
        $data['cart'] = $ct;
        $data['cart_items'] = (!empty($ct)) ? $cart_item->get_cart_items($cart->get_cart_id($ct['index']), []) : [];
        $data['suspended_carts'] = $suspended_cart->get_suspended_carts_user(session("uid"));
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
        $cart = new Cart;
        $cart_item = new CartItem;
        $suspended_cart = new SuspendedCart;
        $revenue = new Revenue;
        $product = new Product;
        if (isset($request->add)) {
            if (!empty($request->selected)) {
                $c = $cart->get_cart_all(session("uid"));
                if (empty($c)) {
                    $ct = $cart->add_cart([
                        'user_id' => session("uid")
                    ]);
                } else {
                    $ct = $c['id'];
                }
                foreach ($request->selected as $selected) {
                    $pid = $product->get_product_id($selected);
                    $pdt = $product->get_product($pid);
                    if (!empty($pdt) && $pdt['qty'] >= 1) {
                        $ci = $cart_item->get_cart_items_all($ct, ['product_id' => $pid]);
                        if (empty($ci)) {
                            $cart_item->add_cart_item([
                                'cart_id' => $ct,
                                'product_id' => $pid
                            ]);
                        } else {
                            $quantity = ($ci[0]['qty'] + 1);
                            if ($pdt['qty'] >= $quantity) {
                                $cart_item->update_cart_item($ct, $ci[0]['id'], [
                                    'quantity' => $quantity
                                ]);
                            }
                        }
                    }
                }
            }
        }
        if (isset($request->restore)) {
            if (!empty($request->suspended_cart)) {
                if (empty($cart->get_cart(session("uid")))) {
                    $scid = $suspended_cart->get_suspended_cart_id($request->suspended_cart);
                    $sc = $suspended_cart->get_suspended_cart_user_all(session("uid"), $scid);
                    if (!empty($sc)) {
                        $items = json_decode($sc['data'], true);
                        $ct = $cart->add_cart([
                            'user_id' => session("uid")
                        ]);
                        foreach ($items as $item) {
                            $cart_item->add_cart_item([
                                'quantity' => $item['quantity'],
                                'cart_id' => $ct,
                                'product_id' => $product->get_product_id($item['index'])
                            ]);
                        }
                        $suspended_cart->delete_suspended_cart($scid);
                    }
                }
            }
        }
        $ct = $cart->get_cart_all(session("uid"));
        if (empty($ct)) {
            return response()->json([
                'error' => 'Unknown cart.'
            ], 422);
        }
        if (isset($request->cart)) {
            if ($request->cart != $ct['uuid']) {
                return response()->json([
                    'error' => 'Invalid cart.'
                ], 422);
            }
        }
        $cid = $ct['id'];
        if (isset($request->update)) {
            if (!empty($request->product) && !empty($request->cart_item) && is_numeric($request->quantity) && $request->quantity > 0) {
                $pid = $product->get_product_id($request->product);
                $pdt = $product->get_product($pid);
                if (!empty($pdt)) {
                    $quantity = trim($request->quantity, "-+");
                    if ($pdt['qty'] >= $quantity) {
                        $cart_item->update_cart_item($cid, $cart_item->get_cart_item_id($request->cart_item), [
                            'quantity' => $quantity
                        ]);
                    }
                }
            }
        }
        if (isset($request->remove) || isset($request->suspend)) {
            if (!empty($request->chosen)) {
                $items = [];
                foreach ($request->chosen as $chosen) {
                    $ciid = $cart_item->get_cart_item_id($chosen);
                    $ci = $cart_item->get_cart_item($cid, $ciid);
                    array_push($items, ...[['index' => $ci['product_index'], 'quantity' => $ci['qty']]]);
                    $cart_item->delete_cart_item($cid, $ciid);
                }
                if (!empty($items)) {
                    $suspended_cart->add_suspended_cart([
                        'data' => json_encode($items),
                        'request_type' => (isset($request->remove)) ? "remove" : "normal",
                        'user_id' => session("uid")
                    ]);
                    if ($cart_item->get_cart_items($cid, [], "yes") == 0) {
                        $cart->delete_cart($cid);
                    }
                }
            }
        }
        if (isset($request->sold)) {
            if (!empty($request->chosen)) {
                foreach ($request->chosen as $chosen) {
                    $ciid = $cart_item->get_cart_item_id($chosen);
                    $ci = $cart_item->get_cart_item_all($cid, $ciid);
                    if (!empty($ci)) {
                        $pid = $ci['product_id'];
                        $pdt = $product->get_product_all($pid);
                        if (!empty($pdt) && $pdt['quantity'] >= $ci['qty']) {
                            $revenue->add_revenue([
                                'name' => $ci['product'],
                                'quantity' => $ci['qty'],
                                'price' => $ci['amount'],
                                'cost_price' => $pdt['cost_price'],
                                'product_id' => $pid,
                                'category_id' => $pdt['category_id'],
                                'user_id' => session("uid")
                            ]);
                            $product->update_product($pid, [
                                'quantity' => ($pdt['quantity'] - $ci['qty'])
                            ]);
                            $cart_item->delete_cart_item($cid, $ciid);
                        }
                    }
                }
                if ($cart_item->get_cart_items($cid, [], "yes") == 0) {
                    $cart->delete_cart($cid);
                }
            }
        }
        $data['products'] = $product->get_products_user($sfs[0], $sfs[1], [], "", [], "no", 20);
        $data['products_count'] = $product->get_products_user($sfs[0], $sfs[1], [], "", [], "yes");
        $data['cart'] = $cart->get_cart(session("uid"));
        $data['cart_items'] = (!empty($data['cart'])) ? $cart_item->get_cart_items($cart->get_cart_id($data['cart']['index']), []) : [];
        $data['suspended_carts'] = $suspended_cart->get_suspended_carts_user(session("uid"));
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
