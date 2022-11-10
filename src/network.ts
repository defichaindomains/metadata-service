import { ethers } from 'ethers';
import { BaseError } from './base';

export interface UnsupportedNetwork {}
export class UnsupportedNetwork extends BaseError { }
import { ADDRESS_DFI_REGISTRY } from './config';

const NETWORK = {
  MUMBAI: 'mumbai',
};

const NETWORK_ID: any = {
  80001: 'mumbai',
  
};

export function getNetworkById(networkId: number): any {
  const network: string = NETWORK_ID[networkId];
  return getNetwork(network);
}

export default function getNetwork(network: string): any {
  // currently subgraphs used under this function are outdated,
  // we will have namewrapper support and more attributes when latest subgraph goes to production
  let SUBGRAPH_URL: string;
  let RPC_URL: string;
  let NETWORKISH: any = undefined;
  switch (network) {
    case NETWORK.MUMBAI:
      SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/miu-digital/dfi-domains-sub-graph-mumbai';
      RPC_URL = `https://polygon-mumbai.g.alchemy.com/v2/EZKHx-Re3Vy6pE9s2XUIgiJotOsEqUQW`;
      NETWORKISH = {
        name: "mumbai",
        chainId: 80001,
        ensAddress: ADDRESS_DFI_REGISTRY
      }
      break;
   
    default:
      throw new UnsupportedNetwork(`Unknown network '${network}'`);
  }


  const provider = new ethers.providers.StaticJsonRpcProvider(RPC_URL, NETWORKISH);
  return { RPC_URL, SUBGRAPH_URL, provider };
}
