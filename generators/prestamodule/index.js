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
      'Welcome to the wonderfull ' + chalk.red('generator-happy') + ' generator for prestashop modules !'
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
      type:'confirm',
      name:'adminModuleControllerRequired',
      message: 'Do you want an Admin module controller ?',
      default: true,
    },
    {
      type:'confirm',
      name:'testRequired',
      message: 'Do you plan to make test with TestSuite ? '+ chalk.yellow('(you should do...)'),
      default: true,
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
      this.modulenameCapitalized = _s.capitalize(this.modulenameLower);
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
    // Copy config.xml
    this.fs.copyTpl(
      this.templatePath('config.xml'),
      this.destinationPath('src/config.xml'),
      {
        props: this.props,
        modulenameLower: this.modulenameLower,
      }
    );
    // Create classes
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

    // Create adminModuleController
    if(this.props.adminModuleControllerRequired) {
      this.fs.copyTpl(
        this.templatePath('controllers/admin/AdminModulenameController.php'),
        this.destinationPath('src/controllers/admin/Admin'+this.modulenameCapitalized+'.php'),
        {moduleNameCapitalized: this.modulenameCapitalized}
      );
      this.fs.copyTpl(
        this.templatePath('views'),
        this.destinationPath('src/views'),
        {
          modulenameLower : this.modulenameLower,
          modulenameUnderscored: _s.underscored(this.ModuleNameClass),
        }
      );
    }

    // Copy css
    this.fs.copy(this.templatePath('css'), this.destinationPath('src/css'));
    // Copy js
    this.fs.copy(this.templatePath('js'), this.destinationPath('src/js'));

    // copy Test
    if (this.props.testRequired) {
      this.fs.copyTpl(
        this.templatePath('tests/ModuleNameTest.php'),
        this.destinationPath('src/tests/'+this.ModuleNameClass+'Test.php'),
        {
          ModuleName: this.ModuleNameClass,
          modulenameLower: this.modulenameLower,
        }
      );
    }

    // copy assets
    this.fs.copy(this.templatePath('logo.gif'), this.destinationPath('src/logo.gif'));
    this.fs.copy(this.templatePath('logo.png'), this.destinationPath('src/logo.png'));
    this.fs.copy(this.templatePath('index.php'), this.destinationPath('src/index.php'));

  },

  install: function () {
    //this.installDependencies();
    // no dependencies yet for a base prestamodule
  }
});
