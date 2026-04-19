/**
 * Komponenta pro kartu mapy
 */
class MapCard {
    constructor(id, data) {
        this.id = id;
        this.data = data;
        this.element = null;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = "map-card relative overflow-hidden border border-primary-foreground/10 bg-black group opacity-0 h-full";
        wrapper.id = `map-${this.id}`;

        wrapper.innerHTML = `
        <img 
            src="${this.data.image}" 
            class="absolute inset-0 w-full h-full object-cover object-center grayscale transition-all duration-700 group-[.is-picked]:grayscale-0 group-[.is-locked]:grayscale-0 scale-110 group-[.is-picked]:scale-100 group-[.is-locked]:scale-100" 
        />

        <div class="absolute inset-0 bg-blue-600/40 opacity-0 transition-[opacity] duration-500 flex flex-col items-center justify-center border-4 border-blue-400 group-[.is-locked]:opacity-100 z-20">
            <div class="mb-2 bg-blue-500 p-2 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <span class="text-xs tracking-[0.3em] font-bold opacity-90 uppercase">Required Map</span>
            <span class="text-4xl font-black italic tracking-tighter uppercase">LOCKED</span>
        </div>

        <div class="absolute inset-0 bg-red-900/80 opacity-0 transition-[opacity] duration-300 flex flex-col items-center justify-center border-4 border-red-500 group-[.is-banned]:opacity-100 z-20">
            <span class="text-[10px] tracking-[0.3em] font-bold opacity-70 mb-1 actor-name uppercase"></span>
            <span class="text-4xl font-black italic tracking-tighter uppercase">BANNED</span>
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4 z-10">
            <div class="flex flex-col">
                <span class="text-[10px] uppercase tracking-widest text-green-400 font-bold mb-1 hidden group-[.is-picked]:block actor-name"></span>
                <span class="text-[10px] uppercase tracking-widest opacity-50 font-bold">Map</span>
                <span class="text-2xl font-black uppercase tracking-tighter">${this.data.map}</span>
            </div>
        </div>

        <div class="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-500 group-[.is-picked]:w-full group-[.is-picked]:bg-green-500 group-[.is-banned]:w-full group-[.is-banned]:bg-red-500 group-[.is-locked]:w-full group-[.is-locked]:bg-blue-400"></div>
    `;

        this.element = wrapper;
        return wrapper;
    }
}

/**
 * Hlavní aplikace pro Map Veto
 */
class MapPoolApp {
    constructor(containerId, pool) {
        this.containerId = containerId;
        this.pool = pool;
        this.cards = {};
    }

    /**
     * Inicializace - vykreslí všechny mapy v poolu
     */
    init() {
        this.container = document.getElementById(this.containerId);
        this.container.innerHTML = '';

        Object.entries(this.pool).forEach(([id, data]) => {
            const card = new MapCard(id, data);
            this.cards[id] = card;
            this.container.appendChild(card.render());
        });
    }

    /**
     * Animovaný nástup map
     */
    animateIn() {
        gsap.to(".map-card", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out",
            startAt: { y: 50 }
        });
    }

    /**
     * @param {Object} state - např. { de_nuke: { status: "picked", actor: "Team Liquid" } }
     */
    updateState(state) {
        Object.entries(state).forEach(([mapId, info]) => {
            const card = this.cards[mapId];
            if (!card) return;

            const el = card.element;
            const actorLabels = el.querySelectorAll('.actor-name');

            // Resetujeme všechny stavy
            el.classList.remove('is-picked', 'is-banned', 'is-locked');

            // Přidáme správnou třídu podle statusu
            if (info.status === 'picked') el.classList.add('is-picked');
            else if (info.status === 'banned') el.classList.add('is-banned');
            else if (info.status === 'locked') el.classList.add('is-locked');

            // Nastavíme jméno aktéra (pro locked to může být prázdné nebo "Tournament")
            actorLabels.forEach(l => l.innerText = info.actor || '');
        });
    }
}

class MatchHeader {
    constructor(containerId) {
        this.containerId = containerId;
        this.isInitialized = false;
    }

    render(data) {
        this.container = document.getElementById(this.containerId);
        // Pokud steps nepřijdou v parametru, použijeme prázdné pole nebo výchozí
        const steps = data.steps || ["Fixed", "Ban", "Ban", "Ban", "Ban", "Pick", "Pick"];

        this.container.className = "flex flex-col gap-6 mb-12 font-sans uppercase";
        this.container.innerHTML = `
            <div class="flex justify-between items-end border-b border-primary-foreground/20 pb-4">
                <div class="flex flex-col">
                    <span class="text-xs tracking-[0.4em] opacity-50 font-black">Tournament Phase</span>
                    <span class="text-3xl font-black tracking-tighter">${data.phase}</span>
                </div>
                <div class="text-right">
                    <span class="text-xs tracking-[0.4em] opacity-50 font-black">Veto System</span>
                    <span class="block text-sm font-bold">${steps.length} Steps Process</span>
                </div>
            </div>

            <div class="flex items-center justify-between bg-primary-foreground text-primary p-6 shadow-2xl relative overflow-hidden">
                <div class="flex items-center gap-6 z-10">
                    <img src="${data.home.logo}" class="w-20 h-20 object-contain" />
                    <div class="flex flex-col">
                        <span class="text-xs font-bold opacity-70 tracking-widest">Home Team</span>
                        <span class="text-5xl font-black tracking-tighter">${data.home.name}</span>
                    </div>
                </div>

                <div class="text-6xl font-black italic opacity-20 select-none">VS</div>

                <div class="flex items-center gap-6 text-right z-10">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold opacity-70 tracking-widest">Guest Team</span>
                        <span class="text-5xl font-black tracking-tighter">${data.guest.name}</span>
                    </div>
                    <img src="${data.guest.logo}" class="w-20 h-20 object-contain" />
                </div>
                
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
            </div>

            <div class="flex gap-2 w-full">
                ${steps.map((text, i) => `
                    <div class="flex flex-col gap-2 flex-1">
                        <div class="h-1 w-full transition-colors duration-500 ${i < data.step ? 'bg-primary-foreground' : 'bg-primary-foreground/20'}"></div>
                        <span class="text-[10px] font-bold tracking-tighter truncate ${i === data.step - 1 ? 'opacity-100' : 'opacity-30'}">
                            ${text}
                        </span>
                    </div>
                `).join('')}
            </div>
        `;

        if (!this.isInitialized) {
            this.container.style.opacity = "0";
            this.container.style.transform = "translateY(-20px)";
        }
    }

    animateIn() {
        this.isInitialized = true;
        return gsap.to(this.container, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    }
}