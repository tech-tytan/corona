<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function search_filter_sort($request)
    {
        $raw = "";
        $values = [];
        $date_format = "DATE_FORMAT(logs.created_at,'%Y-%m-%d')";
        if (isset($request->from) && !empty($request->from)) {
            $raw .= "$date_format>=?";
            array_push($values, $request->from);
        }
        if (isset($request->to) && !empty($request->to)) {
            $raw .= (!empty($raw)) ? " AND $date_format<=?" : "$date_format<=?";
            array_push($values, $request->to);
        }
        return [$raw, $values];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sfs = $this->search_filter_sort($request);
        $log = new Log;
        return response()->json([
            'logs' => $log->get_logs([], [], $sfs[0], $sfs[1])
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
