import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';

export interface ApiBlock {
  height: number;
  nonce: number;
  size: number;
  confirmations: number;
  hash: string;
  nextBlockHash: string;
  previousBlockHash: string;
  transactionCount: number;
  reward: number;
  minedBy: string;
  time: Date;
  timeNormalized: Date;
}

export interface ApiUtxoCoinBlock extends ApiBlock {
  difficulty: number;
  merkleRoot: string;
  bits: number;
  version: number;
}

export interface ApiEthBlock extends ApiBlock {
  difficulty: number;
  totalDifficulty: number;
  gasUsed: number;
  gasLimit: number;
}
export interface AppBlock {
  height: number;
  nonce: number;
  size: number;
  confirmations: number;
  virtualSize: number;
  hash: string;
  time: number;
  tx: {
    length: number;
  };
  txlength: number;
  previousblockhash: string;
  nextblockhash: string;
  poolInfo: {
    poolName: string;
    url: string;
  };
  reward: number;
}

export interface AppUtxoCoinBlock extends AppBlock {
  difficulty: number;
  merkleroot: string;
  bits: string;
  version: number;
}

export interface AppEthBlock extends AppBlock {
  difficulty: number;
  totalDifficulty: number;
  gasUsed: number;
  gasLimit: number;
}

@Injectable()
export class BlocksProvider {
  constructor(
    public httpClient: HttpClient,
    public currency: CurrencyProvider,
    private api: ApiProvider
  ) {}

  public toEthAppBlock(block: ApiEthBlock): AppEthBlock {
    return {
      ...this.toAppBlock(block),
      gasLimit: block.gasLimit,
      gasUsed: block.gasUsed,
      difficulty: block.difficulty,
      totalDifficulty: block.totalDifficulty
    };
  }

  public toUtxoCoinAppBlock(block: ApiUtxoCoinBlock): AppUtxoCoinBlock {
    const difficulty: number = 0x1f07ffff / block.bits;
    return {
      ...this.toAppBlock(block),
      merkleroot: block.merkleRoot,
      version: block.version,
      bits: block.bits.toString(16),
      difficulty
    };
  }

  public toAppBlock(block: ApiBlock): AppBlock {
    return {
      height: block.height,
      confirmations: block.confirmations,
      nonce: block.nonce,
      size: block.size,
      virtualSize: block.size,
      hash: block.hash,
      time: new Date(block.time).getTime() / 1000,
      tx: {
        length: block.transactionCount
      },
      txlength: block.transactionCount,
      previousblockhash: block.previousBlockHash,
      nextblockhash: block.nextBlockHash,
      poolInfo: {
        poolName: block.minedBy,
        url: ''
      },
      reward: block.reward
    };
  }

  public getCurrentHeight(
    chainNetwork: ChainNetwork
  ): Observable<ApiEthBlock & ApiUtxoCoinBlock> {
    const heightUrl = `${this.api.getUrl(chainNetwork)}/block/tip`;
    return this.httpClient.get<ApiEthBlock & ApiUtxoCoinBlock>(heightUrl);
  }

  public getBlocks(
    chainNetwork: ChainNetwork,
    numBlocks: number = 10
  ): Observable<ApiEthBlock[] & ApiUtxoCoinBlock[]> {
    const url = `${this.api.getUrl(chainNetwork)}/block?limit=${numBlocks}`;
    return this.httpClient.get<ApiEthBlock[] & ApiUtxoCoinBlock[]>(url);
  }

  /**
   * example: http://localhost:8100/api/BTC/regtest/block?since=582&limit=100&paging=height&direction=1
   */
  public pageBlocks(
    since: number,
    numBlocks: number = 10,
    chainNetwork: ChainNetwork
  ): Observable<ApiEthBlock[] & ApiUtxoCoinBlock[]> {
    const url = `${this.api.getUrl(chainNetwork)}/block?since=${since}&limit=${numBlocks}&paging=height&direction=-1`;
    return this.httpClient.get<ApiEthBlock[] & ApiUtxoCoinBlock[]>(url);
  }

  public getBlock(
    hash: string,
    chainNetwork: ChainNetwork
  ): Observable<ApiEthBlock & ApiUtxoCoinBlock> {
    const url = `${this.api.getUrl(chainNetwork)}/block/${hash}`;
    return this.httpClient.get<ApiEthBlock & ApiUtxoCoinBlock>(url);
  }
}