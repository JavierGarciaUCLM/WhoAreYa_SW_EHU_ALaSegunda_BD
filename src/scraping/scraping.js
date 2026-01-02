const path = require('path');
const fs = require('fs');
const fsp = fs.promises;

async function scrape(type) {
    
    switch (type) {
        case 'leagues': {
            try {
                const leaguespath = path.join(__dirname, '..', '..', 'data', 'league_logos');
                await fsp.mkdir(leaguespath, { recursive: true });

                const leaguesFile = path.join(__dirname, '..', '..', 'data', 'leagues.txt');
                const content = await fsp.readFile(leaguesFile, 'utf8');
                const data = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

                const fetchMod = await import('node-fetch');
                const fetch = fetchMod.default || fetchMod;

                const promises = data.map(async (elem, idx) => {
                    const url = `https://playfootball.games/media/competitions/${encodeURIComponent(elem)}.png`;
                    const res = await fetch(url);
                    if (res.status === 200 && res.body) {
                        const outPath = path.join(leaguespath, `${elem}.png`);
                        res.body.pipe(fs.createWriteStream(outPath));
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`);
                    }
                });

                await Promise.all(promises);
            } catch (err) {
                console.error('Error scraping leagues:', err && err.message ? err.message : err);
            }
            break;
        }

        case 'flags': {
            try {
                const nationspath = path.join(__dirname, '..', '..', 'data', 'flags');
                await fsp.mkdir(nationspath, { recursive: true });

                const nationsFile = path.join(__dirname, '..', '..', 'data', 'nationalities.txt');
                const content = await fsp.readFile(nationsFile, 'utf8');
                const data = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

                const fetchMod = await import('node-fetch');
                const fetch = fetchMod.default || fetchMod;

                const promises = data.map(async (elem, idx) => {
                    const url = `https://playfootball.games/media/nations/${encodeURIComponent(elem.toLowerCase())}.svg`;
                    const res = await fetch(url);
                    if (res.status === 200 && res.body) {
                        const outPath = path.join(nationspath, `${elem}.svg`);
                        res.body.pipe(fs.createWriteStream(outPath));
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`);
                    }
                });

                await Promise.all(promises);
            } catch (err) {
                console.error('Error scraping flags:', err && err.message ? err.message : err);
            }
            break;
        }

        case 'teams': {
            try {
                const teamspath = path.join(__dirname, '..', '..', 'data', 'team_logos');
                await fsp.mkdir(teamspath, { recursive: true });

                const teamsFile = path.join(__dirname, '..', '..', 'data', 'teams.txt');
                const content = await fsp.readFile(teamsFile, 'utf8');
                const data = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

                const fetchMod = await import('node-fetch');
                const fetch = fetchMod.default || fetchMod;

                const promises = data.map(async (elem, idx) => {
                    const shard = Number(elem) % 32;
                    const url = `https://cdn.sportmonks.com/images/soccer/teams/${encodeURIComponent(shard)}/${encodeURIComponent(elem)}.png`;
                    const res = await fetch(url);
                    if (res.status === 200 && res.body) {
                        const outPath = path.join(teamspath, `${elem}.png`);
                        res.body.pipe(fs.createWriteStream(outPath));
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`);
                    }
                });

                await Promise.all(promises);
            } catch (err) {
                console.error('Error scraping teams:', err && err.message ? err.message : err);
            }
            break;
        }

        case 'players': {
            try {
                const playerspath = path.join(__dirname, '..', '..', 'data', 'players');
                await fsp.mkdir(playerspath, { recursive: true });

                const playersFile = path.join(__dirname, '..', '..', 'data', 'players.txt');
                const content = await fsp.readFile(playersFile, 'utf8');
                const data = content.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

                const fetchMod = await import('node-fetch');
                const fetch = fetchMod.default || fetchMod;

                const promises = data.map(async (elem, idx) => {
                    const shard = Number(elem) % 32;
                    const url = `https://playfootball.games/media/players/${encodeURIComponent(shard)}/${encodeURIComponent(elem)}.png`;
                    const res = await fetch(url);
                    if (res.status === 200 && res.body) {
                        const outPath = path.join(playerspath, `${elem}.png`);
                        res.body.pipe(fs.createWriteStream(outPath));
                    } else {
                        console.log(`status: ${res.status} line: ${idx} elem: ${elem} not found`);
                    }
                });

                await Promise.all(promises);
            } catch (err) {
                console.error('Error scraping players:', err && err.message ? err.message : err);
            }
            break;
        }

        default: {
            console.error('Usage: node scraping.js [leagues|flags|teams|players|all]');
            break;
        }
    }
}

module.exports = { scrape };

async function main() {
    await scrape('leagues');
    await scrape('flags');
    await scrape('teams');
    await scrape('players');
}

if (require.main === module) {
    main().catch(err => {
        console.error('Error during scraping:', err);
        process.exit(1);
    });
}