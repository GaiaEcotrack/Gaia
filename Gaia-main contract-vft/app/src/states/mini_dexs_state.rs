use sails_rs::prelude::*;
//State of Devices
#[derive(Encode,Clone, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Devices {
    pub owner: ActorId,
    pub serial_number: String,
    pub location: String,
    pub type_device: String,
    pub device_brand: String,

}
//State of Transactions

#[derive(Encode,Clone, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct MintingSchedule {
    pub wallet: ActorId,      // Billetera donde se hará el minting
    pub amount: u128,         // Cantidad de tokens a mintear
    pub minting_time: u64,    // Fecha y hora programada para el minting (timestamp en segundos)
}

pub struct MiniDexsState {
    pub owner: ActorId,
    pub vft_contract_id: Option<ActorId>,
    pub gaia_company_token: Option<ActorId>,
    pub min_tokens_to_add: u128,
    pub tokens_per_vara: u128,
    pub devices: Vec<Devices>, // Lista de dispositivos
    pub minting_schedules: Vec<MintingSchedule>, // Lista de minting programados
}
