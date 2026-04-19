class SummaryHeader {
    constructor(containerId) {
        this.containerId = containerId; // Uložíme jen ID
        this.isInitialized = false;
    }

    render(data) {
        // Element hledáme až teď
        const container = document.getElementById(this.containerId);
        if (!container) return; 

        container.className = "w-full flex justify-center pt-8 mb-4 font-sans uppercase";
        container.innerHTML = `
            <div class="flex items-center gap-12 bg-black/40 backdrop-blur-md border border-primary-foreground/10 px-12 py-4 shadow-2xl">
                <div class="flex items-center gap-4">
                    <span class="text-3xl font-black tracking-tighter">${data.home.name}</span>
                    <img src="${data.home.logo}" class="w-12 h-12 object-contain" />
                </div>

                <div class="flex flex-col items-center border-x border-primary-foreground/20 px-12 text-primary-foreground">
                    <span class="text-[10px] tracking-[0.4em] opacity-50 font-black mb-1">${data.phase}</span>
                    <div class="flex items-center gap-4">
                        <span class="text-4xl font-black italic">0</span>
                        <span class="text-xl font-light opacity-30">:</span>
                        <span class="text-4xl font-black italic">0</span>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <img src="${data.guest.logo}" class="w-12 h-12 object-contain" />
                    <span class="text-3xl font-black tracking-tighter">${data.guest.name}</span>
                </div>
            </div>
        `;

        if (!this.isInitialized) {
            container.style.opacity = "0";
            container.style.transform = "translateY(-50px)";
        }
    }

    animateIn() {
        this.isInitialized = true;
        const container = document.getElementById(this.containerId);
        return gsap.to(container, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out"
        });
    }
}

class SummaryCard {
    constructor(id, mapData, vetoInfo) {
        this.id = id;
        this.mapData = mapData;
        this.vetoInfo = vetoInfo; // { status, actor, side, order, startingTeam }
    }

    render() {
        const wrapper = document.createElement('div');
        // Přidán bg-neutral-900 pro případ, že se obrázek mapy nenačte hned
        wrapper.className = "summary-card relative w-80 h-[600px] overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl opacity-0";
        
        const sideColor = this.vetoInfo.side === 'CT' ? 'text-blue-400' : 'text-orange-400';
        const sideName = this.vetoInfo.side === 'CT' ? 'Counter-Terrorists' : 'Terrorists';
        const startingTeam = this.vetoInfo.startingTeam || "Unknown Team";

        wrapper.innerHTML = `
            <img src="${this.mapData.image}" 
                 class="absolute inset-0 w-full h-full object-cover object-center opacity-50 z-0" 
                 onerror="this.style.opacity='0.1'; console.error('Missing map image: ${this.mapData.image}')" />
            
            <div class="absolute top-0 left-0 p-8 z-10">
                <span class="text-7xl font-black italic opacity-10 tracking-tighter text-white">#${this.vetoInfo.order}</span>
            </div>

            <div class="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/70 to-transparent z-10">
                
                <div class="flex flex-col gap-1 mb-8">
                    <span class="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase text-white">Picked by</span>
                    <span class="text-xl font-black text-white uppercase tracking-tight">${this.vetoInfo.actor}</span>
                </div>

                <div class="flex flex-col gap-0 mb-10">
                    <span class="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase text-white">Map</span>
                    <span class="text-5xl font-black tracking-tighter uppercase text-white">${this.mapData.map}</span>
                </div>

                <div class="flex flex-col gap-2 py-6 border-t border-white/20 text-white">
                    <span class="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">Starting Side</span>
                    
                    <div class="flex flex-col leading-tight">
                        <span class="text-xl font-black uppercase tracking-tighter">${startingTeam}</span>
                        <span class="text-sm font-bold ${sideColor} uppercase tracking-widest">${sideName}</span>
                    </div>
                </div>
            </div>

            <div class="absolute top-0 right-0 w-2 h-full z-20 ${this.vetoInfo.side === 'CT' ? 'bg-blue-500' : 'bg-orange-500'}"></div>
        `;

        return wrapper;
    }
}

class MatchSummaryApp {
    constructor(containerId, pool) {
        this.containerId = containerId;
        this.pool = pool;
    }

    render(vetoData) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = '';
        container.className = "flex gap-8 justify-center items-center h-full";

        const activeMaps = Object.entries(vetoData)
            .filter(([id, info]) => info.status === 'picked' || info.status === 'locked')
            .sort((a, b) => (a[1].order || 0) - (b[1].order || 0));

        activeMaps.forEach(([id, info]) => {
            const mapData = this.pool[id];
            const card = new SummaryCard(id, mapData, info);
            container.appendChild(card.render());
        });
    }

    animateIn() {
        return gsap.to(".summary-card", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power4.out",
            startAt: { y: 100 }
        });
    }
}