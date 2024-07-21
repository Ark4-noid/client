import axios from "axios";
import * as XLSX from "xlsx";
import { writeFile } from "fs/promises";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

axios
  .get(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  .then(async (response) => {
    const data = response.data;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sellos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    await writeFile("sellos_tracktec.xlsx", excelBuffer);

    console.log("Sellos guardados");
  })
  .catch((error) => {
    console.error("Problema en la solicitud:", error);
  });
