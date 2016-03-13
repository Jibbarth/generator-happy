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

      done();
    }.bind(this));
  },

  writing: function () {
    /*this.mkdir('src');
    this.mkdir('src/classes');
    this.mkdir('src/controllers');
    this.mkdir('src/controllers/admin');
    this.mkdir('src/controllers/front');
    this.mkdir('src/css');
    this.mkdir('src/js');
    this.mkdir('src/test');
    this.mkdir('src/views');
    this.mkdir('src/views/templates');
    this.mkdir('src/views/templates/admin');*/
    // Copy modulename.php
    this.fs.copyTpl(
      this.templatePath('modulename.php'),
      this.destinationPath('src/'+this.modulenameLower+'.php'),
      {moduleName : this.ModuleNameClass,
        props: this.props,
        modulenameLower: this.modulenameLower}
    );

  },

  install: function () {
    this.installDependencies();
  }
});
