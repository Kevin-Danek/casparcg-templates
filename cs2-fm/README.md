# CS2 FM Templates

## Components

### Map Pick

```js
update({
  "match": {
    "home": { "name": "Atherians", "logo": "./assets/logo_nuke.png" },
    "guest": { "name": "GOLD GOLD GOLD", "logo": "./assets/logo_nuke.png" },
    "phase": "WINNERS SEMI-FINAL",
    "step": 2,
    "steps": [
      "Fixed: Nuke",
      "Golds: Ban (3)",
      "Athers: Ban (3)",
      "Golds: Ban (2)",
      "Athers: Ban (2)",
      "Golds: Pick",
      "Athers: Pick"
    ]
  },
  "veto": {
    "de_nuke": { "status": "locked", "actor": "SYSTEM" }
  }
});
```

```js
play();
```

```js
update({
  "veto": {
    "cs_italy": { "status": "banned", actor: "Atherians" },
    "cs_office": { "status": "banned", actor: "Atherians" },
    "cs_alpine": { "status": "banned", actor: "Atherians" },
  }
});
```

```js
// 1. Definice dat (Payload)
const testData = {
    match: {
        home: { 
            name: "Atherians", 
            logo: "./assets/logo_atherians.png" 
        },
        guest: { 
            name: "GOLD GOLD GOLD", 
            logo: "./assets/logo_golds.png" 
        },
        phase: "GRAND FINALE",
        // Skóre je v SummaryHeader natvrdo 0:0, ale zde ho máme pro budoucí rozšíření
        score: { home: 0, guest: 0 }
    },
    veto: {
        "de_nuke": { 
            status: "locked", 
            actor: "SYSTEM", 
            order: 1, 
            side: "CT",
            startingTeam: "Atherians" 
        },
        "de_ancient": { 
            status: "picked", 
            actor: "GOLD GOLD GOLD", 
            order: 2, 
            side: "T",
            startingTeam: "Atherians"
        },
        "de_anubis": { 
            status: "picked", 
            actor: "Atherians", 
            order: 3, 
            side: "CT",
            startingTeam: "GOLD GOLD GOLD"
        }
    }
};

// 2. Provedení updatu (naplnění DOMu, ale vše je zatím skryté)
console.log("Provádím update...");
update(testData);

// 3. Spuštění animace po krátké pauze, aby prohlížeč stihl vykreslit DOM
setTimeout(() => {
    console.log("Spouštím play()...");
    play();
}, 500);
```