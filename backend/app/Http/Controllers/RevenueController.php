<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Log;
use App\Models\Product;
use App\Models\Revenue;
use Illuminate\Http\Request;

class RevenueController extends Controller
{
    public function search_filter_sort($request)
    {
        $filter = [];
        $raw = "";
        $values = [];
        $category = new Category;
        $date_format = "DATE_FORMAT(revenues.created_at,'%Y-%m-%d')";
        if (isset($request->category) && !empty($request->category)) {
            $filter['revenues.category_id'] = $category->get_category_id($request->category);
        }
        if (isset($request->from) && !empty($request->from)) {
            $raw .= "$date_format>=?";
            array_push($values, $request->from);
        }
        if (isset($request->to) && !empty($request->to)) {
            $raw .= (!empty($raw)) ? " AND $date_format<=?" : "$date_format<=?";
            array_push($values, $request->to);
        }
        if (isset($request->status) && ($request->status == "completed" || $request->status == "canceled")) {
            $filter['revenues.status'] = $request->status;
        }
        return [$filter, $raw, $values];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sfs = $this->search_filter_sort($request);
        $category = new Category;
        $revenue = new Revenue;
        return response()->json([
            'revenues' => $revenue->get_revenues($sfs[0], [], $sfs[1], $sfs[2]),
            'categories' => $category->get_categories("", ['status' => 'enabled'], [], "no")
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
        $category = new Category;
        $revenue = new Revenue;
        $product = new Product;
        $log = new Log;
        if (isset($request->cancel)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $rvid = $revenue->get_revenue_id($selected);
                    $rv = $revenue->get_revenue_all($rvid);
                    if (!empty($rv)) {
                        $pdt = $product->get_product($rv['product_id']);
                        if (!empty($pdt)) {
                            $product->update_product($rv['product_id'], [
                                'quantity' => ($pdt['qty'] + $rv['qty'])
                            ]);
                            $revenue->update_revenue_status($rvid, "canceled");
                            $log->add_log([
                                'total' => $rv['amount'],
                                'description' => "Transaction canceled",
                                'user_id' => $rv['user_id']
                            ]);
                        }
                    }
                }
            }
        }
        $data['revenues'] = $revenue->get_revenues($sfs[0], [], $sfs[1], $sfs[2]);
        $data['categories'] = $category->get_categories("", ['status' => 'enabled'], [], "no");
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
