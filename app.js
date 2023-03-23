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


async function openJSON(Path){
    
    let json = new XMLHttpRequest();

    json.open("GET",Path , false);
    try {
        json.send(null);
    } catch (err) {
        console.log(err)
    }

    let data = json.response;
    // data = JSON.parse(JSON.stringify(data));
    data = JSON.parse(data);
    return data;
}

async function getDatafromDate(type,value,path){
    if(type == "EnName"){
        const Data = await openCSV(path);
        for(let i = 0; i<Data.length; ++i){
            if(Data[i][0] == String(value)){
                // console.log(Data[i][1])
                return Data[i][1];
            }
        }
    }
    else if(type == "json"){
        const Data = await openJSON(path);
        return Data[value]["picPath"][1]
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
    const charaName = await getDatafromDate("EnName",rootCharacterID,"./assetData/chara.csv");
    const imgURL = "https://enka.network/ui/UI_AvatarIcon_" + charaName + ".png";
    html += "<img id=UserIcon src='" + imgURL + "'>";

    const cardID = Data[Number(Data[Number(Data[1]["showNameCardIdList"])][0])];
    const cardName = await getDatafromDate("json",cardID,"./assetData/namecards.json");
    const cardURL = "https://enka.network/ui/" + cardName +".png";
    html += "<img id=UserCard src='" + cardURL + "'>";

    html += "<img id='UserAchive_img' class='UserAchive' src='./genshin-Artifacter/ArtifacterImageGen/icon/Achievement.png'>";
    html += "<a id='UserAchive_name' class='UserAchive'>アチーブメント</a><a id='UserAchive_level' class='UserAchive'>"+Data[Number(Data[1]["finishAchievementNum"])]+"</a>";

    html += "<img id='UserTower_img' class='UserTower' src='./genshin-Artifacter/ArtifacterImageGen/icon/Tower.png'>";
    html += "<a id='UserTower_name' class='UserTower'>深境螺旋</a><a id='UserTower_level' class='UserTower'>"+Data[Number(Data[1]["towerFloorIndex"])]+"-"+Data[Number(Data[1]["towerLevelIndex"])]+"</a>";
    
    const showAvatarList = Data[Number(Data[0]["avatarInfoList"])];
    for(let i=0;i<showAvatarList.length;i++){
        console.log(Data[Data[showAvatarList[i]]["avatarId"]]);
        let CharacterID = Data[Data[showAvatarList[i]]["avatarId"]];
        let charaName = await getDatafromDate("EnName",CharacterID,"./assetData/chara.csv");
        let imgURL = "https://enka.network/ui/UI_AvatarIcon_" + charaName + ".png";
        html += "<img id='Chara"+showAvatarList[i]+ "' class='"+showAvatarList[i]+"' src='" + imgURL + "'>";
        let Level = Data[Data[Number(Data[showAvatarList[i]]["avatarId"]) -1]["level"]]
        html += "<a id='Level"+showAvatarList[i]+ "' class='"+showAvatarList[i]+"'>"+"Lv."+Level+"</a>";
    }

    document.getElementById("mainInfo").innerHTML = html;


    
    console.log()


}

main(800900921)

