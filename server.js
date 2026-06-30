console.log("SERVER.JS LOADED");
//mongodb
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const UAParser = require("ua-parser-js");
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Url = mongoose.model('Url', urlSchema);

// user schema
const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }

});
const User = mongoose.model('User', userSchema);

// clickschema
const clickSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true
  },
  ip: String,
  browser: String,
  device: String,
  country: String,
  clickedAt: {
    type: Date,
    default: Date.now
  }
});

const Click = mongoose.model("Click", clickSchema);

const express = require('express'); // import Express
const cors = require("cors");
const app = express(); // create server instance

const { nanoid } = require('nanoid'); // import nanoid
app.use(cors());         // ✅ allow requests from any origin
app.use(express.json()); // json parsing


// middlewares
const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.id;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
  } catch {
    req.user = null;
  }

  next();
};

//  ROUTES STARTS HERE ==============================================
// this runs when someone opens localhost:3000
app.get('/', (req, res) => {
  res.send('Hello Ayush 🚀 Server is running');
});

// TEMP ROUTE
app.get('/me', auth, (req, res) => {
  res.json({
    userId: req.user
  });
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

// delets
app.delete('/urls/:shortId', auth, async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    if (!url.owner || url.owner.toString() !== req.user) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await url.deleteOne();

    if (redisClient.isReady) {
      await redisClient.del(`url:${shortId}`);
      await redisClient.del(`clicks:${shortId}`);

      await redisClient.sRem(
        'tracked_clicks_keys',
        `clicks:${shortId}`
      );
    }

    res.json({
      message: 'URL deleted successfully'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error'
    });
  }
});

// myurls
app.get('/myurls', auth, async (req, res) => {
  try {
    const urls = await Url.find({ owner: req.user });

    res.json(urls);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Server error'
    });

  }
});


// url shorter
// POST API to shorten a URL
app.post('/shorten', optionalAuth, async (req, res) => {
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
    await Url.create({
      shortId,
      longUrl,
      owner: req.user
    });
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

app.get("/analytics/:shortId", async (req, res) => {
  const { shortId } = req.params;

  try {

    const clicks = await Click.find({ shortId }).sort({ clickedAt: -1 });

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({
        error: "URL not found"
      });
    }

    const longUrl = url.longUrl;
    const totalClicks = clicks.length;

    const uniqueVisitors = new Set(
      clicks.map(click => click.ip)
    ).size;

    const dailyMap = {};

    clicks.forEach(click => {

      const date = click.clickedAt
        .toISOString()
        .split("T")[0];

      dailyMap[date] = (dailyMap[date] || 0) + 1;

    });

    const daily = Object.keys(dailyMap)
      .sort()
      .map(date => ({
        date,
        clicks: dailyMap[date]
      }));

    const devices = {};
    const browsers = {};

    clicks.forEach(click => {
      const device = click.device || "Unknown";
      const browser = click.browser || "Unknown";

      devices[device] = (devices[device] || 0) + 1;
      browsers[browser] = (browsers[browser] || 0) + 1;
    });

    const recentClicks = clicks
      .sort((a, b) => b.clickedAt - a.clickedAt)
      .slice(0, 10)
      .map(click => ({
        browser: click.browser,
        device: click.device,
        clickedAt: click.clickedAt
      }));

    res.json({
    shortId,
    longUrl,
    totalClicks,
    uniqueVisitors,
    daily,
    devices,
    browsers,
    recentClicks
});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server Error"
    });

  }
});

// login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// register
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword
    });

    res.json({ message: 'User registered successfully' });

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

      const parser = new UAParser(req.headers["user-agent"]);

      const browser = parser.getBrowser().name || "Unknown";
      const device = parser.getDevice().type || "Desktop";
      const ip = req.ip || req.socket.remoteAddress;

      const click = await Click.create({
        shortId,
        ip,
        browser,
        device
      });

      console.log("Saved:", click);

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

    const parser = new UAParser(req.headers["user-agent"]);

    const browser = parser.getBrowser().name || "Unknown";
    const device = parser.getDevice().type || "Desktop";
    const ip = req.ip || req.socket.remoteAddress;


    const click = await Click.create({
      shortId,
      ip,
      browser,
      device
    });

    console.log("Saved:", click);

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
