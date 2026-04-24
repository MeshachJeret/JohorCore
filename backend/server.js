require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// 1. Point to the 'public' folder where your HTML/CSS/JS live
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// 2. Serve the index.html from that public folder
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/api/congestion', async (req, res) => {
    try {
        const checkpoints = {
            woodlands: {
                origin: { lat: 1.4470, lng: 103.7630 },
                destination: { lat: 1.4655, lng: 103.7630 }
            },
            tuas: {
                origin: { lat: 1.3210, lng: 103.6390 },
                destination: { lat: 1.3480, lng: 103.6310 }
            }
        };

        const results = {};

        for (const [name, coords] of Object.entries(checkpoints)) {
            const response = await fetch(
                'https://routes.googleapis.com/directions/v2:computeRoutes',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Goog-Api-Key': GOOGLE_API_KEY,
                        'X-Goog-FieldMask': 'routes.duration,routes.staticDuration'
                    },
                    body: JSON.stringify({
                        origin: { location: { latLng: coords.origin } },
                        destination: { location: { latLng: coords.destination } },
                        travelMode: 'DRIVE',
                        routingPreference: 'TRAFFIC_AWARE',
                        departureTime: new Date().toISOString()
                    })
                }
            );

            const data = await response.json();

            // Check if the API returned an error
            if (data.error || !data.routes || !data.routes[0]) {
                console.error(`⚠️ Routes API error for ${name}:`, JSON.stringify(data.error || data));
                throw new Error(`Routes API failed for ${name}: ${data.error?.message || 'No routes returned'}`);
            }

            const route = data.routes[0];
            const withTraffic = Math.round(parseInt(String(route.duration).replace('s', '')) / 60);
            const withoutTraffic = Math.round(parseInt(String(route.staticDuration).replace('s', '')) / 60);
            const delay = withTraffic - withoutTraffic;

            results[name] = {
                wait_minutes: withTraffic,
                delay_minutes: delay,
                congestion_level:
                    delay < 10 ? 'light' :
                        delay < 30 ? 'moderate' :
                            delay < 60 ? 'heavy' : 'severe'
            };
        }

        res.json(results);

    } catch (err) {
        console.error('❌ Routes API unavailable, using time-based estimates:', err.message);

        // Fallback: estimate congestion from time-of-day patterns
        const hour = new Date().getHours();
        const day = new Date().getDay(); // 0=Sun

        // Realistic JB-SG causeway patterns
        let woodlandsWait, tuasWait;
        if (hour >= 6 && hour < 9) {            // Morning rush (JB→SG)
            woodlandsWait = 45 + Math.floor(Math.random() * 20);
            tuasWait = 25 + Math.floor(Math.random() * 15);
        } else if (hour >= 17 && hour < 20) {   // Evening rush (SG→JB)
            woodlandsWait = 50 + Math.floor(Math.random() * 25);
            tuasWait = 30 + Math.floor(Math.random() * 15);
        } else if (hour >= 9 && hour < 12) {    // Late morning
            woodlandsWait = 15 + Math.floor(Math.random() * 10);
            tuasWait = 10 + Math.floor(Math.random() * 8);
        } else if (hour >= 12 && hour < 17) {   // Afternoon
            woodlandsWait = 20 + Math.floor(Math.random() * 15);
            tuasWait = 15 + Math.floor(Math.random() * 10);
        } else {                                 // Night / early morning
            woodlandsWait = 8 + Math.floor(Math.random() * 7);
            tuasWait = 5 + Math.floor(Math.random() * 5);
        }

        // Weekends are busier in the evening
        if ((day === 0 || day === 5) && hour >= 16) {
            woodlandsWait += 15;
            tuasWait += 10;
        }

        const classify = (wait) => wait < 15 ? 'light' : wait < 40 ? 'moderate' : wait < 60 ? 'heavy' : 'severe';

        res.json({
            woodlands: {
                wait_minutes: woodlandsWait,
                delay_minutes: Math.max(0, woodlandsWait - 15),
                congestion_level: classify(woodlandsWait),
                source: 'estimated'
            },
            tuas: {
                wait_minutes: tuasWait,
                delay_minutes: Math.max(0, tuasWait - 10),
                congestion_level: classify(tuasWait),
                source: 'estimated'
            }
        });
    }
});

