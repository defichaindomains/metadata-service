import { ethers } from "ethers";
import { BaseError } from "./base";

export interface UnsupportedNetwork {}
export class UnsupportedNetwork extends BaseError {}
import { ADDRESS_DFI_REGISTRY } from "./config";

const NETWORK = {
  DMC: "metachain",
};

const NETWORK_ID: any = {
  1130: "metachain",
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
    case NETWORK.DMC:
      SUBGRAPH_URL =
        "https://proxy-production-8e85.up.railway.app/https://subgraph.defichain-domains.com/subgraphs/name/defichaindomains/subgraph";
      RPC_URL = `https://eth.mainnet.ocean.jellyfishsdk.com/`;
      NETWORKISH = {
        name: "mumbai",
        chainId: 1130,
        ensAddress: ADDRESS_DFI_REGISTRY,
      };
      break;

    default:
      throw new UnsupportedNetwork(`Unknown network '${network}'`);
  }

  const provider = new ethers.providers.StaticJsonRpcProvider(
    RPC_URL,
    NETWORKISH
  );
  return { RPC_URL, SUBGRAPH_URL, provider };
}
