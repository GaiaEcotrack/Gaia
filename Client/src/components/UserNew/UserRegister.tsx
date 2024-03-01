import { FcOk } from "react-icons/fc"; 
import { FcHighPriority } from "react-icons/fc"; 
import { FcApproval } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuth } from "@firebase/auth";
import { SmsVerify } from "./Modal_smsVerify";

function UserRegister() {

  const URL = import.meta.env.VITE_APP_API_URL
  const [email, setEmail] = useState('');
  const [foundUserId, setFoundUserId] = useState('');
  const [verifiedDoc, setVerifiedDoc] = useState(false); // manejar el cambio desde el Back
  const [completed, setCompleted] = useState(false);
  const [completeCredent, setCompletedCredent] = useState(false);
  const [pendingDocuments, setPendingDocuments] = useState<string[]>([]);
  const [pendingCredentials, setPendingCredentials] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cellPhone, setCellPhone] = useState("");
  const [showSmsVerify, setShowSmsVerify] = useState(false)
  
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  }); 

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if(user){
      setPhoto(user.photoURL)
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
      const storedEmail = localStorage.getItem("email");
      setEmail(storedEmail || '');    
      handleSearch();
    }, [email]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${URL}/users/search`, {
        params: {
          email: email,
        },
      });      
      if (response.status === 200) {
        setFoundUserId(response.data._id);        
      } else if (response.status === 404) {
        setFoundUserId('');
        console.log('Usuario no encontrado');
      } else {
        console.error('Error al buscar usuario:');
      }
    } catch (error) {
      // console.error('Error de red:');
    }
  };

  localStorage.setItem("id", foundUserId);  


// **********************************************************

const [formData, setFormData] = useState({
  full_name: null,
  email: localStorage.getItem("email") || null,
  identification_number: null,
  address: null,
  phone: cellPhone || null,
  identity_document: null,
  bank_account_status: null,
  tax_declarations: null,
  other_financial_documents: null,
});

  useEffect(() => {
    if (foundUserId) {
      axios.get(`${URL}/users/${foundUserId}`)
        .then(response => {
          const userData = response.data.user;  
          setFormData({
            full_name: userData.full_name || null,
            email: userData.email || null,
            identification_number: userData.identification_number || null,
            address: userData.address || null,
            phone: userData.phone || null,
            identity_document: userData.identity_document || null,
            bank_account_status: userData.bank_account_status || null,
            tax_declarations: userData.tax_declarations || null,
            other_financial_documents: userData.other_financial_documents || null,
          });

          const pendingDocs = Object.entries(userData)
          .filter(([key, value]) => value === null)
          .map(([key]) => key);
          setPendingDocuments(pendingDocs);
          
          const hasNullProperty = Object.values(userData).some(value => value === null);
          setCompleted(!hasNullProperty)  
          setLoading(false)         
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [foundUserId]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log('Datos del formulario a enviar:', formData);
       
    try {
      const userId = localStorage.getItem('id');
      let apiUrl = `${URL}/users/`;
      let httpMethod = 'POST';
  
      if (userId) {
        apiUrl += `${userId}`;
        httpMethod = 'PUT';
      }
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== null)
      );

      await handleSms(e);
  
      const response = await fetch(apiUrl, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
      });
  
      if (response.ok) {
        const data = await response.json();
        Toast.fire({
          icon: "success",
          title: "User updated successfully"
        });  
        if (!userId) {
          localStorage.setItem('id', data.id);
        }

        const hasFileInputs = Object.keys(selectedFiles).length > 0;

        if (hasFileInputs) {
          await handleSubmitBucket(e);
        } 
        
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong"
        }); 
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
    
  };


  //* codigo para subir archivos al bucket

  const [selectedFiles, setSelectedFiles] = useState({});

  //* nueva funcion
  const handleInputChangeBucket = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = event.target;
  
    if (type === 'file') {
    // Actualiza el estado con el archivo seleccionado, usando el nombre del input como clave
      setSelectedFiles(prevFiles => ({
        ...prevFiles,
        [name]: files && files.length > 0 ? files[0] : null, // Asume que solo se selecciona un archivo por input
      }));
    } else {
      // Para otros tipos de inputs, actualiza el estado formData
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // obtener le id del usiario del lcoalstorage luego de cargar
  useEffect(() => {
    const userId = localStorage.getItem('id');
    
    if (userId) {
      setFoundUserId(userId);
    }
    setIsLoadingUser(false);
  }, []);
  async function handleSubmitBucket(e:any) {
    e.preventDefault();

    if (isLoadingUser) {
      console.error('El ID del usuario aún se está cargando');
      alert('Por favor, espera a que se cargue el ID del usuario.');
      return;
    }

    if (!foundUserId) {
      console.error('No se encontró el ID del usuario');
      alert('No se encontró el ID del usuario. Por favor, inténtalo de nuevo.');
      return;
    }
  
    let allFilesUploaded = true;
  
    // Itera sobre cada archivo seleccionado y envíalo
    for (const [inputName, file] of Object.entries(selectedFiles)) {
      if (file) {
        if (!(file instanceof Blob)) {
          console.error(`El archivo de ${inputName} no es un Blob válido.`);
          continue;
        }
        const formData = new FormData();
        formData.append('file', file);
  
        const uploadUrl = `${URL}/upload_image`;

        try {
          const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
          });
  
          if (!uploadResponse.ok) {
            throw new Error(`No se pudo cargar el archivo de ${inputName}`);
          }
  
          const uploadData = await uploadResponse.json();
          console.log("URL a enviar:", uploadData.url);
          console.log(`Archivo de ${inputName} cargado con éxito:`, uploadData);
  
          // Envío la URL del archivo subido al backend para guardarla
          const tipoArchivo = inputName; 
          try {
            const saveUrlResponse = await fetch(`${URL}/users/save_url`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: foundUserId,
                url: uploadData.url, 
                tipo_archivo: tipoArchivo, 
              }),
            });
  
            if (!saveUrlResponse.ok) {
              throw new Error(`Error al guardar la URL del archivo ${tipoArchivo} en la base de datos`);
            }
  
            console.log(`URL del archivo ${tipoArchivo} guardada con éxito en la base de datos`);
          } catch (error) {
            console.error(`Error al guardar la URL del archivo ${tipoArchivo} en la base de datos:`, error);
            alert(`Error al guardar la URL del archivo ${tipoArchivo}. Por favor, inténtalo de nuevo.`);
            allFilesUploaded = false;
            break; 
          }
        } catch (error) {
          console.error(`Error al cargar el archivo de ${inputName}:`, error);
          alert(`Error al cargar el archivo de ${inputName}. Por favor, inténtalo de nuevo.`);
          allFilesUploaded = false;
          break; 
        }
      }
    }
  
    if (allFilesUploaded) {
      Toast.fire({
        icon: "success",
        title: "Files saved successfully"
      });
    }
  }
  
  // fin codigo del bucket



  // Codigo para envio de SMS 

  const handlePhoneChange = (formattedValue: string) => {
    setCellPhone(formattedValue); // Actualiza el estado de cellPhone
    setFormData({
      ...formData,
      phone: formattedValue, // Actualiza el estado de formData.phone
    });
  };

  const handleSms = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const formatPhone = "+" + cellPhone;

    try {
      const response = await axios.post(`${URL}/sms/send-otp`, {
        phone_number: formatPhone,
      });

      if (response.data.success) {
        console.log('OTP sent successfully');
        setShowSmsVerify(true)
      } else {
        console.error('Error sending OTP');
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  };

  const telephone = formData.phone || ""; // const para exportar a Modal

  // fin sms verification

  useEffect(() => {
    if (foundUserId) {
      if (pendingDocuments.includes("credentials")) {
        setPendingDocuments(prevPendingDocs => prevPendingDocs.filter(item => item !== "credentials"));
        setPendingCredentials(prevPendingCreds => [...prevPendingCreds, "credentials"]);
      }
      if (pendingDocuments.includes("secret_key")) {
        setPendingDocuments(prevPendingDocs => prevPendingDocs.filter(item => item !== "secret_key"));
        setPendingCredentials(prevPendingCreds => [...prevPendingCreds, "secret_key"]);
      }
      if (pendingDocuments.includes("devices")) {
        setPendingDocuments(prevPendingDocs => prevPendingDocs.filter(item => item !== "devices"));
      }

      if (pendingDocuments.length > 0) {
        setCompleted(false);
      } else {
        setCompleted(true);
      }

      if (pendingCredentials.includes("credentials") && pendingCredentials.includes("secret_key")) {
        setCompletedCredent(false);
      } else {
        setCompletedCredent(true);
      }

      localStorage.setItem("completeCredent", `${completeCredent}`);
    }
  }, [foundUserId, pendingDocuments, pendingCredentials, completeCredent]);

  return (
    <div className=" w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black bg-white">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Profile</h2>

          <Link to="/userReg">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              User Account {loading ? (
                <div className="" role="status"></div>
              ) : (
                verifiedDoc ? <FcApproval className="text-xl"/> 
              : (completed ? <FcOk className="text-xl"/> : <FcHighPriority className="text-xl"/>)
              )}              
            </h1>
          </Link>
          
          <Link to="/credentialsReg">
            <h1 className="flex items-center justify-between px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Credentials {loading ? (
                <div className="" role="status"></div>
              ) : (
                completeCredent ? <FcOk className="text-xl" /> : <FcHighPriority className="text-xl" />
              )}
            </h1>
          </Link>

          <Link to="/idVerification">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Identification
            </h1>
          </Link>

          <Link to="/security">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Security Settings
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/notifications">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              PRO Account
            </h1>
          {/* </Link> */}
        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">
          
          <div className="flex flex-row justify-between items-end">
            <h2 className="flex justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4">
              USER ACCOUNT
            </h2>

            <div className="flex justify-between w-[45%] 2xl:w-[50%] mr-2">
              <h1 className="flex items-center font-normal">
                Pending&nbsp; <FcHighPriority className="text-xl"/>     
              </h1>

              <h1 className="flex items-center font-normal">
                Completed&nbsp; <FcOk className="text-xl"/>
              </h1>

              <h1 className="flex items-center font-normal">
                Verified Docu.&nbsp; <FcApproval className="text-[23px]"/>
              </h1>      
            </div>
          </div>
          

          <div className="flex flex-row justify-start items-center space-y-5 sm:flex-row sm:space-y-0 w-full my-8">
            {/* Imagen del perfil */}
            <div className="w-[40%]">
              <img
                className="object-cover w-36 h-36 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-300"
                src={
                  photo || localStorage.getItem("profilePic") ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="Bordered avatar"
                />
            </div>

            {/* Botones para cambiar y eliminar la imagen */}
            <div className="flex flex-col space-y-5 sm:ml-8">
              <button
                type="button"
                className="py-3 px-7 w-52 text-base font-bold text-black focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200"
              >
                Change Email
              </button>
              <button
                type="button"
                className="py-3.5 px-7 w-52 text-base font-bold text-black focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
              >
                Change Password
              </button>
            </div>

            <div className="flex flex-col justify-start items-center w-full h-full">

            {loading ? (
              <div className="inline-block text-[#6899b86f] h-20 w-20 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
            ) : (
              <div>
                {verifiedDoc ? (
                  <div className="flex items-center">
                    <FcApproval className="text-7xl" />
                  </div>
                ) : (
                  !completed ? (
                    <div className="flex flex-col items-center">
                      <FcHighPriority className="text-2xl" />
                      <h1 className="text-xl text-red-800 font-bold">Pending</h1>
                    </div>                    
                  ) : (
                    <div className="flex items-center">
                      <FcOk className="text-7xl" />
                    </div>
                  )
                )}
              </div>
            )}
              <div>
                {pendingDocuments.map((document: string, index: number) => (
                  <div key={index} className="flex justify-center">
                    <h3>{document}</h3>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Formulario de perfil público */}

          <div className="">
            <form className="grid sm:grid-cols-2 gap-x-14" action="" onSubmit={handleSubmit}>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Full name<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChange}
                  name="full_name"
                  type="text"
                  id="fullname"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Name"
                  value={formData.full_name || ''}                
                  required                  
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChange}
                  name="email"
                  type="email"
                  id="email"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="example@email.com"
                  value={formData.email || ''}
                  required
                  disabled
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="Identification"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Identification Number<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChange}
                  name="identification_number"
                  type="number"
                  id="Identification"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Identification"
                  value={formData.identification_number || ''} 
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="Address"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Residence Address<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChange}
                  name="address"
                  type="text"
                  id="Address"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Address"
                  value={formData.address || ''}
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Phone Number<span className="text-red-600">*</span>
                </label>

                <PhoneInput
                  onChange={handlePhoneChange}
                  country={"co"}
                  value={formData.phone || ''}
                  inputStyle={{
                    background: '#eef2ff',
                    border: '1px solid #a5b4fc',
                    color: '#000000',
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    outline: 'none',
                    width: '100%',
                    height: '47px',
                  }}
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="identity_document"
                    className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                    >
                    Upload a file of your identity document                  
                  </label>
                  {formData.identity_document && (
                    <h1 className="text-green-600 text-xs font-normal mb-2">Uploaded file</h1>
                  )}
                </div>
  
                <input
                  onChange={handleInputChangeBucket}
                  name="identity_document"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="identity_document"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"    
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="bank_account_status"
                    className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                    >
                    Upload a file of your bank account status                   
                  </label>
                  {formData.bank_account_status && (
                    <h1 className="text-green-600 text-xs font-normal mb-2">Uploaded file</h1>
                  )}
                </div>

                <input
                  onChange={handleInputChangeBucket}
                  name="bank_account_status"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="bank_account_status"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="tax_declarations"
                    className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                    >
                    Upload a file of your tax return                   
                  </label>
                  {formData.tax_declarations && (
                    <h1 className="text-green-600 text-xs font-normal mb-2">Uploaded file</h1>
                  )}
                </div>
               
                <input
                  onChange={handleInputChangeBucket}
                  name="tax_declarations"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="tax_declarations"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="other_financial_documents"
                    className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                    >
                    Upload a file of other financial documents                    
                  </label>
                  {formData.other_financial_documents && (
                    <h1 className="text-green-600 text-xs font-normal mb-2">Uploaded file</h1>
                  )}
                </div>
                <input
                  onChange={handleInputChangeBucket}
                  name="other_financial_documents"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="other_financial_documents"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
              </div>

              <div className="">
                  {/* div comodin */}
              </div>

              <div className="flex justify-start w-full">
                <button
                  type="submit"
                  className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-28 mt-4"
                >
                  Save
                </button>
              </div> 
            </form>
          </div>
        </div>
      </main>

      <SmsVerify showSmsVerify={showSmsVerify} setShowSmsVerify={setShowSmsVerify} telephone={telephone}/>
    </div>
  );
}

export { UserRegister };