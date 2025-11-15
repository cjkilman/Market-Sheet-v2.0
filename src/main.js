function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Sheet Tools')
      .addItem('Refresh All Data','refreshData')
      .addItem('Update SDE Data', 'importSDE')
      .addToUi();
}

function importSDE()
{

    // Display an alert box with a title, message, input field, and "Yes" and "No" buttons. The
    // user can also close the dialog by clicking the close button in its title bar.
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Updating the SDE', 
        'Updating the SDE may take a few minutes. In the meantime do not close the window otherwise you will have to restart. Continue?',
        ui.ButtonSet.YES_NO);
        
    // Process the user's response.
    if (response == ui.Button.YES) {
          // Lock Formulas from running
      const haltFormulas = [[0,0]];
      var thisSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
      var loadingHelper= thisSpreadSheet.getRangeByName("'Utility'!B3:C3");
      const  backupSettings = loadingHelper.getValues();
      loadingHelper.setValues(haltFormulas);
      try{
                const sdePages = [
                    new SdePage(
                    "SDE_invTypes",
                    "invTypes.csv",
                      // Optional headers,  
                      // invTypes is 100+ megabytes. Select columns needed to help it load faster. 
                      [ "typeID","groupID","typeName","volume","marketGroupID",	"variationparentTypeID"]
                      ) /**
                      new SdePage (
                        "SDE_invGroups",
                        "invGroups.csv",
                        ["groupID",	"categoryID",	"groupName"	,"published"]
                      ),
                      new SdePage (
                        "SDE_invCategories",
                        "invCategories.csv",
                        ["categoryID"	, "categoryName"	,	"published"]
                      )*/
                  ];
                  sdePages.forEach(buildSDEs);
            }
      finally{
        // release lock
        loadingHelper.setValues(backupSettings);
      }
    } else if (response == ui.Button.NO) {
        ui.alert('SDE unchanged.');
    } else {
        ui.alert('SDE unchanged.');
    }
  }

  
/**
 * Enhances Google Sheets' native "query" method.  Allows you to specify column-names instead of using the column letters in the SQL statement (no spaces allowed in identifiers)
 * 
 * Sample : =query(data!A1:I,SQL("data!A1:I1","SELECT Owner-Name,Owner-Email,Type,Account-Name",false),true)
 *  
 * Params : useColNums (boolean) : false/default = generate "SELECT A, B, C" syntax 
 *                                 true = generate "SELECT Col1, Col2, Col3" syntax
 * reference: https://productforums.google.com/forum/#!topic/docs/vTgy3hgj4M4
 * by: Matthew Quinlan
 */
function sqlFromHeaderNames(rangeName, queryString, useColNums){
 
  let ss = SpreadsheetApp.getActiveSpreadsheet();

  let range;
  try{
    range = ss.getRange(rangeName);
  }
  catch(e){
    range = ss.getRangeByName(rangeName);
  }

  let headers = range.getValues()[0];
  
  for (var i=0; i<headers.length; i++) {
    if (headers[i].length < 1) continue;
    var re = new RegExp("\\b"+headers[i]+"\\b","gm");
    if (useColNums) {
      var columnName="Col"+Math.floor(i+1);
      queryString = queryString.replace(re,columnName);
    }
    else {
      var columnLetter=range.getCell(1,i+1).getA1Notation().split(/[0-9]/)[0];
      queryString = queryString.replace(re,columnLetter);
    }
  }
  //Logger.log(queryString);
  return queryString;
}