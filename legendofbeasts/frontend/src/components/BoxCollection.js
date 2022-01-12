import React, { useEffect, useState } from "react";

export function BoxCollection({ lob, lootbox, selectedAddress }) {
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

    async function _openBox(option) {
        await lob.approve(lootbox.address, 1000000);
        await lootbox.unpack(option, 1);
    }

    const boxTypes = ["S", "SS", "SSS", "Gold", "Diamond", "Normal", "Normal+"];
    return (
        <>
            <h1>My Collection</h1>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <td>Type</td>
                        <td>Amount</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {boxTypes.map((t, i) => {
                        return (
                            <tr key={i}>
                                <td><span className="badge bg-primary text-light">{t}</span></td>
                                <td>{balances[i]}</td>
                                <td><a className="btn btn-success" onClick={() => _openBox(i)}>Open</a></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    );
}