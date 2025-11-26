// frontend/src/store/slices/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: UserState = {
  // Для теста пока сделаем пользователя сразу авторизованным
  isAuthenticated: true, 
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjIwMTA5MTUsImlzX21vZGVyYXRvciI6ZmFsc2UsInVzZXJfaWQiOjN9.plg2H7XuCUtq5s8GTGZ0zY45WYZajyVs0Drrbbri1Xg",
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
});

export default userSlice.reducer;