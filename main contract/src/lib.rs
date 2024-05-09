
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
    pub devices:HashMap<String, Vec<DevicesInfo>>,
    pub transactions : HashMap<ActorId,Vec<TransactionsInfo>>,
    pub p2p_transactions : HashMap<ActorId,Vec<TransactionsP2P>>
    // Aqui se pueden agregar información adicional en el contrato
   
}

// Aquí están todos los métodos implementados en el GaiaEcotrackMainState
impl GaiaEcotrackMainState {


    // Esta función agregaria liquidez de tokens al contrato principal para posteriormente transferirla a los generadores
    async fn add_liquidity( &mut self, amount: u128 , password:String , to:ActorId){
        let caller = msg::source();

        // Check if caller is the admin before proceeding
        if caller != addresft_state_mut().admin_info || password != addresft_state_mut().admin_password {
            msg::reply(EventsGaiaEcotrack::Error("Unauthorized: Only admin can add liquidity".to_string()), 0)
            .expect("failed to encode or reply from `state()`");
            return;
        }
        else{
            

        // Esta variable tiene la dirección del token fungible
        let address_ft = addresft_state_mut();

        // Esta payload será la acción que se mandará al token fungible.
        let payload = FTAction::Mint(amount , to);

        // Esta linea manda el mensaje para el cual se espera como respuesta el evento.
            
        let result =  msg::send_for_reply_as::<_, FTEvent>(address_ft.ft_program_id,payload,0,0).expect("Error in sending a message").await;

        msg::reply(EventsGaiaEcotrack::Success("Aggregate liquidity".to_string()), 0)
            .expect("failed to encode or reply from `state()`");

        }
    }

    // Esta función removeria liquidez de tokens al contrato principal.
    #[allow(dead_code)]
    async fn remove_liquidity(&mut self, amount_tokens: u128 , password: String){

        let caller = msg::source();

        // Check if caller is the admin before proceeding
        if caller != addresft_state_mut().admin_info || password != addresft_state_mut().admin_password {
            msg::reply(EventsGaiaEcotrack::Error("Unauthorized: Only admin can remove liquidity".to_string()), 0)
            .expect("failed to encode or reply from `state()`");
            return;
        }
        else{
            let address_ft = addresft_state_mut();           
            let payload = FTAction::Burn(amount_tokens);     
            let result =  msg::send_for_reply_as::<_, FTEvent>(address_ft.ft_program_id,payload,0,0).expect("Error in sending a message").await;
           
        }
    }
 
    // Esta función transfiere tokens del contrato a los generadores de energia
    async fn transfer_tokens_to_generators(&mut self, tx_id: Option<TxId>, amount_tokens: u128 , password: String) {

        if  password != addresft_state_mut().admin_password {
            msg::reply(EventsGaiaEcotrack::Error("Unauthorized".to_string()), 0)
            .expect("failed to encode or reply from `state()`");
            return;
        }
        else {
            
        let address_ft = addresft_state_mut();           
        let payload = FTAction::Transfer{tx_id,from: exec::program_id(), to: msg::source() ,amount: amount_tokens};
        let _ = msg::send(address_ft.ft_program_id, payload, 0);
        msg::reply(EventsGaiaEcotrack::Success("Tokens Sent".to_string()), 0)
        .expect("failed to encode or reply from `state()`");
        return;
        }

        // Aquí se pueden generar eventos de confirmación al usuario.

    }
    async fn transfer_tokens_between_actors(&mut self,tx_id: Option<TxId>, from: ActorId, to: ActorId, amount_tokens: u128) {
        let address_ft = addresft_state_mut();
        let payload = FTAction::Transfer {
            tx_id,
            from,
            to,
            amount: amount_tokens,
        };
        let _ = msg::send(address_ft.ft_program_id, payload, 0);
        msg::reply(
            EventsGaiaEcotrack::TokensTransferred {
                from: from,
                to: to,
                amount : amount_tokens,
            },
            0,
        )
        .unwrap();
    }

    async fn claimedTokens(&mut self,tx_id: Option<TxId>, from: ActorId, to: ActorId, amount_tokens: u128 ) {
        let address_ft = addresft_state_mut();
        let kw_generated_calculate = amount_tokens * 10;
        let payload = FTAction::Transfer {
            tx_id,
            from,
            to,
            amount: amount_tokens,
        };
        let _ = msg::send(address_ft.ft_program_id, payload, 0);
        msg::reply(
            EventsGaiaEcotrack::Claimed {
                to: to,
                amount : amount_tokens,
                kw : kw_generated_calculate
            },
            0,
        )
        .unwrap();
    }

