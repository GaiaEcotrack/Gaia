import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserList from '../../UserList';
const Users = () => {
  interface User {
    image: string;
    name: string;
    email: string;
    role: string;
    _id: any;
    full_name: string;
    nombre_apellidos: string;
    onDelete?: () => void; // Propiedad onDelete opcional que es una función sin argumentos y sin valor de retorno
    onEdit?: () => void; // Propiedad onEdit opcional que es una función sin argumentos y sin valor de retorno
  }

  const [users, setUsers] = useState<User[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    identification_number: '',
    address: '',
    phone: '',
    identity_document: '',
    bank_account_status: '',
    tax_declarations: '',
    other_financial_documents: '',
    credentials: '',
    secret_key: '',
    devices: [],
    membresia: false,
    key_auth: '',
    verified_email: false,
    verified_sms: false,
    verified_2fa: false
  });
  const url = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const callUsers = async () => {
      try {
        const response = await axios(`${url}/users/`);
        const allUsers = response.data;
        setUsers(allUsers.users);
        console.log(allUsers);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
    callUsers();
  }, [url]);

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`${url}/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      console.log('Usuario eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleEditUser = async (_id: string) => {
    // Aquí puedes implementar la lógica para editar un usuario
    console.log('Editando usuario:', _id);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser: User = {
        image: 'URL_DE_LA_IMAGEN', // Aquí debes proporcionar una URL válida para la imagen
        name: formData.full_name,
        email: formData.email,
        role: 'Generador', // Puedes cambiar este valor según sea necesario
        _id: '', // Aquí deberías generar un ID único para el nuevo usuario
        nombre_apellidos: formData.full_name,
      };
      await axios.post(`${url}/users/`, formData);
      setUsers([...users, newUser]);
      setFormData({
        email: '',
        full_name: '',
        identification_number: '',
        address: '',
        phone: '',
        identity_document: '',
        bank_account_status: '',
        tax_declarations: '',
        other_financial_documents: '',
        credentials: '',
        secret_key: '',
        devices: [],
        membresia: false,
        key_auth: '',
        verified_email: false,
        verified_sms: false,
        verified_2fa: false
      });
      setIsAddingUser(false);
      console.log('Usuario agregado con éxito');
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
    }
  };
  
  const imageUrl = 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80';

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black ">
        Users
      </h4>

      <button onClick={() => setIsAddingUser(true)} className="bg-green-500 text-white px-4 py-2 rounded-md mb-4">Agregar Usuario</button>

      {isAddingUser && (
        <div className="bg-gray-200 text-black p-4 mb-4 rounded-md flex flex-wrap">
          <h2 className="w-full text-lg font-semibold mb-2">Agregar Nuevo Usuario</h2>
          <form onSubmit={handleAddUser} className="w-full">
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="text" className='rounded-lg w-full mb-2' id="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <label htmlFor="full_name">Nombre Completo:</label>
            <input type="text" className='rounded-lg w-full mb-2' id="full_name" name="full_name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
            <label htmlFor="phone">Teléfono:</label>
            <input type="text" className='rounded-lg w-full mb-2' id="phone" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <div>
            <label htmlFor="membresia">Membresía:</label>
            <input type="checkbox" className='rounded-lg w-full ml-[-45vh]  mb-2' id="membresia" name="membresia" checked={formData.membresia} onChange={(e) => setFormData({ ...formData, membresia: e.target.checked })} />
          </div>
            <label htmlFor="identification_number">Número de Identificación:</label>
            <input type="text" className='rounded-lg w-full mb-2' id="identification_number" name="identification_number" value={formData.identification_number} onChange={(e) => setFormData({ ...formData, identification_number: e.target.value })} />
            <label htmlFor="address">Dirección:</label>
            <input type="text" className='rounded-lg w-full mb-2' id="address" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Guardar</button>
          </form>
        </div>
      )}


      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base ml-12 text-black">
              Gmail
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base text-black">
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Revenues
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase ml-[25vh] xsm:text-base text-black">
              status
            </h5>
          </div>
        </div>

        {users?.map(user => (
          <UserList
            key={user._id}
            id={user._id}
            name={user.nombre_apellidos}
            email={user.email}
            full_name={user.full_name}
            role='Generador'
            image={imageUrl}
            onDelete={() => handleDeleteUser(user._id)}
            onEdit={() => handleEditUser(user._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Users;
