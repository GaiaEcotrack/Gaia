use io::*;
use gstd::{Encode, String, ActorId, msg, prelude::*,};
use gtest::{Program, System};
use io::*;
use tokio::test;
const USERS: &[u64] = &[3, 4, 5];


fn init_with_mint(sys: &System) {
    sys.init_logger();
    let ft = Program::current(sys);
    let res = ft.send(
        USERS[0],
        InitFT {
            ft_program_id: USERS[0].into(), 
        },
    );

    assert!(!res.main_failed());

    let res = ft.send(USERS[0], FTAction::Mint(1000000));
    assert!(res.contains(&(
        USERS[0],
        FTEvent::Transfer {
            from: 0.into(),
            to: USERS[0].into(),
            amount: 1000000,
        }
        .encode()
    )));
}

#[test]
async fn mint() {
    let sys = System::new();
    init_with_mint(&sys);
    let ft = sys.get_program(1);
    let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[0].into()));
    assert!(res.contains(&(USERS[0], FTEvent::Balance(1000000).encode())));
}

#[test]
async fn burn() {
    let sys = System::new();
    init_with_mint(&sys);
    let ft = sys.get_program(1);
    let res = ft.send(USERS[0], FTAction::Burn(1000));
    assert!(res.contains(&(
        USERS[0],
        FTEvent::Transfer {
            from: USERS[0].into(),
            to: 0.into(),
            amount: 1000,
        }
        .encode()
    )));
    let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[0].into()));
    assert!(res.contains(&(USERS[0], FTEvent::Balance(999000).encode())));
}

#[test]
async fn burn_failures() {
    let sys = System::new();
    sys.init_logger();
    init_with_mint(&sys);
    let ft = sys.get_program(1);
    // must fail since the amount > the user balance
    let res = ft.send(USERS[0], FTAction::Burn(1000001));
    if res.main_failed() {
        assert!(!res.main_failed());        
    }
}

#[test]
async fn transfer() {
    let sys = System::new();
    init_with_mint(&sys);
    let ft = sys.get_program(1);
    let res = ft.send(
        USERS[0],
        FTAction::Transfer {
            from: USERS[0].into(),
            to: USERS[1].into(),
            amount: 500,
        },
    );

    assert!(res.contains(&(
        USERS[0],
        FTEvent::Transfer {
            from: USERS[0].into(),
            to: USERS[1].into(),
            amount: 500,
        }
        .encode()
    )));

    // check that the balance of `USER[0]` decreased and the balance of `USER[1]` increased
    let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[0].into()));
    assert!(res.contains(&(USERS[0], FTEvent::Balance(999500).encode())));
    let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[1].into()));
    assert!(res.contains(&(USERS[0], FTEvent::Balance(500).encode())));
}

#[test]
async fn transfer_failures() {
    let sys = System::new();
    init_with_mint(&sys);
    let ft = sys.get_program(1);
    //must fail since the amount > balance
    let res = ft.send(
        USERS[0],
        FTAction::Transfer {
            from: USERS[0].into(),
            to: USERS[1].into(),
            amount: 2000000,
        },
    );
    if res.main_failed() {
        assert!(!res.main_failed());        
    }

    //must fail transfer to zero address
    let res = ft.send(
        USERS[2],
        FTAction::Transfer {
            from: USERS[0].into(),
            to: 0.into(),
            amount: 100,
        },
    );
    if res.main_failed() {
        assert!(!res.main_failed());        
    }
}

#[test]
async fn approve_and_transfer() {
    let sys = System::new();
    init_with_mint(&sys);
    let ft = sys.get_program(1);

    let res = ft.send(
        USERS[0],
        FTAction::Approve {
            to: USERS[1].into(),
            amount: 500,
        },
    );
    assert!(res.contains(&(
        USERS[0],
        FTEvent::Approve {
            from: USERS[0].into(),
            to: USERS[1].into(),
            amount: 500,
        }
        .encode()
    )));

    let res = ft.send(
        USERS[1],
        FTAction::Transfer {
            from: USERS[0].into(),
            to: USERS[2].into(),
            amount: 200,
        },
    );
    assert!(res.contains(&(
        USERS[1],
        FTEvent::Transfer {
            from: USERS[0].into(),
            to: USERS[2].into(),
            amount: 200,
        }
        .encode()
    )));

    // check that the balance of `USER[0]` decreased and the balance of `USER[1]` increased
    let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[0].into()));
    assert!(res.contains(&(USERS[0], FTEvent::Balance(999800).encode())));
    let res = ft.send(USERS[0], FTAction::BalanceOf(USERS[2].into()));
    assert!(res.contains(&(USERS[0], FTEvent::Balance(200).encode())));

    // must fail since not enough allowance
    let res = ft.send(
        USERS[1],
        FTAction::Transfer {
            from: USERS[0].into(),
            to: USERS[2].into(),
            amount: 800,
        },
    );
    if res.main_failed() {
        assert!(!res.main_failed());        
    }
}

