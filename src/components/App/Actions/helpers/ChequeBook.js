export function getBalanceOfChequeBook( address, chequeBooks ) {
    address = address.toLowerCase(); // EtherScan and web3 sometimes give different cases

    return chequeBooks.find( chequeBook => chequeBook.address == address )?.balance;
}