// ── Weather / flood endpoint ─────────────────────────
app.get('/api/weather', async (req, res) => {
    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude', '1.4927');
        url.searchParams.set('longitude', '103.7414');
        url.searchParams.set('daily', 'precipitation_sum,precipitation_probability_max');
        url.searchParams.set('timezone', 'Asia/Kuala_Lumpur');
        url.searchParams.set('forecast_days', '7');

        const response = await fetch(url.toString());
        const data = await response.json();

        const todayRain = data.daily.precipitation_sum[0];

        res.json({
            current: {
                rainfall_today_mm: todayRain,
                flood_status:
                    todayRain < 20 ? 'safe' :
                        todayRain < 60 ? 'warning' : 'alert',
                station: 'Johor Bahru'
            },
            forecast: data.daily.time.slice(0, 5).map((date, i) => ({
                date,
                rainfall_mm: data.daily.precipitation_sum[i],
                rain_probability: data.daily.precipitation_probability_max[i],
                status:
                    data.daily.precipitation_sum[i] < 20 ? 'safe' :
                        data.daily.precipitation_sum[i] < 60 ? 'warning' : 'alert'
            }))
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Currency exchange endpoint ───────────────────────
app.get('/api/currency', async (req, res) => {
    try {
        // Using ExchangeRate-API (free, no API key required for basic usage)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/SGD');
        const data = await response.json();

        if (!data.rates || !data.rates.MYR) {
            throw new Error('Invalid response from currency API');
        }

        const sgdToMyr = data.rates.MYR;
        const lastUpdated = data.date || new Date().toISOString().split('T')[0];

        res.json({
            sgd_to_myr: sgdToMyr.toFixed(4),
            last_updated: lastUpdated,
            source: 'ExchangeRate-API'
        });

    } catch (err) {
        console.error('Currency API error:', err.message);
        // Fallback to static rate
        res.json({
            sgd_to_myr: '3.51',
            last_updated: new Date().toISOString().split('T')[0],
            source: 'fallback'
        });
    }
});

// ── AI chat endpoint ─────────────────────────────────
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        const systemPrompt = `You are CausewayIQ, a smart assistant for 
    Johor-Singapore Causeway commuters. Here is the current situation:
    - Woodlands wait time: ${context.woodlands_wait} minutes
    - Tuas wait time: ${context.tuas_wait} minutes  
    - Flood status: ${context.flood_status}
    - SGD to MYR rate: ${context.sgd_to_myr}
    - Best crossing time: ${context.best_time}
    Answer helpfully and concisely in 2-3 sentences.`;

        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GOOGLE_API_KEY,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        { role: 'user', parts: [{ text: message }] }
                    ]
                })
            }
        );

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });
});

function getChatFallback(message = '', context = {}) {
    const lowerText = (message || '').toLowerCase();
    if ((lowerText.includes('where') && lowerText.includes('cross')) || lowerText.includes('which crossing') || lowerText.includes('should i cross')) {
        const best = parseInt(context.tuas_wait || '999', 10) <= parseInt(context.woodlands_wait || '999', 10) ? 'Tuas' : 'Woodlands';
        return `Right now, Woodlands wait is approx ${context.woodlands_wait} min and Tuas is approx ${context.tuas_wait} min. I'd recommend using ${best} for the quickest crossing.`;
    }
    if (lowerText.includes('cross now') || lowerText.includes('congestion') || lowerText.includes('traffic') || lowerText.includes('wait time')) {
        return `Right now, Woodlands wait is approx ${context.woodlands_wait} min, and Tuas is ${context.tuas_wait} min. Based on that, Tuas is the faster crossing at the moment.`;
    }
    if (lowerText.includes('flood')) {
        return context.flood_status === 'SAFE'
            ? 'Good news: There are no active flood warnings near the checkpoints right now.'
            : 'Please be careful! There are active flood alerts. Check the Flood Alert panel for affected roads.';
    }
    if (lowerText.includes('toll') || lowerText.includes('rate') || lowerText.includes('currency') || lowerText.includes('exchange')) {
        return `The current exchange rate is 1 SGD = ${context.sgd_to_myr} MYR. Standard toll applies today.`;
    }
    if (lowerText.includes('best time') || lowerText.includes('when') || lowerText.includes('morning') || lowerText.includes('afternoon') || lowerText.includes('evening')) {
        return `Based on current trends, the best time to cross today is around ${context.best_time || '10:30 AM'}.`;
    }
    if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey')) {
        return "Hi there! I'm your JCoreIQ assistant. Ask me about wait times, tolls, flood status, or which checkpoint to use.";
    }
    return "I'm your JCoreIQ assistant! I can help with wait times, tolls, flood alerts, and border crossing advice. Ask me anything about the Causeway.";
}

