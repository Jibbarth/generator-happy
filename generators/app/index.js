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
    //
    this.log(chalk.green('           \n        ###    \n      #######  \n     ######### \n     ## ### ## \n    ### ### ###\n    ### ### ###\n    ###########\n      #######  \n        ####   \n               \n    '));

    var subgeneratorList = [
      {name:"An awesome prestashop module", value:'prestamodule'},
      {name:"Construct an awesome build.xml for ant tasks", value:'ant-build'},
      {name:"Start a new prestashop project "+ chalk.yellow('- this is not yet available, submit a PR -'), value:'prestasite'},
    ];
    var prompts = [{
      type: 'list',
      name: 'subgenerator',
      message:'What do you want to do ?',
      default: 0,
      choices: subgeneratorList,
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      // To access props later use this.props.moduleName;
      done();
    }.bind(this));
  },
  main: function(){
    this.log(this.props.subgenerator);
    this.composeWith("happy:"+this.props.subgenerator, {
      options: {
        nested: true,
        appName: this.appName
      }
    }, {
      local: require.resolve("./../"+this.props.subgenerator)
    });
  },
  install: function () {
    //this.installDependencies();
    //
    //On this switcher, no dependencies required.
  }
});
