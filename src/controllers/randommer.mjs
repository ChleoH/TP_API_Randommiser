import axios from 'axios';
import dotenv from 'dotenv';
import Auth from './auth.mjs';

dotenv.config();

export default class Randommer {
  constructor(app) {
    this.app = app;
    this.run();
  }

  run() {
    this.app.get('/api/randommer-profile', Auth.verifyToken, async (req, res) => {
      try {
        const headers = { 'X-Api-Key': process.env.RANDOMMER_API_KEY };

        const [phone, iban, card, name] = await Promise.all([
          axios.get('https://randommer.io/api/Phone/Generate?countryCode=FR', { headers }),
          axios.get('https://randommer.io/api/IBAN?countryCode=FR', { headers }),
          axios.get('https://randommer.io/api/Card', { headers }),
          axios.get('https://randommer.io/api/Name?nameType=fullname&quantity=1', { headers })
        ]);

        const profile = {
          name: name.data[0],
          phone_number: phone.data,
          iban: iban.data,
          credit_card: {
            card_number: card.data[0].cardNumber,
            card_type: card.data[0].type,
            expiration_date: card.data[0].expiration,
            cvv: card.data[0].cvv
          }
        };

        res.status(200).json(profile);
      } catch (error) {
        res.status(500).json({ message: 'API call failed', error: error.message });
      }
    });
  }
}
