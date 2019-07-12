function downloadFile(stream, conn, args, host) {
  conn.sftp((err, sftp) => {
    if (err) {
      console.error(err);
      stream.write('\n');
      return err;
    }
    
    var moveFrom = args[1];
    var moveTo = `${process.cwd()}/${args[1]}`;

    console.log(`Downloading ${host}:/${moveFrom} from to 127.0.0.1:${moveTo}`);
    sftp.fastGet(moveFrom, moveTo, {}, err => {
        if (err) {
          console.error(err);
          stream.write('\n');
          return err;
        }

        process.stdout.write("File is downloaded successfully");
        stream.write('\n');
    });
  });
}

module.exports = downloadFile;
