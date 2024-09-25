import { SetStateAction, useEffect, useState } from "react";
import { CiCircleMore } from "react-icons/ci";
import { fetchDataHoymilesInstaller, fetchDataGrowattInstaller } from './fetchDataInstallerDevice'; 
import ModalDevice from "./modalDevice";
import { ApiLoader } from "@/components";

interface User {
  _id: string;
  name: string;
  brand: string;
  secret_name: string;
  generatedKW: string;
  status_documents: string;
}

interface UsersListProps {
  users: User[];
  openModal: any;
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const date = today.toLocaleDateString();

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    const filtered = users.filter((user) => {
      const name = user.secret_name || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalUsers = filtered.length;
    setTotalPages(Math.ceil(totalUsers / itemsPerPage));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredUsers(filtered.slice(startIndex, endIndex));
  }, [users, currentPage, searchTerm]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSearch = (event: { target: { value: SetStateAction<string> } }) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleUserClick = async (user: User) => {
    setLoading(true);
    try {
      let userDeviceData;
      if (user.brand === 'Hoymiles') {
        userDeviceData = await fetchDataHoymilesInstaller(user.secret_name);
      } else if (user.brand === 'Growatt') {
        userDeviceData = await fetchDataGrowattInstaller(user.secret_name);
      }
      setSelectedUserData(userDeviceData);
      setModal(true);
    } catch (error) {
      console.error('Error fetching user device data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="relative flex flex-col w-full h-full p-4 text-gray-700 bg-white shadow-2xl rounded-xl bg-clip-border">
        {/* Header and Search Input */}
        <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <h5 className="text-xl font-semibold leading-snug text-gray-700">User List</h5>
            <p className="mt-1 text-base font-normal text-gray-700">See information about all users</p>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="block w-full md:w-max">
              <nav>
                <ul className="relative flex flex-row p-1 rounded-lg bg-blue-gray-50 bg-opacity-60">
                  <li className="relative flex items-center justify-center w-full h-full px-2 py-1 font-sans text-base font-normal text-blue-gray-900 cursor-pointer">
                    <div className="z-10 text-inherit">&nbsp;&nbsp;All&nbsp;&nbsp;</div>
                    <div className="absolute inset-0 h-full bg-white rounded-md shadow"></div>
                  </li>
                  <li className="relative flex items-center justify-center w-full h-full px-2 py-1 font-sans text-base font-normal text-blue-gray-900 cursor-pointer">
                    <div className="text-inherit">&nbsp;&nbsp;Monitored&nbsp;&nbsp;</div>
                  </li>
                  <li className="relative flex items-center justify-center w-full h-full px-2 py-1 font-sans text-base font-normal text-blue-gray-900 cursor-pointer">
                    <div className=" text-inherit">&nbsp;&nbsp;Unmonitored&nbsp;&nbsp;</div>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="w-full md:w-72">
              <div className="relative h-10 w-full min-w-[200px]">
                <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-blue-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  onChange={handleSearch}
                  className="peer h-full w-full rounded-lg border border-blue-gray-200 px-3 py-2.5 pr-9 text-sm placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                  placeholder="Search by name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="pt-6 px-0 overflow-x-auto">
          <table className="w-full mt-4 text-center table-auto min-w-max">
            <thead>
              <tr>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50">User Generator</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50">Kw Generated</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50">Status</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50">Last Update</th>
                <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex items-center text-left">
                      <div className="flex flex-col">
                        <p className="font-bold">Brand:</p>
                        {user.brand}
                        <p className="font-bold">Account:</p>
                        {user.secret_name}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">{user.generatedKW}</td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <span className={`py-1 px-2 rounded-md bg-green-500/20 text-green-900`}>
                      {user.status_documents || 'online'}
                    </span>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">{date}</td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <button onClick={() => handleUserClick(user)} className="relative h-10 w-10 rounded-lg text-gray-900 hover:bg-gray-100">
                      <CiCircleMore className="text-3xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Loader */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
              <ApiLoader/>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50">
            Previous
          </button>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50">
            Next
          </button>
        </div>

        {/* Modal */}
        {modal && <ModalDevice close={closeModal} deviceData={selectedUserData} />}
      </div>
    </div>
  );
};

export default UsersList;
