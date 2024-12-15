// ALL YOUR CODE SHOULD BE HERE
// DO NOT EDIT THE OTHER FILES

import net from "node:net";

const originalServerPort = 3032; // Port of the original server
const proxyServerPort = 3031;   // Port of the proxy server
const secretPhrase = " i like big trains and i cant lie ";
const hiddenPhrase = secretPhrase.replace(/[a-z]/g, "-");

// Start the proxy server
const proxyServer = net.createServer((clientConn) => {
  console.log("Client connected to the proxy server.");

  // Connect to the original server
  const originalConn = net.createConnection(originalServerPort, "localhost", () => {
    console.log("Connected to the original server.");
  });

  let buffer = "";

  // Pipe data from client to the original server
  clientConn.on("data", (data) => {
    originalConn.write(data);
  });

  // Handle data from the original server
  originalConn.on("data", (data) => {
    buffer += data.toString("utf-8");

    // Process data line by line to replace the secret phrase
    const lines = buffer.split("\n");
    let output = "";

    // Process each line separately
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(
        new RegExp(`\\b${secretPhrase}\\b`, 'g'), 
        hiddenPhrase
      );
      output += line + "\n"; // Add the modified line to the output
    }

    // Send the modified data to the client
    clientConn.write(output);

    // Keep the remainder of the data in the buffer if it doesn't end with a newline
    buffer = lines[lines.length - 1].endsWith("\n") ? "" : lines[lines.length - 1];
  });

  // Handle connection close for client and original server
  clientConn.on("end", () => {
    console.log("Client disconnected.");
    originalConn.end();
  });

  originalConn.on("end", () => {
    console.log("Disconnected from the original server.");
    clientConn.end();
  });

  // Handle errors for client and original server connections
  clientConn.on("error", (err) => {
    console.error("Client connection error:", err);
    originalConn.destroy();
  });

  originalConn.on("error", (err) => {
    console.error("Original server connection error:", err);
    clientConn.destroy();
  });
});

proxyServer.listen(proxyServerPort, () => {
  console.log(`Proxy server started on port ${proxyServerPort}`);
});
