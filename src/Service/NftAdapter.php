<?php

namespace App\Service;

interface NftAdapter {
    function importNftsByProfile(string $profileId);
    function importNftsByCollection(string $collectionId);
}