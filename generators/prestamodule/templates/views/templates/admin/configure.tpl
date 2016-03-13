{if $iShopId}
    <div class="conf alert alert-success" id="confirm_message">
        {l s='Settings saved' mod='<%= modulenameLower %>'}
    </div>
    <div class="warn alert alert-danger" id="error_message">
        {l s='Failed saving settings' mod='<%= modulenameLower %>'}
    </div>

    <div id="<%= modulenameUnderscored %>_configuration" class="panel">
        <h3>
            <i class="icon-cogs"></i>
            {l s='Settings'}
        </h3>
        <form class="ajaxUpdate" method="post">
            {l s='Your module configuration goes here.' mod='<%= modulenameLower %>'}

            <br />
            <input type="submit" class="button" value="{l s='Save' mod='<%= modulenameLower %>'}" />
        </form>
    </div>
{else}
    <p class="center">
        {l s='Please select a shop first' mod='<%= modulenameLower %>'}
    </p>
{/if}
