import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
  email: user.email,
  score: 0,
  gamesPlayed: 0,
  upgrades: []
});