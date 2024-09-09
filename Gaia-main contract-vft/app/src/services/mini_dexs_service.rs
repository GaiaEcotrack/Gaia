use sails_rs::calls::{Call, Query};
use sails_rs::{
    prelude::*,
    gstd::msg,
};

use gstd::exec;
use crate::states::mini_dexs_state::MintingSchedule;
use crate::states::mini_dexs_state::Devices;
use crate::states::mini_dexs_state::MiniDexsState;
use crate::clients::extended_vft_client::traits::Vft;

static mut MINI_DEX_STATE: Option<MiniDexsState> = None;

const ONE_TVARA: u128 = 1_000_000_000_000; // Value of one TVara and Vara

pub struct MiniDexsService<VftClient> {
    pub vft_client: VftClient
}

#[service]
impl<VftClient> MiniDexsService<VftClient> 
where VftClient: Vft
{
    pub fn seed(
        owner: ActorId,
        vft_contract_id: Option<ActorId>,
        gaia_company_token: Option<ActorId>,
        min_tokens_to_add: u128,
        tokens_per_vara: u128
    ) {
        unsafe {
            MINI_DEX_STATE = Some(
                MiniDexsState {
                    owner,
                    vft_contract_id,
                    gaia_company_token,
                    min_tokens_to_add,
                    tokens_per_vara,
                    devices: Vec::new(),
                    minting_schedules:Vec::new()
                }
            );
        };
    }

    pub fn new(
        vft_client: VftClient
    ) -> Self {
        Self {
            vft_client
        }
    }

    /// ## Change vft contract id
    /// Only the contract owner can perform this action
    pub fn set_vft_contract_id(&mut self, vft_contract_id: ActorId) -> MiniDexsEvents {
        let state = self.state_mut();

        if msg::source() != state.owner {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OnlyOwnerCanDoThatAction
            );
        }

        state.vft_contract_id = Some(vft_contract_id);

        MiniDexsEvents::VFTContractIdSet
    }

    /// ## Change the minimum number of tokens to add to the contract
    /// Only the contract owner can perform this action
    pub fn set_min_tokens_to_add(&mut self, min_tokens_to_add: u128) -> MiniDexsEvents {
        let state = self.state_mut();

        if msg::source() != state.owner {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OnlyOwnerCanDoThatAction
            );
        }

        state.min_tokens_to_add = min_tokens_to_add;

        MiniDexsEvents::MinTokensToAddSet
    }

     /// ## Agrega un nuevo dispositivo
    /// Solo el propietario del contrato puede realizar esta acción
    pub fn add_device(&mut self, owner: ActorId, serial_number: String , location:String , type_device: String , device_brand:String) -> MiniDexsEvents {
        let state = self.state_mut();
    
        if msg::source() != state.owner {
            return MiniDexsEvents::Error(MiniDexsErrors::OnlyOwnerCanDoThatAction);
        }
    
        // Verifica si el dispositivo ya existe
        if state.devices.iter().any(|device| device.owner == owner) {
            return MiniDexsEvents::Error(MiniDexsErrors::UserAlreadyExists);
        }
    
        // Agrega el nuevo dispositivo
        state.devices.push(Devices {
            owner,
            serial_number,
            location,
            type_device,
            device_brand

        });
    
        MiniDexsEvents::DevicesAdded("Device successfully added".to_string())
    }
    /// ## Consulta todos los dispositivos
    pub fn get_devices(&self) -> MiniDexsQueryEvents {
            let state = self.state_ref();
            MiniDexsQueryEvents::Devices(state.devices.clone())
    }

    pub fn get_mitings(&self) -> MiniDexsQueryEvents {
        let state = self.state_ref();
        MiniDexsQueryEvents::Mitings(state.minting_schedules.clone())
}



        /// ## Programar un minting
    /// Permite al propietario del contrato programar una fecha de minting de tokens
    pub fn schedule_minting(&mut self, wallet: ActorId, amount: u128, minting_time: u64) -> MiniDexsEvents {
        let state = self.state_mut();

        if msg::source() != state.owner {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OnlyOwnerCanDoThatAction
            );
        }

        // Agregar el minting programado
        state.minting_schedules.push(MintingSchedule {
            wallet,
            amount,
            minting_time,
        });

        MiniDexsEvents::MintingScheduled("Successfully programmed minting".to_string())
    }

    /// ## Ejecutar mintings programados
    /// Revisa la lista de mintings programados y ejecuta aquellos cuyo tiempo ha llegado
    pub async fn execute_mintings(&mut self, time:u64) -> MiniDexsEvents {
        let state = self.state_mut();
        let current_time = time; // Función que obtiene el tiempo actual

        // Filtra los mintings que ya deberían ejecutarse
        let due_mintings: Vec<MintingSchedule> = state.minting_schedules
            .iter()
            .filter(|schedule| schedule.minting_time <= current_time)
            .cloned()
            .collect();

        for mint in due_mintings.iter() {
            // Ejecutar el minting llamando al contrato de VFT para mintear tokens
            let result = self.mint_tokens_to_user(mint.wallet, mint.amount).await;

                    // Manejar errores en el minting
        if let MiniDexsEvents::Error(error) = result {
            return MiniDexsEvents::Error(error);
        }

            // Remover los mintings ejecutados de la lista
            state.minting_schedules.retain(|schedule| schedule.minting_time > current_time);
        }

        MiniDexsEvents::MintingExecuted
    }

    /// ## Change the number of tokens to exchange for one rod
    /// Only the contract owner can perform this action
    pub fn set_tokens_per_vara(&mut self, tokens_per_vara: u128) -> MiniDexsEvents {
        let state = self.state_mut();

        if msg::source() != state.owner {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OnlyOwnerCanDoThatAction
            );
        }

        state.tokens_per_vara = tokens_per_vara;

        MiniDexsEvents::SetTokensPerVaras
    }


    /// ## Add an amount of tokens to the vft contract for this contract
    /// Only the contract owner can perform this action
    pub async fn add_tokens_to_contract(&mut self, tokens_to_add: u128) ->  MiniDexsEvents {
        let state = self.state_ref();
        let caller = msg::source();

        if caller != state.owner {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OnlyOwnerCanDoThatAction
            );
        }

        if state.vft_contract_id.is_none() {
            return MiniDexsEvents::Error(
                MiniDexsErrors::VftContractIdNotSet
            );
        }

        if tokens_to_add < state.min_tokens_to_add {
            return MiniDexsEvents::Error(
                MiniDexsErrors::MinTokensToAdd(state.min_tokens_to_add)
            );
        }

        let result = self
            .add_num_of_tokens_to_contract(
                tokens_to_add, 
                state.vft_contract_id.unwrap()
            )
            .await;

        if let Err(error_variant) = result {
            return MiniDexsEvents::Error(error_variant);
        }

        MiniDexsEvents::TokensAdded
    }


        /// ## add company token
    /// Only the contract owner can perform this action
    pub async fn add_company_token(&mut self, tokens_to_add: u128) ->  MiniDexsEvents {
        let state = self.state_ref();
        let caller = msg::source();

        if caller != state.owner {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OnlyOwnerCanDoThatAction
            );
        }

        if state.gaia_company_token.is_none() {
            return MiniDexsEvents::Error(
                MiniDexsErrors::VftContractIdNotSet
            );
        }

        if tokens_to_add < state.min_tokens_to_add {
            return MiniDexsEvents::Error(
                MiniDexsErrors::MinTokensToAdd(state.min_tokens_to_add)
            );
        }

        let result = self
            .add_num_of_tokens_to_contract(
                tokens_to_add, 
                state.gaia_company_token.unwrap()
            )
            .await;

        if let Err(error_variant) = result {
            return MiniDexsEvents::Error(error_variant);
        }

        MiniDexsEvents::TokensAdded
    }


