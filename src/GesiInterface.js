function testCorperationCharacter()
{
  let chars =
  [
    2114310112,
623255969,
2114499079,
2118842760,
2115473962,
2114897959,
2114912876,
2114191507,
2118655001,
2118624953,
2114897747,
786956700
  ];
  getChacterNameFromID(chars,false);
}

/**
 *Get Character Names from thier ID
 *
 * @param {*} charIds
 * @return {*} 
 */
function getChacterNameFromID(charIds,show_column_headings=true)
{
    if(!charIds)throw "undefined charIds";
    if(!Array.isArray(charIds)) charIds=[charIds];
    charIds = charIds.filter(Number) ;

    let chars=[];
    if(show_column_headings) chars = chars.concat("Character Name");
    const rowIdx =  show_column_headings ? 1:0;

    for(I=0;I<charIds.length;I++)
    {
        const char = GESI.characters_character(Number(charIds[I]),show_column_headings);
        chars = chars.concat(char[rowIdx][7]);
    }
    Logger.log(chars);
    return chars;
}