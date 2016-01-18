//
//  converter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//



function DataConverter(nodeId) {

  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------

  this.nodeId                 = nodeId;
  // this.node                   = $("#"+nodeId);
  this.node                   = $("#"+nodeId);

  this.outputDataTypes        = [
                                {"text":"Actionscript",           "id":"as",               "notes":""},
                                {"text":"ASP/VBScript",           "id":"asp",              "notes":""},
                                {"text":"HTML",                   "id":"html",             "notes":""},
                                {"text":"JSON - Properties",      "id":"json",             "notes":""},
                                {"text":"JSON - Column Arrays",   "id":"jsonArrayCols",    "notes":""},
                                {"text":"JSON - Row Arrays",      "id":"jsonArrayRows",    "notes":""},
                                {"text":"JSON - Dictionary",      "id":"jsonDict",         "notes":""},
                                {"text":"MySQL",                  "id":"mysql",            "notes":""},
                                {"text":"PHP",                    "id":"php",              "notes":""},
                                {"text":"Python - Dict",          "id":"python",           "notes":""},
                                {"text":"Ruby",                   "id":"ruby",             "notes":""},
                                {"text":"XML - Properties",       "id":"xmlProperties",    "notes":""},
                                {"text":"XML - Nodes",            "id":"xml",              "notes":""},
                                {"text":"XML - Illustrator",      "id":"xmlIllustrator",   "notes":""}];
  this.outputDataType         = "html";

  this.columnDelimiter        = "\t";
  this.rowDelimiter           = "\n";

  this.inputTextArea          = {};
  this.outputTextArea         = {};

  this.inputHeader            = {};
  this.outputHeader           = {};
  this.dataSelect             = {};

  this.inputText              = "";
  this.outputText             = "";

  this.newLine                = "\n";
  this.indent                 = "  ";

  this.commentLine            = "//";
  this.commentLineEnd         = "";
  // this.tableName              = "MrDataConverter"
  this.tableName              = "PrivateMedical"

  this.useUnderscores         = true;
  this.headersProvided        = true;
  this.downcaseHeaders        = true;
  this.upcaseHeaders          = false;
  this.includeWhiteSpace      = true;
  this.useTabsForIndent       = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(w,h) {
  var self = this;

  //build HTML for converter
  // this.inputHeader = $('<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Input CSV or tab-delimited data. <span class="subhead"> Using Excel? Simply copy and paste. No data on hand? <a href="#" id="insertSample">Use sample</a></span></p></div>');
  this.inputHeader = '';
  this.inputTextArea = $('<textarea class="textInputs" id="dataInput"></textarea>');
  // var outputHeaderText = '<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Output as <select name="Data Types" id="dataSelector" >';
  // var outputHeaderText = '<p class="groupHeadline">Your data will be translated here:</p>';
  var outputHeaderText = '';
    // for (var i=0; i < this.outputDataTypes.length; i++) {

    //   outputHeaderText += '<option value="'+this.outputDataTypes[i]["id"]+'" '
    //           + (this.outputDataTypes[i]["id"] == this.outputDataType ? 'selected="selected"' : '')
    //           + '>'
    //           + this.outputDataTypes[i]["text"]+'</option>';
    // };
    // outputHeaderText += '</select><span class="subhead" id="outputNotes"></span></p></div>';
  this.outputHeader = $(outputHeaderText);
  // this.outputTextArea = $('<textarea class="textInputs" id="dataOutput"></textarea>');
  this.outputTextArea = $('<div class="textInputs hide" id="dataOutput"></div>');

  this.node.append(this.inputHeader);
  this.node.append(this.inputTextArea);
  this.node.append(this.outputHeader);
  this.node.append(this.outputTextArea);

  this.dataSelect = this.outputHeader.find("#dataSelector");


  //add event listeners

  // $("#convertButton").bind('click',function(evt){
  //   evt.preventDefault();
  //   self.convert();
  // });

  this.outputTextArea.click(function(evt){this.select();});

  function setPasted(){
    // $('.cholesterol-data').toggleClass('hide');
    $('.manual-mode').addClass('hide');
    $('.start-over-mode').removeClass('hide');
    $('input[type=date].pasted').each(function(k,v){
      var date = $(this).attr("date");
      $(this).attr("placeholder", date);
      $(this).val(date);
    });
    $('input[type=text].pasted').each(function(k,v){
      var value = $(this).attr("placeholder");
      $(this).val(value);
    });


  }

  $("#insertSample").bind('click',function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    _gaq.push(['_trackEvent', 'SampleData','InsertGeneric']);
  });

  // $("#dataInput").keyup(function() {
  //   self.convert();
  //   setPasted();
  // });

  $("#dataInput").on('input', function() {
    self.convert();
    setPasted();
    _gaq.push(['_trackEvent', 'DataType',self.outputDataType]);
  });

  $("#dataSelector").bind('change',function(evt){
       self.outputDataType = $(this).val();
       self.convert();
     });

  this.resize(w,h);
}

DataConverter.prototype.resize = function(w,h) {

  var paneWidth = w;
  // var paneHeight = (h-90)/2-20;
  // var paneHeight = 150;

  this.node.css({width:paneWidth});
  this.inputTextArea.css({width:paneWidth-20});
  this.outputTextArea.css({width: paneWidth-20});

}

DataConverter.prototype.convert = function() {

  this.inputText = this.inputTextArea.val();
  this.outputText = "";


  //make sure there is input data before converting...
  if (this.inputText.length > 0) {

    if (this.includeWhiteSpace) {
      this.newLine = "\n";
      // console.log("yes")
    } else {
      this.indent = "";
      this.newLine = "";
      // console.log("no")
    }

    CSVParser.resetLog();
    this.headersProvided = false;
    this.downcaseHeaders = false;
    this.upcaseHeaders = false;
    var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);
    parseOutput.headerNames = ['#', 'Date', 'LDL', 'HDL', 'Triglycerides', 'Cholesterol'];
    // console.log(parseOutput.headerNames);
    var dataGrid = parseOutput.dataGrid;
    var headerNames = parseOutput.headerNames;
    var headerTypes = parseOutput.headerTypes;
    var errors = parseOutput.errors;
    var inputNames = ['date', 'ldl', 'hdl', 'triglycerides', 'cholesterol'];

    this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine, inputNames);

    this.inputTextArea.css('display', 'none');
    $('.copy-paste-input .table.cholesterol-data').css('display', 'none');
    // $('.add-row').removeClass('hide');
    this.outputTextArea.html(errors + this.outputText).toggleClass('hide');
    // this.outputTextArea.parent().html(errors + this.outputText);

  }; //end test for existence of input text
}


DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("#\tDate\tLDL\tHDL\tTriglycerides\n1\tSep. 25, 2009\t90\t69\t60\n2\tSep. 27, 2009\t98\t71\t62\n3\tSep. 29, 2009\t93\t59\t69\n4\tSep. 30, 2009\t99\t68\t58");
}

