import localforage from "localforage";
export const getMessages = async () => {
  try {
    return await localforage.getItem("messages");
  } catch (e) {
    console.log(e);
    return [];
  }
};
