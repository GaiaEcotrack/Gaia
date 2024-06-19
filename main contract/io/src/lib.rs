#![no_std]
use gstd::{ prelude::*, ActorId };
use gmeta::{In,Out,InOut,Metadata};



// 1. Acciones para el contrato principal de Gaia: Este enum puede tener todas las acciones de quienes participaran en el proceso.
#[derive(Encode, Decode, TypeInfo)]
pub enum ActionGaiaEcotrack {
    NewGenerator{id:ActorId,generator:Generator},
    Addliquidity{supply:u128,password:String},
    Removeliquidity{supply:u128,password:String},
    GetRewards{tx_id:Option<TxId>,to:ActorId,tokens:u128,password:String},
    Transferred{tx_id:Option<TxId>,from:ActorId,to:ActorId,amount:u128 , password:String},
    Reward{tx_id:Option<TxId>, to:ActorId ,amount: u128,transactions:TransactionsInfo},
    NewDevice{id:String,device:DevicesInfo},
    TransactionPTwoP{id:ActorId,transaction:TransactionsP2P}
    
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
        to: ActorId,
        amount: u128,
        kw:u128,
    },
    DeviceRegister(String),
    TransactionsP2P(String),
    Error(String),
    Success(String)
    
    // Aqui pueden ir más eventos de respuesta para las acciones
    
}



pub type TxId = u64;
pub type ValidUntil = u64;
// Al agregar un contrato secundario como un token fungible, hay que agregar las acciones y eventos del token fungible.
// Este Enum define las acciones del token fungible a controlar
#[derive(Debug, Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum FTAction {
    TransferToUsers {
        amount: u128,
        to_users: Vec<ActorId>,
    },
    Mint(u128,ActorId),
    Burn(u128),
    Transfer {
        tx_id: Option<TxId>,
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Approve {
        tx_id: Option<TxId>,
        to: ActorId,
        amount: u128,
    },
    BalanceOf(ActorId),
}

// Este Enum define las eventos del token fungible a controlar
#[derive(Encode, Decode, TypeInfo)]
pub enum FTEvent {
    Initialized,
    TransferredToUsers {
        from: ActorId,
        to_users: Vec<ActorId>,
        amount: u128,
    },
    Transferred {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Approved {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    AdminAdded {
        admin_id: ActorId,
    },
    AdminRemoved {
        admin_id: ActorId,
    },
    Balance(u128),
}

#[derive(Debug, Encode, Decode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum FTReply {
    Initialized,
    TransferredToUsers {
        from: ActorId,
        to_users: Vec<ActorId>,
        amount: u128,
    },
    Transferred {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    Approved {
        from: ActorId,
        to: ActorId,
        amount: u128,
    },
    AdminAdded {
        admin_id: ActorId,
    },
    AdminRemoved {
        admin_id: ActorId,
    },
    Balance(u128),
}

#[derive(Debug, Encode, Decode, TypeInfo, MaxEncodedLen, Clone)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub enum FTError {
    DecimalsError,
    DescriptionError,
    MaxSupplyReached,
    SupplyError,
    NotAdmin,
    NotEnoughBalance,
    ZeroAddress,
    NotAllowedToTransfer,
    AdminAlreadyExists,
    CantDeleteYourself,
    TxAlreadyExists,
}



// Esta  estructura es para el inicio del programa: usualmente vincularemos el token fungible u otros contratos al arranque del programa.
#[derive(Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitFT {

    // Este será el program id del token fungible a controlar
    pub ft_program_id: ActorId,
    pub admin_info : ActorId,
    pub admin_password: String,
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
    pub transactions : Vec<(ActorId,TransactionsInfo)>,
    pub p2p_transactions : Vec<(ActorId,TransactionsP2P)>,
  
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

#[derive(Default, Clone, Encode, Decode, TypeInfo)]
pub struct TransactionsInfo {
    pub to:ActorId,
    pub amount:u128,
    pub kw:u128,
   
}

#[derive(Default, Clone, Encode, Decode, TypeInfo)]
pub struct TransactionsP2P {
    pub from:String,
    pub to:String,
    pub kw:u128,
    pub date:String,
    //Valor en Varas
    pub value:u128,   
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