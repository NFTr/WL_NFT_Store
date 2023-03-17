<?php

namespace App\Controller;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/homeContent", name="api_homeContent")
 */
class HomeContentController extends AbstractController
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
            $homeContent = $this->params->get('app.homeContent');
            $response = new JsonResponse();
            $response->setData($homeContent);
            return $response;
        } catch (NotFoundExceptionInterface|ContainerExceptionInterface $e) {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
    }
}