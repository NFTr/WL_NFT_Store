<?php

namespace App\Utilities;

use function BrooksYang\Bech32m\convertBits;
use function BrooksYang\Bech32m\encode;
use const BrooksYang\Bech32m\BECH32M;

class PuzzleHashConverter
{

    public function encodePuzzleHash(string $puzzleHash, string $hrp = 'xch'): string
    {
        $dataArray = unpack('C*', hex2bin(str_replace('0x', '', $puzzleHash)));
        return encode($hrp, convertBits(array_values($dataArray), count($dataArray), 8, 5), BECH32M);
    }
}