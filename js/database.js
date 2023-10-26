import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs , doc, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"

class MusicDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }

    open(){
        return new Promise((resolve, reject) =>{
            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyAJCCE4FrTtGV1tMM8Hx8ieGuWxFYJh72g",
                    authDomain: "web-music-lab3.firebaseapp.com",
                    databaseURL: "https://web-music-lab3-default-rtdb.firebaseio.com",
                    projectId: "web-music-lab3",
                    storageBucket: "web-music-lab3.appspot.com",
                    messagingSenderId: "771301371443",
                    appId: "1:771301371443:web:15a478660cf93be63fbd46",
                    measurementId: "G-DJ6GK0JS2G"
                  };
        
                // Initialize Firebase
                const app = initializeApp(firebaseConfig)
                const db = getFirestore(app)
                console.log('DB Open: ', db)
                if(db){
                    this.db = db;
                    this.isAvailable = true;
                    resolve();
                }else{
                    reject('The database is not available.')
                }
                
            } catch (error) {
                reject(error.message) 
            }
        }) 
    }

    addSong(title, artist, likes){
        return new Promise((resolve, reject) =>{
            if(!this.isAvailable){
                reject('DB not opened.')
            }

            const song = {
                title: title,
                artist: artist,
                likes: likes
            }

            const dbCollection = collection(this.db, 'db_music');
            addDoc(dbCollection, song)
            .then((docRef) =>{
                resolve(docRef.id);
            })
            .catch((error) =>{
                reject(error.message);
            });
        }) 
    }

    getSongList(){
        return new Promise((resolve, reject) =>{
            if(!this.isAvailable){
                reject('DB not opened.')
            }

            const dbCollection = collection(this.db, 'db_music');
            getDocs(dbCollection)
            .then((querySnapshot) =>{
                const result = [];
                querySnapshot.forEach((doc) => {
                    let data = doc.data()
                    data.id = doc.id;
                    result.push(data);
                  });
                resolve(result);
            })
            .catch((error) =>{
                reject(error.message);
            });
        }) 
    }

    updataLikeCounts(updatedLikeCounts){
        return new Promise((resolve, reject) =>{
            if(!this.isAvailable){
                reject('DB not opened.')
            }

            const docRef = doc(this.db, 'db_music', updatedLikeCounts.id);
            updateDoc(docRef, { likes: updatedLikeCounts.likes})
            .then(() =>{
                resolve();
            })
            .catch((error) =>{
                reject(error.message);
            });
        }) 
    }

    deleteSong(id){
        return new Promise((resolve, reject) =>{
            if(!this.isAvailable){
                reject('DB not opened.')
            }

            const docRef = doc(this.db, 'db_music', id);
            deleteDoc(docRef)
            .then(() =>{
                resolve();
            })
            .catch((error) =>{
                reject(error.message);
            });
        }) 
    }
}

export default new MusicDB();