/// ## Transferir tokens ade compañia
/// Solo el propietario del contrato puede realizar esta acción
pub async fn transfer_tokens_company(&mut self, recipient: ActorId, amount: u128) -> MiniDexsEvents {
    let state = self.state_ref();

    if msg::source() != state.owner {
        return MiniDexsEvents::Error(
            MiniDexsErrors::OnlyOwnerCanDoThatAction
        );
    }

    if state.gaia_company_token.is_none() {
        return MiniDexsEvents::Error(
            MiniDexsErrors::VftContractIdNotSet
        );
    }

    let response = self
        .vft_client
        .transfer(recipient, U256::from(amount))
        .send_recv(state.gaia_company_token.unwrap())
        .await;

    let Ok(transfer_status) = response else {
        return MiniDexsEvents::Error(
            MiniDexsErrors::ErrorInVFTContract
        );
    };

    if !transfer_status {
        return MiniDexsEvents::Error(
            MiniDexsErrors::OperationWasNotPerformed
        );
    }

    MiniDexsEvents::TokensAdded
}

    /// ## Swap Varas for tokens
    /// Receive a certain amount of varas and then make a swap for a certain number of tokens
    pub async fn swap_tokens_by_num_of_varas(&mut self) -> MiniDexsEvents {
        let value = msg::value();
        let caller = msg::source();

        if value == 0 {
            return MiniDexsEvents::Error(
                MiniDexsErrors::CantSwapTokensWithAmount {
                    min_amount: 1,
                    actual_amount: 0
                }
            );
        }

        let state = self.state_ref();

        if state.vft_contract_id.is_none() {
            return MiniDexsEvents::Error(
                MiniDexsErrors::VftContractIdNotSet
            );
        }

        let num_of_tvaras = value / ONE_TVARA;
        let tokens: u128 = num_of_tvaras * state.tokens_per_vara;

        let total_tokens_supply = self
            .vft_client
            .balance_of(exec::program_id())
            .recv(state.vft_contract_id.unwrap())
            .await;

        let Ok(total_suply) = total_tokens_supply else {
            return MiniDexsEvents::Error(
                MiniDexsErrors::ErrorInVFTContract
            );
        };

        if total_suply < U256::from(tokens) {
            msg::send(
                msg::source(),
                MiniDexsEvents::RefundOfVaras(num_of_tvaras), 
                value
            )
            .expect("Error sending message");

            return MiniDexsEvents::RefundOfVaras(num_of_tvaras);
        }

        let response = self
            .vft_client
            .transfer(caller, U256::from(tokens))
            .send_recv(state.vft_contract_id.unwrap())
            .await;

        let Ok(transfer_status) = response else {
            return MiniDexsEvents::Error(
                MiniDexsErrors::ErrorInVFTContract
            );
        };

        if !transfer_status {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OperationWasNotPerformed
            );
        }

        MiniDexsEvents::TokensSwapSuccessfully {
            total_tokens: tokens,
            total_varas: num_of_tvaras
        }
    }

    /// ## Swap tokens for Varas
    pub async fn swap_tokens_to_varas(&mut self, amount_of_tokens: u128) -> MiniDexsEvents {
        let state = self.state_ref();

        if amount_of_tokens < state.tokens_per_vara {
            return MiniDexsEvents::Error(
                MiniDexsErrors::CantSwapTokensWithAmount {
                    min_amount: state.tokens_per_vara,
                    actual_amount: amount_of_tokens
                }
            );
        } 

        let varas_to_send = amount_of_tokens / state.tokens_per_vara;
        let amount_of_tokens = varas_to_send * state.tokens_per_vara;
        let total_tokens_to_swap: U256 = U256::from(amount_of_tokens);
        let caller = msg::source();


        if state.vft_contract_id.is_none() {
            return MiniDexsEvents::Error(
                MiniDexsErrors::VftContractIdNotSet
            );
        }

        let response = self
            .vft_client
            .balance_of(caller)
            .recv(state.vft_contract_id.unwrap())
            .await;

        let Ok(user_total_tokens) = response else {
            return MiniDexsEvents::Error(
                MiniDexsErrors::ErrorInVFTContract
            );
        };

        if user_total_tokens < total_tokens_to_swap {
            return MiniDexsEvents::Error(
                MiniDexsErrors::CantSwapUserTokens { 
                    user_tokens: user_total_tokens, 
                    tokens_to_swap: total_tokens_to_swap 
                }
            );
        }

        let response = self
            .vft_client
            .burn(caller, total_tokens_to_swap)
            .send_recv(state.vft_contract_id.unwrap())
            .await;

        let Ok(operation_result) = response else {
            return MiniDexsEvents::Error(
                MiniDexsErrors::ErrorInVFTContract
            );
        };

        if !operation_result {
            return MiniDexsEvents::Error(
                MiniDexsErrors::OperationWasNotPerformed
            );
        }

        let result = self   
            .add_num_of_tokens_to_contract(
                amount_of_tokens, 
                state.vft_contract_id.unwrap()
            )
            .await;

        if let Err(error_variant) = result {
            return MiniDexsEvents::Error(error_variant);
        }

        msg::send(
            caller, 
            MiniDexsEvents::TotalSwapInVaras(varas_to_send), 
            varas_to_send * ONE_TVARA
        )
        .expect("Error sending message");

        MiniDexsEvents::TokensSwapSuccessfully { total_tokens: amount_of_tokens, total_varas: varas_to_send }
    }



    /// ## Varas stored in contract
    pub fn contract_total_varas_stored(&self) -> MiniDexsQueryEvents {
        MiniDexsQueryEvents::ContractBalanceInVaras(exec::value_available() / ONE_TVARA)
    }

    /// ## Returns the total number of tokens in the contract (In U256 format)
    pub async fn total_tokens_to_swap(&self) -> MiniDexsQueryEvents {
        let state = self.state_mut();

        if state.vft_contract_id.is_none() {
            return MiniDexsQueryEvents::Error(
                MiniDexsErrors::VftContractIdNotSet
            );
        }

        let response = self
            .vft_client
            .balance_of(exec::program_id())
            .recv(state.vft_contract_id.unwrap())
            .await;

        let Ok(total_tokens_to_swap) = response else {
            return MiniDexsQueryEvents::Error(
                MiniDexsErrors::ErrorInVFTContract
            );
        };

        MiniDexsQueryEvents::TotalTokensToSwap(total_tokens_to_swap)
    }

    /// ## Returns the total number of tokens in the contract (In u128 format)
    pub async fn total_tokens_to_swap_as_u128(&self) -> MiniDexsQueryEvents {
        let state = self.state_mut();

        if state.vft_contract_id.is_none() {
            return MiniDexsQueryEvents::Error(
                MiniDexsErrors::VftContractIdNotSet
            );
        }

        let response = self
            .vft_client
            .balance_of(exec::program_id())
            .recv(state.vft_contract_id.unwrap())
            .await;

        let Ok(total_tokens_to_swap) = response else {
            return MiniDexsQueryEvents::Error(
                MiniDexsErrors::ErrorInVFTContract
            );
        };

        MiniDexsQueryEvents::TotalTokensToSwapAsU128(total_tokens_to_swap.as_u128())
    }

    pub fn tokens_to_swap_one_vara(&self) -> MiniDexsQueryEvents {
        MiniDexsQueryEvents::TokensToSwapOneVara(self.state_ref().tokens_per_vara)
    }

    /// ## Transferir tokens a un usuario
