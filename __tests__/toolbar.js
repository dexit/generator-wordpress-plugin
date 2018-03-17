'use strict';

const _ = require('lodash');
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const writer = require('php-writer');

const subGenerator = path.basename(__filename, '.js');

const mock = require('./mock.json');

describe('SubGenerator:toolbar', () => {
  let generator;
  beforeAll((done) => {
    // Run the generator
    generator = helpers.run(path.join(__dirname, `../generators/${subGenerator}`))
      .withArguments([mock.input]);

    // Use mock values
    generator.on('ready', (generator) => {
      generator.config.set(mock.config);
      generator.config.save();
    }).on('end', done);
  });

  it('create class file in directory named like subgenerator', () => {
    assert.file([`include/${subGenerator}/class-test.php`]);
  });

  it('set the class name of the file as input plus subgenerator name', () => {
    assert.fileContent(`include/${subGenerator}/class-test.php`, `class ${mock.input}_${_.capitalize(subGenerator)}`);
  });

  it('set a protected property to hold main toolbar arguments', () => {
    assert.fileContent(`include/${subGenerator}/class-test.php`, 'protected $toolbar');
  });

  it('has child menus enabled by default', () => {
    assert.equal(generator.generator.props.hasChild, true);
  });

  it('set a protected property to hold submenus arguments', () => {
    assert.fileContent(`include/${subGenerator}/class-test.php`, 'protected $toolbarChildren');
  });

  it('create submenus array as per the childNumber property value', () => {
    assert.fileContent(`include/${subGenerator}/class-test.php`, "'id' => 'test-submenu-0'");
    assert.fileContent(`include/${subGenerator}/class-test.php`, "'parent' => 'test'");
  });
});
