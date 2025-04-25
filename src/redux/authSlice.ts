import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for the state
interface AuthState {
  loading: boolean;
  token: string | null;
  user: Record<string, any> | null;
}

// Initial state with type
// Initial state with type
const initialState: AuthState = {
  loading: false,
  token: localStorage.getItem("token") || null, // Token is stored as a string
  user: localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user") as string) 
    : null, // Parse user data from localStorage
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Type for setLoading
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // ✅ Type for setToken
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload); // Store the token as a string
      } else {
        localStorage.removeItem("token"); // If token is null, remove it from localStorage
      }
    },
    
    // ✅ Type for setUser
    setUser(state, action: PayloadAction<Record<string, any> | null>) {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload)); // Save as JSON string
      } else {
        localStorage.removeItem("user"); // Remove from localStorage if the user is null
      }
    }
    
  },
});

// Export actions
export const { setLoading, setToken, setUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
