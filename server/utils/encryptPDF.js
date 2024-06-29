import fs from 'fs';
import CryptoJS from 'crypto-js';

// inputBytes : uint8Array , key : string
function encryptFile(inputBytes, key) {
    // Read the PDF file as a binary buffer
    
    // Convert the buffer to a string of bytes
    const fileContent = fileBuffer.toString('base64');
    
    // Encrypt the file content
    const encryptedContent = CryptoJS.AES.encrypt(fileContent, key).toString();
    
    // Write the encrypted content to a new file
    fs.writeFileSync(outputPath, encryptedContent);
    
    console.log('File encrypted successfully!');
}

const key = 'my-secret-key';
encryptFile('KUNDAN.pdf', 'encrypted.pdf.enc', key);
