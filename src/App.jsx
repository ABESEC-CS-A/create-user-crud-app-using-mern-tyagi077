
import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import axios from 'axios';

function App() {

  const [users, setUsers] = useState([]);

  const [editUser, setEditUser] = useState({ name: '', role: '' });

  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://userapp6.onrender.com/users");
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    try {
      await axios.delete(`https://userapp6.onrender.com/removeuser/${email}`);
      setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
      console.log(`Deleted user with email: ${email}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }


  const handleUpdate = async (user) => {
    setEmail(user.email);
    setEditUser({
      name: user.name,
      role: user.role
    })
  }

  const handleSave = async (email) => {
    try {
      await axios.put(`https://userapp6.onrender.com/updateuser/${email}`, {
        name: editUser.name,
        role: editUser.role
      });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.email === email ? { ...user, name: editUser.name, role: editUser.role } : user
        )
      );

      setEmail(null);
      setEditUser({ name: '', role: '' });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };


  return (
    <>
      <div className='bg-black h-20 flex justify-center items-center'>
        <h2 className='text-white text-4xl font-semibold '>MY USER APP</h2>
      </div>
      <div className='bg-[#DCDCDC] h-10 flex justify-center items-center'>
        <h2 className='text-black text-2xl font-semibold '>LIST OF USERS</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            <tr className="flex w-full">
              <th className="w-1/12 p-2 border">Sr.No.</th>
              <th className="w-3/12 p-2 border">User Email</th>
              <th className="w-3/12 p-2 border">User Name</th>
              <th className="w-2/12 p-2 border">User Role</th>
              <th className="w-3/12 p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
          
            {users.map((user, index) => (
              <tr key={user._id || index} className="flex w-full">
                <td className="w-1/12 p-2 border">{index + 1}</td>
                <td className="w-3/12 p-2 border">{user.email}</td>
                <td className="w-3/12 p-2 border">
                  {email === user.email ? (
                    <input
                      value={editUser.name}
                      onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      className="w-full px-1 border"
                    />
                  ) : (
                    user.name
                  )}
                </td>

                <td className="w-2/12 p-2 border">{user.role}</td>
                <td className="w-3/12 p-2 border flex space-x-12">
                  <button onClick={() => {
                    if (email === user.email) {
                      handleSave(user.email);
                    } else {
                      handleUpdate(user);
                    }
                  }} className="text-blue-600 hover:underline">
                    {
                      email === user.email ? 'Save' : 'Edit'
                    }
                  </button>
                  <button onClick={() => handleDelete(user.email)} className="text-blue-600 hover:underline">{
                    email === user.email ? 'Cancel' : 'Delete'
                  }</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </>
  )
}

export default App
