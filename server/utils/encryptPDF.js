import crypto from 'crypto';
import fs from 'fs';

const algorithm = 'aes-256-ctr';

const encryptFile = (buffer, outputPath, password) => {
  const cipher = crypto.createCipher(algorithm, password);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  
  fs.writeFileSync(outputPath, encrypted);
};

export default encryptFile;
