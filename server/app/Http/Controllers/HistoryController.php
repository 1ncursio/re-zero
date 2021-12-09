<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;

class HistoryController extends BaseController
{
    public function indexAI()
    {
        $history = $this->historyRepository->getAll();
        return view('history.index', compact('history'));
    }

    public function storeAI(Request $request)
    {
        // $request->blackId;
        // $request->whiteId;
        // $request->status;

        $history = History::create($request->all());

        return $this->sendResponse($history, 'History created successfully.');
    }
}
