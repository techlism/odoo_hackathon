import { readFileSync, writeFileSync } from 'fs';
import CryptoJS from 'crypto-js';

function decryptFile(inputPath, outputPath, key) {
    // Read the encrypted file content
    const encryptedContent = readFileSync(inputPath, 'utf8');
    
    // Decrypt the content
    const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
    const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);
    
    // Convert the decrypted content back to a buffer
    const fileBuffer = Buffer.from(decryptedContent, 'base64');
    
    // Write the decrypted buffer to a new file
    writeFileSync(outputPath, fileBuffer);
    
    console.log('File decrypted successfully!');
}

const key = 'my-secret-key';
decryptFile('encrypted.pdf.enc', 'decrypted.pdf', key);
