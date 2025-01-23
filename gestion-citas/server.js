const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia este valor según tu configuración
  password: '', // Cambia este valor si tienes contraseña
  database: 'gestion_citas'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Rutas CRUD

// Crear una cita
app.post('/citas', (req, res) => {
  const { paciente_id, medico_id, fecha, hora, consultorio_id } = req.body;
  const query = 'INSERT INTO citas (paciente_id, medico_id, fecha, hora, consultorio_id) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [paciente_id, medico_id, fecha, hora, consultorio_id], (err, result) => {
    if (err) {
      return res.status(500).send('Error al crear cita');
    }
    res.status(201).send({ id: result.insertId, mensaje: "Cita creada con éxito" });
  });
});

// Leer todas las citas
app.get('/citas', (req, res) => {
  db.query('SELECT * FROM citas', (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener citas');
    }
    res.json(results);
  });
});

// Leer una cita por ID
app.get('/citas/:id', (req, res) => {
  const citaId = req.params.id;

  if (isNaN(citaId)) {
    return res.status(400).json({ message: 'El ID de la cita debe ser un número válido' });
  }

  const query = 'SELECT * FROM citas WHERE id = ?';
  db.query(query, [citaId], (err, result) => {
    if (err) {
      console.error('Error al consultar la cita:', err);
      return res.status(500).json({ message: 'Hubo un error al obtener la cita' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    const cita = result[0];
    return res.status(200).json({
      id: cita.id,
      paciente_id: cita.paciente_id,
      medico_id: cita.medico_id,
      fecha: cita.fecha,
      hora: cita.hora,
      consultorio_id: cita.consultorio_id
    });
  });
});

// Actualizar una cita
app.put('/citas/:id', (req, res) => {
  const citaId = req.params.id;
  const { paciente_id, medico_id, fecha, hora, consultorio_id } = req.body;

  if (isNaN(citaId)) {
    return res.status(400).json({ message: 'El ID de la cita debe ser un número válido' });
  }

  const query = 'UPDATE citas SET paciente_id = ?, medico_id = ?, fecha = ?, hora = ?, consultorio_id = ? WHERE id = ?';
  db.query(query, [paciente_id, medico_id, fecha, hora, consultorio_id, citaId], (err, result) => {
    if (err) {
      console.error('Error al actualizar la cita:', err);
      return res.status(500).json({ message: 'Hubo un error al actualizar la cita' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.status(200).json({ message: 'Cita actualizada con éxito' });
  });
});

// Eliminar una cita
app.delete('/citas/:id', (req, res) => {
  const citaId = req.params.id;

  if (isNaN(citaId)) {
    return res.status(400).json({ message: 'El ID de la cita debe ser un número válido' });
  }

  const query = 'DELETE FROM citas WHERE id = ?';
  db.query(query, [citaId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la cita:', err);
      return res.status(500).json({ message: 'Hubo un error al eliminar la cita' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.status(200).json({ message: 'Cita eliminada con éxito' });
  });
});

// Crear un consultorio
app.post('/consultorios', (req, res) => {
  const { numero, piso } = req.body;
  const query = 'INSERT INTO consultorios (numero, piso) VALUES (?, ?)';
  
  db.query(query, [numero, piso], (err, result) => {
    if (err) {
      return res.status(500).send('Error al crear consultorio');
    }
    res.status(201).send({ id: result.insertId });
  });
});

// Leer todos los consultorios
app.get('/consultorios', (req, res) => {
  db.query('SELECT * FROM consultorios', (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener consultorios');
    }
    res.json(results);
  });
});

// Leer un consultorio por ID
app.get('/consultorios/:id', (req, res) => {
  const consultorioId = req.params.id;

  if (isNaN(consultorioId)) {
    return res.status(400).json({ message: 'El ID del consultorio debe ser un número válido' });
  }

  const query = 'SELECT * FROM consultorios WHERE id = ?';
  db.query(query, [consultorioId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Hubo un error al obtener el consultorio' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Consultorio no encontrado' });
    }

    res.status(200).json(result[0]);
  });
});

// Eliminar un consultorio
app.delete('/consultorios/:id', (req, res) => {
  const consultorioId = req.params.id;

  if (isNaN(consultorioId)) {
    return res.status(400).json({ message: 'El ID del consultorio debe ser un número válido' });
  }

  const query = 'DELETE FROM consultorios WHERE id = ?';
  db.query(query, [consultorioId], (err, result) => {
    if (err) {
      console.error('Error al eliminar consultorio:', err);
      return res.status(500).json({ message: 'Hubo un error al eliminar el consultorio' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Consultorio no encontrado' });
    }

    res.status(200).json({ message: 'Consultorio eliminado con éxito' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
