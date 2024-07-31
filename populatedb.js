#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, des) {
  const category = new Category({ name: name, description: des });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, des, cate, price, instock, image_url) {
  const item = new Item({
    name: name,
    description: des,
    category: cate, //?
    price: price,
    instock: instock,
    image_url: image_url,
  });

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'test name', 'test des'),
    categoryCreate(1, 'test name1', 'test des1'),
    categoryCreate(2, 'test name2', 'test des2'),
    categoryCreate(3, 'rewa', 'rewa kamen rider'),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(0, 'kamen rider zero one', 'rewa 1', categories[3]),
    itemCreate(1, 'kamen rider saber', 'rewa 2', categories[3]),
    itemCreate(2, 'kamen rider revice', 'rewa 3', categories[3]),
    itemCreate(
      3,
      'test name',
      'test des',
      categories[0],
      1000,
      2000,
      'www.google.com'
    ),
  ]);
}
