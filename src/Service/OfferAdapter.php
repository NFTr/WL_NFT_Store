<?php

namespace App\Service;

interface OfferAdapter {
    function importOffersByCollection(string $collectionId);
    function importOffersByProfile(string $profileId);
}