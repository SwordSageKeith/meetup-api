const express = require("express");
const path = require("path");
const xss = require('xss')

const {requireAuth} = require('../middleware/jwt-auth')
const eventsService = require('./events-service')

const eventsRouter = express.Router();
const jsonBodyParser = express.json();

eventsRouter
  .route('/')
  .get((req, res, next) => {
    eventsService.getAllEvents(req.app.get('db'))
    .then(events => res.json(events))
    .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const unverified = req.body
    const requiredKeys = ['name', 'time', 'location', 'description']
    requiredKeys.forEach(key => {
      if(!(key in req.body))
        return res.status(400).json({error: `Event must have a ${key}`})
    })
    const newEvent = {host: req.user.id}
    requiredKeys.forEach(key => {
      newEvent[key] = xss(unverified[key])
    })
    eventsService.addEvent(req.app.get('db', newEvent))
      .then(event => res.json(event))
      .catch(next)
  })

  eventsRouter
  .route('/:id')
  .get((req, res, next) => {
    eventsService.getEvent(req.app.get('db'), req.params.id)
      .then(event => {
        if (!event) return res.status(404).json({error: 'No event found with that id'})
        return res.json(event)
      })
      .catch(next)
  })