// https://gist.github.com/mrkrndvs/a2c8ff518b16e9188338cb809e06ccf1

const csv = "Titel\tKosten\tMonate\tJahre\n" +
"Handy\t7\t1-12\t2022\n" +
    "Miete\t350\t1-12\t2021-2022\n" +
    "Miete2\t350\t6\t2022\n" +
"Rundfunk\t55\t1;5;8;11\t2021;2022";
main();

function calcBudgetbook() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var s0 = ss.getSheetByName('Eingabebereich');


}

function main() {
    // get raw data
    var data = csvToArr(csv, '\t');
    data = compileData(data);
    data = atomiseData(data);
    saveAsJson(data);
}

function compileData(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].Kosten = parseInt(data[i].Kosten);
        data[i].Monate = numberGroupsToSingleNumbers(data[i].Monate);
        data[i].Jahre = numberGroupsToSingleNumbers(data[i].Jahre);
    }
    return data;
}

function atomiseData (data) {
    var singularity = [];
    for (let i = 0; i < data.length; i++) {
        let title = data[i].Titel;
        let kosten = data[i].Kosten;

        for (let j = 0; j < data[i].Jahre.length; j++) {
            let year = data[i].Jahre[j];

            for (let k = 0; k < data[i].Monate.length; k++) {
                let month = data[i].Monate[k];
                singularity.push(
                    {
                        "Titel": title,
                        "Kosten": kosten,
                        "Monat": month,
                        "Jahr": year,
                    }
                );
            }
        }
    }
    return singularity;
}


function numberGroupsToSingleNumbers(stringGroups) {
    // split ';'
    if (stringGroups.includes(';')) {
        var tmp = stringGroups.toString().split(';');
    } else {
        var tmp = [stringGroups];
    }

    // check substrings
    var res = [];
    for (let i = 0; i < tmp.length; i++) {
        // split '-'
        if (tmp[i].includes('-')) {
            // use result as min, max
            let intervall = tmp[i].split('-');
            if (intervall.length !== 2) {
                throw 'intervall error: ' + tmp[i].toString();
            } else {
                // add natural numbers
                var min = parseInt(intervall[0]);
                var max = parseInt(intervall[1]);
                var arr = Array.from({length: max-min+1}, (_, i) => i + min);
                res = res.concat(arr);
            }


        } else {
            res.push(parseInt(tmp[i]));
        }
    }
    return res
}


function csvToArr(stringVal, splitter) {
    const [keys, ...rest] = stringVal
        .trim()
        .split("\n")
        .map((item) => item.split(splitter));

    const formedArr = rest.map((item) => {
        const object = {}
        keys.forEach((key, index) => (object[key] = item.at(index)));
        return object;
    });
    return formedArr;
}


function saveAsJson(data) {
    var dictstring = JSON.stringify(data, null, 1);
    var fs = require('fs');
    fs.writeFile("thing.json", dictstring,  function(err, result) {
        if(err) console.log('error', err);
    });
}