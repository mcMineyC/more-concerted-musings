import fs from 'fs';
import path from 'path';
import { defineMiddleware } from 'astro:middleware';
const token = "[CHANGME]"
// Simulated authentication function
const isAuthenticated = (thistoken: String) => {
  //const authHeader = request.headers.get('Authorization');
  //return authHeader === 'Bearer your-secret-token';
  //var params = getParamsFromUrl(request.url)
  return thistoken === token
};

export async function GET({ params, request }) {
  if (!isAuthenticated(params.token)) {
    return new Response('Unauthorized', { 
      status: 302,
      headers: {
        Location: '/tokened?url='+encodeURIComponent(request.url),
      },
    });
  }

  const filePath = path.join('public', params.file);

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
