import iid from '@react-native-firebase/iid';
import database from "@react-native-firebase/database";

  async function getIt() {
    const id = iid().get();
    await id;
    return id
  }

  export function getInstanceId(){
    const id = getIt();
    return Object.keys(id).toString();
  }


export const db = database();
