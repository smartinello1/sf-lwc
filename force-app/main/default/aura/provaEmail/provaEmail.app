<aura:application implements="flexipage:availableForAllPageTypes,force:hasRecordId" extends="force:slds">
    <aura:attribute name="url" type="String"/>
    <aura:attribute name="url2" type="String"/>
    <aura:attribute name="pageReference" type="Object"/>
    <aura:handler name="init" value="{! this }" action="{! c.init }"/>
    <lightning:card title="Test Lightning Card" iconName="utility:down">
        <table>
            <td style="padding-left:35px;">
                <tr><a href="{!v.url}">User Clone</a></tr>
            </td>
            <td style="padding-left:35px;">
                <tr><a href="{!v.url2}">Genera Codice</a></tr>
            </td>
        </table>
        <aura:set attribute="footer">
            <table>
                <td style="padding-left:20px;">
                    Footer Area
                </td>
            </table>
        </aura:set>
    </lightning:card>
	<c:CloneUser/>
	<c:GeneraCodice/>
</aura:application>