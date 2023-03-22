async function getDatafromUID(UID){
    const url = "https://enka.network/u/" + String(UID) + "/__data.json";
    const response = await fetch(url);
    const json = await response.json();
    return json["nodes"][1]["data"];
}

async function openCSV(Path){
    
    let csvData = [];
    let csv = new XMLHttpRequest();

    csv.open("GET",Path , false);
    try {
        csv.send(null);
    } catch (err) {
        console.log(err)
    }
    let lines = csv.responseText.split(/\r\n|\n/);
    
    // 1行ごとに処理
    for (let i = 0; i < lines.length; ++i) {
    let cells = lines[i].split(",");
        if (cells.length != 1) {
            csvData.push(cells);
        }
    }
    return csvData;
}

async function getDatafromDate(value,path){
    const Data = await openCSV(path);
    for(let i = 0; i<Data.length; ++i){
        if(Data[i][0] == String(value)){
            // console.log(Data[i][1])
            return Data[i][1]
        }
    }
}

async function main(UID){
    const Data = await getDatafromUID(UID);
    console.log(Data);
    let html = "";
    html += "<a id='UID'>UID "+Data[Number(Data[0]["uid"])]+"</a>";
    html += "<p id='UserName'>"+Data[Number(Data[1]["nickname"])]+"</p>";
    html += "<a id='UserLeve_name' class='UserLeve'>冒険者ランク</a><a id='UserLevel_level' class='UserLeve'>"+Data[Number(Data[1]["level"])]+"</a>";
    html += "<a id='WorldLeve_name' class='WorldLeve'>世界ランク</a><a id='WorldLevel_level' class='WorldLeve'>"+Data[Number(Data[1]["worldLevel"])]+"</a>";
    html += "<p id='signature'>"+Data[Number(Data[1]["signature"])]+"</p>";

    const rootCharacterID = Data[Number(Data[Number(Data[1]["profilePicture"])]["avatarId"])];
    const charaName = await getDatafromDate(rootCharacterID,"./assetData/chara.csv");
    console.log(charaName)
    const imgURL = "https://enka.network/ui/UI_AvatarIcon_" + charaName + ".png";
    html += "<img src='" + imgURL + "'>";
    document.getElementById("mainInfo").innerHTML = html;

}

main(800900921)

