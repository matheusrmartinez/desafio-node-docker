import mysqld from 'mysql';
import express from 'express';
import { config } from './db-config';
import { uniqueNamesGenerator, names } from 'unique-names-generator';

const app = express();
const port = 3000;

let connection = mysqld.createConnection(config);

app.get('/', async (res) => {
  await addName();
  const people = await getPeople();

  const text = `<h1>Full Cycle Rocks!</h1>`;
  const html = `
      <body>
        ${text}
        Lista de pessoas cadastradas:
        <ul>
          ${people.map((person) => `<li>${person.name}</li>`).join(', ')}
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
  const sql = `INSERT INTO people(name) values (?)`;

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
