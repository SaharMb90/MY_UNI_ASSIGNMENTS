// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    databaseURL: "firebase url for real time database",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID",
    appId: "APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Authentication functions
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Logged in!");
            document.getElementById('auth-container').style.display = 'none';
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

function feedNow() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            database.ref('feednow').set(1).then(() => {
                alert("Feeding Now!");
            }).catch((error) => {
                console.error("Error writing to Firebase: ", error);
            });
        } else {
            alert("Please log in first.");
        }
    });
}

function scheduleFeed(timerIndex, time) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            database.ref('timers/timer' + timerIndex).set({
                time: time
            }).then(() => {
                alert("Feed scheduled at " + time);
            }).catch((error) => {
                console.error("Error writing to Firebase: ", error);
            });
        } else {
            alert("Please log in first.");
        }
    });
}

// Clock Function
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = currentTime;
}

setInterval(updateClock, 1000);
updateClock(); // initial call

// Update environment data
function updateEnvironment() {
    const temperatureRef = database.ref('temperature');
    const humidityRef = database.ref('humidity');

    temperatureRef.on('value', (snapshot) => {
        const temp = snapshot.val();
        document.getElementById('temperature').textContent = temp !== null ? temp : '--';
    });

    humidityRef.on('value', (snapshot) => {
        const humidity = snapshot.val();
        document.getElementById('humidity').textContent = humidity !== null ? humidity : '--';
    });
}

updateEnvironment();
