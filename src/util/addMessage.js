import localforage from "localforage";

export const addMessage = async (message) => {
  try {
    const messages = (await localforage.getItem("messages")) ?? [];
    messages.push(message);
    await localforage.setItem("messages", messages);
  } catch (e) {
    console.log(e);
  }
};
