// src/app/lib/seed_data.ts

export const users = [
  { full_name: 'Alice Johnson', email: 'alice@digishop.com', password: '123456abc', birthday: '1995-01-01' },
  { full_name: 'An Dao Thi Ha', email: 'daothihaan@gmail.com', password: 'haan2004', birthday: '2004-10-01' },
  { full_name: 'Bob Smith', email: 'bob@digishop.com', password: 'pass1234', birthday: '1990-05-15' },
  { full_name: 'Charlie Brown', email: 'charlie@digishop.com', password: 'abc123', birthday: '1992-09-20' },
  { full_name: 'Diana Prince', email: 'diana@digishop.com', password: 'wonderwoman123', birthday: '1988-03-12' },
];

export const categories = [
  { name: 'Gaming Accounts' },
  { name: 'Software Licenses' },
  { name: 'VPN Services' },
  { name: 'Cloud Storage' },
  { name: 'E-Learning Platforms' },
  { name: 'Design Tools' },
  { name: 'Productivity Apps' },
  { name: 'Music' },
  { name: 'Streaming' },
];

export const products = [
  { name: 'Netflix Premium', category_name: 'Streaming', image_url: '/products/netflix.png' },
  { name: 'Disney+ Account', category_name: 'Streaming', image_url: '/products/disneyplus.png' },
  { name: 'HBO Max', category_name: 'Streaming', image_url: '/products/hbomax.png' },
  { name: 'Amazon Prime Video', category_name: 'Streaming', image_url: '/products/primevideo.png' },
  { name: 'Hulu', category_name: 'Streaming', image_url: '/products/hulu.png' },
  { name: 'Apple TV+', category_name: 'Streaming', image_url: '/products/appletv.png' },
  { name: 'YouTube Premium', category_name: 'Streaming', image_url: '/products/youtube.png' },

  { name: 'Steam Wallet', category_name: 'Gaming Accounts', image_url: '/products/steam.png' },
  { name: 'Epic Games Wallet', category_name: 'Gaming Accounts', image_url: '/products/epicgames.png' },
  { name: 'Xbox Game Pass', category_name: 'Gaming Accounts', image_url: '/products/xbox.png' },
  { name: 'PlayStation Plus', category_name: 'Gaming Accounts', image_url: '/products/psplus.png' },
  { name: 'GOG Wallet', category_name: 'Gaming Accounts', image_url: '/products/gog.png' },
  { name: 'Origin Wallet', category_name: 'Gaming Accounts', image_url: '/products/origin.png' },

  { name: 'Spotify Premium', category_name: 'Music', image_url: '/products/spotify.png' },
  { name: 'Apple Music', category_name: 'Music', image_url: '/products/applemusic.png' },
  { name: 'Tidal HiFi', category_name: 'Music', image_url: '/products/tidal.png' },
  { name: 'Deezer Premium', category_name: 'Music', image_url: '/products/deezer.png' },

  { name: 'Microsoft Office 365', category_name: 'Software Licenses', image_url: '/products/office365.png' },
  { name: 'Windows 10 Pro', category_name: 'Software Licenses', image_url: '/products/windows10.png' },
  { name: 'Adobe Photoshop', category_name: 'Software Licenses', image_url: '/products/photoshop.png' },
  { name: 'Adobe Illustrator', category_name: 'Software Licenses', image_url: '/products/illustrator.png' },
  { name: 'Final Cut Pro', category_name: 'Software Licenses', image_url: '/products/finalcut.png' },
  { name: 'Premiere Pro', category_name: 'Software Licenses', image_url: '/products/premiere.png' },

  { name: 'NordVPN', category_name: 'VPN Services', image_url: '/products/nordvpn.png' },
  { name: 'ExpressVPN', category_name: 'VPN Services', image_url: '/products/expressvpn.png' },
  { name: 'Surfshark', category_name: 'VPN Services', image_url: '/products/surfshark.png' },
  { name: 'VPN Unlimited', category_name: 'VPN Services', image_url: '/products/vpnunlimited.png' },

  { name: 'Dropbox Premium', category_name: 'Cloud Storage', image_url: '/products/dropbox.png' },
  { name: 'Google One', category_name: 'Cloud Storage', image_url: '/products/googleone.png' },
  { name: 'OneDrive Premium', category_name: 'Cloud Storage', image_url: '/products/onedrive.png' },
  { name: 'iCloud Storage', category_name: 'Cloud Storage', image_url: '/products/icloud.png' },

  { name: 'Coursera Plus', category_name: 'E-Learning Platforms', image_url: '/products/coursera.png' },
  { name: 'Skillshare Premium', category_name: 'E-Learning Platforms', image_url: '/products/skillshare.png' },
  { name: 'Udemy Pro', category_name: 'E-Learning Platforms', image_url: '/products/udemy.png' },
  { name: 'LinkedIn Learning', category_name: 'E-Learning Platforms', image_url: '/products/linkedin.png' },

  { name: 'Canva Pro', category_name: 'Design Tools', image_url: '/products/canva.png' },
  { name: 'Figma Professional', category_name: 'Design Tools', image_url: '/products/figma.png' },
  { name: 'Sketch', category_name: 'Design Tools', image_url: '/products/sketch.png' },

  { name: 'Notion Premium', category_name: 'Productivity Apps', image_url: '/products/notion.png' },
  { name: 'Todoist Premium', category_name: 'Productivity Apps', image_url: '/products/todoist.png' },
  { name: 'Evernote Premium', category_name: 'Productivity Apps', image_url: '/products/evernote.png' },
];

