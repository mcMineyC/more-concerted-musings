export const prerender = false
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
// First find out the __dirname, then resolve to one higher level in the dir tree
const __dirname = path.resolve(path.dirname(__filename), "../");

import { defineMiddleware } from 'astro:middleware';
const token = "[CHANGEME]"
const path = 
// Simulated authentication function
const isAuthenticated = (thistoken: String) => {
  //const authHeader = request.headers.get('Authorization');
  //return authHeader === 'Bearer your-secret-token';
  //var params = getParamsFromUrl(request.url)
  return thistoken === token
};

export async function GET({ params, request }) {
  var token = getParamsFromUrl(request.url).token;
  console.log("token", token)
  if (!isAuthenticated(decodeURIComponent(token))) {
    return new Response('Unauthorized', { 
      status: 302,
      headers: {
        Location: '/tokened?url='+encodeURIComponent(request.url.split("?")[0]),
      },
    });
  }

  const filePath = path.resolve(path.join(__dirname, "../../../", params.file));

  if (!fs.existsSync(filePath)) {
    return new Response('File not found\n'+filePath, { status: 404 });
  }

  const fileContent = await fs.promises.readFile(filePath);
  return new Response(fileContent, { status: 200 });
}

function getParamsFromUrl(url) {
  try {
    const params = new URL(url).searchParams;
    return Object.fromEntries(params.entries());
  } catch (error) {
    console.error("Invalid URL:", error.message);
    return {};
  }
}
