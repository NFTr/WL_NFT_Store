<?php

namespace App\Command;

use App\Service\OfferAdapter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

#[AsCommand(
    name: 'app:import:offers',
    description: 'Import offers using the configured source.',
)]
class ImportOffersCommand extends Command
{
    private OfferAdapter $offerAdapter;
    private ContainerBagInterface $params;

    public function __construct(OfferAdapter $offerAdapter, ContainerBagInterface $params)
    {
        $this->offerAdapter = $offerAdapter;
        $this->params = $params;

        parent::__construct();
    }

    protected function configure(): void
    {

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

//        $profiles = $this->params->get('app.profiles');
//
//        foreach ($profiles as $profile) {
//            $this->nftAdapter->importNftsByCreatorId($profile);
//        }

        $collections = $this->params->get('app.collections');

        foreach ($collections as $collection) {
            $this->offerAdapter->importOffersByCollection($collection);
        }

        return Command::SUCCESS;
    }
}
