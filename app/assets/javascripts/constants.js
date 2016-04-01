var CHART_TYPES = {
  cholesterol: function(){
    return new DVE.Graph.Cholesterol(this);
  }.bind(this),
  vitamin_d: function(){
    return new DVE.Graph.VitaminD(this);
  }.bind(this),
  tsh:function(){
    return new DVE.Graph.TSH(this);
  }.bind(this),
  white_cell:function(){
    return new DVE.Graph.WhiteCell(this);
  }.bind(this),
  vitamin_b12:function(){
    return new DVE.Graph.VitaminB12(this);
  }.bind(this),
  viral_load:function(){
    return new DVE.Graph.ViralLoad(this);
  }.bind(this),
  testosterone:function(){
    return new DVE.Graph.Testosterone(this);
  }.bind(this),
  red_cell:function(){
    return new DVE.Graph.RedCell(this);
  }.bind(this),
  mercury:function(){
    return new DVE.Graph.Mercury(this);
  }.bind(this),
  iron:function(){
    return new DVE.Graph.Iron(this);
  }.bind(this),
  hemoglobin_a1c:function(){
    return new DVE.Graph.HemoglobinA1C(this);
  }.bind(this),
  folate:function(){
    return new DVE.Graph.Folate(this);
  }.bind(this),
  ferritin:function(){
    return new DVE.Graph.Ferritin(this);
  }.bind(this),
  copper:function(){
    return new DVE.Graph.Copper(this);
  }.bind(this),
  calcium:function(){
    return new DVE.Graph.Calcium(this);
  }.bind(this),
  alt:function(){
    return new DVE.Graph.ALT(this);
  }.bind(this),
  afp:function(){
    return new DVE.Graph.AFP(this);
  }.bind(this),
  insulin:function(){
    return new DVE.Graph.Insulin(this);
  }.bind(this),
  uric_acid:function(){
    return new DVE.Graph.UricAcid(this);
  }.bind(this),
  creatine:function(){
    return new DVE.Graph.Creatine(this);
  }.bind(this),
  systolic_blood_pressure:function(){
    return new DVE.Graph.SystolicBloodPressure(this);
  }.bind(this),
  diastolic_blood_pressure:function(){
    return new DVE.Graph.DiastolicBloodPressure(this);
  }.bind(this),
};

console.log("hello", CHART_TYPES)
