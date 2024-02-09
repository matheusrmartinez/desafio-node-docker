import mysql from 'mysql2';
import express from 'express';
import { uniqueNamesGenerator, names } from 'unique-names-generator';

export const config = {
  host: 'db',
  user: 'root',
  password: '123456',
  database: 'nodedb',
};

const app = express();
const port = 3000;

let connection = mysql.createConnection(config);
const createTableIfNotExists = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;

  try {
    return new Promise((resolve, reject) => {
      connection.query(sql, (error) => {
        if (error) {
          console.error(error);
          reject();
        }
        resolve();
      });
    });
  } catch (error) {
    console.log(error);
  }
};

await createTableIfNotExists();

app.get('/', async (_, res) => {
  await addName();
  const people = await getPeople();
  const text = `<h1>Full Cycle Rocks!</h1>`;
  const html = `
      <body>
        ${text}
        Lista de pessoas cadastradas:
        <ul>
          ${people.map((person) => `<li>${person.name}</li>`)}
        </ul>
      </body>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});

export const addName = () => {
  const config = {
    dictionaries: [names],
  };

  const characterName = uniqueNamesGenerator(config);
  const sql = `INSERT INTO people(name) values ('${characterName}')`;

  return new Promise((resolve, reject) => {
    connection.query(sql, [characterName], (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

export const getPeople = () => {
  const sql = 'SELECT name FROM people';

  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
};
