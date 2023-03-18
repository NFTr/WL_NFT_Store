<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Yaml\Yaml;

/**
 * @Route("/api/browseContent", name="api_browseContent")
 */
class BrowseContentController
{
    /**
     * @Route("", name="config")
     */
    public function index()
    {
        $configFile = __DIR__.'/../../config/chia.yaml';

        $configData = Yaml::parseFile($configFile);
        $homeContent = $configData['parameters']['app.browse'];
        $response = new JsonResponse();
        $response->setData($homeContent);

        return $response;
    }
}