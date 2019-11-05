const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// 
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Caio Mizumoto'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Joseph Miguel'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        message: 'Are you lost? Try the homepage again',
        name: 'Caio'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error: 'Please provide an address'
        })
    } else {
        geocode(address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({
                    error: "You must provide a valid address, search for a city."
                })
            }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error: "Location not found"
                    })
                }
                res.send({
                    location,
                    forecastData,
                    address
                })
            })
        })
    }
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query);
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'miguel'
    })
;})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'joseph'
    });
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})