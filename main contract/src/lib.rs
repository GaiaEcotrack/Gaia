
#![no_std]
use hashbrown::HashMap;
use io::*;
use gstd::{async_main, msg, exec, prelude::*, ActorId};



#[cfg(feature = "binary-vendor")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));



// Estado principal para el contrato de Gaia
#[derive(Clone, Default)]
struct GaiaEcotrackMainState {
    pub total_energy_generated: u128,
    pub total_users: u128,
    pub total_generators:u128,
    pub generators: HashMap<ActorId, Generator>,
    // Aqui se pueden agregar información adicional en el contrato
   
}

// Aquí están todos los métodos implementados en el GaiaEcotrackMainState
impl GaiaEcotrackMainState {


    // Esta función agregaria liquidez de tokens al contrato principal para posteriormente transferirla a los generadores
    async fn add_liquidity( &mut self, amount: u128){


        // Esta variable tiene la dirección del token fungible
        let address_ft = addresft_state_mut();

        // Esta payload será la acción que se mandará al token fungible.
        let payload = FTAction::Mint(amount);

        // Esta linea manda el mensaje para el cual se espera como respuesta el evento.
            
        let result =  msg::send_for_reply_as::<_, FTEvent>(address_ft.ft_program_id,payload,0,0).expect("Error in sending a message").await;
       

       // Ejemplo de como manejar errores y eventos
        let _ = match result {
            Ok(event) => match event {
                FTEvent::Ok => Ok(()),
                _ => Err(()),
            },
            Err(_) => Err(()),
        };
    }

    // Esta función removeria liquidez de tokens al contrato principal.
    #[allow(dead_code)]
    async fn remove_liquidity(&mut self, amount_tokens: u128){

        let address_ft = addresft_state_mut();           
        let payload = FTAction::Mint(amount_tokens);     
        let result =  msg::send_for_reply_as::<_, FTEvent>(address_ft.ft_program_id,payload,0,0).expect("Error in sending a message").await;
       
        let _ = match result {
            Ok(event) => match event {
                FTEvent::Ok => Ok(()),
                _ => Err(()),
            },
            Err(_) => Err(()),
        };
    }
 
    // Esta función transfiere tokens del contrato a los generadores de energia
    async fn transfer_tokens_to_generators(&mut self, amount_tokens: u128) {

        let address_ft = addresft_state_mut();           
        let payload = FTAction::Transfer{from: exec::program_id(), to: msg::source() ,amount: amount_tokens};
        let _ = msg::send(address_ft.ft_program_id, payload, 0);

        // Aquí se pueden generar eventos de confirmación al usuario.

    }

  
   

  
   
}


// Los estados se declaran como variables estáticas mutables en Rust.
static mut STATE:Option<GaiaEcotrackMainState> = None;

static mut ADDRESSFT:Option<InitFT> = None;



// Esta es la función de mutabilidad:Esta permite cambiar un estado, en este caso el estado principal(GaiaEcotrackMainState)
fn state_mut() -> &'static mut GaiaEcotrackMainState {

    let state = unsafe { STATE.as_mut()};

    unsafe { state.unwrap_unchecked() }


}

fn addresft_state_mut() -> &'static mut InitFT {


    let addressft = unsafe { ADDRESSFT.as_mut()};

    unsafe { addressft.unwrap_unchecked() }


}

// Funcion Init, inicializa todos los estados y variables.
#[no_mangle]
extern "C" fn init () {

    // Esta variable inicializa el InitFT con su contenido
    let config: InitFT = msg::load().expect("Unable to decode InitFT");


    // Esta variable inicializa el GaiaEcotrackMainState con su contenido
    let state = GaiaEcotrackMainState {
        ..Default::default()
    };

    // Esta condición evita que el usuario deje vacia el program ID del token fungible
    if config.ft_program_id.is_zero() {
        panic!("FT program address can't be 0");
    }

    // Se crea el estado con lo que el usuario escriba como program ID al inicio
    let initft = InitFT {
        ft_program_id: config.ft_program_id
    };

    
    unsafe {
        ADDRESSFT = Some(initft);
    }

    // Se crea el estado dentro del unsafe{} para poder mutarlo y se agrega dentro de un option(some(state))
   unsafe { STATE = Some(state)}

}

#[async_main]
async fn main(){

    // Aquí cargamos el mensaje(Acción) del usuario.
    let action= msg::load().expect("Could not load Action");


    // Aquí se evalua todas las acciones y se ejecuta lo correspondiente.
    match action {
        ActionGaiaEcotrack::NewGenerator(actorid,generator) =>  {

            // Esta varible usa la  función de mutabilidad para poder cambiar el estado principal.
            let state = state_mut();
            

            // TRANSICIÓN DE ESTADO PRINCIPAL
            // Ingresamos al campo generators del estado principal(struc GaiaEcotrackMainState )
            // entry busca el actorid y si no existe lo inserta como un generador nuevo
            state.generators.entry(actorid).or_insert(Generator {
                id: generator.id,
                wallet:generator.wallet,
                total_generated: 0,
                average_energy:0,
                rewards:0
            });

            // GENERAR EVENTO EJEMPLO y se pueden mandar en cualquier acción o implementación.

            msg::reply(EventsGaiaEcotrack::Registered, 0).expect("failed to encode or reply from `state()`");

 
            },
        ActionGaiaEcotrack::GenerateEnergy(amount) => {


            let state = state_mut();


            // Aquí estamos sumando a su balance las recompensas generadas en tokens por un usuario generador
            state.generators
             .entry(msg::source())
             .and_modify(|generator| {
                generator.rewards = generator.rewards.saturating_add(amount);
             });

             // Aquí llamamos a un método en la implementación
             state.add_liquidity(amount).await;
                     
            }

        ActionGaiaEcotrack::GetRewards(amount) => {


            let state = state_mut();


             // Aquí estamos restando a su balance las recompensas cobradas por un usuario generador
            state.generators
            .entry(msg::source())
            .and_modify(|generator| {
               generator.rewards = generator.rewards.saturating_sub(amount);
            });

            // Aquí llamamos a un método para transferir tokens en la implementación
            state.transfer_tokens_to_generators(amount).await;
                
             
            }
           
            };

}

    
   // Función state:Esta función pasa como estado principal el IoGaiaEcotrack.
    #[no_mangle]
    extern "C" fn state() {
     
        let state = unsafe { STATE.take().expect("Unexpected error in state") };
        msg::reply::<IoGaiaEcotrack>(state.into(), 0)
        .expect("Failed to encode`");
    }


    // Esta implementación convierte de tipo GaiaEcotrackMainState a tipo IoGaiaEcotrack usando from.
    impl From<GaiaEcotrackMainState> for IoGaiaEcotrack {
        fn from(value: GaiaEcotrackMainState) -> Self {
    
    // Esta parte desestructura el contenido de GaiaEcotrackMainState
        let GaiaEcotrackMainState {
            total_energy_generated,
            total_users,
            total_generators,
            generators,
        } = value;
    
    // Aquí se genera el cambio de HashMap a Vector para evitar problemas de compilación por el tipo HashMap.
    // Nota: Es necesario convertir todos los Hashmaps a vectores
        let generators = generators.iter().map(|(k, v)| (*k, v.clone())).collect();
       
    
    // Se devuelve un tipo IoGaiaEcotrack
    // Nota: Este es una copia de GaiaEcotrackMainState pero con vectores en lugar de Hashmaps.
        Self {
            total_energy_generated,
            total_users,
            total_generators,
            generators,
        }
    
    }
    }


#[derive(Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitFT {
   
    pub ft_program_id: ActorId,
}


