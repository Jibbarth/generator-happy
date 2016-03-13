'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the laudable ' + chalk.red('generator-happy') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'moduleName',
      message:'Your prestashop module name',
      default: this.appname
    },
    {
      type: 'input',
      name: 'moduleDesc',
      message:'Your prestashop module description',
    },
    {
      type: 'input',
      name: 'author',
      message:'Your author name',
    },
    {
      type: 'confirm',
      name:"createClass",
      message:"Do you want some class ?",
      default: false,
    }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.moduleName;
      this.ModuleNameClass = _s.classify(this.props.moduleName);
      this.modulenameLower = this.ModuleNameClass.toLowerCase();
      this.classes = [];
      if(this.props.createClass) {
        this._askClasses();
      } else {
        done();
      }
    }.bind(this));
  },
  _askForClass: function(){
    var done = this.async();
    var prompt = [{
      type:'confirm',
      name: 'otherClass',
      message:'Do you want add another class ?',
      default: false,
    }];
    this.prompt(prompt, function(props) {
      if(props.otherClass == true) {
        this._askClasses();
      } else {
        done();
      }
    }.bind(this));

  },
  _askClasses: function(){
    var done = this.async();
    // Have Yeoman greet the user.
    var prompts = [{
      type: 'input',
      name: 'className',
      message:'What is your className ?',
    },
    ];

    this.prompt(prompts, function (props) {
      if(props.className != "") {
        this.classes.push(_s.classify(props.className));
        this._askForClass();
      } else {
        done();
      }
    }.bind(this));
  },

  writing: function () {
    this.log(this.classes);
    // Copy modulename.php
    this.fs.copyTpl(
      this.templatePath('modulename.php'),
      this.destinationPath('src/'+this.modulenameLower+'.php'),
      {moduleName : this.ModuleNameClass,
        props: this.props,
        modulenameLower: this.modulenameLower,
        classes : this.classes}
    );
    if(this.props.createClass) {
      for (var i = 0; i < this.classes.length; i++) {
        this.fs.copyTpl(
          this.templatePath('classes/ModuleNameEntity.php'),
          this.destinationPath('src/classes/'+_s.classify(this.classes[i])+'.php'),
          {
            entityName : _s.classify(this.classes[i]),
            entityNameUnderscored: _s.underscored(this.classes[i])
          }
        );
      }
    }

  },

  install: function () {
    this.installDependencies();
  }
});
