const fs = require('fs');

function uploadFile(stream, conn, args, host) {
  conn.sftp((err, sftp) => {
    if (err) {
      console.error(err);
      stream.write('\n');
      return err;
    }

    // example: /tmp
    const uploadPath = process.env.UPLOAD_PATH || '/';

    sftp.realpath(uploadPath, (err, absPath) => {
      if (err) {
        console.error(err);
        stream.write('\n');
        return err;
      }

      const paths = args[1].split('/');
      const fileName = paths[paths.length - 1];

      const moveFrom = args[1];
      const moveTo = absPath + '/' + fileName;

      const readStream = fs.createReadStream(moveFrom);
      const writeStream = sftp.createWriteStream(moveTo);
  
      console.log(`Uploading 127.0.0.1:${moveFrom} from to ${host}:${moveTo}`);
      readStream.pipe(writeStream);

      writeStream.on('close', () => {
        process.stdout.write("File is uploaded succesfully");
        stream.write('\n');
      });
  
      writeStream.on('end', () => {
        conn.close();
      });
    });
  });
}

module.exports = uploadFile;
