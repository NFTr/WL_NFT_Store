<?php

namespace App\Command;

use App\Service\NftAdapter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

#[AsCommand(
    name: 'app:import:nfts',
    description: 'Import all your NFTs using the configured source.',
)]
class ImportNftsCommand extends Command
{
    private NftAdapter $nftAdapter;
    private ContainerBagInterface $params;

    public function __construct(NftAdapter $nftAdapter, ContainerBagInterface $params)
    {
        $this->nftAdapter = $nftAdapter;
        $this->params = $params;

        parent::__construct();
    }

    protected function configure(): void
    {

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $profiles = $this->params->get('app.profiles');

        foreach ($profiles as $profile) {
            $this->nftAdapter->importNftsByCreatorId($profile);
        }

        $collections = $this->params->get('app.collections');

        foreach ($collections as $collection) {
            $this->nftAdapter->importNftsByCollection($collection);
        }

        return Command::SUCCESS;
    }
}
