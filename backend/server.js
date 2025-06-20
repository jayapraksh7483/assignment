const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Item = require('./models/Item');
const seedItems = async () => {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      const initialItems = [
        {
          id: 1,
          name: 'Cotton T-Shirt',
          type: 'T-Shirt',
          description: 'A comfortable t-shirt for casual wear',
          coverImage: `https://picsum.photos/seed/101/150/150`,
          additionalImages: [
            `https://picsum.photos/seed/102/150/150`,
            `https://picsum.photos/seed/103/150/150`,
          ],
        },
        {
          id: 2,
          name: 'Denim Pants',
          type: 'Pants',
          description: 'Stylish denim pants for everyday use',
          coverImage: `https://picsum.photos/seed/201/150/150`,
          additionalImages: [
            `https://picsum.photos/seed/202/150/150`,
            `https://picsum.photos/seed/203/150/150`,
          ],
        },
        {
          id: 3,
          name: 'Formal Shirt',
          type: 'Shirt',
          description: 'A classic shirt for formal occasions',
          coverImage: `https://picsum.photos/seed/301/150/150`,
          additionalImages: [
            `https://picsum.photos/seed/302/150/150`,
            `https://picsum.photos/seed/303/150/150`,
          ],
        },
      ];
      await Item.insertMany(initialItems);
      console.log('Seeded initial items');
    } else {
      console.log(`Found ${count} items, skipping seeding`);
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};
seedItems();

app.use('/api', require('./routes/api'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));