<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Revenue;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function search_filter_sort($request)
    {
        $search = "";
        $filter = [];
        if (isset($request->search) && !empty($request->search)) {
            $search = $request->search;
        }
        if (isset($request->status) && ($request->status == "enabled" || $request->status == "disabled")) {
            $filter['status'] = $request->status;
        }
        return [$search, $filter];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sfs = $this->search_filter_sort($request);
        $category = new Category;
        return response()->json([
            'categories' => $category->get_categories($sfs[0], $sfs[1]),
            'categories_count' => $category->get_categories($sfs[0], $sfs[1], [], "no", "yes")
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
        if (isset($request->enable)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $category->update_category_status($category->get_category_id($selected), "enabled");
                }
            }
        }
        if (isset($request->disable)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $category->update_category_status($category->get_category_id($selected), "disabled");
                }
            }
        }
        if (isset($request->add)) {
            $request->validate([
                'name' => 'required|unique:categories,name|max:255'
            ]);
            $category->add_category([
                'name' => $request->name
            ]);
        }
        $data['categories'] = $category->get_categories($sfs[0], $sfs[1]);
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = [];
        $category = new Category;
        $id = $category->get_category_id($id);
        if (is_numeric($id)) {
            $data['category'] = $category->get_category($id);
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
        $category = new Category;
        $revenue = new Revenue;
        $id = $category->get_category_id($id);
        $sales_count = $revenue->get_revenues(['revenues.category_id' => $id], [], "", [], "yes");
        if (isset($request->edit)) {
            $request->validate([
                'name' => 'required|unique:categories,name,' . $id . '|max:255'
            ]);
            if ($sales_count == 0) {
                $category->update_category($id, [
                    'name' => $request->name
                ]);
            }
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
