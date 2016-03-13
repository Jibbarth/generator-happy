<?php
/**
 *
 */

/**
 * Class <%= moduleName %>
 */
class <%= moduleName %> extends Module
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->name = '<%= modulenameLower %>';

        $this->version = '1.0.0';
        $this->author = '<%= props.author %>';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('<%= props.moduleName %>');
        $this->description = $this->l('<%= props.moduleDesc %>');

        $this->confirmUninstall = $this->l(
            'Are you sure you want to uninstall? You will lose all your settings.'
        );
<% if (props.createClass) { %>
        require_once('classes/ModuleNameEntity.php');
<% } %>
    }

    /**
     * Install the module.
     *
     * @return bool
     */
    public function install()
    {
        $bReturn = parent::install();
        $bReturn = $bReturn && ModuleNameEntity::install();
        $bReturn = $bReturn && $this->installModuleTab(
            'AdminModulename',
            array(
                1 => 'Module Name - Tab Title',
            ),
            10
        );

        return $bReturn;
    }

    /**
     * Uninstall the module.
     *
     * @return mixed
     */
    public function uninstall()
    {
        $bReturn = parent::uninstall();
        $bReturn = $bReturn && ModuleNameEntity::uninstall();
        $bReturn = $bReturn && $this->uninstallModuleTab('AdminModulename');

        return $bReturn;
    }

    /**
     * Load the configuration form.
     *
     * @return string
     */
    public function getContent()
    {
        // Process sent data.
        $this->postProcess();

        // Add CSS and JS (required for Ajax processing)
        $this->context->controller->addJS($this->_path . '/js/back.js');
        $this->context->controller->addCSS($this->_path . '/css/animation.css');
        $this->context->controller->addCSS($this->_path . '/css/back.css');

        // Assign variables to smarty
        $this->smarty->assign(array(
            'iShopId' => Shop::getContextShopID(),
        ));

        // Finally, display smarty template
        return $this->display(__FILE__, 'views/templates/admin/configure.tpl', $this->getCacheId());
    }

    /**
     * Save submitted data.
     */
    public function postProcess()
    {
        // If the page is called by Ajax...
        if (Tools::getValue('ajax') == '1') {
            // Process the data.
            if (count($_POST) > 0) {
                die('OK');
            } else {
                die(Tools::displayError('Received empty set'));
            }
        }
    }

    /**
     * Install an admin tab.
     *
     * @param $sTabClass
     * @param $sTabName
     * @param $iIdTabParent
     * @return bool
     */
    private function installModuleTab($sTabClass, $sTabName, $iIdTabParent)
    {
        copy(
            _PS_MODULE_DIR_ . $this->name . '/logo.png',
            _PS_IMG_DIR_ . 't/' . $sTabClass . '.png'
        );
        $oTab = new Tab();
        $oTab->name = $sTabName;
        $oTab->class_name = $sTabClass;
        $oTab->module = $this->name;
        $oTab->id_parent = $iIdTabParent;
        if (!$oTab->save()) {
            return false;
        }

        return true;
    }

    /**
     * Uninstall an admin tab.
     *
     * @param $sTabClass
     * @return bool
     */
    private function uninstallModuleTab($sTabClass)
    {
        $iIdTab = Tab::getIdFromClassName($sTabClass);
        if ($iIdTab != 0) {
            $oTab = new Tab($iIdTab);
            $oTab->delete();
            @unlink(_PS_IMG_DIR . "t/" . $sTabClass . ".png");

            return true;
        }

        return false;
    }
}
