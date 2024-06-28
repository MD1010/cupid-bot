function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CupidDB", 1);

    request.onerror = (event: Event) => {
      const error = (event.target as IDBOpenDBRequest).error;
      console.error("Database error:", error);
      reject(error);
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("sentIds", { keyPath: "id" });
    };
  });
}

interface SentId {
  id: string;
}

async function saveSentId(id: string): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["sentIds"], "readwrite");
    const objectStore = transaction.objectStore("sentIds");
    const request = objectStore.add({ id } as SentId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: Event) => {
      const error = (event.target as IDBRequest).error;
      console.error("Error saving sent ID:", error);
      reject(error);
    };
  });
}

async function checkIfSentIdExists(id: string): Promise<boolean> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["sentIds"], "readonly");
    const objectStore = transaction.objectStore("sentIds");
    const request = objectStore.get(id);

    request.onsuccess = () => {
      const result = request.result as SentId | undefined;
      resolve(!!result);
    };

    request.onerror = (event: Event) => {
      const error = (event.target as IDBRequest).error;
      console.error("Error checking sent ID:", error);
      reject(error);
    };
  });
}

export { openDatabase, saveSentId, checkIfSentIdExists };
