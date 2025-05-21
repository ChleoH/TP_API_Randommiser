import Photo from '../../models/photo.mjs';
import Album from '../../models/album.mjs';
import Auth from '../auth.mjs';


export default class Photos {
  constructor(app, db) {
    this.app = app;
    this.db = db;
    this.routes();
  }

  routes() {
    // GET /album/:albumId/photos
    this.app.get('/album/:albumId/photos', Auth.verifyToken, async (req, res) => {
      try {
        const photos = await Photo.find({ album: req.params.albumId });
        res.json(photos);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET /album/:albumId/photo/:photoId
    this.app.get('/album/:albumId/photo/:photoId', Auth.verifyToken, async (req, res) => {
      try {
        const photo = await Photo.findOne({ _id: req.params.photoId, album: req.params.albumId });
        if (!photo) return res.status(404).json({ message: 'Photo not found' });
        res.json(photo);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // POST /album/:albumId/photo
    this.app.post('/album/:albumId/photo', Auth.verifyToken, async (req, res) => {
      try {
        const photo = new Photo({ ...req.body, album: req.params.albumId });
        await photo.save();
        await Album.findByIdAndUpdate(req.params.albumId, { $push: { photos: photo._id } });
        res.status(201).json(photo);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // PUT /album/:albumId/photo/:photoId
    this.app.put('/album/:albumId/photo/:photoId', Auth.verifyToken, async (req, res) => {
      try {
        const photo = await Photo.findOneAndUpdate(
          { _id: req.params.photoId, album: req.params.albumId },
          req.body,
          { new: true }
        );
        if (!photo) return res.status(404).json({ message: 'Photo not found' });
        res.json(photo);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });

    // DELETE /album/:albumId/photo/:photoId
    this.app.delete('/album/:albumId/photo/:photoId', Auth.verifyToken, async (req, res) => {
      try {
        const deleted = await Photo.findOneAndDelete({
          _id: req.params.photoId,
          album: req.params.albumId
        });
        if (!deleted) return res.status(404).json({ message: 'Photo not found' });

        await Album.findByIdAndUpdate(req.params.albumId, { $pull: { photos: deleted._id } });
        res.sendStatus(204);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
}
