#![no_std]

use sails_rs::{
    prelude::*,
    gstd::{
        calls::GStdRemoting,
        msg
    }
};

pub mod services;
pub mod states;
pub mod clients;

use services::mini_dexs_service::MiniDexsService;
use clients::extended_vft_client::Vft as VftClient;

// use states::receiver_state::ReceiverState;

#[derive(Default)]
pub struct MiniDexsProgram;

#[program]
impl MiniDexsProgram {
    pub fn new() -> Self {
        MiniDexsService::<VftClient<GStdRemoting>>::seed(
            msg::source(), 
            None,
            None, 
            0,
            0
        );

        Self
    }

    pub fn new_with_data(
        vft_contract_id: Option<ActorId>,
        gaia_company_token:Option<ActorId>,
        min_tokens_to_add: u128,
        tokens_per_vara: u128
    ) -> Self {
        MiniDexsService::<VftClient<GStdRemoting>>::seed(
            msg::source(), 
            vft_contract_id,
            gaia_company_token,
            min_tokens_to_add,
            tokens_per_vara
        );

        Self
    }

    #[route("MiniDEXs")]
    pub fn mini_dexs_svc(&self) -> MiniDexsService<VftClient<GStdRemoting>> {
        let vft_client = VftClient::new(GStdRemoting);
        MiniDexsService::new(vft_client)
    }
}