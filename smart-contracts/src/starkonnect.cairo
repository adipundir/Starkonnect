use starknet::{ContractAddress};

#[derive(Drop, Clone, Serde, starknet::Store)]
pub struct Match {
    pub user_address: ContractAddress,
    pub name: ByteArray,
    pub bio: ByteArray,
    pub dev_score: u64,
    pub compatibility_score: u64,
    pub remark: ByteArray,
}

#[starknet::interface]
pub trait IStarkonnectCore<TContractState> {
    fn create_profile(ref self: TContractState);
    fn buy_premium(ref self: TContractState);
    fn withdraw_balance(ref self: TContractState);
    fn is_premium_user(self: @TContractState, user: ContractAddress) -> bool;
    fn get_premium_price(self: @TContractState) -> u256;
    fn get_balance(self: @TContractState, user: ContractAddress) -> u256;
    fn get_user_matches(self: @TContractState, user: ContractAddress) -> Array<Match>;
}

#[starknet::contract]
mod starkonnectCore {
    use starknet::event::EventEmitter;
    use ReentrancyGuardComponent::InternalTrait;
    use starknet::{get_caller_address, get_contract_address, ContractAddress};
    use starknet::storage::{
        StoragePointerWriteAccess, StoragePointerReadAccess, Vec, VecTrait, MutableVecTrait, Map,
        StoragePathEntry,
    };
    use super::Match;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::security::ReentrancyGuardComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(
        path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent,
    );

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ReentrancyInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        users: Vec<ContractAddress>,
        user_matches_map: Map<ContractAddress, Vec<Match>>,
        user_balance: Map<ContractAddress, u256>,
        premium_user: Map<ContractAddress, bool>,
        premium_price: u256,
        token: ContractAddress,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[derive(Drop, starknet::Event)]
    struct UserCreated {
        user_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct PremiumBought {
        user_address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct Withdrawal {
        user_address: ContractAddress,
        amount: u256,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserCreated: UserCreated,
        PremiumBought: PremiumBought,
        Withdrawal: Withdrawal,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        token: ContractAddress,
        premium_price: u256,
        owner: ContractAddress,
    ) {
        self.premium_price.write(premium_price);
        self.token.write(token);
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl StarkonnectImpl of super::IStarkonnectCore<ContractState> {
        fn create_profile(ref self: ContractState) {
            let user_address = get_caller_address();
            assert!(!self._user_exists(user_address), "User already exists");
            self.users.append().write(user_address);
            self.emit(UserCreated { user_address });
        }

        fn buy_premium(ref self: ContractState) {
            self.reentrancy_guard.start();
            let user_address = get_caller_address();
            assert!(self._user_exists(user_address), "User does not exist");
            assert!(!self.premium_user.entry(user_address).read(), "User already paid premium");

            let token_address = self.token.read();
            let token = IERC20Dispatcher { contract_address: token_address };
            let premium_price = self.premium_price.read();

            assert!(token.balance_of(user_address) >= premium_price, "Insufficient balance");
            assert!(
                token.allowance(user_address, get_contract_address()) >= premium_price,
                "Insufficient allowance",
            );

            let success = token.transfer_from(user_address, get_contract_address(), premium_price);
            assert!(success, "Transfer failed");
            self.premium_user.entry(user_address).write(true);
            self.emit(PremiumBought { user_address });

            let num_users = self.users.len().into();
            let users_share = 97 * premium_price / 100;
            let each_user_share = users_share / num_users;
            let platform_share = premium_price - num_users * each_user_share;

            self._increase_balance(self.ownable.owner(), platform_share);
            for i in 0..self.users.len() {
                let user = self.users.at(i).read();
                self._increase_balance(user, each_user_share);
            };
            self.reentrancy_guard.end();
        }

        fn withdraw_balance(ref self: ContractState) {
            self.reentrancy_guard.start();
            let user_address = get_caller_address();
            let is_owner = user_address == self.ownable.owner();

            assert!(self._user_exists(user_address) || is_owner, "User does not exist");

            let balance = self.get_balance(user_address);
            let token_address = self.token.read();
            let token = IERC20Dispatcher { contract_address: token_address };

            let success = token.transfer(user_address, balance);
            assert!(success, "Transfer failed");
            self.emit(Withdrawal { user_address, amount: balance });

            self._decrease_balance(user_address, balance);
            self.reentrancy_guard.end();
        }

        fn is_premium_user(self: @ContractState, user: ContractAddress) -> bool {
            self.premium_user.entry(user).read()
        }

        fn get_balance(self: @ContractState, user: ContractAddress) -> u256 {
            self.user_balance.entry(user).read()
        }

        fn get_user_matches(self: @ContractState, user: ContractAddress) -> Array<Match> {
            assert!(self._user_exists(user), "User does not exist");
            let mut matches = ArrayTrait::new();
            let user_matches_entry = self.user_matches_map.entry(user);
            for i in 0..user_matches_entry.len() {
                matches.append(user_matches_entry.at(i).read());
            };
            matches
        }

        fn get_premium_price(self: @ContractState) -> u256 {
            self.premium_price.read()
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn _user_exists(self: @ContractState, user: ContractAddress) -> bool {
            let mut found = false;
            for i in 0..self.users.len() {
                if self.users.at(i).read() == user {
                    found = true;
                }
            };
            found
        }

        fn _increase_balance(ref self: ContractState, user: ContractAddress, amount: u256) {
            let balance = self.user_balance.entry(user).read();
            self.user_balance.entry(user).write(balance + amount);
        }

        fn _decrease_balance(ref self: ContractState, user: ContractAddress, amount: u256) {
            assert!(self.user_balance.entry(user).read() >= amount, "Insufficient balance");
            let balance = self.user_balance.entry(user).read();
            self.user_balance.entry(user).write(balance - amount);
        }
    }
}
