// 1) Cole aqui o firebaseConfig do seu projeto (Firebase Console > Configurações do projeto > Seus apps > Web).
const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

// ---- Daqui para baixo não precisa mexer ----
const V = "10.14.1", G = `https://www.gstatic.com/firebasejs/${V}/`;
const send = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
const stub = () => {};
if (firebaseConfig.apiKey.startsWith("COLE")) {
  window.FBMISSING = true;
  window.FB = { login: stub, logout: stub, saveCfg: stub, txSet: stub, txDel: stub, txBatch: stub };
  send("fb-user", null);
} else {
  const { initializeApp } = await import(G + "firebase-app.js");
  const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } = await import(G + "firebase-auth.js");
  const { initializeFirestore, persistentLocalCache, doc, setDoc, deleteDoc, collection, onSnapshot, writeBatch } = await import(G + "firebase-firestore.js");
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = initializeFirestore(app, { localCache: persistentLocalCache() });
  let uid = null, unsubs = [];
  const tx = (id) => doc(db, "users", uid, "tx", String(id));
  window.FB = {
    login: () => signInWithPopup(auth, new GoogleAuthProvider()).catch(e => alert("Não foi possível entrar: " + e.code)),
    logout: () => signOut(auth),
    saveCfg: (c) => setDoc(doc(db, "users", uid), c),
    txSet: (t) => setDoc(tx(t.id), t),
    txDel: (id) => deleteDoc(tx(id)),
    txBatch: async (list, del) => {
      for (let i = 0; i < list.length; i += 400) {
        const b = writeBatch(db);
        list.slice(i, i + 400).forEach(t => del ? b.delete(tx(t.id)) : b.set(tx(t.id), t));
        await b.commit();
      }
    }
  };
  onAuthStateChanged(auth, (u) => {
    unsubs.forEach(f => f()); unsubs = [];
    uid = u ? u.uid : null;
    send("fb-user", u ? { name: u.displayName, email: u.email } : null);
    if (u) {
      unsubs.push(onSnapshot(doc(db, "users", uid), s => send("fb-cfg", s.exists() ? s.data() : null)));
      unsubs.push(onSnapshot(collection(db, "users", uid, "tx"), s => send("fb-tx", s.docs.map(d => d.data()))));
    }
  });
}
