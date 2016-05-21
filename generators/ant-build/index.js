'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var async = require('async');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the impeccable ' + chalk.red('generator-happy') + ' generator!'
    ));

    var subTypeAnt = [
      {name:"Base Ant build", value:'default'},
      {name:"Ant build for prestashop", value:'prestashop'},
      {name:"Ant build for prestamodule", value:'prestamodule'},
      {name:"Ant build for Symfony", value:'symfony'},
      {name:"Ant build for Haxe project", value:'haxe'},
    ];

    var subBuildProperties = [
        {name: "Local", value :'local', checked:true},
        {name: "Preprod", value :'preprod', checked:true},
        {name: "Recette", value :'recette', checked:false},
        {name: "Prod", value :'prod', checked:true},
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
      this.log(chalk.blue('\n\nOkay. I guess you use ssh for deploy in your differents environment so..'));
      this.buildproperties = [];
      this._ask_build_env(this.propertiesWanted, 0);
      //this["_ask_"+props.antChoice]();

    }.bind(this));
  },
  _ask_build_env: function(array, current) {
    var done = this.async();
    var env = array[current];
    this.log('\n\n Some questions about your ' + chalk.yellow(env));
    var prompts = [
      {
        type: 'input',
        name: 'Host',
        message:'What is host url for ' + env + ' ? ',
        default: '127.0.0.1'
      },
      {
        type: 'input',
        name: 'User',
        message:'What is user for ' + env + ' ? ',
        default: 'happy'
      },
      {
        type: 'password',
        name: 'Password',
        message:'What is password for ' + env + ' ? ',
        default: '******'
      },
      {
        type: 'input',
        name: 'ExecutionFolder',
        message:'What is remote folder for ' + env + ' ? ',
        default: '/var/www/html'
      },
    ];

    this.prompt(prompts, function (props) {
      this.buildproperties[env] = props;
      current++;
      if(array.length == current) {
        done();
      } else {
        this._ask_build_env(array, current);
      }
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
    this.fs.copy(
       this.templatePath('dummyfile.txt'),
       this.destinationPath('dummyfile.txt')
    );

    if(this.propertiesWanted.length > 0) {
      for (var i = 0; i < this.propertiesWanted.length; i++) {
        this.fs.copyTpl(
          this.templatePath('build.properties.env'),
          this.destinationPath('build.properties.'+this.propertiesWanted[i]),
          {
            env : this.propertiesWanted[i],
            envValue: this.buildproperties[this.propertiesWanted[i]],
          }
        );
      }
    }
  },

  install: function () {
    this.installDependencies();
  }
});
