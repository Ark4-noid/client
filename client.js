import axios from "axios";
import * as XLSX from "xlsx";
import { writeFile } from "fs/promises";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

const dataAPI = async (url, key) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Problema en la solicitud:", error);
    throw error;
  }
};

const filterData = (data) => {
  return data.map((item) => ({
    patente: item.patente,
    gerencia: item.gerencia,
    gerente_mel: item.gerente_mel,
    contrato: item.contrato,
    orden_servicio: item.orden_servicio,
    contract_owner: item.contract_owner,
    contract_owner_email: item.contract_owner_email,
    empresa_contratista: item.empresa_contratista,
    nombre_admin_contrato: item.nombre_admin_contrato,
    numero_sello: item.numero_sello,
    color: item.informacion_sello.color,
    estado: item.informacion_sello.estado,
    fecha_entrega: item.informacion_sello.fecha_entrega,
    fecha_vencimiento: item.informacion_sello.fecha_vencimiento,
    email_admin_contrato: item.email_admin_contrato,
    telefono: item.telefono,
    estado_solicitud: item.estado_solicitud,
    tipo_vehiculo: item.informacion_vehiculo.tipo_vehiculo,
  }));
};

const saveDataExcel = async (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sellos");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });

  await writeFile(filename, excelBuffer);
  console.log(`Datos guardados en ${filename}`);
};

const main = async () => {
  try {
    const data = await dataAPI(apiUrl, apiKey);
    const filteredData = filterData(data);
    await saveDataExcel(filteredData, "sellos_entregados.xlsx");
  } catch (error) {
    console.error("Error en el proceso:", error);
  }
};

main();
