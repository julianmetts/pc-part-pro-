const SAMPLE_PARTS = [
  // CPUs
  { id: 1, name: "Intel Core i7-13700K", category: "CPU", socket: "LGA1700", cores: 16, threads: 24, baseClock: 3.4, boostClock: 5.4, price: 399, tdp: 125 },
  { id: 2, name: "AMD Ryzen 9 7900X", category: "CPU", socket: "AM5", cores: 12, threads: 24, baseClock: 4.7, boostClock: 5.6, price: 429, tdp: 170 },
  { id: 3, name: "Intel Core i5-13600K", category: "CPU", socket: "LGA1700", cores: 14, threads: 20, baseClock: 3.5, boostClock: 5.1, price: 319, tdp: 125 },
  { id: 4, name: "AMD Ryzen 7 7700X", category: "CPU", socket: "AM5", cores: 8, threads: 16, baseClock: 4.5, boostClock: 5.4, price: 349, tdp: 105 },
  { id: 5, name: "Intel Core i9-13900K", category: "CPU", socket: "LGA1700", cores: 24, threads: 32, baseClock: 3.0, boostClock: 5.8, price: 599, tdp: 125 },
  { id: 6, name: "AMD Ryzen 5 7600X", category: "CPU", socket: "AM5", cores: 6, threads: 12, baseClock: 4.7, boostClock: 5.3, price: 299, tdp: 105 },

  // Motherboards
  { id: 7, name: "ASUS PRIME Z790-P", category: "Motherboard", socket: "LGA1700", ramType: "DDR5", chipset: "Z790", formFactor: "ATX", price: 220 },
  { id: 8, name: "MSI MAG B650 TOMAHAWK", category: "Motherboard", socket: "AM5", ramType: "DDR5", chipset: "B650", formFactor: "ATX", price: 199 },
  { id: 9, name: "Gigabyte B550 AORUS ELITE", category: "Motherboard", socket: "AM4", ramType: "DDR4", chipset: "B550", formFactor: "ATX", price: 129 },
  { id: 10, name: "ASUS ROG STRIX Z690-E", category: "Motherboard", socket: "LGA1700", ramType: "DDR5", chipset: "Z690", formFactor: "ATX", price: 329 },
  { id: 11, name: "MSI B450 TOMAHAWK MAX", category: "Motherboard", socket: "AM4", ramType: "DDR4", chipset: "B450", formFactor: "ATX", price: 109 },
  { id: 12, name: "ASRock X570 Phantom Gaming 4", category: "Motherboard", socket: "AM4", ramType: "DDR4", chipset: "X570", formFactor: "ATX", price: 149 },

  // RAM
  { id: 13, name: "Corsair Vengeance 32GB (2x16) DDR5-6000", category: "RAM", ramType: "DDR5", capacityGB: 32, speed: 6000, latency: "CL30", price: 179 },
  { id: 14, name: "G.SKILL Ripjaws 16GB DDR4-3200", category: "RAM", ramType: "DDR4", capacityGB: 16, speed: 3200, latency: "CL16", price: 49 },
  { id: 15, name: "Kingston HyperX Fury 64GB (2x32) DDR5-5200", category: "RAM", ramType: "DDR5", capacityGB: 64, speed: 5200, latency: "CL38", price: 299 },
  { id: 16, name: "Crucial Ballistix 32GB (2x16) DDR4-3600", category: "RAM", ramType: "DDR4", capacityGB: 32, speed: 3600, latency: "CL16", price: 89 },
  { id: 17, name: "Corsair Dominator Platinum 128GB (4x32) DDR5-5600", category: "RAM", ramType: "DDR5", capacityGB: 128, speed: 5600, latency: "CL36", price: 599 },
  { id: 18, name: "TeamGroup T-Force Vulcan 8GB DDR4-3000", category: "RAM", ramType: "DDR4", capacityGB: 8, speed: 3000, latency: "CL16", price: 29 },

  // GPUs
  { id: 19, name: "NVIDIA RTX 4070", category: "GPU", vramGB: 12, baseClock: 1920, boostClock: 2475, price: 599, tdp: 200 },
  { id: 20, name: "AMD Radeon RX 7800 XT", category: "GPU", vramGB: 16, baseClock: 1295, boostClock: 2430, price: 499, tdp: 263 },
  { id: 21, name: "NVIDIA RTX 4080", category: "GPU", vramGB: 16, baseClock: 2205, boostClock: 2505, price: 1199, tdp: 320 },
  { id: 22, name: "AMD Radeon RX 7900 XTX", category: "GPU", vramGB: 24, baseClock: 1855, boostClock: 2499, price: 999, tdp: 355 },
  { id: 23, name: "NVIDIA RTX 3060", category: "GPU", vramGB: 12, baseClock: 1320, boostClock: 1777, price: 299, tdp: 170 },
  { id: 24, name: "AMD Radeon RX 6700 XT", category: "GPU", vramGB: 12, baseClock: 2321, boostClock: 2581, price: 349, tdp: 230 },

  // Storage
  { id: 25, name: "Samsung 970 EVO Plus 1TB", category: "Storage", interface: "NVMe", capacityGB: 1000, readSpeed: 3500, writeSpeed: 3300, price: 99 },
  { id: 26, name: "Seagate BarraCuda 2TB", category: "Storage", interface: "SATA", capacityGB: 2000, rpm: 7200, price: 54 },
  { id: 27, name: "WD Black SN850X 2TB", category: "Storage", interface: "NVMe", capacityGB: 2000, readSpeed: 7300, writeSpeed: 6600, price: 149 },
  { id: 28, name: "Crucial MX500 500GB", category: "Storage", interface: "SATA", capacityGB: 500, price: 49 },
  { id: 29, name: "Samsung 980 PRO 4TB", category: "Storage", interface: "NVMe", capacityGB: 4000, readSpeed: 7000, writeSpeed: 5100, price: 399 },
  { id: 30, name: "Toshiba P300 3TB", category: "Storage", interface: "SATA", capacityGB: 3000, rpm: 7200, price: 79 },

  // PSUs
  { id: 31, name: "Corsair RM850x 850W", category: "PSU", wattage: 850, efficiency: "80+ Gold", modular: true, price: 139 },
  { id: 32, name: "EVGA SuperNOVA 750W", category: "PSU", wattage: 750, efficiency: "80+ Gold", modular: true, price: 119 },
  { id: 33, name: "Seasonic Focus GX-1000 1000W", category: "PSU", wattage: 1000, efficiency: "80+ Gold", modular: true, price: 169 },
  { id: 34, name: "Corsair CX550M 550W", category: "PSU", wattage: 550, efficiency: "80+ Bronze", modular: true, price: 79 },
  { id: 35, name: "Thermaltake Toughpower GF1 650W", category: "PSU", wattage: 650, efficiency: "80+ Gold", modular: true, price: 99 },
  { id: 36, name: "Cooler Master MWE 500W", category: "PSU", wattage: 500, efficiency: "80+ Bronze", modular: false, price: 49 },

  // Cases
  { id: 37, name: "NZXT H510", category: "Case", formFactor: "Mid-Tower", maxGpuLength: 381, maxCpuCoolerHeight: 165, price: 79 },
  { id: 38, name: "Fractal Design Meshify C", category: "Case", formFactor: "Mid-Tower", maxGpuLength: 315, maxCpuCoolerHeight: 165, price: 89 },
  { id: 39, name: "Corsair 4000D Airflow", category: "Case", formFactor: "Mid-Tower", maxGpuLength: 360, maxCpuCoolerHeight: 170, price: 99 },
  { id: 40, name: "Lian Li PC-O11 Dynamic", category: "Case", formFactor: "Mid-Tower", maxGpuLength: 420, maxCpuCoolerHeight: 190, price: 149 },
  { id: 41, name: "Cooler Master MasterBox NR600", category: "Case", formFactor: "Mid-Tower", maxGpuLength: 410, maxCpuCoolerHeight: 190, price: 119 },
  { id: 42, name: "Phanteks Eclipse P400A", category: "Case", formFactor: "Mid-Tower", maxGpuLength: 380, maxCpuCoolerHeight: 192, price: 69 },

  // Coolers
  { id: 43, name: "Noctua NH-D15", category: "Cooler", type: "Air", supportedSockets: ["LGA1700", "AM5", "AM4", "LGA1200"], maxTdp: 220, price: 99 },
  { id: 44, name: "Corsair H100i Elite Capellix", category: "Cooler", type: "Liquid", supportedSockets: ["LGA1700", "AM5", "AM4"], radiatorSize: 240, price: 149 },
  { id: 45, name: "be quiet! Dark Rock Pro 4", category: "Cooler", type: "Air", supportedSockets: ["LGA1700", "AM5", "AM4", "LGA1200"], maxTdp: 250, price: 89 },
  { id: 46, name: "NZXT Kraken X73", category: "Cooler", type: "Liquid", supportedSockets: ["LGA1700", "AM5", "AM4"], radiatorSize: 360, price: 179 },
  { id: 47, name: "Cooler Master Hyper 212 EVO", category: "Cooler", type: "Air", supportedSockets: ["LGA1700", "AM5", "AM4", "LGA1200"], maxTdp: 150, price: 39 },
  { id: 48, name: "Arctic Liquid Freezer II 280", category: "Cooler", type: "Liquid", supportedSockets: ["LGA1700", "AM5", "AM4"], radiatorSize: 280, price: 129 },

  // Additional Categories: Monitors
  { id: 49, name: "ASUS TUF Gaming VG279QM 27\"", category: "Monitor", resolution: "1440p", refreshRate: 144, panelType: "IPS", price: 299 },
  { id: 50, name: "Samsung Odyssey G7 32\"", category: "Monitor", resolution: "1440p", refreshRate: 144, panelType: "VA", price: 399 },
  { id: 51, name: "Dell S3221QS 32\"", category: "Monitor", resolution: "4K", refreshRate: 60, panelType: "VA", price: 349 },
  { id: 52, name: "LG 27UK650-W 27\"", category: "Monitor", resolution: "4K", refreshRate: 60, panelType: "IPS", price: 279 },

  // Keyboards
  { id: 53, name: "Corsair K57 RGB Wireless", category: "Keyboard", switchType: "Membrane", connectivity: "Wireless", price: 79 },
  { id: 54, name: "Razer BlackWidow V3 Pro", category: "Keyboard", switchType: "Mechanical", connectivity: "Wireless", price: 229 },
  { id: 55, name: "Logitech MX Keys", category: "Keyboard", switchType: "Membrane", connectivity: "Wireless", price: 99 },
  { id: 56, name: "SteelSeries Apex 7", category: "Keyboard", switchType: "Mechanical", connectivity: "Wired", price: 149 },

  // Mice
  { id: 57, name: "Logitech G305 Lightspeed", category: "Mouse", sensor: "Optical", dpi: 12000, connectivity: "Wireless", price: 49 },
  { id: 58, name: "Razer DeathAdder V2 Pro", category: "Mouse", sensor: "Optical", dpi: 20000, connectivity: "Wireless", price: 129 },
  { id: 59, name: "Corsair Dark Core RGB Pro", category: "Mouse", sensor: "Optical", dpi: 18000, connectivity: "Wireless", price: 99 },
  { id: 60, name: "SteelSeries Rival 600", category: "Mouse", sensor: "Optical", dpi: 12000, connectivity: "Wired", price: 79 }
];