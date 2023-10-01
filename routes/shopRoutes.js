const express = require('express');
const router = express.Router();
const { shopItemsCollection } = require('../schema/shopItemsSchema');
const { isUserLoggedIn } = require('../middlewares/isUserLoggedIn');
const { adminsOnly } = require('../middlewares/adminsOnly');

router.use(isUserLoggedIn);

// router.get('/', (req, res) => {
//   res.json({ message: `Get request received.` });
// });
router.post('/', adminsOnly, async (req, res) => {
  try {
    const newItem = await shopItemsCollection.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isInStock: req.body.isInStock,
    });
    return res.status(201).json({ message: `New item created`, newItem });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `New item not created, error:`, error });
  }
});

router.get('/', async (req, res) => {
  try {
    const getAllItems = await shopItemsCollection.find({});
    if (getAllItems.length == 0) {
      return res.status(500).json({ message: `No items in this collection.` });
    }
    // res.send(getAllItems);
    return res.status(200).json({ getAllItems });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Error fetching all items`, error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const getItemById = await shopItemsCollection.findById(id);
    if (!id) {
      return res.json({
        message: `The item you are searching for in the shops collection does not exist, try again`,
      });
    }
    return res.status(200).json({ getItemById });
  } catch (error) {}
});

router.patch('/:id', adminsOnly, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(500).json({
        message: `id does not matches, so item cannot be updated in the shop collection.`,
      });
    }
    const updatedItem = await shopItemsCollection.findByIdAndUpdate(
      id,
      {
        description: req.body.description,
        price: req.body.price,
        isInStock: req.body.isInStock,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: `Task has been updated successfully`, updatedItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Error encountered while trying to update item in the shop collection`,
      error,
    });
  }
});
router.delete('/:id', adminsOnly, async (req, res) => {
  try {
    const id = req.params.id;

    const deleteItem = await shopItemsCollection.findByIdAndDelete(id);
    if (!id) {
      return res.status(500).json({
        message: `id does not matches, so item cannot be deleted in the shop collection.`,
      });
    }
    res
      .status(200)
      .json({ message: `Item has successfully been deleted`, deleteItem });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Error encountered while deleting task`, error });
  }
});

module.exports = router;
