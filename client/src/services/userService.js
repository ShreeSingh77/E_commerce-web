import api from "./api";



export const getAllUsers = async () => {
    const response = await api.get("/users/all-users");
    return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.patch(
    `/users/update-role/${id}`,
    { role }
  );

  return response.data;
};

export const deleteUser =async (id)=>{
    const response =await api.delete(
        `/users/delete-user/${id}`
    );

    return response.data;
}