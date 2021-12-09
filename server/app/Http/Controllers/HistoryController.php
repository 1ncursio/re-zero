<?php

namespace App\Http\Controllers;

use App\Models\History;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

class HistoryController extends BaseController
{
    public function indexAI()
    {
        $histories = History::latest()->get();
        $count = History::selectRaw('status, count(*) as total')->groupBy('status')->get();
        $count = $count->pluck('total', 'status');

        if (!isset($count['white_win'])) {
            $count['white_win'] = 0;
        }
        if (!isset($count['black_win'])) {
            $count['black_win'] = 0;
        }
        if (!isset($count['draw'])) {
            $count['draw'] = 0;
        }

        $white_win_rate = 0;
        // calculate win rate of white
        if ($count['white_win'] != 0) {
            $white_win_rate = $count['white_win'] / ($count['white_win'] + $count['black_win']);
        }

        $white_win_rate = intval(round($white_win_rate, 2) * 100);

        return $this->sendResponse([
            'histories' => $histories,
            'count' => $count,
            'white_win_rate' => $white_win_rate,
        ], 'Histories retrieved successfully.');
    }

    public function storeHistoryAI(Request $request)
    {
        $this->validate($request, [
            'blackId' => 'required|integer',
            'status' => 'required|in:black_win,white_win,draw',
        ]);

        $history = History::create([
            'black_id' => $request->blackId,
            'white_id' => null,
            'status' => $request->status,
        ]);

        return $this->sendResponse($history, 'History created successfully.');
    }

    // userHistoryAI
    public function userHistoryAI()
    {
        // get only histories of user and count win rate
        $histories = History::where('black_id', auth()->user()->id)->orWhere('white_id', auth()->user()->id)->latest()->get();
        // if user has no history return empty array

        $count = History::selectRaw('status, count(*) as total')->where('black_id', auth()->user()->id)->orWhere('white_id', auth()->user()->id)->groupBy('status')->get();
        $count = $count->pluck('total', 'status');

        // if count has no white_win, black_win, or draw, return 0
        if (!isset($count['white_win'])) {
            $count['white_win'] = 0;
        }
        if (!isset($count['black_win'])) {
            $count['black_win'] = 0;
        }
        if (!isset($count['draw'])) {
            $count['draw'] = 0;
        }


        $black_win_rate = 0;
        // calculate win rate of user
        if ($count['black_win'] != 0) {
            $black_win_rate = $count['black_win'] / ($count['black_win'] + $count['white_win']);
        }

        $black_win_rate = intval(round($black_win_rate, 2) * 100);

        return $this->sendResponse([
            'histories' => $histories,
            'count' => $count,
            'black_win_rate' => $black_win_rate,
        ], 'Histories retrieved successfully.');
    }
}
