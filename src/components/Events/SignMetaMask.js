export default function addListeners() {
    window.addEventListener( "sign.shouldApprove", e => {
        this.setState( {
            metaMaskPromptIsAvailable : true
        } );
    } );

    window.addEventListener( "sign.hasApproved", e => {
        this.setState( {
            metaMaskPromptIsAvailable : false
        } );
    } );
}
