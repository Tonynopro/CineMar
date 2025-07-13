require('dotenv').config();
const connection = require('../config/db');

async function llamarProcedimiento() {
  try {
    const [resultado] = await connection.execute('CALL generarFuncionesAutomaticas(?)', [100]);
    console.log('✅ Procedimiento ejecutado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando procedimiento:', error);
    process.exit(1);
  }
}

llamarProcedimiento();
