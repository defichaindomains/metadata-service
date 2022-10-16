# dfi-metadata-service

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![Travis][travis-shield]][travis-url]

## API

### Request

- **network:** Name of the chain to query for. (metachain | mumbai | ...)
- **contactAddress:** accepts contractAddress of the NFT which represented by the tokenId
- **NFT v1 - tokenId:** accepts labelhash of Defichain Domains name in both hex and int format
- **NFT v2 - tokenId:** accepts namehash of Defichain Domains name in both hex and int format

```
/{networkName}/{contractAddress}/{tokenId}
```

Request (example)

https://metadata.defichain-domains.com/metachain/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/42219085255511335250589442208301538195142221433306354426240614732612795430543/

### Response (example)

```json
{
  "name": "pat.dfi",
  "description": "pat.dfi, a Defichain Domain name.",
  "attributes": [
    {
      "trait_type": "Created Date",
      "display_type": "date",
      "value": 1580803395000
    },
    {
      "trait_type": "Registration Date",
      "display_type": "date",
      "value": 1580803395000
    }
  ],
  "name_length": 4,
  "short_name": null,
  "length": 0,
  "url": "https://app.defichain-domains.com/name/pat.dfi",
  "version": 0,
  "background_image": "https://metadata.defichain-domains.com/metachain/avatar/pat.dfi",
  "image_url": "https://metadata.defichain-domains.com/metachain/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/0x5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f/image"
}
```

## How to setup

```
git clone https://github.com/bchdomains/dfi-metadata-service.git
cd dfi-metadata-service
cp .env.org .env // Fill in Vars
yarn
yarn dev
```

## How to deploy

```
yarn deploy
```

## How to test

Regular unit test;

```
yarn test
```

Unit test + coverage;

```
yarn test:cov
```
