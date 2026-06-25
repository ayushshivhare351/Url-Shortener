console.log("SERVER.JS LOADED");
//mongodb
require('dotenv').config();

const mongoose = require('mongoose');
// Load environment variables at the very top


const dns = require("dns"); dns.setServers(["1.1.1.1", "8.8.8.8"]);
const link = process.env.MONGODB_URI;

if (!link) {
    console.error("❌ Error: MONGODB_URI is missing in your .env file!");
    process.exit(1);
}

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
    res.send('Hello Ayush 🚀 Server is running');
});

// GET all URLs
app.get("/urls", async (req, res) => {
  try {
    const urls = await Url.find({});

    const formatted = urls.map(u => ({
      shortId: u.shortId,
      longUrl: u.longUrl,
      totalClicks: u.clicks // 👈 IMPORTANT FIX
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});


// url shorter
// POST API to shorten a URL
app.post('/shorten', async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const { longUrl, customAlias } = req.body;

        if (!longUrl) {
            return res.status(400).json({ error: 'Please provide a URL' });
        }

        let shortId;

        if (customAlias) {
            // Trim any accidental whitespace
            const cleanAlias = customAlias.trim();
            const isValid = /^[a-zA-Z0-9_-]+$/.test(cleanAlias);

            if (!isValid) {
                return res.status(400).json({ error: "Invalid alias format" });
            }

            const existing = await Url.findOne({ shortId: cleanAlias });

            if (existing) {
                return res.status(409).json({ error: "Alias already taken" });
            }

            shortId = cleanAlias;
        } else {
            let exists = true;

            while (exists) {
                shortId = nanoid(6);
                const found = await Url.findOne({ shortId });
                exists = !!found;
            }
        }

        // Save to MongoDB
        await Url.create({ shortId, longUrl });
        console.log("saved in mongo");


        // 🔥 FIX: Seed Redis Cache immediately on creation so redirects work instantly!
        if (redisClient.isReady) {
            await redisClient.set(`url:${shortId}`, longUrl, {
                EX: 60 * 60 * 24
            });
            console.log("saved in redis");
        }

        

        const baseUrl = process.env.BASE_URL || "http://localhost:3000";
        const shortUrl = `${baseUrl}/${shortId}`;

        res.json({ shortUrl });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// redis import
// Import your Redis client
const redisClient = require('./redisClient');


app.get('/stats/:shortId', async (req, res) => {
    const { shortId } = req.params;

    try {
        // 1️⃣ Get clicks from Redis (fast)
        let redisClicks = 0;

        if (redisClient.isReady) {
            redisClicks = await redisClient.get(`clicks:${shortId}`);
            redisClicks = redisClicks ? parseInt(redisClicks) : 0;
        }

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


// Redirect route
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;

    try {

        // 1️⃣ Check Redis cache
        let cachedUrl = null;

        if (redisClient.isReady) {
            cachedUrl = await redisClient.get(`url:${shortId}`);
        }

        // 2️⃣ Found in Redis
        if (cachedUrl) {

            console.log('Redirect from Redis');

            if (redisClient.isReady) {
                await redisClient.incr(`clicks:${shortId}`);
                await redisClient.sAdd(
                    'tracked_clicks_keys',
                    `clicks:${shortId}`
                );
            }

            return res.redirect(cachedUrl);
        }

        // 3️⃣ Fetch from MongoDB
        const url = await Url.findOne({ shortId });

        if (!url) {
            return res.status(404).send('Short URL not found');
        }

        // 4️⃣ Cache URL and count click
        if (redisClient.isReady) {

            await redisClient.set(
                `url:${shortId}`,
                url.longUrl,
                { EX: 60 * 60 * 24 }
            );

            await redisClient.incr(`clicks:${shortId}`);

            await redisClient.sAdd(
                'tracked_clicks_keys',
                `clicks:${shortId}`
            );
        }

        console.log('Redirect from MongoDB');

        return res.redirect(url.longUrl);

    }
    catch (err) {

        console.error(err);

        return res.status(500).send('Server Error');

    }
});


const syncClicksToMongo = async () => {
    try {

        // Redis not connected locally
        if (!redisClient.isReady) return;

        // Only get keys having pending clicks
        const keys = await redisClient.sMembers('tracked_clicks_keys');

        if (keys.length === 0) return;

        for (const key of keys) {

            const shortId = key.split(':')[1];

            // Atomic transaction
            const multi = redisClient.multi();

            multi.get(key);
            multi.del(key);
            multi.sRem('tracked_clicks_keys', key);

            const [clicks] = await multi.exec();

            if (clicks) {

                await Url.findOneAndUpdate(
                    { shortId },
                    {
                        $inc: {
                            clicks: parseInt(clicks, 10)
                        }
                    }
                );

            }
        }

        console.log('Synced Redis clicks to MongoDB safely ✅');

    }
    catch (err) {

        console.error(
            'Error syncing clicks safely:',
            err
        );

    }
};

// Sync every 1 minute (adjust as needed)
setInterval(syncClicksToMongo, 60 * 1000);


const PORT = process.env.PORT || 3000;
// start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
