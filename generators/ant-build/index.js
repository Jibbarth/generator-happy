'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var async = require('async');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();
    // Have Yeoman greet the user.
    this.log((
      '\n\nWelcome to the impeccable ' + chalk.red('generator-happy') + ' for ant build ! \n\n'
    ));

    var subTypeAnt = [
      {name:"Base Ant build", value:'default'},
      {name:"Ant build for prestashop", value:'prestashop'},
      {name:"Ant build for Symfony", value:'symfony'},
      //{name:"Ant build for Haxe project", value:'haxe'},
    ];

    var subBuildProperties = [
        {name: "Local", value :'local', checked:true},
        {name: "Preprod", value :'preprod', checked:true},
        {name: "Recette", value :'recette', checked:false},
        {name: "Prod", value :'prod', checked:true},
    ]
    var prompts = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name ?',
        default: this.appname
    },
    {
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
    },
    {
        type:'confirm',
        name: 'branchVerification',
        message:'Do you want limit your deploy task to a single branch ?',
        default: true,
    }
    ];

    this.prompt(prompts, function (props) {
      this.antType = props.antChoice;
      this.propertiesWanted = props.buildproperties;
      this.projectName = props.projectName;
      this.branchVerification = props.branchVerification;
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
    // Prompt for branchName
    if (this.branchVerification) {
        prompts.push({
            type:'input',
            name:'Branch',
            message: 'Which branch must be allowed for deploy on ' + env + '?',
            default: 'develop'
        });
    }

    if (env == 'local') {
        prompts.push({
            type:'confirm',
            name:'vmUse',
            message: 'Do you use Virtual Machine ?',
            default: true
        });
    }

    this.prompt(prompts, function (props) {
        this.buildproperties[env] = props;
        if (env == 'local') {
            this.useVm = props.vmUse;
        }
        current++;
        if(array.length == current) {
            this._ask_global_properties();
        } else {
            this._ask_build_env(array, current);
        }
    }.bind(this));
  },
  _ask_global_properties: function(){
    var done = this.async();
    this.log('\n\n Some questions about your global build.properties');

    var prompts = [
      {
        type: 'input',
        name: 'out',
        message:'What is your deploy directory ? '+ chalk.yellow('- the folder sync with your vm -'),
        default: '${basedir}/out'
      },
      {
        type: 'input',
        name: 'src',
        message:'What is your source directory ? ',
        default: '${basedir}/src'
      },
      {
        type: 'input',
        name: 'archiveFileName',
        message:'Do you have a preference to name the deployment archive ? ',
        default: 'site'
      },
      {
        type: 'confirm',
        name: 'bAntVersion',
        message:'Is your ant version is higher than the 1.9 ? ',
        default: true
      },
    ];

    this.prompt(prompts, function (props) {
        this.globalProperties = props;
        done();
    }.bind(this));
  },
  _ask_haxe:function(){
    // TODO:
    this.log("Let's go for haxe ant build");
  },
  writing: function () {
    /*this.fs.copy(
       this.templatePath('dummyfile.txt'),
       this.destinationPath('dummyfile.txt')
    );*/
    // COPY BUILD.PROPERTIES.ENV
    if(this.propertiesWanted.length > 0) {
      for (var i = 0; i < this.propertiesWanted.length; i++) {
        this.fs.copyTpl(
          this.templatePath('build.properties.env'),
          this.destinationPath('build.properties.'+this.propertiesWanted[i]),
          {
            env : this.propertiesWanted[i],
            envValue: this.buildproperties[this.propertiesWanted[i]],
            branchVerification: this.branchVerification,
          }
        );
      }
    }

    // COPY BUILD.PROPERTIES
    this.fs.copyTpl(
      this.templatePath('build.properties'),
      this.destinationPath('build.properties'),
      {
        props: this.globalProperties,
        type: this.antType,
      }
    );

    // COPY BUILD.XML
    this.fs.copyTpl(
      this.templatePath('build.xml'),
      this.destinationPath('build.xml'),
      {
        projectName: this.projectName,
        branchVerification: this.branchVerification,
        type: this.antType,
        useVm: this.useVm,
        aEnv: this.propertiesWanted,
      }
    );
    // COPY COMMON.BUILD.XML
    this.fs.copyTpl(
      this.templatePath('common.build.xml'),
      this.destinationPath('common.build.xml'),
      {
        branchVerification: this.branchVerification,
        type: this.antType,
      }
    );
  },

  install: function () {
    //this.installDependencies();
  }
});
