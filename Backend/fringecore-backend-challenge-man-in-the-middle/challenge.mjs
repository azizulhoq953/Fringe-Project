import fs from 'fs';
const DUMP_FILE = "dump.json";
const OUTPUT_FILE = "decrypted.json";
function xorDecrypt(data, key) {
    const decrypted = [];
    for (let i = 0; i < data.length; i++) {
        decrypted.push(data[i] ^ key[i % key.length]);
    }
    return Buffer.from(decrypted);
}

function base64Decode(base64String) {
    return Buffer.from(base64String, 'base64');
}
function reconstructMessage(groups) {
    groups.sort((a, b) => a[0] - b[0]);
    return groups.map(group => group.slice(1).toString('utf-8')).join('');
}
function decryptMessage(encryptedMessage, key) {
    const decodedMessage = base64Decode(encryptedMessage);
    let blocks = [];
    for (let i = 0; i < decodedMessage.length; i += 8) {
        blocks.push(decodedMessage.slice(i, i + 8));
    }

    const groups = [];
    for (let block of blocks) {
        const indexByte = block[0];
        const data = block.slice(1); 
        const decryptedData = xorDecrypt(data, key);
        groups.push([indexByte, decryptedData]);
    }


    return reconstructMessage(groups);
}

function decryptMessages() {

    const dump = JSON.parse(fs.readFileSync(DUMP_FILE, 'utf-8'));

    const key = new Uint8Array(8); 
    const decryptedMessages = [];

    for (let encryptedMessage of dump) {
        const decryptedMessage = decryptMessage(encryptedMessage, key);
        decryptedMessages.push(decryptedMessage);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(decryptedMessages, null, 2));
}
decryptMessages();


