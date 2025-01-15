import { openDB } from "idb";
import { browser } from "$app/environment";
import * as Console from "$lib/middleware/log";

/*
DB -> Object object_store -> Object
*/

Console.Log("Status",`Running in brower? ${browser}`);

export let dbPromise

export function createDB() {
  Console.Log("STATUS", `Creating indexed DB`);
  dbPromise = openDB("appDatabase", 1, {
    upgrade(db) {
      // Create a object_store of objects
      const userStore = db.createObjectStore("userStore", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      const cesiumStore = db.createObjectStore("cesiumStore", {
        // The 'id' property of the object will be the key.
        keyPath: "id",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index, containing the values below.
      newIndex(
        userStore, [
        "userID",
        "userName",
        "userOrganisation",
        "projectID",
        "mediaID"
      ])
      newIndex(
        cesiumStore, [
        "projectLocations",
        "sensorLocations"
      ])
    },
  });
  Console.Log("SUCCESS", `Created indexed DB`);
}

function newIndex(object_store, index) {
  Console.Log("STATUS", `Creating new index(es), ${index}, within ${object_store}`);
  index.forEach((obj) => {
    object_store.createIndex(obj, obj);
  })
  Console.Log("SUCCESS", `Created index(es), ${index}, within ${object_store}`);
}

export async function saveObject(object, objectStoreName) { // Save object to the indexed db, needs the object to be stored and the objectStoreName
  Console.Log("STATUS", `Saving ${object}, within ${objectStoreName}`);
  const db = await dbPromise; // Open db
  const tx = db.transaction(objectStoreName, "readwrite"); // Create a transaction within the selected object_store
  const object_store = tx.objectStore(objectStoreName);
  await object_store.add(object); // Add the object to the object_store
  Console.Log("SUCCESS", `Saved ${object}, within ${objectStoreName}`);
  return tx.complete;
}

export async function getObject(object, objectStoreName, parse = false) { // Get object from the indexed db, needs the object to be stored and the objectStoreName. Parsing is optional true/false
  Console.Log("STATUS", `Retrieving ${object}, within ${objectStoreName}`);
  const db = await dbPromise;  // Open db
  const result = await db.getAllFromIndex(objectStoreName, object); // Get all object within the object
  if (parse === true) {
    console.log("parsing")
    console.log(result)
    Console.Log("SUCCESS", `Retrieved and formatted ${object}, within ${objectStoreName}`);
    return result[0][object] // Return only the value within the object
  }
  else {
    Console.Log("SUCCESS", `Retrieved ${object}, within ${objectStoreName}`);
    return result;
  }
}

export async function updateObject(id, newObject, objectStoreName) { // Update object in the indexed db, needs the id of the old object, the new object to be stored and the objectStoreName.
  Console.Log("STATUS", `Updating ${id}, within ${objectStoreName}`);
  const db = await dbPromise;  // Open db
  const tx = db.transaction(objectStoreName, "readwrite");  // Create a transaction within the selected object_store
  const object_store = tx.objectStore(objectStoreName);
  await object_store.put({ ...newObject, id });  // Update the object within the object_store
  Console.Log("SUCCESS", `Updated ${id}, within ${objectStoreName}`);
  return tx.complete;
}

export async function deleteObject(id, objectStoreName) { // Delete object from the indexed db, needs the id of the object and the objectStoreName.
  Console.Log("STATUS", `Deleting ${id}, within ${objectStoreName}`);
  const db = await dbPromise;  // Open db
  const tx = db.transaction(objectStoreName, "readwrite");  // Create a transaction within the selected object_store
  const object_store = tx.objectStore(objectStoreName);
  await object_store.delete(id);  // Remove the object from the object_store
  Console.Log("SUCCESS", `Deleted ${id}, within ${objectStoreName}`);
  return tx.complete;
}

export async function checkObject(object, objectStoreName) {
  const db = await dbPromise;
  /*
  db.transaction("customers").objectStore("customers").get("444-44-4444").onsuccess = function(event) {
    alert("Name for SSN 444-44-4444 is " + event.target.result.name);
  };
  */
  const obj = await getObject(object, objectStoreName)
  Console.Log("STATUS", `Checking ${object} within ${objectStoreName}`);
  console.table(obj)
  if (obj.length === 0) {
    Console.Log("ERROR", `${object} within ${objectStoreName} is empty`);
    return false
  } else {
    Console.Log("SUCCESS", `${object} within ${objectStoreName} has a valid value`);
    return true
  }
}