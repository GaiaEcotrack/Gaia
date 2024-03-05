import React, { useState } from 'react';

interface User {
  image: string;
  name: string;
  email: string;
  role: string;
  id: any;
  full_name: string;
  onDelete?: () => void;
  onEdit?: () => void;
}

const UserList: React.FC<User> = ({ image, name, email, role, id, full_name, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(email);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedEmail(email);
  };

  const handleSaveEdit = () => {
    // Aquí puedes implementar la lógica para guardar el correo electrónico editado
    console.log('Correo electrónico editado:', editedEmail);
    setIsEditing(false);
  };

  return (
    <ul role="list" className="divide-y divide-gray-100 text-black">
      <li key={id} className="flex justify-between gap-x-6 py-5">
        <div className="flex min-w-0 gap-x-4">
          <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={image} alt="" />
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900">{name}</p>
            {isEditing ? (
              <input
                type="text"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="mt-1 px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            ) : (
              <div>
                <p className="mt-1 truncate text-xs leading-5 text-black">{email}</p>
                <p>{full_name}</p>
              </div>
            )}
          </div>
        </div>
        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
          <p className="text-sm leading-6 text-gray-900">{role}</p>

          <div className="mt-1 flex items-center ml-[40vh]">
            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs leading-5 text-gray-500">Online</p>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        )}
     {/*    {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-2"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
          >
            Edit
          </button>
        )} */}
      </li>
    </ul>
  );
};

export default UserList;
