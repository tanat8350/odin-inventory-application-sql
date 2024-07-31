#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

const SQL = `
create table if not exists categories (
  id integer primary key generated always as identity,
  name varchar(100) not null,
  description text
);

create table if not exists items (
  id integer primary key generated always as identity,
  name varchar(100) not null,
  description text,
  categoryid integer not null,
  FOREIGN KEY (categoryid) REFERENCES categories(id),
  price integer,
  instock integer,
  image_url text
);

insert into categories (name, description) values
('cata1', 'desc1'),
('cata2', 'desc2');

insert into items (name, categoryid) values
('item1', 1),
('item2', 2);
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
}

main();