/// Solo el propietario del contrato puede realizar esta acción
pub async fn transfer_tokens_to_user(&mut self, recipient: ActorId, amount: u128) -> MiniDexsEvents {
    let state = self.state_ref();

    if msg::source() != state.owner {
        return MiniDexsEvents::Error(
            MiniDexsErrors::OnlyOwnerCanDoThatAction
        );
    }

    if state.vft_contract_id.is_none() {
        return MiniDexsEvents::Error(
            MiniDexsErrors::VftContractIdNotSet
        );
    }

    let response = self
        .vft_client
        .transfer(recipient, U256::from(amount))
        .send_recv(state.vft_contract_id.unwrap())
        .await;

    let Ok(transfer_status) = response else {
        return MiniDexsEvents::Error(
            MiniDexsErrors::ErrorInVFTContract
        );
    };

    if !transfer_status {
        return MiniDexsEvents::Error(
            MiniDexsErrors::OperationWasNotPerformed
        );
    }

    MiniDexsEvents::TokensAdded
}

/// ## Mintear tokens a un usuario
/// Solo el propietario del contrato puede realizar esta acción
pub async fn mint_tokens_to_user(&mut self, recipient: ActorId, amount: u128) -> MiniDexsEvents {
    let state = self.state_ref();

    if msg::source() != state.owner {
        return MiniDexsEvents::Error(
            MiniDexsErrors::OnlyOwnerCanDoThatAction
        );
    }

    if state.vft_contract_id.is_none() {
        return MiniDexsEvents::Error(
            MiniDexsErrors::VftContractIdNotSet
        );
    }

    let response = self
        .vft_client
        .mint(recipient, U256::from(amount))
        .send_recv(state.vft_contract_id.unwrap())
        .await;

    let Ok(mint_status) = response else {
        return MiniDexsEvents::Error(
            MiniDexsErrors::ErrorInVFTContract
        );
    };

    if !mint_status {
        return MiniDexsEvents::Error(
            MiniDexsErrors::OperationWasNotPerformed
        );
    }

    MiniDexsEvents::TokensAdded
}

    /// ## Send an amount of tokens to the vft contract
    async fn add_num_of_tokens_to_contract(&mut self, tokens_to_add: u128, vft_contract_id: ActorId) -> Result<(), MiniDexsErrors> {
        let response = self
            .vft_client
            .mint(
                exec::program_id(), 
                U256::from(tokens_to_add)
            )
            .send_recv(vft_contract_id)
            .await;

        let Ok(operation_result) = response else {
            return Err(MiniDexsErrors::ErrorInVFTContract);
        };

        if !operation_result {
            return Err(MiniDexsErrors::OperationWasNotPerformed);
        }

        Ok(())
    }

    fn state_mut(&self) -> &'static mut MiniDexsState {
        let state = unsafe { MINI_DEX_STATE.as_mut() };
        debug_assert!(state.is_none(), "state is not started!");
        unsafe { state.unwrap_unchecked() }
    }

    fn state_ref(&self) -> &'static MiniDexsState {
        let state = unsafe { MINI_DEX_STATE.as_ref() };
        debug_assert!(state.is_none(), "state is not started!");
        unsafe { state.unwrap_unchecked() }
    }
}


