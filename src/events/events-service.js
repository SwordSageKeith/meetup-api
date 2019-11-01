const eventsService = {
  getAll(db) {
    return db("events").select("id", "name", "time", "location", "host");
  },
  getEvent(db, id) {
    return db("events")
      .where({ id })
      .first();
  },
  addEvent(db, event){
    return db.into('events')
      .insert(event)
      .returning('*')
      .then(event => event[0])
  }
};

module.exports = eventsService;
