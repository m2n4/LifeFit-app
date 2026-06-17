// ============================================================
// firebase.js — Firebase 초기화 및 Firestore/Auth 래퍼
// Firebase compat SDK(v9 compat)를 window._firebase 네임스페이스에 등록
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBk7oAh970wN06ZokSBQ42OIXyT_Q91ULY",
  authDomain: "mylife-app-f8568.firebaseapp.com",
  projectId: "mylife-app-f8568",
  storageBucket: "mylife-app-f8568.firebasestorage.app",
  messagingSenderId: "430376673684",
  appId: "1:430376673684:web:907a05eb290542b618af81"
};

firebase.initializeApp(firebaseConfig);
var _auth = firebase.auth();
var _db   = firebase.firestore();
var _gp   = new firebase.auth.GoogleAuthProvider();

window._firebase = {
  auth: _auth, db: _db, googleProvider: _gp,

  // ── Auth ──
  onAuthStateChanged:            function(auth,cb){ return auth.onAuthStateChanged(cb); },
  signInWithEmailAndPassword:    function(auth,e,p){ return auth.signInWithEmailAndPassword(e,p); },
  createUserWithEmailAndPassword:function(auth,e,p){ return auth.createUserWithEmailAndPassword(e,p); },
  signOut:                       function(auth){ return auth.signOut(); },
  signInWithPopup:               function(auth,p){ return auth.signInWithPopup(p); },
  updateProfile:                 function(user,d){ return user.updateProfile(d); },
  deleteUser:                    function(user){ return user.delete(); },
  reauthenticateWithCredential:  function(user,c){ return user.reauthenticateWithCredential(c); },
  EmailAuthProvider:  firebase.auth.EmailAuthProvider,
  GoogleAuthProvider: firebase.auth.GoogleAuthProvider,

  // ── Firestore 경로 헬퍼 ──
  doc: function(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    var ref = db;
    for(var i=0;i<args.length;i++){
      if(i%2===0) ref=ref.collection(args[i]); else ref=ref.doc(args[i]);
    }
    return ref;
  },
  collection: function(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    var ref = db;
    for(var i=0;i<args.length;i++){
      if(i%2===0) ref=ref.collection(args[i]); else ref=ref.doc(args[i]);
    }
    return ref;
  },

  // ── Firestore CRUD ──
  getDoc: function(ref){
    return ref.get().then(function(snap){
      var existsVal = snap.exists;
      snap.exists = function(){
        return typeof existsVal === 'function' ? existsVal.call(snap) : Boolean(existsVal);
      };
      return snap;
    });
  },
  setDoc:    function(ref,data,opts){ return opts ? ref.set(data,opts) : ref.set(data); },
  updateDoc: function(ref,data){ return ref.update(data); },
  addDoc:    function(ref,data){ return ref.add(data); },
  deleteDoc: function(ref){ return ref.delete(); },
  onSnapshot: function(ref,cb){
    return ref.onSnapshot(function(snap){
      if(snap && typeof snap.exists !== 'function'){
        var existsVal = snap.exists;
        snap.exists = function(){ return Boolean(existsVal); };
      }
      cb(snap);
    });
  },
  getDocs: function(q){ return q.get(); },
  query: function(ref){
    var constraints = Array.prototype.slice.call(arguments,1);
    var q = ref;
    constraints.forEach(function(c){ q = c(q); });
    return q;
  },
  where:          function(field,op,val){ return function(ref){ return ref.where(field,op,val); }; },
  serverTimestamp:function(){ return firebase.firestore.FieldValue.serverTimestamp(); },
  writeBatch:     function(db){ return db.batch(); },
};

window._firebaseReady = true;
window.dispatchEvent(new Event('firebaseReady'));