// ------------------- PRODUCT TYPES IN VND -------------------

export const productTypes = [
  // Netflix
  { product_name: 'Netflix Premium', type: '1 Month', original_price: 312000, discount_price: 240000, status: 'in stock' },
  { product_name: 'Netflix Premium', type: '3 Months', original_price: 888000, discount_price: 720000, status: 'in stock' },
  { product_name: 'Netflix Premium', type: '6 Months', original_price: 1776000, discount_price: 1440000, status: 'in stock' },

  // Disney+
  { product_name: 'Disney+ Account', type: '1 Month', original_price: 264000, discount_price: 216000, status: 'in stock' },
  { product_name: 'Disney+ Account', type: '3 Months', original_price: 792000, discount_price: 648000, status: 'in stock' },

  // HBO Max
  { product_name: 'HBO Max', type: '1 Month', original_price: 360000, discount_price: 312000, status: 'in stock' },

  // Amazon Prime
  { product_name: 'Amazon Prime Video', type: '1 Month', original_price: 360000, discount_price: 312000, status: 'in stock' },

  // Hulu
  { product_name: 'Hulu', type: '1 Month', original_price: 312000, discount_price: 240000, status: 'in stock' },

  // Apple TV+
  { product_name: 'Apple TV+', type: '1 Month', original_price: 240000, discount_price: 192000, status: 'in stock' },

  // YouTube Premium
  { product_name: 'YouTube Premium', type: '1 Month', original_price: 312000, discount_price: 264000, status: 'in stock' },

  // Gaming Wallets
  { product_name: 'Steam Wallet', type: '$50', original_price: 1200000, discount_price: 1080000, status: 'in stock' },
  { product_name: 'Steam Wallet', type: '$100', original_price: 2400000, discount_price: 2160000, status: 'in stock' },
  { product_name: 'Epic Games Wallet', type: '$50', original_price: 1200000, discount_price: 1128000, status: 'in stock' },
  { product_name: 'Xbox Game Pass', type: '1 Month', original_price: 360000, discount_price: 312000, status: 'in stock' },
  { product_name: 'PlayStation Plus', type: '1 Month', original_price: 360000, discount_price: 312000, status: 'in stock' },
  { product_name: 'GOG Wallet', type: '$50', original_price: 1200000, discount_price: 1080000, status: 'in stock' },
  { product_name: 'Origin Wallet', type: '$50', original_price: 1200000, discount_price: 1080000, status: 'in stock' },

  // Music
  { product_name: 'Spotify Premium', type: '1 Month', original_price: 240000, discount_price: 192000, status: 'in stock' },
  { product_name: 'Apple Music', type: '1 Month', original_price: 240000, discount_price: 192000, status: 'in stock' },
  { product_name: 'Tidal HiFi', type: '1 Month', original_price: 480000, discount_price: 360000, status: 'in stock' },
  { product_name: 'Deezer Premium', type: '1 Month', original_price: 264000, discount_price: 216000, status: 'in stock' },

  // Software Licenses
  { product_name: 'Microsoft Office 365', type: '1 Year', original_price: 2400000, discount_price: 1920000, status: 'in stock' },
  { product_name: 'Windows 10 Pro', type: '1 License', original_price: 3360000, discount_price: 2880000, status: 'in stock' },
  { product_name: 'Adobe Photoshop', type: '1 Year', original_price: 5760000, discount_price: 4800000, status: 'in stock' },
  { product_name: 'Adobe Illustrator', type: '1 Year', original_price: 5760000, discount_price: 4800000, status: 'in stock' },
  { product_name: 'Final Cut Pro', type: '1 License', original_price: 7199760, discount_price: 5999760, status: 'in stock' },
  { product_name: 'Premiere Pro', type: '1 Year', original_price: 5760000, discount_price: 4800000, status: 'in stock' },

  // VPN
  { product_name: 'NordVPN', type: '1 Year', original_price: 2879760, discount_price: 2159760, status: 'in stock' },
  { product_name: 'ExpressVPN', type: '1 Year', original_price: 2879760, discount_price: 2159760, status: 'in stock' },
  { product_name: 'Surfshark', type: '1 Year', original_price: 2159760, discount_price: 1727760, status: 'in stock' },
  { product_name: 'VPN Unlimited', type: '1 Month', original_price: 215760, discount_price: 167760, status: 'in stock' },

  // Cloud Storage
  { product_name: 'Dropbox Premium', type: '1 Month', original_price: 240000, discount_price: 192000, status: 'in stock' },
  { product_name: 'Google One', type: '1 Year', original_price: 2400000, discount_price: 1920000, status: 'in stock' },
  { product_name: 'OneDrive Premium', type: '1 Year', original_price: 2400000, discount_price: 1920000, status: 'in stock' },
  { product_name: 'iCloud Storage', type: '1 Year', original_price: 2400000, discount_price: 1920000, status: 'in stock' },

  // E-Learning
  { product_name: 'Coursera Plus', type: '1 Year', original_price: 9576000, discount_price: 7176000, status: 'in stock' },
  { product_name: 'Skillshare Premium', type: '1 Month', original_price: 360000, discount_price: 288000, status: 'in stock' },
  { product_name: 'Udemy Pro', type: '1 Year', original_price: 2400000, discount_price: 1920000, status: 'in stock' },
  { product_name: 'LinkedIn Learning', type: '1 Year', original_price: 2880000, discount_price: 2400000, status: 'in stock' },

  // Design Tools
  { product_name: 'Canva Pro', type: '1 Year', original_price: 1200000, discount_price: 960000, status: 'in stock' },
  { product_name: 'Figma Professional', type: '1 Year', original_price: 1440000, discount_price: 1200000, status: 'in stock' },
  { product_name: 'Sketch', type: '1 License', original_price: 720000, discount_price: 600000, status: 'in stock' },

  // Productivity Apps
  { product_name: 'Notion Premium', type: '1 Year', original_price: 480000, discount_price: 360000, status: 'in stock' },
  { product_name: 'Todoist Premium', type: '1 Year', original_price: 360000, discount_price: 288000, status: 'in stock' },
  { product_name: 'Evernote Premium', type: '1 Year', original_price: 480000, discount_price: 360000, status: 'in stock' },
];
