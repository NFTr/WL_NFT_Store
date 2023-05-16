<?php

namespace App\Command;

use App\Service\MintGardenNftAdapter;
use App\Service\NftAdapter;
use App\Service\SpaceScanNftAdapter;
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
    private SpaceScanNftAdapter $nftAdapter;
    private ContainerBagInterface $params;
    private MintGardenNftAdapter $mgNftAdapter;

    public function __construct(
        SpaceScanNftAdapter $nftAdapter,
        MintGardenNftAdapter $mgNftAdapter,
        ContainerBagInterface $params
    ) {
        $this->nftAdapter = $nftAdapter;
        $this->params = $params;
        $this->mgNftAdapter = $mgNftAdapter;

        parent::__construct();
    }

    protected function configure(): void
    {

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $profiles = $this->params->get('app.profiles');

        foreach ($profiles as $profile) {
//            $this->nftAdapter->importNftsByProfile($profile);
        }

        $collections = $this->params->get('app.collections');

        foreach ($collections as $collection) {
//            $this->nftAdapter->importNftsByCollection($collection);
            $this->mgNftAdapter->importNftProvenanceByCollection($collection);
        }

        return Command::SUCCESS;
    }
}
