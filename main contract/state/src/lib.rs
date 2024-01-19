#![no_std]

use io::*;
use gmeta::{ Metadata, metawasm};
use gstd::{ ActorId, prelude::*};

#[cfg(feature = "binary-vendor")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

#[metawasm]
pub mod metafns {
    pub type State = <ContractMetadata as Metadata>::State;

    pub fn get_state(state: State) -> io::IoGaiaEcotrack {
        let (_, io_gaia_ecotrack) = state;
        io_gaia_ecotrack  
    }
}