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

function isDouble(value){
    return (value === +value && value !== (value | 0))
}

function drawPlayer(array) {
    console.log(array)
    for (var i = 0; i < array.length; i++) {

        var tag = document.createElement('h4')
        tag.innerHTML = 'Player ' + (i + 1)
        tag.setAttribute('style', 'text-align:center')
        document.body.appendChild(tag);

        var table = document.createElement("table");
        table.className = 'table'
        table.setAttribute("id", "player" + (i + 1));

        var header = table.createTHead()
        document.body.appendChild(table);


        var row = header.insertRow(0)
        Object.keys(array[i][1]).forEach(function (v) {
            var cell = document.createElement("th");
            row.appendChild(cell);
            var text = ''

            switch (v) {
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

            Object.values(array[i][j]).forEach(function (value) {
                var cell = document.createElement("td")
                cell.innerHTML = isDouble(value)? '%' + value.toFixed(2) : value //to recognize float and make it 2 number after ,
                row.appendChild(cell)
            });
        }
    }
}

/**
 * read text input
 */
function readText(filePath) {
    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            var output = e.target.result;
            var allTextLines = output.split(/\r\n|\r|\n/);

            var numberOfPlayers = getNumberOfPlayers(allTextLines[1].split(','))
            var playerArray = new Array(numberOfPlayers)

            //first 3 lines are empty or header, thats why this loop starts from 3
            for (var i = 3; i < allTextLines.length; i++) {
                var line = allTextLines[i].split(',').filter(value => Object.keys(value).length !== 0); //filter operation to remove empty commas from the line. Ex 1,1,1,,,,,,,,,
                var index = 0

                for (var j = 0; j < line.length; j += 2) {
                    var position = line[j]
                    var positionValue = parseInt(line[j + 1])

                    //Initialize player
                    if (typeof playerArray[index] === 'undefined') {
                        playerArray[index] = []
                    }

                    //Initialize shot
                    if (typeof playerArray[index][position] === 'undefined') {
                        playerArray[index][position] = {
                            region: 0,
                            total_shots: 0,
                            successful_shots: 0
                        }
                    }

                    var total_shots = playerArray[index][position].total_shots + 1
                    var successful_shots = playerArray[index][position].successful_shots + positionValue
                    var rate = successful_shots / total_shots * 100

                    playerArray[index][position] = {
                        position: position,
                        total_shots: total_shots,
                        successful_shots: successful_shots,
                        success_rate: rate
                    }

                    index++
                }
            }
            drawPlayer(playerArray)
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

document.addEventListener('DOMContentLoaded', function () {
    function onClickPDF() {
        var pdf = new jsPDF('p', 'pt', 'a4');
        pdf.canvas.height = 72 * 11;
        pdf.canvas.width = 72 * 8.5;

        pdf.fromHTML(document.body);

        pdf.save('output.pdf');
    };

    var element = document.getElementById("clickbind");
    element.addEventListener("click", onClickPDF)
});