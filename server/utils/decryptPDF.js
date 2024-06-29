import crypto from 'crypto';
import fs from 'fs';

const algorithm = 'aes-256-ctr';

const decryptFile = (inputPath, outputPath, password) => {
  const encrypted = fs.readFileSync(inputPath);
  const decipher = crypto.createDecipher(algorithm, password);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  fs.writeFileSync(outputPath, decrypted);
};

export default decryptFile;
