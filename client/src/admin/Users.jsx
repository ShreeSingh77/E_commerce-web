import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";
import {
  getAllUsers,
  deleteUser as deleteUserApi,
} from "../services/userService";
import {MdWarningAmber} from "react-icons/md"
import "./Admin.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      console.log(response);

      setUsers(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load users"
      );
    }
  };

  const updateRole = async (id, role) => {
    try {
      await api.patch(
        `/users/update-role/${id}`,
        { role },
        {
          withCredentials: true,
        }
      );

      toast.success("Role updated successfully");

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Role update failed"
      );
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUserApi(id);

      toast.success("User deleted successfully");

      setDeleteUserId(null);
      setSelectedUser(null);

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.username
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">

        <div className="products-header">
          <div>
            <h1>Users Management</h1>
            <p>Total Users: {users.length}</p>
          </div>
        </div>

        <div className="products-toolbar">
          <input
            type="text"
            placeholder="🔍 Search users..."
            className="search-input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <table className="products-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr
                key={user._id}
                onClick={() => setSelectedUser(user)}
                style={{ cursor: "pointer" }}
              >

                <td>{user.fullName}</td>

                <td>{user.username}</td>

                <td>{user.email}</td>

                <td>

                  <select
                    className={`role-select ${user.role}`}
                    value={user.role}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    onChange={(e) =>
                      updateRole(
                        user._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="customer">
                      Customer
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteUserId(user._id);
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        {/* User Details Modal */}
        {selectedUser && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="user-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="user-modal-header">
                <h2>User Details</h2>

                <button
                  className="close-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  ×
                </button>
              </div>

              <div className="modal-avatar">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.fullName}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {selectedUser.fullName?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="user-info">

                <p>
                  <strong>Name:</strong>{" "}
                  {selectedUser.fullName}
                </p>

                <p>
                  <strong>Username:</strong>{" "}
                  {selectedUser.username}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selectedUser.email}
                </p>

                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`role-badge ${selectedUser.role}`}
                  >
                    {selectedUser.role}
                  </span>
                </p>

                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(
                    selectedUser.createdAt
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

              </div>

            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteUserId && (
          <div className="delete-modal-overlay">

            <div className="delete-modal">
       
              <h2 className="delete-title">
  <MdWarningAmber />
  Delete User
</h2>

              <p>
                Are you sure you want to delete
                <strong>
                  {" "}
                  {
                    users.find(
                      (user) => user._id === deleteUserId
                    )?.fullName
                  }
                  ?
                </strong>
              </p>

              <p className="delete-warning">
                This action cannot be undone.
              </p>

              <div className="delete-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setDeleteUserId(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="confirm-delete-btn"
                  onClick={async () => {
                    await handleDeleteUser(
                      deleteUserId
                    );
                  }}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Users;