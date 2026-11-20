<?php

namespace App\Http\Controllers;

use App\Models\Expenditure;
use Illuminate\Http\Request;

class ExpenditureController extends Controller
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
        if (isset($request->min_amount) && is_numeric($request->min_amount)) {
            array_push($filter, ...[['amount', '>=', $request->min_amount]]);
        }
        if (isset($request->max_amount) && is_numeric($request->max_amount)) {
            array_push($filter, ...[['amount', '<=', $request->max_amount]]);
        }
        if (isset($request->from) && !empty($request->from)) {
            $raw .= "$date_format>=?";
            array_push($values, $request->from);
        }
        if (isset($request->to) && !empty($request->to)) {
            $raw .= (!empty($raw)) ? " AND $date_format<=?" : "$date_format<=?";
            array_push($values, $request->to);
        }
        if (isset($request->is_deleted) && ($request->is_deleted == "yes" || $request->is_deleted == "no")) {
            $filter['is_deleted'] = $request->is_deleted;
        }
        return [$search, $filter, $raw, $values];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sfs = $this->search_filter_sort($request);
        $expenditure = new Expenditure;
        return response()->json([
            'expenditures' => $expenditure->get_expenditures($sfs[0], $sfs[1], [], $sfs[2], $sfs[3]),
            'expenditures_count' => $expenditure->get_expenditures($sfs[0], $sfs[1], [], $sfs[2], $sfs[3], "yes")
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
        $expenditure = new Expenditure;
        if (isset($request->restore)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $expenditure->update_expenditure_status($expenditure->get_expenditure_id($selected), "no");
                }
            }
        }
        if (isset($request->delete)) {
            if (!empty($request->selected)) {
                foreach ($request->selected as $selected) {
                    $expenditure->update_expenditure_status($expenditure->get_expenditure_id($selected), "yes");
                }
            }
        }
        if (isset($request->add)) {
            $request->validate([
                'name' => 'required|unique:expenditures,name|max:255',
                'amount' => 'required|numeric'
            ]);
            $expenditure->add_expenditure([
                'name' => $request->name,
                'amount' => trim($request->amount, "-+")
            ]);
        }
        $data['expenditures'] = $expenditure->get_expenditures($sfs[0], $sfs[1], [], $sfs[2], $sfs[3]);
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = [];
        $expenditure = new Expenditure;
        $id = $expenditure->get_expenditure_id($id);
        if (is_numeric($id)) {
            $data['expenditure'] = $expenditure->get_expenditure($id);
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
        $expenditure = new Expenditure;
        $id = $expenditure->get_expenditure_id($id);
        if (isset($request->edit)) {
            $request->validate([
                'name' => 'required|unique:expenditures,name,' . $id . '|max:255',
                'amount' => 'required|numeric'
            ]);
            $expenditure->update_expenditure($id, [
                'name' => $request->name,
                'amount' => trim($request->amount, "-+")
            ]);
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
