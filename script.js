// DOM-Elemente
const mainCircle = document.getElementById('mainCircle');
const connectionDots = document.getElementById('connectionDots');
const statusText = document.getElementById('statusText');
const powerOnBtn = document.getElementById('powerOnBtn');
const powerOffBtn = document.getElementById('powerOffBtn');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const audioToggle = document.getElementById('audioToggle');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const playAudioBtn = document.getElementById('playAudioBtn');
const eventLog = document.getElementById('eventLog');

// Statusvariablen
let isPoweredOn = false;
let isConnected = false;
let isSearching = false;
let audioEnabled = true;

// Initialisierung
function init() {
    console.log("=== Bluetooth Speaker UI Initialisierung ===");
    
    // Debug: Prüfe ob Elemente existieren
    console.log("mainCircle gefunden:", !!mainCircle);
    console.log("connectionDots gefunden:", !!connectionDots);
    console.log("Buttons gefunden:", {
        powerOnBtn: !!powerOnBtn,
        powerOffBtn: !!powerOffBtn,
        connectBtn: !!connectBtn,
        disconnectBtn: !!disconnectBtn
    });
    
    // Initialen Zustand visuell anzeigen
    resetVisualState();
    
    // Event Listener hinzufügen
    powerOnBtn.addEventListener('click', powerOn);
    powerOffBtn.addEventListener('click', powerOff);
    connectBtn.addEventListener('click', startConnection);
    disconnectBtn.addEventListener('click', disconnect);
    audioToggle.addEventListener('change', toggleAudio);
    volumeSlider.addEventListener('input', updateVolume);
    playAudioBtn.addEventListener('click', playAllSounds);
    
    // Volume anzeigen
    updateVolume();
    
    // Buttons initialisieren
    updateButtons();
    
    // Log-Eintrag
    addLogEntry("System gestartet. Speaker ist AUSGESCHALTET.");
    
    console.log("=== Initialisierung abgeschlossen ===");
}

// Visualisierung zurücksetzen
function resetVisualState() {
    // AUSGESCHALTET: Kleiner, dunkler Kreis
    mainCircle.className = 'circle'; // Entfernt alle anderen Klassen
    mainCircle.style.width = '80px';
    mainCircle.style.height = '80px';
    mainCircle.style.backgroundColor = '#34495e';
    
    // Punkte ausblenden
    connectionDots.className = 'connection-dots';
    
    statusText.textContent = 'AUSGESCHALTET';
    statusText.style.color = '#ecf0f1';
}

// Buttons aktualisieren
function updateButtons() {
    powerOnBtn.disabled = isPoweredOn;
    powerOffBtn.disabled = !isPoweredOn;
    connectBtn.disabled = !isPoweredOn || isSearching || isConnected;
    disconnectBtn.disabled = !isConnected;
    
    console.log("Buttons aktualisiert:", {
        isPoweredOn, isConnected, isSearching,
        powerOnDisabled: powerOnBtn.disabled,
        connectDisabled: connectBtn.disabled
    });
}

// Log-Einträge
function addLogEntry(message) {
    const logEntries = eventLog.querySelector('.log-entries');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    logEntry.textContent = `[${timeString}] ${message}`;
    logEntries.insertBefore(logEntry, logEntries.firstChild);
    
    // Max. 10 Einträge behalten
    while (logEntries.children.length > 10) {
        logEntries.removeChild(logEntries.lastChild);
    }
}

// EINSCHALTEN
function powerOn() {
    console.log(">>> EINSCHALTEN");
    
    isPoweredOn = true;
    isConnected = false;
    isSearching = false;
    
    // Visuelles Feedback: Kreis wird groß und blau
    mainCircle.classList.add('on');
    mainCircle.classList.remove('pulsing');
    connectionDots.classList.remove('searching');
    
    statusText.textContent = 'EINGESCHALTET';
    statusText.style.color = '#3498db';
    
    updateButtons();
    
    // Sound simulieren
    if (audioEnabled) {
        console.log("🔊 Einschalt-Sound würde abgespielt");
    }
    
    addLogEntry("✅ Speaker EINGESCHALTET");
}

// AUSSCHALTEN
function powerOff() {
    console.log(">>> AUSSCHALTEN");
    
    isPoweredOn = false;
    isConnected = false;
    isSearching = false;
    
    // Visuelles Feedback: Kreis wird klein und dunkel
    mainCircle.classList.remove('on', 'pulsing');
    connectionDots.classList.remove('searching');
    
    statusText.textContent = 'AUSGESCHALTET';
    statusText.style.color = '#ecf0f1';
    
    updateButtons();
    
    // Sound simulieren
    if (audioEnabled) {
        console.log("🔊 Ausschalt-Sound würde abgespielt");
    }
    
    addLogEntry("⭕ Speaker AUSGESCHALTET");
}

// VERBINDUNG HERSTELLEN
function startConnection() {
    console.log(">>> VERBINDUNG STARTEN");
    
    if (!isPoweredOn || isSearching || isConnected) return;
    
    isSearching = true;
    
    // Visuelles Feedback: 3 pulsierende Punkte
    connectionDots.classList.add('searching');
    statusText.textContent = 'SUCHE...';
    statusText.style.color = '#f39c12';
    
    updateButtons();
    
    // Sound simulieren
    if (audioEnabled) {
        console.log("🔊 Such-Sound würde abgespielt");
    }
    
    addLogEntry("🔍 Suche nach Bluetooth-Geräten...");
    
    // Nach 3 Sekunden: Verbindung herstellen
    setTimeout(() => {
        if (isSearching) {
            completeConnection();
        }
    }, 3000);
}

