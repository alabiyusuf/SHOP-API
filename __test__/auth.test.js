const axios = require('axios');

let token;

// TEST FOR REGISTRATION ENDPOINT
try {
  test('checking if registration works well', async () => {
    const response = await axios.post(
      'http://localhost:4000/v1/auth/register',
      {
        fullName: 'Emmanuel',
        userName: 'tundecole',
        role: `admin`,
        password: '#Password1',
      }
    );

    expect(response.status).toBe(201);
    expect(response.data).toBe('User created successfully.');
  });
} catch (error) {
  console.log(error.response.data);
}

// TEST FOR LOGGING IN ENDPOINT
test(`Checking to see if a user will be allowed to be logged in`, async () => {
  const response = await axios.post('http://localhost:4000/v1/auth/login', {
    userName: `tundecole`,
    password: `#Password1`,
  });
  token = response.data.token;

  expect(response.status).toBe(200);
  expect(typeof response.data).toBe(`object`);
});

// TEST FOR ADDING A NEW ITEM TO THE SHOP
test(`Checking to see if an item will be added to the shop collection successfulyy.`, async () => {
  const response = await axios.post(
    `http://localhost:4000/v1/shops/`,
    {
      name: `Milo`,
      description: `Enjoy while it lasts`,
      price: 30,
      isInStock: true,
    },
    {
      headers: {
        authorization: 'Bearer ' + token,
      },
    }
  );

  expect(response.status).toBe(201);
  expect(typeof response.data).toBe(`object`);
});

// TEST FOR GETTING ALL LIST OF ITEMS IN THE SHOPS
test(`checking to see if all the items in the shop collections will be gotten`, async () => {
  const response = await axios.get(`http://localhost:4000/v1/shops/`, {
    headers: {
      authorization: 'Bearer ' + token,
    },
  });

  expect(response.status).toBe(200);
  expect(typeof response.data).toBe(`object`);
});

// TEST FOR DELETING AN ITEM
test(`check to see if an item in the shop collections will be deleted`, async () => {
  const id = `6533611d63e6fc7dac2b7504`;
  const response = await axios.delete(`http://localhost:4000/v1/shops/${id}`, {
    headers: {
      authorization: 'Bearer ' + token,
    },
  });

  expect(response.status).toBe(200);
  expect(typeof response.data).toBe(`object`);
});
