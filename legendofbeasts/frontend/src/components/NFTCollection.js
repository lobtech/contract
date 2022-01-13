import React, { useEffect, useState } from "react";
import { Link } from "wouter";

function sum(bns) {
    return bns.reduce((x, y) => x.add(y)).toNumber();
}

function getParams(address, numOptions) {
    let accounts = [];
    let ids = [];
    for (let i = 0; i < numOptions; i++) {
        accounts.push(address);
        ids.push(i);
    }
    return [accounts, ids];
}

export function NFTCollection({ lob, dragon, egg, magicWeapon, building, selectedAddress }) {
    const [eggBalance, setEggBalance] = useState(0);
    useEffect(() => {
        async function update() {
            let params = getParams(selectedAddress, 3);
            let _balances = await egg.balanceOfBatch(...params);
            setEggBalance(sum(_balances));
        }
        update();
    }, [selectedAddress]);

    const [dragonBalance, setDragonBalance] = useState(0);
    useEffect(() => {
        async function update() {
            let _balance = await dragon.balanceOf(selectedAddress);
            setDragonBalance(_balance.toNumber());
        }
        update();
    }, [selectedAddress]);



    const [weaponBalance, setWeaponBalance] = useState(0);
    useEffect(() => {
        async function update() {
            let params = getParams(selectedAddress, 9);
            let _balances = await magicWeapon.balanceOfBatch(...params);
            setWeaponBalance(sum(_balances));
        }
        update();
    }, [selectedAddress]);

    const [buildingBalance, setBuildingBalance] = useState(0);
    useEffect(() => {
        async function update() {
            let balance = await building.balanceOf(selectedAddress);
            setBuildingBalance(balance.toNumber());
        }
        update();
    }, [selectedAddress]);

    const [lobBalance, setLobBalance] = useState(0);
    useEffect(() => {
        async function update() {
            let balance = await lob.balanceOf(selectedAddress);
            setLobBalance(balance.toNumber() / 1000000);
        }
        update();
    }, [selectedAddress]);

    return (
        <>
            <h1>NFT collections</h1>
            <ul>
                <li>Egg: {eggBalance} <Link to="/incubator">Incubator</Link></li>
                <li>Dragon: {dragonBalance}</li>
                <li>Magic Weapon: {weaponBalance}</li>
                <li>LOB: {lobBalance}</li>
                <li>Building: {buildingBalance}</li>
            </ul>
        </>
    )
}