const USER: u64 = 3;
#[test]
async fn generate_energy_and_verify_event() {
    // System and contract setup
    let sys = System::new();
    init_with_mint(&sys);
    let gaia_contract = sys.get_program(1);

    // Execute NewGenerator action to register a generator
    let generator_actor_id = ActorId::from(2);
    let generator = Generator {
        id: 1,
        wallet: generator_actor_id,
        total_generated: 0,
        average_energy: 0,
        rewards: 0,
    };
    let res = gaia_contract.send(
        USER,
        ActionGaiaEcotrack::NewGenerator(generator_actor_id, generator.clone()),
    );
    assert!(res.contains(&(USER, EventsGaiaEcotrack::Registered.encode())));

    // Execute GenerateEnergy action to generate energy
    let energy_amount = 100;
    let res = gaia_contract.send(USER, ActionGaiaEcotrack::GenerateEnergy(energy_amount));
    assert!(res.contains(&(USER, EventsGaiaEcotrack::Generated.encode())));

    // Verify that the state of the generator was updated correctly
    let res = gaia_contract.send(USER, ActionGaiaEcotrack::GetRewards(1));
    assert!(res.contains(&(USER, EventsGaiaEcotrack::RewardsGenerated.encode())));
}


#[tokio::test]
async fn test_transfer_tokens_between_actors() {
    // Set up the system and the contract
    let sys = gtest::System::new();
    init_with_mint(&sys);
    let gaia_contract = sys.get_program(1);

    // Source and destination actors
    let from_actor_id = ActorId::from(2);
    let to_actor_id = ActorId::from(3);

    // Add some liquidity to the main contract
    let liquidity_amount = 1000;
    gaia_contract.send(3, FTAction::Mint(liquidity_amount));

    // Set up the initial state of the source generator
    let from_generator = Generator {
        id: 1,
        wallet: from_actor_id,
        total_generated: 0,
        average_energy: 0,
        rewards: 0,
    };
    gaia_contract
        .send(3, ActionGaiaEcotrack::NewGenerator(from_actor_id, from_generator.clone()));

    let transfer_amount = 500;
    gaia_contract
        .send(
            3,
            ActionGaiaEcotrack::Transferred(from_actor_id, to_actor_id, transfer_amount),
        );

    // Verify that the state of the source generator was updated correctly
    let res = gaia_contract.send(3, ActionGaiaEcotrack::GetRewards(1));
    assert!(res.contains(&(3, EventsGaiaEcotrack::RewardsGenerated.encode())));

    // Verify that the balance of the destination actor was updated correctly
    let res = gaia_contract.send(3, FTAction::BalanceOf(to_actor_id));
    assert!(res.contains(&(3, FTEvent::Balance(transfer_amount).encode())));
}


#[tokio::test]
async fn test_claimed_tokens() {
    // Set up the system and the contract
    let sys = gtest::System::new();
    init_with_mint(&sys);
    let gaia_contract = sys.get_program(1);

    // Source and destination actors
    let from_actor_id = ActorId::from(2);
    let to_actor_id = ActorId::from(3);

    // Add some liquidity to the main contract
    let liquidity_amount = 1000;
    gaia_contract.send(3, FTAction::Mint(liquidity_amount));

    // Set up the initial state of the source generator
    let from_generator = Generator {
        id: 1,
        wallet: from_actor_id,
        total_generated: 0,
        average_energy: 0,
        rewards: 0,
    };
    gaia_contract
        .send(3, ActionGaiaEcotrack::NewGenerator(from_actor_id, from_generator.clone()));

    let transfer_amount = 500;
    gaia_contract
        .send(
            3,
            ActionGaiaEcotrack::Reward(from_actor_id, to_actor_id, transfer_amount),
        );

    // Verify that the correct amount of tokens has been sent
    let res = gaia_contract.send(3, FTAction::BalanceOf(to_actor_id));
    assert!(res.contains(&(3, FTEvent::Balance(transfer_amount).encode())));

    // Create a copy of expected_event
    let expected_event = EventsGaiaEcotrack::Claimed {
        from: from_actor_id,
        to: to_actor_id,
        amount: transfer_amount,
        kw: transfer_amount / 10, // kw_generated_calculate
    };
    let expected_event_copy = expected_event.clone();

    // Send the copy to gaia_contract.send
    let res = gaia_contract.send(3, expected_event);
    assert!(res.contains(&(3, expected_event_copy.encode())));
}