// ── Best time endpoint ───────────────────────────────
app.get('/api/best-time', (req, res) => {
    const now = new Date();
    const currentHour = now.getHours();
    const day = now.getDay(); // 0=Sun, 6=Sat

    const period = req.query.period; // 'morning', 'afternoon', 'evening', or undefined for next 6 hours
    console.log(`🕐 Best time request - Period: ${period}, Current Hour: ${currentHour}`);

    const periodRanges = {
        morning: { start: 6, end: 11 },
        afternoon: { start: 12, end: 17 },
        evening: { start: 18, end: 23 }
    };

    let startHour, endHour;
    if (period && periodRanges[period]) {
        const range = periodRanges[period];
        if (currentHour < range.start) {
            startHour = range.start;
        } else if (currentHour > range.end) {
            startHour = range.start; // next day's period start
        } else {
            startHour = currentHour;
        }
        endHour = range.end;
    } else {
        // Default: next 6 hours
        startHour = currentHour;
        endHour = (currentHour + 5) % 24;
    }

    // Function to estimate wait time for a given hour
    const estimateWait = (hour, checkpoint) => {
        let wait;
        if (hour >= 6 && hour < 9) {            // Morning rush (JB→SG)
            wait = checkpoint === 'woodlands' ? 45 + Math.floor(Math.random() * 20) : 25 + Math.floor(Math.random() * 15);
        } else if (hour >= 17 && hour < 20) {   // Evening rush (SG→JB)
            wait = checkpoint === 'woodlands' ? 50 + Math.floor(Math.random() * 25) : 30 + Math.floor(Math.random() * 15);
        } else if (hour >= 9 && hour < 12) {    // Late morning
            wait = checkpoint === 'woodlands' ? 15 + Math.floor(Math.random() * 10) : 10 + Math.floor(Math.random() * 8);
        } else if (hour >= 12 && hour < 17) {   // Afternoon
            wait = checkpoint === 'woodlands' ? 20 + Math.floor(Math.random() * 15) : 15 + Math.floor(Math.random() * 10);
        } else {                                 // Night / early morning
            wait = checkpoint === 'woodlands' ? 8 + Math.floor(Math.random() * 7) : 5 + Math.floor(Math.random() * 5);
        }

        // Weekends busier in evening
        if ((day === 0 || day === 6) && hour >= 16) {
            wait += checkpoint === 'woodlands' ? 15 : 10;
        }

        return Math.max(5, wait); // Minimum 5 min
    };

    // Find best time in the specified period
    let bestTime = null;
    let bestWait = Infinity;
    let bestCheckpoint = 'woodlands';

    const hours = [];
    if (period && periodRanges[period]) {
        const range = periodRanges[period];
        for (let h = range.start; h <= range.end; h++) {
            hours.push(h);
        }
        console.log(`📋 Period ${period}: Hours range [${range.start}-${range.end}] = ${hours.join(', ')}`);
    } else {
        for (let h = 0; h < 6; h++) {
            hours.push((startHour + h) % 24);
        }
    }

    for (const hour of hours) {
        const woodlandsWait = estimateWait(hour % 24, 'woodlands');
        const tuasWait = estimateWait(hour % 24, 'tuas');

        if (woodlandsWait < bestWait) {
            bestWait = woodlandsWait;
            bestTime = hour % 24;
            bestCheckpoint = 'woodlands';
        }
        if (tuasWait < bestWait) {
            bestWait = tuasWait;
            bestTime = hour % 24;
            bestCheckpoint = 'tuas';
        }
    }

    // Format time
    const timeString = `${bestTime.toString().padStart(2, '0')}:00`;

    // Reasoning
    const isRush = (bestTime >= 6 && bestTime < 9) || (bestTime >= 17 && bestTime < 20);
    const reason = isRush ?
        `${bestCheckpoint} is the fastest option during this time period despite rush hour.` :
        `${bestCheckpoint} offers the shortest wait at this time.`;

    const responseData = {
        recommended_time: timeString,
        checkpoint: bestCheckpoint,
        wait_minutes: bestWait,
        reasoning: reason,
        period: period || 'next_6h',
        period_range: period && periodRanges[period] ? `${periodRanges[period].start}:00-${periodRanges[period].end}:00` : 'next 6h',
        hours_searched: hours,
        forecast: hours.map(hour => ({
            time: `${(hour % 24).toString().padStart(2, '0')}:00`,
            woodlands_wait: estimateWait(hour % 24, 'woodlands'),
            tuas_wait: estimateWait(hour % 24, 'tuas')
        }))
    };
    console.log(`✅ Best time response - Time: ${timeString}, Checkpoint: ${bestCheckpoint}, Hours: ${hours.join(',')}`);
    res.json(responseData);
});

// ── Start server ─────────────────────────────────────
const PORT = process.env.PORT || 8080;
// Listen on 0.0.0.0 so Cloud Run can route external traffic to the container
app.listen(PORT, "0.0.0.0", () => {
    console.log(`JohorCore backend running on port ${PORT}`);
});