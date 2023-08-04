import { create } from "zustand";

const useAuthStore = create((set) => ({
  tabs: null,
  setTabState: (data) => set({ tabs: data }),
  user: null,
  setUserState: (data) => set({ user: data }),

}));

export default useAuthStore;
//to use zustand global state managment as import,
//import this file to your component where you want to send data to this store.
//then use "useAuthStore.setState({ user: *your data* });" this will store data in user object.
//setState is basically the above defined object (can be named anything)
//to fetch the stored data in any component,
//import this file to the component where you want to render this data
//then create a variable ex: const user = useAuthStore((state) => state.user);
//this will fetch your above user object


