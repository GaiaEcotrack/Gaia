import axios from 'axios'
import {SetStateAction, useEffect , useState} from 'react'
import { CiCircleMore } from "react-icons/ci"

interface User {
  name: string;
}

interface UsersListProps {
  users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1); // Estado para el número de página actual
    const [totalPages, setTotalPages] = useState(1); // Estado para el número total de páginas
    const itemsPerPage = 10; // Número de elementos por página
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    useEffect(() => {
      const filtered = users.filter((user: { name: string; }) => {
        const name = user.name || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
  
      const totalUsers = filtered.length;
      setTotalPages(Math.ceil(totalUsers / itemsPerPage));
  
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setFilteredUsers(filtered.slice(startIndex, endIndex));
    }, [users, currentPage, searchTerm]);

    function getStatusColor(status:any) {
      switch (status) {
        case 'pending':
          return 'bg-red-500/20 text-red-900';
        case 'complete':
          return 'bg-yellow-500/20 text-yellow-900';
        case 'verified':
          return 'bg-green-500/20 text-green-900';
        default:
          return 'bg-gray-500/20 text-gray-900';
      }
    }
    const handlePreviousPage = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Ir a la página anterior, asegurándose de que no sea menor que 1
    };
  
    const handleNextPage = () => {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages)); // Ir a la página siguiente, asegurándose de que no sea mayor que el número total de páginas
    };
  
    const handleSearch = (event: { target: { value: SetStateAction<string> } }) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1);
  };

  return (
    <div>
        <div className="relative flex flex-col w-full h-full p-4 text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
  <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
    <div className="flex items-center justify-between gap-8 mb-8">
      <div>
        <h5
          className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-gray-800">
          User List
        </h5>
        <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          See information about all users
        </p>
      </div>
      {/* <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
        <button
          className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          view all
        </button>
        <button
          className="flex select-none items-center gap-3 rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            stroke-width="2" className="w-4 h-4">
            <path
              d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z">
            </path>
          </svg>
          Add member
        </button>
      </div> */}
    </div>
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="block w-full overflow-hidden md:w-max">
        <nav>
          <ul role="tablist" className="relative flex flex-row p-1 rounded-lg bg-blue-gray-50 bg-opacity-60">
            <li role="tab"
              className="relative flex items-center justify-center w-full h-full px-2 py-1 font-sans text-base antialiased font-normal leading-relaxed text-center bg-transparent cursor-pointer select-none text-blue-gray-900"
              data-value="all">
              <div className="z-20 text-inherit">
                &nbsp;&nbsp;All&nbsp;&nbsp;
              </div>
              <div className="absolute inset-0 z-10 h-full bg-white rounded-md shadow"></div>
            </li>
            <li role="tab"
              className="relative flex items-center justify-center w-full h-full px-2 py-1 font-sans text-base antialiased font-normal leading-relaxed text-center bg-transparent cursor-pointer select-none text-blue-gray-900"
              data-value="monitored">
              <div className="z-20 text-inherit">
                &nbsp;&nbsp;Monitored&nbsp;&nbsp;
              </div>
            </li>
            <li role="tab"
              className="relative flex items-center justify-center w-full h-full px-2 py-1 font-sans text-base antialiased font-normal leading-relaxed text-center bg-transparent cursor-pointer select-none text-blue-gray-900"
              data-value="unmonitored">
              <div className="z-20 text-inherit">
                &nbsp;&nbsp;Unmonitored&nbsp;&nbsp;
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className="w-full md:w-72">
        <div className="relative h-10 w-full min-w-[200px]">
          <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-blue-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" aria-hidden="true" className="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
            </svg>
          </div>
          <input
           onChange={handleSearch}
            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=" " />
          <label
            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Search by name
          </label>
        </div>
      </div>
    </div>
  </div>
  <div className="p-6 px-0 overflow-scroll">
    <table className="w-full mt-4 text-center table-auto min-w-max">
      <thead>
        <tr>
          <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
            <p className="block font-sans text-base font-bold leading-none text-gray-800">
              User Generator
            </p>
          </th>
          <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
            <p className="block font-sans text-base font-bold leading-none text-gray-800">
              kW Generated
            </p>
          </th>
          <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
            <p className="block font-sans text-base font-bold leading-none text-gray-800">
              Status
            </p>
          </th>
          <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
            <p className="block font-sans text-base font-bold leading-none text-gray-800">
              Last Update
            </p>
          </th>
          <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
            <p className="block font-sans text-base font-bold leading-none text-gray-800">
            </p>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((users:any) => (
          <tr key={users._id}>
          <td className="p-4 border-b border-blue-gray-50 w-[30%]">
            <div className="flex items-center">
              {/* <img src={users.photo_profile}
                alt="John Michael" className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" /> */}
              <div className="flex flex-col w-full text-left">
                <p className="block font-sans text-base antialiased font-normal leading-normal text-blue-gray-900">
                  <span className='font-sans font-bold text-base'>Name:</span> {users.name}
                </p>
                <p className="block font-sans text-base antialiased font-normal leading-normal text-blue-gray-900">
                  <span className='font-sans font-bold text-base'>Account:</span> {users.secret_name}
                </p>
              </div>
            </div>
          </td>
          <td className="p-4 border-b border-blue-gray-50">
            <div className="flex flex-col">
              <p
                className="block font-sans text-base antialiased font-normal leading-normal text-blue-gray-900">
                {users.generatedKW}
              </p>
            </div>
          </td>
          <td className="p-4 border-b border-blue-gray-50">
            <div className="flex flex-col">
              <div
                className={`relative grid items-center py-1 font-sans text-base font-bold uppercase rounded-md select-none whitespace-nowrap ${getStatusColor(users.status_documents)}`}>
                <span className="">{users.status_documents}</span>
              </div>
            </div>
          </td>
          <td className="p-4 border-b border-blue-gray-50">
            <p className="block font-sans text-base antialiased font-normal leading-normal text-blue-gray-900">
              23/04/18
            </p>
          </td>
          <td className="p-4 border-b border-blue-gray-50">
            <button
              className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <CiCircleMore className='text-3xl' color='black' />
              </span>
            </button>
          </td>
        </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div className="flex items-center justify-between p-4 border-t border-blue-gray-50">
    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
      Page {currentPage} of {totalPages}
    </p>
    <div className="flex gap-2">
      <button
      onClick={handlePreviousPage}
        className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        Previous
      </button>
      <button
      onClick={handleNextPage}
        className="select-none rounded-lg border border-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-gray-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button">
        Next
      </button>
    </div>
  </div>
</div>
    </div>
  )
}

export default UsersList