// VERBINDUNG ERFOLGREICH
function completeConnection() {
    console.log(">>> VERBINDUNG ERFOLGREICH");
    
    isSearching = false;
    isConnected = true;
    
    // Visuelles Feedback: Pulsierender Kreis
    connectionDots.classList.remove('searching');
    mainCircle.classList.add('pulsing');
    statusText.textContent = 'VERBUNDEN';
    statusText.style.color = '#2ecc71';
    
    updateButtons();
    
    // Sound simulieren
    if (audioEnabled) {
        console.log("🔊 Verbindungs-Sound würde abgespielt");
    }
    
    addLogEntry("✅ Bluetooth-Verbindung hergestellt!");
}

// VERBINDUNG TRENNEN
function disconnect() {
    console.log(">>> VERBINDUNG TRENNEN");
    
    if (!isConnected) return;
    
    isConnected = false;
    
    // Visuelles Feedback: Kreis pulsiert nicht mehr
    mainCircle.classList.remove('pulsing');
    statusText.textContent = 'EINGESCHALTET';
    statusText.style.color = '#3498db';
    
    updateButtons();
    
    addLogEntry("🔌 Bluetooth-Verbindung getrennt");
}

// Audio-Einstellungen
function toggleAudio() {
    audioEnabled = audioToggle.checked;
    console.log("Audio", audioEnabled ? "AKTIVIERT" : "DEAKTIVIERT");
    addLogEntry(`🔊 Auditive Rückmeldungen ${audioEnabled ? 'aktiviert' : 'deaktiviert'}`);
}

function updateVolume() {
    volumeValue.textContent = volumeSlider.value;
    console.log("Lautstärke:", volumeSlider.value + "%");
}

function playAllSounds() {
    console.log("Alle Sounds testen");
    addLogEntry("🎵 Test: Alle Sounds werden abgespielt");
    
    // Simuliere nacheinander alle Sounds
    if (audioEnabled) {
        console.log("🔊 Power-On Sound");
        setTimeout(() => console.log("🔊 Searching Sound"), 500);
        setTimeout(() => console.log("🔊 Connected Sound"), 1500);
        setTimeout(() => console.log("🔊 Power-Off Sound"), 2500);
    }
}

// DEMO-Modus: Automatische Demonstration
function startDemo() {
    console.log("=== DEMO START ===");
    addLogEntry("🚀 DEMO-Modus gestartet");
    
    // Schritt 1: Einschalten (nach 1 Sekunde)
    setTimeout(() => {
        powerOn();
        
        // Schritt 2: Verbindung suchen (nach 2 Sekunden)
        setTimeout(() => {
            if (isPoweredOn) {
                startConnection();
                
                // Schritt 3: Verbindung trennen (nach 7 Sekunden)
                setTimeout(() => {
                    if (isConnected) {
                        disconnect();
                        
                        // Schritt 4: Ausschalten (nach 9 Sekunden)
                        setTimeout(() => {
                            if (isPoweredOn) {
                                powerOff();
                                console.log("=== DEMO ENDE ===");
                                addLogEntry("🏁 DEMO-Modus beendet");
                            }
                        }, 2000);
                    }
                }, 4000);
            }
        }, 2000);
    }, 1000);
}

// Debug-Funktion: Visuelle Elemente testen
function testVisualElements() {
    console.log("=== VISUELLER TEST ===");
    
    // Test 1: Grundzustand
    console.log("1. Grundzustand (ausgeschaltet)");
    resetVisualState();
    
    // Test 2: Eingeschaltet
    setTimeout(() => {
        console.log("2. Eingeschaltet");
        mainCircle.classList.add('on');
        statusText.textContent = 'TEST: EINGESCHALTET';
        
        // Test 3: Suche
        setTimeout(() => {
            console.log("3. Suche");
            connectionDots.classList.add('searching');
            statusText.textContent = 'TEST: SUCHE...';
            
            // Test 4: Verbunden
            setTimeout(() => {
                console.log("4. Verbunden");
                connectionDots.classList.remove('searching');
                mainCircle.classList.add('pulsing');
                statusText.textContent = 'TEST: VERBUNDEN';
                
                // Test 5: Zurück zum Anfang
                setTimeout(() => {
                    console.log("5. Zurücksetzen");
                    resetVisualState();
                    console.log("=== TEST ENDE ===");
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

// Initialisierung
window.addEventListener('DOMContentLoaded', init);

// Debug: Test-Buttons zum Debuggen
window.addEventListener('load', function() {
    // Debug-Buttons hinzufügen
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '10px';
    debugDiv.style.right = '10px';
    debugDiv.style.zIndex = '1000';
    debugDiv.style.background = 'rgba(0,0,0,0.8)';
    debugDiv.style.padding = '10px';
    debugDiv.style.borderRadius = '5px';
    
    debugDiv.innerHTML = `
        <button onclick="testVisualElements()" style="margin:5px; padding:5px 10px; background:#f39c12; color:white; border:none; border-radius:3px; cursor:pointer">
            🔧 Visuellen Test starten
        </button>
        <button onclick="startDemo()" style="margin:5px; padding:5px 10px; background:#2ecc71; color:white; border:none; border-radius:3px; cursor:pointer">
            🚀 Demo starten
        </button>
    `;
    
    document.body.appendChild(debugDiv);
});