var request = require('request');
var config = require('./config.json');
var fs = require('fs');
wallpaper();
setInterval(wallpaper,60*10*1000);
function wallpaper(){
    request({
        uri: config.himawari8_api,
        method: "GET",
        timeout: 20000
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var result = JSON.parse(body);
                var date = result.date;
                var year = date.substr(0,4);
                var month = date.substr(5,2);
                var day = date.substr(8,2);
                var hour = date.substr(11,2);
                var minute = date.substr(14,2);
                var second = date.substr(17,2);

                var fetchUrl= config.cdn_fetch_url+'/'+year+'/'+month+'/'+day+'/'+hour+minute+second+'_0_0.png';

                var oldFiles = [];
                fs.readdir('./image', function (err, files) {
                    if(err){
                    }else{
                        oldFiles = files;
                    }
                    request(fetchUrl).pipe(fs.createWriteStream('image/earth'+year+month+day+hour+minute+second+'.png'));
                    if(fs.existsSync('image/earth'+year+month+day+hour+minute+second+'.png')){
                        oldFiles.forEach(function(file){
                            fs.unlink('./image/'+file);
                        });
                    }
                    console.log('success:'+date);
                });
            } catch (ex) {
                console.log('result error');
            }
        }
        else {
            if(error&&error.code&&error.code=='ETIMEDOUT'){
                console.log('request timeout');
            }
            else{
                console.log('request error');
            }
        }
    });
}