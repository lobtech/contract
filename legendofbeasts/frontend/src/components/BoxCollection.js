import React, { useEffect, useState } from "react";

export function BoxCollection({ lootbox, selectedAddress }) {
    const [balances, setBalances] = useState([0, 0, 0, 0, 0, 0, 0]);
    useEffect(() => {
        async function update() {
            let accounts = [];
            let ids = [];
            for (let i = 0; i < 7; i++) {
                accounts.push(selectedAddress);
                ids.push(i);
            }
            let _balances = await lootbox.balanceOfBatch(accounts, ids);
            setBalances(_balances.map(x => x.toNumber()));
        }
        update();
    }, [selectedAddress]);
    return (
        <>
            <h1>My Collection</h1>
            <ul>
                <li>S BOX {balances[0]}</li>
                <li>SS BOX {balances[1]}</li>
                <li>SSS BOX {balances[2]}</li>
                <li>Gold BOX {balances[3]}</li>
                <li>Diamond BOX {balances[4]}</li>
                <li>Normal BOX 1 {balances[5]}</li>
                <li>Normal BOX 2 {balances[6]}</li>
            </ul>
        </>
    );
}