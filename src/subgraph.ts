import { gql } from 'graphql-request';

const DFI_NAMEHASH =
  '0x456b2fc8f8d0e69c7692da4ac45c1337cd08999944aa5aa106b9863c31799ef3';

export const GET_DOMAINS = gql`
  query getDomains($tokenId: String) {
    domain(id: $tokenId) {
      id
      labelhash
      name
      parent {
        id
      }
      resolver {
        texts
      }
    }
  }
`;

export const GET_DOMAINS_BY_LABELHASH = gql`
  query getDomains($tokenId: String) {
    domains(
      where: {
        parent: "${DFI_NAMEHASH}",
        labelhash: $tokenId
      }
    ) {
      id
      labelhash
      name
      createdAt
      parent {
        id
      }
      resolver {
        texts
      }
    }
  }
`;

export const GET_REGISTRATIONS = gql`
  query getRegistration($labelhash: String) {
    registrations(
      orderBy: registrationDate
      orderDirection: desc
      where: { id: $labelhash }
    ) {
      labelName
      registrationDate
    }
  }
`;
