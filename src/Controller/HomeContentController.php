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
        $configFile = __DIR__.'/../../config/homeConfig.yaml'; // Path to your YAML file

        $configData = Yaml::parseFile($configFile); // Parse the YAML file
        $response = new JsonResponse();
        $response->setData($configData);

        return $response;
    }
}