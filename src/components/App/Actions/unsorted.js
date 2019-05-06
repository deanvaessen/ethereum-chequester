//@TODO: Pull from LocalStorage
fetchKnownBeneficiaries = () => {
    const knownBeneficiaries = [];

    this.setState( {
        knownBeneficiaries
    } );
};

function appendBeneficiary() {
    if ( !knownBeneficiaries.find( x => x.address == beneficiary ) ) {
        knownBeneficiaries.push( { address : beneficiary } );
    }

    this.setState( {
        activeBeneficiary : beneficiary,
        knownBeneficiaries : updatedBeneficiaries
    } );
}
