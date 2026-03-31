//mongodb
const mongoose = require('mongoose');
// ayushshivhare351_db_user
// Tfi3C7GCs0Kdw8WM
const dns = require("dns"); dns.setServers(["1.1.1.1", "8.8.8.8"]);
const link = 'mongodb+srv://ayushshivhare351_db_user:Tfi3C7GCs0Kdw8WM@ayush.2fwshgd.mongodb.net/?appName=ayush'
mongoose.connect(link)
.then(() => console.log('MongoDB connected ✅'))
.catch(err => console.log(err));

// schema
const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    longUrl: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Url = mongoose.model('Url', urlSchema);

const express = require('express'); // import Express
const cors = require("cors");
const app = express(); // create server instance
const { nanoid } = require('nanoid'); // import nanoid
app.use(cors());         // ✅ allow requests from any origin
app.use(express.json()); // json parsing

// this runs when someone opens localhost:3000
app.get('/', (req, res) => {
    res.send('Hello Ayush 🚀 Server is running, dyude');
});

// url shorter
// POST API to shorten a URL
app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body; // get URL from request

    if (!longUrl) {
        return res.status(400).json({ error: 'Please provide a URL' });
    }

    const shortId = nanoid(6); // generate 6-character short ID

    const newUrl = new Url({
        shortId: shortId,
        longUrl: longUrl
    });

    await newUrl.save(); // save to MongoDB
    
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const shortUrl = `${baseUrl}/${shortId}`;
    res.json({ shortUrl });
});


// redis import
// Import your Redis client
const redisClient = require('./redisClient');

// Redirect route
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    // ........................ settinggg redis of .............................
    // try {
    //     // 1️⃣ Check Redis cache for URL
    //     let cachedUrl = await redisClient.get(`url:${shortId}`);

    //     if (cachedUrl) {
    //         console.log('Redirect from Redis');

    //         // 2️⃣ Increment click count in Redis
    //         await redisClient.incr(`clicks:${shortId}`);

    //         return res.redirect(cachedUrl);
    //     }

        // 3️⃣ Not in Redis → fetch from MongoDB
    const url = await Url.findOne({ shortId });
    if (!url) return res.status(404).send('Short URL not found');

        // // 4️⃣ Cache URL in Redis
        // await redisClient.set(`url:${shortId}`, url.longUrl, {
        //     EX: 60 * 60 * 24 // optional: 24-hour expiry
        // });

        // 5️⃣ Increment click count in Redis
        // await redisClient.incr(`clicks:${shortId}`);

    console.log('Redirect from MongoDB & cached in Redis');
    res.redirect(url.longUrl);

    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send('Server Error');
    // }
});

const syncClicksToMongo = async () => {
    try {
        // Get all keys for clicks
        const keys = await redisClient.keys('clicks:*');

        for (const key of keys) {
            const shortId = key.split(':')[1];
            const clicks = await redisClient.get(key);

            // Update MongoDB
            await Url.findOneAndUpdate(
                { shortId },
                { $inc: { clicks: parseInt(clicks) } }
            );

            // Reset Redis counter
            await redisClient.del(key);
        }

        console.log('Synced Redis clicks to MongoDB');
    } catch (err) {
        console.error('Error syncing clicks:', err);
    }
};

app.get('/stats/:shortId', async (req, res) => {
    const { shortId } = req.params;

    try {
        // 1️⃣ Get clicks from Redis (fast)
        let redisClicks = await redisClient.get(`clicks:${shortId}`);
        redisClicks = redisClicks ? parseInt(redisClicks) : 0;

        // 2️⃣ Get total clicks from MongoDB (permanent storage)
        const urlData = await Url.findOne({ shortId });
        if (!urlData) return res.status(404).json({ error: 'URL not found' });

        const totalClicks = urlData.clicks + redisClicks;

        res.json({
            shortId,
            longUrl: urlData.longUrl,
            totalClicks,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Sync every 1 minute (adjust as needed)
setInterval(syncClicksToMongo, 60 * 1000);


// start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
