# dfi-metadata-service

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![Travis][travis-shield]][travis-url]

## API

### Request

- **network:** Name of the chain to query for. (metachain | ...)
- **contactAddress:** accepts contractAddress of the NFT which represented by the tokenId
- **NFT v1 - tokenId:** accepts labelhash of Defichain Domains name in both hex and int format
- **NFT v2 - tokenId:** accepts namehash of Defichain Domains name in both hex and int format

```
/{networkName}/{contractAddress}/{tokenId}
```

Request (example)

https://metadata.defichain-domains.com/metachain/0x562F812346a7078B5304705cE65C48929E61050c/0x5aefc7844738463bbfeb7c6b76c65e3e76f112c93e4486dfb3be027d0fd114dd/

### Response (example)

```json
{
  "name": "stefano.dfi",
  "description": "stefano.dfi, a Defichain Domain name.",
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
  "url": "https://app.defichain-domains.com/name/stefano.dfi",
  "version": 0,
  "background_image": "https://metadata.defichain-domains.com/metachain/avatar/stefano.dfi",
  "image_url": "https://metadata.defichain-domains.com/metachain/0x562F812346a7078B5304705cE65C48929E61050c/0x5aefc7844738463bbfeb7c6b76c65e3e76f112c93e4486dfb3be027d0fd114dd/image.svg"
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
