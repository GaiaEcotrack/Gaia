import { FcOk } from "react-icons/fc"; 
import { FcHighPriority } from "react-icons/fc"; 
import { FcApproval } from "react-icons/fc"; 

import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

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
    phone: null,
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
  
    // console.log('Datos del formulario a enviar:', formData);
       
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

  //! funcion orignal donde no funciona la obtencion de la url
  // async function handleSubmitBucket(e: React.FormEvent) {
  //   e.preventDefault();
  
  //   let allFilesUploaded = true;
  //   let fileUploadData: Record<string, string> = {} // Objeto para almacenar las URLs de los archivos subidos
  
  //   // Itera sobre cada archivo seleccionado y envíalo
  //   for (const [inputName, file] of Object.entries(selectedFiles) as [string, File | null][]) {
  //     const formData = new FormData();
  //     if (file !== null) {
  //       formData.append('file', file);
  //     }
  
  //     const uploadUrl = `${URL}/upload_image`;
  //     console.log();
      
  
  //     try {
  //       const uploadResponse = await fetch(uploadUrl, {
  //         method: 'POST',
  //         body: formData,
  //       });
  
  //       if (!uploadResponse.ok) {
  //         throw new Error(`No se pudo cargar el archivo de ${inputName}`);
  //       }
  
  //       const uploadData = await uploadResponse.json();
  //       console.log(`Archivo de ${inputName} cargado con éxito:`, uploadData);
  
  //       // Suponiendo que uploadData contiene la URL del archivo subido
  //       // Ajusta la clave según el nombre del input para que coincida con el backend
  //       let urlKey = `${inputName}_url`; // Por ejemplo: identity_document_url
  //       fileUploadData[urlKey] = uploadData.url;
  //     } catch (error) {
  //       console.error(`Error al cargar el archivo de ${inputName}:`, error);
  //       alert(`Error al cargar el archivo de ${inputName}. Por favor, inténtalo de nuevo.`);
  //       allFilesUploaded = false;
  //       break; // Detiene el proceso si alguno de los archivos falla al cargar
  //     }
  //   }
  
  //   // Si todos los archivos se cargaron exitosamente, procede a enviar las URLs al backend
  //   if (allFilesUploaded) {
  //     try {
  //       const saveUrlResponse = await fetch("http://127.0.0.1:5000/save_url", { // Ajusta esta URL al endpoint correcto
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           user_id: localStorage.getItem('id'), // Asegúrate de tener el ID del usuario disponible
  //           ...fileUploadData, // Envía todas las URLs de los archivos subidos
  //         }),
  //       });
  
  //       if (!saveUrlResponse.ok) {
  //         throw new Error('Error al guardar las URLs en la base de datos');
  //       }
  
  //       // Respuesta exitosa de guardar las URLs
  //       console.log('URLs de los archivos guardadas con éxito en la base de datos');
  //       alert('Todos los archivos y sus URLs se han guardado exitosamente.');
  //       // Aquí puedes incluir cualquier lógica adicional tras el éxito, como redireccionar al usuario
  //     } catch (error) {
  //       // console.error('Error al guardar las URLs en la base de datos:', error);
  //       // alert('Error al guardar las URLs de los archivos. Por favor, inténtalo de nuevo.');
  //     }
  //   }
  // }  

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
    // Usar direcemtante userID del foundUserId para evitar que se ejecute antes de obtenerlo
  // const userId = foundUserId;  
  //   console.log(userId);
    
  
    // if (!userId) {
    //   console.error('No se encontró el ID del usuario');
    //   alert('No se encontró el ID del usuario. Por favor, inténtalo de nuevo.');
    //   return;
    // }
  
    // Itera sobre cada archivo seleccionado y envíalo
    for (const [inputName, file] of Object.entries(selectedFiles)) {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        const uploadUrl = "http://127.0.0.1:5000/upload_image";

  
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
            const saveUrlResponse = await fetch("http://127.0.0.1:5000/users/save_url", {
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
      alert('Todos los archivos y sus URLs se han guardado exitosamente.');
    }
  }
  
  // fin codigo del bucket

   
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
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Register</h2>

          <Link to="/userReg">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              User Register {loading ? (
                <div className="" role="status"></div>
              ) : (
                verifiedDoc ? <FcApproval className="text-xl"/> 
              : (completed ? <FcOk className="text-xl"/> : <FcHighPriority className="text-xl"/>)
              )}              
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Device Register
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
          

          <div className="flex flex-row justify-start items-center space-y-5 sm:flex-row sm:space-y-0 max-w-4xl my-8">
            {/* Imagen del perfil */}
            <img
              className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-300"
              src={
                localStorage.getItem("profilePic") ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="Bordered avatar"
            />

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

            <div className="flex flex-col justify-start items-center w-[48%] 2xl:w-[51%] h-full">

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
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
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
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
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
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Identification"
                  value={formData.identification_number || ''} 
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Residence Address<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChange}
                  name="address"
                  type="text"
                  id="Address"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
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
                <input
                  onChange={handleInputChange}
                  name="phone"
                  type="number"
                  id="phone"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Phone"
                  value={formData.phone || ''}
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileId"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Upload a file of your identity document<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChangeBucket}
                  name="identity_document"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileId"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"    
                  // required
                />
                {/* <h1 className="text-green-600 absolute">{formData.identity_document}</h1> */}
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileBank"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Upload a file of your bank account status<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChangeBucket}
                  name="bank_account_status"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileBank"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
                {/* <h1 className="text-green-600 absolute">{formData.bank_account_status}</h1> */}
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileTax"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Upload a file of your tax return<span className="text-red-600">*</span>
                </label>
                <input
                  onChange={handleInputChangeBucket}
                  name="tax_declarations"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileTax"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
                {/* <h1 className="text-green-600 absolute">{formData.tax_declarations}</h1> */}
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="filefin1"
                  className="block mb-2 text-sm font-bold text-black-50 dark:text-black"
                >
                  Upload a file of other financial documents
                </label>
                <input
                  onChange={handleInputChangeBucket}
                  name="other_financial_documents"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="filefin1"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
                {/* <h1 className="text-green-600 absolute">{formData.other_financial_documents}</h1> */}
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

      <div className="md:hidden sticky flex flex-col gap-2 p-4 text-sm top-10 mb-8">
        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
        <Link to="/userReg">
          <h1 className="flex items-center px-3 py-2.5 font-bold bg-white text-black border rounded-full">
            User Register
          </h1>
        </Link>

        <Link to="/deviceReg">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Device Register
          </h1>
        </Link>

        <Link to="/CredentialsReg">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Credentials
          </h1>
        </Link>

        <Link to="/NotificacionesConfig">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Notifications
          </h1>
        </Link>

        <Link to="/account">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            PRO Account
          </h1>
        </Link>
      </div>
    </div>
  );
}

export { UserRegister };