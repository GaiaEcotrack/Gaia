#![no_std]
use gstd::{ prelude::*, ActorId };
use gmeta::{In,Out,InOut,Metadata};



// 1. Acciones para el contrato principal de Gaia: Este enum puede tener todas las acciones de quienes participaran en el proceso.
#[derive(Encode, Decode, TypeInfo)]
pub enum ActionGaiaEcotrack {
    NewGenerator(ActorId,Generator),
    GenerateEnergy(u128),
    GetRewards(u128),
    Transferred(ActorId , ActorId , u128),
    Reward(ActorId , ActorId , u128),
    NewDevice(String,DevicesInfo)
    
    // Aqui se pueden implementar acciones adicionales en el contrato
}

// 2. Eventos del contrato principal de Gaia
#[derive(Debug, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum EventsGaiaEcotrack {
    Registered,
    Generated,
    RewardsGenerated,
    TokensTransferred{
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Claimed{
        from: ActorId,
        to: ActorId,
        amount: u128,
        kw:u128,
    },
    DeviceRegister(String),
    
    // Aqui pueden ir más eventos de respuesta para las acciones
    
}

impl Clone for EventsGaiaEcotrack {
    fn clone(&self) -> Self {
        match self {
            EventsGaiaEcotrack::Registered => EventsGaiaEcotrack::Registered,
            EventsGaiaEcotrack::Generated => EventsGaiaEcotrack::Generated,
            EventsGaiaEcotrack::RewardsGenerated => EventsGaiaEcotrack::RewardsGenerated,
            EventsGaiaEcotrack::TokensTransferred { from, to, amount } => EventsGaiaEcotrack::TokensTransferred {
                from: from.clone(),
                to: to.clone(),
                amount: *amount,
            },
            EventsGaiaEcotrack::Claimed { from, to, amount, kw } => EventsGaiaEcotrack::Claimed {
                from: from.clone(),
                to: to.clone(),
                amount: *amount,
                kw: *kw,
            },
            EventsGaiaEcotrack::DeviceRegister(s) => EventsGaiaEcotrack::DeviceRegister(s.clone()),
        }
    }
}


// Al agregar un contrato secundario como un token fungible, hay que agregar las acciones y eventos del token fungible.
// Este Enum define las acciones del token fungible a controlar
#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum FTAction {
    Mint(u128),
    Burn(u128),
    Transfer {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Approve {
        to: ActorId,
        amount: u128,
    },
    TotalSupply,
    BalanceOf(ActorId),
}

// Este Enum define las eventos del token fungible a controlar
#[derive(Encode, Decode, TypeInfo)]
pub enum FTEvent {
    Transfer {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Approve {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Ok,
    Err,
    Balance(u128),
    PermitId(u128),
}



// Esta  estructura es para el inicio del programa: usualmente vincularemos el token fungible u otros contratos al arranque del programa.
#[derive(Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitFT {

    // Este será el program id del token fungible a controlar
    pub ft_program_id: ActorId,
}


// Este Enum de Errores se genera en lugar de los eventos por si algo falla en algún punto. 
#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum GaiaEcotrackErrors {
    ZeroAmount,
    ZeroReward,
    ZeroTime,
    TransferTokens,
    InsufficentBalance,
    NotOwner,
    // Aquí pueden agregarse mas errores u errores personalizados que puedan ocurrir en lugar del evento


}



// Esta estructura se mostrará en el estado y es una copia del estado principal donde se sustituyen los HashMaps por vectores.
#[derive(Default, Clone, Encode, Decode, TypeInfo)]
pub struct IoGaiaEcotrack {
    pub total_energy_generated: u128,
    pub total_users: u128,
    pub total_generators:u128,
    pub generators: Vec<(ActorId, Generator)>,
    pub devices:Vec<(String, DevicesInfo)>,
  
}

// Esta estructura personalizada generator puede guardar toda la información relacionada con el generador.
#[derive(Default, Clone, Encode, Decode, TypeInfo)]
pub struct Generator {
    pub id: u128,
    pub wallet:ActorId,
    pub total_generated: u128,
    pub average_energy:u128,
    pub rewards:u128

    // Aqui se pueden agregar más campos importantes sobre el generador de energía
   
  
}

#[derive(Default, Clone, Encode, Decode, TypeInfo)]
pub struct DevicesInfo {
    pub id: u128,
    pub name:String,
    pub type_energy:String,
    pub serial:String,
   
}



pub struct ContractMetadata;

// Este es el resumen del estado y la metadata asociada
impl Metadata for ContractMetadata{
     // Al usar In podemos ingresar la estructura InitFT que contiene el Actor Id del token fungible
     type Init = In<InitFT>;
      // Definimos las acciones y eventos en la funcion principal del src
     type Handle = InOut<ActionGaiaEcotrack,EventsGaiaEcotrack>;
     type Others = ();
     type Reply=();
     type Signal = ();
     // Definimos el estado
     type State = Out<IoGaiaEcotrack>;

}