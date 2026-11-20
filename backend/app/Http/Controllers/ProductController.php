<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Revenue;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function search_filter_sort($request)
    {
        $search = "";
        $filter = [];
        $raw = "";
        $values = [];
        $category = new Category;
        $date_format = "DATE_FORMAT(products.created_at,'%Y-%m-%d')";
        if (isset($request->search) && !empty($request->search)) {
            $search = $request->search;
        }
        if (isset($request->category) && !empty($request->category)) {
            $filter['category_id'] = $category->get_category_id($request->category);
        }
        if (isset($request->min_price) && is_numeric($request->min_price)) {
            array_push($filter, ...[['price', '>=', $request->min_price]]);
        }
        if (isset($request->max_price) && is_numeric($request->max_price)) {
            array_push($filter, ...[['price', '<=', $request->max_price]]);
        }
        if (isset($request->from) && !empty($request->from)) {
            $raw .= "$date_format>=?";
            array_push($values, $request->from);
        }
        if (isset($request->to) && !empty($request->to)) {
            $raw .= (!empty($raw)) ? " AND $date_format<=?" : "$date_format<=?";
            array_push($values, $request->to);
        }
        if (isset($request->status) && ($request->status == "enabled" || $request->status == "disabled")) {
            $filter['products.status'] = $request->status;
        }
        return [$search, $filter, $raw, $values];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sfs = $this->search_filter_sort($request);
        $category = new Category;
        $product = new Product;
        return response()->json([
            'products' => $product->get_products($sfs[0], $sfs[1], [], $sfs[2], $sfs[3]),
            'categories' => $category->get_categories("", ['status' => 'enabled'], [], "no"),
            'products_count' => $product->get_products($sfs[0], $sfs[1], [], $sfs[2], $sfs[3], "yes")
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
        $product = new Product;
        if (isset($request->enable)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $product->update_product_status($product->get_product_id($selected), "enabled");
                }
            }
        }
        if (isset($request->disable)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $product->update_product_status($product->get_product_id($selected), "disabled");
                }
            }
        }
        if (isset($request->add)) {
            $request->validate([
                'name' => 'required|unique:products,name|max:255',
                'quantity' => 'required|numeric',
                'price' => 'required|numeric',
                'cost_price' => 'required|numeric',
                'category' => 'required'
            ]);
            $category_id = $category->get_category_id($request->category);
            if (empty($category->get_category($category_id))) {
                return response()->json([
                    'errors' => [
                        'category' => ['Invalid category.']
                    ]
                ], 422);
            }
            $product->add_product([
                'name' => $request->name,
                'quantity' => trim($request->quantity, "-+"),
                'price' => trim($request->price, "-+"),
                'cost_price' => trim($request->cost_price, "-+"),
                'category_id' => $category_id
            ]);
        }
        $data['products'] = $product->get_products($sfs[0], $sfs[1], [], $sfs[2], $sfs[3]);
        $data['categories'] = $category->get_categories("", ['status' => 'enabled'], [], "no");
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = [];
        $category = new Category;
        $product = new Product;
        $id = $product->get_product_id($id);
        if (is_numeric($id)) {
            $data['product'] = $product->get_product($id);
        }
        $data['categories'] = $category->get_categories("", ['status' => 'enabled'], [], "no");
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
        $category = new Category;
        $product = new Product;
        $revenue = new Revenue;
        $id = $product->get_product_id($id);
        $sales_count = $revenue->get_revenues(['product_id' => $id], [], "", [], "yes");
        if (isset($request->edit)) {
            $request->validate([
                'name' => 'required|unique:products,name,' . $id . '|max:255',
                'quantity' => 'required|numeric',
                'price' => 'required|numeric',
                'cost_price' => 'required|numeric',
                'category' => 'required'
            ]);
            $category_id = $category->get_category_id($request->category);
            if (empty($category->get_category($category_id))) {
                return response()->json([
                    'errors' => [
                        'category' => ['Invalid category.']
                    ]
                ], 422);
            }
            $array = [
                'quantity' => trim($request->quantity, "-+"),
                'price' => trim($request->price, "-+"),
                'cost_price' => trim($request->cost_price, "-+")
            ];
            if ($sales_count == 0) {
                $data['name'] = $request->name;
                $data['category_id'] = $category_id;
            }
            $product->update_product($id, $array);
        }
        $data['categories'] = $category->get_categories("", ['status' => 'enabled'], [], "no");
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
