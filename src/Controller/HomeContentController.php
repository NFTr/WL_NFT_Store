<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Yaml\Yaml;

/**
 * @Route("/api/homeContent", name="api_homeContent")
 */
class HomeContentController
{
    /**
     * @Route("", name="config")
     */
    public function index()
    {
        $configFile = __DIR__.'/../../config/chia.yaml';

        $configData = Yaml::parseFile($configFile);
        $homeContent = $configData['parameters']['app.homeContent'];
        $response = new JsonResponse();
        $response->setData($homeContent);

        return $response;
    }
}