#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum MiniDexsQueryEvents {
    ContractBalanceInVaras(u128),
    Mitings(Vec<MintingSchedule>),
    Devices(Vec<Devices>),
    UserTotalTokensAsU128(u128),
    UserTotalTokens(U256),
    TotalTokensToSwap(U256),
    TotalTokensToSwapAsU128(u128),
    TokensToSwapOneVara(u128),
    NumOfTokensForOneVara(u128),
    Error(MiniDexsErrors)
}

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum MiniDexsEvents {
    RefundOfVaras(u128),
    VFTContractIdSet,
    DevicesAdded(String),
    MinTokensToAddSet,
    TokensAdded,
    SetTokensPerVaras,
    MintingScheduled(String), 
    MintingExecuted,
    TotalSwapInVaras(u128),
    TokensSwapSuccessfully {
        total_tokens: u128,
        total_varas: u128
    },
    Error(MiniDexsErrors)
}

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum MiniDexsErrors {
    MinTokensToAdd(u128),
    UserAlreadyExists,
    CantSwapTokens {
        tokens_in_vft_contract: U256
    }, 
    CantSwapUserTokens {
        user_tokens: U256,
        tokens_to_swap: U256
    },
    ContractCantMint,
    CantSwapTokensWithAmount {
        min_amount: u128,
        actual_amount: u128
    },
    OnlyOwnerCanDoThatAction,
    VftContractIdNotSet,
    ErrorInVFTContract,
    ErrorInGetNumOfVarasToSwap,
    OperationWasNotPerformed,
    MintingFailed
}