    // ...

   

  
   
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
        ft_program_id: config.ft_program_id,
        admin_info:config.admin_info,
        admin_password:config.admin_password
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
        ActionGaiaEcotrack::Addliquidity(amount,password,to) => {


            let state = state_mut();


            // Aquí estamos sumando a su balance las recompensas generadas en tokens por un usuario generador
            state.generators
             .entry(msg::source())
             .and_modify(|generator| {
                generator.rewards = generator.rewards.saturating_add(amount);
             });

             // Aquí llamamos a un método en la implementación
             state.add_liquidity(amount, to, password).await;
                     
            }

        ActionGaiaEcotrack::GetRewards(tx_id,amount,password) => {


            let state = state_mut();


             // Aquí estamos restando a su balance las recompensas cobradas por un usuario generador
            state.generators
            .entry(msg::source())
            .and_modify(|generator| {
               generator.rewards = generator.rewards.saturating_sub(amount);
            });

            // Aquí llamamos a un método para transferir tokens en la implementación
            state.transfer_tokens_to_generators(tx_id, amount, password.to_string()).await;
                
             
            }
            ActionGaiaEcotrack::Removeliquidity(amount , password) => {
                let state = state_mut();         
                // Llama al método remove_liquidity
                state.remove_liquidity(amount,password.to_string()).await;
            }

            ActionGaiaEcotrack::Transferred(tx_id,from, to, amount) => {
                let state = state_mut();
                state.transfer_tokens_between_actors(tx_id,from, to, amount).await;
            }

            ActionGaiaEcotrack::Reward(tx_id,from, to, amount , transactions) => {
                let state = state_mut();
                let calculate = amount / 10 ;
                state.claimedTokens(tx_id,from, to, amount).await;

                let transactions_state = state.transactions.entry(from.clone()).or_insert(vec![]);
                transactions_state.push(TransactionsInfo {
                    to : transactions.to,
                    amount: transactions.amount,
                    kw: transactions.kw,
                });
            }

            ActionGaiaEcotrack::NewDevice(idUser,device) =>  {
                let state = state_mut();

                // TRANSICIÓN DE ESTADO PRINCIPAL
                // Buscamos si ya existe un vector de devices para ese idUser
                let user_devices = state.devices.entry(idUser.clone()).or_insert(vec![]);
    
                // Insertamos el nuevo dispositivo en el vector
                user_devices.push(DevicesInfo {
                    id: device.id,
                    name: device.name,
                    type_energy: device.type_energy,
                    serial: device.serial,
                });
    
                msg::reply(EventsGaiaEcotrack::DeviceRegister("Registered Device".to_string()), 0)
                    .expect("failed to encode or reply from `state()`");
    
     
                }

            ActionGaiaEcotrack::TransactionP_two_P(actor,p2p) =>  {
                    let state = state_mut();
    
                    // TRANSICIÓN DE ESTADO PRINCIPAL
                    // Buscamos si ya existe un vector de devices para ese idUser
                    let p2p_state = state.p2p_transactions.entry(actor.clone()).or_insert(vec![]);
        
                    // Insertamos el nuevo dispositivo en el vector
                    p2p_state.push(TransactionsP2P {
                        from: p2p.from,
                        to: p2p.to,
                        kw: p2p.kw,
                        date: p2p.date,
                        value: p2p.value,
                    });
        
                    msg::reply(EventsGaiaEcotrack::TransactionsP2P("Transaction Completed".to_string()), 0)
                        .expect("failed to encode or reply from `state()`");
        
         
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
            devices,
            transactions,
            p2p_transactions
        } = value;
    
    // Aquí se genera el cambio de HashMap a Vector para evitar problemas de compilación por el tipo HashMap.
    // Nota: Es necesario convertir todos los Hashmaps a vectores
        let generators = generators.iter().map(|(k, v)| (*k, v.clone())).collect();
        let devices = devices
    .iter()
    .flat_map(|(k, v)| v.iter().map(move |device| (k.clone(), device.clone())))
    .collect();

    let transactions = transactions
    .iter()
    .flat_map(|(k, v)| v.iter().map(move |device| (k.clone(), device.clone())))
    .collect();
    let p2p_transactions = p2p_transactions
    .iter()
    .flat_map(|(k, v)| v.iter().map(move |device| (k.clone(), device.clone())))
    .collect();
       
    
    // Se devuelve un tipo IoGaiaEcotrack
    // Nota: Este es una copia de GaiaEcotrackMainState pero con vectores en lugar de Hashmaps.
        Self {
            total_energy_generated,
            total_users,
            total_generators,
            generators,
            devices,
            transactions,
            p2p_transactions
        }
    
    }
    }


#[derive(Decode, Encode, TypeInfo)]
#[codec(crate = gstd::codec)]
#[scale_info(crate = gstd::scale_info)]
pub struct InitFT {
   
    pub ft_program_id: ActorId,
    pub admin_info : ActorId,
    pub admin_password: String,
}