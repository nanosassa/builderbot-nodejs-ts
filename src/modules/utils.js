import fs  from 'fs';
import path from 'path';


const cleanTempFiles = async (directory) => {
    try {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
            files.forEach(file => {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            });
          });
        
    } catch (err) {
        console.error('Error cleaning temporary files:', err);
    }
};

export default cleanTempFiles;