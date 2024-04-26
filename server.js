const PASSWORD = process.env.PASSWORD

Bun.serve(
  {
    development: true,
    async fetch(req) {
      // Get path from request url
      const url = new URL(req.url)
      const path = url.pathname

      if (req.method === "POST" && path === "/save") {
        return saveHandler(req)
      }

      if (req.method === "GET" && path === "/") {
        return indexHandler(req)
      }

      // Check if the request is for a static file
      const file = Bun.file(path.slice(1))

      // If file is in the public folder, return it
      if (path.startsWith("/public/") && !path.includes("..") && file) {
        return new Response(file)
      }

      // Handle other requests
      const res = new Response("Not found", { status: 404 })
      return res
    },
  },
  {
    port: 3000,
  }
)

console.log(`Server running on port 3000`)

/**
 * @param IncomingMessage req
 * @param ServerResponse res
 */
async function indexHandler(req) {
  // Respond with index.html
  const file = Bun.file("index.html")
  return new Response(file)
}

/**
 * @param IncomingMessage req
 * @param ServerResponse res
 */
async function saveHandler(req) {
  // read password from request url
  const password = req.password
  if (password !== PASSWORD) {
    return new Response("Unauthorized", { status: 401 })
  }

  // read request body
  const data = await req.json()
  console.log(data)

  // Expected data: { intro: "<p>x</p>", galetas: "<h2>y</h2>", hakeminen: "<h2>z</h2>", linkit: "<h2>f</h2>" }
  // Check if data contains the expected keys
  if (!data.intro || !data.galetas || !data.hakeminen || !data.linkit) {
    return new Response("Invalid data", { status: 400 })
  }

  // Read the template file and replace the placeholders with the data
  const file = Bun.file("template.html");
  const template = await file.text();
  const html = template
    .replace("{{intro}}", data.intro)
    .replace("{{galetas}}", data.galetas)
    .replace("{{hakeminen}}", data.hakeminen)
    .replace("{{linkit}}", data.linkit)

  // Write the html to a file
  const path = "index.html"
  await Bun.write(path, html)
  return new Response("Saved")
}
