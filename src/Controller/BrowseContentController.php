<?php

namespace App\Controller;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/browseContent", name="api_browseContent")
 */
class BrowseContentController extends AbstractController
{
    private ContainerBagInterface $params;

    public function __construct(ContainerBagInterface $params)
    {
        $this->params = $params;
    }

    /**
     * @Route("", name="config")
     */
    public function index(): Response
    {
        try {
            $browseContent1 = $this->params->get('app.collections');
            $browseContent2 = $this->params->get('app.profiles');
            $responseData = [
                'collections' => $browseContent1,
                'profiles' => $browseContent2
            ];
            $response = new JsonResponse();
            $response->setData($responseData);
            return $response;
        } catch (NotFoundExceptionInterface|ContainerExceptionInterface $e) {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
    }
}