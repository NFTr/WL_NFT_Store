<?php

namespace App\Command;

use App\Service\NftAdapter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import:nfts',
    description: 'Import all your NFTs using the configured source.',
)]
class ImportNftsCommand extends Command
{
    private NftAdapter $nftAdapter;

    public function __construct(NftAdapter $nftAdapter)
    {
        $this->nftAdapter = $nftAdapter;

        parent::__construct();
    }

    protected function configure(): void
    {

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->nftAdapter->importAllNfts();

        return Command::SUCCESS;
    }
}
