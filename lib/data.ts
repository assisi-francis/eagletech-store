import { Product } from '@/types';

export const mockProducts: Product[] = [
  {
    "id": "1",
    "title": "MacBook Pro 16\" M3 Max",
    "slug": "macbook-pro-16-m3-max",
    "description": "The ultimate pro laptop with the incredibly fast M3 Max chip. 64GB RAM, 2TB SSD.",
    "price": 4500000,
    "stock_quantity": 10,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Apple",
    "category": "MacBook"
  },
  {
    "id": "2",
    "title": "Starlink Standard Kit",
    "slug": "starlink-standard-kit",
    "description": "High-speed, low-latency broadband internet. Includes WiFi router, power supply, and cables.",
    "price": 440000,
    "stock_quantity": 50,
    "images": [
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/SpaceX_Starlink_User_Terminal_v2_%2851740775162%29.jpg",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Starlink",
    "category": "Networking"
  },
  {
    "id": "3",
    "title": "Samsung Galaxy S24 Ultra",
    "slug": "samsung-galaxy-s24-ultra",
    "description": "AI-powered flagship with a 200MP camera, Titanium frame, and S-Pen. 512GB, 12GB RAM.",
    "price": 1850000,
    "stock_quantity": 15,
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Samsung",
    "category": "Smartphone"
  },
  {
    "id": "4",
    "title": "Dell XPS 15",
    "slug": "dell-xps-15",
    "description": "Premium thin-and-light laptop with 13th Gen Intel Core i7, 32GB RAM, 1TB SSD, RTX 4050.",
    "price": 2100000,
    "stock_quantity": 8,
    "images": [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Dell",
    "category": "Laptops"
  },
  {
    "id": "5",
    "title": "Sony PlayStation 5",
    "slug": "sony-playstation-5",
    "description": "Next-gen gaming console with lightning-fast loading, 3D audio, and stunning 4K visuals.",
    "price": 850000,
    "stock_quantity": 20,
    "images": [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Sony",
    "category": "Hardware"
  },
  {
    "id": "6",
    "title": "Apple iPhone 15 Pro",
    "slug": "apple-iphone-15-pro",
    "description": "Titanium design, A17 Pro chip, and a more advanced 48MP main camera. 256GB.",
    "price": 1500000,
    "stock_quantity": 30,
    "images": [
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Apple",
    "category": "MacBook"
  },
  {
    "id": "a1",
    "title": "Logitech MX Master 3S",
    "slug": "logitech-mx-master-3s",
    "description": "Advanced wireless mouse with ultra-fast scrolling, ergonomic design, and 8K DPI tracking.",
    "price": 125000,
    "stock_quantity": 45,
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Logitech",
    "category": "Accessories"
  },
  {
    "id": "a2",
    "title": "Samsung 990 PRO 2TB SSD",
    "slug": "samsung-990-pro-2tb-ssd",
    "description": "PCIe 4.0 NVMe M.2 internal solid state drive. Blistering fast read/write speeds for gaming and creators.",
    "price": 180000,
    "stock_quantity": 25,
    "images": [
      "/images/samsung-ssd.jpg",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Samsung",
    "category": "Accessories"
  },
  {
    "id": "a3",
    "title": "Seagate 4TB External HDD",
    "slug": "seagate-4tb-external-hdd",
    "description": "Portable external hard drive, USB 3.0. Massive storage capacity for backups and media.",
    "price": 95000,
    "stock_quantity": 60,
    "images": [
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Seagate",
    "category": "Accessories"
  },
  {
    "id": "a4",
    "title": "Keychron K2 Mechanical Keyboard",
    "slug": "keychron-k2",
    "description": "Wireless mechanical keyboard with tactile brown switches, Mac/Windows layout, and RGB backlight.",
    "price": 85000,
    "stock_quantity": 15,
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Keychron",
    "category": "Accessories"
  },
  {
    "id": "a5",
    "title": "Sony WH-1000XM5 Headphones",
    "slug": "sony-wh-1000xm5",
    "description": "Industry-leading noise cancellation, 30-hour battery life, and crystal-clear hands-free calling.",
    "price": 350000,
    "stock_quantity": 20,
    "images": [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Sony",
    "category": "Hardware"
  },
  {
    "id": "a6",
    "title": "Anker PowerExpand 8-in-1 Hub",
    "slug": "anker-usb-c-hub",
    "description": "USB-C hub with 4K HDMI, 100W Power Delivery, SD card reader, and Gigabit Ethernet.",
    "price": 65000,
    "stock_quantity": 80,
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Anker",
    "category": "Accessories"
  },
  {
    "id": "a7",
    "title": "Dell UltraSharp 27\" 4K Monitor",
    "slug": "dell-ultrasharp-27",
    "description": "Stunning 4K UHD resolution, USB-C connectivity, and precise color calibration for professionals.",
    "price": 550000,
    "stock_quantity": 10,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Dell",
    "category": "Laptops"
  },
  {
    "id": "a8",
    "title": "Logitech Brio 4K Webcam",
    "slug": "logitech-brio-4k",
    "description": "Ultra HD webcam for video conferencing, streaming, and recording. Features RightLight 3 and HDR.",
    "price": 185000,
    "stock_quantity": 35,
    "images": [
      "/images/logitech-webcam.jpg",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": false,
    "brand": "Logitech",
    "category": "Accessories"
  },
  {
    "id": "s1",
    "title": "Standard Starlink Installation",
    "slug": "standard-starlink-installation",
    "description": "Basic ground or balcony setup. Includes router configuration, basic cabling (up to 15m), and network optimization. Ideal for standard homes.",
    "price": 50000,
    "stock_quantity": 999,
    "images": [
      "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": true,
    "brand": "EagleTech Services",
    "category": "Hardware"
  },
  {
    "id": "s2",
    "title": "Premium Roof Mount Installation",
    "slug": "premium-roof-mount-installation",
    "description": "Professional roof mounting for unobstructed sky view. Includes heavy-duty brackets, weather-sealed cabling (up to 30m), and advanced mesh setup.",
    "price": 120000,
    "stock_quantity": 999,
    "images": [
      "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": true,
    "brand": "EagleTech Services",
    "category": "Hardware"
  },
  {
    "id": "s3",
    "title": "Enterprise Multi-Node Setup",
    "slug": "enterprise-multi-node-setup",
    "description": "Commercial grade setup for large offices or estates. Includes Starlink mounting, load balancing, multi-node Wi-Fi 6 access points, and dedicated support.",
    "price": 350000,
    "stock_quantity": 999,
    "images": [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800&q=80"
    ],
    "is_service": true,
    "brand": "EagleTech Services",
    "category": "Hardware"
  }
];
