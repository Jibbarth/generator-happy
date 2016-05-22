'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');


module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the impeccable ' + chalk.red('generator-happy') + ' generator!'
    ));

    var subTypeAnt = [
      {name:"Ant build for prestashop", value:'prestashop'},
      {name:"Ant build for prestamodule", value:'prestamodule'},
      {name:"Ant build for Symfony", value:'symfony'},
      {name:"Ant build for Haxe project", value:'haxe'},
    ];

    var subBuildProperties = [
        {name: "Local", value :'local', checked:true},
        {name: "Preprod", value :'preprod', checked:true},
        {name: "Prod", value :'prod', checked:false},
    ]
    var prompts = [{
        type: 'list',
        name: 'antChoice',
        message:'What kind of build.xml you want',
        default: 0,
        choices: subTypeAnt,
    },
    {
        type:'checkbox',
        name:'buildproperties',
        message: 'What kind of build.properties do you want ?',
        choices: subBuildProperties,
    }
    ];

    this.prompt(prompts, function (props) {
      this.antType = props.antChoice;
      this.propertiesWanted = props.buildproperties;
      this.log(props.buildproperties);
      this["_ask_"+props.antChoice]();
      //this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  _ask_prestashop: function(){
    this.log("Let's go for prestashop ant build");
  },
  _ask_prestamodule: function(){
    this.log("Let's go for prestashop module ant build");

  },
  _ask_symfony: function(){
    this.log("Let's go for symfony ant build");

  },
  _ask_haxe:function(){
    this.log("Let's go for haxe ant build");
  },
  writing: function () {
    // this.fs.copy(
    //   this.templatePath('dummyfile.txt'),
    //   this.destinationPath('dummyfile.txt')
    // );
  },

  install: function () {
    this.installDependencies();
  }
});
