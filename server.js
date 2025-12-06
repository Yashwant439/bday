// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Load names database
// const namesData = JSON.parse(fs.readFileSync('./data/names.json', 'utf8'));
// // Keep original names for rendering (datalist), but build a normalized set for validation
// const displayNames = namesData.names || [];
// const validNames = new Set(displayNames
//     .filter(n => typeof n === 'string')
//     .map(n => n.trim().toLowerCase())
// );

// // Load wishes
// let wishes = JSON.parse(fs.readFileSync('./data/wishes.json', 'utf8')).wishes;

// // Routes
// app.get('/', (req, res) => {
//     res.render('index', { 
//         wishes: wishes,
//         // send original/display names to the template for nicer formatting
//         validNames: displayNames
//     });
// });

// app.post('/add-wish', (req, res) => {
//     const { name, message } = req.body;
//     // sanitize input
//     const inputName = (name || '').toString().trim();
//     const normalizedInput = inputName.toLowerCase();

//     if (!normalizedInput || !validNames.has(normalizedInput)) {
//         return res.json({ success: false, error: 'Name not in guest list!' });
//     }

//     // Store a nicely formatted version of the name (Title Case)
//     const formattedName = inputName.split(/\s+/).map(part => {
//         return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
//     }).join(' ');

//     const newWish = {
//         id: Date.now(),
//         name: formattedName,
//         message: (message || '').toString(),
//         timestamp: new Date().toLocaleString()
//     };
    
//     wishes.unshift(newWish);
    
//     // Save to file
//     fs.writeFileSync('./data/wishes.json', JSON.stringify({ wishes: wishes }, null, 2));
    
//     res.json({ success: true, wish: newWish });
// });

// app.listen(PORT, () => {
//     console.log(`Birthday surprise running at http://localhost:${PORT}`);
// });












// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const PORT = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Load data
// const namesData = JSON.parse(fs.readFileSync('./data/names.json', 'utf8'));
// const validNames = new Set(namesData.names.map(n => n.toLowerCase()));

// let wishes = JSON.parse(fs.readFileSync('./data/wishes.json', 'utf8')).wishes;

// // Sample media data - REPLACE WITH YOUR CLOUDINARY URLs
// const photos = [
//     { id: 1, url: 'https://res.cloudinary.com/demo/image/upload/v1595452946/sample.jpg', caption: 'Best Moment!' },
//     { id: 2, url: 'https://res.cloudinary.com/demo/image/upload/v1595452946/sample.jpg', caption: 'Fun Times!' },
//     { id: 3, url: 'https://res.cloudinary.com/demo/image/upload/v1595452946/sample.jpg', caption: 'Adventure!' },
//     { id: 4, url: 'https://res.cloudinary.com/demo/image/upload/v1595452946/sample.jpg', caption: 'Celebration!' },
//     { id: 5, url: 'https://res.cloudinary.com/demo/image/upload/v1595452946/sample.jpg', caption: 'Friendship!' },
//     { id: 6, url: 'https://res.cloudinary.com/demo/image/upload/v1595452946/sample.jpg', caption: 'Memories!' }
// ];

// const videos = [
//     { id: 1, url: 'https://res.cloudinary.com/dvswzenja/video/upload/v1764168908/meow_meow_abnffn.mp4', title: 'Video 1' },
// ];

// app.get('/', (req, res) => {
//     res.render('index', { 
//         wishes: wishes,
//         validNames: namesData.names,
//         photos: photos,
//         videos: videos
//     });
// });

// app.post('/add-wish', (req, res) => {
//     const { name, message } = req.body;
    
//     if (!validNames.has(name.toLowerCase())) {
//         return res.json({ success: false, error: 'Name not in guest list!' });
//     }
    
//     const newWish = {
//         id: Date.now(),
//         name: name,
//         message: message,
//         timestamp: new Date().toLocaleString()
//     };
    
//     wishes.unshift(newWish);
//     fs.writeFileSync('./data/wishes.json', JSON.stringify({ wishes: wishes }, null, 2));
    
//     res.json({ success: true, wish: newWish });
// });

// app.listen(PORT, () => {
//     console.log(`🎉 Epic Birthday Surprise running at http://localhost:${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load names
const namesData = JSON.parse(fs.readFileSync('./data/names.json', 'utf8'));
const validNames = new Set(namesData.names.map(n => n.toLowerCase()));

// Load wishes
let wishes = JSON.parse(fs.readFileSync('./data/wishes.json', 'utf8')).wishes;

// Photos
const photos = [
    { id: 1, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764171043/n1_qwasqq.jpg', caption: 'MEMORY!' },
    { id: 2, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764171472/n2_uebltw.jpg', caption: 'DBMS!' },
    { id: 3, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764171483/n3_mwe8il.jpg', caption: 'METRO!' },
    { id: 4, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764171497/n4_xmeje0.jpg', caption: 'EOD!' },
    { id: 5, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764174193/n5_jadrqo.jpg', caption: 'MAKEUP!' },
    { id: 6, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764173091/n6_iefgsc.jpg', caption: 'LDKI BANNE KA SHOCK H!' },
    { id: 7, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764174209/n7_qyggaa.jpg', caption: 'PHONE!' },
    { id: 8, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1764173109/n8_pqzse2.jpg', caption: 'KHANA KO FEKHTE HUE!' },
    { id: 9, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1765040826/WhatsApp_Image_2025-12-06_at_22.36.13_7a577b9d_zvz6ty.jpg', caption: 'MAI TOH KOREAN PAGLU HU!' },
    { id: 10, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1765040818/WhatsApp_Image_2025-12-06_at_22.36.12_1d5eec7a_ar9dfu.jpg', caption: 'FILTER PAGLU!' },
    { id: 11, url: 'https://res.cloudinary.com/dvswzenja/image/upload/v1765040809/WhatsApp_Image_2025-12-06_at_22.36.11_40acba58_hroi3j.jpg', caption: 'FINALLY REMOVED BRACES! ' },
];

// Videos
const videos = [
    {
        id: 1,
        url: 'https://res.cloudinary.com/dvswzenja/video/upload/v1764168908/meow_meow_abnffn.mp4',
        title: 'MEOW MEOW'
    },
    {
        id: 2,
        url: 'https://res.cloudinary.com/dvswzenja/video/upload/v1764170903/nikhil_gqrric.mp4',
        title: 'INTENSE FF MATCH'
    },
    {
        id: 3,
        url: 'https://res.cloudinary.com/dvswzenja/video/upload/v1764172543/headphn_uzluuw.mp4',
        title: 'FANCY EAR MUFF'
    },
    {
        id: 4,
        url: 'https://res.cloudinary.com/dvswzenja/video/upload/v1764173079/pant_dtuoqr.mp4',
        title: 'I WANT TO FLY '
    },
];

app.get('/', (req, res) => {
    res.render('index', {
        wishes,
        validNames: namesData.names,
        photos,
        videos
    });
});

app.post('/add-wish', (req, res) => {
    const { name, message } = req.body;

    if (!validNames.has(name.toLowerCase())) {
        return res.json({ success: false, error: 'Name not in guest list!' });
    }

    const newWish = {
        id: Date.now(),
        name,
        message,
        timestamp: new Date().toLocaleString()
    };

    wishes.unshift(newWish);
    fs.writeFileSync('./data/wishes.json', JSON.stringify({ wishes }, null, 2));

    res.json({ success: true, wish: newWish });
});

app.listen(PORT, () =>
    console.log(`🎉 Birthday Surprise running at http://localhost:${PORT}`)
);
