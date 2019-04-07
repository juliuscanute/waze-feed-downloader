document.getElementById("start_download").addEventListener("click", download);
let resp = '';
let wDDTotalDrives = 0;
let wDDDrivesDataArr = null;

function download() {
    wDDLoadData(0)
}

function init() {
    if(wDDDrivesDataArr == null) {
        wDDDrivesDataArr = new Array(wDDTotalDrives);
    }
}

function wDDLoadData(offset) {
    const xhr = new XMLHttpRequest();
    const params = "minDistance=1000&count=50&offset=" + offset;
    xhr.open("GET", "https://www.waze.com/Descartes-live/app/Archive/List?" + params, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            resp = JSON.parse(xhr.responseText);
            wDDTotalDrives = resp.archives.totalSessions;
            init();
            let i;
            console.log('length:'+resp.archives.objects.length);
            for (i = 0; i < resp.archives.objects.length; i++) {
                wDDDrivesDataArr[i + offset] = resp.archives.objects[i]
                console.log(wDDDrivesDataArr[i]);
            }
            if (offset + 50 >= wDDTotalDrives) {
                let a = document.createElement('a');
                let response = "userId,totalRoadMeters,startTime,endTime\n";
                for (i = 0; i < wDDTotalDrives; i++) {
                    response += wDDDrivesDataArr[i].userID+","+wDDDrivesDataArr[i].totalRoadMeters
                        +","+moment(wDDDrivesDataArr[i].startTime).format('LLL')+","+moment(wDDDrivesDataArr[i].endTime).format('LLL')+"\n";
                }
                const blob = new Blob([response], {type: 'text/csv'});
                a.href = window.URL.createObjectURL(blob);
                a.download = 'feeds';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                delete a;
            } else {
                wDDLoadData(offset + 50);
            }
        }
    }
    xhr.send();
}