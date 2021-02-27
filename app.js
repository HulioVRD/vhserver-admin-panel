const express = require('express')
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    const config = require('./config.json')
    const password = req.body.password;

    const comparison = await bcrypt.compare(password, config.passwordHash)

    if (!comparison) {
        return res.status(401).send('Wrong password');
    }
})

app.post('/status', async (req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Panel listening on port ${PORT}`);
})