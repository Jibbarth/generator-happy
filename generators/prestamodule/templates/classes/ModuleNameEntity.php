<?php
/**
 *
 */

/**
 * Class <%= entityName%>
 */
class <%= entityName %> extends ObjectModel
{
    public $name;
    public $id_shop;
    public $date_add;
    public $date_upd;

    public static $definition = array(
        'table' => '<%= entityNameUnderscored %>',
        'primary' => 'id_<%= entityNameUnderscored %>',
        'multilang' => false,
        'fields' => array(
            'name' => array(
                'type' => self::TYPE_STRING,
                'validate' => 'isString',
                'size' => 255,
            ),
            'id_shop' => array(
                'type' => self::TYPE_INT,
                'validate' => 'isUnsignedId',
            ),
            'date_add' => array(
                'type' => self::TYPE_DATE,
                'validate' => 'isDateFormat',
            ),
            'date_upd' => array(
                'type' => self::TYPE_DATE,
                'validate' => 'isDateFormat',
            ),
        ),
    );

    /**
     * Get the table name.
     *
     * @return string
     */
    public static function getTableName()
    {
        return _DB_PREFIX_ . self::$definition['table'];
    }

    public static function install()
    {
        $bReturn = true;
        $aSql = array();

        $aSql[] = '
            CREATE TABLE IF NOT EXISTS `' . self::getTableName() . '` (
                `' . self::$definition['primary'] . '` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `name` varchar(255) NOT NULL,
                `id_shop` int(11) unsigned NOT NULL,
                `date_add` datetime NOT NULL,
                `date_upd` datetime NOT NULL,
                PRIMARY KEY (`' . self::$definition['primary'] . '`, `id_shop`)
            ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8;
        ';

        foreach ($aSql as $sQuery) {
            if (Db::getInstance()->execute($sQuery) == false) {
                $bReturn = false;
            }
        }

        return $bReturn;
    }

    public static function uninstall()
    {
        $bReturn = true;
        $aSql = array();

        $aSql[] = '
            DROP TABLE IF EXISTS `' . self::getTableName() . '`;
        ';

        foreach ($aSql as $sQuery) {
            if (Db::getInstance()->execute($sQuery) == false) {
                $bReturn = false;
            }
        }

        return $bReturn;
    }

    /**
     * Check whether an entity exists or not.
     *
     * @param integer $iId
     * @param integer $iIdShop
     * @return bool
     */
    public static function exists($iId, $iIdShop)
    {
        return Db::getInstance(_PS_USE_SQL_SLAVE_)->getValue('
            SELECT COUNT(*)
            FROM ' . self::getTableName() . '
            WHERE ' . self::$definition['primary'] . '=' . $iId . '
            AND id_shop=' . $iIdShop . '
        ') > 0;
    }

    /**
     * Get all the entities.
     *
     * @param bool $bJustIds
     * @param integer|null $iExcept
     * @return array
     */
    public static function getAll($bJustIds = false, $iExcept = null)
    {
        $aIds = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS('
            SELECT ' . self::$definition['primary'] . '
            FROM ' . self::getTableName() . '
            WHERE ' . (Shop::getContextShopID() ? 'id_shop=' . Shop::getContextShopID() : '1') . '
            ' . ($iExcept != null ? ' AND ' . self::$definition['primary'] . ' != ' . $iExcept : '') . '
        ');
        $aEntities = array();

        foreach ($aIds as $aId) {
            if ($bJustIds) {
                $aEntities[] = $aId[self::$definition['primary']];
            } else {
                $aEntities[] = new <%= entityName %>($aId[self::$definition['primary']]);
            }
        }

        return $aEntities;
    }
}
