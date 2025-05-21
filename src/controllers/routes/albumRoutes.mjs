import Album from '../../models/album.mjs';
import Auth from '../auth.mjs';

export default class Albums {
  constructor(app, db) {
    this.app = app;
    this.db = db;
    this.routes();
  }

  routes() {
    // GET /album/:id
    this.app.get('/album/:id', Auth.verifyToken, async (req, res) => {
      try {
        const album = await Album.findById(req.params.id).populate('photos');
        if (!album) return res.status(404).json({ message: 'Album not found' });
        res.json(album);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET /album?title=XXX
    this.app.get('/album', Auth.verifyToken, async (req, res) => {
      try {
        const { title } = req.query;
        const filter = title ? { title: new RegExp(title, 'i') } : {};
        const albums = await Album.find(filter);
        res.json(albums);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // POST /album
    this.app.post('/album', Auth.verifyToken, async (req, res) => {
      try {
        const album = new Album(req.body);
        await album.save();
        res.status(201).json(album);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // PUT /album/:id
    this.app.put('/album/:id', Auth.verifyToken, async (req, res) => {
      try {
        const updated = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Album not found' });
        res.json(updated);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // DELETE /album/:id
    this.app.delete('/album/:id', Auth.verifyToken, async (req, res) => {
      try {
        const deleted = await Album.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Album not found' });
        res.sendStatus(204);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
}
