// scripts/generate-api.mjs
import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'Api.ts', // Имя сгенерированного файла
    output: resolve(process.cwd(), './src/api'), // Куда положить файл
    url: 'http://localhost:8888/swagger/doc.json',
    httpClientType: 'axios', // Говорим генератору использовать Axios
});