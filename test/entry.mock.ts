import { utils } from 'ethers';
import nock from 'nock';
import { Version } from '../src/base';
import { Metadata } from '../src/metadata';
import getNetwork from '../src/network';
import { GET_DOMAINS, GET_REGISTRATIONS } from '../src/subgraph';
import {
  DomainResponse,
  MockEntryBody,
  RegistrationResponse,
} from './interface';
const { SUBGRAPH_URL: subgraph_url } = getNetwork('rinkeby');
const SUBGRAPH_URL = new URL(subgraph_url);
const namehash = require('@ensdomains/eth-ens-namehash'); // no types

export class MockEntry {
  public name: string;
  public namehash: string;
  public domainResponse!: DomainResponse | null;
  public registrationResponse: RegistrationResponse | null = null;
  public expect: Metadata | string;
  constructor({
    name,
    hasImageKey = null,
    image,
    owner = '0x97ba55f61345665cf08c4233b9d6e61051a43b18',
    parent = '0x4062ae9e99543fadaf6946b98c6f12538a99834a89521ef85301d7d91e281c8d',
    resolver = null,
    registration = false,
    statusCode = 200,
    unknown = false,
    version = Version.v2,
    persist = false
  }: MockEntryBody) {
    if (!name) throw Error('There must be a valid name.');
    this.name = name;
    this.namehash = namehash.hash(name);

    if (unknown) {
      this.expect = 'No results found.';
      nock(SUBGRAPH_URL.origin)
        .post(SUBGRAPH_URL.pathname, {
          query: GET_DOMAINS,
          variables: {
            tokenId: this.namehash,
          },
        })
        .reply(statusCode, {
          data: null,
        }).persist(persist);
      return;
    }

    const randomDate = this.getRandomDate();
    const labelName = name.split('.')[0];
    const labelhash = utils.keccak256(utils.toUtf8Bytes(labelName));
    const _metadata = new Metadata({
      name,
      created_date: +randomDate,
      tokenId: this.namehash,
      version,
    });

    (_metadata as Metadata).setImage(`https://metadata.ens.domains/rinkeby/0x4D83cea620E3864F912046b73bB3a6c04Da75990/${this.namehash}/image`);
    (_metadata as Metadata).setBackground(`https://metadata.ens.domains/rinkeby/avatar/${name}`)


    this.domainResponse = {
      domain: {
        createdAt: randomDate,
        id: this.namehash,
        labelName,
        labelhash,
        name,
        owner: { id: owner },
        parent: {
          id: parent,
        },
        resolver,
        hasImageKey,
      },
    };

    if (registration) {
      this.registrationResponse = {
        registrations: [
          {
            expiryDate: randomDate,
            labelName: name,
            registrationDate: randomDate,
          },
        ],
      };
      _metadata.addAttribute({
        trait_type: 'Registration Date',
        display_type: 'date',
        value: +randomDate * 1000,
      })
      _metadata.addAttribute({
        trait_type: 'Expiration Date',
        display_type: 'date',
        value: +randomDate * 1000,
      })

      nock(SUBGRAPH_URL.origin)
        .post(SUBGRAPH_URL.pathname, {
          query: GET_REGISTRATIONS,
          variables: {
            labelhash,
          },
        })
        .reply(statusCode, {
          data: this.registrationResponse,
        }).persist(persist);
    }

    this.expect = JSON.parse(JSON.stringify(_metadata)); //todo: find better serialization option

    nock(SUBGRAPH_URL.origin)
      .post(SUBGRAPH_URL.pathname, {
        query: GET_DOMAINS,
        variables: {
          tokenId: this.namehash,
        },
      })
      .reply(statusCode, {
        data: this.domainResponse,
      }).persist(persist);
  }

  getRandomDate(
    start: Date = new Date(2017, 3, 4),
    end: Date = new Date()
  ): string {
    return (
      new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      ).getTime() / 1000
    ).toFixed(0);
  }
}
