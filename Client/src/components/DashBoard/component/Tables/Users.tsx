import { useEffect, useState } from 'react';
import { BRAND } from '../../../../../../../../free-react-tailwind-admin-dashboard-main/src/types/brand';
import UserList from '../../UserList';
import BrandOne from '../images/brand/brand-01.svg';
import BrandTwo from '../images/brand/brand-02.svg';
import BrandThree from '../images/brand/brand-03.svg';
import BrandFour from '../images/brand/brand-04.svg';
import BrandFive from '../images/brand/brand-05.svg';
import axios from 'axios';

const Users = () => {
  
interface UserType {
  email: string;
  username: string;
  nombre_apellidos: string;
  telefono: string;
  _id: string;
}
const imageUrl = 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
  const [users, setUsers] = useState<UserType[]>();

  const url = import.meta.env.VITE_APP_API_URL
   
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
  },);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black ">
        Users
      </h4>

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
              <UserList id={user._id} name={user.nombre_apellidos} email={user.email} role='Generador' image={imageUrl} />
          ))}
    
      </div>
    </div>
  );
};

export default Users;
