import { request } from 'graphql-request';
import { ethers } from 'ethers';
import {
  GET_REGISTRATIONS,
  GET_DOMAINS,
  GET_DOMAINS_BY_LABELHASH,
} from './subgraph';
import { Metadata } from './metadata';
import { getAvatarImage } from './avatar';
import { Version } from './base';
import { SERVER_URL } from './config';

const eth =
  '0x456b2fc8f8d0e69c7692da4ac45c1337cd08999944aa5aa106b9863c31799ef3';
const IMAGE_KEY = 'domains.ens.nft.image';

export async function getDomain(
  provider: any,
  networkName: string,
  SUBGRAPH_URL: string,
  contractAddress: string,
  tokenId: string,
  version: Version,
  loadImages: boolean = true
): Promise<Metadata> {
  let hexId: string, intId;
  if (!tokenId.match(/^0x/)) {
    intId = tokenId;
    hexId = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(ethers.BigNumber.from(tokenId)),
      32
    );
    console.log(hexId)
  } else {
    intId = ethers.BigNumber.from(tokenId).toString();
    hexId = tokenId;
  }
  const queryDocument: any = GET_DOMAINS_BY_LABELHASH;
  const result = await request(SUBGRAPH_URL, queryDocument, { tokenId: hexId });
  console.log(result)
  const domain = result.domains[0];
  console.log(domain)
  const { name, labelhash, createdAt, parent, resolver } = domain;

  const hasImageKey =
    resolver && resolver.texts && resolver.texts.includes(IMAGE_KEY);
  const metadata = new Metadata({
    name,
    created_date: createdAt,
    tokenId: hexId,
    version,
  });

  async function requestAvatar() {
    try {
      const [buffer, mimeType] = await getAvatarImage(provider, name);
      const base64 = buffer.toString('base64');
      return [base64, mimeType];
    } catch {
      /* do nothing */
    }
  }

  async function requestNFTImage() {
    if (hasImageKey) {
      const r = await provider.getResolver(name);
      const image = await r.getText(IMAGE_KEY);
      return image;
    }
  }

  async function requestMedia() {
    if (loadImages) {
      const [avatar, imageNFT] = await Promise.all([
        requestAvatar(),
        requestNFTImage(),
      ]);
      if (imageNFT) {
        metadata.setImage(imageNFT);
      } else {
        if (avatar) {
          const [base64, mimeType] = avatar;
          metadata.setBackground(base64, mimeType);
        }
        metadata.generateImage();
      }
    } else {
      metadata.setBackground(
        `${SERVER_URL}/${networkName}/avatar/${name}`
      );
      metadata.setImage(
        `${SERVER_URL}/${networkName}/${contractAddress}/${hexId}/image.svg`
      );
    }
  }

  async function requestAttributes() {
    if (true || parent.id === eth) {
      const { registrations } = await request(SUBGRAPH_URL, GET_REGISTRATIONS, {
        labelhash,
      });
      const registration = registrations[0];
      if (registration) {
        metadata.addAttribute({
          trait_type: 'Registration Date',
          display_type: 'date',
          value: registration.registrationDate * 1000,
        });
        metadata.addAttribute({
          trait_type: 'Expiration Date',
          display_type: 'date',
          value: registration.expiryDate * 1000,
        });
      }
    }
  }
  await Promise.all([requestMedia(), requestAttributes()]);
  return metadata;
}
