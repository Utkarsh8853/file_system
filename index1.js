const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(bodyParser.json());

// file uploading
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploads');
        },
        filename: function(req, file, cb){
            cb(null,`file${file.fieldname}.txt`)
        }
    })
} ).any();

app.post("/upload",upload, (req, res) => {
    res.send("file uploaded")
});

// file merge from upload folder and copy as new file in backup folder
app.post("/merge", (req, res) => {
    const { f1, f2} =req.body;
    const path1 = "/home/appinventiv/Desktop/file_system/uploads/"+f1;
    const path2 = "/home/appinventiv/Desktop/file_system/uploads/"+f2;
    const f3 = `abc_${Date.now()}.txt`
    const path3 = "/home/appinventiv/Desktop/file_system/backup/"+f3;
    fs.readFile(path1, 'utf8', (err, data1) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Data 1 copied")
        fs.writeFile(path3,data1,(err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    });
    fs.readFile(path2, 'utf8', (err, data2) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Data 2 copied")
        fs.appendFile(path3,data2,(err) => {
            if (err) {
                console.error(err);
                return;
            }
        })
    });
    res.send("Merged data saved in  backup")
});

// file read from backup folder
app.post('/read', (req,res) => {
    const { f1 } =req.body;
    const path1 = "/home/appinventiv/Desktop/file_system/backup/"+f1;
    fs.readFile(path1, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Data read");
        res.send(data);
    });
})

// file delete from upload folder
app.delete('/delete', (req,res) => {
    const { f1 } =req.body;
    const path1 = "/home/appinventiv/Desktop/file_system/uploads/"+f1;
    fs.unlink(path1, (data) => {
        console.log("File deleted");
        res.send(data);
    });
    res.status(200).send("File ")
})

app.listen(3000);