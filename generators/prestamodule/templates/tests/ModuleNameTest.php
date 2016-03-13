<?php
/**
 *
 */

/**
 * Class <%= ModuleName%>Test
 */
class <%= ModuleName%>Test extends WebTestCase
{
    private $oModule;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('<%= ModuleName%> Tests');

        require_once(dirname(dirname(__FILE__)) . '/<%= modulenameLower %>.php');

        $this->oModule = new <%= ModuleName%>();
    }

    /**
     * Test if module is installed and enabled
     */
    public function testInstalledAndEnabled()
    {
        $this->assertTrue(Module::isInstalled($this->oModule->name));
        $this->assertTrue(Module::isEnabled($this->oModule->name));
    }
}
