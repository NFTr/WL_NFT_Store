<?php

namespace App\Service;

interface NftAdapter {
    function importNftsByCreatorId(string $creatorId);
    function importNftsByCollection(string $collectionId);
}