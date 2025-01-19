export const StarKonnectABI = [
  {
    type: "impl",
    name: "StarkonnectImpl",
    interface_name: "starkonnet_contracts::starkonnect::IStarkonnectCore",
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "struct",
    name: "starkonnet_contracts::starkonnect::Match",
    members: [
      {
        name: "user_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "name",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "bio",
        type: "core::byte_array::ByteArray",
      },
      {
        name: "dev_score",
        type: "core::integer::u64",
      },
      {
        name: "compatibility_score",
        type: "core::integer::u64",
      },
      {
        name: "remark",
        type: "core::byte_array::ByteArray",
      },
    ],
  },
  {
    type: "interface",
    name: "starkonnet_contracts::starkonnect::IStarkonnectCore",
    items: [
      {
        type: "function",
        name: "create_profile",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "buy_premium",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "withdraw_balance",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "is_premium_user",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_premium_price",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_balance",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_user_matches",
        inputs: [
          {
            name: "user",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<starkonnet_contracts::starkonnect::Match>",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "OwnableImpl",
    interface_name: "openzeppelin_access::ownable::interface::IOwnable",
  },
  {
    type: "interface",
    name: "openzeppelin_access::ownable::interface::IOwnable",
    items: [
      {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer_ownership",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "renounce_ownership",
        inputs: [],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "token",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "premium_price",
        type: "core::integer::u256",
      },
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "starkonnet_contracts::starkonnect::starkonnectCore::UserCreated",
    kind: "struct",
    members: [
      {
        name: "user_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "starkonnet_contracts::starkonnect::starkonnectCore::PremiumBought",
    kind: "struct",
    members: [
      {
        name: "user_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "starkonnet_contracts::starkonnect::starkonnectCore::Withdrawal",
    kind: "struct",
    members: [
      {
        name: "user_address",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    kind: "struct",
    members: [
      {
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "OwnershipTransferred",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
        kind: "nested",
      },
      {
        name: "OwnershipTransferStarted",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "starkonnet_contracts::starkonnect::starkonnectCore::Event",
    kind: "enum",
    variants: [
      {
        name: "UserCreated",
        type: "starkonnet_contracts::starkonnect::starkonnectCore::UserCreated",
        kind: "nested",
      },
      {
        name: "PremiumBought",
        type: "starkonnet_contracts::starkonnect::starkonnectCore::PremiumBought",
        kind: "nested",
      },
      {
        name: "Withdrawal",
        type: "starkonnet_contracts::starkonnect::starkonnectCore::Withdrawal",
        kind: "nested",
      },
      {
        name: "OwnableEvent",
        type: "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
        kind: "flat",
      },
      {
        name: "ReentrancyGuardEvent",
        type: "openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event",
        kind: "flat",
      },
    ],
  },
] as const;
