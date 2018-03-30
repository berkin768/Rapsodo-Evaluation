/**
 * Check for the various File API support.
 */



var reader; //GLOBAL File Reader object for demo purpose only
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true;
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}

function getNumberOfPlayers(header) {
    header = header.filter(value => Object.keys(value).length !== 0); //TO PREVENT STRANGE ',',',',',' ERROR
    return header.length / 2
}

function drawPlayer(array) {
    for (var i = 0; i < array.length; i++) {
        var table = document.createElement("table");
        table.className = 'table'

        var header = table.createTHead()
        table.setAttribute("id", "player" + (i+1));
        document.body.appendChild(table);

        var row = header.insertRow(0)

        Object.keys(array[i][1]).forEach(function(v) {
            var cell = document.createElement("th");
            row.appendChild(cell);
            var text = ''

            switch(v){
                case 'position':
                text = 'Position'
                break;
                case 'total_shots':
                text = 'Number of Shots'
                break;
                case 'successful_shots':
                text = 'Successful Shots'
                break;
                case 'success_rate':
                text = 'Success Rate'
                break;
            }
            cell.innerHTML = text;
          });
        var tbody = table.createTBody()
        
        for (var j = 1; j < array[i].length; j++) {
            var row = document.createElement("tr");
            tbody.appendChild(row)

            var position = array[i][j].position
            var total_shots =  array[i][j].total_shots
            var successful_shots = array[i][j].successful_shots
            var success_rate = array[i][j].success_rate

            var position_cell = document.createElement("td");
            var total_shots_cell = document.createElement("td");
            var successful_shots_cell = document.createElement("td");
            var success_rate_cell = document.createElement("td");
            position_cell.innerHTML= position
            total_shots_cell.innerHTML = total_shots
            successful_shots_cell.innerHTML= successful_shots
            success_rate_cell.innerHTML = '%' + success_rate.toFixed(2)

            row.appendChild(position_cell);
            row.appendChild(total_shots_cell);
            row.appendChild(successful_shots_cell);
            row.appendChild(success_rate_cell);
        }
    }
}

/**
 * read text input
 */
function readText(filePath) {
    var output = ""; //placeholder for text output
    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            var allTextLines = output.split(/\r\n|\r|\n/);

            var numberOfPlayers = getNumberOfPlayers(allTextLines[1].split(','))
            var playerArray = new Array(numberOfPlayers)

            for (var i = 3; i < allTextLines.length; i++) {
                var line = allTextLines[i].split(',').filter(value => Object.keys(value).length !== 0);
                var indice = 0

                for (var j = 0; j < line.length; j += 2) {
                    var position = line[j]
                    var positionValue = parseInt(line[j + 1])

                    //Initialize 
                    if (typeof playerArray[indice] === 'undefined') {
                        playerArray[indice] = []
                    }

                    if (typeof playerArray[indice][position] === 'undefined') {
                        playerArray[indice][position] = {
                            region: 0,
                            total_shots: 0,
                            successful_shots: 0
                        }
                    }

                    var total_shots = playerArray[indice][position].total_shots
                    var successful_shots = playerArray[indice][position].successful_shots
                    var rate = successful_shots / total_shots * 100

                    playerArray[indice][position] = {
                        position: position,
                        total_shots: total_shots + 1,
                        successful_shots: successful_shots + positionValue,
                        success_rate : rate
                    }

                    indice++
                }
            }
            drawPlayer(playerArray)
            //console.log(playerArray)
            //displayContents(output);
        }; //end onload()
        reader.readAsText(filePath.files[0]);
    } //end if html5 filelist support
    else if (ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            //displayContents(output);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                    'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                    'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    } else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
    return true;
}

/**
 * display content using a basic HTML replacement
 */
/*function displayContents(txt) {
    var el = document.getElementById('main'); 
    el.innerHTML = txt; //display output in DOM
}   */