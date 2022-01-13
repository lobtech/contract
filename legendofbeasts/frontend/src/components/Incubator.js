import React, { useEffect, useState } from "react";

import { Hatching } from "./Hatching";

export function Incubator({ egg, hegg, startHatching, selectedAddress }) {
    let [options, setOptions] = useState([]);
    useEffect(() => {
        async function update() {
            let accounts = [selectedAddress, selectedAddress, selectedAddress];
            let ids = [0, 1, 2];
            let balances = await egg.balanceOfBatch(accounts, ids);
            setOptions(balances.map(x => x.toNumber()));
        }
        update();
    }, [selectedAddress, egg]);

    let [hatchingOptions, setHatchingOptions] = useState([]);
    useEffect(() => {
        async function update() {
            let accounts = [selectedAddress, selectedAddress, selectedAddress];
            let ids = [0, 1, 2];
            let balances = await hegg.balanceOfBatch(accounts, ids);
            setHatchingOptions(balances.map(x => x.toNumber()));
        }
        update();
    }, [selectedAddress, hegg]);



    return (
        <>
            <h4>Eggs</h4>
            <ul>
                {options.map((amount, option) => {
                    return (
                        <li key={option}>
                            <div>Egg Option {option}: {amount}</div>
                            {
                                amount > 0 && (
                                    <button onClick={() => startHatching(option)}>Start hatching</button>
                                )
                            }
                        </li>
                    );
                })}
            </ul>
            <h4>Hatching eggs:</h4>
            {hatchingOptions.map((amount, option) => amount > 0 && <Hatching selectedAddress={selectedAddress} hegg={hegg} key={option} option={option} />)}
        </>
    )
}
